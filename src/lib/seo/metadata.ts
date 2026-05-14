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
  
  // Ensure absolute image URL for social media
  const absoluteImageUrl = image.startsWith('http') 
    ? image 
    : `https://sampleswala.com${image.startsWith('/') ? '' : '/'}${image}`

  return {
    title: fullTitle,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    metadataBase: new URL('https://sampleswala.com'),
    openGraph: {
      title: fullTitle,
      description,
      images: [{ url: absoluteImageUrl }],
      type: 'website',
      siteName: siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absoluteImageUrl],
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
export function generatePackMetadata(pack: any): Metadata {
  const categoryName = pack.categories?.[0]?.name || 'Samples'
  const siteTitle = "Samples Wala"
  
  // Create a rich, SEO-optimized description
  const contentSummary = pack.total_contents_summary || 'Includes professional loops and samples'
  const counts = []
  if (pack.melody_count > 0) counts.push(`${pack.melody_count} Melodies`)
  if (pack.loop_count > 0) counts.push(`${pack.loop_count} Loops`)
  if (pack.one_shot_count > 0) counts.push(`${pack.one_shot_count} One-shots`)
  if (pack.preset_count > 0) counts.push(`${pack.preset_count} Presets`)
  
  const countString = counts.length > 0 ? ` featuring ${counts.join(', ')}` : ''
  const description = pack.description || `${pack.name} - A premium ${categoryName} sample pack by Samples Wala. ${contentSummary}${countString}. Professional quality, 100% royalty-free for your music production.`

  const keywords = [
    `${pack.name} sample pack`,
    `${pack.name} loops`,
    `${pack.name} sounds`,
    `${categoryName} samples`,
    `Indian ${categoryName}`,
    'professional sample pack',
    'royalty free loops',
    'music production',
    'DAW ready',
    'high quality wav'
  ]

  return generatePageMetadata({
    title: `${pack.name} - Premium ${categoryName} Pack`,
    description: description.slice(0, 160), // Keep description under 160 chars for SEO
    image: pack.cover_url || '/og-image.jpg',
    keywords,
    path: `/packs/${pack.slug}`
  })
}
