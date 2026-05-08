import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendInvoiceEmail } from '@/lib/emails'

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

    // 2. Fetch pack prices for the vault entry
    const admin = getAdminClient()
    const { data: packs, error: packsError } = await admin
      .from('sample_packs')
      .select('id, name, price_inr')
      .in('id', packIds)

    if (packsError || !packs) {
      console.error('[FETCH_PACKS_ERROR]', packsError)
      return NextResponse.json({ error: "Failed to verify pack details" }, { status: 500 })
    }

    // 3. Add to User Vault
    const vaultEntries = packIds.map((pid: string) => {
      const pack = packs.find(p => p.id === pid)
      return {
        user_id: userId,
        item_id: pid,
        item_type: 'pack',
        amount: pack?.price_inr || 0,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id
      }
    })



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

    // 4. Send Invoice (Async)
    try {
      const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)
      
      if (user && user.email) {
        const invoiceItems = packIds.map((pid: string) => {
          const pack = packs.find(p => p.id === pid)
          return { name: pack?.name || 'Unknown Pack', price: pack?.price_inr || 0 }
        })

        const total = invoiceItems.reduce((sum, item) => sum + item.price, 0)

        const pdfBuffer = await generateInvoicePDF({
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          userName: user.user_metadata?.full_name || user.email.split('@')[0],
          userEmail: user.email,
          items: invoiceItems,
          total: total,
          date: new Date().toLocaleDateString()
        })

        await sendInvoiceEmail({
          email: user.email,
          pdfBuffer,
          orderId: razorpay_order_id,
          packNames: invoiceItems.map(i => i.name)
        })
      }
    } catch (emailErr) {
      console.error('[INVOICE_SEND_ERROR]', emailErr)
      // We don't return error to user because the purchase was successful
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
