import React from 'react'
import { getPacks } from './actions'
import Image from 'next/image'
import Link from 'next/link'

import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Indian Sample Packs Library | Professional Sound Kits',
  description: 'Download the best Indian sample packs, Bollywood loops, and ethnic sound kits. Over 50+ professional musicians contributing 100% royalty-free sounds for your hits.',
  keywords: ['Indian sample packs', 'Bollywood loops', 'hip hop kits', 'music library', 'percussion samples', 'VST plugins', 'music production tools', 'Ableton live packs', 'FL Studio loops', 'tabla loops', 'sitar samples'],
  path: '/browse'
})

import { BrowseLibrary } from '@/components/BrowseLibrary'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'

export default async function BrowsePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q } = await searchParams
  const packs = await getPacks()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse Library', item: 'https://sampleswala.com/browse' }
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
              Sound <span className="text-studio-yellow">Library.</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.3em]">Premium sounds for your next hit</p>
          </div>
        </div>



        <BrowseLibrary initialPacks={packs} searchQuery={q} />
      </section>
    </div>
  )
}
