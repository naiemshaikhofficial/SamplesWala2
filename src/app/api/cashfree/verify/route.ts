import { NextResponse, after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendInvoiceEmail } from '@/lib/emails'
import { getPackPriceDetails } from '@/lib/pricing'
import { getCashfreeOrder, getCashfreeOrderPayments } from '@/lib/cashfree'
import { validateBillingDetails } from '@/lib/checkoutValidation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      order_id,
      items, // array of {id, type}
      userId,
      billingDetails,
      couponCode
    } = body

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id for Cashfree verification' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 })
    }

    // 0. SECURITY HARDENING: Session Cookie User Authentication
    const supabase = await createClient()
    const { data: { user: sessionUser } } = await supabase.auth.getUser()

    if (!sessionUser) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }
    const targetUserId = sessionUser.id

    const admin = getAdminClient()

    // 1. DIRECT CASHFREE SERVER-TO-SERVER VERIFICATION (Single Fast Network Call)
    const cashfreeOrder = await getCashfreeOrder(order_id)

    let isPaid = cashfreeOrder.order_status === 'PAID'
    let finalPaymentId = cashfreeOrder.cf_order_id ? `CF_${cashfreeOrder.cf_order_id}` : `CF_PAY_${order_id}`

    // Only make a 2nd network call if status isn't marked PAID yet (saves 600-800ms)
    if (!isPaid) {
      const payments = await getCashfreeOrderPayments(order_id)
      const successPayment = payments.find(p => p.payment_status === 'SUCCESS')
      if (successPayment) {
        isPaid = true
        finalPaymentId = String(successPayment.cf_payment_id)
      }
    }

    if (!isPaid) {
      console.warn('[CASHFREE_UNPAID_ORDER]', { order_id, status: cashfreeOrder.order_status })
      return NextResponse.json(
        { error: `Payment is not completed (Status: ${cashfreeOrder.order_status})` },
        { status: 400 }
      )
    }

    // 1.1 CROSS-USER ORDER THEFT DEFENSE: Verify order was initiated by this user
    const expectedCustomerId = targetUserId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50)
    const orderCustomerId = cashfreeOrder.customer_details?.customer_id
    if (orderCustomerId && orderCustomerId !== expectedCustomerId) {
      console.error('[SECURITY_ALERT] Order customer mismatch:', {
        expectedCustomerId,
        orderCustomerId,
        order_id
      })
      return NextResponse.json({ error: 'Unauthorized payment verification attempt' }, { status: 403 })
    }

    // 2. REPLAY ATTACK DEFENSE: Check if this order or payment has already been credited
    const { data: existingEntry } = await admin
      .from('user_vault')
      .select('id')
      .or(`razorpay_order_id.eq.${order_id},razorpay_payment_id.eq.${finalPaymentId}`)
      .limit(1)

    if (existingEntry && existingEntry.length > 0) {
      return NextResponse.json({ success: true, alreadyProcessed: true })
    }

    // 3. ZERO-TRUST PRICE VERIFICATION FROM DB
    const packIds = items.filter((i: any) => i.type === 'pack').map((i: any) => i.id)
    const presetIds = items.filter((i: any) => i.type === 'preset').map((i: any) => i.id)

    const [packsRes, presetsRes] = await Promise.all([
      packIds.length > 0
        ? admin.from('sample_packs').select('id, name, price_inr, created_at, full_pack_download_url').in('id', packIds)
        : { data: [] },
      presetIds.length > 0
        ? admin.from('presets').select('id, name, price_inr').in('id', presetIds)
        : { data: [] }
    ])

    const resolvedPacks = (packsRes.data || []).map((pack: any) => {
      const priceDetails = getPackPriceDetails(pack)
      return {
        ...pack,
        price_inr: priceDetails.priceInr
      }
    })

    const allPurchasedItems = [...resolvedPacks, ...(presetsRes.data || [])]

    if (allPurchasedItems.length === 0) {
      return NextResponse.json({ error: 'Failed to verify items in database' }, { status: 500 })
    }

    // Subtotal, bundle discount, and coupon verification
    const rawSubtotal = allPurchasedItems.reduce((acc, item) => acc + Number(item.price_inr || 0), 0)
    const hasFreeItem = allPurchasedItems.some(item => Number(item.price_inr || 0) === 0)
    const paidItems = allPurchasedItems.filter(item => Number(item.price_inr || 0) > 0)
    const bundleDiscountAmount = (!hasFreeItem && paidItems.length >= 3) ? Math.round(rawSubtotal * 0.1) : 0
    const subtotalAfterBundle = rawSubtotal - bundleDiscountAmount

    let couponDiscountAmount = 0
    let couponDiscountPercent = 0
    let applicableItems: string[] | null = null

    if (couponCode && !hasFreeItem) {
      const cleanCoupon = String(couponCode).toUpperCase().trim()
      const { data: coupon } = await admin
        .from('coupons')
        .select('*')
        .eq('code', cleanCoupon)
        .eq('is_active', true)
        .maybeSingle()

      if (coupon) {
        couponDiscountPercent = coupon.discount_percent || 0
        applicableItems = coupon.applicable_items || null

        if (applicableItems && applicableItems.length > 0) {
          const applicableTotal = allPurchasedItems.reduce((sum, item) => {
            if (applicableItems!.includes(item.id)) {
              return sum + Number(item.price_inr || 0)
            }
            return sum
          }, 0)
          couponDiscountAmount = Math.round((applicableTotal * couponDiscountPercent) / 100)
        } else {
          couponDiscountAmount = Math.round((rawSubtotal * couponDiscountPercent) / 100)
        }
      }
    }

    const serverVerifiedTotal = Math.max(0, subtotalAfterBundle - couponDiscountAmount)

    // Security check: Amount paid must match server-calculated total within Rs 1
    if (Math.abs(cashfreeOrder.order_amount - serverVerifiedTotal) > 1.5) {
      console.error('[SECURITY_ALERT] Cashfree amount mismatch:', {
        cashfreeAmount: cashfreeOrder.order_amount,
        serverVerifiedTotal,
        targetUserId,
        order_id
      })
      return NextResponse.json({ error: 'Payment amount mismatch verification error' }, { status: 400 })
    }

    // 4. ADD TO USER VAULT (With distributed item prices)
    let calculatedSum = 0
    const vaultEntries = items.map((item: any, index: number) => {
      const dbItem = allPurchasedItems.find(p => p.id === item.id)
      const basePrice = Number(dbItem?.price_inr || 0)
      const itemBundleDiscount = (!hasFreeItem && paidItems.length >= 3) ? Math.round(basePrice * 0.1) : 0

      let itemCouponDiscount = 0
      if (!hasFreeItem && couponDiscountPercent > 0) {
        const isApplicable =
          !applicableItems || applicableItems.length === 0 || applicableItems.includes(item.id)
        if (isApplicable) {
          itemCouponDiscount = Math.round((basePrice * couponDiscountPercent) / 100)
        }
      }

      let finalPrice = Math.max(0, basePrice - itemBundleDiscount - itemCouponDiscount)

      // Distribute rounding discrepancies to the last item
      if (index === items.length - 1) {
        finalPrice = Math.max(0, serverVerifiedTotal - calculatedSum)
      } else {
        calculatedSum += finalPrice
      }

      return {
        user_id: targetUserId,
        item_id: item.id,
        item_type: item.type,
        item_name: dbItem?.name || 'Unknown Item',
        amount: finalPrice,
        razorpay_order_id: order_id,
        razorpay_payment_id: finalPaymentId
      }
    })

    const { error: vaultError } = await admin
      .from('user_vault')
      .insert(vaultEntries)

    if (vaultError) {
      if (vaultError.code !== '23505') {
        console.error('[CASHFREE_VAULT_ERROR]', vaultError)
        return NextResponse.json({ error: 'Failed to update library' }, { status: 500 })
      }
    }

    // Mark session as completed
    try {
      await admin
        .from('order_sessions')
        .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
        .eq('order_id', order_id)
    } catch {}

    // 5. ASYNC BACKGROUND TASKS (Runs after response is delivered to user: ZERO UI LAG!)
    after(async () => {
      try {
        // Record coupon usage
        if (couponCode) {
          const cleanCoupon = String(couponCode).toUpperCase().trim()
          const { data: coupon } = await admin
            .from('coupons')
            .select('id')
            .eq('code', cleanCoupon)
            .eq('is_active', true)
            .maybeSingle()

          if (coupon) {
            await admin.from('coupon_usages').insert({
              coupon_id: coupon.id,
              user_id: targetUserId,
              order_id: order_id
            })
          }
        }

        // Update billing details in user account
        if (billingDetails) {
          const billingCheck = validateBillingDetails(billingDetails)
          const cleanDetails = billingCheck.isValid ? billingCheck.sanitized : billingDetails
          const { error: accountError } = await admin.from('user_accounts').upsert({
            user_id: targetUserId,
            full_name: cleanDetails.fullName,
            phone_number: cleanDetails.phone,
            address_line1: cleanDetails.address,
            city: cleanDetails.city,
            state: cleanDetails.state,
            postal_code: cleanDetails.zip,
            country: cleanDetails.country,
            updated_at: new Date().toISOString()
          })

          if (accountError) {
            console.error('[CASHFREE_ACCOUNT_UPDATE_ERROR]', accountError)
          }
        }

        // PDF Invoice Generation & Confirmation Email
        const { data: { user } } = await admin.auth.admin.getUserById(targetUserId)

        if (user && user.email) {
          const invoiceItems = items.map((item: any) => {
            const dbItem = allPurchasedItems.find(p => p.id === item.id)
            const vaultEntry = vaultEntries.find((v: any) => v.item_id === item.id)
            return {
              name: dbItem?.name || 'Unknown Item',
              price: vaultEntry ? vaultEntry.amount : (dbItem?.price_inr || 0),
              isPreorder: item.type === 'pack' && !dbItem?.full_pack_download_url
            }
          })

          const total = serverVerifiedTotal
          const hasPreorder = invoiceItems.some(i => i.isPreorder)

          const userAddress = billingDetails
            ? `${billingDetails.address}, ${billingDetails.city}, ${billingDetails.state} - ${billingDetails.zip}`
            : undefined

          const pdfBuffer = await generateInvoicePDF({
            orderId: order_id,
            paymentId: finalPaymentId,
            userName:
              user.user_metadata?.full_name ||
              billingDetails?.fullName ||
              user.email.split('@')[0],
            userEmail: user.email,
            userAddress: userAddress,
            items: invoiceItems,
            total: total,
            date: new Date().toLocaleDateString()
          })

          await sendInvoiceEmail({
            email: user.email,
            pdfBuffer,
            orderId: order_id,
            packNames: invoiceItems.map(i => i.name),
            userName:
              user.user_metadata?.full_name ||
              billingDetails?.fullName ||
              user.email.split('@')[0],
            total: total,
            items: invoiceItems,
            isPreorder: hasPreorder
          })
        }
      } catch (bgErr) {
        console.error('[CASHFREE_ASYNC_BACKGROUND_ERROR]', bgErr)
      }
    })

    return NextResponse.json({ success: true, orderId: order_id })
  } catch (error: any) {
    console.error('[CASHFREE_VERIFY_ERROR]', error)
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 })
  }
}
