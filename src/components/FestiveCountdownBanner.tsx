'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, Calendar, ArrowRight, Flame, Music, Sparkle } from 'lucide-react'
import { motion } from 'framer-motion'

export function FestiveCountdownBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)
  const particlesRef1 = useRef<HTMLDivElement>(null)
  const particlesRef2 = useRef<HTMLDivElement>(null)

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

      // MOBILE OPTIMIZATION:
      // Mobile devices use touch inertia dragging. Translating elements in opposite direction
      // during touch drag causes the browser compositor to stutter ("atak atak ke chalna").
      // On mobile (<768px), keep poster in natural flow for guaranteed 60/120 FPS native smooth touch scrolling.
      if (window.innerWidth < 768) {
        posterRef.current.style.transform = 'translate3d(0, 0, 0)'
        posterRef.current.style.filter = 'none'
        return
      }

      // DESKTOP: Smooth cinematic curtain parallax
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

    // =========================================================================
    // HEAVY DIWALI FESTIVE FIREWORK ROCKET ENGINE (CANVAS 60FPS)
    // - Rapid multi-rocket volleys with thick blazing sparkler tails
    // - Massive explosions ("Fatan!") with shockwave rings & cascading willow trails
    // - Ambient sky flash on burst & ground sparkler fountains
    // - Pure GPU 2D Canvas with zero-lag bounds
    // =========================================================================
    const canvas = canvasRef.current
    let canvasRafId: number
    let rocketInterval: NodeJS.Timeout
    let volleyCounter = 0

    if (canvas) {
      const ctx = canvas.getContext('2d')

      const festiveColors = [
        '#FFE600', // Electric Gold
        '#FF7700', // Fiery Orange
        '#FF007A', // Neon Magenta
        '#00FF94', // Neon Lime
        '#00E5FF', // Electric Cyan
        '#FFFFFF', // White Flash
        '#FF2A54', // Coral Red
        '#A800FF', // Purple
      ]

      interface Rocket {
        x: number
        y: number
        targetY: number
        speed: number
        color: string
        type: 'peony' | 'ring' | 'willow'
        tailSparks: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[]
      }

      interface Spark {
        x: number
        y: number
        vx: number
        vy: number
        color: string
        alpha: number
        decay: number
        size: number
        trail: { x: number; y: number }[]
      }

      interface Shockwave {
        x: number
        y: number
        radius: number
        maxRadius: number
        alpha: number
        color: string
      }

      interface Flash {
        x: number
        y: number
        alpha: number
        color: string
      }

      let rockets: Rocket[] = []
      let sparks: Spark[] = []
      let shockwaves: Shockwave[] = []
      let flashes: Flash[] = []

      const resizeCanvas = () => {
        if (!canvas) return
        const parent = canvas.parentElement || posterRef.current
        if (!parent) return
        const w = parent.clientWidth || window.innerWidth
        const h = parent.clientHeight || 500
        if (w > 0 && h > 0) {
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w
            canvas.height = h
          }
        }
      }

      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      // ResizeObserver to detect when the poster image loads and changes height
      const resizeObs = new ResizeObserver(() => {
        resizeCanvas()
      })
      if (posterRef.current) {
        resizeObs.observe(posterRef.current)
      }
      if (canvas.parentElement) {
        resizeObs.observe(canvas.parentElement)
      }

      // Tab Visibility & Focus Lifecycle Management:
      // Prevents background rocket accumulation when user switches tabs or minimizes browser.
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Tab switched away: clear active backlogs immediately so nothing stacks up
          rockets = []
          sparks = []
          shockwaves = []
          flashes = []
          if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
          }
        } else {
          // Tab returned: clean canvas, ensure proper dimension, and launch 1 single rocket gently after 500ms
          resizeCanvas()
          rockets = []
          sparks = []
          shockwaves = []
          flashes = []
          if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
          }
          setTimeout(() => {
            if (!document.hidden && isVisible && rockets.length === 0) {
              spawnSingleRocket()
            }
          }, 500)
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('blur', () => {
        if (document.hidden) handleVisibilityChange()
      })
      window.addEventListener('focus', () => {
        if (!document.hidden) handleVisibilityChange()
      })

      const spawnSingleRocket = (xPos?: number, targetRatio?: number) => {
        // Never spawn if tab is in background, banner is offscreen, or canvas is not ready
        if (document.hidden || !isVisible || !canvas) return

        // HARD SAFETY CEILING: Never allow more than 2 rockets in flight simultaneously!
        // This physically prevents any rocket pileup, glitch, or tab lag from ever happening.
        if (rockets.length >= 2) return

        if (canvas.width === 0 || canvas.height === 0) {
          resizeCanvas()
        }
        const w = canvas.width || window.innerWidth
        const h = canvas.height || 600

        const x = xPos !== undefined ? xPos : w * 0.12 + Math.random() * (w * 0.76)
        const targetY = h * (targetRatio !== undefined ? targetRatio : 0.10 + Math.random() * 0.28)
        const color = festiveColors[Math.floor(Math.random() * festiveColors.length)]
        const types: ('peony' | 'ring' | 'willow')[] = ['peony', 'ring', 'willow']
        const type = types[Math.floor(Math.random() * types.length)]

        rockets.push({
          x,
          y: h,
          targetY,
          speed: Math.max(9, h * 0.024),
          color,
          type,
          tailSparks: []
        })
      }

      const launchRocketWave = () => {
        if (document.hidden || !isVisible || !canvas) return
        if (rockets.length >= 2) return

        const w = canvas.width
        volleyCounter++

        // Every 6th wave: Double staggered rocket volley
        if (volleyCounter % 6 === 0) {
          spawnSingleRocket(w * 0.28, 0.15)
          setTimeout(() => {
            if (!document.hidden && isVisible && rockets.length < 2) {
              spawnSingleRocket(w * 0.72, 0.12)
            }
          }, 280)
        } else {
          // Single elegant rocket launch
          spawnSingleRocket()
        }
      }

      // Initial calm, elegant rocket launch after page layout stabilizes (prevents instant swarm)
      const initTimer = setTimeout(() => {
        if (!document.hidden && isVisible && rockets.length === 0) {
          spawnSingleRocket()
        }
      }, 700)

      // Well-paced launch interval (every 1400ms for majestic, lag-free celebration)
      rocketInterval = setInterval(() => {
        launchRocketWave()
      }, 1400)

      const render = () => {
        if (!ctx || !canvas) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (isVisible && !document.hidden) {
          // ===================================================================
          // 1. AMBIENT SKY FLASHES (Night sky lighting up on burst)
          // ===================================================================
          for (let f = flashes.length - 1; f >= 0; f--) {
            const fl = flashes[f]
            fl.alpha -= 0.04
            if (fl.alpha <= 0) {
              flashes.splice(f, 1)
            } else {
              ctx.save()
              ctx.globalAlpha = Math.max(0, fl.alpha)
              const grad = ctx.createRadialGradient(fl.x, fl.y, 10, fl.x, fl.y, 160)
              grad.addColorStop(0, fl.color)
              grad.addColorStop(1, 'transparent')
              ctx.fillStyle = grad
              ctx.beginPath()
              ctx.arc(fl.x, fl.y, 160, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }
          }

          // ===================================================================
          // 2. SHOCKWAVE EXPANDING RINGS
          // ===================================================================
          for (let sw = shockwaves.length - 1; sw >= 0; sw--) {
            const wave = shockwaves[sw]
            wave.radius += 3.8
            wave.alpha -= 0.045
            if (wave.alpha <= 0 || wave.radius >= wave.maxRadius) {
              shockwaves.splice(sw, 1)
            } else {
              ctx.save()
              ctx.globalAlpha = Math.max(0, wave.alpha)
              ctx.strokeStyle = wave.color
              ctx.lineWidth = 2.5
              ctx.beginPath()
              ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
              ctx.stroke()
              ctx.restore()
            }
          }

          // Enable additive lighter blend for blazing fireworks luminescence (0 CPU cost)
          ctx.globalCompositeOperation = 'lighter'

          // ===================================================================
          // 3. ROCKETS RISING WITH THICK SPARKLER TAIL
          // ===================================================================
          for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i]
            r.y -= r.speed

            // Emit sparkling tail particles (2 per frame for optimal balance of density & performance)
            for (let t = 0; t < 2; t++) {
              r.tailSparks.push({
                x: r.x + (Math.random() - 0.5) * 5,
                y: r.y + Math.random() * 8,
                vx: (Math.random() - 0.5) * 1.5,
                vy: Math.random() * 2.5 + 1.2,
                alpha: 1,
                size: Math.random() * 2.4 + 1.2
              })
            }

            // Draw rocket tail sparks without expensive shadowBlur
            ctx.fillStyle = '#FFE600'
            for (let j = r.tailSparks.length - 1; j >= 0; j--) {
              const ts = r.tailSparks[j]
              ts.x += ts.vx
              ts.y += ts.vy
              ts.alpha -= 0.05

              if (ts.alpha <= 0) {
                r.tailSparks.splice(j, 1)
              } else {
                ctx.globalAlpha = Math.max(0, ts.alpha)
                ctx.beginPath()
                ctx.arc(ts.x, ts.y, ts.size, 0, Math.PI * 2)
                ctx.fill()
              }
            }

            // Draw rocket glowing head (outer halo + brilliant core)
            ctx.globalAlpha = 0.35
            ctx.fillStyle = r.color
            ctx.beginPath()
            ctx.arc(r.x, r.y, 8, 0, Math.PI * 2)
            ctx.fill()

            ctx.globalAlpha = 1
            ctx.fillStyle = '#FFFFFF'
            ctx.beginPath()
            ctx.arc(r.x, r.y, 3.4, 0, Math.PI * 2)
            ctx.fill()

            // 🎆 THE BURST / FATAN: Rocket reaches target in sky!
            if (r.y <= r.targetY) {
              // 1. Sky Flash
              flashes.push({
                x: r.x,
                y: r.y,
                alpha: 0.38,
                color: r.color
              })

              // 2. Expanding Shockwave Ring
              shockwaves.push({
                x: r.x,
                y: r.y,
                radius: 6,
                maxRadius: 65,
                alpha: 0.9,
                color: r.color
              })

              // 3. Spawning radiant explosion sparks (capped for silky 60/120fps)
              const isMobile = window.innerWidth < 768
              const burstCount = isMobile 
                ? Math.floor(Math.random() * 8 + 24) 
                : Math.floor(Math.random() * 12 + 38)

              for (let k = 0; k < burstCount; k++) {
                const angle = (Math.PI * 2 * k) / burstCount + (Math.random() - 0.5) * 0.25
                const velocity = Math.random() * 6.2 + 1.8
                const sparkColor = Math.random() < 0.45 
                  ? r.color 
                  : festiveColors[Math.floor(Math.random() * festiveColors.length)]

                sparks.push({
                  x: r.x,
                  y: r.y,
                  vx: Math.cos(angle) * velocity,
                  vy: Math.sin(angle) * velocity,
                  color: sparkColor,
                  alpha: 1,
                  decay: Math.random() * 0.016 + 0.012,
                  size: Math.random() * 2.6 + 1.6,
                  trail: []
                })
              }

              // Bright central burst flare
              sparks.push({
                x: r.x,
                y: r.y,
                vx: 0,
                vy: 0,
                color: '#FFFFFF',
                alpha: 1,
                decay: 0.15,
                size: 9,
                trail: []
              })

              rockets.splice(i, 1)
            }
          }

          // ===================================================================
          // 4. UPDATE & DRAW BURST SPARKS (EXPANDING WITH WILLOW TRAILS & GRAVITY)
          // ===================================================================
          const isMobile = window.innerWidth < 768
          const maxSparks = isMobile ? 120 : 200
          if (sparks.length > maxSparks) {
            sparks.splice(0, sparks.length - maxSparks)
          }

          for (let s = sparks.length - 1; s >= 0; s--) {
            const p = sparks[s]

            // Save spark trailing point
            if (Math.random() > 0.3) {
              p.trail.push({ x: p.x, y: p.y })
              if (p.trail.length > 3) p.trail.shift()
            }

            p.x += p.vx
            p.y += p.vy
            p.vy += 0.075 // Realistic gravity
            p.vx *= 0.965 // Air resistance
            p.vy *= 0.965
            p.alpha -= p.decay

            if (p.alpha <= 0) {
              sparks.splice(s, 1)
            } else {
              // Draw mini-trailing spark tail
              if (p.trail.length > 1) {
                ctx.globalAlpha = Math.max(0, p.alpha * 0.55)
                ctx.strokeStyle = p.color
                ctx.lineWidth = p.size * 0.65
                ctx.beginPath()
                ctx.moveTo(p.trail[0].x, p.trail[0].y)
                for (let t = 1; t < p.trail.length; t++) {
                  ctx.lineTo(p.trail[t].x, p.trail[t].y)
                }
                ctx.stroke()
              }

              // Draw spark head
              ctx.globalAlpha = Math.max(0, p.alpha)
              ctx.fillStyle = p.color
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          // ===================================================================
          // 5. CONTINUOUS GROUND FOUNTAINS (DIWALI ANAR NEAR DIYAS)
          // ===================================================================
          const w = canvas.width
          const h = canvas.height
          if (sparks.length < (isMobile ? 80 : 150)) {
            // Left Anar (near laptop / speakers)
            if (Math.random() > 0.45) {
              sparks.push({
                x: w * 0.08 + (Math.random() - 0.5) * 14,
                y: h * 0.88,
                vx: (Math.random() - 0.5) * 2.0,
                vy: -Math.random() * 4.0 - 2,
                color: Math.random() > 0.5 ? '#FFE600' : '#FF7700',
                alpha: 1,
                decay: 0.038,
                size: Math.random() * 2 + 1,
                trail: []
              })
            }
            // Right Anar (near diyas / crates)
            if (Math.random() > 0.45) {
              sparks.push({
                x: w * 0.92 + (Math.random() - 0.5) * 14,
                y: h * 0.88,
                vx: (Math.random() - 0.5) * 2.0,
                vy: -Math.random() * 4.0 - 2,
                color: Math.random() > 0.5 ? '#FFE600' : '#FF007A',
                alpha: 1,
                decay: 0.038,
                size: Math.random() * 2 + 1,
                trail: []
              })
            }
          }

          // Reset canvas composite mode and global alpha back to normal
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1
        }

        canvasRafId = window.requestAnimationFrame(render)
      }

      canvasRafId = window.requestAnimationFrame(render)

      return () => {
        clearInterval(interval)
        clearInterval(rocketInterval)
        clearTimeout(initTimer)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', resizeCanvas)
        window.cancelAnimationFrame(canvasRafId)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('blur', handleVisibilityChange)
        window.removeEventListener('focus', handleVisibilityChange)
        resizeObs.disconnect()
        observer.disconnect()
      }
    }

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
        className="w-full relative z-10 will-change-transform transform-gpu origin-top bg-black overflow-hidden flex justify-center"
        style={{ contain: 'paint' }}
      >
        {/* Deep Festive Ambient Glow Background (spans full viewport width) */}
        <div 
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none z-0 will-change-transform opacity-70"
        >
          <div className="absolute -left-20 top-1/4 w-96 h-96 bg-[#FF0055]/20 blur-3xl rounded-full" />
          <div className="absolute left-1/3 top-0 w-[30rem] h-[30rem] bg-[#FFE600]/15 blur-3xl rounded-full" />
          <div className="absolute right-0 bottom-10 w-96 h-96 bg-[#00E5FF]/20 blur-3xl rounded-full" />
        </div>

        {/* Centered Poster Stage: Bounds artwork on large / 2K / 4K / Ultrawide screens to prevent pixelation & overflow */}
        <div className="w-full max-w-[1920px] relative mx-auto z-10">
          <Link 
            href="/browse" 
            className="block w-full cursor-pointer relative group/img"
            title="Samplistic Festival — Get 20% Off on Every Sample Pack (Starts 8 October)"
          >
            {/* Pristine Full-Resolution 100% Uncropped Poster (Desktop Panoramic vs Mobile Portrait) */}
            <picture className="block w-full">
              {/* Desktop & Tablet: Ultra-Wide 1983x793 Panoramic Graphic with 2x 4K Retina Support */}
              <source
                media="(min-width: 768px)"
                srcSet="/festive-banner-desktop.webp 1x, /festive-banner-desktop-2x.webp 2x"
                type="image/webp"
              />
              <source
                media="(min-width: 768px)"
                srcSet="/festive-banner-desktop.png 1x, /festive-banner-desktop-2x.png 2x"
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
                onLoad={() => {
                  if (canvasRef.current) {
                    const parent = canvasRef.current.parentElement || posterRef.current
                    if (parent) {
                      canvasRef.current.width = parent.clientWidth || window.innerWidth
                      canvasRef.current.height = parent.clientHeight || 500
                    }
                  }
                }}
                style={{
                  imageRendering: 'auto',
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

          {/* Cinematic Edge Vignette Fades for Extra-Wide (>1920px) Displays */}
          <div className="hidden 2xl:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-20" />
          <div className="hidden 2xl:block absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-20" />

          {/* Real-time Diwali Firework Rockets Launching and Bursting (Fatan) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          />

        {/* ========================================================================= */}
        {/* FESTIVE FIRECRACKERS, SPARKLERS & SALE DHAMAKA OVERLAYS                   */}
        {/* ========================================================================= */}
        <div 
          ref={particlesRef1}
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden will-change-transform transform-gpu select-none"
        >
          {/* Custom GPU-accelerated Keyframes for Firecrackers & Sparklers */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fireworkBurst {
              0% { transform: scale(0.1) rotate(0deg); opacity: 0; }
              15% { opacity: 1; filter: drop-shadow(0 0 16px #FFE600); }
              75% { opacity: 0.9; }
              100% { transform: scale(1.35) rotate(35deg); opacity: 0; }
            }
            @keyframes sparklerPop {
              0%, 100% { opacity: 0.15; transform: scale(0.7) rotate(0deg); }
              50% { opacity: 1; transform: scale(1.2) rotate(18deg); filter: drop-shadow(0 0 14px #FF7700); }
            }
            @keyframes emberRise {
              0% { transform: translate3d(0, 0, 0) scale(0.5); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 0.85; }
              100% { transform: translate3d(12px, -65px, 0) scale(1.15); opacity: 0; }
            }
            @keyframes rocketTrail {
              0% { transform: scale(0.2); opacity: 0; }
              30% { opacity: 1; filter: drop-shadow(0 0 20px #00E5FF); }
              100% { transform: scale(1.4); opacity: 0; }
            }
          `}} />

          {/* 🎆 Firecracker Burst 1: Top-Right Multi-Color Diwali Rocket Explosion */}
          <div 
            className="absolute top-[10%] right-[10%] w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center pointer-events-none"
            style={{ animation: 'fireworkBurst 3.4s infinite ease-out' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Central spark flare */}
              <circle cx="50" cy="50" r="4" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFE600)" />
              {/* Radiating firecracker sparks */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="#FFE600" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="50" y2="90" stroke="#FFE600" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="10" y2="50" stroke="#FF007A" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="90" y2="50" stroke="#FF007A" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="22" y2="22" stroke="#00E5FF" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="78" y2="22" stroke="#00FF94" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="22" y2="78" stroke="#FF7700" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              <line x1="50" y1="50" x2="78" y2="78" stroke="#FFE600" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              {/* Outer spark dots */}
              <circle cx="50" cy="8" r="2.5" fill="#FFE600" />
              <circle cx="92" cy="50" r="2.5" fill="#FF007A" />
              <circle cx="20" cy="20" r="2" fill="#00E5FF" />
              <circle cx="80" cy="20" r="2.5" fill="#00FF94" />
              <circle cx="80" cy="80" r="2" fill="#FFE600" />
            </svg>
          </div>

          {/* 🎇 Firecracker Burst 2: Top-Left Golden Sparkler / Phooljhadi */}
          <div 
            className="absolute top-[16%] left-[8%] w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center pointer-events-none"
            style={{ animation: 'fireworkBurst 4.1s infinite ease-out', animationDelay: '1.4s' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="3.5" fill="#FFE600" />
              <line x1="50" y1="50" x2="50" y2="15" stroke="#FFE600" strokeWidth="2" strokeLinecap="round" />
              <line x1="50" y1="50" x2="85" y2="50" stroke="#FF7700" strokeWidth="2" strokeLinecap="round" />
              <line x1="50" y1="50" x2="25" y2="25" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
              <line x1="50" y1="50" x2="75" y2="25" stroke="#FFE600" strokeWidth="2" strokeLinecap="round" />
              <line x1="50" y1="50" x2="25" y2="75" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="12" r="3" fill="#FFE600" filter="drop-shadow(0 0 6px #FFE600)" />
              <circle cx="88" cy="50" r="2.5" fill="#FF7700" />
              <circle cx="78" cy="22" r="2" fill="#FFD700" />
            </svg>
          </div>

          {/* 💥 Firecracker Burst 3: Center Sky Sparkler */}
          <div 
            className="absolute top-[6%] left-[48%] -translate-x-1/2 w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center pointer-events-none opacity-90"
            style={{ animation: 'fireworkBurst 3.8s infinite ease-out', animationDelay: '2.2s' }}
          >
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <circle cx="40" cy="40" r="3" fill="#FFF" />
              <line x1="40" y1="40" x2="40" y2="10" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="40" y1="40" x2="70" y2="40" stroke="#00FF94" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="40" y1="40" x2="10" y2="40" stroke="#FFE600" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="40" y1="40" x2="62" y2="18" stroke="#FF007A" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="40" y1="40" x2="18" y2="18" stroke="#FF7700" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Neon Graffiti Music Notes */}
          <div className="absolute top-[20%] left-[6%] hidden sm:flex items-center justify-center filter drop-shadow-[0_0_14px_#00FF94] animate-bounce" style={{ animationDuration: '3.2s' }}>
            <Music size={28} className="text-[#00FF94] rotate-[-12deg]" />
          </div>
          <div className="absolute top-[26%] right-[8%] hidden sm:flex items-center justify-center filter drop-shadow-[0_0_16px_#FF007A] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.8s' }}>
            <Music size={32} className="text-[#FF007A] rotate-[15deg]" />
          </div>

          {/* Crackling Diamond Stars */}
          <div className="absolute top-[14%] right-[22%] flex items-center justify-center pointer-events-none" style={{ animation: 'sparklerPop 2.2s infinite ease-in-out' }}>
            <Sparkles size={22} className="text-[#FFE600]" />
          </div>
          <div className="absolute top-[32%] left-[18%] flex items-center justify-center pointer-events-none" style={{ animation: 'sparklerPop 2.6s infinite ease-in-out', animationDelay: '1s' }}>
            <Sparkle size={18} className="text-[#00E5FF]" />
          </div>
          <div className="absolute bottom-[24%] right-[12%] flex items-center justify-center pointer-events-none" style={{ animation: 'sparklerPop 3s infinite ease-in-out', animationDelay: '0.5s' }}>
            <Sparkles size={20} className="text-[#FF7700]" />
          </div>
        </div>

        {/* Layer 2: Rising Golden Embers & Crackling Sparks (Anar / Diya Sparks) */}
        <div 
          ref={particlesRef2}
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden will-change-transform transform-gpu select-none"
        >
          {/* Golden rising spark 1 */}
          <div className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-[#FFE600] shadow-[0_0_12px_#FFE600]" style={{ animation: 'emberRise 2.8s infinite linear', animationDelay: '0s' }} />
          {/* Fire orange rising spark 2 */}
          <div className="absolute bottom-[20%] left-[32%] w-2.5 h-2.5 rounded-full bg-[#FF7700] shadow-[0_0_14px_#FF7700]" style={{ animation: 'emberRise 3.2s infinite linear', animationDelay: '0.9s' }} />
          {/* Lime green spark 3 */}
          <div className="absolute bottom-[30%] left-[45%] w-1.5 h-1.5 rounded-full bg-[#00FF94] shadow-[0_0_10px_#00FF94]" style={{ animation: 'emberRise 2.5s infinite linear', animationDelay: '1.6s' }} />
          {/* Electric cyan spark 4 */}
          <div className="absolute bottom-[22%] right-[28%] w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]" style={{ animation: 'emberRise 3.5s infinite linear', animationDelay: '0.4s' }} />
          {/* Magenta rocket spark 5 */}
          <div className="absolute bottom-[18%] right-[16%] w-2.5 h-2.5 rounded-full bg-[#FF007A] shadow-[0_0_14px_#FF007A]" style={{ animation: 'emberRise 2.9s infinite linear', animationDelay: '1.3s' }} />
          {/* Gold spark 6 */}
          <div className="absolute bottom-[28%] right-[38%] w-2 h-2 rounded-full bg-[#FFE600] shadow-[0_0_10px_#FFE600]" style={{ animation: 'emberRise 3.1s infinite linear', animationDelay: '2.1s' }} />

          {/* Neon Cyan Music Note for Mobile */}
          <div className="absolute top-[38%] left-[7%] flex sm:hidden items-center justify-center filter drop-shadow-[0_0_12px_#00E5FF]">
            <Music size={20} className="text-[#00E5FF] rotate-[-18deg]" />
          </div>
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

