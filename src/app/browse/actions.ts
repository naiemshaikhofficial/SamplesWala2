'use server'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { generateAudioSignal, getDriveFileId } from '@/lib/audio/signal'

// Internal function to fetch all packs
async function fetchAllPacks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sample_packs')
    .select('id, name, slug, cover_url, price_inr, full_pack_download_url, created_at, updated_at, categories(name)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[GET_PACKS_ERROR]', error)
    return []
  }
  return data
}

// Exported cached version (24h)
// Must be an async function to satisfy Next.js Server Actions requirement
export async function getPacks() {
  return unstable_cache(
    async () => fetchAllPacks(),
    ['all-packs-list'],
    { revalidate: 86400, tags: ['packs'] }
  )()
}

export const getSamples = async (filters: { 
  query?: string, 
  category?: string, 
  page?: number, 
  limit?: number 
}) => {
  const supabase = await createClient()
  const page = filters.page || 1
  const limit = filters.limit || 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let queryBuilder = supabase
    .from('artifact_registry')
    .select('*', { count: 'exact' })

  if (filters.query) {
    queryBuilder = queryBuilder.ilike('name', `%${filters.query}%`)
  }

  const { data, error, count } = await queryBuilder
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET_SAMPLES_ERROR]', error)
    return { samples: [], count: 0 }
  }

  // Inject signals (Signals are already cached internally by generateAudioSignal)
  const enrichedSamples = await Promise.all((data || []).map(async (s: any) => {
    const driveId = getDriveFileId(s.audio_url);
    return {
      ...s,
      signal: driveId ? await generateAudioSignal(driveId, s.name) : null
    }
  }))

  return { samples: enrichedSamples, count: count || 0 }
}

// Internal function to fetch single pack
async function fetchPackBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sample_packs')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('[GET_PACK_ERROR]', error)
    return null
  }
  return data
}

// Exported cached version (24h)
// Must be an async function to satisfy Next.js Server Actions requirement
export async function getPackBySlug(slug: string) {
  return unstable_cache(
    async () => fetchPackBySlug(slug),
    [`pack-${slug}`],
    { revalidate: 86400, tags: [`pack-${slug}`] }
  )()
}
