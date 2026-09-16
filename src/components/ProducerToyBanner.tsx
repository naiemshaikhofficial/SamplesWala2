'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, Globe, Zap, ExternalLink } from 'lucide-react'

interface ProducerToyBannerProps {
  variant?: 'standard' | 'compact'
  className?: string
}

export function ProducerToyBanner({
  variant = 'standard',
  className = ''
}: ProducerToyBannerProps) {
  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <aside aria-label="International Samples on Producer Toy" className={`w-full ${className}`}>
        <div className="relative overflow-hidden bg-[#FC6301] border-4 border-black shadow-[6px_6px_0px_black] p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_black]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            {/* Left: Brand Icon + Title */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center shrink-0 p-1.5 shadow-[2px_2px_0px_white]">
                <Image
                  src="/producertoy-icon.png"
                  alt="ProducerToy Icon"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wider mb-1">
                  <Globe size={11} className="text-[#FC6301]" />
                  <span>INTERNATIONAL STORE</span>
                </div>
                <h3 className="text-sm sm:text-base font-black uppercase italic tracking-tight text-black leading-tight">
                  Check out our international samples on <span className="underline decoration-2 decoration-black">ProducerToy</span>
                </h3>
              </div>
            </div>

            {/* Right: CTA Button */}
            <a
              href="https://producertoy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-white text-white hover:text-black border-2 border-black font-black text-xs uppercase tracking-widest transition-all duration-150 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Visit Store</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </aside>
    )
  }

  // Standard Poster Mode (Big, Funky, Solid Orange)
  return (
    <aside aria-label="International Samples on ProducerToy" className={`w-full ${className}`}>
      <div className="relative overflow-hidden bg-[#FC6301] border-4 border-black shadow-[8px_8px_0px_black] p-6 sm:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0px_black] group">
        {/* Background Comic Decals */}
        <div className="absolute top-2 right-4 text-black/10 font-black text-7xl sm:text-9xl uppercase italic pointer-events-none select-none tracking-tighter">
          TOY
        </div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/5 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Brand Identity + Copy */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 min-w-0">
            {/* Big Brand Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black border-4 border-black flex items-center justify-center shrink-0 p-2 shadow-[4px_4px_0px_white] rotate-[-2deg] group-hover:rotate-0 transition-transform duration-200">
              <Image
                src="/producertoy-icon.png"
                alt="ProducerToy Icon"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-[#FFE600] border-2 border-black text-[10px] font-black uppercase tracking-widest rotate-[-1deg]">
                  <Zap size={12} className="fill-[#FFE600]" />
                  <span>GLOBAL AUDIO MARKETPLACE</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-black/75 tracking-wider">
                  producertoy.com
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-black leading-none">
                CHECK OUT OUR INTERNATIONAL SAMPLES ON <span className="text-white drop-shadow-[2px_2px_0px_black] underline decoration-black decoration-4">PRODUCERTOY</span>
              </h2>

              <p className="text-xs sm:text-sm font-bold text-black/90 max-w-2xl leading-relaxed">
                Looking for global hip-hop, drill, electronic loops, VST presets, and pro audio tools? Explore our international catalog crafted for worldwide releases.
              </p>
            </div>
          </div>

          {/* Right: Funky CTA Button */}
          <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <a
              href="https://producertoy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-black hover:bg-white text-white hover:text-black border-4 border-black font-black text-sm sm:text-base uppercase tracking-widest italic transition-all duration-150 shadow-[6px_6px_0px_white] hover:shadow-[6px_6px_0px_black] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              <span>EXPLORE STORE</span>
              <ArrowUpRight size={20} className="stroke-[3]" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
