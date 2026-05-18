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

export function BrowseLibrary({ initialPacks, searchQuery }: { initialPacks: any[], searchQuery?: string }) {
  const { addItem } = useCart()
  const router = useRouter()

  const handleBuyNow = React.useCallback((pack: any) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
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

      {packs.map((pack: any) => (
        <div 
          key={pack.id} 
          className="group flex flex-col space-y-4"
        >
          <Link 
            href={`/packs/${pack.slug}`} 
            prefetch={false}
            className="aspect-square relative overflow-hidden bg-studio-charcoal border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] block group-hover:border-studio-pink transition-all group-hover:-translate-y-1"
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
               <div className="absolute top-4 left-4 bg-studio-neon/90 backdrop-blur-md px-3 py-1 border border-black rounded-sm shadow-[4px_4px_0px_black] -rotate-3">
                 <span className="text-[8px] font-black uppercase tracking-widest text-black">Pre-order Offer</span>
               </div>
             )}
          </Link>

          <div className="space-y-4 px-1">
            <div className="space-y-1">
              <Link href={`/packs/${pack.slug}`} prefetch={false}>
                <h3 className="text-[13px] font-black uppercase truncate hover:text-studio-yellow transition-colors tracking-tight">
                  {pack.name}
                </h3>
              </Link>
              <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {pack.categories?.name || 'Artifacts'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/50 line-through font-bold">
                      ₹{pack.mrp_inr || (Number(pack.price_inr) * 3)}
                    </span>
                    <p className="text-[14px] font-black text-studio-neon italic leading-none">
                      ₹{pack.price_inr}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="bg-studio-red px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_black]">
                      <span className="text-[9px] font-black text-white uppercase italic">
                        {Math.round((1 - (Number(pack.price_inr) / (pack.mrp_inr || (Number(pack.price_inr) * 3)))) * 100)}% OFF
                      </span>
                    </div>
                    {!pack.is_downloadable && (
                      <span className="text-[7px] font-black bg-studio-neon text-black uppercase tracking-tighter px-1 rounded-sm text-center">Pre-order Offer</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Limited Offer Tag */}
              <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-studio-red border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-sm w-fit rotate-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Limited Offer</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
               <button 
                onClick={() => addItem({
                  id: pack.id,
                  name: pack.name,
                  price: Number(pack.price_inr),
                  slug: pack.slug,
                  cover_url: pack.cover_url || undefined,
                  type: 'pack'
                })}
                className="flex-1 h-10 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-studio-neon transition-all border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
                title={!pack.is_downloadable ? "Pre-order" : "Add to Cart"}
              >
                <Image src="/cart-bag.png" alt="Cart" width={12} height={12} className="brightness-0" />
                {!pack.is_downloadable ? 'Pre' : 'Cart'}
              </button>
              <button 
                onClick={() => handleBuyNow(pack)}
                className={`flex-1 h-10 ${!pack.is_downloadable ? 'bg-studio-neon text-black' : 'bg-studio-pink text-white'} text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center`}
              >
                {!pack.is_downloadable ? 'Pre' : 'Buy'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
