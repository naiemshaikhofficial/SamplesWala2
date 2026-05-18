'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ShieldCheck } from 'lucide-react'

export function HeroSlider({ packs }: { packs: any[] }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)
  const progressTimer = useRef<NodeJS.Timeout | null>(null)
  const isHovered = useRef(false)

  const slideDuration = 6000 // 6 seconds per slide

  // Active Pack Data
  const activePack = packs[activeIndex] || packs[0]

  useEffect(() => {
    if (!packs || packs.length === 0) return

    // Setup auto-play interval
    const startAutoPlay = () => {
      setProgress(0)
      
      // Timer for slide transition
      autoPlayTimer.current = setInterval(() => {
        if (!isHovered.current) {
          setActiveIndex((prev) => (prev + 1) % packs.length)
        }
      }, slideDuration)

      // Timer for high-precision progress bar updates
      const tick = 100
      progressTimer.current = setInterval(() => {
        if (!isHovered.current) {
          setProgress((prev) => {
            if (prev >= 100) return 0
            return prev + (tick / slideDuration) * 100
          })
        }
      }, tick)
    }

    startAutoPlay()

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current)
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [packs, activeIndex])

  if (!packs || packs.length === 0) return null

  const handleSelectSlide = (index: number) => {
    setActiveIndex(index)
    setProgress(0)
  }

  const handleAddToCart = (e: React.MouseEvent, pack: any) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack'
    })
    setAddedId(pack.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const handleBuyNow = (e: React.MouseEvent, pack: any) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack'
    })
    router.push('/checkout')
  }

  // Predefined custom comic tags for slides
  const tags = [
    { text: 'NEW ARRIVAL', color: 'bg-studio-red' },
    { text: 'BEST SELLER', color: 'bg-studio-pink' },
    { text: 'TRENDING PACK', color: 'bg-studio-yellow' },
    { text: 'PRE-ORDER SAVINGS', color: 'bg-studio-neon' },
  ]

  const activeTag = tags[activeIndex % tags.length]

  return (
    <div 
      className="w-full relative z-30"
      onMouseEnter={() => { isHovered.current = true }}
      onMouseLeave={() => { isHovered.current = false }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Main Showcase Slider Panel (Grid column 3/4 span) */}
        <div className="lg:col-span-3 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex-1 min-h-[460px] md:min-h-[500px] bg-studio-charcoal border-4 border-black shadow-premium p-6 md:p-10 relative overflow-hidden flex flex-col justify-between group"
            >
              
              {/* Parallax Background Glow Layer */}
              <div className="absolute top-0 right-0 w-[60%] h-[120%] bg-gradient-to-l from-white/[0.02] via-transparent to-transparent pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-studio-neon/[0.04] blur-[80px] rounded-full pointer-events-none" />
              
              {/* Top Row: Tags & Badges */}
              <div className="flex items-center justify-between relative z-10">
                <div className={`px-4 py-1.5 ${activeTag.color} text-black font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-[3px_3px_0px_black] border-2 border-black rotate-[-2deg]`}>
                  {activeTag.text}
                </div>
                
                <div className="flex items-center gap-2 bg-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_white]">
                  <ShieldCheck size={12} className="text-studio-neon" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-white">100% Royalty Free</span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6 relative z-10 flex-1">
                
                {/* Left Text Block (7 Columns) */}
                <div className="md:col-span-7 space-y-4 md:space-y-6 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-studio-neon tracking-widest block">
                      {activePack.categories?.name || 'SPECIAL PACK'}
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic text-white comic-text leading-tight">
                      {activePack.name}
                    </h2>
                  </div>

                  <p className="text-xs md:text-sm text-white/60 font-medium leading-relaxed max-w-lg border-l-4 border-studio-blue pl-4">
                    {activePack.description || "Unleash authentic Indian vibes in your DAW. This premium kit delivers pristine royalty-free recordings, rhythms, and modern fusion sounds ready to supercharge your beatmaking production."}
                  </p>

                  {/* Pricing Block */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-white/40 line-through font-black">
                        ₹{activePack.mrp_inr || (Number(activePack.price_inr) * 3)}
                      </span>
                      <span className="text-3xl md:text-4xl font-black text-studio-yellow italic leading-none comic-text">
                        ₹{activePack.price_inr}
                      </span>
                    </div>
                    
                    <div className="bg-studio-red px-3 py-1 border-2 border-black shadow-[3px_3px_0px_black] rotate-3">
                      <span className="text-[10px] md:text-xs font-black text-white uppercase italic">
                        {Math.round((1 - (Number(activePack.price_inr) / (activePack.mrp_inr || (Number(activePack.price_inr) * 3)))) * 100)}% OFF
                      </span>
                    </div>

                    {!activePack.is_downloadable && (
                      <div className="bg-studio-neon px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_black] text-black text-[8px] font-black uppercase -rotate-2">
                        Pre-Order Offer
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Visual Image Block (5 Columns) */}
                <div className="md:col-span-5 flex justify-center md:justify-end relative">
                  {/* Decorative Comic Splash behind the cover */}
                  <div className="absolute w-60 h-60 bg-studio-pink/10 blur-2xl rounded-full -z-10 animate-pulse" />
                  
                  <div className="w-56 md:w-64 aspect-square relative border-4 border-black shadow-premium transform hover:rotate-0 transition-transform duration-500 -rotate-3 group-hover:scale-105">
                    <Image
                      src={getOptimizedImageUrl(activePack.cover_url, 600, 80)}
                      alt={activePack.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 220px, 320px"
                      className="object-cover"
                    />
                    
                    {/* Corner badge on image */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-studio-yellow text-black border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_black]">
                      <Zap size={16} fill="black" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 pt-4 border-t border-white/5">
                
                {/* Cart added animation popover */}
                <div className="relative w-full sm:w-auto">
                  <AnimatePresence>
                    {addedId === activePack.id && (
                      <motion.div
                        initial={{ scale: 0, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 bg-studio-neon text-black px-4 py-2 border-4 border-black font-black italic text-xs shadow-premium"
                      >
                        {!activePack.is_downloadable ? 'RESERVED!' : 'ADDED TO CART!'}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-studio-neon border-r-4 border-b-4 border-black rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={(e) => handleAddToCart(e, activePack)}
                    className="w-full sm:w-auto h-14 px-8 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-studio-neon hover:text-black transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-3"
                  >
                    <Image src="/cart-bag.png" alt="Cart" width={16} height={16} className="brightness-0" />
                    {!activePack.is_downloadable ? 'PRE-ORDER NOW' : 'ADD TO CART'}
                  </button>
                </div>

                <button
                  onClick={(e) => handleBuyNow(e, activePack)}
                  className={`w-full sm:w-auto h-14 px-10 ${!activePack.is_downloadable ? 'bg-studio-neon text-black' : 'bg-studio-pink text-white'} font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center`}
                >
                  {!activePack.is_downloadable ? 'CLAIM PRE-ORDER' : 'GET IT NOW'}
                </button>
                
                <Link
                  href={`/packs/${activePack.slug}`}
                  className="w-full sm:w-auto h-14 px-6 border-2 border-white/10 hover:border-studio-blue hover:text-studio-blue text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all"
                >
                  View Pack Details
                </Link>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Vertical Carousel Selectors (Grid column 1/4 span) */}
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none justify-between">
          {packs.map((pack: any, index: number) => {
            const isActive = index === activeIndex
            return (
              <button
                key={pack.id}
                onClick={() => handleSelectSlide(index)}
                className={`flex-1 min-w-[200px] lg:w-full text-left p-3.5 border-4 border-black transition-all duration-300 relative flex items-center gap-3.5 select-none ${
                  isActive 
                    ? 'bg-white/10 border-studio-pink shadow-[4px_4px_0px_black] translate-x-1' 
                    : 'bg-studio-charcoal border-black hover:bg-white/[0.03] hover:translate-x-0.5'
                }`}
              >
                {/* Active slider background slide-in indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-studio-pink" />
                )}

                {/* Pack Tiny Cover Thumbnail */}
                <div className="w-12 h-12 relative flex-shrink-0 border-2 border-black">
                  <Image
                    src={getOptimizedImageUrl(pack.cover_url, 150, 80)}
                    alt={pack.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                {/* Pack Metadata */}
                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-studio-blue block">
                    {pack.categories?.name || 'LOOPS KIT'}
                  </span>
                  <h4 className="text-[12px] font-black uppercase truncate text-white tracking-tight leading-tight">
                    {pack.name}
                  </h4>
                  
                  {/* Miniature auto-play Progress Bar (Visible only on Active card) */}
                  {isActive ? (
                    <div className="w-full h-1 bg-white/10 mt-2 relative overflow-hidden rounded-full">
                      <div 
                        className="h-full bg-studio-pink transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold text-studio-neon italic mt-1 block">
                      ₹{pack.price_inr}
                    </span>
                  )}
                </div>

              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
