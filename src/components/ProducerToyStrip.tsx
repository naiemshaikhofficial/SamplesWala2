'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, Globe } from 'lucide-react'

interface ProducerToyStripProps {
  className?: string
}

export function ProducerToyStrip({ className = '' }: ProducerToyStripProps) {
  return (
    <aside
      aria-label="International Samples on ProducerToy"
      className={`w-full bg-gradient-to-r from-[#FF5C00] via-[#FC6301] to-[#FF4500] border-b-2 border-black relative z-[105] select-none h-9 ${className}`}
    >
      <a
        href="https://producertoy.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full h-full hover:brightness-105 active:brightness-95 transition-all"
      >
        <div className="container mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-2 overflow-hidden text-black font-black uppercase italic text-[11px] sm:text-xs tracking-wider">
          {/* Left: Brand Icon + Pill + Message */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* ProducerToy Icon Emblem */}
            <div className="w-5 h-5 relative shrink-0 bg-black border border-black p-0.5 shadow-[1px_1px_0px_white] -rotate-3 group-hover:rotate-0 transition-transform duration-200">
              <Image
                src="/producertoy-icon.png"
                alt="ProducerToy"
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>

            {/* Global Pill Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-black text-[#FFE600] text-[9px] font-black uppercase tracking-widest leading-none shrink-0 shadow-[1px_1px_0px_white]">
              <Globe size={10} className="stroke-[2.5]" />
              <span>GLOBAL</span>
            </span>

            {/* Main Headline Text */}
            <p className="truncate font-black text-[10px] sm:text-[11px] md:text-xs text-black tracking-tight sm:tracking-normal">
              <span className="hidden md:inline">Looking for International sounds? </span>
              <span className="hidden xs:inline">Check out our international samples on </span>
              <span className="inline xs:hidden">Global samples on </span>
              <span className="text-white drop-shadow-[1.5px_1.5px_0px_black] underline decoration-black decoration-2 font-black">
                PRODUCERTOY.COM
              </span>
            </p>
          </div>

          {/* Right: CTA Pill / Button */}
          <div className="shrink-0 flex items-center gap-1.5 pl-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white group-hover:bg-white group-hover:text-black border border-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors duration-150 shadow-[2px_2px_0px_white] active:translate-x-0.5 active:translate-y-0.5">
              <span>VISIT STORE</span>
              <ArrowUpRight size={11} className="stroke-[3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </a>
    </aside>
  )
}
