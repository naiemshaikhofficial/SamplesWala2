'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCurrency } from '@/context/CurrencyContext'

interface PresetCardProps {
  preset: {
    id: string
    name: string
    slug: string
    type: string
    daws?: string[]
    youtube_url?: string
    drive_url?: string
    price_inr: number
    price_usd?: number
    cover_url?: string
    mrp_inr?: number
    author?: string
  }
  priority?: boolean
}

export function PresetCard({ preset, priority = false }: PresetCardProps) {
  const { formatPrice, getAmount } = useCurrency()

  const isFree = Number(preset.price_inr) === 0
  const priceVal = preset.price_inr
  const rawMrp = preset.mrp_inr ? Number(preset.mrp_inr) : (isFree ? 0 : Number(preset.price_inr) * 3)
  const priceNum = getAmount(priceVal, preset.price_usd)
  const mrpNum = getAmount(rawMrp, preset.price_usd ? Number(preset.price_usd) * 3 : null)
  const discountPercent = mrpNum > priceNum && priceNum > 0 ? Math.round((1 - (priceNum / mrpNum)) * 100) : 0
  const displayPrice = isFree ? 'Free' : formatPrice(priceVal, preset.price_usd)
  const displayMrp = rawMrp > 0 && !isFree ? formatPrice(rawMrp, preset.price_usd ? Number(preset.price_usd) * 3 : null) : null

  const categoryLabel = `${preset.type || 'Preset'} ${preset.daws && preset.daws.length > 0 ? `• ${preset.daws.join(' & ')}` : ''}`

  return (
    <Link
      href={`/browse/presets/${preset.slug}`}
      prefetch={false}
      className="group flex flex-col cursor-pointer select-none"
      title={preset.name}
    >
      {/* Square Card Cover (Producer Toy Style in 1:1 Square Format) */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#181818] border border-white/10 shadow-md mb-3 group-hover:border-white/20 transition-all duration-300">
        <Image
          src={preset.cover_url || '/placeholder.jpg'}
          alt={`${preset.name} - ${preset.type || 'Preset'} | SamplesWala`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 ease-out"
          priority={priority}
        />

        {/* Subtle Light Glow Overlay on Hover */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Subtle Tag Top-Left */}
        <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 rounded text-[8px] font-mono font-bold uppercase tracking-wider text-studio-yellow">
          {preset.type || 'Preset'}
        </div>
      </div>

      {/* Content Details Below Card (Exact Producer Toy Layout) */}
      <div className="flex flex-col justify-between flex-1 px-0.5 space-y-1">
        <div>
          {/* Subcategory / DAW Tag */}
          <span className="text-xs font-semibold text-zinc-400 capitalize line-clamp-1 block">
            {categoryLabel}
          </span>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-studio-yellow transition-colors">
            {preset.name}
          </h3>

          {/* Brand Byline */}
          <span className="text-xs text-zinc-500 font-medium line-clamp-1 block">
            by {preset.author || 'Samples Wala'}
          </span>
        </div>

        {/* Price Row (Pinned to Consistent Horizontal Baseline) */}
        <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.04]">
          {isFree ? (
            <span className="text-sm font-bold text-[#00FF94]">Free</span>
          ) : (
            <>
              {discountPercent > 0 && (
                <span className="text-xs bg-[#FF5C00] text-white font-extrabold px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
              {displayMrp && (
                <span className="text-xs text-zinc-500 line-through">
                  {displayMrp}
                </span>
              )}
              <span className="text-sm font-bold text-white">
                {displayPrice}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
