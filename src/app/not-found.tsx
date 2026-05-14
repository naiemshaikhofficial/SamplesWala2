import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Ghost, Map, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Comic Accents */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-studio-pink/20 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-studio-neon/10 blur-[120px] rounded-full" />
      
      {/* Halftone Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />

      <div className="relative z-10 text-center space-y-12 max-w-2xl">
        {/* Large 404 with Shadow */}
        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[20rem] font-black uppercase tracking-tighter leading-none italic comic-text text-white">
            404
          </h1>
          <div className="absolute -top-4 -right-8 bg-studio-yellow text-black font-black uppercase text-xs md:text-sm px-4 py-2 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rotate-12">
            SIGNAL LOST!
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic text-studio-neon leading-tight">
            Oops! You've drifted into <br />
            <span className="text-studio-pink">SILENT SPACE.</span>
          </h2>
          <p className="text-[11px] md:text-sm font-bold uppercase tracking-[0.4em] text-white/40 max-w-md mx-auto leading-relaxed">
            The page you're looking for was either deleted, moved, or never existed in this dimension.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link
            href="/"
            className="w-full sm:w-auto h-16 px-10 bg-white text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-studio-neon transition-all border-4 border-black shadow-[8px_8px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none group"
          >
            <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
            ABORT TO HOME
          </Link>
          
          <Link
            href="/browse"
            className="w-full sm:w-auto h-16 px-10 bg-studio-charcoal text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-studio-pink transition-all border-4 border-black shadow-[8px_8px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none group"
          >
            <Search className="group-hover:scale-110 transition-transform" />
            BROWSE PACKS
          </Link>
        </div>

        {/* Bottom Tagline */}
        <div className="pt-12">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em]">SAMPLESWALA // ERROR_LOG_0404</p>
        </div>
      </div>
    </div>
  )
}
