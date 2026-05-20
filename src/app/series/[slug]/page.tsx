import React from 'react'
import { getPacksBySeries } from '../../browse/actions'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import Link from 'next/link'
import { generatePageMetadata, generateSmartKeywords } from '@/lib/seo/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { Music, ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  const seriesName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const keywords = generateSmartKeywords(seriesName, seriesName)

  return generatePageMetadata({
    title: `${seriesName} Series | Premium Indian Sample Packs & Loops | SamplesWala`,
    description: `Explore the official ${seriesName} collection. Download premium royalty-free Indian loops, sample kits, and sounds for modern music production.`,
    keywords,
    path: `/series/${slug}`
  })
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params
  
  const seriesName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const packs = await getPacksBySeries(seriesName)

  if (!packs || packs.length === 0) {
    notFound()
  }

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse', item: 'https://sampleswala.com/browse' },
    { name: `${seriesName} Series`, item: `https://sampleswala.com/series/${slug}` }
  ])

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <Link 
        href="/browse" 
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white mb-8 transition-colors"
      >
        <ChevronLeft size={14} />
        Back to all sounds
      </Link>

      {/* Epic Series Title Card */}
      <div className="relative p-8 md:p-16 border-4 border-black bg-black shadow-[8px_8px_0px_rgba(255,200,0,1)] rounded-sm overflow-hidden mb-16 select-none jagged-border">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-studio-yellow/10 blur-[80px] rounded-full z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-studio-red/10 blur-[80px] rounded-full z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-block px-3 py-1 bg-studio-red text-white font-black uppercase text-[8px] md:text-[9px] tracking-[0.3em] shadow-[3px_3px_0px_black] border-2 border-black rotate-[-1.5deg]">
            OFFICIAL SIGNATURE SERIES
          </div>
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text text-white">
            THE {seriesName}.
          </h1>
          <p className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-[0.2em] max-w-2xl border-l-2 border-studio-yellow pl-3">
            A premium collection of high-fidelity Indian folk loops, vocal stacks, and authentic percussion. Built for Bollywood, Hip-Hop, and global crossover productions.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
          <Music size={18} className="text-studio-yellow" />
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Packs in this series ({packs.length})</h2>
        </div>

        <div className="min-h-[500px]">
          <BrowseLibrary initialPacks={packs} />
        </div>
      </div>
    </div>
  )
}
