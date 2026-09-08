'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Gift, Download, Search, ChevronDown, Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Layers } from 'lucide-react'

interface FreeClientProps {
  initialPacks: any[]
  initialPresets: any[]
  faqs?: { q: string; a: string }[]
}

export function FreeClient({ initialPacks = [], initialPresets = [], faqs = [] }: FreeClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'packs' | 'presets'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const allItems = useMemo(() => {
    return [
      ...initialPacks.map(p => ({ ...p, itemType: 'pack' })),
      ...initialPresets.map(pr => ({ ...pr, itemType: 'preset' }))
    ]
  }, [initialPacks, initialPresets])

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (activeTab === 'packs' && item.itemType !== 'pack') return false
      if (activeTab === 'presets' && item.itemType !== 'preset') return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const nameMatch = item.name?.toLowerCase().includes(query)
        const descMatch = item.description?.toLowerCase().includes(query)
        const catMatch = item.categories?.some?.((c: any) => c.name?.toLowerCase().includes(query))
        return nameMatch || descMatch || catMatch
      }

      return true
    })
  }, [allItems, activeTab, searchQuery])

  return (
    <div className="space-y-8 sm:space-y-10">
      
      {/* ========================================================================= */}
      {/* 1. COMPACT HEADER (Clean, Proportional, No Oversized Clutter)             */}
      {/* ========================================================================= */}
      <div className="space-y-2.5 max-w-3xl border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
          <Globe size={13} className="text-[#00FF94]" />
          <span>Global Music Producers • Zero Cost</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white leading-tight">
          Free Sounds &amp; Sample Packs
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
          Download free industry-grade sample packs, drum kits, rhythm loops, and presets for music producers worldwide. Built for Hip-Hop, Trap, UK Drill, Indian Fusion, Afrobeat &amp; EDM. 100% royalty-free for commercial use on Spotify, YouTube &amp; all DAWs.
        </p>

        {/* Subtle Specs Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
            <ShieldCheck size={12} className="text-[#00FF94]" />
            <span>100% Royalty-Free</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
            <Zap size={12} className="text-studio-yellow" />
            <span>24-Bit WAV Audio</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
            <Layers size={12} className="text-white/70" />
            <span>Universal DAW Ready</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER PILLS & SEARCH BAR (Producer Toy / EGS Style)                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'bg-[#18181c] text-zinc-400 hover:text-white hover:bg-[#222228] border border-white/5'
            }`}
          >
            All Freebies ({allItems.length})
          </button>

          <button
            onClick={() => setActiveTab('packs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'packs'
                ? 'bg-white text-black shadow-sm'
                : 'bg-[#18181c] text-zinc-400 hover:text-white hover:bg-[#222228] border border-white/5'
            }`}
          >
            Sample Packs ({initialPacks.length})
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-black shadow-sm'
                : 'bg-[#18181c] text-zinc-400 hover:text-white hover:bg-[#222228] border border-white/5'
            }`}
          >
            Presets ({initialPresets.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search free sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#18181c] border border-white/10 rounded-lg text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-500 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CARDS GRID (Producer Toy 1:1 Match with Flush Bottom Bar)              */}
      {/* ========================================================================= */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#18181c] border border-white/5 rounded-xl space-y-3">
          <Gift size={36} className="mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white tracking-tight">No free sounds found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query or reset the filter to view all free items.
          </p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-zinc-200 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const isPack = item.itemType === 'pack'
            const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

            return (
              <Link
                key={item.id}
                href={detailUrl}
                className="group flex flex-col select-none cursor-pointer"
              >
                {/* Poster / Square Card Image */}
                <div className="relative w-full aspect-square rounded-t-xl overflow-hidden bg-[#202024] border-t border-x border-[#2c2c30] shadow-md flex flex-col justify-end">
                  <Image
                    src={item.cover_url || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 ease-out"
                  />
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                  {/* Corner Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase text-white/80 border border-white/10">
                    {isPack ? 'Sample Pack' : (item.type || 'Preset')}
                  </div>
                </div>

                {/* Flush Bottom Status Bar (Producer Toy Match) */}
                <div className="relative z-10 w-full py-1.5 px-3 text-center text-[11px] font-black tracking-wider uppercase bg-[#00FF94] group-hover:bg-[#00e685] text-black rounded-b-xl shadow-md transition-colors">
                  FREE NOW
                </div>

                {/* Text Details Below Card */}
                <div className="mt-2.5 space-y-0.5 px-0.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#00FF94] transition-colors leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-normal truncate">
                    {item.total_contents_summary || (isPack ? 'Free Sound Kit • Direct WAV' : 'Free Mixing Preset')}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SEO PRODUCER GUIDE (Compact, Authoritative Context for Google)          */}
      {/* ========================================================================= */}
      <section className="bg-[#141418] border border-white/5 rounded-xl p-5 sm:p-7 md:p-8 space-y-5">
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#00FF94]">
            PRODUCER GUIDE &amp; LICENSE INFORMATION
          </span>
          <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white">
            Why Download Free Sounds on SamplesWala?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="space-y-1.5 bg-[#18181c] p-4 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded bg-[#00FF94]/10 text-[#00FF94] flex items-center justify-center font-black text-xs">
              01
            </div>
            <h3 className="font-bold text-white text-sm">100% Royalty-Free Forever</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Every sound includes our commercial clearance. Use in commercial releases on Spotify, Apple Music, YouTube, and beat licensing with zero back-end royalties.
            </p>
          </div>

          <div className="space-y-1.5 bg-[#18181c] p-4 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded bg-studio-yellow/10 text-studio-yellow flex items-center justify-center font-black text-xs">
              02
            </div>
            <h3 className="font-bold text-white text-sm">Pristine 24-Bit WAV Stems</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Recorded in treated acoustic studios with analog gear and premium microphones. Exported in uncompressed 24-bit 44.1kHz WAV for punchy, release-ready mixes.
            </p>
          </div>

          <div className="space-y-1.5 bg-[#18181c] p-4 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center font-black text-xs">
              03
            </div>
            <h3 className="font-bold text-white text-sm">Universal DAW Compatibility</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Drag-and-drop compatible with FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, and Reaper. Tempo and key labelled for effortless arrangement.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRODUCER TOY STYLE FAQ ACCORDION                                       */}
      {/* ========================================================================= */}
      {faqs.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Support &amp; Licensing
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase italic">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="bg-[#18181c] border border-white/5 rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}
