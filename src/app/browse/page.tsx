import React from 'react'
import { getPacks } from './actions'
import Image from 'next/image'
import Link from 'next/link'

import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Professional Indian Sample Packs Library',
  description: 'Explore our curated library of premium Indian sample packs, Bollywood loops, and Hip-Hop kits. All sounds are 100% royalty-free and production-ready.',
  keywords: ['Indian sample packs', 'Bollywood loops', 'hip hop kits', 'music library', 'percussion samples', 'VST plugins', 'music production tools', 'Ableton live packs', 'FL Studio loops']
})

import { BrowseLibrary } from '@/components/BrowseLibrary'

export default async function BrowsePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q } = await searchParams
  const packs = await getPacks()

  return (
    <div className="container mx-auto px-4 py-20 space-y-20">
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center border-b border-white/5 pb-12 gap-6">
          <div className="space-y-3">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Sound Library</h2>
            <p className="text-[10px] md:text-sm font-bold text-white/20 uppercase tracking-[0.3em]">Premium sounds for your next hit</p>
          </div>
        </div>



        <BrowseLibrary initialPacks={packs} searchQuery={q} />
      </section>
    </div>
  )
}
