'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function LaunchOffer() {
  return (
    <div className="bg-studio-neon border-b-4 border-black relative overflow-hidden h-10 md:h-12 flex items-center shadow-[0_4px_20px_rgba(0,255,148,0.3)] z-[100]">
      {/* Animated Marquee */}
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity 
        }}
        className="flex whitespace-nowrap items-center"
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            <span className="text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] text-black flex items-center gap-3">
              <Zap size={14} fill="black" />
              LAUNCH OFFER: GET ANY PACK AT <span className="bg-black text-studio-neon px-2 py-0.5 transform -rotate-2 inline-block">₹499</span> FOR A LIMITED TIME ONLY!
              <Zap size={14} fill="black" />
            </span>
            <div className="h-1 w-1 bg-black rounded-full mx-4" />
          </div>
        ))}
      </motion.div>
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.05)_100%)]" />
    </div>
  )
}
