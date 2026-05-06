import React from 'react'
import { getPacks } from './actions'
import Image from 'next/image'
import Link from 'next/link'

import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Professional Indian Sample Packs Library',
  description: 'Explore our curated library of premium Indian sample packs, Bollywood loops, and Hip-Hop kits. All sounds are 100% royalty-free and production-ready.',
  keywords: ['Indian sample packs', 'Bollywood loops', 'hip hop kits', 'music library', 'percussion samples']
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
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-4">
          <div className="space-y-2">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Sound Library</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Industry-grade curated collections</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[9px] font-black text-white/20 uppercase bg-white/5 px-3 py-1 rounded-xs border border-white/5">
                DATABASE: <span className="text-white">SYNCHRONIZED</span>
             </div>
          </div>
        </div>

        <BrowseLibrary initialPacks={packs} searchQuery={q} />
      </section>
    </div>
  )
}
