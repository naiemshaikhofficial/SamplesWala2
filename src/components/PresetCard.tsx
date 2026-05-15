'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Download, Youtube, ExternalLink, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { AddToCartButton } from './AddToCartButton'

interface PresetCardProps {
  preset: {
    id: string
    name: string
    slug: string
    type: string
    daws: string[]
    youtube_url?: string
    drive_url: string
    price_inr: number
    cover_url?: string
  }
}

const DAW_LOGOS: Record<string, string> = {
  'FL Studio': '/logos/Fl-Studio.png',
  // Add other DAW logos here as needed
}

export function PresetCard({ preset }: PresetCardProps) {
  const isFree = preset.price_inr === 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-black border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#ff0080] transition-all overflow-hidden"
    >
      {/* Link wrapper for the main card area */}
      <Link href={`/browse/presets/${preset.slug}`} className="block">
        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-studio-pink text-white text-[8px] font-black uppercase tracking-widest jagged-border -rotate-2 border-2 border-black">
          {preset.type}
        </div>

        {/* Cover Image - SQUARE */}
        <div className="aspect-square relative overflow-hidden bg-zinc-900 border-b-4 border-black">
          {preset.cover_url ? (
            <Image 
              src={preset.cover_url} 
              alt={preset.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 italic font-black text-2xl -rotate-12">
              PRESET
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
             <span className="text-[9px] font-black uppercase tracking-widest text-studio-neon">View Details</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-base font-black uppercase tracking-tighter leading-tight italic group-hover:text-studio-pink transition-colors">
              {preset.name}
            </h3>
            <div className="bg-black text-studio-neon px-2 py-0.5 border-2 border-black font-black text-xs italic rotate-3 shrink-0">
              {isFree ? 'FREE' : `₹${preset.price_inr}`}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {preset.daws.slice(0, 2).map(daw => (
              <div key={daw} className="flex items-center gap-1.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm">
                {DAW_LOGOS[daw] && (
                  <div className="relative w-3 h-3">
                    <Image src={DAW_LOGOS[daw]} alt={daw} fill className="object-contain" />
                  </div>
                )}
                <span className="text-[7px] font-bold text-white/40 uppercase">{daw}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* Actions - Outside the link */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <AddToCartButton 
            item={{
              id: preset.id,
              name: preset.name,
              price: Number(preset.price_inr),
              slug: preset.slug,
              cover_url: preset.cover_url || undefined,
              type: 'preset'
            }}
            compact={true}
          />
          <Link 
            href={`/checkout?direct=${preset.id}&type=preset`}
            className="h-9 bg-studio-neon text-black font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 border-2 border-black hover:bg-white transition-all shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Zap size={14} fill="currentColor" />
            {isFree ? 'GET FREE' : 'BUY'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
