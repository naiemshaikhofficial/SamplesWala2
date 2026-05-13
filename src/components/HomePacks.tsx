'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10"
    >
      {packs.map((pack: any) => (
        <motion.div 
          key={pack.id} 
          variants={item}
          className="group flex flex-col space-y-4"
        >
          <Link href={`/packs/${pack.slug}`} className="comic-panel aspect-square block group-hover:border-studio-pink transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[14px_14px_0px_black]">
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

             {/* Comic Ribbon */}
             <div className="absolute top-0 right-0 bg-studio-pink text-white text-[8px] font-black px-4 py-1 rotate-45 translate-x-4 -translate-y-1 shadow-[0_0_10px_rgba(255,0,122,0.5)]">
               NEW BEATS
             </div>
          </Link>

          <div className="space-y-4 px-1">
            <div className="space-y-1">
              <Link href={`/packs/${pack.slug}`}>
                <h3 className="text-[14px] font-black uppercase truncate hover:text-studio-neon transition-colors tracking-tighter italic">
                  {pack.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {pack.categories?.name || 'Artifacts'}
                </p>
                <p className="text-[12px] font-black text-studio-neon italic">
                  ₹{pack.price_inr}
                </p>
              </div>
            </div>

            {pack.is_downloadable && (
              <div className="flex flex-row gap-3 pt-2">
                <button 
                  onClick={() => addItem({
                    id: pack.id,
                    name: pack.name,
                    price: Number(pack.price_inr),
                    slug: pack.slug,
                    cover_url: pack.cover_url || undefined
                  })}
                  className="flex-1 h-11 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-studio-neon transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                >
                  <Image src="/cart-bag.png" alt="Cart" width={14} height={14} className="brightness-0" />
                  Cart
                </button>
                <button 
                  onClick={() => handleBuyNow(pack)}
                  className="flex-1 h-11 bg-studio-pink text-white text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Get
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
