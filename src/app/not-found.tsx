import React from 'react'
import Link from 'next/link'
import { Headphones, ArrowRight, Music2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-studio-yellow selection:text-black">
      <div className="max-w-xl w-full text-center space-y-12">
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-studio-yellow/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-full">
            <Headphones size={64} className="text-studio-yellow animate-bounce" />
          </div>
          {/* Floating Notes */}
          <Music2 className="absolute -top-4 -right-4 text-studio-neon animate-pulse" size={24} />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter italic text-white/5 select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-10">
            404
          </h1>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
            SIGNAL <span className="text-studio-yellow">LOST.</span>
          </h2>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed italic">
            The sound you are looking for has been modulated out of existence.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/" 
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-studio-yellow transition-all overflow-hidden"
          >
            <span className="relative z-10">Back to Studio</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-studio-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>

        {/* Studio Grid Decor */}
        <div className="grid grid-cols-4 gap-2 max-w-[200px] mx-auto opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-studio-yellow animate-shimmer" 
                style={{ 
                  width: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s` 
                }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
