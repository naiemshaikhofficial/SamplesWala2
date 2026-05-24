'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { clientCache } from '@/lib/clientCache'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Eye } from 'lucide-react'
import { cleanSearchQuery } from '@/lib/search/queryHelper'
import { getPackPriceDetails } from '@/lib/pricing'

export function BrowseLibrary({ initialPacks, searchQuery, isIndiaJourney }: { initialPacks: any[], searchQuery?: string, isIndiaJourney?: boolean }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [now, setNow] = React.useState(Date.now())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBuyNow = React.useCallback((pack: any, currentPrice: number) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: currentPrice,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack'
    })
    router.push('/checkout')
  }, [addItem, router])

  const packs = React.useMemo(() => {
    let currentPacks = initialPacks || []

    if (searchQuery) {
      const cleaned = cleanSearchQuery(searchQuery)
      if (cleaned) {
        const searchWords = cleaned.split(/\s+/)
        currentPacks = currentPacks.filter(p => {
          const nameLower = p.name.toLowerCase()
          const categoryLower = (p.categories?.name || '').toLowerCase()
          return searchWords.every(word => 
            nameLower.includes(word) || categoryLower.includes(word)
          )
        })
      }
    }
    return currentPacks
  }, [initialPacks, searchQuery])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 justify-center">

      {packs.map((pack: any) => {
        const isIndia = isIndiaJourney || pack.series === 'India Journey' || pack.series_name === 'India Journey'
        
        // Calculate dynamic pricing and pre-order state
        const priceDetails = getPackPriceDetails(pack)
        const currentPrice = priceDetails.priceInr
        const isPreorderActive = priceDetails.isPreorderActive
        const isExpired = priceDetails.isExpired

        const days = priceDetails.daysLeft
        const hours = priceDetails.hoursLeft
        const minutes = priceDetails.minutesLeft
        const seconds = priceDetails.secondsLeft

        return (
          <div 
            key={pack.id} 
            className="group flex flex-col justify-between h-full space-y-4"
          >
            <Link 
              href={`/packs/${pack.slug}`} 
              prefetch={false}
              className={`aspect-square relative overflow-hidden bg-studio-charcoal border-4 border-black block transition-all group-hover:-translate-y-1 ${
                isIndia 
                  ? 'group-hover:border-[#FF9933] shadow-[8px_8px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_#128807]'
                  : 'group-hover:border-studio-pink shadow-[8px_8px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <Image
                src={getOptimizedImageUrl(pack.cover_url, 600, 80)}
                alt={`${pack.name} - Indian Sample Pack & Loops | SamplesWala`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                priority={packs.indexOf(pack) < 10}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              {!pack.is_downloadable && (
                <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 border border-black rounded-sm -rotate-3 z-10 ${
                  isExpired
                    ? 'bg-studio-red text-white shadow-[4px_4px_0px_black]'
                    : (isIndia 
                        ? 'bg-[#FF9933] text-white shadow-[4px_4px_0px_#128807] font-black' 
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
                  <h3 className={`text-[13px] font-black uppercase truncate transition-colors tracking-tight ${
                    isIndia ? 'hover:text-[#FF9933]' : 'hover:text-studio-yellow'
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
                      <span className="text-[9px] text-white/50 line-through font-bold">
                        ₹{pack.mrp_inr || (currentPrice * 3)}
                      </span>
                      <p className={`text-[14px] font-black italic leading-none ${
                        isIndia ? 'text-[#FF9933]' : 'text-studio-neon'
                      }`}>
                        ₹{currentPrice}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className={`px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_black] ${
                        isIndia ? 'bg-[#128807]' : 'bg-studio-red'
                      }`}>
                        <span className="text-[9px] font-black text-white uppercase italic">
                          {Math.round((1 - (currentPrice / (pack.mrp_inr || (currentPrice * 3)))) * 100)}% OFF
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

                {/* Limited Offer / Countdown Tag */}
                {!pack.is_downloadable && isPreorderActive ? (
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
                        <span>{String(days).padStart(2, '0')}</span>
                        <span className="text-[4px] text-white/40 uppercase font-sans">d</span>
                      </div>
                      <span className="text-white/20 self-center">:</span>
                      <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
                        <span>{String(hours).padStart(2, '0')}</span>
                        <span className="text-[4px] text-white/40 uppercase font-sans">h</span>
                      </div>
                      <span className="text-white/20 self-center">:</span>
                      <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
                        <span>{String(minutes).padStart(2, '0')}</span>
                        <span className="text-[4px] text-white/40 uppercase font-sans">m</span>
                      </div>
                      <span className="text-white/20 self-center">:</span>
                      <div className="bg-black/60 px-1 py-0.5 rounded-sm border border-white/5 flex flex-col items-center min-w-[18px]">
                        <span className={isIndia ? 'text-[#FF9933]' : 'text-studio-neon animate-pulse'}>{String(seconds).padStart(2, '0')}</span>
                        <span className="text-[4px] text-white/40 uppercase font-sans">s</span>
                      </div>
                    </div>
                  </div>
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

              <div className="flex gap-2 mt-auto pt-4">
                <button 
                  onClick={() => addItem({
                    id: pack.id,
                    name: pack.name,
                    price: currentPrice,
                    slug: pack.slug,
                    cover_url: pack.cover_url || undefined,
                    type: 'pack'
                  })}
                  className={`flex-1 h-10 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    isIndia ? 'hover:bg-[#FF9933] hover:text-white' : 'hover:bg-studio-neon'
                  }`}
                  title={isPreorderActive ? "Pre-order" : "Add to Cart"}
                >
                  <Image src="/cart-bag.png" alt="Cart" width={12} height={12} className="brightness-0" />
                  {isPreorderActive ? 'Pre' : 'Cart'}
                </button>
                <button 
                  onClick={() => handleBuyNow(pack, currentPrice)}
                  className={`flex-1 h-10 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                    isIndia 
                      ? (isPreorderActive ? 'bg-[#FF9933] text-white' : 'bg-[#128807] text-white')
                      : (isPreorderActive ? 'bg-studio-neon text-black' : 'bg-studio-pink text-white')
                  } text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center`}
                >
                  {isPreorderActive ? 'Pre' : 'Buy'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

