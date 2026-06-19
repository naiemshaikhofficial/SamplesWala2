import { Metadata } from 'next'

// Short, highly-focused brand/site-level keywords for global pages (prevents keyword stuffing)
const DEFAULT_KEYWORDS = [
  'sample packs',
  'music samples',
  'Indian samples',
  'royalty free loops',
  'Samples Wala',
  'Sample Wala',
  'Samplewala',
  'sampleswala',
  'sampleswala.com',
  'hip hop drum kits',
  'splice alternative',
  'sound kits',
  'trap samples',
  'presets for serum',
  'lofi sample pack',
  'synth presets'
]

// --- Dynamic Niche Keyword Resource Dictionary ---
const NICHE_KEYWORDS = {
  trap: [
    'trap loops', 'trap samples', 'drum loops', '808 samples', '808 loops', '808 kit',
    'trap drum kit', 'best loops for rap', 'best loops for hip hop', 'cymatics loops',
    'cymatics alternative', 'looperman alternative', 'free looperman samples', 'splice alternative'
  ],
  bollywood: [
    'bollywood loops', 'bollywood vocals', 'indian vocal samples', 'desi loops',
    'desi samples', 'punjabi loops', 'punjabi drill samples', 'punjabi trap loops',
    'hindi sample pack', 'hindi loops', 'indian trap loops', 'indian melodies',
    'indian melody loops', 'desi melody loops', 'mumbai samples', 'indian producer sounds',
    'kshmr indian loops', 'splice indian loops', 'cymatics indian samples', 'loopmasters indian loops',
    'best splice alternative', 'indian splice'
  ],
  vocal: [
    'vocal chops', 'vocal loops', 'female vocal samples', 'male vocal samples',
    'vocal textures', 'vocal fx', 'vocal sample pack', 'vocal presets',
    'splice vocal samples', 'best indian samples splice', 'output arcade samples', 'arcade by output alternative'
  ],
  rnb: [
    'rnb', 'r&b', 'rnb loops', 'r&b loops', 'rnb sample pack', 'rnb samples',
    'soul loops', 'funk loops', 'lofi loops', 'splice alternative', 'best splice alternative'
  ],
  edm: [
    'edm', 'house', 'techno', 'afrobeats', 'amapiano', 'future bass', 'synthwave',
    'dubstep', 'synth loops', 'splice alternative', 'better than splice', 'loopcloud alternative'
  ]
}

/**
 * Generates super-focused dynamic keywords using natural language title-parsing.
 * Generates precise phrase variations of the product name + target niche keywords,
 * while strictly excluding completely unrelated keywords (e.g. no "bhajan" on a Trap page).
 */
export function generateSmartKeywords(title: string, category: string): string[] {
  const titleClean = title.replace(/[^\w\s-]/gi, '').toLowerCase()
  const words = titleClean.split(/\s+/).filter(w => w.length > 2 && !['pack', 'vol', 'volume', 'essentials', 'sample', 'loops', 'preset', 'presets', 'wav'].includes(w))
  
  const categoryClean = category.replace(/[^\w\s-]/gi, '').toLowerCase()
  const catWords = categoryClean.split(/\s+/).filter(w => w.length > 2 && !['pack', 'samples', 'loops'].includes(w))

  const generated: string[] = []

  // 1. Generate exact phrase matching variations based on title words
  if (words.length > 0) {
    words.forEach(word => {
      generated.push(`${word} loops`)
      generated.push(`${word} samples`)
      generated.push(`${word} sample pack`)
    })

    if (words.length >= 2) {
      const phrase = words.slice(0, 2).join(' ')
      generated.push(`${phrase} loops`)
      generated.push(`${phrase} samples`)
      generated.push(`${phrase} sample pack`)
      generated.push(`${phrase} kit`)
    }
  }

  // 2. Scan content categories and dynamically match correct niche keyword blocks
  const combinedText = `${titleClean} ${categoryClean}`
  
  if (combinedText.includes('trap') || combinedText.includes('drill') || combinedText.includes('808') || combinedText.includes('hip') || combinedText.includes('rap') || combinedText.includes('beat')) {
    generated.push(...NICHE_KEYWORDS.trap)
  }
  
  if (combinedText.includes('bollywood') || combinedText.includes('indian') || combinedText.includes('desi') || combinedText.includes('punjabi') || combinedText.includes('tabla') || combinedText.includes('sitar') || combinedText.includes('dholak') || combinedText.includes('sarangi') || combinedText.includes('flute')) {
    generated.push(...NICHE_KEYWORDS.bollywood)
  }
  
  if (combinedText.includes('vocal') || combinedText.includes('sing') || combinedText.includes('choir') || combinedText.includes('acapella') || combinedText.includes('vocal chops')) {
    generated.push(...NICHE_KEYWORDS.vocal)
  }
  
  if (combinedText.includes('rnb') || combinedText.includes('r&b') || combinedText.includes('soul') || combinedText.includes('chill') || combinedText.includes('lofi') || combinedText.includes('jazz')) {
    generated.push(...NICHE_KEYWORDS.rnb)
  }
  
  if (combinedText.includes('edm') || combinedText.includes('house') || combinedText.includes('techno') || combinedText.includes('synth') || combinedText.includes('future') || combinedText.includes('bass') || combinedText.includes('dance')) {
    generated.push(...NICHE_KEYWORDS.edm)
  }

  return [...new Set(generated)]
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
    authors: [{ name: "Samples Wala", url: "https://sampleswala.com" }],
    creator: "Samples Wala",
    publisher: "Samples Wala",
    category: "Music",
    classification: "Music Production, Hip Hop, Sample Packs, Royalty Free Loops",
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

function cleanDescriptionText(text: string): string {
  if (!text) return ''
  return text
    .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
    .replace(/\s+/g, " ")           // Collapse multiple spaces/newlines
    .trim()
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
  const description = cleanDescriptionText(
    pack.description || `${pack.name} - A premium ${categoryName} sample pack by Samples Wala. ${contentSummary}${countString}. Professional quality, 100% royalty-free for your music production.`
  )

  // Dynamically extract super-focused exact phrase keywords
  const focusedKeywords = generateSmartKeywords(pack.name, categoryName)

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
    keywords: focusedKeywords,
    path: `/packs/${pack.slug}`
  })
}

export function generatePresetMetadata(preset: any): Metadata {
  const dawName = preset.daws?.[0] || 'FL Studio'
  const siteTitle = "Samples Wala"
  
  const description = cleanDescriptionText(
    preset.description || `${preset.name} - A professional ${preset.type} preset for ${dawName} by Samples Wala. 100% royalty-free, high-quality mixing chains and templates for modern music production.`
  )

  // Dynamically extract super-focused exact phrase keywords
  const focusedKeywords = generateSmartKeywords(preset.name, `${preset.type} preset ${dawName}`)

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
    keywords: focusedKeywords,
    path: `/browse/presets/${preset.slug}`
  })
}
