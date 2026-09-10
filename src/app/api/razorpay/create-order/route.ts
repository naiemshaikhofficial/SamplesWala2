import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import { validateCoupon } from '@/app/checkout/actions'
import { getPackPriceDetails } from '../../../../lib/pricing'
import { validateBillingDetails } from '@/lib/checkoutValidation'
import { getSiteSettings } from '@/lib/siteSettings'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const settings = await getSiteSettings()
    if (!settings.store_enabled || !settings.purchasing_enabled || settings.read_only_mode) {
      return NextResponse.json(
        { error: 'Purchasing is temporarily paused for routine maintenance. Please try again later.' },
        { status: 503 }
      )
    }

    if (!settings.razorpay_enabled) {
      return NextResponse.json(
        { error: 'Razorpay checkout is currently disabled by store administration.' },
        { status: 503 }
      )
    }

    const { items, couponCode, billingDetails } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please login to purchase' }, { status: 401 })
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

    // 1. Fetch prices from both tables (with created_at and full_pack_download_url for dynamic pricing checks)
    const packIds = items.filter((i: any) => i.type === 'pack').map((i: any) => i.id)
    const presetIds = items.filter((i: any) => i.type === 'preset').map((i: any) => i.id)

    const [packsRes, presetsRes] = await Promise.all([
      packIds.length > 0 ? supabase.from('sample_packs').select('id, name, price_inr, created_at, full_pack_download_url').in('id', packIds) : { data: [] },
      presetIds.length > 0 ? supabase.from('presets').select('id, name, price_inr').in('id', presetIds) : { data: [] }
    ])

    // Securely calculate dynamic prices for packs
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

    // 2. Calculate total (Server-side calculation)
    const rawSubtotal = allItems.reduce((sum, p) => sum + Number(p.price_inr), 0)
    
    // Server-side Bundle Discount logic (Only for paid items, disallowed if order has free items)
    const hasFreeItem = allItems.some(p => Number(p.price_inr) === 0)
    const paidItems = allItems.filter(p => Number(p.price_inr) > 0)
    const bundleDiscountPercent = (!hasFreeItem && paidItems.length >= 3) ? 10 : 0
    const bundleDiscountAmount = Math.round(rawSubtotal * bundleDiscountPercent / 100)
    const subtotalAfterBundle = rawSubtotal - bundleDiscountAmount
    
    // Server-side Coupon Validation (Disallowed if order has free items)
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

    const minAllowed = settings.min_order_value_inr || 10
    if (total > 0 && total < minAllowed) {
      return NextResponse.json(
        { error: `Minimum order value must be at least ₹${minAllowed}.` },
        { status: 400 }
      )
    }

    // 3. Create Razorpay order
    const options = {
      amount: Math.round(total * 100), // amount in smallest currency unit
      currency: "INR",
      receipt: `cart_${user.id.substring(0, 8)}`,
      notes: {
        itemDetails: JSON.stringify(items.map((i: any) => ({ id: i.id, type: i.type }))),
        userId: user.id,
        discountPercent: couponDiscountPercent || 0,
        customerName: validation.sanitized.fullName,
        customerPhone: validation.sanitized.phone,
        customerCity: validation.sanitized.city,
        customerState: validation.sanitized.state,
        customerZip: validation.sanitized.zip
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('[RAZORPAY_ORDER_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
