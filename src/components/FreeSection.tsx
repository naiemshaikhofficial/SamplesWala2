'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Download, Gift, ShieldCheck, Zap } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface FreeSectionProps {
  packs: any[]
  presets: any[]
}

export function FreeSection({ packs = [], presets = [] }: FreeSectionProps) {
  const { addItem } = useCart()

  // If there are no free items at all, don't show an empty broken section
  if (packs.length === 0 && presets.length === 0) {
    return null
  }

  const allFreeItems = [
    ...packs.map(p => ({ ...p, itemType: 'pack' })),
    ...presets.map(pr => ({ ...pr, itemType: 'preset' }))
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-[#0a0a0c] border-y-4 border-black select-none">
      {/* Background glow and halftone effect */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(rgba(0,255,148,0.08)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-[#00FF94]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-studio-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b-4 border-black pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FF94] text-black border-2 border-black shadow-[3px_3px_0px_black] -rotate-1">
              <Gift size={14} className="animate-bounce" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                100% FREE VAULT • ZERO COST
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              FREE <span className="text-[#00FF94] drop-shadow-[4px_4px_0px_#000]">SOUNDS</span> &amp; <span className="text-studio-yellow drop-shadow-[4px_4px_0px_#000]">PACKS</span>
            </h2>

            <p className="text-xs md:text-sm font-bold text-white/60 uppercase tracking-widest max-w-xl">
              Grab industry-grade Indian rhythm loops, one-shots &amp; presets for free. 
              No hidden fees, 100% royalty-free for commercial music production.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/free"
              className="px-6 py-3 bg-white hover:bg-[#00FF94] text-black text-xs font-black uppercase tracking-widest border-3 border-black shadow-[5px_5px_0px_black] hover:shadow-[7px_7px_0px_#00FF94] hover:-translate-y-1 transition-all flex items-center gap-2 group"
            >
              <span>Explore All Freebies</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Perks Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="flex items-center gap-2 p-2.5 bg-black/50 border border-white/10 rounded-lg">
            <div className="w-6 h-6 rounded bg-[#00FF94]/20 flex items-center justify-center text-[#00FF94]">
              <Sparkles size={12} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white">₹0 Cost Forever</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-black/50 border border-white/10 rounded-lg">
            <div className="w-6 h-6 rounded bg-studio-yellow/20 flex items-center justify-center text-studio-yellow">
              <ShieldCheck size={12} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white">100% Royalty Free</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-black/50 border border-white/10 rounded-lg">
            <div className="w-6 h-6 rounded bg-studio-pink/20 flex items-center justify-center text-studio-pink">
              <Zap size={12} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white">Direct WAV Stems</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-black/50 border border-white/10 rounded-lg">
            <div className="w-6 h-6 rounded bg-studio-neon/20 flex items-center justify-center text-studio-neon">
              <Download size={12} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white">Instant Download</span>
          </div>
        </div>

        {/* Free Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allFreeItems.map((item, index) => {
            const isPack = item.itemType === 'pack'
            const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="group flex flex-col bg-[#121215] border-2 border-black hover:border-[#00FF94] shadow-[5px_5px_0px_black] hover:shadow-[7px_7px_0px_#00FF94] transition-all duration-300 rounded-xl overflow-hidden"
              >
                {/* Image / Cover Thumbnail */}
                <Link href={detailUrl} className="relative aspect-square overflow-hidden bg-black/40 block">
                  <Image
                    src={item.cover_url || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#00FF94] text-black font-black text-[9px] uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_black] rotate-[-2deg]">
                      100% FREE
                    </span>
                    <span className="bg-black/80 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 border border-white/20 rounded">
                      {isPack ? 'Sample Pack' : (item.type || 'Preset')}
                    </span>
                  </div>

                  {/* Claim pill hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#00FF94] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[3px_3px_0px_black] -rotate-2 group-hover:rotate-0 transition-transform">
                      Claim Now →
                    </span>
                  </div>
                </Link>

                {/* Content details */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div className="space-y-1.5">
                    <Link href={detailUrl}>
                      <h3 className="text-xs md:text-sm font-black uppercase text-white hover:text-[#00FF94] transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                    </Link>
                    
                    {item.total_contents_summary && (
                      <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider truncate">
                        {item.total_contents_summary}
                      </p>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-[#00FF94] font-mono italic">
                        FREE
                      </span>
                      <span className="text-[9px] font-mono font-bold text-white/30 uppercase line-through">
                        ₹999
                      </span>
                    </div>

                    <Link
                      href={detailUrl}
                      className="px-3 py-1.5 bg-white hover:bg-[#00FF94] text-black font-black uppercase text-[9px] tracking-wider rounded border border-black shadow-[2px_2px_0px_black] active:scale-95 transition-all"
                    >
                      Get Free
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
