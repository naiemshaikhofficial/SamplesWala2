'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ShoppingBag, ArrowRight, X, Sparkles, Flame, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { getLocalProducerProfile, getConsentPreferences } from '@/lib/telemetryClient'

interface SuggestedPack {
  id: string
  name: string
  slug: string
  price: number
  price_usd?: number
  cover_url: string
  hookMessage: string
  badgeText: string
  badgeColor: string
}

// Flagship catalog fallback for instant zero-DB matching
const FLAGSHIP_CATALOG: SuggestedPack[] = [
  {
    id: 'a9bb41c1-3c8d-4617-91e9-c5a6f83c47b8',
    name: 'India Street Rhythm',
    slug: 'india-street-rhythm',
    price: 99,
    price_usd: 2.99,
    cover_url: 'https://imagizer.imageshack.com/v2/800x800q90/924/h4w69J.jpg',
    hookMessage: 'Trending across 1,200+ Indian beatmakers this week. Pure organic acoustic swing.',
    badgeText: 'HOT PICK',
    badgeColor: 'bg-studio-yellow text-black'
  },
  {
    id: 'b2cc41c1-3c8d-4617-91e9-c5a6f83c47b9',
    name: 'Bollywood Vocal Stacks',
    slug: 'bollywood-vocal-stacks',
    price: 199,
    price_usd: 4.99,
    cover_url: 'https://imagizer.imageshack.com/v2/800x800q90/922/c2pA7Q.jpg',
    hookMessage: 'Pristine royalty-free Indian classical & modern vocal hooks ready to drop in your DAW.',
    badgeText: 'PRODUCER CHOICE',
    badgeColor: 'bg-studio-pink text-black'
  },
  {
    id: 'c3dd41c1-3c8d-4617-91e9-c5a6f83c47ba',
    name: 'The South - Tapori',
    slug: 'the-south-tapori',
    price: 99,
    price_usd: 2.99,
    cover_url: 'https://imagizer.imageshack.com/v2/800x800q90/923/e4rT6Y.jpg',
    hookMessage: 'Massive heavy thumping percussion loops designed for high-energy dancehall & trap beats.',
    badgeText: 'HIGH ENERGY',
    badgeColor: 'bg-studio-red text-white'
  }
]

