'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { useCart, CartItem } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'

interface CrossSellRecommendationsProps {
  mode?: 'cart' | 'checkout' | 'compact'
  title?: string
  subtitle?: string
  className?: string
  maxItems?: number
  intent?: string
  category?: string
  initialPacks?: any[]
}

export function CrossSellRecommendations({
  mode = 'cart',
  title = 'Frequently Paired With Your Sounds',
  subtitle = 'Recommended packs tailored to your sound',
  className = '',
  maxItems = 2,
  intent: explicitIntent,
  category: explicitCategory,
  initialPacks
}: CrossSellRecommendationsProps) {
  const { items, addItem } = useCart()
  const { formatPrice } = useCurrency()
  const [packs, setPacks] = useState<any[]>(initialPacks || [])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  // Compute dynamic intent from:
  // 1. Explicit prop (e.g. from current page)
  // 2. Items in the user's cart (names / tags of what they are buying)
  // 3. Last search query in session storage or URL
  const derivedIntent = React.useMemo(() => {
    if (explicitIntent) return explicitIntent

    // If cart has items, extract core musical keywords
    if (items.length > 0) {
      const cartKeywords = items
        .map((i) => i.name)
        .join(' ')
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
      return cartKeywords
    }

    // Otherwise check session storage for recent search intent
    if (typeof window !== 'undefined') {
      const storedQuery = sessionStorage.getItem('last_search_query')
      if (storedQuery) return storedQuery
    }

    return ''
  }, [explicitIntent, items])

  // Exclude list (everything already in cart)
  const excludeIds = React.useMemo(() => {
    return items.map((i) => i.id).join(',')
  }, [items])

  useEffect(() => {
    let isMounted = true

    const fetchDynamicRecommendations = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (derivedIntent) params.set('intent', derivedIntent)
        if (explicitCategory) params.set('category', explicitCategory)
        if (excludeIds) params.set('exclude', excludeIds)
        params.set('limit', String(maxItems + 2))

        const res = await fetch(`/api/packs/recommendations?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch dynamic recommendations')
        const data = await res.json()

        if (isMounted && Array.isArray(data)) {
          setPacks(data)
        }
      } catch (err) {
        console.warn('Could not load dynamic recommendations:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDynamicRecommendations()

    return () => {
      isMounted = false
    }
  }, [derivedIntent, explicitCategory, excludeIds, maxItems])

  // Strictly filter out any items already in cart
  const availableRecommendations = packs
    .filter((pack) => !items.some((cartItem) => cartItem.id === pack.id || cartItem.slug === pack.slug))
    .slice(0, maxItems)

  if (availableRecommendations.length === 0) {
    return null
  }

  const handleQuickAdd = (pack: any) => {
    setAddingId(pack.id)
    const cartItem: CartItem = {
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr ?? 0),
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || '/placeholder.jpg',
      type: 'pack',
      is_downloadable: pack.is_downloadable ?? true
    }
    addItem(cartItem)
    setTimeout(() => {
      setAddingId(null)
    }, 600)
  }

  if (mode === 'checkout') {
    return (
      <div className={`border-2 border-black bg-[#121212] p-5 md:p-6 rounded-sm shadow-[6px_6px_0px_#FFE600] space-y-4 ${className}`}>
        {/* Header - Clean Comic Style matching Billing Details */}
        <div className="flex items-center justify-between border-b border-black pb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-studio-yellow rounded-xs shadow-[0_0_10px_#FFE600]" />
            <h3 className="text-sm font-black uppercase tracking-tight italic text-white">
              {title}
            </h3>
          </div>
          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider bg-black/40 px-2 py-0.5 border border-white/5 rounded-xs">
            1-Click Add
          </span>
        </div>

        {/* Vertical List of Tailored Packs */}
        <div className="space-y-3.5 divide-y divide-white/5">
          {availableRecommendations.map((pack, idx) => {
            const isAdding = addingId === pack.id
            const priceInr = Number(pack.price_inr ?? 0)
            const priceUsd = pack.price_usd ? Number(pack.price_usd) : undefined

            return (
              <div
                key={pack.id}
                className={`flex items-center gap-3.5 ${idx > 0 ? 'pt-3.5' : ''} group`}
              >
                {/* Pack Artwork */}
                <div className="w-14 h-14 relative rounded-sm overflow-hidden flex-shrink-0 border border-white/10 bg-neutral-900 group-hover:border-studio-yellow/40 transition-colors">
                  <Image
                    src={pack.cover_url || '/placeholder.jpg'}
                    alt={pack.name}
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-black text-xs text-white truncate leading-tight group-hover:text-studio-yellow transition-colors">
                    {pack.name}
                  </h4>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5 truncate">
                    {pack.categories?.name || 'Sample Pack'}
                  </p>
                  <p className="text-xs font-black text-studio-yellow font-mono mt-1">
                    {priceInr === 0 ? 'FREE' : formatPrice(priceInr, priceUsd)}
                  </p>
                </div>

                {/* 1-Click Add Button */}
                <button
                  type="button"
                  onClick={() => handleQuickAdd(pack)}
                  disabled={isAdding}
                  className="px-3 py-1.5 bg-studio-yellow hover:bg-white text-black font-black text-[10px] uppercase tracking-wider rounded-xs cursor-pointer transition-all border border-black shadow-[2px_2px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 shrink-0"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-3 h-3 text-black" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 text-black" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Cart Drawer Mode
  return (
    <div className={`space-y-3 pt-3 border-t border-white/10 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70 italic">
          {title}
        </h4>
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">
          Tailored For You
        </span>
      </div>

      <div className="space-y-2">
        {availableRecommendations.map((pack) => {
          const isAdding = addingId === pack.id
          const priceInr = Number(pack.price_inr ?? 0)
          const priceUsd = pack.price_usd ? Number(pack.price_usd) : undefined

          return (
            <div
              key={pack.id}
              className="flex items-center gap-3 p-2 bg-studio-charcoal/40 border border-white/10 rounded-lg hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0 border border-white/10 bg-black">
                <Image
                  src={pack.cover_url || '/placeholder.jpg'}
                  alt={pack.name}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-grow min-w-0">
                <h5 className="font-bold text-xs text-white truncate group-hover:text-studio-yellow transition-colors">
                  {pack.name}
                </h5>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-white/10 text-white/50 px-1 rounded">
                    Pack
                  </span>
                  <span className="text-[11px] font-black text-studio-yellow font-mono">
                    {priceInr === 0 ? 'FREE' : formatPrice(priceInr, priceUsd)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickAdd(pack)}
                disabled={isAdding}
                className="px-2.5 py-1.5 bg-studio-yellow hover:bg-white text-black font-black text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 shadow-sm"
              >
                {isAdding ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
