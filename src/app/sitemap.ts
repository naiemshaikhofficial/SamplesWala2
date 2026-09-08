import { MetadataRoute } from 'next'
import { getAdminClient } from '@/lib/supabase/admin'

// Cache sitemap using Incremental Static Regeneration (revalidated every 6 hours)
export const revalidate = 21600

/**
 * Escapes XML entities in URLs/locs to ensure valid XML sitemap output
 * according to Google Sitemaps and XML 1.0 standard.
 */
function sanitizeXmlUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null
  const trimmed = url.trim()
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return null
  }
  return trimmed
    .replace(/&amp;/g, '&')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
      : 'https://sampleswala.com'

  const supabase = getAdminClient()

  // 1. Static Core & Hub Routes (Excludes private /library or /account routes)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/browse/packs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/browse/presets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/series/india-journey`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    
    // High-Intent DAW Landing Hubs
    { url: `${baseUrl}/daw/fl-studio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/daw/ableton-live`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/daw/logic-pro`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/daw/cubase`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.92 },
    { url: `${baseUrl}/daw/studio-one`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.92 },
    { url: `${baseUrl}/daw/reaper`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.92 },

    // Content, Support & Legal Pages
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Dynamic Entries
  let packEntries: MetadataRoute.Sitemap = []
  let presetEntries: MetadataRoute.Sitemap = []
  let genreEntries: MetadataRoute.Sitemap = []
  let softwareEntries: MetadataRoute.Sitemap = []
  let blogEntries: MetadataRoute.Sitemap = []

  try {
    const [packsRes, presetsRes, categoriesRes, softwareRes] = await Promise.all([
      supabase.from('sample_packs').select('slug, cover_url, updated_at, created_at'),
      supabase.from('presets').select('slug, cover_url, updated_at, created_at').eq('is_active', true),
      supabase.from('categories').select('slug, created_at'),
      supabase.from('software_products').select('slug, updated_at, created_at').eq('is_active', true),
    ])

    // Sample Packs with Image Sitemaps
    if (packsRes.data && packsRes.data.length > 0) {
      packEntries = packsRes.data.map((pack) => {
        const cover = pack.cover_url?.startsWith('http')
          ? pack.cover_url
          : pack.cover_url
          ? `${baseUrl}${pack.cover_url}`
          : undefined
        const sanitizedImg = sanitizeXmlUrl(cover)

        return {
          url: `${baseUrl}/packs/${encodeURIComponent(pack.slug)}`,
          lastModified: new Date(pack.updated_at || pack.created_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
          images: sanitizedImg ? [sanitizedImg] : undefined,
        }
      })
    }

    // Presets with Image Sitemaps
    if (presetsRes.data && presetsRes.data.length > 0) {
      presetEntries = presetsRes.data.map((preset) => {
        const cover = preset.cover_url?.startsWith('http')
          ? preset.cover_url
          : preset.cover_url
          ? `${baseUrl}${preset.cover_url}`
          : undefined
        const sanitizedImg = sanitizeXmlUrl(cover)

        return {
          url: `${baseUrl}/browse/presets/${encodeURIComponent(preset.slug)}`,
          lastModified: new Date(preset.updated_at || preset.created_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
          images: sanitizedImg ? [sanitizedImg] : undefined,
        }
      })
    }

    // Genres & Categories
    if (categoriesRes.data && categoriesRes.data.length > 0) {
      genreEntries = categoriesRes.data.map((cat) => ({
        url: `${baseUrl}/browse/genre/${encodeURIComponent(cat.slug)}`,
        lastModified: new Date(cat.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }))
    }

    // Software Products (if active)
    if (softwareRes.data && softwareRes.data.length > 0) {
      softwareEntries = softwareRes.data.map((item) => ({
        url: `${baseUrl}/software/${encodeURIComponent(item.slug)}`,
        lastModified: new Date(item.updated_at || item.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    }
  } catch (err) {
    console.error('[SITEMAP_DB_ERROR]', err)
  }

  // Curated Blog Posts
  const blogSlugs = [
    'top-5-indian-percussion-sample-packs-2026',
    'how-to-make-bollywood-drill-the-ultimate-guide',
    'how-to-produce-bollywood-style-beats-complete-guide',
    'the-future-of-indian-hip-hop-production',
  ]
  blogEntries = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Combine and deduplicate with XML sanitation
  const allEntries = [
    ...staticRoutes,
    ...packEntries,
    ...presetEntries,
    ...genreEntries,
    ...softwareEntries,
    ...blogEntries,
  ]

  const uniqueUrlsMap = new Map<string, MetadataRoute.Sitemap[number]>()

  allEntries.forEach((entry) => {
    const cleanUrl = sanitizeXmlUrl(entry.url)
    if (cleanUrl && !uniqueUrlsMap.has(cleanUrl)) {
      const cleanImages = entry.images
        ?.map((img) => sanitizeXmlUrl(img))
        .filter((img): img is string => Boolean(img))

      uniqueUrlsMap.set(cleanUrl, {
        ...entry,
        url: cleanUrl,
        images: cleanImages && cleanImages.length > 0 ? cleanImages : undefined,
      })
    }
  })

  return Array.from(uniqueUrlsMap.values())
}
