import React from 'react'
import { getFreeItems } from '@/app/browse/actions'
import { FreeClient } from '@/components/FreeClient'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData, generateFreeCollectionStructuredData, generateFaqStructuredData } from '@/lib/seo/structuredData'

export const revalidate = false

export const metadata = generatePageMetadata({
  title: 'Free Sample Packs, Drum Kits & Sounds (2026) — Royalty-Free | SamplesWala',
  description:
    'Download free sample packs, drum kits, trap loops, rhythm stems & presets for music producers worldwide. 100% royalty-free for commercial releases on Spotify, YouTube, FL Studio & all DAWs.',
  keywords: [
    'free sample packs',
    'free drum kits',
    'free sample packs 2026',
    'royalty free sample packs',
    'free loops download',
    'free trap samples',
    'free drill loops',
    'free FL Studio presets',
    'free Indian percussion loops',
    'free rhythm samples',
    'free sounds for music producers',
    'best free sample packs',
    'SamplesWala free vault',
  ],
  path: '/free',
})

const GLOBAL_FREE_FAQS = [
  {
    q: 'Are all sample packs on SamplesWala 100% royalty-free for commercial use?',
    a: 'Yes! Every free sample pack, drum kit, rhythm loop, and preset downloaded from SamplesWala is 100% royalty-free for commercial music releases on Spotify, Apple Music, YouTube monetization, and beat sales with zero royalties or license fees.',
  },
  {
    q: 'Which DAWs are compatible with these free sounds?',
    a: 'All audio samples are delivered in industry-standard 24-bit 44.1kHz WAV format, universally compatible with FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, Pro Tools, and Reaper.',
  },
  {
    q: 'Do I have to give copyright credit or attribution?',
    a: 'No copyright attribution is legally required. You keep 100% of your master rights, streaming royalties, and publishing revenue generated from your tracks.',
  },
]

export default async function FreePage() {
  const { packs, presets } = await getFreeItems()

  const allItems = [
    ...packs.map((p) => ({ ...p, itemType: 'pack' })),
    ...presets.map((pr) => ({ ...pr, itemType: 'preset' })),
  ]

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Free Sounds', item: 'https://sampleswala.com/free' },
  ])

  const collectionSchema = generateFreeCollectionStructuredData(allItems)
  const faqSchema = generateFaqStructuredData(GLOBAL_FREE_FAQS)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 space-y-10 select-none">
      {/* Google SEO JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Clean Minimalist Header */}
      <div className="flex flex-col items-center text-center border-b border-white/5 pb-8 space-y-2">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic">
          Free <span className="text-studio-yellow">Sounds.</span>
        </h1>
        <p className="text-[11px] sm:text-xs font-bold text-white/40 uppercase tracking-[0.25em]">
          100% Royalty-Free Sample Packs, Loops &amp; Presets Worldwide
        </p>
      </div>

      {/* Client Component */}
      <FreeClient initialPacks={packs} initialPresets={presets} />
    </div>
  )
}
