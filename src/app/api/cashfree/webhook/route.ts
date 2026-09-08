import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree'
import { getPackPriceDetails } from '@/lib/pricing'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendInvoiceEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-webhook-signature') || ''
    const timestamp = request.headers.get('x-webhook-timestamp') || ''
    const rawBody = await request.text()

    if (!rawBody) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 })
    }

    // 1. Cryptographic Signature Verification
    const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp)
    if (!isValid) {
      console.error('[CASHFREE_WEBHOOK_UNAUTHORIZED]', {
        hasSignature: !!signature,
        hasTimestamp: !!timestamp
      })
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    // 2. Parse Event Payload
    const payload = JSON.parse(rawBody)
    const eventType = payload.type || ''
    const eventData = payload.data || {}
    const orderData = eventData.order || {}
    const paymentData = eventData.payment || {}
    const customerData = eventData.customer_details || {}

    const orderId = orderData.order_id || eventData.order_id
    const paymentStatus = paymentData.payment_status || orderData.order_status
    const cfPaymentId = paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : `CF_${orderId}`

    console.log('[CASHFREE_WEBHOOK_RECEIVED]', {
      eventType,
      orderId,
      paymentStatus,
      cfPaymentId
    })

    if (!orderId) {
      return NextResponse.json({ status: 'ignored', message: 'No order_id in webhook' }, { status: 200 })
    }

    const admin = getAdminClient()

    // Handle payment success events
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentStatus === 'SUCCESS') {
      // Check if order session exists
      const { data: session } = await admin
        .from('order_sessions')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle()

      if (!session) {
        console.warn('[CASHFREE_WEBHOOK_SESSION_NOT_FOUND]', { orderId })
        return NextResponse.json({ status: 'ok', message: 'No local session to fulfill' }, { status: 200 })
      }

      // Check if already completed in session
      if (session.status === 'COMPLETED') {
        return NextResponse.json({ status: 'ok', message: 'Already fulfilled' }, { status: 200 })
      }

      // Check replay attack / idempotency against user_vault
      const { data: existingVault } = await admin
        .from('user_vault')
        .select('id')
        .or(`razorpay_order_id.eq.${orderId},razorpay_payment_id.eq.${cfPaymentId}`)
        .limit(1)

      if (existingVault && existingVault.length > 0) {
        await admin
          .from('order_sessions')
          .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
          .eq('order_id', orderId)

        return NextResponse.json({ status: 'ok', message: 'Vault already updated' }, { status: 200 })
      }

      const items = Array.isArray(session.items) ? session.items : []
      const targetUserId = session.user_id
      const couponCode = session.coupon_code

      if (items.length === 0 || !targetUserId) {
        return NextResponse.json({ status: 'ok', message: 'Incomplete session data' }, { status: 200 })
      }

      // Zero-trust price verification from DB
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
        return NextResponse.json({ status: 'ok', message: 'Items not found in DB' }, { status: 200 })
      }

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

      // Add to user vault with distributed item pricing
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
          razorpay_order_id: orderId,
          razorpay_payment_id: cfPaymentId
        }
      })

      const { error: vaultError } = await admin
        .from('user_vault')
        .insert(vaultEntries)

      if (vaultError && vaultError.code !== '23505') {
        console.error('[CASHFREE_WEBHOOK_VAULT_ERROR]', vaultError)
      }

      // Mark session as COMPLETED
      await admin
        .from('order_sessions')
        .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
        .eq('order_id', orderId)

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
            order_id: orderId,
            discount_amount: couponDiscountAmount
          })
        }
      }

      // Invoice Generation & Customer Email
      try {
        const { data: userAuth } = await admin.auth.admin.getUserById(targetUserId)
        const user = userAuth?.user
        const customerEmail =
          user?.email ||
          customerData.customer_email ||
          session.billing_details?.email

        if (customerEmail) {
          const invoiceItems = items.map((item: any) => {
            const dbItem = allPurchasedItems.find(p => p.id === item.id)
            const vaultEntry = vaultEntries.find((v: any) => v.item_id === item.id)
            return {
              name: dbItem?.name || 'Unknown Item',
              price: vaultEntry ? vaultEntry.amount : (dbItem?.price_inr || 0),
              isPreorder: item.type === 'pack' && !dbItem?.full_pack_download_url
            }
          })

          const hasPreorder = invoiceItems.some(i => i.isPreorder)
          const userName =
            session.billing_details?.fullName ||
            customerData.customer_name ||
            user?.user_metadata?.full_name ||
            customerEmail.split('@')[0] ||
            'Creator'

          const userAddress = session.billing_details
            ? `${session.billing_details.address || ''}, ${session.billing_details.city || ''}, ${session.billing_details.state || ''} - ${session.billing_details.pincode || session.billing_details.zip || ''}`
            : undefined

          const pdfBuffer = await generateInvoicePDF({
            orderId: orderId,
            paymentId: cfPaymentId,
            userName,
            userEmail: customerEmail,
            userAddress,
            items: invoiceItems,
            total: serverVerifiedTotal,
            date: new Date().toLocaleDateString()
          })

          await sendInvoiceEmail({
            email: customerEmail,
            pdfBuffer,
            orderId: orderId,
            packNames: invoiceItems.map(i => i.name),
            userName,
            total: serverVerifiedTotal,
            items: invoiceItems,
            isPreorder: hasPreorder
          })
        }
      } catch (invoiceErr) {
        console.error('[CASHFREE_WEBHOOK_INVOICE_ERROR]', invoiceErr)
      }

      return NextResponse.json({ status: 'ok', message: 'Order processed successfully' }, { status: 200 })
    }

    if (eventType === 'PAYMENT_FAILED_WEBHOOK' || paymentStatus === 'FAILED') {
      await admin
        .from('order_sessions')
        .update({ status: 'FAILED', updated_at: new Date().toISOString() })
        .eq('order_id', orderId)

      return NextResponse.json({ status: 'ok', message: 'Payment failure recorded' }, { status: 200 })
    }

    if (eventType === 'PAYMENT_USER_DROPPED_WEBHOOK' || paymentStatus === 'USER_DROPPED') {
      await admin
        .from('order_sessions')
        .update({ status: 'USER_DROPPED', updated_at: new Date().toISOString() })
        .eq('order_id', orderId)

      return NextResponse.json({ status: 'ok', message: 'User drop recorded' }, { status: 200 })
    }

    return NextResponse.json({ status: 'ok', message: 'Event acknowledged' }, { status: 200 })
  } catch (error: any) {
    console.error('[CASHFREE_WEBHOOK_ERROR]', error)
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 })
  }
}

// Health check endpoint for Cashfree webhook test ping
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/cashfree/webhook',
    gateway: 'Cashfree v2023-08-01'
  })
}
