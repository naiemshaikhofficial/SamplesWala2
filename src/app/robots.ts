import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/checkout/success',
        '/checkout/cancel',
        '/admin/',
      ],
    },
    sitemap: 'https://sampleswala.com/sitemap.xml',
  }
}
