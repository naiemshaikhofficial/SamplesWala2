import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      packIds,
      userId
    } = await request.json()

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // 2. Add to User Vault using Admin Client
    const admin = getAdminClient()
    
    const vaultEntries = packIds.map((pid: string) => ({
      user_id: userId,
      item_id: pid,
      item_type: 'pack',
      amount: 0
    }))

    // Use upsert or unique constraint on (user_id, item_id) if available, 
    // but here we just insert and ignore errors for duplicates if they exist
    const { error: vaultError } = await admin
      .from('user_vault')
      .insert(vaultEntries)

    if (vaultError) {
      // If error is duplicate key, we can ignore it
      if (vaultError.code !== '23505') {
        console.error('[VAULT_ERROR]', vaultError)
        return NextResponse.json({ error: "Failed to update library" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
