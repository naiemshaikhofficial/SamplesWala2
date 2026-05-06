import { Metadata } from 'next'

const DEFAULT_KEYWORDS = [
  'sample packs',
  'samples', 
  'Indian samples',
  'South Indian samples', 
  'loops', 
  'Bollywood samples', 
  'hip hop sample pack', 
  'lofi samples', 
  'royalty free samples', 
  'music production tools', 
  'Sampleswala',
  'Indian percussion loops',
  'sitar samples',
  'tabla loops'
]

export function generatePageMetadata({
  title,
  description,
  image = '/og-image.jpg',
  noIndex = false,
  keywords = []
}: {
  title: string
  description: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
}): Metadata {
  const siteTitle = "Sampleswala"
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`

  return {
    title: fullTitle,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    metadataBase: new URL('https://sampleswala.com'), // Base for social images
    openGraph: {
      title: fullTitle,
      description,
      images: [{ url: image }],
      type: 'website',
      siteName: siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@sampleswala',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: '/',
    }
  }
}
