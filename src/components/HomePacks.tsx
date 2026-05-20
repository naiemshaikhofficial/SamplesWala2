'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function HomePacks({ packs }: { packs: any[] }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [addedPackId, setAddedPackId] = React.useState<string | null>(null)

  const handleAddToCart = (pack: any) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack'
    })
    setAddedPackId(pack.id)
    setTimeout(() => setAddedPackId(null), 1200)
  }

  const handleBuyNow = (pack: any) => {
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
        return (
          <motion.div
            key={pack.id}
            variants={item}
            className="group flex flex-col space-y-4"
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
                <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 border border-black rounded-sm -rotate-3 ${
                  isIndia 
                    ? 'bg-[#FF9933] text-white shadow-[4px_4px_0px_#128807] border-2 font-black' 
                    : 'bg-studio-neon/90 text-black shadow-[4px_4px_0px_black]'
                }`}>
                  <span className="text-[8px] font-black uppercase tracking-widest">Pre-order Offer</span>
                </div>
              )}

            </Link>

            <div className="space-y-4 px-1">
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
                    {pack.categories?.name || 'Artifacts'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/50 line-through font-bold">
                        ₹{pack.mrp_inr || (Number(pack.price_inr) * 3)}
                      </span>
                      <p className={`text-[16px] font-black italic leading-none ${
                        isIndia ? 'text-[#FF9933]' : 'text-studio-neon'
                      }`}>
                        ₹{pack.price_inr}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className={`px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_black] ${
                        isIndia ? 'bg-[#128807] text-white font-black' : 'bg-studio-red text-white'
                      }`}>
                        <span className="text-[9px] font-black uppercase italic">
                          {Math.round((1 - (Number(pack.price_inr) / (pack.mrp_inr || (Number(pack.price_inr) * 3)))) * 100)}% OFF
                        </span>
                      </div>
                      {!pack.is_downloadable && (
                        <span className={`text-[7px] font-black uppercase tracking-tighter px-1 rounded-sm text-center ${
                          isIndia ? 'bg-[#FF9933] text-white border border-black' : 'bg-studio-neon text-black'
                        }`}>Pre-order Offer</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 mt-2 px-2 py-1 border-2 border-black rounded-sm w-fit rotate-1 ${
                  isIndia ? 'bg-[#128807] shadow-[3px_3px_0px_#FF9933]' : 'bg-studio-red shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Limited Offer</span>
                </div>
              </div>

              <div className="flex flex-row gap-3 pt-2 relative">
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
                        {!pack.is_downloadable ? 'RESERVED!' : 'ADDED!'}
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-r-4 border-b-4 border-black rotate-45 ${
                          isIndia ? 'bg-[#FF9933]' : 'bg-studio-neon'
                        }`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => handleAddToCart(pack)}
                  className={`flex-1 h-11 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 ${
                    isIndia ? 'hover:bg-[#FF9933] hover:text-white' : 'hover:bg-studio-neon'
                  }`}
                  title={!pack.is_downloadable ? "Pre-order" : "Add to Cart"}
                >
                  <Image src="/cart-bag.png" alt="Cart" width={14} height={14} className="brightness-0" />
                  {!pack.is_downloadable ? 'Pre' : 'Cart'}
                </button>
                <button
                  onClick={() => handleBuyNow(pack)}
                  className={`flex-1 h-11 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center ${
                    isIndia 
                      ? (!pack.is_downloadable ? 'bg-[#FF9933] text-white' : 'bg-[#128807] text-white')
                      : (!pack.is_downloadable ? 'bg-studio-neon text-black' : 'bg-studio-pink text-white')
                  }`}
                >
                  {!pack.is_downloadable ? 'Pre' : 'Get'}
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
