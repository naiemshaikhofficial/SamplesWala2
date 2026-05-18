import { Metadata } from 'next'

// Broad, brand/site-level keywords for global pages (to avoid keyword stuffing)
const DEFAULT_KEYWORDS = [
  'sample packs',
  'samples',
  'loops',
  'music production tools',
  'Samples Wala',
  'Sample Wala',
  'Samplewala',
  'sampleswala',
  'samples-wala',
  'samplewala.com',
  'sampleswala.com',
  'free sample packs',
  'royalty free samples',
  'best indian sample library'
]

// --- Category Specific Keywords ---
const CATEGORY_KEYWORDS = {
  trap: [
    'beat samples', 'beat loops', 'type beat samples', 'type beat loops',
    'drum loops', 'drum kits', '808 samples', '808 loops', '808 kit',
    'trap drum kit', 'best loops for rap', 'best loops for hip hop',
    'uk drill samples', 'melodic drill loops', 'phonk loops', 'jersey club samples',
    'trap', 'drill', 'hip hop', 'hip hop drum kit', 'rap loops', 'trap loops'
  ],
  bollywood: [
    'bollywood loops', 'bollywood vocals', 'indian vocal samples',
    'bhojpuri vocal samples', 'hindi vocals', 'sitar samples',
    'tabla loops', 'dholak loops', 'dhol loops', 'desi samples',
    'desi loops', 'desi vocal samples', 'punjabi loops', 'punjabi drill samples',
    'hindi sample pack', 'hindi loops', 'indian trap loops', 'indian melodies',
    'indian melody loops', 'desi melody loops', 'mumbai samples', 'indian producer sounds',
    'Indian percussion loops', 'sitar samples for ableton', 'flute bansuri loops',
    'sarangi samples', 'sufi', 'ghazal', 'bhajan', 'garba', 'bollywood'
  ],
  vocal: [
    'vocal chops', 'vocal loops', 'female vocal samples', 'male vocal samples',
    'vocal textures', 'vocal one shots', 'vocal fx', 'vocal sample pack',
    'vocal presets', 'hindi vocals', 'desi vocal samples', 'bollywood vocals'
  ],
  rnb: [
    'rnb', 'r&b', 'rhythm and blues', 'rnb loops', 'r&b loops',
    'rnb sample pack', 'rnb samples', 'soul', 'funk', 'jazz',
    'acoustic', 'r&b chord progressions'
  ],
  edm: [
    'edm', 'house', 'techno', 'afrobeats', 'amapiano', 'reggae',
    'dancehall', 'future bass', 'synthwave', 'dubstep', 'ambient',
    'synth loops', 'keyboard loops'
  ]
}

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
  
  let imageUrl = image;
  if (!image.startsWith('http')) {
    const ogUrl = new URL('/api/og', 'https://sampleswala.com')
    ogUrl.searchParams.set('title', title)
    ogUrl.searchParams.set('category', 'Premium Samples')
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
  
  const contentSummary = pack.total_contents_summary || 'Includes professional loops and samples'
  const counts = []
  if (pack.melody_count > 0) counts.push(`${pack.melody_count} Melodies`)
  if (pack.loop_count > 0) counts.push(`${pack.loop_count} Loops`)
  if (pack.one_shot_count > 0) counts.push(`${pack.one_shot_count} One-shots`)
  if (pack.preset_count > 0) counts.push(`${pack.preset_count} Presets`)
  
  const countString = counts.length > 0 ? ` featuring ${counts.join(', ')}` : ''
  const description = pack.description || `${pack.name} - A premium ${categoryName} sample pack by Samples Wala. ${contentSummary}${countString}. Professional quality, 100% royalty-free for your music production.`

  // 1. Gather dynamic niche keywords based on category & name
  const categoryLower = categoryName.toLowerCase()
  const nameLower = pack.name.toLowerCase()
  
  const focusedKeywords: string[] = [
    `${pack.name} sample pack`,
    `${pack.name} loops`,
    `${pack.name} sounds`,
    `${categoryName} samples`,
    `Indian ${categoryName}`,
    'professional sample pack',
    'royalty free loops',
    'wav loops',
    'stems',
    'zip sample pack'
  ]

  // Inject only related niche keywords
  if (categoryLower.includes('trap') || categoryLower.includes('hip') || categoryLower.includes('drill') || nameLower.includes('trap') || nameLower.includes('drill') || nameLower.includes('808')) {
    focusedKeywords.push(...CATEGORY_KEYWORDS.trap)
  }
  if (categoryLower.includes('bollywood') || categoryLower.includes('indian') || categoryLower.includes('desi') || categoryLower.includes('tabla') || categoryLower.includes('sitar') || categoryLower.includes('vocal') || nameLower.includes('bollywood') || nameLower.includes('tabla') || nameLower.includes('sitar') || nameLower.includes('dholak') || nameLower.includes('vocal')) {
    focusedKeywords.push(...CATEGORY_KEYWORDS.bollywood)
  }
  if (categoryLower.includes('vocal') || nameLower.includes('vocal') || nameLower.includes('singing') || nameLower.includes('acapella')) {
    focusedKeywords.push(...CATEGORY_KEYWORDS.vocal)
  }
  if (categoryLower.includes('rnb') || nameLower.includes('rnb') || nameLower.includes('r&b') || nameLower.includes('soul') || nameLower.includes('chill')) {
    focusedKeywords.push(...CATEGORY_KEYWORDS.rnb)
  }
  if (categoryLower.includes('edm') || categoryLower.includes('house') || categoryLower.includes('lofi') || nameLower.includes('edm') || nameLower.includes('house') || nameLower.includes('lofi') || nameLower.includes('synth')) {
    focusedKeywords.push(...CATEGORY_KEYWORDS.edm)
  }

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
    keywords: [...new Set(focusedKeywords)],
    path: `/packs/${pack.slug}`
  })
}

export function generatePresetMetadata(preset: any): Metadata {
  const dawName = preset.daws?.[0] || 'FL Studio'
  const siteTitle = "Samples Wala"
  
  const description = preset.description || `${preset.name} - A professional ${preset.type} preset for ${dawName} by Samples Wala. 100% royalty-free, high-quality mixing chains and templates for modern music production.`

  const typeLower = preset.type?.toLowerCase() || ''
  const nameLower = preset.name.toLowerCase()
  const daws = preset.daws || []

  const focusedKeywords = [
    `${preset.name} preset`,
    `${preset.name} ${dawName}`,
    `${preset.type} preset`,
    ...daws.map((d: string) => `${d.toLowerCase()} presets`),
    ...daws.map((d: string) => `best presets for ${d.toLowerCase()}`),
    'professional mixing chains',
    'royalty free presets'
  ]

  if (typeLower.includes('vocal') || nameLower.includes('vocal')) {
    focusedKeywords.push('vocal presets', 'fl studio vocal presets', 'vocal mixing chain', 'indian vocal presets', 'preset pack')
  }
  if (typeLower.includes('master') || typeLower.includes('mixing') || nameLower.includes('mastering') || nameLower.includes('mix') || nameLower.includes('chain')) {
    focusedKeywords.push('mastering presets', 'mixing chains', 'professional mixing chains', 'fl studio mastering')
  }

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
    keywords: [...new Set(focusedKeywords)],
    path: `/browse/presets/${preset.slug}`
  })
}
