'use client'

import React, { useState } from 'react'
import { Music, Sparkles } from 'lucide-react'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { PresetCard } from '@/components/PresetCard'

interface GenreTabsViewProps {
  slug: string
  categoryName: string
  initialPacks: any[]
  initialPresets: any[]
}

export function GenreTabsView({
  slug,
  categoryName,
  initialPacks,
  initialPresets
}: GenreTabsViewProps) {
  const [activeTab, setActiveTab] = useState<'packs' | 'presets'>('packs')

  return (
    <>
      <div className="mb-12 space-y-4">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
          {categoryName}{' '}
          <span className={activeTab === 'packs' ? 'text-studio-yellow' : 'text-studio-pink'}>
            {activeTab === 'packs' ? 'Packs' : 'Presets'}.
          </span>
        </h1>
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
          Premium {categoryName} {activeTab === 'packs' ? 'sample kits' : 'producer presets'}
        </p>
      </div>

      {/* --- TAB SWITCHER --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-16">
        <button
          type="button"
          onClick={() => setActiveTab('packs')}
          className={`flex-1 h-20 flex items-center justify-center gap-4 border-4 border-black text-2xl font-black uppercase italic tracking-tighter transition-all cursor-pointer ${
            activeTab === 'packs'
              ? 'bg-studio-yellow text-black shadow-[8px_8px_0px_black] -translate-y-1'
              : 'bg-studio-charcoal text-white/40 hover:text-white'
          }`}
        >
          <Music size={28} />
          Sample Packs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 h-20 flex items-center justify-center gap-4 border-4 border-black text-2xl font-black uppercase italic tracking-tighter transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-studio-pink text-white shadow-[8px_8px_0px_black] -translate-y-1'
              : 'bg-studio-charcoal text-white/40 hover:text-white'
          }`}
        >
          <Sparkles size={28} />
          Presets
        </button>
      </div>

      {/* --- CONTENT --- */}
      <div>
        {activeTab === 'packs' ? (
          initialPacks.length > 0 ? (
            <BrowseLibrary initialPacks={initialPacks} />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-4 border-black border-dashed opacity-20">
              <Music size={48} strokeWidth={1} />
              <p className="font-black uppercase tracking-widest mt-4">No packs in this genre</p>
            </div>
          )
        ) : initialPresets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {initialPresets.map((preset: any) => (
              <PresetCard key={preset.id} preset={preset} />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-4 border-black border-dashed opacity-20">
            <Sparkles size={48} strokeWidth={1} />
            <p className="font-black uppercase tracking-widest mt-4">No presets in this genre</p>
          </div>
        )}
      </div>
    </>
  )
}
