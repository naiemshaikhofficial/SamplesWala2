'use server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'

export async function getSecureDownloadUrl(packId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const headerList = await headers()
  const clientIp = headerList.get("x-forwarded-for")?.split(',')[0] || "unknown"

  if (!user) throw new Error("Please login to download")

  const admin = getAdminClient()

  // 1. Check ownership in user_vault
  const { data: vaultRecord, error: vaultError } = await admin
    .from('user_vault')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', packId)
    .eq('item_type', 'pack')
    .maybeSingle()

  if (!vaultRecord) {
    // Check if user is Admin
    const { data: adminCheck } = await admin.from('user_accounts').select('is_admin').eq('user_id', user.id).maybeSingle()
    
    // Bypass for development mode or Admin status
    const isDev = process.env.NODE_ENV === 'development'
    if (!adminCheck?.is_admin && !isDev) {
        throw new Error("Access Denied: Product Not Owned")
    }
  }

  // 2. Generate secure token
  const { data: tokenRecord, error: tokenError } = await admin
    .from('secure_download_tokens')
    .insert({
      user_id: user.id,
      item_id: packId,
      item_type: 'pack',
      client_ip: clientIp,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    })
    .select('id')
    .single()

  if (tokenError || !tokenRecord) {
    console.error("[TOKEN_ERROR]", tokenError)
    throw new Error("Failed to generate download link")
  }

  return `/api/download/${tokenRecord.id}`
}
