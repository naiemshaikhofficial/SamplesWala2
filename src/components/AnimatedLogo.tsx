'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

interface AnimatedLogoProps {
  className?: string
  onClick?: () => void
  isHero?: boolean
}

const samplesLetters = [
  { char: 'S', color: 'text-studio-red', glow: 'rgba(255, 49, 49, 0.6)' },
  { char: 'A', color: 'text-studio-orange', glow: 'rgba(255, 92, 0, 0.6)' },
  { char: 'M', color: 'text-studio-yellow', glow: 'rgba(255, 230, 0, 0.6)' },
  { char: 'P', color: 'text-studio-neon', glow: 'rgba(0, 255, 148, 0.6)' },
  { char: 'L', color: 'text-studio-pink', glow: 'rgba(0, 191, 255, 0.6)' },
  { char: 'E', color: 'text-studio-blue', glow: 'rgba(255, 0, 128, 0.6)' },
  { char: 'S', color: 'text-studio-purple', glow: 'rgba(191, 0, 255, 0.6)' },
]

const walaLetters = [
  { char: 'W' },
  { char: 'A' },
  { char: 'L' },
  { char: 'A' },
]

// Staggered Container
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
}

// Extreme Elastic Drop variant for entrance
const letterVariants: Variants = {
  hidden: { 
    y: -90, 
    opacity: 0, 
    scale: 0.1, 
    rotate: -45 
  },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 8, // Super bouncy! Damping under 10 creates highly elastic bounce
    }
  }
}

export function AnimatedLogo({ className = '', onClick, isHero = false }: AnimatedLogoProps) {
  return (
    <Link href="/" className={`flex items-center select-none ${className}`} onClick={onClick}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center font-luckiest-guy tracking-tight relative py-3"
      >
        {/* Extreme Asynchronous Dancing music notes */}
        <div className={`absolute pointer-events-none flex gap-1.5 z-10 ${
          isHero ? 'top-[-10px] right-24 scale-150 sm:scale-175' : 'top-0 right-14'
        }`}>
          <motion.svg
            animate={{
              y: [0, -6, 2, -6, 0],
              rotate: [0, 45, -35, 45, 0],
              scale: [1, 1.25, 0.85, 1.2, 1]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-4 h-4 text-studio-neon fill-current drop-shadow-[0_0_8px_rgba(0,255,148,0.5)]"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/>
          </motion.svg>
          
          <motion.svg
            animate={{
              y: [0, -8, 1, -7, 0],
              rotate: [0, -45, 30, -35, 0],
              scale: [1, 0.8, 1.3, 0.9, 1]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="w-3.5 h-3.5 text-studio-pink fill-current drop-shadow-[0_0_8px_rgba(255,0,128,0.5)]"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/>
          </motion.svg>
        </div>

        {/* Word 1: SAMPLES */}
        <div className={`flex gap-0.5 md:gap-1.5 ${
          isHero 
            ? 'text-4xl sm:text-6xl md:text-8xl mr-4 md:mr-6' 
            : 'text-2.5xl md:text-3.5xl mr-2.5 md:mr-3.5'
        }`}>
          {samplesLetters.map((item, idx) => (
            <motion.span
              key={`s-${idx}`}
              variants={letterVariants}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.15
              }}
              whileHover={{ 
                y: isHero ? -32 : -18, 
                scale: 1.35, 
                rotate: idx % 2 === 0 ? 15 : -15,
                zIndex: 50,
                textShadow: `0 0 25px ${item.glow}, 0 0 45px ${item.glow}`,
                transition: { type: "spring", stiffness: 500, damping: 10 }
              }}
              whileTap={{ scale: 0.85, rotate: idx % 2 === 0 ? -10 : 10 }}
              className={`inline-block ${item.color} comic-text leading-none select-none cursor-pointer`}
            >
              {item.char}
            </motion.span>
          ))}
        </div>

        {/* Word 2: WALA */}
        <motion.div 
          variants={letterVariants}
          animate={{
            rotate: [-2, 1, -2],
            y: [-1, 1, -1]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
          whileHover={{
            scale: [1, 1.25, 0.85, 1.15, 1.05],
            rotate: 4,
            zIndex: 50,
            boxShadow: "0 0 20px rgba(255, 230, 0, 0.8)",
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          className={`flex items-center bg-studio-yellow border-black rounded-none rotate-[-2deg] ${
            isHero 
              ? 'px-4 py-1.5 md:py-3 border-4 md:border-6 shadow-[6px_6px_0px_black]' 
              : 'px-2 py-0.5 md:py-1 border-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <div className={`flex gap-0.5 ${
            isHero ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-sm md:text-base'
          }`}>
            {walaLetters.map((item, idx) => (
              <motion.span
                key={`w-${idx}`}
                whileHover={{ 
                  y: -3, 
                  scale: 1.25,
                  rotate: idx % 2 === 0 ? 10 : -10,
                  transition: { type: "spring", stiffness: 600 }
                }}
                className="inline-block text-black font-black leading-none select-none cursor-pointer"
              >
                {item.char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}
