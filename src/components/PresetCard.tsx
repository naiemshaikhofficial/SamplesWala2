'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'

interface PresetCardProps {
  preset: {
    id: string
    name: string
    slug: string
    type: string
    daws: string[]
    youtube_url?: string
    drive_url: string
    price_inr: number
    cover_url?: string
    mrp_inr?: number
  }
}

export function PresetCard({ preset }: PresetCardProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: preset.id,
      name: preset.name,
      price: Number(preset.price_inr),
      slug: preset.slug,
      cover_url: preset.cover_url || undefined,
      type: 'preset'
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1200)
  }

  const handleBuyNow = () => {
    addItem({
      id: preset.id,
      name: preset.name,
      price: Number(preset.price_inr),
      slug: preset.slug,
      cover_url: preset.cover_url || undefined,
      type: 'preset'
    })
    router.push('/checkout')
  }

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
  } as const

  return (
    <motion.div
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group flex flex-col space-y-4"
    >
      <Link
        href={`/browse/presets/${preset.slug}`} // Presets are under /browse/presets/
        prefetch={false}
        className="comic-panel aspect-square block group-hover:border-studio-pink transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[14px_14px_0px_black]"
      >
        <Image
          src={getOptimizedImageUrl(preset.cover_url || '/placeholder.jpg', 600, 80)}
          alt={`${preset.name} - ${preset.type} Preset | SamplesWala`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full">
          <span className="text-[8px] font-black uppercase tracking-widest text-studio-yellow">{preset.type || 'Preset'}</span>
        </div>
      </Link>

      <div className="space-y-4 px-1">
        <div className="space-y-1">
          <Link href={`/browse/presets/${preset.slug}`} prefetch={false}>
            <h3 className="text-[14px] font-black uppercase truncate hover:text-studio-neon transition-colors tracking-tighter italic">
              {preset.name}
            </h3>
          </Link>
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
              {preset.daws?.join(' & ') || 'Universal'}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 line-through font-bold">
                  ₹{preset.mrp_inr || (Number(preset.price_inr) * 3)}
                </span>
                <p className="text-[16px] font-black text-studio-neon italic leading-none">
                  ₹{preset.price_inr}
                </p>
              </div>
              
              {/* Discount Badge */}
              <div className="bg-studio-red px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_black]">
                <span className="text-[9px] font-black text-white uppercase italic">
                  {Math.round((1 - (Number(preset.price_inr) / (preset.mrp_inr || (Number(preset.price_inr) * 3)))) * 100)}% OFF
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-studio-red border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-sm w-fit rotate-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Limited Offer</span>
          </div>
        </div>

        <div className="flex flex-row gap-3 pt-2 relative">
          <AnimatePresence>
            {isAdded && (
              <motion.div
                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                animate={{ scale: 1.1, rotate: 12, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-12 left-0 right-0 z-50 flex justify-center pointer-events-none"
              >
                <div className="bg-studio-neon text-black px-4 py-2 border-4 border-black font-black italic text-xs shadow-[4px_4px_0px_black] relative">
                  ADDED!
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-studio-neon border-r-4 border-b-4 border-black rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleAddToCart}
            className="flex-1 h-11 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-studio-neon transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
          >
            <Image src="/cart-bag.png" alt="Cart" width={14} height={14} className="brightness-0" />
            Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 h-11 bg-studio-pink text-white text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Get
          </button>
        </div>
      </div>
    </motion.div>
  )
}
