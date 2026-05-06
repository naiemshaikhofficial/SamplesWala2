import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const { packIds, discountPercent } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please login to purchase' }, { status: 401 })
    }

    // 1. Fetch pack prices
    const { data: packs, error: packError } = await supabase
      .from('sample_packs')
      .select('id, name, price_inr')
      .in('id', packIds)

    if (packError || !packs || packs.length === 0) {
      return NextResponse.json({ error: 'Packs not found' }, { status: 404 })
    }

    // 2. Calculate total
    const subtotal = packs.reduce((sum, p) => sum + Number(p.price_inr), 0)
    const discountAmount = discountPercent ? (subtotal * discountPercent / 100) : 0
    const total = subtotal - discountAmount

    // 3. Create Razorpay order
    const options = {
      amount: Math.round(total * 100), // amount in smallest currency unit
      currency: "INR",
      receipt: `cart_${user.id.substring(0, 8)}`,
      notes: {
        packIds: packIds.join(','),
        userId: user.id,
        discountPercent: discountPercent || 0
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('[RAZORPAY_ORDER_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
