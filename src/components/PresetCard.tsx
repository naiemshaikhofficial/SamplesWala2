'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'

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
    price_usd?: number
    cover_url?: string
    mrp_inr?: number
  }
  priority?: boolean
}

export function PresetCard({ preset, priority = false }: PresetCardProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)
  const { formatPrice, getAmount } = useCurrency()

  const handleAddToCart = () => {
    addItem({
      id: preset.id,
      name: preset.name,
      price: Number(preset.price_inr),
      price_usd: preset.price_usd ? Number(preset.price_usd) : undefined,
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
      price_usd: preset.price_usd ? Number(preset.price_usd) : undefined,
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
  const mrpVal = preset.mrp_inr || (Number(preset.price_inr) * 3)
  const priceVal = preset.price_inr
  const discountPercent = Math.round((1 - (getAmount(priceVal, preset.price_usd) / getAmount(mrpVal, preset.price_usd ? Number(preset.price_usd) * 3 : null))) * 100)

  return (
    <motion.div
      variants={item}
      initial={priority ? "show" : "hidden"}
      animate={priority ? "show" : undefined}
      whileInView={priority ? undefined : "show"}
      viewport={priority ? undefined : { once: true }}
      className="group flex flex-col justify-between h-full space-y-3"
    >
      <Link
        href={`/browse/presets/${preset.slug}`} // Presets are under /browse/presets/
        prefetch={false}
        className="relative aspect-square block overflow-hidden rounded-[6px] transition-all duration-300 border border-white/5 bg-[#121212] group-hover:border-white/20 shadow-md group-hover:shadow-lg"
      >
        <Image
          src={preset.cover_url || '/placeholder.jpg'}
          alt={`${preset.name} - ${preset.type} Preset | SamplesWala`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 rounded-[3px] z-10">
          <span className="text-[7px] font-bold uppercase tracking-wider text-studio-yellow">{preset.type || 'Preset'}</span>
        </div>
      </Link>

      <div className="flex flex-col flex-grow justify-between px-1 mt-1">
        <div className="space-y-1">
          <Link href={`/browse/presets/${preset.slug}`} prefetch={false}>
            <h3 className="text-[13px] font-bold uppercase truncate hover:text-studio-neon transition-colors tracking-tight text-white">
              {preset.name}
            </h3>
          </Link>
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">
              {preset.daws?.join(' & ') || 'Universal'}
            </p>
            
            {/* Price Row (EGS Style) */}
            <div className="flex items-center gap-2 mt-1">
              <div className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-[3px] bg-studio-red text-white">
                -{discountPercent}%
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/40 line-through font-bold">
                  {formatPrice(mrpVal, preset.price_usd ? Number(preset.price_usd) * 3 : null)}
                </span>
                <span className="text-[13px] font-extrabold text-studio-neon">
                  {formatPrice(priceVal, preset.price_usd)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 border border-white/10 rounded-[3px] w-fit bg-studio-red/80 text-white">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Limited Offer</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 relative">
          <AnimatePresence>
            {isAdded && (
              <motion.div
                initial={{ scale: 0, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-10 left-0 right-0 z-50 flex justify-center pointer-events-none"
              >
                <div className="bg-studio-neon text-black px-3 py-1 font-bold text-[10px] rounded-[4px] relative shadow-md">
                  ADDED!
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-studio-neon rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleAddToCart}
            className="flex-1 h-9 bg-white hover:bg-white/90 text-black text-[10px] font-bold uppercase tracking-wider transition-colors rounded-[4px] flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
            title="Add to Cart"
          >
            <Image src="/cart-bag.png" alt="Cart" width={11} height={11} className="brightness-0" />
            Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 h-9 bg-studio-pink hover:bg-studio-blue text-white text-[10px] font-bold uppercase tracking-wider transition-colors rounded-[4px] flex items-center justify-center active:scale-[0.98] cursor-pointer"
          >
            Get
          </button>
        </div>
      </div>
    </motion.div>
  )
}
