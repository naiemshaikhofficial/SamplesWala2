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

export function AnimatedLogo({ className = '', onClick }: AnimatedLogoProps) {
  return (
    <Link href="/" className={`flex items-center select-none ${className}`} onClick={onClick}>
      <div className="flex items-center font-luckiest-guy tracking-tight relative py-2">
        {/* Floating animated music notes above the logo */}
        <div className="absolute -top-2 right-16 pointer-events-none flex gap-1 z-10">
          <motion.svg
            animate={{
              y: [0, -5, 0],
              rotate: [0, -15, 0],
              scale: [1, 1.1, 1]
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
              y: [0, -7, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
            className="w-3 h-3 text-studio-pink fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/>
          </motion.svg>
        </div>

        {/* Word 1: SAMPLES with continuous wavy juggling delay */}
        <div className="flex gap-0.5 md:gap-1 text-2xl md:text-3xl mr-2 md:mr-3">
          {samplesLetters.map((item, idx) => (
            <motion.span
              key={`s-${idx}`}
              animate={{
                y: [0, -6, 0],
                rotate: [0, idx % 2 === 0 ? 3 : -3, 0]
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.12
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.25, 
                rotate: idx % 2 === 0 ? 10 : -10,
                transition: { type: "spring", stiffness: 450 }
              }}
              className={`inline-block ${item.color} comic-text leading-none select-none cursor-pointer`}
            >
              {item.char}
            </motion.span>
          ))}
        </div>

        {/* Word 2: WALA in a retro bold badge with continuous float and staggered wavy letters */}
        <motion.div 
          animate={{
            y: [0, 3, 0],
            rotate: [-2, 1, -2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
          whileHover={{
            scale: 1.05,
            rotate: -4,
            transition: { type: "spring", stiffness: 400 }
          }}
          className="flex items-center bg-studio-yellow px-1.5 py-0.5 md:py-1 border-3 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none"
        >
          <div className="flex gap-0.5 text-sm md:text-base">
            {walaLetters.map((item, idx) => (
              <motion.span
                key={`w-${idx}`}
                animate={{
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.08
                }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.2,
                  transition: { type: "spring", stiffness: 500 }
                }}
                className="inline-block text-black font-black leading-none select-none cursor-pointer"
              >
                {item.char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </Link>
  )
}
