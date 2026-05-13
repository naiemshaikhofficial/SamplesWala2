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
  'Samples Wala',
  'Sample Wala',
  'Samplewala',
  'sampleswala',
  'samples-wala',

  'Indian percussion loops',
  'sitar samples',
  'tabla loops',
  'tabla loops for fl studio',
  'dholak loops',
  'dhol loops',
  'indian vocal samples',
  'bhojpuri vocal samples',
  'hindi vocals',
  'sitar samples for ableton',
  'flute bansuri loops',
  'sarangi samples',
  'indian transition sound effects',
  'splice alternative india',
  'professional wav loops',
  'high definition audio samples',
  'daw ready sounds',
  'best indian sample library',
  'vst plugins',
  'au plugins',
  'music production software',
  'ableton live packs',
  'fl studio indian loops',
  'logic pro sound kits',
  'contact instruments india',
  'professional music production samples',
  'indian music theory',
  'world music samples',
  
  'music tools',
  'free vst tools',
  'premium sounds',
  'digital audio workstation',
  'music creator tools',
  'audio production gear',
  'music production assets',
  'sound kits india',
  'music producer essentials'
]

export function generatePageMetadata({
  title,
  description,
  image = '/og-image.jpg',
  noIndex = false,
  keywords = [],
  path = '/'
}: {
  title: string
  description: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
  path?: string
}): Metadata {
  const siteTitle = "Samples Wala"
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
      canonical: path,
    }
  }
}
