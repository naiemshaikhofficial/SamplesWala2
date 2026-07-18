'use server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import { generateAudioSignal, getDriveFileId } from '@/lib/audio/signal'
import { cleanSearchQuery } from '@/lib/search/queryHelper'

// Internal function to fetch all packs
// We use getAdminClient here to avoid 'cookies()' access inside unstable_cache
async function fetchAllPacks(limit?: number) {
  const supabase = getAdminClient()
  let query = supabase
    .from('sample_packs')
    .select('id, name, slug, description, cover_url, price_inr, price_usd, mrp_inr, full_pack_download_url, created_at, updated_at, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary')
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[GET_PACKS_ERROR]', error)
    return []
  }

  // Transform to explicitly ONLY include safe fields
  return data.map(pack => ({
    id: pack.id,
    name: pack.name,
    slug: pack.slug,
    description: pack.description,
    cover_url: pack.cover_url,
    price_inr: pack.price_inr,
    price_usd: pack.price_usd,
    mrp_inr: pack.mrp_inr,
    created_at: pack.created_at,
    updated_at: pack.updated_at,
    categories: pack.categories,
    melody_count: pack.melody_count,
    loop_count: pack.loop_count,
    one_shot_count: pack.one_shot_count,
    preset_count: pack.preset_count,
    total_contents_summary: pack.total_contents_summary,
    is_downloadable: !!pack.full_pack_download_url
  }))
}

// Exported cached version (24h)
export async function getPacks(limit?: number) {
  return unstable_cache(
    async () => fetchAllPacks(limit),
    [limit ? `packs-limit-${limit}` : 'all-packs-list'],
    { revalidate: 3600, tags: ['packs'] }
  )()
}

// Internal function to fetch packs belonging to a specific series
async function fetchPacksBySeries(seriesName: string, limit?: number) {
  const supabase = getAdminClient()
  let query = supabase
    .from('sample_packs')
    .select('id, name, slug, description, cover_url, price_inr, price_usd, mrp_inr, full_pack_download_url, created_at, updated_at, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary, series')
    .eq('series', seriesName)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[GET_PACKS_BY_SERIES_ERROR]', error)
    return []
  }

  // Transform to explicitly ONLY include safe fields
  return data.map(pack => ({
    id: pack.id,
    name: pack.name,
    slug: pack.slug,
    description: pack.description,
    cover_url: pack.cover_url,
    price_inr: pack.price_inr,
    price_usd: pack.price_usd,
    mrp_inr: pack.mrp_inr,
    created_at: pack.created_at,
    updated_at: pack.updated_at,
    categories: pack.categories,
    melody_count: pack.melody_count,
    loop_count: pack.loop_count,
    one_shot_count: pack.one_shot_count,
    preset_count: pack.preset_count,
    total_contents_summary: pack.total_contents_summary,
    is_downloadable: !!pack.full_pack_download_url,
    series: pack.series
  }))
}

// Cached version for fetching packs by series
export async function getPacksBySeries(seriesName: string, limit?: number) {
  return unstable_cache(
    async () => fetchPacksBySeries(seriesName, limit),
    [limit ? `packs-series-${seriesName.replace(/\s+/g, '-').toLowerCase()}-limit-${limit}` : `packs-series-${seriesName.replace(/\s+/g, '-').toLowerCase()}`],
    { revalidate: 3600, tags: ['packs'] }
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
    .select('id, name, slug, description, video_url, cover_url, price_inr, price_usd, mrp_inr, created_at, full_pack_download_url, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('[GET_PACK_ERROR]', error)
    return null
  }

  // Explicit safe mapping for single pack
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    video_url: data.video_url,
    cover_url: data.cover_url,
    price_inr: data.price_inr,
    price_usd: data.price_usd,
    mrp_inr: data.mrp_inr,
    created_at: data.created_at,
    categories: data.categories,
    melody_count: data.melody_count,
    loop_count: data.loop_count,
    one_shot_count: data.one_shot_count,
    preset_count: data.preset_count,
    total_contents_summary: data.total_contents_summary,
    is_downloadable: !!data.full_pack_download_url
  }
}

// Exported cached version (24h)
export async function getPackBySlug(slug: string) {
  return unstable_cache(
    async () => fetchPackBySlug(slug),
    [`pack-${slug}`],
    { revalidate: 3600, tags: [`pack-${slug}`] }
  )()
}

export async function getRelatedPacks(category: string, excludeId: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data } = await supabase
        .from('sample_packs')
        .select('id, name, slug, cover_url, price_inr, price_usd, mrp_inr, categories!inner(name)')
        .eq('categories.name', category)
        .neq('id', excludeId)
        .limit(4)

      return data || []
    },
    [`related-${category}-${excludeId}`],
    { revalidate: 3600, tags: ['packs'] }
  )()
}

