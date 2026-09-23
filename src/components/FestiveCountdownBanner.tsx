'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, Calendar, ArrowRight, Flame, Music, Sparkle } from 'lucide-react'
import { motion } from 'framer-motion'

export function FestiveCountdownBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)
  const particlesRef1 = useRef<HTMLDivElement>(null)
  const particlesRef2 = useRef<HTMLDivElement>(null)
  const particlesRef3 = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false
  })

  useEffect(() => {
    setMounted(true)

    const calculateTime = () => {
      // Target: 8th October, 12:00 PM IST (UTC+05:30)
      const targetTime = new Date('2026-10-08T12:00:00+05:30').getTime()
      const now = Date.now()
      const diff = targetTime - now

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true }
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isEnded: false
      }
    }

    setTimeLeft(calculateTime())
    const interval = setInterval(() => {
      setTimeLeft(calculateTime())
    }, 1000)

    // =========================================================================
    // HIGH-PERFORMANCE ZERO-LAG PARALLAX SCROLL ENGINE
    // - Bypasses React state completely (0 React re-renders on scroll)
    // - Leverages hardware-accelerated transforms (translate3d, rotateX)
    // - Pauses when banner is outside viewport via IntersectionObserver
    // - Respects prefers-reduced-motion
    // =========================================================================
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      return () => clearInterval(interval)
    }

    let isVisible = true
    let ticking = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisible = entries[0].isIntersecting
        }
      },
      { threshold: 0 }
    )

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    const updateParallax = () => {
      ticking = false
      if (!isVisible || !bannerRef.current || !posterRef.current) return

      // Measure sticky header height
      const headerEl = document.querySelector('header')
      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 80

      const bannerRect = bannerRef.current.getBoundingClientRect()
      // Exact distance the banner has scrolled past the sticky header
      const scrolledPast = Math.max(0, headerBottom - bannerRect.top)
      const posterHeight = posterRef.current.offsetHeight || 600

      // The poster stays anchored in the background (piche ki taraf)
      // while the website (countdown bar & page) moves in front (aage ki taraf)
      const maxOffset = posterHeight
      const offset = Math.min(scrolledPast, maxOffset)
      const coverProgress = Math.min(1, offset / (posterHeight || 1))

      // 1. Hardware-accelerated background anchor with subtle cinema depth
      const scale = (1 - coverProgress * 0.035).toFixed(3)
      const brightness = (1 - coverProgress * 0.15).toFixed(2)
      posterRef.current.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale3d(${scale}, ${scale}, 1)`
      posterRef.current.style.filter = `brightness(${brightness})`

      // 2. Holographic light sweep sheen that reflects across the poster as website slides over
      if (sheenRef.current) {
        const sheenX = (-100 + coverProgress * 250).toFixed(1)
        sheenRef.current.style.transform = `translate3d(${sheenX}%, 0, 0) rotate(22deg)`
        sheenRef.current.style.opacity = Math.max(0, Math.min(0.35, 0.45 - Math.abs(coverProgress - 0.45) * 0.7)).toFixed(2)
      }

      // 3. Ambient festive glow drift
      if (bgGlowRef.current) {
        bgGlowRef.current.style.transform = `translate3d(0, ${(offset * 0.25).toFixed(1)}px, 0)`
      }

      // 4. Floating particles attached to background stage
      if (particlesRef1.current) {
        particlesRef1.current.style.transform = `translate3d(0, ${(offset * 0.35).toFixed(1)}px, 0)`
      }
      if (particlesRef2.current) {
        particlesRef2.current.style.transform = `translate3d(0, ${(offset * 0.2).toFixed(1)}px, 0)`
      }
    }

    const onScroll = () => {
      if (!ticking && isVisible) {
        window.requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateParallax()

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={bannerRef} className="w-full relative z-30 bg-black overflow-hidden select-none">
      {/* 1. The Poster Layer in the BACK (z-index: 10) - Stays pinned/lingering in background */}
      <div 
        ref={posterRef}
        className="w-full relative z-10 will-change-transform transform-gpu origin-top bg-black"
        style={{ contain: 'paint' }}
      >
        {/* Deep Festive Ambient Glow Background */}
        <div 
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none z-0 will-change-transform opacity-70"
        >
          <div className="absolute -left-20 top-1/4 w-96 h-96 bg-[#FF0055]/20 blur-3xl rounded-full" />
          <div className="absolute left-1/3 top-0 w-[30rem] h-[30rem] bg-[#FFE600]/15 blur-3xl rounded-full" />
          <div className="absolute right-0 bottom-10 w-96 h-96 bg-[#00E5FF]/20 blur-3xl rounded-full" />
        </div>

        <Link 
          href="/browse" 
          className="block w-full cursor-pointer relative group/img"
          title="Samplistic Festival — Get 20% Off on Every Sample Pack (Starts 8 October)"
        >
          {/* Pristine Full-Resolution 100% Uncropped Poster (Desktop Panoramic vs Mobile Portrait) */}
          <picture className="block w-full">
            {/* Desktop & Tablet: Ultra-Wide 1983x793 Panoramic Graphic */}
            <source
              media="(min-width: 768px)"
              srcSet="/festive-banner-desktop.webp"
              type="image/webp"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/festive-banner-desktop.png"
              type="image/png"
            />

            {/* Mobile Phone: High-Impact 941x1672 Vertical Portrait Graphic */}
            <source
              srcSet="/festive-banner-mobile.webp"
              type="image/webp"
            />
            <img
              src="/festive-banner-mobile.png"
              alt="Samplistic Festival — Festive Sale is Here — Get 20% Off on Every Sample Pack — Starts 8 October"
              width={1983}
              height={793}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
              className="w-full h-auto block select-none pointer-events-none group-hover/img:brightness-[1.02] transition-all duration-300"
            />
          </picture>

          {/* Dynamic Holographic Light Sheen Overlay that sweeps with scroll */}
          <div 
            ref={sheenRef}
            className="absolute inset-y-0 -left-1/2 w-1/3 pointer-events-none z-20 will-change-transform bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md opacity-0 transform-gpu"
            style={{ mixBlendMode: 'overlay' }}
          />
        </Link>

        {/* Floating Notes & Particles Attached to Poster Background Layer */}
        <div 
          ref={particlesRef1}
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden will-change-transform transform-gpu"
        >
          {/* Neon Lime Music Note */}
          <div className="absolute top-[18%] left-[7%] hidden sm:flex items-center justify-center filter drop-shadow-[0_0_12px_#00FF94] animate-bounce" style={{ animationDuration: '3.2s' }}>
            <Music size={28} className="text-[#00FF94] rotate-[-12deg]" />
          </div>

          {/* Neon Magenta Music Note */}
          <div className="absolute top-[28%] right-[9%] hidden sm:flex items-center justify-center filter drop-shadow-[0_0_14px_#FF007A] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.8s' }}>
            <Music size={32} className="text-[#FF007A] rotate-[15deg]" />
          </div>

          {/* Golden Sparkles on mobile & desktop */}
          <div className="absolute top-[12%] right-[16%] flex items-center justify-center filter drop-shadow-[0_0_10px_#FFE600] animate-pulse" style={{ animationDuration: '2.5s' }}>
            <Sparkles size={20} className="text-[#FFE600]" />
          </div>
          <div className="absolute bottom-[22%] left-[12%] flex items-center justify-center filter drop-shadow-[0_0_10px_#00E5FF] animate-pulse" style={{ animationDuration: '3s' }}>
            <Sparkle size={18} className="text-[#00E5FF]" />
          </div>
        </div>

        <div 
          ref={particlesRef2}
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden will-change-transform transform-gpu"
        >
          <div className="absolute top-[35%] left-[22%] w-2 h-2 rounded-full bg-[#FFE600] shadow-[0_0_10px_#FFE600] animate-ping" style={{ animationDuration: '3.5s' }} />
          <div className="absolute top-[65%] right-[28%] w-2.5 h-2.5 rounded-full bg-[#FF7700] shadow-[0_0_12px_#FF7700] animate-ping" style={{ animationDuration: '4.2s', animationDelay: '1.2s' }} />
          <div className="absolute top-[48%] right-[14%] w-2 h-2 rounded-full bg-[#00FF94] shadow-[0_0_10px_#00FF94] animate-pulse" style={{ animationDuration: '2.8s' }} />

          {/* Neon Cyan Music Note for Mobile */}
          <div className="absolute top-[40%] left-[8%] flex sm:hidden items-center justify-center filter drop-shadow-[0_0_12px_#00E5FF]">
            <Music size={22} className="text-[#00E5FF] rotate-[-18deg]" />
          </div>
        </div>
      </div>

      {/* 2. The Website Content in the FRONT (z-index: 20) with deep upward drop shadow */}
      <div className="w-full relative z-20 shadow-[0_-25px_60px_rgba(0,0,0,0.98),0_-10px_20px_rgba(0,0,0,0.9)]">

      {/* 2. Top Rainbow Strip */}
      <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#FF0055] via-[#FF7700] via-[#FFE600] via-[#00FF94] via-[#00E5FF] to-[#A800FF] shadow-[0_0_12px_rgba(255,230,0,0.5)] relative z-20" />

      {/* 3. Ultra-Vibrant Colorful Festive Countdown Bar */}
      <div className="w-full bg-[#0c0c10] border-b-4 border-black py-5 sm:py-8 px-3 sm:px-8 relative z-20 shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Multi-Color Festive Ambient Glow Background matching the poster */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-20 top-0 w-72 h-72 bg-[#FF0055]/12 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute left-1/3 top-0 w-80 h-80 bg-[#FFE600]/10 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute right-0 bottom-0 w-72 h-72 bg-[#00E5FF]/12 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '3.5s' }} />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10 leading-normal">
          {/* Left: Festive Brand Badge & Event Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 text-center sm:text-left w-full lg:w-auto justify-center">
            {/* Samplistic Festival Badge with Graffiti Gradient Text */}
            <div className="flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#16161a] border-2 border-black shadow-[3px_3px_0px_#FF7700] rounded-sm group/flame">
              <div className="relative">
                <Flame size={18} className="text-[#FF7700] animate-pulse" />
                <div className="absolute inset-0 bg-[#FF7700]/40 blur-xs rounded-full animate-ping pointer-events-none" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#FFE600] via-[#FF7700] to-[#FF007A] bg-clip-text text-transparent italic">
                SAMPLISTIC FESTIVAL
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
              {/* 20% OFF Shimmer Badge */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#FFE600] text-black font-black text-[10px] sm:text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#FF0055]"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-black" />
                  <span>FLAT 20% OFF</span>
                </span>
              </motion.div>

              {/* Date Badge */}
              <div className="flex items-center gap-1.5 text-zinc-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/80 px-3 sm:px-3.5 py-1 sm:py-1.5 border-2 border-black shadow-[2px_2px_0px_#00E5FF] rounded-sm">
                <Calendar size={12} className="text-[#00E5FF] shrink-0" />
                <span>STARTS 8 OCT • 12:00 PM</span>
              </div>
            </div>
          </div>

          {/* Right: 4 Colorful Live Countdown Blocks (Matching SAMPLES WALA Colors) */}
          <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 w-full lg:w-auto">
            {mounted && timeLeft.isEnded ? (
              <motion.div 
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="px-6 py-3 bg-gradient-to-r from-[#FFE600] to-[#FF7700] text-black font-black uppercase text-sm tracking-widest border-4 border-black shadow-[4px_4px_0px_#FF007A]"
              >
                🎉 FESTIVAL SALE IS LIVE!
              </motion.div>
            ) : (
              <>
                <div className="hidden md:flex flex-col items-end mr-2 text-right select-none">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-[#FFE600] to-[#FF7700] bg-clip-text text-transparent italic">
                    COUNTDOWN
                  </span>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                    STARTS IN
                  </span>
                </div>

                {/* DAYS - Fiery Coral / Red (#FF2A54) */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2.5 min-w-[50px] xs:min-w-[58px] sm:min-w-[70px] shadow-[2px_2px_0px_#FF2A54] sm:shadow-[3px_3px_0px_#FF2A54] hover:shadow-[0_0_20px_rgba(255,42,84,0.6)] transition-all rounded-xs"
                >
                  <span className="text-lg xs:text-xl sm:text-3xl font-black italic font-mono text-[#FF2A54] leading-none tracking-tight">
                    {mounted ? String(timeLeft.days).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#FFA0B2] mt-1">
                    DAYS
                  </span>
                </motion.div>

                <span className="text-[#FF7700] font-black text-sm xs:text-base sm:text-2xl animate-pulse select-none">:</span>

                {/* HOURS - Golden Orange (#FF9900) */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2.5 min-w-[50px] xs:min-w-[58px] sm:min-w-[70px] shadow-[2px_2px_0px_#FF9900] sm:shadow-[3px_3px_0px_#FF9900] hover:shadow-[0_0_20px_rgba(255,153,0,0.6)] transition-all rounded-xs"
                >
                  <span className="text-lg xs:text-xl sm:text-3xl font-black italic font-mono text-[#FFAA00] leading-none tracking-tight">
                    {mounted ? String(timeLeft.hours).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#FFD480] mt-1">
                    HOURS
                  </span>
                </motion.div>

                <span className="text-[#FFE600] font-black text-sm xs:text-base sm:text-2xl animate-pulse select-none">:</span>

                {/* MINS - Neon Electric Green (#00FF94) */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2.5 min-w-[50px] xs:min-w-[58px] sm:min-w-[70px] shadow-[2px_2px_0px_#00FF94] sm:shadow-[3px_3px_0px_#00FF94] hover:shadow-[0_0_20px_rgba(0,255,148,0.6)] transition-all rounded-xs"
                >
                  <span className="text-lg xs:text-xl sm:text-3xl font-black italic font-mono text-[#00FF94] leading-none tracking-tight">
                    {mounted ? String(timeLeft.minutes).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#80FFCA] mt-1">
                    MINS
                  </span>
                </motion.div>

                <span className="text-[#00E5FF] font-black text-sm xs:text-base sm:text-2xl animate-pulse select-none">:</span>

                {/* SECS - Electric Cyan (#00E5FF) */}
                <motion.div 
                  key={timeLeft.seconds}
                  initial={{ scale: 1.06 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2.5 min-w-[50px] xs:min-w-[58px] sm:min-w-[70px] shadow-[2px_2px_0px_#00E5FF] sm:shadow-[3px_3px_0px_#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all rounded-xs"
                >
                  <span className="text-lg xs:text-xl sm:text-3xl font-black italic font-mono text-[#00E5FF] leading-none tracking-tight">
                    {mounted ? String(timeLeft.seconds).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#99F5FF] mt-1">
                    SECS
                  </span>
                </motion.div>

                {/* CTA Button with rainbow hover & magenta shadow */}
                <Link
                  href="/browse"
                  className="hidden xl:flex items-center gap-2 ml-3 h-12 px-5 bg-gradient-to-r from-[#FFE600] to-[#FFAA00] hover:from-[#FFAA00] hover:to-[#FF007A] text-black hover:text-white font-black uppercase tracking-wider text-[11px] border-2 border-black shadow-[4px_4px_0px_#FF007A] hover:shadow-[2px_2px_0px_#FF007A] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none transition-all group/btn"
                >
                  <span>BROWSE PACKS</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Rainbow Border Accent */}
      <div className="w-full h-1 sm:h-1.5 bg-gradient-to-r from-[#A800FF] via-[#00E5FF] via-[#00FF94] via-[#FFE600] to-[#FF0055]" />
      </div>
    </div>
  )
}

