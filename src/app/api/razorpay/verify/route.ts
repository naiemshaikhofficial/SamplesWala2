import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendInvoiceEmail } from '@/lib/emails'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      items, // array of {id, type}
      userId,
      billingDetails,
      isFree,
      couponCode
    } = body

    // 1. Verify Payment OR Verify Free Order
    if (!isFree) {
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
        }
        const text = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(text.toString())
        .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }
    }

    // 2. Fetch item details for the vault entry
    const admin = getAdminClient()
    const packIds = items.filter((i: any) => i.type === 'pack').map((i: any) => i.id)
    const presetIds = items.filter((i: any) => i.type === 'preset').map((i: any) => i.id)

    const [packsRes, presetsRes] = await Promise.all([
      packIds.length > 0 ? admin.from('sample_packs').select('id, name, price_inr, full_pack_download_url').in('id', packIds) : { data: [] },
      presetIds.data ? { data: presetIds.data } : (presetIds.length > 0 ? admin.from('presets').select('id, name, price_inr').in('id', presetIds) : { data: [] })
    ])

    const allPurchasedItems = [...(packsRes.data || []), ...(presetsRes.data || [])]

    if (allPurchasedItems.length === 0) {
      return NextResponse.json({ error: "Failed to verify item details" }, { status: 500 })
    }

    const calculatedTotal = allPurchasedItems.reduce((acc, item) => acc + (item.price_inr || 0), 0)
    if (isFree && calculatedTotal > 0) {
        return NextResponse.json({ error: "Invalid free order" }, { status: 400 })
    }

    // Generate internal IDs for free orders to avoid "undefined" in logs and invoices
    const finalOrderId = isFree ? `SW_FREE_${Date.now()}` : razorpay_order_id
    const finalPaymentId = isFree ? `SW_PAY_FREE_${Date.now()}` : razorpay_payment_id

    // 3. Add to User Vault
    const vaultEntries = items.map((item: any) => {
      const dbItem = allPurchasedItems.find(p => p.id === item.id)
      return {
        user_id: userId,
        item_id: item.id,
        item_type: item.type,
        item_name: dbItem?.name || 'Unknown Item',
        amount: dbItem?.price_inr || 0,
        razorpay_order_id: finalOrderId,
        razorpay_payment_id: finalPaymentId
      }
    })

    const { error: vaultError } = await admin
      .from('user_vault')
      .insert(vaultEntries)

    if (vaultError) {
      if (vaultError.code !== '23505') {
        console.error('[VAULT_ERROR]', vaultError)
        return NextResponse.json({ error: "Failed to update library" }, { status: 500 })
      }
    }

    // 3.5 Record Coupon Usage
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

    // 4. Update User Account Details
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
        console.error('[UPDATE_ACCOUNT_ERROR]', accountError)
      }
    }

    // 5. Send Invoice (Async)
    try {
      const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)
      
      if (user && user.email) {
        const invoiceItems = items.map((item: any) => {
          const dbItem = allPurchasedItems.find(p => p.id === item.id)
          return { 
            name: dbItem?.name || 'Unknown Item', 
            price: dbItem?.price_inr || 0,
            isPreorder: item.type === 'pack' && !dbItem?.full_pack_download_url 
          }
        })

        const total = invoiceItems.reduce((sum, item) => sum + item.price, 0)
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
          date: new Date().toLocaleDateString()
        })

        await sendInvoiceEmail({
          email: user.email,
          pdfBuffer,
          orderId: finalOrderId,
          packNames: invoiceItems.map(i => i.name),
          userName: user.user_metadata?.full_name || billingDetails?.fullName || user.email.split('@')[0],
          total: total,
          items: invoiceItems,
          isPreorder: hasPreorder
        })
      }
    } catch (emailErr) {
      console.error('[INVOICE_SEND_EMAIL_ERROR]', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
