'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, Globe2 } from 'lucide-react'

interface ProducerToyBannerProps {
  variant?: 'standard' | 'compact'
  className?: string
}

export function ProducerToyBanner({
  variant = 'standard',
  className = ''
}: ProducerToyBannerProps) {
  const isCompact = variant === 'compact'

  return (
    <aside aria-label="International Samples on ProducerToy" className={`w-full ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-[#FC6301]/30 bg-gradient-to-r from-[#120800] via-[#1c0c02] to-[#0d0702] transition-all duration-300 hover:border-[#FC6301]/60 shadow-[0_0_25px_rgba(252,99,1,0.08)] group ${
          isCompact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-6'
        }`}
      >
        {/* Subtle Brand Glow Accents */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#FC6301]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FC6301]/25 transition-all duration-500" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#FC6301]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FC6301]/20 transition-all duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Brand Icon + Text */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* ProducerToy Logo Icon */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/60 border border-[#FC6301]/40 flex items-center justify-center shrink-0 p-1.5 shadow-[0_0_12px_rgba(252,99,1,0.25)] group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/producertoy-icon.png"
                alt="ProducerToy Icon"
                width={36}
                height={36}
                className="object-contain drop-shadow-sm"
              />
            </div>

            {/* Typography */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#FC6301] bg-[#FC6301]/10 px-2 py-0.5 rounded-full border border-[#FC6301]/25">
                  <Globe2 className="w-2.5 h-2.5" />
                  International Marketplace
                </span>
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  producertoy.com
                </span>
              </div>

              <h3 className="font-sans font-black text-sm sm:text-base text-white tracking-tight leading-snug">
                Check out our international samples on{' '}
                <span className="text-[#FC6301]">
                  ProducerToy
                </span>
              </h3>

              {!isCompact && (
                <p className="text-[11px] sm:text-xs text-zinc-400 font-medium leading-relaxed hidden sm:block">
                  Discover global VST presets, hip-hop &amp; electronic loops, drum kits and studio tools for worldwide releases.
                </p>
              )}
            </div>
          </div>

          {/* Right: CTA Button */}
          <a
            href="https://producertoy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FC6301] hover:bg-[#e05700] text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_16px_rgba(252,99,1,0.3)] hover:shadow-[0_6px_22px_rgba(252,99,1,0.5)] active:scale-95 group/btn"
          >
            <span>Visit ProducerToy</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </aside>
  )
}
