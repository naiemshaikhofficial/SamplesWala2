'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Gift, ArrowRight } from 'lucide-react'

interface FreeSectionProps {
  packs: any[]
  presets: any[]
}

export function FreeSection({ packs = [], presets = [] }: FreeSectionProps) {
  if (packs.length === 0 && presets.length === 0) {
    return null
  }

  const allFreeItems = [
    ...packs.map(p => ({ ...p, itemType: 'pack' })),
    ...presets.map(pr => ({ ...pr, itemType: 'preset' }))
  ]

  return (
    <section className="py-12 sm:py-16 overflow-hidden select-none">
      <div className="container mx-auto px-4">
        {/* Outer Epic Games Container Box (Producer Toy + SamplesWala Theme) */}
        <div className="w-full bg-[#18181c] border border-white/5 rounded-xl sm:rounded-2xl p-5 sm:p-7 md:p-9 shadow-2xl relative">
          
          {/* Section Header: Gift Icon + Free Sounds & Packs + View More */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-5 border-b border-white/5">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00FF94] flex-shrink-0">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#00FF94]">
                  Weekly Free Drops
                </span>
                <h2 className="text-lg sm:text-2xl font-black uppercase italic tracking-tight text-white leading-tight">
                  Free Sounds &amp; Packs
                </h2>
              </div>
            </div>

            {/* View More Bordered Action Button */}
            <Link
              href="/free"
              prefetch={true}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white hover:text-[#00FF94] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF94] rounded-lg transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>View More</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4 Cards Grid (Producer Toy 1:1 Match with Flush Bottom Bar) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {allFreeItems.slice(0, 4).map((item) => {
              const isPack = item.itemType === 'pack'
              const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

              return (
                <Link
                  key={item.id}
                  href={detailUrl}
                  prefetch={true}
                  className="group flex flex-col select-none cursor-pointer"
                >
                  {/* Poster/Square Image Container */}
                  <div className="relative w-full aspect-square rounded-t-lg sm:rounded-t-xl overflow-hidden bg-[#202024] border-t border-x border-[#2c2c30]">
                    <Image
                      src={item.cover_url || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 ease-out"
                    />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                    {/* Subtle Corner Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase text-white/80 border border-white/10">
                      {isPack ? 'Pack' : (item.type || 'Preset')}
                    </div>
                  </div>

                  {/* Flush Bottom Action Bar (Producer Toy Style FREE NOW) */}
                  <div className="bg-[#00FF94] group-hover:bg-[#00e685] text-black font-black text-[10px] sm:text-[11px] py-1.5 px-2 text-center uppercase tracking-wider rounded-b-lg sm:rounded-b-xl shadow-md transition-colors">
                    FREE NOW
                  </div>

                  {/* Product Details Below Card */}
                  <div className="flex flex-col mt-2.5 px-0.5 space-y-0.5">
                    <h3 className="font-bold text-white group-hover:text-studio-yellow text-xs sm:text-[14px] tracking-tight leading-snug line-clamp-1 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-white/40 font-normal truncate">
                      {item.total_contents_summary || (isPack ? 'Free Sample Pack' : 'Free Preset')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
