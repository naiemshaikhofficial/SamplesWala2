import { MetadataRoute } from 'next'
import { getPacks } from '@/app/browse/actions'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sampleswala.com'
  const supabase = getAdminClient()

  // 1. Fetch all packs for dynamic routes
  let packEntries: any[] = []
  try {
    const packs = await getPacks()
    packEntries = packs.map((pack) => ({
      url: `${baseUrl}/packs/${pack.slug}`,
      lastModified: new Date(pack.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Sitemap: Failed to fetch packs', error)
  }

  // 2. Fetch all software products
  let softwareEntries: any[] = []
  try {
    const { data: software } = await supabase
      .from('software_products')
      .select('slug, updated_at')
      .eq('is_active', true)
    
    if (software) {
      softwareEntries = software.map((item) => ({
        url: `${baseUrl}/software/${item.slug}`,
        lastModified: new Date(item.updated_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch software products', error)
  }

  // 3. Blog Posts (Currently hardcoded in blog/page.tsx, but mapping them here)
  const blogSlugs = [
    "top-5-indian-percussion-sample-packs-2026",
    "how-to-make-bollywood-drill-the-ultimate-guide",
    "how-to-produce-bollywood-style-beats-complete-guide",
    "the-future-of-indian-hip-hop-production"
  ]
  const blogEntries = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 4. Genres
  let genreEntries: any[] = []
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, created_at')
    
    if (categories) {
      genreEntries = categories.map((cat) => ({
        url: `${baseUrl}/browse/genre/${cat.slug}`,
        lastModified: new Date(cat.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch categories/genres', error)
  }

  // 5. Presets
  let presetEntries: any[] = []
  try {
    const { data: presets } = await supabase
      .from('presets')
      .select('slug, updated_at')
      .eq('is_active', true)
    
    if (presets) {
      presetEntries = presets.map((item) => ({
        url: `${baseUrl}/browse/presets/${item.slug}`,
        lastModified: new Date(item.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch presets', error)
  }

  // 6. Static routes
  const staticRoutes = [
    '',
    '/browse/packs',
    '/browse/presets',
    '/library',
    '/faq',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
    '/refund-policy',
    '/dmca',
    '/blog',
    '/careers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }))

  return [
    ...staticRoutes, 
    ...packEntries, 
    ...softwareEntries, 
    ...blogEntries, 
    ...genreEntries,
    ...presetEntries
  ]
}
