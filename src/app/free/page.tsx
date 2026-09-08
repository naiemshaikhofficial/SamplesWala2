import React from 'react'
import { getFreeItems } from '@/app/browse/actions'
import { FreeClient } from '@/components/FreeClient'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { ShieldCheck, Zap, Download } from 'lucide-react'

export const revalidate = false

export const metadata = generatePageMetadata({
  title: 'Free Sample Packs, Indian Loops & Presets | SamplesWala',
  description: 'Download free Indian sample packs, street rhythm loops, and music producer presets. Commercial royalty-free license included for Spotify, YouTube & film scores.',
  keywords: [
    'Free sample packs',
    'Free Indian loops',
    'Free rhythm samples',
    'Free desi percussion',
    'Free FL Studio presets',
    'Free serum presets',
    'Royalty free freebies',
    'SamplesWala free'
  ],
  path: '/free'
})

export default async function FreePage() {
  const { packs, presets } = await getFreeItems()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Free Sounds & Packs', item: 'https://sampleswala.com/free' }
  ])

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 space-y-12 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-4 pb-10 border-b-2 border-white/10 text-center space-y-5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#00FF94]">
          CATALOG ARCHIVE
        </span>

        {/* Main Headline */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-tight">
            FREE <span className="text-studio-yellow">SOUNDS &amp; PRESETS</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-medium text-white/60 max-w-2xl mx-auto leading-relaxed">
            High-grade Indian rhythms, percussion loops, and music production presets.
            Commercial royalty-free license included for all creators.
          </p>
        </div>

        {/* Subtle Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#141418] border border-white/10 rounded-full text-white/70">
            <ShieldCheck size={13} className="text-[#00FF94]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Commercial Royalty-Free</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#141418] border border-white/10 rounded-full text-white/70">
            <Zap size={13} className="text-studio-yellow" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">24-Bit WAV Stems</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#141418] border border-white/10 rounded-full text-white/70">
            <Download size={13} className="text-white/80" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Instant Access</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Free Client */}
      <FreeClient initialPacks={packs} initialPresets={presets} />
    </div>
  )
}
