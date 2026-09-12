import React, { Suspense } from 'react'
import { getPacks, getAllCategories, getPresets } from './actions'
import Link from 'next/link'
import { Music, Sparkles } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { generateBreadcrumbData, generateFaqStructuredData } from '@/lib/seo/structuredData'
import { FlashSalePromo } from '@/components/FlashSalePromo'
import { BrowseClientView } from '@/components/BrowseClientView'

// 🟢 SUPABASE WEBHOOK CACHE:
// Statically generated and cached indefinitely at the Edge.
// Purged & regenerated on-demand when Supabase triggers/webhooks hit /api/revalidate (tag: 'packs', 'presets', 'categories').
export const revalidate = false

export const metadata = generatePageMetadata({
  title: 'Indian Sample Packs, Royalty-Free Loops & Presets (24-Bit WAV) | SamplesWala',
  description: 'Download 100% royalty-free Indian sample packs, Bollywood vocal stacks, tabla & dholak loops, and producer presets in studio-grade 24-bit WAV for FL Studio, Ableton & Logic Pro.',
  keywords: [
    'Indian sample packs',
    'Bollywood loops',
    'Indian vocal samples',
    'tabla loops free download',
    'dholak loops WAV',
    'royalty free indian samples',
    'FL Studio presets',
    'punjabi drum kit',
    'desi melody loops',
    'best indian sample library',
    'SamplesWala'
  ],
  path: '/browse'
})

export default async function BrowsePage() {
  // Parallelize fetching of cached data
  const [categories, packs, presets] = await Promise.all([
    getAllCategories(),
    getPacks(),
    getPresets()
  ])

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse', item: 'https://sampleswala.com/browse' }
  ])

  const faqData = generateFaqStructuredData([
    {
      q: 'What makes SamplesWala Indian sample packs different?',
      a: 'SamplesWala delivers studio-recorded, high-fidelity Indian instruments (tabla, dholak, bansuri, sarangi) and authentic Bollywood vocal stacks in pristine 24-bit WAV format, mixed specifically for modern hip-hop, drill, trap, and electronic producers.'
    },
    {
      q: 'Are all sample packs and loops 100% royalty-free?',
      a: 'Yes. Every sound is 100% royalty-free for commercial use in monetized YouTube videos, Spotify and Apple Music streaming releases, beat leasing, and sync licensing without paying any royalties or split sheets.'
    },
    {
      q: 'Which DAWs are compatible with these samples?',
      a: 'All files are delivered as standard 24-bit 44.1kHz WAV files and are compatible with all digital audio workstations including FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, and Reaper.'
    }
  ])

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />

      <Suspense fallback={<BrowseFallback packs={packs} categories={categories} />}>
        <BrowseClientView 
          initialPacks={packs} 
          initialPresets={presets} 
          categories={categories} 
        />
      </Suspense>
    </div>
  )
}

function BrowseFallback({ packs, categories }: { packs: any[], categories: any[] }) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-16">
        <Link 
          href="/browse/packs"
          prefetch={false}
          className="flex-1 h-14 md:h-20 flex items-center justify-center gap-3 md:gap-4 border-4 border-black text-lg md:text-2xl font-black uppercase italic tracking-tighter transition-all bg-studio-yellow text-black shadow-[4px_4px_0px_black] md:shadow-[8px_8px_0px_black] -translate-y-1"
        >
          <Music size={20} className="md:w-7 md:h-7" />
          Sample Packs
          <span className="ml-1 md:ml-2 text-[8px] md:text-xs bg-black text-studio-yellow px-1 md:px-2 py-0.5 border-2 border-black rotate-12">NEW</span>
        </Link>
        
        <Link 
          href="/browse/presets"
          prefetch={false}
          className="flex-1 h-14 md:h-20 flex items-center justify-center gap-3 md:gap-4 border-4 border-black text-lg md:text-2xl font-black uppercase italic tracking-tighter transition-all bg-studio-charcoal text-white/40 hover:text-white hover:bg-studio-charcoal/80"
        >
          <Sparkles size={20} className="md:w-7 md:h-7" />
          Producer Presets
          <span className="ml-1 md:ml-2 text-[8px] md:text-xs bg-black text-studio-pink px-1 md:px-2 py-0.5 border-2 border-black rotate-12">HOT</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <aside className="lg:col-span-3 lg:sticky lg:top-32 space-y-8 order-2 lg:order-1">
          <div className="bg-black border-4 border-black shadow-[8px_8px_0px_rgba(255,200,0,1)] p-6 space-y-6 jagged-border">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Quick Filters.</h2>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Narrow down your sound</p>
            </div>

            <div className="space-y-3">
              <Link 
                href="/browse?type=packs"
                prefetch={false}
                className="block w-full p-3 bg-white/5 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all"
              >
                All Genres
              </Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/browse/genre/${cat.slug}?type=packs`}
                  prefetch={false}
                  className="block w-full p-3 bg-white/5 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <FlashSalePromo type="packs" />
        </aside>

        <main className="lg:col-span-9 order-1 lg:order-2 min-h-[600px]">
          <div className="space-y-12">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                Premium <span className="text-studio-yellow">Packs.</span>
              </h1>
              <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Professional Indian Sample Kits & Vocal Stacks</p>
            </div>
            <BrowseLibrary initialPacks={packs} />
          </div>
        </main>
      </div>
    </>
  )
}
