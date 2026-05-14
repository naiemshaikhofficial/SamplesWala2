'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function LaunchOffer() {
  return (
    <div className="relative overflow-hidden h-10 md:h-12 flex items-center border-b-4 border-black z-[100] group">
      {/* Animated Gradient Background */}
      <motion.div 
        animate={{ 
          background: [
            "linear-gradient(90deg, #00FF94 0%, #FF00E5 50%, #FFCC00 100%)",
            "linear-gradient(90deg, #FFCC00 0%, #00FF94 50%, #FF00E5 100%)",
            "linear-gradient(90deg, #FF00E5 0%, #FFCC00 50%, #00FF94 100%)",
            "linear-gradient(90deg, #00FF94 0%, #FF00E5 50%, #FFCC00 100%)",
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-[200%] opacity-100"
      />

      {/* Moving Texture Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

      {/* Animated Marquee */}
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity
        }}
        className="flex whitespace-nowrap items-center relative z-10"
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            <span className="text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] text-black flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Zap size={16} fill="black" />
              </motion.div>
              
              LAUNCH OFFER: GET <span className="bg-white px-2 py-0.5 shadow-[3px_3px_0px_black] transform -rotate-1 inline-block">ANY SAMPLE PACK</span> AT 
              <span className="bg-black text-white px-2 py-0.5 transform rotate-2 inline-block shadow-[3px_3px_0px_white]">₹499</span> 
              FOR A LIMITED TIME ONLY!

              <motion.div
                animate={{ scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                <Zap size={16} fill="black" />
              </motion.div>
            </span>
            <div className="h-1.5 w-1.5 bg-black rotate-45 mx-4" />
          </div>
        ))}
      </motion.div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/30 to-transparent h-[50%]" />
    </div>
  )
}
