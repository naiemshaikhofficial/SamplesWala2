'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface AnimatedLogoProps {
  className?: string
  onClick?: () => void
}

const samplesLetters = [
  { char: 'S', color: 'text-studio-red' },
  { char: 'A', color: 'text-studio-orange' },
  { char: 'M', color: 'text-studio-yellow' },
  { char: 'P', color: 'text-studio-neon' },
  { char: 'L', color: 'text-studio-pink' },
  { char: 'E', color: 'text-studio-blue' },
  { char: 'S', color: 'text-studio-purple' },
]

const walaLetters = [
  { char: 'W', color: 'text-black' },
  { char: 'A', color: 'text-black' },
  { char: 'L', color: 'text-black' },
  { char: 'A', color: 'text-black' },
]

// Container variants to coordinate stagger
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
}

// Individual letter variants for the juggling pop
const letterVariants = {
  hidden: { 
    y: -35, 
    opacity: 0, 
    scale: 0.3, 
    rotate: -20 
  },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12
    }
  }
}

export function AnimatedLogo({ className = '', onClick }: AnimatedLogoProps) {
  return (
    <Link href="/" className={`flex items-center select-none ${className}`} onClick={onClick}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center font-luckiest-guy tracking-tight relative py-2"
      >
        {/* Floating animated music notes above the logo */}
        <div className="absolute top-0 right-16 pointer-events-none flex gap-1 z-10">
          <motion.svg
            animate={{
              y: [0, -3, 0],
              rotate: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-3.5 h-3.5 text-studio-neon fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/>
          </motion.svg>
          
          <motion.svg
            animate={{
              y: [0, -4, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
            className="w-3.5 h-3.5 text-studio-pink fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/>
          </motion.svg>
        </div>

        {/* Word 1: SAMPLES */}
        <div className="flex gap-0.5 md:gap-1 text-2xl md:text-3xl mr-2 md:mr-3">
          {samplesLetters.map((item, idx) => (
            <motion.span
              key={`s-${idx}`}
              variants={letterVariants}
              whileHover={{ 
                y: -6, 
                scale: 1.15, 
                rotate: idx % 2 === 0 ? 5 : -5,
                transition: { type: "spring", stiffness: 450 }
              }}
              className={`inline-block ${item.color} comic-text leading-none select-none cursor-pointer`}
            >
              {item.char}
            </motion.span>
          ))}
        </div>

        {/* Word 2: WALA in a retro bold badge */}
        <motion.div 
          variants={letterVariants}
          whileHover={{
            scale: 1.05,
            rotate: -3,
            transition: { type: "spring", stiffness: 400 }
          }}
          className="flex items-center bg-studio-yellow px-1.5 py-0.5 md:py-1 border-3 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none rotate-[-2deg] translate-y-[-1px]"
        >
          <div className="flex gap-0.5 text-sm md:text-base">
            {walaLetters.map((item, idx) => (
              <motion.span
                key={`w-${idx}`}
                whileHover={{ 
                  y: -2, 
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 500 }
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
