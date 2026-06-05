import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateCoupon } from '@/app/checkout/actions'
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
    const { items, couponCode } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please login to purchase' }, { status: 401 })
    }

    // 1. Fetch prices from both tables (with created_at and full_pack_download_url for dynamic pricing checks)
    const packIds = items.filter((i: any) => i.type === 'pack').map((i: any) => i.id)
    const presetIds = items.filter((i: any) => i.type === 'preset').map((i: any) => i.id)

    const [packsRes, presetsRes] = await Promise.all([
      packIds.length > 0 ? supabase.from('sample_packs').select('id, name, price_inr, price_usd, created_at, full_pack_download_url').in('id', packIds) : { data: [] },
      presetIds.length > 0 ? supabase.from('presets').select('id, name, price_inr').in('id', presetIds) : { data: [] }
    ])

    // Securely calculate dynamic USD prices for packs
    const resolvedPacks = (packsRes.data || []).map((pack: any) => {
      const priceDetails = getPackPriceDetails(pack)
      return {
        id: pack.id,
        name: pack.name,
        price_usd: pack.price_usd ? Number(pack.price_usd) : Math.round(priceDetails.priceInr / 80)
      }
    })

    // Securely calculate dynamic USD prices for presets
    const resolvedPresets = (presetsRes.data || []).map((preset: any) => {
      return {
        id: preset.id,
        name: preset.name,
        // Fallback conversion for presets since they don't have a price_usd column
        price_usd: preset.price_inr === 0 ? 0 : Math.round((Number(preset.price_inr) / 80) * 100) / 100 || 2.99
      }
    })

    const allItems = [...resolvedPacks, ...resolvedPresets]

    if (allItems.length === 0) {
      return NextResponse.json({ error: 'Items not found' }, { status: 404 })
    }

    // 2. Calculate total (Server-side USD calculation)
    const rawSubtotalUsd = allItems.reduce((sum, p) => sum + p.price_usd, 0)
    
    // Server-side Bundle Discount logic (10% off for 3+ items)
    const bundleDiscountPercent = items.length >= 3 ? 10 : 0
    const bundleDiscountAmount = Number((rawSubtotalUsd * bundleDiscountPercent / 100).toFixed(2))
    const subtotalAfterBundle = rawSubtotalUsd - bundleDiscountAmount
    
    // Server-side Coupon Validation (in USD)
    let couponDiscountAmount = 0
    let couponDiscountPercent = 0
    if (couponCode) {
      // Validate coupon structure/limits using validation actions in INR format first to check limits
      const couponResult = await validateCoupon(
        couponCode,
        user.id,
        allItems.map(item => ({ id: item.id, price: item.price_usd }))
      )

      if (couponResult.success) {
        couponDiscountPercent = couponResult.discountPercent || 0
        // Calculate cents-precision discount for USD
        if (couponResult.applicableItems && couponResult.applicableItems.length > 0) {
          const applicableIds = couponResult.applicableItems as string[]
          const applicableTotal = allItems.reduce((sum, item) => {
            if (applicableIds.includes(item.id)) {
              return sum + item.price_usd
            }
            return sum
          }, 0)
          couponDiscountAmount = Number((applicableTotal * couponDiscountPercent / 100).toFixed(2))
        } else {
          couponDiscountAmount = Number((rawSubtotalUsd * couponDiscountPercent / 100).toFixed(2))
        }
      } else {
        return NextResponse.json({ error: couponResult.message || 'Invalid coupon' }, { status: 400 })
      }
    }

    const totalUsd = Math.max(0, Number((subtotalAfterBundle - couponDiscountAmount).toFixed(2)))

    // 3. Authenticate with PayPal and create Order session
    const { token, baseUrl } = await getPayPalAccessToken()

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `cart_${user.id.substring(0, 8)}`,
          amount: {
            currency_code: 'USD',
            value: totalUsd.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalUsd.toFixed(2)
              }
            }
          },
          description: `SamplesWala Cart Purchase for ${user.email}`,
          custom_id: JSON.stringify({
            userId: user.id,
            items: items.map((i: any) => ({ id: i.id, type: i.type })),
            couponCode: couponCode || null,
            discountPercent: couponDiscountPercent || 0
          })
        }
      ],
      application_context: {
        brand_name: 'SamplesWala',
        locale: 'en-US',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/library`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`
      }
    }

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderPayload)
    })

    if (!response.ok) {
      const errorResponse = await response.text()
      console.error('[PAYPAL_ORDER_API_ERROR]', errorResponse)
      return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 500 })
    }

    const orderData = await response.json()
    return NextResponse.json(orderData)
  } catch (error: any) {
    console.error('[PAYPAL_ORDER_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
