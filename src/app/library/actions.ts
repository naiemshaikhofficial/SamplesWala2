'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getDriveFileId } from '@/lib/audio/signal'
import { unstable_cache } from 'next/cache'

// Cached database query helper to save Supabase connection/read resources.
// Using getAdminClient inside unstable_cache to avoid header/cookie-related caching warnings.
const fetchCachedSamples = (packId: string) => unstable_cache(
  async () => {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('samples')
      .select('id, name, audio_url, download_url, bpm, key, time_signature, tags, type')
      .eq('pack_id', packId)
      .order('name', { ascending: true })

    if (error) {
      console.error(`[FETCH_CACHED_SAMPLES_ERROR] packId: ${packId}`, error)
      return []
    }
    return data || []
  },
  ['pack-samples-list', packId],
  { 
    revalidate: 86400, // Cache sample lists for 24 hours
    tags: ['samples', `pack-${packId}-samples`]
  }
)

export async function getPackSamples(packId: string) {
  const supabase = await createClient()

  // 1. Get the current user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // 2. Security Check: Verify user owns the pack in user_vault (must be dynamic/uncached)
  const { data: ownership, error: ownershipError } = await supabase
    .from('user_vault')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', packId)
    .eq('item_type', 'pack')
    .maybeSingle()

  if (ownershipError || !ownership) {
    throw new Error('Access denied. You do not own this sample pack.')
  }

  // 3. Fetch samples from Vercel's server-side cache rather than hitting Supabase database
  const samples = await fetchCachedSamples(packId)()

  // 4. Transform Google Drive links to streamable/direct download links
  return samples.map((s: any) => {
    const audioDriveId = getDriveFileId(s.audio_url)
    const downloadDriveId = getDriveFileId(s.download_url)

    return {
      id: s.id,
      name: s.name,
      bpm: s.bpm,
      key: s.key,
      type: s.type || 'loop', // 'loop' or 'one_shot'
      time_signature: s.time_signature || '4/4',
      tags: s.tags || [],
      // Direct streaming URL for audio preview
      stream_url: audioDriveId ? `https://docs.google.com/uc?export=download&id=${audioDriveId}` : null,
      // Direct download URL for the high quality WAV
      download_url: downloadDriveId ? `https://docs.google.com/uc?export=download&id=${downloadDriveId}` : null
    }
  })
}
