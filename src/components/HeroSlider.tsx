'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ShieldCheck } from 'lucide-react'
import { getPackPriceDetails } from '@/lib/pricing'
import { useCurrency } from '@/context/CurrencyContext'

export function HeroSlider({ packs }: { packs: any[] }) {
  const { addItem, buyNow, isItemOwned } = useCart()
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [addedId, setAddedId] = useState<string | null>(null)
  const { formatPrice, getAmount } = useCurrency()
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)
  const isHovered = useRef(false)

  // Touch gesture refs for mobile swiping
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const touchEndY = useRef<number | null>(null)

  const slideDuration = 6000 // 6 seconds per slide

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return
    }

    const diffX = touchStartX.current - touchEndX.current
    const diffY = touchStartY.current - touchEndY.current
    const swipeThreshold = 50 // Minimum swipe distance in px

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > swipeThreshold) {
        // Swipe left -> Next slide
        setActiveIndex((prev) => (prev + 1) % packs.length)
      } else if (diffX < -swipeThreshold) {
        // Swipe right -> Prev slide
        setActiveIndex((prev) => (prev - 1 + packs.length) % packs.length)
      }
    }

    touchStartX.current = null
    touchEndX.current = null
    touchStartY.current = null
    touchEndY.current = null
  }

  // Active Pack Data
  const activePack = packs[activeIndex] || packs[0]
  const isOwnedActive = activePack ? isItemOwned(activePack.id, activePack.slug) : false
  const isIndiaActive = activePack ? (activePack.series === 'India Journey' || activePack.series_name === 'India Journey') : false

  // Calculate dynamic pricing details
  const priceDetails = React.useMemo(() => {
    if (!activePack) return null
    return getPackPriceDetails(activePack)
  }, [activePack])

  const currentPriceInr = priceDetails ? priceDetails.priceInr : Number(activePack?.price_inr || 0)
  const isFree = currentPriceInr === 0 || Number(activePack?.price_inr) === 0
  const priceNum = getAmount(currentPriceInr, activePack?.price_usd)
  const rawMrp = activePack?.mrp_inr ? Number(activePack.mrp_inr) : (isFree ? 0 : currentPriceInr * 3)
  const mrpNum = getAmount(rawMrp, activePack?.price_usd ? Number(activePack.price_usd) * 3 : null)

  const displayPrice = isFree ? 'FREE' : formatPrice(currentPriceInr, activePack?.price_usd)
  const displayMrp = rawMrp > 0 && !isFree ? formatPrice(rawMrp, activePack?.price_usd ? Number(activePack.price_usd) * 3 : null) : null
  const discountPercent = mrpNum > priceNum && priceNum > 0 ? Math.round((1 - (priceNum / mrpNum)) * 100) : 0
  const isPreorderActive = priceDetails ? priceDetails.isPreorderActive : false
  const isExpired = priceDetails ? priceDetails.isExpired : false

  useEffect(() => {
    if (!packs || packs.length === 0) return

    // Setup auto-play interval
    const startAutoPlay = () => {
      // Timer for slide transition
      autoPlayTimer.current = setInterval(() => {
        if (!isHovered.current) {
          setActiveIndex((prev) => (prev + 1) % packs.length)
        }
      }, slideDuration)
    }

    startAutoPlay()

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current)
    }
  }, [packs, activeIndex])

  if (!packs || packs.length === 0) return null

  const handleSelectSlide = (index: number) => {
    setActiveIndex(index)
  }

  const handleAddToCart = (e: React.MouseEvent, pack: any, price: number) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack',
      is_downloadable: pack.is_downloadable
    })
    setAddedId(pack.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const handleBuyNow = (e: React.MouseEvent, pack: any, price: number) => {
    e.preventDefault()
    e.stopPropagation()
    buyNow({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack',
      is_downloadable: pack.is_downloadable
    })
  }

  // Predefined custom comic tags for slides
  const tags = [
    { text: 'NEW ARRIVAL', color: 'bg-studio-red text-white' },
    { text: 'BEST SELLER', color: 'bg-[#18181b] text-zinc-200 border-zinc-700' },
    { text: 'TRENDING PACK', color: 'bg-studio-yellow text-black' },
    { text: 'EPIC DEAL', color: 'bg-studio-neon text-black' },
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
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-auto min-h-[580px] lg:h-[500px] bg-studio-charcoal border-4 border-black shadow-premium p-6 md:p-10 relative overflow-hidden flex flex-col justify-between group"
          >

            <AnimatePresence mode="wait">
              <motion.div
                key={activePack.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col justify-between flex-1 gap-6"
              >
                {/* Dynamic Poster Backdrop (Epic Games Style) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 rounded-sm">
                  {/* The dynamic background image with slow parallax zoom on hover */}
                  <div className="absolute inset-0 w-full h-full transform scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out">
                    <Image
                      src={activePack.cover_url || '/placeholder.jpg'}
                      alt=""
                      fill
                      sizes="(max-width: 1200px) 100vw, 80vw"
                      className="object-cover object-right opacity-50 filter brightness-[0.5]"
                      priority
                    />
                  </div>
                  {/* Left-to-Right Dark Gradient Mask for perfect text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-studio-charcoal via-studio-charcoal/80 to-transparent w-full md:w-[70%]" />
                  {/* Bottom Dark Gradient Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-charcoal via-studio-charcoal/60 to-transparent" />
                  {/* Overall Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Top Row: Tags & Badges */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`px-4 py-1.5 ${activeTag.color} ${activeTag.color.includes('text-') ? '' : 'text-black'} font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-[3px_3px_0px_black] border-2 border-black rotate-[-2deg]`}>
                      {activeTag.text}
                    </div>
                    {isOwnedActive && (
                      <div className={`flex items-center ${
                        isIndiaActive 
                          ? 'bg-[#128807] text-white shadow-[3px_3px_0px_#FF9933] border-2 border-black' 
                          : 'bg-[#18181b] text-zinc-300 shadow-[3px_3px_0px_black] border-2 border-zinc-700'
                      } px-3 py-1 font-black uppercase text-[9px] md:text-[11px] tracking-wider rotate-[1deg]`}>
                        <span>OWNED</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_white]">
                    <ShieldCheck size={12} className="text-studio-neon" />
                    <span className="text-[8px] font-black uppercase tracking-wider text-white">100% Royalty Free</span>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4 relative z-10 flex-1">

                  {/* Left Text Block (7 Columns) */}
                  <div className="md:col-span-7 flex flex-col justify-center space-y-3 md:space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                        {activePack.categories?.name || "SOUND COLLECTION"}
                      </span>
                      <h2 className="text-2xl md:text-4xl lg:text-4xl font-black uppercase tracking-tighter italic text-white comic-text leading-none break-words line-clamp-2">
                        {activePack.name}
                      </h2>
                    </div>

                    <p className="text-xs md:text-sm text-white/60 font-medium leading-relaxed max-w-lg border-l-4 border-zinc-700 pl-4 line-clamp-2">
                      {activePack.description || "Unleash authentic Indian vibes in your DAW. This premium kit delivers pristine royalty-free recordings, rhythms, and modern fusion sounds ready to supercharge your beatmaking production."}
                    </p>

                    {/* Pricing Block */}
                    <div className="flex items-center gap-4 pt-2">
                      {isOwnedActive ? (
                        <div className={`flex items-center gap-2 ${
                          isIndiaActive 
                            ? 'bg-[#128807]/20 border-2 border-[#128807] shadow-[3px_3px_0px_#FF9933]' 
                            : 'bg-[#18181b] border-2 border-zinc-700 shadow-[3px_3px_0px_black]'
                        } px-3.5 py-1.5`}>
                          <ShieldCheck size={18} className={isIndiaActive ? 'text-[#128807]' : 'text-zinc-400'} />
                          <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${
                            isIndiaActive ? 'text-[#FF9933]' : 'text-zinc-300'
                          }`}>
                            PURCHASED &amp; UNLOCKED
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            {displayMrp && (
                              <span className="text-[11px] text-white/40 line-through font-black">
                                {displayMrp}
                              </span>
                            )}
                            <span className={`text-3xl md:text-4xl font-black italic leading-none comic-text ${
                              isFree ? 'text-[#00FF94]' : 'text-studio-yellow'
                            }`}>
                              {displayPrice}
                            </span>
                          </div>

                          {!isFree && discountPercent > 0 ? (
                            <div className="bg-studio-red px-3 py-1 border-2 border-black shadow-[3px_3px_0px_black] rotate-3">
                              <span className="text-[10px] md:text-xs font-black text-white uppercase italic">
                                {discountPercent}% OFF
                              </span>
                            </div>
                          ) : null}

                          {!isFree && !activePack.is_downloadable && (
                            <div className={`px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_black] text-[8px] font-black uppercase -rotate-2 ${isExpired ? 'bg-studio-red text-white' : 'bg-studio-neon text-black'
                              }`}>
                              {isExpired ? 'Regular Price' : 'Pre-Order Offer'}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Visual Image Block (5 Columns) */}
                  <div className="md:col-span-5 flex justify-center md:justify-end relative">
                    {/* Decorative Comic Splash behind the cover */}
                    <div className="absolute w-60 h-60 bg-white/5 blur-2xl rounded-full -z-10 animate-pulse" />

                    <div className="w-56 md:w-64 aspect-square relative border-4 border-black shadow-premium transform hover:rotate-0 transition-transform duration-500 -rotate-3 group-hover:scale-105">
                      <Image
                        src={activePack.cover_url || '/placeholder.jpg'}
                        alt={activePack.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 220px, 320px"
                        className="object-cover"
                      />

                      {/* Corner badge on image */}
                      <div className={`absolute -top-3 -right-3 w-8 h-8 ${
                        isOwnedActive 
                          ? (isIndiaActive ? 'bg-[#128807] text-white shadow-[2px_2px_0px_#FF9933] border-2 border-black' : 'bg-[#18181b] text-zinc-300 shadow-[2px_2px_0px_black] border-2 border-zinc-700')
                          : 'bg-studio-yellow text-black border-2 border-black shadow-[2px_2px_0px_black]'
                      } rounded-full flex items-center justify-center`}>
                        {isOwnedActive ? <ShieldCheck size={16} className={isIndiaActive ? 'text-white' : 'text-zinc-400'} /> : <Zap size={16} fill="black" />}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions Row */}
                <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 relative z-10 pt-4 border-t border-white/5">
                  {isOwnedActive ? (
                    <Link
                      href={`/packs/${activePack.slug}`}
                      className={`h-11 sm:h-14 px-6 sm:px-10 ${
                        isIndiaActive 
                          ? 'bg-[#128807] hover:bg-[#FF9933] text-white shadow-[3px_3px_0px_#FF9933] sm:shadow-[4px_4px_0px_#FF9933]' 
                          : 'bg-[#18181b] hover:bg-[#27272c] text-zinc-200 hover:text-white shadow-[3px_3px_0px_black] sm:shadow-[4px_4px_0px_black]'
                      } font-black uppercase tracking-wider sm:tracking-[0.2em] text-[10px] sm:text-[12px] transition-all border-2 sm:border-4 border-black flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px]`}
                    >
                      <span>OWNED — DOWNLOAD</span>
                    </Link>
                  ) : (
                    <>
                      {/* Cart added animation popover */}
                      <div className="relative flex-1 sm:flex-none">
                        <AnimatePresence>
                          {addedId === activePack.id && (
                            <motion.div
                              initial={{ scale: 0, y: 10, opacity: 0 }}
                              animate={{ scale: 1, y: 0, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 z-50 bg-studio-neon text-black px-4 py-2 border-4 border-black font-black italic text-xs shadow-premium whitespace-nowrap"
                            >
                              {isPreorderActive ? 'RESERVED!' : 'ADDED TO CART!'}
                              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-studio-neon border-r-4 border-b-4 border-black rotate-45" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button
                          onClick={(e) => handleAddToCart(e, activePack, currentPriceInr)}
                          className={`w-full sm:w-auto h-11 sm:h-14 px-3 sm:px-8 bg-white text-black font-black uppercase tracking-wider sm:tracking-[0.2em] text-[9px] sm:text-[11px] transition-all border-2 sm:border-4 border-black shadow-[3px_3px_0px_black] sm:shadow-[4px_4px_0px_black] flex items-center justify-center gap-2 sm:gap-3 hover:bg-studio-neon hover:text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
                        >
                          <Image src="/cart-bag.png" alt="Cart" width={14} height={14} className="brightness-0" />
                          {isPreorderActive ? 'PRE-ORDER' : 'ADD TO CART'}
                        </button>
                      </div>

                      <button
                        onClick={(e) => handleBuyNow(e, activePack, currentPriceInr)}
                        className={`flex-1 sm:flex-none h-11 sm:h-14 px-3 sm:px-10 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                          isPreorderActive 
                            ? 'bg-studio-neon text-black hover:bg-white hover:text-black' 
                            : 'bg-[#18181b] hover:bg-[#27272c] text-zinc-100 hover:text-white border-2 sm:border-4 border-black'
                        } font-black uppercase tracking-wider sm:tracking-[0.2em] text-[9px] sm:text-[11px] transition-all shadow-[3px_3px_0px_black] sm:shadow-[4px_4px_0px_black] flex items-center justify-center`}
                      >
                        {isPreorderActive ? 'PRE-ORDER NOW' : 'BUY NOW'}
                      </button>
                    </>
                  )}

                  <Link
                    href={`/packs/${activePack.slug}`}
                    className="w-full sm:w-auto h-11 sm:h-14 px-4 sm:px-6 border-2 border-white/10 hover:border-white/40 hover:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all"
                  >
                    View Details
                  </Link>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Vertical Carousel Selectors (Grid column 1/4 span) */}
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none justify-between">
          {packs.map((pack: any, index: number) => {
            const isActive = index === activeIndex
            const isPackIndia = pack.series === 'India Journey' || pack.series_name === 'India Journey'
            return (
              <button
                key={pack.id}
                onClick={() => handleSelectSlide(index)}
                className={`flex-1 min-w-[200px] lg:w-full text-left p-3.5 border-4 transition-all duration-300 relative flex items-center gap-3.5 select-none ${isActive
                    ? 'bg-[#18181b] border-zinc-600 shadow-[4px_4px_0px_black] translate-x-1'
                    : 'bg-studio-charcoal border-black hover:bg-white/[0.03] hover:translate-x-0.5'
                  }`}
              >
                {/* Active slider background slide-in indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-300" />
                )}

                {/* Pack Tiny Cover Thumbnail */}
                <div className="w-12 h-12 relative flex-shrink-0 border-2 border-black">
                  <Image
                    src={pack.cover_url || '/placeholder.jpg'}
                    alt={pack.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                {/* Pack Metadata */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block truncate">
                      {pack.categories?.name || 'LOOPS KIT'}
                    </span>
                    {isItemOwned(pack.id, pack.slug) && (
                      <span className={`text-[8px] font-black ${
                        isPackIndia 
                          ? 'text-[#FF9933] bg-[#FF9933]/10 border border-[#FF9933]/30' 
                          : 'text-zinc-300 bg-zinc-800/90 border border-zinc-700'
                      } px-1.5 py-0.5 rounded-xs uppercase shrink-0`}>
                        OWNED
                      </span>
                    )}
                  </div>
                  <h4 className="text-[12px] font-black uppercase truncate text-white tracking-tight leading-tight mt-0.5">
                    {pack.name}
                  </h4>

                  {/* Miniature auto-play Progress Bar (Visible only on Active card) */}
                  {isActive ? (
                    <div className="w-full h-1 bg-white/10 mt-2 relative overflow-hidden rounded-full">
                      <div
                        key={`progress-${activeIndex}`}
                        className="h-full bg-zinc-300 origin-left"
                        style={{
                          animation: `heroProgress ${slideDuration}ms linear forwards`
                        }}
                      />
                    </div>
                  ) : isItemOwned(pack.id, pack.slug) ? (
                    <span className={`text-[9px] font-black ${
                      isPackIndia ? 'text-[#FF9933]' : 'text-zinc-400'
                    } uppercase tracking-wider block mt-1`}>
                      <span>OWNED</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-studio-neon italic mt-1 block">
                      {formatPrice(pack.price_inr, pack.price_usd)}
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
