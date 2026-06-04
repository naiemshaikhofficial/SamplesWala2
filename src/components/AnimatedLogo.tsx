'use client'

import Link from 'next/link'
import Image from 'next/image'

interface AnimatedLogoProps {
  className?: string
  onClick?: () => void
  isHero?: boolean
}

export function AnimatedLogo({ className = '', onClick, isHero = false }: AnimatedLogoProps) {
  const width = isHero ? 320 : 180
  const height = isHero ? 80 : 45

  return (
    <Link 
      href="/" 
      className={`flex items-center select-none hover:scale-105 transition-transform duration-200 ${className}`} 
      onClick={onClick}
    >
      <Image
        src="/Logo.png"
        alt="SamplesWala Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </Link>
  )
}
