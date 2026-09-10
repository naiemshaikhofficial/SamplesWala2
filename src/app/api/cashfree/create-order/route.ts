import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { validateCoupon } from '@/app/checkout/actions'
import { getPackPriceDetails } from '@/lib/pricing'
import { createCashfreeOrder } from '@/lib/cashfree'
import { validateBillingDetails } from '@/lib/checkoutValidation'

export async function POST(request: Request) {
  try {
    const { items, couponCode, billingDetails } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please login to purchase' }, { status: 401 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // 1. Zero-Trust Price Fetching directly from Database
    const packIds = items.filter((i: any) => i.type === 'pack').map((i: any) => i.id)
    const presetIds = items.filter((i: any) => i.type === 'preset').map((i: any) => i.id)

    const admin = getAdminClient()
    const [packsRes, presetsRes] = await Promise.all([
      packIds.length > 0
        ? admin.from('sample_packs').select('id, name, price_inr, created_at, full_pack_download_url').in('id', packIds)
        : { data: [] },
      presetIds.length > 0
        ? admin.from('presets').select('id, name, price_inr').in('id', presetIds)
        : { data: [] }
    ])

    // Dynamic price calculation
    const resolvedPacks = (packsRes.data || []).map((pack: any) => {
      const priceDetails = getPackPriceDetails(pack)
      return {
        ...pack,
        price_inr: priceDetails.priceInr
      }
    })

    const allItems = [...resolvedPacks, ...(presetsRes.data || [])]

    if (allItems.length === 0) {
      return NextResponse.json({ error: 'Items not found' }, { status: 404 })
    }

    // 2. Server-side Subtotal Calculation
    const rawSubtotal = allItems.reduce((sum, p) => sum + Number(p.price_inr), 0)

    // Bundle Discount (10% off for 3+ items, disallowed if order has free items)
    const hasFreeItem = allItems.some(p => Number(p.price_inr) === 0)
    const paidItems = allItems.filter(p => Number(p.price_inr) > 0)
    const bundleDiscountPercent = (!hasFreeItem && paidItems.length >= 3) ? 10 : 0
    const bundleDiscountAmount = Math.round((rawSubtotal * bundleDiscountPercent) / 100)
    const subtotalAfterBundle = rawSubtotal - bundleDiscountAmount

    // Coupon Validation (Disallowed if order has free items)
    let couponDiscountAmount = 0
    let couponDiscountPercent = 0
    if (couponCode && !hasFreeItem) {
      const couponResult = await validateCoupon(
        couponCode,
        user.id,
        allItems.map(item => ({ id: item.id, price: Number(item.price_inr) }))
      )

      if (couponResult.success) {
        couponDiscountAmount = couponResult.discountAmount || 0
        couponDiscountPercent = couponResult.discountPercent || 0
      } else {
        return NextResponse.json({ error: couponResult.message || 'Invalid coupon' }, { status: 400 })
      }
    }

    const total = Math.max(0, subtotalAfterBundle - couponDiscountAmount)

    if (total <= 0) {
      return NextResponse.json({ error: 'Cart total is 0. Please use free checkout.' }, { status: 400 })
    }

    // 3. Generate Unique Order ID (Max 45 chars for Cashfree alphanumeric constraint)
    const orderId = `sw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    
    // Cashfree Production strictly requires HTTPS return_url and notify_url
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sampleswala.com'
    if (!siteUrl.startsWith('https://')) {
      siteUrl = 'https://sampleswala.com'
    }

    // Strict Billing Details Validation (No order can be paid without valid details)
    const validation = validateBillingDetails(billingDetails)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Please provide valid billing details before proceeding to payment.',
          fieldErrors: validation.errors
        },
        { status: 400 }
      )
    }

    // Customer details resolution with strict sanitization for Cashfree
    const customerName = validation.sanitized.fullName.substring(0, 100)
    const customerPhone = validation.sanitized.phone

    // Customer ID must be alphanumeric
    const customerId = (user.id || 'cust').replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50) || 'customer_sw'

    // Save pending order session for reliable webhook & client synchronization
    try {
      const admin = getAdminClient()
      await admin.from('order_sessions').upsert({
        order_id: orderId,
        user_id: user.id,
        items: items.map((i: any) => ({ id: i.id, type: i.type })),
        billing_details: validation.sanitized,
        coupon_code: couponCode || null,
        amount: total,
        currency: 'INR',
        gateway: 'cashfree',
        status: 'PENDING'
      })
    } catch (sessionErr) {
      console.warn('[ORDER_SESSION_UPSERT_WARN]', sessionErr)
    }

    // 4. Create Cashfree Order via v2023-08-01 API
    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: total,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_email: user.email || 'customer@sampleswala.com',
        customer_phone: customerPhone,
        customer_name: customerName
      },
      order_meta: {
        return_url: `${siteUrl}/checkout?cf_order_id={order_id}`,
        notify_url: `${siteUrl}/api/cashfree/webhook`
      },
      order_note: `SamplesWala Order - ${items.length} sound items`,
      order_tags: {
        userId: user.id.substring(0, 30),
        discountPercent: String(couponDiscountPercent || 0)
      }
    })

    return NextResponse.json({
      order_id: order.order_id,
      cf_order_id: order.cf_order_id,
      payment_session_id: order.payment_session_id,
      amount: order.order_amount,
      currency: order.order_currency
    })
  } catch (error: any) {
    console.error('[CASHFREE_CREATE_ORDER_ERROR]', error)
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 })
  }
}