export function ProducerSmartNudge() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [activeNudge, setActiveNudge] = useState<SuggestedPack | null>(null)
  const [isCartMode, setIsCartMode] = useState(false)

  const { items, addItem, isItemOwned } = useCart()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    setMounted(true)

    // Wait 7 seconds before presenting the smart recommendation so user gets settled
    const timer = setTimeout(() => {
      evaluateAndTriggerNudge()
    }, 7000)

    return () => clearTimeout(timer)
  }, [items])

  const evaluateAndTriggerNudge = () => {
    if (typeof window === 'undefined') return

    // 1. Check if user already dismissed recently in this session
    const dismissed = sessionStorage.getItem('sw_nudge_dismissed')
    if (dismissed === 'true') return

    // 2. High Priority: Abandoned Cart items
    if (items.length > 0) {
      const firstCartItem = items[0]
      setActiveNudge({
        id: firstCartItem.id,
        name: firstCartItem.name,
        slug: firstCartItem.slug,
        price: firstCartItem.price,
        price_usd: firstCartItem.price_usd,
        cover_url: firstCartItem.cover_url || '/placeholder.jpg',
        hookMessage: `You left "${firstCartItem.name}" in your cart! Complete your beat now before prices update.`,
        badgeText: 'CART PENDING',
        badgeColor: 'bg-studio-neon text-black'
      })
      setIsCartMode(true)
      setIsOpen(true)
      return
    }

    // 3. Telemetry Profile matching
    const profile = getLocalProducerProfile()
    const searched = (profile.searched_keywords || []).map((k) => k.toLowerCase())
    const previews = profile.previewed_audio || []

    // Match based on previewed audio
    if (previews.length > 0) {
      const recentPreview = previews[0]
      if (!isItemOwned(recentPreview.pack_id, '')) {
        const matchingCatalog = FLAGSHIP_CATALOG.find((p) => p.id === recentPreview.pack_id)
        if (matchingCatalog) {
          setActiveNudge({
            ...matchingCatalog,
            hookMessage: `You previewed "${recentPreview.sample_name || recentPreview.pack_name}". 94% of beatmakers grabbed the full kit after previewing!`,
            badgeText: 'BASED ON PREVIEW',
            badgeColor: 'bg-studio-blue text-black'
          })
          setIsCartMode(false)
          setIsOpen(true)
          return
        }
      }
    }

    // Match based on searches (e.g. "drill", "vocal", "south")
    if (searched.length > 0) {
      const topSearch = searched[0]
      let matched = FLAGSHIP_CATALOG.find(
        (p) =>
          !isItemOwned(p.id, p.slug) &&
          (p.name.toLowerCase().includes(topSearch) || p.slug.toLowerCase().includes(topSearch))
      )

      if (!matched) {
        matched = FLAGSHIP_CATALOG.find((p) => !isItemOwned(p.id, p.slug))
      }

      if (matched) {
        setActiveNudge({
          ...matched,
          hookMessage: `Looking for "${topSearch}"? Beatmakers producing your genre rated this pack 4.9/5 stars.`,
          badgeText: 'MATCHED TO SEARCH',
          badgeColor: 'bg-studio-yellow text-black'
        })
        setIsCartMode(false)
        setIsOpen(true)
        return
      }
    }

    // 4. Default Flagship pick for unowned item
    const unowned = FLAGSHIP_CATALOG.find((p) => !isItemOwned(p.id, p.slug))
    if (unowned) {
      setActiveNudge(unowned)
      setIsCartMode(false)
      setIsOpen(true)
    }
  }

  const handleDismiss = () => {
    setMinimized(true)
    try {
      sessionStorage.setItem('sw_nudge_dismissed', 'true')
    } catch {}
  }

  if (!mounted || !activeNudge) return null

  // If user already owns this item, don't nudge it
  if (!isCartMode && isItemOwned(activeNudge.id, activeNudge.slug)) return null

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto">
      <AnimatePresence>
        {isOpen && !minimized ? (
          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="w-[calc(100vw-2rem)] sm:w-80 bg-[#121214] border-2 border-black shadow-[6px_6px_0px_#FFE600] p-3.5 sm:p-4 text-white relative overflow-hidden backdrop-blur-xl"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-studio-blue via-studio-yellow to-studio-pink" />

            {/* Header Badge & Dismiss Button */}
            <div className="flex items-center justify-between mb-2.5">
              <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-black shadow-[2px_2px_0px_black] ${activeNudge.badgeColor} flex items-center gap-1`}>
                <Flame size={10} />
                {activeNudge.badgeText}
              </span>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                title="Minimize for now"
                aria-label="Minimize recommendation"
              >
                <X size={13} />
              </button>
            </div>

            {/* Main Content Card Row */}
            <div className="flex gap-3 items-center mb-3">
              <div className="w-16 h-16 relative border-2 border-black shadow-[3px_3px_0px_black] shrink-0 overflow-hidden group">
                <Image
                  src={activeNudge.cover_url}
                  alt={activeNudge.name}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={isCartMode ? '/checkout' : `/packs/${activeNudge.slug}`}
                  className="text-xs font-black uppercase tracking-tight text-white hover:text-studio-yellow truncate block comic-text"
                >
                  {activeNudge.name}
                </Link>
                <p className="text-[10px] text-white/70 line-clamp-2 leading-tight mt-0.5 font-sans">
                  {activeNudge.hookMessage}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-black italic text-studio-neon font-mono">
                    {formatPrice(activeNudge.price, activeNudge.price_usd)}
                  </span>
                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Instant Vault</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button (High Conversion) */}
            {isCartMode ? (
              <Link
                href="/checkout"
                className="w-full h-9 bg-studio-neon hover:bg-white text-black font-black uppercase text-[10px] sm:text-xs tracking-wider border-2 border-black shadow-[3px_3px_0px_black] flex items-center justify-center gap-1.5 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <ShoppingBag size={13} />
                <span>COMPLETE ORDER NOW →</span>
              </Link>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      id: activeNudge.id,
                      name: activeNudge.name,
                      price: activeNudge.price,
                      price_usd: activeNudge.price_usd,
                      slug: activeNudge.slug,
                      cover_url: activeNudge.cover_url,
                      type: 'pack'
                    })
                    setIsCartMode(true)
                  }}
                  className="flex-1 h-9 bg-studio-yellow hover:bg-white text-black font-black uppercase text-[10px] tracking-wider border-2 border-black shadow-[3px_3px_0px_black] flex items-center justify-center gap-1 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                >
                  <Zap size={12} fill="black" />
                  <span>CLAIM PACK</span>
                </button>
                <Link
                  href={`/packs/${activeNudge.slug}`}
                  className="h-9 px-3 bg-[#202024] hover:bg-[#2c2c34] text-white font-bold uppercase text-[9px] tracking-wider border border-white/20 flex items-center justify-center transition-all"
                >
                  DETAILS
                </Link>
              </div>
            )}
          </motion.div>
        ) : minimized ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setMinimized(false)}
            className="flex items-center gap-2 bg-[#121214] hover:bg-black text-white px-3 py-2 border-2 border-black shadow-[4px_4px_0px_#FFE600] font-black text-[10px] uppercase tracking-wider transition-transform hover:scale-105 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-studio-neon animate-pulse" />
            <Sparkles size={13} className="text-studio-yellow" />
            <span>Sound Pick for You</span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
