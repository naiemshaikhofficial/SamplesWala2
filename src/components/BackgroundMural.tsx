'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export function BackgroundMural() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Multiple parallax layers with different speeds
  // On mobile, we set the multiplier to 0 to prevent glitching
  const muralY = useTransform(smoothY, (v) => isMobile ? 0 : v * 0.05)
  const dotsY = useTransform(smoothY, (v) => isMobile ? 0 : v * 0.15)
  const speedLinesY = useTransform(smoothY, (v) => isMobile ? 0 : v * 0.4)
  const assetsY = useTransform(smoothY, (v) => isMobile ? 0 : v * -0.2)
  const tagsY = useTransform(smoothY, (v) => isMobile ? 0 : v * 0.1)

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-black">
      {/* LAYER -1: Dynamic Color Splatters (Deepest Color Wash) */}
      <div className="absolute inset-0 opacity-25 blur-[120px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-studio-pink rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-studio-blue rounded-full" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-studio-purple rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] left-[-5%] w-[45%] h-[45%] bg-studio-yellow rounded-full" style={{ animationDelay: '1.5s' }} />
      </div>
      {/* LAYER 0: The Base Mural (Deepest) */}
      <motion.div 
        style={{ 
          y: muralY,
          willChange: 'transform',
          translateZ: 0 
        }}
        className="absolute inset-0 w-full h-[140%] -top-[20%]"
      >
        <Image
          src="/mural-bg.png"
          alt="Graffiti Background"
          fill
          priority
          quality={85}
          className="object-cover object-center md:object-right-bottom opacity-60" 
        />
      </motion.div>

      {/* LAYER 1: Comic Halftone Dots Overlay */}
      <motion.div 
        style={{ 
          y: dotsY,
          willChange: 'transform',
          translateZ: 0
        }}
        className="absolute inset-0 w-full h-[150%] -top-[25%] opacity-[0.15] mix-blend-overlay"
        dangerouslySetInnerHTML={{ __html: `
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="halftone" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#halftone)" />
          </svg>
        ` }}
      />

      {/* LAYER 2: Floating Comic Speed Lines */}
      <motion.div 
        style={{ 
          y: speedLinesY,
          willChange: 'transform',
          translateZ: 0
        }}
        className="absolute inset-0 w-full h-[200%] -top-[50%] opacity-10 flex justify-around pointer-events-none"
      >
        {isClient && [...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="w-[2px] h-full bg-gradient-to-b from-transparent via-studio-yellow to-transparent" 
            style={{ 
              marginLeft: `${Math.random() * 100}px`,
              opacity: Math.random() * 0.5 + 0.2,
              transform: `rotate(${Math.random() * 10 - 5}deg)`
            }}
          />
        ))}
      </motion.div>

      {/* LAYER 3: Floating Musical Assets (Notes, etc.) */}
      <motion.div 
        style={{ 
          y: assetsY,
          willChange: 'transform',
          translateZ: 0
        }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] flex flex-wrap justify-between p-20 opacity-20"
      >
        <div className="text-studio-pink animate-bounce" style={{ animationDuration: '3s' }}>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <div className="text-studio-blue mt-96 animate-pulse" style={{ animationDuration: '5s' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l8.16 14.91L12 21l-8.16-3.09L12 3z"/></svg>
        </div>
        <div className="text-studio-neon ml-auto mt-40 rotate-12">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5"/></svg>
        </div>
      </motion.div>

      {/* LAYER 5: Floating Neon Graffiti Tags */}
      <motion.div 
        style={{ 
          y: tagsY,
          willChange: 'transform',
          translateZ: 0
        }}
        className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none overflow-hidden"
      >
        <div className="absolute top-[10%] left-[5%] -rotate-12 opacity-[0.08]" style={{ WebkitTextStroke: '2px var(--color-studio-pink)', color: 'transparent', filter: 'drop-shadow(0 0 10px var(--color-studio-pink))' }}>
          <span className="text-8xl md:text-[12rem] font-black italic">SAMPLES</span>
        </div>
        <div className="absolute top-[40%] right-[10%] rotate-6 opacity-[0.05]" style={{ WebkitTextStroke: '2px var(--color-studio-neon)', color: 'transparent', filter: 'drop-shadow(0 0 10px var(--color-studio-neon))' }}>
          <span className="text-8xl md:text-[15rem] font-black">BASS</span>
        </div>
        <div className="absolute bottom-[20%] left-[15%] -rotate-6 opacity-[0.06]" style={{ WebkitTextStroke: '2px var(--color-studio-yellow)', color: 'transparent', filter: 'drop-shadow(0 0 10px var(--color-studio-yellow))' }}>
          <span className="text-7xl md:text-[10rem] font-black italic">WAALA</span>
        </div>
        <div className="absolute top-[70%] right-[5%] -rotate-12 opacity-[0.04]" style={{ WebkitTextStroke: '2px var(--color-studio-blue)', color: 'transparent', filter: 'drop-shadow(0 0 10px var(--color-studio-blue))' }}>
          <span className="text-8xl md:text-[12rem] font-black">RAW</span>
        </div>
        <div className="absolute top-[5%] right-[20%] rotate-12 opacity-[0.03]" style={{ WebkitTextStroke: '2px #ff4d00', color: 'transparent', filter: 'drop-shadow(0 0 10px #ff4d00)' }}>
          <span className="text-6xl md:text-[8rem] font-black italic">FIRE</span>
        </div>
      </motion.div>

      {/* LAYER 5.5: Hand-Drawn Comic Doodles (Stars, Crowns) */}
      {isClient && (
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
          {/* Stars */}
          <div className="absolute top-[15%] left-[20%] rotate-12 text-white">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L14.39 8.26H22L15.81 12.74L18.19 20L12 15.52L5.81 20L8.19 12.74L2 8.26H9.61L12 1Z"/></svg>
          </div>
          <div className="absolute top-[60%] right-[15%] -rotate-12 text-studio-yellow">
             <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L14.39 8.26H22L15.81 12.74L18.19 20L12 15.52L5.81 20L8.19 12.74L2 8.26H9.61L12 1Z"/></svg>
          </div>
          <div className="absolute bottom-[10%] left-[40%] rotate-45 text-studio-pink">
             <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L14.39 8.26H22L15.81 12.74L18.19 20L12 15.52L5.81 20L8.19 12.74L2 8.26H9.61L12 1Z"/></svg>
          </div>

          {/* Crowns */}
          <div className="absolute top-[40%] left-[8%] -rotate-12 text-studio-blue">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/></svg>
          </div>
          <div className="absolute top-[8%] right-[30%] rotate-12 text-white">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/></svg>
          </div>
        </div>
      )}

      {/* LAYER 6: Dynamic Overlays & Vignettes */}
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
      
      {/* Comic Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Subtle Scanner Line Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  )
}



