import { NextResponse } from 'next/server'
import { getUser } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: { user } } = await getUser()
    if (!user) {
      return NextResponse.json({ ownedIds: [], isAdmin: false })
    }

    const adminClient = getAdminClient()

    // 1. Check if user is admin
    const { data: accountRecord } = await adminClient
      .from('user_accounts')
      .select('is_admin')
      .eq('user_id', user.id)
      .maybeSingle()

    const isAdmin = !!accountRecord?.is_admin

    // 2. Fetch all item IDs from user_vault
    const { data: vaultRecords } = await adminClient
      .from('user_vault')
      .select('item_id')
      .eq('user_id', user.id)

    const ownedIds = (vaultRecords || []).map((r) => r.item_id).filter(Boolean)

    return NextResponse.json({
      ownedIds,
      isAdmin,
    })
  } catch (error) {
    console.error('[OWNERSHIP_ALL_ERROR]', error)
    return NextResponse.json({ ownedIds: [], isAdmin: false }, { status: 500 })
  }
}
