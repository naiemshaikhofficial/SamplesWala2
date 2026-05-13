'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

export function BackgroundMural() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track global scroll progress
  // Track pixel-based scroll for more stability than percentage-based on mobile
  const { scrollY } = useScroll()
  
  // Create a smooth spring-based scroll value
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01
  })
  
  // Map scroll pixel value to a subtle vertical movement (parallax factor 0.1)
  // This is more robust than scrollYProgress on mobile where height can change
  const y = useTransform(smoothY, (v) => v * 0.08)
  
  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <motion.div 
        style={{ 
          y,
          willChange: 'transform',
          translateZ: 0 
        }}
        className="absolute inset-0 w-full h-[140%] -top-[20%]" // More buffer for movement
      >
        <Image
          src="/mural-bg.png"
          alt="Graffiti Background"
          fill
          priority
          quality={85}
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



