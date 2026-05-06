'use server'
import { createClient } from '@/lib/supabase/server'

export async function validateCoupon(code: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('coupons')
    .select('code, discount_percent')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  // If expires_at is null, it's a perpetual coupon
  if (!data) {
     const { data: perpetual } = await supabase
      .from('coupons')
      .select('code, discount_percent')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .is('expires_at', null)
      .maybeSingle()
     
     if (perpetual) return { success: true, discount: perpetual.discount_percent }
  }

  if (data) return { success: true, discount: data.discount_percent }
  
  return { success: false, message: "Invalid or expired coupon" }
}
