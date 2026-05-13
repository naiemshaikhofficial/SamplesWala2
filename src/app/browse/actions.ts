'use server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import { generateAudioSignal, getDriveFileId } from '@/lib/audio/signal'

// Internal function to fetch all packs
// We use getAdminClient here to avoid 'cookies()' access inside unstable_cache
async function fetchAllPacks() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('sample_packs')
    .select('id, name, slug, cover_url, price_inr, full_pack_download_url, created_at, updated_at, categories(name)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[GET_PACKS_ERROR]', error)
    return []
  }

  // Transform to hide sensitive URLs completely
  return data.map(pack => {
    const { full_pack_download_url, ...safePack } = pack
    return {
      ...safePack,
      is_downloadable: !!full_pack_download_url
    }
  })
}

// Exported cached version (24h)
export async function getPacks() {
  return unstable_cache(
    async () => fetchAllPacks(),
    ['all-packs-list'],
    { revalidate: 300, tags: ['packs'] }
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
    .select('id, name, type, created_at, audio_url', { count: 'exact' })

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

  // Inject signals and remove direct URLs
  const enrichedSamples = await Promise.all((data || []).map(async (s: any) => {
    const driveId = getDriveFileId(s.audio_url);
    const signal = driveId ? await generateAudioSignal(driveId, s.name) : null;
    
    // Create safe object without audio_url
    const { audio_url, ...safeSample } = s;
    return {
      ...safeSample,
      signal
    }
  }))

  return { samples: enrichedSamples, count: count || 0 }
}

// Internal function to fetch single pack
// We use getAdminClient here to avoid 'cookies()' access inside unstable_cache
async function fetchPackBySlug(slug: string) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('sample_packs')
    .select('id, name, slug, description, video_url, cover_url, price_inr, created_at, full_pack_download_url, categories(name)')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('[GET_PACK_ERROR]', error)
    return null
  }

  // Hide the URL completely but provide a flag
  const { full_pack_download_url, ...safeData } = data
  return {
    ...safeData,
    is_downloadable: !!full_pack_download_url
  }
}

// Exported cached version (24h)
export async function getPackBySlug(slug: string) {
  return unstable_cache(
    async () => fetchPackBySlug(slug),
    [`pack-${slug}`],
    { revalidate: 300, tags: [`pack-${slug}`] }
  )()
}

export async function getRelatedPacks(category: string, excludeId: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data } = await supabase
        .from('sample_packs')
        .select('id, name, slug, cover_url, price_inr, categories!inner(name)')
        .eq('categories.name', category)
        .neq('id', excludeId)
        .limit(4)
      
      return data || []
    },
    [`related-${category}-${excludeId}`],
    { revalidate: 300, tags: ['packs'] }
  )()
}

export async function getSearchSuggestions(query: string) {
  if (!query || query.length < 2) return []
  
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('sample_packs')
    .select('id, name, slug, cover_url, price_inr')
    .ilike('name', `%${query}%`)
    .limit(5)
    
  if (error) {
    console.error('[SUGGESTIONS_ERROR]', error)
    return []
  }
  return data
}
