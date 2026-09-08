'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

interface FreeClientProps {
  initialPacks: any[]
  initialPresets: any[]
}

export function FreeClient({ initialPacks = [], initialPresets = [] }: FreeClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'packs' | 'presets'>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    <div className="space-y-8">
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        {/* Category Tabs (No overflow-x scrollbar) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              activeTab === 'all'
                ? 'bg-studio-yellow text-black shadow-[3px_3px_0px_black] -translate-y-0.5'
                : 'bg-studio-charcoal text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            All ({allItems.length})
          </button>

          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              activeTab === 'packs'
                ? 'bg-studio-yellow text-black shadow-[3px_3px_0px_black] -translate-y-0.5'
                : 'bg-studio-charcoal text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            Sample Packs ({initialPacks.length})
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              activeTab === 'presets'
                ? 'bg-studio-yellow text-black shadow-[3px_3px_0px_black] -translate-y-0.5'
                : 'bg-studio-charcoal text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            Presets ({initialPresets.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search free sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 py-2 bg-studio-charcoal border-2 border-black rounded-sm text-xs font-bold text-white placeholder-white/30 focus:outline-none focus:border-studio-yellow transition-colors shadow-[2px_2px_0px_black]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-white/40 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Grid of Free Sounds with proper breathing room */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-xl space-y-3">
          <p className="text-sm font-bold text-white/50 uppercase tracking-widest">No sounds found</p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="px-5 py-2 bg-white text-black font-black uppercase text-xs rounded border border-black shadow-[2px_2px_0px_black] hover:bg-studio-yellow transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pt-2">
          {filteredItems.map((item) => {
            const isPack = item.itemType === 'pack'
            const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between bg-[#121215] border-2 border-black hover:border-white/30 shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_black] transition-all rounded-lg overflow-hidden"
              >
                {/* Artwork Cover */}
                <Link href={detailUrl} className="relative aspect-square overflow-hidden bg-black/60 block">
                  <Image
                    src={item.cover_url || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />

                  {/* Corner Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-black/90 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 border border-white/20 rounded">
                      {isPack ? 'Sample Pack' : (item.type || 'Preset')}
                    </span>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div className="space-y-1">
                    <Link href={detailUrl}>
                      <h3 className="text-xs sm:text-sm font-black uppercase text-white hover:text-studio-yellow transition-colors line-clamp-1 italic tracking-tight">
                        {item.name}
                      </h3>
                    </Link>

                    {item.total_contents_summary ? (
                      <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider truncate">
                        {item.total_contents_summary}
                      </p>
                    ) : (
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
                        {isPack ? 'Free Sound Kit' : 'Free Preset'}
                      </p>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                    <span className="text-sm sm:text-base font-black text-[#00FF94] font-mono italic">
                      FREE
                    </span>

                    <Link
                      href={detailUrl}
                      className="px-3.5 py-1.5 bg-white hover:bg-studio-yellow text-black font-black uppercase text-[10px] tracking-wider rounded border border-black shadow-[2px_2px_0px_black] active:scale-95 transition-all"
                    >
                      Get Free
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
