import { NextResponse } from 'next/server'
import { getUser } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * 🟢 CPU OPTIMIZATION: Check if the logged-in user owns a pack/preset.
 * Moves the database ownership check from server page components to a client-side fetch,
 * allowing product pages (/packs/[slug], /browse/presets/[slug]) to be 100% statically generated.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ owned: false })
    }

    const { data: { user } } = await getUser()
    if (!user) {
      return NextResponse.json({ owned: false })
    }

    const adminClient = getAdminClient()
    
    // 1. Check user_vault for purchased item
    const { data: vaultRecord } = await adminClient
      .from('user_vault')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .maybeSingle()

    if (vaultRecord) {
      return NextResponse.json({ owned: true })
    }

    // 2. Check admin status in user_accounts
    const { data: accountRecord } = await adminClient
      .from('user_accounts')
      .select('is_admin')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({ owned: !!accountRecord?.is_admin })
  } catch (error) {
    console.error('[OWNERSHIP_CHECK_ERROR]', error)
    return NextResponse.json({ owned: false }, { status: 500 })
  }
}
