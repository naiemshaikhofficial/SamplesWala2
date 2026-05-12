'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

export function HomePacks({ packs }: { packs: any[] }) {
  const { addItem } = useCart()
  const router = useRouter()

  const handleBuyNow = (pack: any) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      slug: pack.slug,
      cover_url: pack.cover_url || undefined
    })
    router.push('/checkout')
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
      {packs.map((pack: any) => (
        <div 
          key={pack.id} 
          className="group flex flex-col space-y-4"
        >
          <Link href={`/packs/${pack.slug}`} className="aspect-square relative overflow-hidden bg-studio-charcoal/50 border border-white/5 rounded-sm shadow-2xl block group-hover:border-studio-yellow/30 transition-all">
            <Image
              src={getOptimizedImageUrl(pack.cover_url, 600, 80)}
              alt={pack.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            
             {!pack.is_downloadable && (
               <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full">
                 <span className="text-[8px] font-black uppercase tracking-widest text-studio-yellow">Coming Soon</span>
               </div>
             )}
          </Link>

          <div className="space-y-4 px-1">
            <div className="space-y-1">
              <Link href={`/packs/${pack.slug}`}>
                <h3 className="text-[14px] font-black uppercase truncate hover:text-studio-yellow transition-colors tracking-tight">
                  {pack.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {pack.categories?.name || 'Artifacts'}
                </p>
                <p className="text-[10px] font-black text-studio-neon">
                  ₹{pack.price_inr}
                </p>
              </div>
            </div>

            {pack.is_downloadable && (
              <div className="flex flex-row gap-2 pt-2">
                <button 
                  onClick={() => addItem({
                    id: pack.id,
                    name: pack.name,
                    price: Number(pack.price_inr),
                    slug: pack.slug,
                    cover_url: pack.cover_url || undefined
                  })}
                  className="flex-1 h-10 bg-white text-black text-[8px] font-black uppercase tracking-widest hover:bg-studio-yellow transition-all rounded-sm flex items-center justify-center gap-2"
                  title="Add to Cart"
                >
                  <ShoppingCart size={12} />
                  Cart
                </button>
                <button 
                  onClick={() => handleBuyNow(pack)}
                  className="flex-1 h-10 bg-[#FFC800] text-black text-[8px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-sm flex items-center justify-center"
                >
                  Buy
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
