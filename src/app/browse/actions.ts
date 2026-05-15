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
    .select('id, name, slug, cover_url, price_inr, mrp_inr, full_pack_download_url, created_at, updated_at, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary')
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
    .select('id, name, slug, description, video_url, cover_url, price_inr, mrp_inr, created_at, full_pack_download_url, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary')
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
        .select('id, name, slug, cover_url, price_inr, mrp_inr, categories!inner(name)')
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
    .select('id, name, slug, cover_url, price_inr, mrp_inr')
    .ilike('name', `%${query}%`)
    .limit(5)
    
  if (error) {
    console.error('[SUGGESTIONS_ERROR]', error)
    return []
  }
  return data
}

export async function getCategoryBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        // PGRST116 is the code for '0 rows returned' which is expected if slug is wrong
        if (error.code !== 'PGRST116') {
          console.error('[GET_CATEGORY_ERROR]', {
            code: error.code,
            message: error.message,
            details: error.details,
            slug
          })
        }
        return null
      }
      return data
    },
    [`category-${slug}`],
    { revalidate: 3600, tags: ['categories'] }
  )()
}

export async function getPacksByCategorySlug(slug: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      // First get category id
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!category) return []

      const { data, error } = await supabase
        .from('sample_packs')
        .select('id, name, slug, cover_url, price_inr, mrp_inr, full_pack_download_url, created_at, updated_at, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('[GET_GENRE_PACKS_ERROR]', error)
        return []
      }

      return data.map(pack => {
        const { full_pack_download_url, ...safePack } = pack
        return {
          ...safePack,
          is_downloadable: !!full_pack_download_url
        }
      })
    },
    [`packs-genre-${slug}`],
    { revalidate: 300, tags: ['packs', 'categories'] }
  )()
}

export async function getAllCategories() {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      return data || []
    },
    ['all-categories'],
    { revalidate: 3600, tags: ['categories'] }
  )()
}

// Preset Actions
async function fetchPresets() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[GET_PRESETS_ERROR]', error)
    return []
  }
  return data
}

export async function getPresets() {
  return unstable_cache(
    async () => fetchPresets(),
    ['all-presets-list'],
    { revalidate: 300, tags: ['presets'] }
  )()
}

async function fetchPresetBySlug(slug: string) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('[GET_PRESET_ERROR]', error)
    return null
  }
  return data
}

export async function getPresetBySlug(slug: string) {
  return unstable_cache(
    async () => fetchPresetBySlug(slug),
    [`preset-${slug}`],
    { revalidate: 300, tags: [`preset-${slug}`] }
  )()
}

export async function getPresetsByCategory(categoryId: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('[GET_CATEGORY_PRESETS_ERROR]', error)
        return []
      }
      return data
    },
    [`presets-category-${categoryId}`],
    { revalidate: 300, tags: ['presets', 'categories'] }
  )()
}

