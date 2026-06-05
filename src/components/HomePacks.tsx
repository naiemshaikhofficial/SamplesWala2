'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getPackPriceDetails } from '@/lib/pricing'
import { useCurrency } from '@/context/CurrencyContext'

function parseDbDate(dateStr: string | undefined | null) {
  if (!dateStr) return 0
  const str = String(dateStr).trim()
  const direct = new Date(str)
  if (!isNaN(direct.getTime())) return direct.getTime()
  
  let formatted = str.replace(' ', 'T')
  if (formatted.match(/[+-]\d{2}$/)) {
    formatted = formatted + ':00'
  } else if (!formatted.includes('Z') && !formatted.includes('+') && !formatted.includes('-')) {
    formatted = formatted + 'Z'
  }
  
  const secondTry = new Date(formatted)
  if (!isNaN(secondTry.getTime())) return secondTry.getTime()
  
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/)
  if (match) {
    return Date.UTC(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1,
      parseInt(match[3], 10),
      parseInt(match[4], 10),
      parseInt(match[5], 10),
      parseInt(match[6], 10)
    )
  }
  return 0
}

export function HomePacks({ packs }: { packs: any[] }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [addedPackId, setAddedPackId] = React.useState<string | null>(null)
  const { formatPrice, getAmount } = useCurrency()

  const handleAddToCart = (pack: any, currentPrice: number) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: currentPrice,
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack',
      is_downloadable: pack.is_downloadable
    })
    setAddedPackId(pack.id)
    setTimeout(() => setAddedPackId(null), 1200)
  }

  const handleBuyNow = (pack: any, currentPrice: number) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: currentPrice,
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack',
      is_downloadable: pack.is_downloadable
    })
    router.push('/checkout')
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
  } as const

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10"
    >
      {packs.map((pack: any) => {
        const isIndia = pack.series === 'India Journey'
        
        // Calculate dynamic pricing and pre-order state
        const priceDetails = getPackPriceDetails(pack)
        const currentPrice = priceDetails.priceInr
        const isPreorderActive = priceDetails.isPreorderActive
        const isExpired = priceDetails.isExpired

        const priceNum = getAmount(currentPrice, pack.price_usd)
        const mrpNum = getAmount(pack.mrp_inr || (currentPrice * 3), pack.price_usd ? Number(pack.price_usd) * 3 : null)

        const displayPrice = formatPrice(currentPrice, pack.price_usd)
        const displayMrp = formatPrice(pack.mrp_inr || (currentPrice * 3), pack.price_usd ? Number(pack.price_usd) * 3 : null)
        const discountPercent = Math.round((1 - (priceNum / mrpNum)) * 100)

        return (
          <motion.div
            key={pack.id}
            variants={item}
            className="group flex flex-col justify-between h-full space-y-4"
          >
            <Link
              href={`/packs/${pack.slug}`}
              prefetch={false}
              className={`comic-panel aspect-square block transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 ${
                isIndia 
                  ? 'group-hover:border-[#128807] group-hover:shadow-[14px_14px_0px_#FF9933] bg-[#0d0d0d]' 
                  : 'group-hover:border-studio-pink group-hover:shadow-[14px_14px_0px_black]'
              }`}
            >
              <Image
                src={getOptimizedImageUrl(pack.cover_url, 600, 80)}
                alt={`${pack.name} - Indian Sample Pack & Loops | SamplesWala`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {!pack.is_downloadable && (
                <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 border border-black rounded-sm -rotate-3 z-10 ${
                  isExpired
                    ? 'bg-studio-red text-white shadow-[4px_4px_0px_black]'
                    : (isIndia 
                        ? 'bg-[#FF9933] text-white shadow-[4px_4px_0px_#128807] border-2 font-black' 
                        : 'bg-studio-neon/90 text-black shadow-[4px_4px_0px_black]')
                }`}>
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    {isExpired ? 'Regular Price' : 'Pre-order Offer'}
                  </span>
                </div>
              )}

            </Link>

            <div className="flex flex-col flex-grow justify-between px-1 mt-2">
              <div className="space-y-1">
                <Link href={`/packs/${pack.slug}`} prefetch={false}>
                  <h3 className={`text-[14px] font-black uppercase truncate transition-colors tracking-tighter italic ${
                    isIndia ? 'hover:text-[#FF9933]' : 'hover:text-studio-neon'
                  }`}>
                    {pack.name}
                  </h3>
                </Link>
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    {pack.categories?.name || 'Sound Kits'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/50 line-through font-bold">
                        {displayMrp}
                      </span>
                      <p className={`text-[16px] font-black italic leading-none ${
                        isIndia ? 'text-[#FF9933]' : 'text-studio-neon'
                      }`}>
                        {displayPrice}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className={`px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_black] ${
                        isIndia ? 'bg-[#128807] text-white font-black' : 'bg-studio-red text-white'
                      }`}>
                        <span className="text-[9px] font-black uppercase italic">
                          {discountPercent}% OFF
                        </span>
                      </div>
                      {!pack.is_downloadable && (
                        <span className={`text-[7px] font-black uppercase tracking-tighter px-1 rounded-sm text-center ${
                          isExpired
                            ? 'bg-studio-charcoal text-white/40 border border-black/20'
                            : (isIndia ? 'bg-[#FF9933] text-white border border-black' : 'bg-studio-neon text-black')
                        }`}>
                          {isExpired ? 'Direct Purchase' : 'Pre-order Offer'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!pack.is_downloadable && isPreorderActive ? (
                  <PackCountdown pack={pack} isIndia={isIndia} />
                ) : (
                  <div className={`flex items-center gap-1.5 mt-2 px-2 py-1 border-2 border-black rounded-sm w-fit rotate-1 ${
                    isExpired
                      ? 'bg-studio-charcoal text-white/80 shadow-[3px_3px_0px_black]'
                      : (isIndia ? 'bg-[#128807] shadow-[3px_3px_0px_#FF9933]' : 'bg-studio-red shadow-[3px_3px_0px_rgba(0,0,0,1)]')
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-studio-neon animate-pulse' : 'bg-white animate-pulse'}`} />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">
                      {isExpired ? 'In Stock / Ready' : 'Limited Offer'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-row gap-3 mt-auto pt-4 relative">
                <AnimatePresence>
                  {addedPackId === pack.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1.1, rotate: 12, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-12 left-0 right-0 z-50 flex justify-center pointer-events-none"
                    >
                      <div className={`px-4 py-2 border-4 border-black font-black italic text-xs relative ${
                        isIndia 
                          ? 'bg-[#FF9933] text-white shadow-[4px_4px_0px_#128807]' 
                          : 'bg-studio-neon text-black shadow-[4px_4px_0px_black]'
                      }`}>
                        {isPreorderActive ? 'RESERVED!' : 'ADDED!'}
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-r-4 border-b-4 border-black rotate-45 ${
                          isIndia ? 'bg-[#FF9933]' : 'bg-studio-neon'
                        }`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => handleAddToCart(pack, currentPrice)}
                  className={`flex-1 h-11 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-4 border-black shadow-[4px_4px_0px_black] flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    isIndia ? 'hover:bg-[#FF9933] hover:text-white' : 'hover:bg-studio-neon'
                  }`}
                  title={isPreorderActive ? "Pre-order" : "Add to Cart"}
                >
                  <Image src="/cart-bag.png" alt="Cart" width={14} height={14} className="brightness-0" />
                  {isPreorderActive ? 'Pre' : 'Cart'}
                </button>
                <button
                  onClick={() => handleBuyNow(pack, currentPrice)}
                  className={`flex-1 h-11 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-4 border-black shadow-[4px_4px_0px_black] flex items-center justify-center hover:bg-white hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    isIndia 
                      ? (isPreorderActive ? 'bg-[#FF9933] text-white' : 'bg-[#128807] text-white')
                      : (isPreorderActive ? 'bg-studio-neon text-black' : 'bg-studio-pink text-white')
                  }`}
                >
                  {isPreorderActive ? 'Pre' : 'Get'}
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

function PackCountdown({ pack, isIndia }: { pack: any, isIndia: boolean }) {
  const [mounted, setMounted] = React.useState(false)
  const [, setTick] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const priceDetails = getPackPriceDetails(pack)
  const isPreorderActive = priceDetails.isPreorderActive

  if (!isPreorderActive) return null

  const days = priceDetails.daysLeft
  const hours = priceDetails.hoursLeft
  const minutes = priceDetails.minutesLeft
  const seconds = priceDetails.secondsLeft

  return (
    <div className={`mt-2 p-2 rounded-sm border-2 flex items-center justify-between gap-1 text-white rotate-[-0.5deg] ${
      isIndia 
        ? 'border-[#FF9933] shadow-[3px_3px_0px_#128807] bg-black/60' 
        : 'border-black shadow-[3px_3px_0px_#a6e22e] bg-studio-charcoal'
    }`}>
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse`} />
        <span className="text-[8px] font-black uppercase tracking-wider text-white">Ends In:</span>
      </div>
      <div className="flex gap-0.5 font-mono text-[9px] font-black">
        <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
          <span>{mounted ? String(days).padStart(2, '0') : '00'}</span>
          <span className="text-[4px] text-white/40 uppercase font-sans">d</span>
        </div>
        <span className="text-white/20 self-center">:</span>
        <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
          <span>{mounted ? String(hours).padStart(2, '0') : '00'}</span>
          <span className="text-[4px] text-white/40 uppercase font-sans">h</span>
        </div>
        <span className="text-white/20 self-center">:</span>
        <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
          <span>{mounted ? String(minutes).padStart(2, '0') : '00'}</span>
          <span className="text-[4px] text-white/40 uppercase font-sans">m</span>
        </div>
        <span className="text-white/20 self-center">:</span>
        <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
          <span className={isIndia ? 'text-[#FF9933]' : 'text-studio-neon animate-pulse'}>
            {mounted ? String(seconds).padStart(2, '0') : '00'}
          </span>
          <span className="text-[4px] text-white/40 uppercase font-sans">s</span>
        </div>
      </div>
    </div>
  )
}












