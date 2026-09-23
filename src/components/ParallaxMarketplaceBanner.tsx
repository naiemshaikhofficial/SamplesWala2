'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ParallaxMarketplaceBannerProps {
  className?: string
}

export function ParallaxMarketplaceBanner({ className = '' }: ParallaxMarketplaceBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Track scroll progress of this banner through viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  // =========================================================================
  // SMOOTH PURE PARALLAX FLOAT (Transparent Background)
  // =========================================================================
  // Vertical parallax gliding on scroll
  const artworkY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0px', '0px'] : ['45px', '-45px']
  )

  // Smooth subtle 3D perspective tilt on scroll
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [0, 0, 0] : [5, 0, -5]
  )

  // Cinematic scale peak at viewport center
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [0.94, 1.02, 0.94]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    shouldReduceMotion ? [1, 1, 1, 1] : [0.6, 1, 1, 0.6]
  )

  return (
    <section
      ref={containerRef}
      aria-label="SamplesWala Marketplace Banner"
      style={{ perspective: '1000px' }}
      className={`relative w-full overflow-hidden bg-transparent select-none flex items-center justify-center py-6 sm:py-8 md:py-10 group/banner ${className}`}
    >
      {/* Full Clickable Link to Browse */}
      <Link
        href="/browse"
        aria-label="Explore World's Fastest Growing Samples & Music Production Marketplace"
        className="absolute inset-0 z-30 cursor-pointer block"
      />

      {/* ========================================================
          TRANSPARENT FLOATING PARALLAX GRAPHIC
          ======================================================== */}
      <motion.div
        style={{
          y: artworkY,
          rotateX,
          scale,
          opacity,
          willChange: 'transform, opacity',
          transformStyle: 'preserve-3d',
        }}
        className="container mx-auto px-4 sm:px-6 relative z-20 flex items-center justify-center pointer-events-none"
      >
        <div className="w-full max-w-[380px] sm:max-w-[520px] md:max-w-[650px] lg:max-w-[740px] flex items-center justify-center transition-transform duration-300 group-hover/banner:scale-105">
          <Image
            src="/fastest-growing-banner.png"
            alt="SamplesWala - World's Fastest-Growing Music Production Tool Marketplace and Sample Store"
            width={2163}
            height={727}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] filter brightness-105"
          />
        </div>
      </motion.div>
    </section>
  )
}
