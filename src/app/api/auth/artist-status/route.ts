import { NextResponse } from 'next/server'
import { getUser } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * 🟢 CPU OPTIMIZATION: Lightweight endpoint for artist/admin status check.
 * Called client-side ONLY for logged-in users, instead of running 
 * these queries server-side on every single page load.
 */
export async function GET() {
  try {
    const { data: { user } } = await getUser()
    
    if (!user) {
      return NextResponse.json({ isArtist: false })
    }

    const adminClient = getAdminClient()
    const [artistRes, adminRes] = await Promise.all([
      adminClient.from('artist_collaborations').select('id').eq('artist_id', user.id).limit(1),
      adminClient.from('admins').select('user_id').eq('user_id', user.id).limit(1)
    ])

    const isArtist = (artistRes.data && artistRes.data.length > 0) || (adminRes.data && adminRes.data.length > 0)
    
    return NextResponse.json({ isArtist })
  } catch {
    return NextResponse.json({ isArtist: false })
  }
}
