'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <section className="py-20 bg-[#0c0c0e] border-b-4 border-black select-none relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6 border-b-2 border-white/10 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#00FF94]">
              FREE CATALOG
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
              FREE <span className="text-studio-yellow">SOUNDS &amp; PACKS</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/50 max-w-xl">
              Indian rhythm loops, one-shots, and producer presets. Royalty-free for commercial music production.
            </p>
          </div>

          <div className="flex items-center">
            <Link
              href="/free"
              className="px-5 py-2.5 bg-white hover:bg-studio-yellow text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
            >
              <span>Explore All Freebies</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Free Items Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {allFreeItems.map((item) => {
            const isPack = item.itemType === 'pack'
            const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

            return (
              <motion.div
                key={item.id}
                variants={itemAnim}
                className="group flex flex-col justify-between bg-[#141417] border-2 border-black hover:border-white/30 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all rounded-lg overflow-hidden"
              >
                {/* Thumbnail Cover */}
                <Link href={detailUrl} className="relative aspect-square overflow-hidden bg-black/60 block">
                  <Image
                    src={item.cover_url || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />

                  {/* Clean Subtle Type Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-black/90 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 border border-white/20 rounded">
                      {isPack ? 'Sample Pack' : (item.type || 'Preset')}
                    </span>
                  </div>
                </Link>

                {/* Card Details */}
                <div className="p-3.5 flex flex-col flex-grow justify-between gap-3">
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
                      className="px-3 py-1.5 bg-white hover:bg-studio-yellow text-black font-black uppercase text-[9px] tracking-wider rounded border border-black shadow-[2px_2px_0px_black] active:scale-95 transition-all"
                    >
                      Get Free
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
