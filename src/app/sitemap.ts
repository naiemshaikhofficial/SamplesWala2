import { MetadataRoute } from 'next'
import { getPacks } from '@/app/browse/actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sampleswala.com'

  // Fetch all packs for dynamic routes
  const packs = await getPacks()
  
  const packEntries = packs.map((pack) => ({
    url: `${baseUrl}/packs/${pack.slug}`,
    lastModified: new Date(pack.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static routes
  const staticRoutes = [
    '',
    '/browse',
    '/library',
    '/help',
    '/auth',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }))

  return [...staticRoutes, ...packEntries]
}
