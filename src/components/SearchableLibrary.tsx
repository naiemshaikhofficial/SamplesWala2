'use client'
import React, { useState } from 'react'
import { Search, Music, ArrowRight, X, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getOptimizedImageUrl } from '@/lib/images'
import { DownloadButton } from '@/components/DownloadButton'

interface Pack {
  id: string
  name: string
  slug: string
  cover_url: string
  is_downloadable: boolean
  created_at?: string
}

export function SearchableLibrary({ packs }: { packs: Pack[] }) {
  const [search, setSearch] = useState('')

  const filteredPacks = packs.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-sm">
            <Music size={20} className="text-white/40" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">Purchased Packs</h2>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
              {packs.length} {packs.length === 1 ? 'Pack' : 'Packs'} Unlocked
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text"
            placeholder="Search your library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-10 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-studio-neon/50 focus:bg-white/[0.08] transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filteredPacks.length === 0 ? (
        <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-sm">
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
             {search ? 'No matches found for your search' : 'Vault is currently empty'}
           </p>
           {search && (
             <button 
               onClick={() => setSearch('')}
               className="mt-4 text-[9px] font-black uppercase tracking-widest text-studio-neon hover:underline"
             >
               Clear Search
             </button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
          {filteredPacks.map((pack) => (
            <div key={pack.id} className="group flex flex-col space-y-4">
              <div className="aspect-square relative overflow-hidden bg-studio-charcoal border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] block group-hover:border-studio-neon transition-all">
                <Image 
                  src={getOptimizedImageUrl(pack.cover_url, 600, 80)} 
                  alt={pack.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="space-y-4 px-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={10} className="text-studio-neon" />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-studio-neon/80">Verified License</span>
                  </div>
                  <h3 className="text-[13px] font-black uppercase truncate italic tracking-tight">{pack.name}</h3>
                  {pack.created_at && (
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                      Purchased on {new Date(pack.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 pt-1">
                    <span className="flex items-center gap-2"><Music size={10} /> Full Pack</span>
                    <span className="text-studio-neon/60">Unlocked</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                   <DownloadButton packId={pack.id} />
                   <Link 
                     href={`/packs/${pack.slug}`}
                     className="h-14 w-14 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group/link"
                   >
                     <ArrowRight size={18} className="text-white/20 group-hover/link:text-white transition-colors" />
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
