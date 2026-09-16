'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Check } from 'lucide-react'
import { getPackPriceDetails } from '@/lib/pricing'
import { useCurrency } from '@/context/CurrencyContext'
import { getDetectedLocation, getLocalProducerProfile } from '@/lib/telemetryClient'

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
  
  const parsed = new Date(formatted)
  if (!isNaN(parsed.getTime())) return parsed.getTime()
  
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
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
  const { addItem, buyNow, isItemOwned } = useCart()
  const router = useRouter()
  const [addedPackId, setAddedPackId] = React.useState<string | null>(null)
  const { formatPrice, getAmount } = useCurrency()

  // Location & Intent Personalization State
  const [geoPreference, setGeoPreference] = React.useState<{
    boostedSlug?: string
    badgeText?: string
  }>({})

  React.useEffect(() => {
    const resolvePriority = () => {
      const geo = getDetectedLocation()
      const profile = getLocalProducerProfile()

      const region = (geo.region || '').toUpperCase()
      const city = (geo.city || '').toLowerCase()
      const country = (geo.country || 'IN').toUpperCase()
      const searches = (profile.searched_keywords || []).map((s) => s.toLowerCase())
      const previews = (profile.previewed_audio || []).map((p) => (p.pack_name || '').toLowerCase())

      // 1. Punjab Region / Producer Intent
      if (
        region === 'PB' ||
        region === 'CH' ||
        ['ludhiana', 'amritsar', 'jalandhar', 'chandigarh', 'patiala', 'bathinda', 'mohali'].includes(city) ||
        searches.some((s) => s.includes('punjab') || s.includes('dhol')) ||
        previews.some((p) => p.includes('punjab') || p.includes('dhol'))
      ) {
        setGeoPreference({
          boostedSlug: 'punjab-rhythm',
          badgeText: '📍 TRENDING IN PUNJAB'
        })
        return
      }

      // 2. Maharashtra / Mumbai Gully Drill & Street Hip-Hop
      if (
        region === 'MH' ||
        ['mumbai', 'pune', 'nagpur', 'thane', 'nashik'].includes(city) ||
        searches.some((s) => s.includes('drill') || s.includes('gully') || s.includes('street')) ||
        previews.some((p) => p.includes('drill') || p.includes('street'))
      ) {
        setGeoPreference({
          boostedSlug: 'india-street',
          badgeText: '📍 TRENDING IN MUMBAI'
        })
        return
      }

      // 3. South India (Tamil Nadu, Karnataka, Kerala, Andhra, Telangana)
      if (
        ['TN', 'KA', 'KL', 'AP', 'TS'].includes(region) ||
        ['chennai', 'bangalore', 'bengaluru', 'hyderabad', 'kochi', 'coimbatore'].includes(city) ||
        searches.some((s) => s.includes('south') || s.includes('tapori') || s.includes('kuthu'))
      ) {
        setGeoPreference({
          boostedSlug: 'the-south',
          badgeText: '📍 POPULAR IN SOUTH INDIA'
        })
        return
      }

      // 4. Odisha
      if (
        region === 'OR' ||
        ['bhubaneswar', 'cuttack', 'sambalpur', 'puri'].includes(city) ||
        searches.some((s) => s.includes('sambalpur') || s.includes('odia'))
      ) {
        setGeoPreference({
          boostedSlug: 'sambalpur-rhythm',
          badgeText: '📍 TRENDING IN ODISHA'
        })
        return
      }

      // 5. Delhi NCR
      if (
        region === 'DL' ||
        ['delhi', 'new delhi', 'noida', 'gurugram', 'gurgaon'].includes(city)
      ) {
        setGeoPreference({
          boostedSlug: 'punjab-rhythm',
          badgeText: '📍 POPULAR IN DELHI NCR'
        })
        return
      }

      // 6. International Visitors
      if (country !== 'IN') {
        setGeoPreference({
          boostedSlug: 'the-bollywood',
          badgeText: '🌍 WORLDWIDE HIT'
        })
        return
      }
    }

    resolvePriority()

    const handleGeoUpdated = () => resolvePriority()
    window.addEventListener('sw:geo-updated', handleGeoUpdated)
    return () => window.removeEventListener('sw:geo-updated', handleGeoUpdated)
  }, [])

  // Sort packs to elevate boostedSlug to position 0 while preserving remaining relative order
  const displayPacks = React.useMemo(() => {
    if (!geoPreference.boostedSlug || !packs || packs.length === 0) return packs
    const targetIdx = packs.findIndex((p) => p.slug === geoPreference.boostedSlug)
    if (targetIdx <= 0) return packs
    const targetPack = packs[targetIdx]
    const remaining = packs.filter((_, idx) => idx !== targetIdx)
    return [targetPack, ...remaining]
  }, [packs, geoPreference.boostedSlug])

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
    buyNow({
      id: pack.id,
      name: pack.name,
      price: currentPrice,
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack',
      is_downloadable: pack.is_downloadable
    })
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
      {displayPacks.map((pack: any) => {
        const isIndia = pack.series === 'India Journey'
        const isOwned = isItemOwned(pack.id, pack.slug)
        
        // Calculate dynamic pricing and pre-order state
        const priceDetails = getPackPriceDetails(pack)
        const currentPrice = priceDetails.priceInr
        const isPreorderActive = priceDetails.isPreorderActive
        const isExpired = priceDetails.isExpired

        const isFree = currentPrice === 0 || Number(pack.price_inr) === 0
        const priceNum = getAmount(currentPrice, pack.price_usd)
        const rawMrp = pack.mrp_inr ? Number(pack.mrp_inr) : (isFree ? 0 : currentPrice * 3)
        const mrpNum = getAmount(rawMrp, pack.price_usd ? Number(pack.price_usd) * 3 : null)

        const displayPrice = isFree ? 'FREE' : formatPrice(currentPrice, pack.price_usd)
        const displayMrp = rawMrp > 0 && !isFree ? formatPrice(rawMrp, pack.price_usd ? Number(pack.price_usd) * 3 : null) : null
        const discountPercent = mrpNum > priceNum && priceNum > 0 ? Math.round((1 - (priceNum / mrpNum)) * 100) : 0

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
                src={pack.cover_url || '/placeholder.jpg'}
                alt={`${pack.name} - Indian Sample Pack & Loops | SamplesWala`}
                title={`${pack.name} Sample Pack`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Regional Recommendation Badge */}
              {geoPreference.badgeText && pack.slug === geoPreference.boostedSlug && (
                <div className="absolute top-2.5 left-2.5 bg-[#FFE600] text-black border-2 border-black font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-[3px_3px_0px_black] -rotate-2 z-20 flex items-center gap-1">
                  <span>{geoPreference.badgeText}</span>
                </div>
              )}

              {isOwned ? (
                <div className={`absolute top-3 right-3 ${
                  isIndia 
                    ? 'bg-[#128807] text-white shadow-[3px_3px_0px_#FF9933] border-2 border-black' 
                    : 'bg-[#121214]/90 backdrop-blur-md text-white shadow-[3px_3px_0px_black] border-2 border-white/20'
                } px-2.5 py-1 font-black text-[9px] uppercase tracking-wider z-10 rotate-2 flex items-center gap-1.5`}>
                  <Check size={11} strokeWidth={3} className="text-white" />
                  <span>OWNED</span>
                </div>
              ) : (
                !isFree && !pack.is_downloadable && (
                  <div className={`absolute ${geoPreference.badgeText && pack.slug === geoPreference.boostedSlug ? 'top-9' : 'top-3'} left-3 backdrop-blur-md px-2.5 py-0.5 border border-black rounded-sm -rotate-3 z-10 ${
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
                )
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
                      {isOwned ? (
                        <p className={`text-[15px] font-black italic leading-none ${
                          isIndia ? 'text-[#FF9933]' : 'text-white'
                        }`}>
                          IN VAULT
                        </p>
                      ) : (
                        <>
                          {displayMrp && (
                            <span className="text-[10px] text-white/50 line-through font-bold">
                              {displayMrp}
                            </span>
                          )}
                          <p className={`text-[16px] font-black italic leading-none ${
                            isFree ? 'text-[#00FF94]' : (isIndia ? 'text-[#FF9933]' : 'text-studio-neon')
                          }`}>
                            {displayPrice}
                          </p>
                        </>
                      )}
                    </div>
                    
                    {!isOwned && (
                      <div className="flex flex-col gap-1">
                        {!isFree && discountPercent > 0 ? (
                          <div className={`px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_black] ${
                            isIndia ? 'bg-[#128807] text-white font-black' : 'bg-studio-red text-white'
                          }`}>
                            <span className="text-[9px] font-black uppercase italic">
                              {discountPercent}% OFF
                            </span>
                          </div>
                        ) : null}
                        {!isFree && !pack.is_downloadable && (
                          <span className={`text-[7px] font-black uppercase tracking-tighter px-1 rounded-sm text-center ${
                            isExpired
                              ? 'bg-studio-charcoal text-white/40 border border-black/20'
                              : (isIndia ? 'bg-[#FF9933] text-white border border-black' : 'bg-studio-neon text-black')
                          }`}>
                            {isExpired ? 'Direct Purchase' : 'Pre-order Offer'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!isOwned && !isFree && (
                  !pack.is_downloadable && isPreorderActive ? (
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
                  )
                )}
              </div>

              <div className="flex flex-row gap-3 mt-auto pt-4 relative">
                {isOwned ? (
                  <Link
                    href={`/packs/${pack.slug}`}
                    className={`w-full h-11 ${
                      isIndia 
                        ? 'bg-[#128807] hover:bg-[#FF9933] text-white shadow-[4px_4px_0px_#FF9933] border-4 border-black' 
                        : 'bg-[#141416] hover:bg-[#202024] text-white shadow-[4px_4px_0px_black] border-2 border-white/20 hover:border-white/40'
                    } text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none`}
                  >
                    <Check size={15} strokeWidth={3} className="text-white" />
                    <span>✓ OWNED</span>
                  </Link>
                ) : (
                  <>
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
                  </>
                )}
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












