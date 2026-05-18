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
  'smple',
  'smples',
  'sample wala',
  'samples wala',
  'music sample',
  'music samples',
  'smple wala',
  'smplewala',

  'hophop',
  'hiphop',
  'hip hop',
  'pop',
  'pop loop',
  'pop loops',
  'hiphop loop',
  'hiphop loops',
  'hophop loop',
  'hophop loops',
  'rap loops',
  'trap loops',
  'lofi loops',
  'synth loops',
  'keyboard loops',
  'percussion loops',
  'indian pop loops',

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
  path
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

  // Use Vercel's Dynamic OG API by default
  let imageUrl = image;
  if (!image.startsWith('http')) {
    const ogUrl = new URL('/api/og', 'https://sampleswala.com')
    ogUrl.searchParams.set('title', title)
    ogUrl.searchParams.set('category', 'Premium Samples')

    // If it's a specific image path but not absolute, we could pass it to the OG API
    // but for now, let's just use the dynamic generator for everything that's not a full URL
    imageUrl = ogUrl.pathname + ogUrl.search
  }

  return {
    title: fullTitle,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    metadataBase: new URL('https://sampleswala.com'),
    openGraph: {
      title: fullTitle,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
      siteName: siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
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
    alternates: path ? {
      canonical: path,
    } : undefined
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

  // Construct Dynamic OG Image URL
  const ogUrl = new URL('https://sampleswala.com/api/og')
  ogUrl.searchParams.set('title', pack.name)
  ogUrl.searchParams.set('category', categoryName)
  ogUrl.searchParams.set('price', pack.price_inr?.toString() || '')
  if (pack.cover_url) {
    const fullCoverUrl = pack.cover_url.startsWith('http')
      ? pack.cover_url
      : `https://sampleswala.com${pack.cover_url}`
    ogUrl.searchParams.set('image', fullCoverUrl)
  }

  return generatePageMetadata({
    title: `${pack.name} - Premium ${categoryName} Pack`,
    description: description.slice(0, 160),
    image: ogUrl.toString(),
    keywords,
    path: `/packs/${pack.slug}`
  })
}

export function generatePresetMetadata(preset: any): Metadata {
  const dawName = preset.daws?.[0] || 'FL Studio'
  const siteTitle = "Samples Wala"

  const description = preset.description || `${preset.name} - A professional ${preset.type} preset for ${dawName} by Samples Wala. 100% royalty-free, high-quality mixing chains and templates for modern music production.`

  const keywords = [
    `${preset.name} preset`,
    `${preset.name} ${dawName}`,
    `${preset.type} preset`,
    ...preset.daws.map((d: string) => `${d} presets`),
    'Indian vocal presets',
    'professional mixing chains',
    'royalty free presets',
    'FL Studio vocal presets',
    'Ableton producer kits'
  ]

  // Construct Dynamic OG Image URL
  const ogUrl = new URL('https://sampleswala.com/api/og')
  ogUrl.searchParams.set('title', preset.name)
  ogUrl.searchParams.set('category', `${preset.type} Preset`)
  ogUrl.searchParams.set('price', preset.price_inr?.toString() || '0')
  if (preset.cover_url) {
    const fullCoverUrl = preset.cover_url.startsWith('http')
      ? preset.cover_url
      : `https://sampleswala.com${preset.cover_url}`
    ogUrl.searchParams.set('image', fullCoverUrl)
  }

  return generatePageMetadata({
    title: `${preset.name} | ${preset.type} Preset for ${dawName}`,
    description: description.slice(0, 160),
    image: ogUrl.toString(),
    keywords,
    path: `/browse/presets/${preset.slug}`
  })
}
