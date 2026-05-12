'use client'
import Image from 'next/image'

export function BackgroundMural() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Next.js Image for automatic optimization and bandwidth saving */}
      <Image
        src="/mural-bg.png"
        alt="Graffiti Background"
        fill
        priority
        quality={80}
        className="object-cover opacity-100" 
      />
      {/* Dark overlay for readability - 92% dark */}
      <div className="absolute inset-0 bg-black/92" />
    </div>
  )
}
