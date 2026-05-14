import { MetadataRoute } from 'next'
import { getPacks } from '@/app/browse/actions'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sampleswala.com'
  const supabase = getAdminClient()

  // 1. Fetch all packs for dynamic routes
  const packs = await getPacks()
  const packEntries = packs.map((pack) => ({
    url: `${baseUrl}/packs/${pack.slug}`,
    lastModified: new Date(pack.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 2. Fetch all software products
  const { data: software } = await supabase
    .from('software_products')
    .select('slug, updated_at')
    .eq('is_active', true)
  
  const softwareEntries = (software || []).map((item) => ({
    url: `${baseUrl}/software/${item.slug}`,
    lastModified: new Date(item.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

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

  // 4. Static routes
  const staticRoutes = [
    '',
    '/browse',
    '/library',
    '/faq',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
    '/blog',
    '/careers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }))

  return [...staticRoutes, ...packEntries, ...softwareEntries, ...blogEntries]
}
