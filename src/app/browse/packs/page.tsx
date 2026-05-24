import React from 'react'
import { getPacks } from '../actions'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import Link from 'next/link'

export const revalidate = false

export const metadata = generatePageMetadata({
  title: 'Premium Sample Packs & Loops | SamplesWala',
  description: 'Download high-quality Indian sample packs, vocal stacks, and curated collections for Bollywood, Hip-Hop, and Electronic music. 100% royalty-free.',
  keywords: ['Indian sample packs', 'Bollywood loops', 'Hip-Hop sample kits', 'Royalty free samples', 'Vocal stacks', 'Indian music production'],
  path: '/browse/packs'
})

export default async function PacksPage() {
  const packs = await getPacks()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse Library', item: 'https://sampleswala.com/browse' },
    { name: 'Sample Packs', item: 'https://sampleswala.com/browse/packs' }
  ])

  return (
    <div className="container mx-auto px-4 py-20 space-y-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center border-b border-white/5 pb-12 gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              Sample <span className="text-studio-yellow">Packs.</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.3em]">Premium High-Fidelity Audio Artifacts</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            <Link 
              href="/browse/packs"
              className="px-4 py-2 bg-studio-yellow text-black border-2 border-black shadow-[4px_4px_0px_black] text-[10px] font-black uppercase tracking-widest transition-all rounded-sm -rotate-1"
            >
              All Packs
            </Link>
            <Link 
              href="/browse/presets"
              className="px-4 py-2 bg-white/10 border-2 border-black text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-studio-pink hover:text-white hover:shadow-[4px_4px_0px_black] transition-all rounded-sm hover:-rotate-1"
            >
              Producer Presets
            </Link>
          </div>
        </div>

        <div className="min-h-[600px]">
           <BrowseLibrary initialPacks={packs} />
        </div>
      </section>
    </div>
  )
}
