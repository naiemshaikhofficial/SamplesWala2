'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

export function BackgroundMural() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track global scroll progress
  const { scrollYProgress } = useScroll()
  
  // Create a smooth spring-based scroll progress
  // This adds a "gliding" feel to the parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  // Map smooth progress to a subtle vertical movement
  const y = useTransform(smoothProgress, [0, 1], ['0%', '10%'])
  
  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* 
         Parallax Container:
         We use motion.div to move the entire image layer slightly slower than the scroll.
      */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]" // Extra height to allow movement
      >
        <Image
          src="/mural-bg.png"
          alt="Graffiti Background"
          fill
          priority
          quality={90}
          className="object-cover object-center md:object-right-bottom opacity-100" 
        />
      </motion.div>
      
      {/* 
          Master Overlay:
          - 80% on mobile: Let the graffiti texture breathe
          - 92% on desktop: Cleaner, more professional look for wide layouts
      */}
      <div className="absolute inset-0 bg-black/80 md:bg-black/92 transition-all duration-700" />
      
      {/* Radial Gradient for depth - focusing light in the center-top */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.05),transparent_70%)]" />
      
      {/* Bottom Vignette for content legibility (especially footer area) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      
      {/* Subtle Grain/Noise overlay for that industrial "street" feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  )
}



