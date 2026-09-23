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
  // SMOOTH 3D PARALLAX SCROLL ENGINE
  // =========================================================================
  // 1. Background Ambient Glow Parallax (Oversized, takes heavy travel)
  const bgGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0px', '0px'] : ['-70px', '70px']
  )

  // 2. Sweeping Holographic Light Sheen across the graphic
  const sheenX = useTransform(
    scrollYProgress,
    [0, 1],
    ['-130%', '230%']
  )
  const sheenOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [0, 0.15, 0.35, 0.15, 0]
  )

  // 3. Foreground Artwork Micro-Depth (Smooth ±14px float, zero edge clipping)
  const artworkY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0px', '0px'] : ['14px', '-14px']
  )

  // 4. Smooth 3D Perspective Tilt on Scroll
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [0, 0, 0] : [6, 0, -6]
  )

  // 5. Cinematic Scale & Brightness Peak
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [0.95, 1.02, 0.95]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    shouldReduceMotion ? [1, 1, 1, 1] : [0.55, 1, 1, 0.55]
  )

  return (
    <section
      ref={containerRef}
      aria-label="SamplesWala Marketplace Banner"
      style={{ perspective: '1000px' }}
      className={`relative w-full min-h-[160px] sm:min-h-[220px] md:min-h-[280px] lg:h-[340px] overflow-hidden bg-studio-charcoal/85 backdrop-blur-md border-y-2 md:border-y-4 border-black shadow-[0_4px_24px_rgba(0,0,0,0.7)] select-none flex items-center justify-center py-4 sm:py-6 group/banner ${className}`}
    >
      {/* Full Clickable Overlay to Browse */}
      <Link
        href="/browse"
        aria-label="Explore World's Fastest Growing Samples & Music Production Marketplace"
        className="absolute inset-0 z-30 cursor-pointer block"
      />

      {/* ========================================================
          LAYER 1: PARALLAX AMBIENT GLOW
          ======================================================== */}
      <motion.div
        style={{ y: bgGlowY, willChange: 'transform' }}
        className="absolute inset-0 -top-[50%] -bottom-[50%] w-full h-[200%] pointer-events-none flex items-center justify-center"
      >
        {/* Soft Colorful Studio Ambiance matching the graffiti colors */}
        <div className="w-[600px] sm:w-[850px] h-[220px] bg-gradient-to-r from-[#FF0055]/15 via-[#FFE600]/15 to-[#00FF94]/15 blur-[85px] rounded-full group-hover/banner:opacity-100 opacity-60 transition-opacity duration-500" />
      </motion.div>

      {/* Sweeping Light Sheen that glides across with scroll */}
      <motion.div
        style={{
          x: sheenX,
          opacity: sheenOpacity,
          willChange: 'transform, opacity',
          mixBlendMode: 'overlay',
        }}
        className="absolute inset-y-0 w-1/3 pointer-events-none z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md transform -skew-x-12"
      />

      {/* Subtle Depth Vignettes */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

      {/* ========================================================
          LAYER 2: FOREGROUND GRAPHIC WITH PARALLAX DEPTH
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
        <div className="w-full max-w-[500px] sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1050px] xl:max-w-[1150px] flex items-center justify-center transition-transform duration-300 group-hover/banner:scale-[1.025]">
          <Image
            src="/fastest-growing-banner.png"
            alt="SamplesWala - World's Fastest-Growing Music Production Tool Marketplace and Sample Store"
            width={2163}
            height={727}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] filter brightness-105"
          />
        </div>
      </motion.div>
    </section>
  )
}
