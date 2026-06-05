import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendInvoiceEmail } from '@/lib/emails'
import { getPackPriceDetails } from '@/lib/pricing'

async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('PayPal client credentials are not configured.')
  }
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const isSandbox = !clientId.startsWith('A') || process.env.NODE_ENV !== 'production'
  const baseUrl = isSandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to retrieve PayPal access token: ${errorText}`)
  }

  const data = await response.json()
  return { token: data.access_token, baseUrl }
}

export async function POST(request: Request) {
  try {
    const { orderId, billingDetails } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    // 1. Authenticate with PayPal and Capture Order
    const { token, baseUrl } = await getPayPalAccessToken()

    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text()
      console.error('[PAYPAL_CAPTURE_API_ERROR]', errorText)
      return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 500 })
    }

    const orderData = await captureResponse.json()

    if (orderData.status !== 'COMPLETED') {
      return NextResponse.json({ error: `Order status is ${orderData.status}` }, { status: 400 })
    }

    const capture = orderData.purchase_units?.[0]?.payments?.captures?.[0]
    const customIdRaw = capture?.custom_id || orderData.purchase_units?.[0]?.custom_id

    if (!customIdRaw) {
      return NextResponse.json({ error: 'Custom metadata not found in PayPal order' }, { status: 400 })
    }

    let customData
    try {
      customData = JSON.parse(customIdRaw)
    } catch (e) {
      console.error('[PAYPAL_PARSE_CUSTOM_ID_ERROR]', e)
      return NextResponse.json({ error: 'Invalid order metadata' }, { status: 400 })
    }

    const { userId, items, couponCode, discountPercent } = customData

    // 2. Billing Country Check (Final Guard)
    const billingCountry = orderData.payer?.address?.country_code || billingDetails?.country
    if (billingCountry?.toUpperCase() === 'IN') {
      return NextResponse.json({ 
        error: 'Indian billing addresses are not accepted for PayPal USD checkouts. Please use UPI/Razorpay in INR.' 
      }, { status: 400 })
    }

    // 3. Fetch items to verify prices and create library entries
    const admin = getAdminClient()
    const packIds = items.filter((i: any) => i.type === 'pack').map((i: any) => i.id)
    const presetIds = items.filter((i: any) => i.type === 'preset').map((i: any) => i.id)

    const [packsRes, presetsRes] = await Promise.all([
      packIds.length > 0 ? admin.from('sample_packs').select('id, name, price_inr, price_usd, created_at, full_pack_download_url').in('id', packIds) : { data: [] },
      presetIds.length > 0 ? admin.from('presets').select('id, name, price_inr').in('id', presetIds) : { data: [] }
    ])

    // Securely calculate dynamic USD prices for packs
    const resolvedPacks = (packsRes.data || []).map((pack: any) => {
      const priceDetails = getPackPriceDetails(pack)
      return {
        ...pack,
        price_usd: pack.price_usd ? Number(pack.price_usd) : Math.round(priceDetails.priceInr / 80)
      }
    })

    // Securely calculate dynamic USD prices for presets
    const resolvedPresets = (presetsRes.data || []).map((preset: any) => {
      return {
        ...preset,
        price_usd: preset.price_inr === 0 ? 0 : Math.round((Number(preset.price_inr) / 80) * 100) / 100 || 2.99
      }
    })

    const allPurchasedItems = [...resolvedPacks, ...resolvedPresets]

    if (allPurchasedItems.length === 0) {
      return NextResponse.json({ error: 'Failed to verify item details' }, { status: 500 })
    }

    // Calculate subtotal, bundle discount, and coupon discount in USD
    const rawSubtotalUsd = allPurchasedItems.reduce((acc, item) => acc + Number(item.price_usd || 0), 0)
    const bundleDiscountAmount = items.length >= 3 ? Number((rawSubtotalUsd * 0.1).toFixed(2)) : 0
    const subtotalAfterBundle = rawSubtotalUsd - bundleDiscountAmount

    let couponDiscountAmount = 0
    let applicableItems: string[] | null = null

    if (couponCode) {
      const cleanCoupon = String(couponCode).toUpperCase().trim()
      const { data: coupon } = await admin
        .from('coupons')
        .select('*')
        .eq('code', cleanCoupon)
        .eq('is_active', true)
        .maybeSingle()

      if (coupon) {
        const couponDiscountPercent = coupon.discount_percent || 0
        applicableItems = coupon.applicable_items || null

        if (applicableItems && applicableItems.length > 0) {
          const applicableTotal = allPurchasedItems.reduce((sum, item) => {
            if (applicableItems!.includes(item.id)) {
              return sum + Number(item.price_usd || 0)
            }
            return sum
          }, 0)
          couponDiscountAmount = Number((applicableTotal * couponDiscountPercent / 100).toFixed(2))
        } else {
          couponDiscountAmount = Number((rawSubtotalUsd * couponDiscountPercent / 100).toFixed(2))
        }
      }
    }

    const serverVerifiedTotal = Math.max(0, Number((subtotalAfterBundle - couponDiscountAmount).toFixed(2)))
    const finalOrderId = orderId
    const finalPaymentId = capture?.id || `PAY_PP_${orderId}`

    // 4. Add to User Vault (with discounted item prices)
    let calculatedSum = 0
    const vaultEntries = items.map((item: any, index: number) => {
      const dbItem = allPurchasedItems.find(p => p.id === item.id)
      const basePrice = Number(dbItem?.price_usd || 0)
      const itemBundleDiscount = items.length >= 3 ? Number((basePrice * 0.1).toFixed(2)) : 0
      
      let itemCouponDiscount = 0
      if (discountPercent > 0) {
        const isApplicable = !applicableItems || applicableItems.length === 0 || applicableItems.includes(item.id)
        if (isApplicable) {
          itemCouponDiscount = Number((basePrice * discountPercent / 100).toFixed(2))
        }
      }

      let finalPrice = Math.max(0, Number((basePrice - itemBundleDiscount - itemCouponDiscount).toFixed(2)))
      
      // Distribute rounding discrepancies to the last item
      if (index === items.length - 1) {
        finalPrice = Math.max(0, Number((serverVerifiedTotal - calculatedSum).toFixed(2)))
      } else {
        calculatedSum += finalPrice
      }

      return {
        user_id: userId,
        item_id: item.id,
        item_type: item.type,
        item_name: dbItem?.name || 'Unknown Item',
        amount: finalPrice,
        razorpay_order_id: finalOrderId,
        razorpay_payment_id: finalPaymentId
      }
    })

    const { error: vaultError } = await admin
      .from('user_vault')
      .insert(vaultEntries)

    if (vaultError) {
      if (vaultError.code !== '23505') {
        console.error('[PAYPAL_VAULT_ERROR]', vaultError)
        return NextResponse.json({ error: 'Failed to update library' }, { status: 500 })
      }
    }

    // 5. Record Coupon Usage
    if (couponCode) {
      const cleanCoupon = String(couponCode).toUpperCase().trim()
      const { data: coupon } = await admin
        .from('coupons')
        .select('id')
        .eq('code', cleanCoupon)
        .eq('is_active', true)
        .maybeSingle()

      if (coupon) {
        await admin
          .from('coupon_usages')
          .insert({
            coupon_id: coupon.id,
            user_id: userId,
            order_id: finalOrderId
          })
      }
    }

    // 6. Update User Account Details
    if (billingDetails) {
      const { error: accountError } = await admin
        .from('user_accounts')
        .upsert({
          user_id: userId,
          full_name: billingDetails.fullName,
          phone_number: billingDetails.phone,
          address_line1: billingDetails.address,
          city: billingDetails.city,
          state: billingDetails.state,
          postal_code: billingDetails.zip,
          country: billingDetails.country,
          updated_at: new Date().toISOString()
        })

      if (accountError) {
        console.error('[PAYPAL_UPDATE_ACCOUNT_ERROR]', accountError)
      }
    }

    // 7. Send Invoice (Async)
    try {
      const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)
      
      if (user && user.email) {
        const invoiceItems = items.map((item: any) => {
          const dbItem = allPurchasedItems.find(p => p.id === item.id)
          const vaultEntry = vaultEntries.find((v: any) => v.item_id === item.id)
          return { 
            name: dbItem?.name || 'Unknown Item', 
            price: vaultEntry ? vaultEntry.amount : (dbItem?.price_usd || 0),
            isPreorder: item.type === 'pack' && !dbItem?.full_pack_download_url 
          }
        })

        const total = serverVerifiedTotal
        const hasPreorder = invoiceItems.some(i => i.isPreorder)

        const userAddress = billingDetails 
          ? `${billingDetails.address}, ${billingDetails.city}, ${billingDetails.state} - ${billingDetails.zip}`
          : undefined

        const pdfBuffer = await generateInvoicePDF({
          orderId: finalOrderId,
          paymentId: finalPaymentId,
          userName: user.user_metadata?.full_name || billingDetails?.fullName || user.email.split('@')[0],
          userEmail: user.email,
          userAddress: userAddress,
          items: invoiceItems,
          total: total,
          date: new Date().toLocaleDateString(),
          currency: 'USD'
        })

        await sendInvoiceEmail({
          email: user.email,
          pdfBuffer,
          orderId: finalOrderId,
          packNames: invoiceItems.map(i => i.name),
          userName: user.user_metadata?.full_name || billingDetails?.fullName || user.email.split('@')[0],
          total: total,
          items: invoiceItems,
          isPreorder: hasPreorder,
          currency: 'USD'
        })
      }
    } catch (emailErr) {
      console.error('[PAYPAL_INVOICE_SEND_EMAIL_ERROR]', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[PAYPAL_CAPTURE_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
