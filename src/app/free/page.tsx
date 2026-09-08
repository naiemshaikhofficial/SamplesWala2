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
    a: 'Yes! Every free sample pack, drum kit, rhythm loop, and preset downloaded from SamplesWala is 100% royalty-free. You can use them freely in commercial music releases on Spotify, Apple Music, YouTube monetization, BeatStars beat sales, TV/film sync, and radio broadcasts without paying any royalties or license fees.',
  },
  {
    q: 'Which DAWs (Digital Audio Workstations) are compatible with these free sounds?',
    a: 'All audio samples are delivered in industry-standard 24-bit 44.1kHz WAV format, universally compatible with FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, Pro Tools, Reaper, Bitwig Studio, GarageBand, and all major mobile & desktop DAWs.',
  },
  {
    q: 'Do I have to give copyright credit or attribution?',
    a: 'No copyright attribution is legally required. You keep 100% of your master rights, streaming royalties, and publishing revenue generated from your tracks.',
  },
  {
    q: 'What music genres are covered in the free sound library?',
    a: 'Our catalog features global Hip-Hop, Trap, UK Drill, Indian Street Rhythms, Desi Hip-Hop, Afrobeat, EDM, Lo-Fi, Cinematic Percussion, and FL Studio/Serum mixing presets.',
  },
  {
    q: 'How do I download and claim free sample packs?',
    a: 'Simply click on any sound kit or preset to open its page, then tap "Claim Free Download". You will receive an instant direct download link, and the pack will automatically sync to your SamplesWala cloud library for lifetime access.',
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
    { name: 'Free Sounds & Sample Packs', item: 'https://sampleswala.com/free' },
  ])

  const collectionSchema = generateFreeCollectionStructuredData(allItems)
  const faqSchema = generateFaqStructuredData(GLOBAL_FREE_FAQS)

  return (
    <div className="w-full bg-[#0d0d10] min-h-screen text-white select-none pb-20">
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

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <FreeClient initialPacks={packs} initialPresets={presets} faqs={GLOBAL_FREE_FAQS} />
      </main>
    </div>
  )
}