export async function getSearchSuggestions(query: string) {
  if (!query || query.length < 2) return []

  const cleaned = cleanSearchQuery(query)
  const supabase = getAdminClient()

  let queryBuilder = supabase
    .from('sample_packs')
    .select('id, name, slug, cover_url, price_inr, price_usd, mrp_inr')

  if (cleaned) {
    queryBuilder = queryBuilder.ilike('name', `%${cleaned}%`)
  } else {
    // If query is generic (e.g. "sample", "smple", "sample wala"), return latest 5 packs
    queryBuilder = queryBuilder.order('created_at', { ascending: false })
  }

  const { data, error } = await queryBuilder.limit(5)

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
        .select('id, name, slug, description, cover_url, price_inr, price_usd, mrp_inr, full_pack_download_url, created_at, updated_at, categories(name), melody_count, loop_count, one_shot_count, preset_count, total_contents_summary')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[GET_GENRE_PACKS_ERROR]', error)
        return []
      }

      return data.map(pack => ({
        id: pack.id,
        name: pack.name,
        slug: pack.slug,
        description: pack.description,
        cover_url: pack.cover_url,
        price_inr: pack.price_inr,
        price_usd: pack.price_usd,
        mrp_inr: pack.mrp_inr,
        created_at: pack.created_at,
        categories: pack.categories,
        is_downloadable: !!pack.full_pack_download_url
      }))
    },
    [`packs-genre-${slug}`],
    { revalidate: 3600, tags: ['packs', 'categories'] }
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
async function fetchPresets(limit?: number) {
  const supabase = getAdminClient()
  let query = supabase
    .from('presets')
    .select('id, name, slug, description, type, price_inr, mrp_inr, youtube_url, cover_url, daws, plugins_used, created_at')
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[GET_PRESETS_ERROR]', error)
    return []
  }

  return (data || []).map((preset: any) => ({
    id: preset.id,
    name: preset.name,
    slug: preset.slug,
    type: preset.type,
    price_inr: preset.price_inr,
    mrp_inr: preset.mrp_inr,
    cover_url: preset.cover_url,
    daws: preset.daws,
    plugins_used: preset.plugins_used,
    created_at: preset.created_at
  }))
}

export async function getPresets(limit?: number) {
  return unstable_cache(
    async () => fetchPresets(limit),
    [limit ? `presets-limit-${limit}` : 'all-presets-list'],
    { revalidate: 3600, tags: ['presets'] }
  )()
}

async function fetchPresetBySlug(slug: string) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('presets')
    .select('id, name, slug, description, type, price_inr, mrp_inr, youtube_url, cover_url, daws, plugins_used, created_at')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('[GET_PRESET_ERROR]', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    type: data.type,
    price_inr: data.price_inr,
    mrp_inr: data.mrp_inr,
    youtube_url: data.youtube_url,
    cover_url: data.cover_url,
    daws: data.daws,
    plugins_used: data.plugins_used,
    created_at: data.created_at
  }
}

export async function getPresetBySlug(slug: string) {
  return unstable_cache(
    async () => fetchPresetBySlug(slug),
    [`preset-${slug}`],
    { revalidate: 3600, tags: [`preset-${slug}`] }
  )()
}

export async function getPresetsByCategory(categoryId: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data, error } = await supabase
        .from('presets')
        .select('id, name, slug, description, type, price_inr, mrp_inr, youtube_url, cover_url, daws, plugins_used, created_at')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[GET_CATEGORY_PRESETS_ERROR]', error)
        return []
      }
      return data || []
    },
    [`presets-category-${categoryId}`],
    { revalidate: 3600, tags: ['presets', 'categories'] }
  )()
}

export async function getRelatedPresets(type: string, excludeId: string) {
  return unstable_cache(
    async () => {
      const supabase = getAdminClient()
      const { data, error } = await supabase
        .from('presets')
        .select('id, name, slug, type, price_inr, mrp_inr, cover_url, daws, plugins_used, created_at')
        .eq('type', type)
        .neq('id', excludeId)
        .limit(4)

      if (error) return []
      return (data || []).map((preset: any) => ({
        id: preset.id,
        name: preset.name,
        slug: preset.slug,
        type: preset.type,
        price_inr: preset.price_inr,
        mrp_inr: preset.mrp_inr,
        cover_url: preset.cover_url,
        daws: preset.daws,
        plugins_used: preset.plugins_used,
        created_at: preset.created_at
      }))
    },
    [`related-presets-${type}-${excludeId}`],
    { revalidate: 3600, tags: ['presets'] }
  )()
}

