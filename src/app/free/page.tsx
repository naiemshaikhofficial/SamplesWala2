import React from 'react'
import { getFreeItems } from '@/app/browse/actions'
import { FreeClient } from '@/components/FreeClient'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { Gift, Sparkles, ShieldCheck, Zap } from 'lucide-react'

export const revalidate = false

export const metadata = generatePageMetadata({
  title: '100% Free Sample Packs, Indian Loops & Presets | SamplesWala',
  description: 'Download 100% free Indian sample packs, street rhythm loops, and music producer presets. No credit card required. 100% royalty-free for commercial use on Spotify, YouTube & film scores.',
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
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-16 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-8 pb-12 border-b-4 border-black text-center space-y-6">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00FF94]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Comic Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00FF94] text-black border-2 border-black shadow-[4px_4px_0px_black] -rotate-2">
          <Gift size={16} className="animate-bounce" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            SAMPLESWALA FREE VAULT • ZERO COST
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            100% FREE <span className="text-[#00FF94] drop-shadow-[4px_4px_0px_#000]">SOUNDS</span> &amp; <span className="text-studio-yellow drop-shadow-[4px_4px_0px_#000]">PRESETS</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-bold text-white/60 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            Download high-energy Indian rhythms, percussion loops, and production presets completely free. 
            Commercial royalty-free license included for all creators.
          </p>
        </div>

        {/* Three Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/60 border border-white/10 rounded-full text-white/80">
            <Sparkles size={13} className="text-[#00FF94]" />
            <span className="text-[10px] font-black uppercase tracking-wider">No Credit Card Needed</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/60 border border-white/10 rounded-full text-white/80">
            <ShieldCheck size={13} className="text-studio-yellow" />
            <span className="text-[10px] font-black uppercase tracking-wider">Commercial Royalty-Free</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/60 border border-white/10 rounded-full text-white/80">
            <Zap size={13} className="text-studio-neon" />
            <span className="text-[10px] font-black uppercase tracking-wider">24-Bit WAV Audio</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Free Client */}
      <FreeClient initialPacks={packs} initialPresets={presets} />
    </div>
  )
}
