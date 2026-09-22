'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Calendar, ArrowRight, Flame } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function FestiveCountdownBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false
  })

  // Cinematic Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])

  useEffect(() => {
    setMounted(true)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)

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

    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={bannerRef} className="w-full relative z-30 bg-black overflow-hidden">
      {/* 1. Full-Bleed Ultra-Wide 100% Uncropped Poster Graphic */}
      <div className="w-full relative bg-black leading-none">
        <Link 
          href="/browse" 
          className="block w-full cursor-pointer relative group/img select-none"
          title="Samplistic Festival — Get 20% Off on Every Sample Pack (Starts 8 October)"
        >
          {/* Pristine Full-Resolution 100% Uncropped Poster */}
          <Image
            src="/Fanst.png"
            alt="Samplistic Festival - Festive Sale is Here - Get 20% Off on Every Sample Pack - Starts from 8 October"
            width={1672}
            height={941}
            priority
            unoptimized
            sizes="100vw"
            className="w-full h-auto block select-none group-hover/img:brightness-[1.02] transition-all duration-300"
          />
        </Link>
      </div>

      {/* 2. Top Rainbow Strip */}
      <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#FF0055] via-[#FF7700] via-[#FFE600] via-[#00FF94] via-[#00E5FF] to-[#A800FF] shadow-[0_0_12px_rgba(255,230,0,0.5)] relative z-20" />

      {/* 3. Ultra-Vibrant Colorful Festive Countdown Bar */}
      <div className="w-full bg-[#0c0c10] border-b-4 border-black py-6 sm:py-8 px-4 sm:px-8 relative z-20 shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Multi-Color Festive Ambient Glow Background matching the poster */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-20 top-0 w-72 h-72 bg-[#FF0055]/12 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute left-1/3 top-0 w-80 h-80 bg-[#FFE600]/10 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute right-0 bottom-0 w-72 h-72 bg-[#00E5FF]/12 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '3.5s' }} />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10 leading-normal">
          {/* Left: Festive Brand Badge & Event Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            {/* Samplistic Festival Badge with Graffiti Gradient Text */}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-[#16161a] border-2 border-black shadow-[3px_3px_0px_#FF7700] rounded-sm group/flame">
              <div className="relative">
                <Flame size={20} className="text-[#FF7700] animate-pulse" />
                <div className="absolute inset-0 bg-[#FF7700]/40 blur-xs rounded-full animate-ping pointer-events-none" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#FFE600] via-[#FF7700] to-[#FF007A] bg-clip-text text-transparent italic">
                SAMPLISTIC FESTIVAL
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {/* 20% OFF Shimmer Badge */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="px-3 py-1.5 bg-[#FFE600] text-black font-black text-[11px] sm:text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#FF0055]"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-black" />
                  <span>FLAT 20% OFF</span>
                </span>
              </motion.div>

              {/* Date Badge */}
              <div className="flex items-center gap-1.5 text-zinc-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-black/80 px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_#00E5FF] rounded-sm">
                <Calendar size={13} className="text-[#00E5FF] shrink-0" />
                <span>STARTS 8 OCT • 12:00 PM</span>
              </div>
            </div>
          </div>

          {/* Right: 4 Colorful Live Countdown Blocks (Matching SAMPLES WALA Colors) */}
          <div className="flex items-center gap-2 sm:gap-3">
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
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-3 sm:px-4 py-2 sm:py-2.5 min-w-[58px] sm:min-w-[70px] shadow-[3px_3px_0px_#FF2A54] hover:shadow-[0_0_20px_rgba(255,42,84,0.6)] transition-all rounded-xs"
                >
                  <span className="text-xl sm:text-3xl font-black italic font-mono text-[#FF2A54] leading-none tracking-tight">
                    {mounted ? String(timeLeft.days).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#FFA0B2] mt-1">
                    DAYS
                  </span>
                </motion.div>

                <span className="text-[#FF7700] font-black text-lg sm:text-2xl animate-pulse select-none">:</span>

                {/* HOURS - Golden Orange (#FF9900) */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-3 sm:px-4 py-2 sm:py-2.5 min-w-[58px] sm:min-w-[70px] shadow-[3px_3px_0px_#FF9900] hover:shadow-[0_0_20px_rgba(255,153,0,0.6)] transition-all rounded-xs"
                >
                  <span className="text-xl sm:text-3xl font-black italic font-mono text-[#FFAA00] leading-none tracking-tight">
                    {mounted ? String(timeLeft.hours).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#FFD480] mt-1">
                    HOURS
                  </span>
                </motion.div>

                <span className="text-[#FFE600] font-black text-lg sm:text-2xl animate-pulse select-none">:</span>

                {/* MINS - Neon Electric Green (#00FF94) */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-3 sm:px-4 py-2 sm:py-2.5 min-w-[58px] sm:min-w-[70px] shadow-[3px_3px_0px_#00FF94] hover:shadow-[0_0_20px_rgba(0,255,148,0.6)] transition-all rounded-xs"
                >
                  <span className="text-xl sm:text-3xl font-black italic font-mono text-[#00FF94] leading-none tracking-tight">
                    {mounted ? String(timeLeft.minutes).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#80FFCA] mt-1">
                    MINS
                  </span>
                </motion.div>

                <span className="text-[#00E5FF] font-black text-lg sm:text-2xl animate-pulse select-none">:</span>

                {/* SECS - Electric Cyan (#00E5FF) */}
                <motion.div 
                  key={timeLeft.seconds}
                  initial={{ scale: 1.06 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="flex flex-col items-center justify-center bg-[#18181b] border-2 sm:border-3 border-black px-3 sm:px-4 py-2 sm:py-2.5 min-w-[58px] sm:min-w-[70px] shadow-[3px_3px_0px_#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all rounded-xs"
                >
                  <span className="text-xl sm:text-3xl font-black italic font-mono text-[#00E5FF] leading-none tracking-tight">
                    {mounted ? String(timeLeft.seconds).padStart(2, '0') : '--'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#99F5FF] mt-1">
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
  )
}
