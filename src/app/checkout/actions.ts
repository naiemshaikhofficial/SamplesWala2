'use server'
import { createClient } from '@/lib/supabase/server'

export async function validateCoupon(
  code: string,
  userId: string | null,
  items: { id: string; price: number }[]
) {
  const supabase = await createClient()
  const cleanCode = code.toUpperCase().trim()

  // 1. Fetch coupon details
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', cleanCode)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !coupon) {
    return { success: false, message: "Invalid coupon code" }
  }

  // 2. Check expiration date
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { success: false, message: "Coupon has expired" }
  }

  // 3. Check overall usage limit (max_uses)
  if (coupon.max_uses !== null) {
    const { count, error: countErr } = await supabase
      .from('coupon_usages')
      .select('*', { count: 'exact', head: true })
      .eq('coupon_id', coupon.id)

    if (!countErr && count !== null && count >= coupon.max_uses) {
      return { success: false, message: "Coupon usage limit reached" }
    }
  }

  // 4. Check user limit (limit_per_user)
  if (coupon.limit_per_user !== null) {
    if (!userId) {
      return { success: false, message: "Please log in to apply this coupon" }
    }
    const { count, error: userCountErr } = await supabase
      .from('coupon_usages')
      .select('*', { count: 'exact', head: true })
      .eq('coupon_id', coupon.id)
      .eq('user_id', userId)

    if (!userCountErr && count !== null && count >= coupon.limit_per_user) {
      return { success: false, message: "You have already used this coupon" }
    }
  }

  // 5. Calculate discount based on applicability
  const discountPercent = coupon.discount_percent
  let discountAmount = 0
  let isApplicable = false

  if (coupon.applicable_items && coupon.applicable_items.length > 0) {
    // Coupon only applies to specific items
    const applicableIds = coupon.applicable_items as string[]
    
    // Sum prices of applicable items in the cart
    const applicableTotal = items.reduce((sum, item) => {
      if (applicableIds.includes(item.id)) {
        isApplicable = true
        return sum + item.price
      }
      return sum
    }, 0)

    if (!isApplicable) {
      return { success: false, message: "This coupon is not applicable to items in your cart" }
    }

    discountAmount = Math.round(applicableTotal * discountPercent / 100)
  } else {
    // Coupon applies to entire cart
    const cartTotal = items.reduce((sum, item) => sum + item.price, 0)
    discountAmount = Math.round(cartTotal * discountPercent / 100)
    isApplicable = true
  }

  return {
    success: true,
    couponId: coupon.id,
    code: coupon.code,
    discountPercent,
    discountAmount,
    applicableItems: coupon.applicable_items,
  }
}
