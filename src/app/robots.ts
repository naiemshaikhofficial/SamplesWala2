import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
      : 'https://sampleswala.com'

  return {
    rules: [
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/checkout/',
          '/library/',
          '/auth/',
          '/account/',
          '/admin/',
          '/*?key=*',
          '/*?genre=*',
          '/*?mode=*',
          '/*?sort=*',
          '/*?type=*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
