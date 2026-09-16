'use client'
import { useState, useEffect } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

import { useCurrency } from '@/context/CurrencyContext'

interface PaymentButtonProps {
  packId: string
  packName: string
  price: number
  price_usd?: number
  slug: string
  cover_url: string
  userId?: string
  type?: 'pack' | 'preset'
  label?: string
  compact?: boolean
  series?: string
}

export function PaymentButton({ packId, packName, price, price_usd, slug, cover_url, userId, type = 'pack', label, compact = false, series }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { buyNow, isItemOwned } = useCart()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    try {
      router.prefetch('/checkout')
    } catch (e) {}
  }, [router])

  const owned = isItemOwned(packId, slug)
  const isIndia = series === 'India Journey'

  if (owned) {
    const destination = type === 'preset' ? `/browse/presets/${slug}` : `/packs/${slug}`
    return (
      <Link
        href={destination}
        className={`w-full ${compact ? 'h-9 px-2' : 'h-14'} ${
          isIndia 
            ? 'bg-[#128807] hover:bg-[#FF9933] text-white border-2 border-black shadow-[4px_4px_0px_#FF9933]' 
            : 'bg-[#141416] hover:bg-[#202024] text-white border-2 border-white/20 hover:border-white/40 shadow-[4px_4px_0px_black]'
        } font-black uppercase ${compact ? 'tracking-[0.1em] text-[8px] md:text-[9px]' : 'tracking-[0.2em] text-[10px]'} flex items-center justify-center transition-all rounded-sm`}
      >
        <span>OWNED</span>
      </Link>
    )
  }

  const handleBuyNow = () => {
    setLoading(true)
    buyNow({
      id: packId,
      name: packName,
      price: price,
      price_usd: price_usd,
      slug: slug,
      cover_url: cover_url,
      type: type
    })
  }

  return (
    <button 
      disabled={loading}
      onClick={handleBuyNow}
      className={`w-full ${compact ? 'h-9 px-2 shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] border-2 border-black' : 'h-14 shadow-[0_0_30px_rgba(255,200,0,0.1)]'} bg-[#FFC800] text-black font-black uppercase ${compact ? 'tracking-[0.1em] text-[8px] md:text-[9px]' : 'tracking-[0.2em] text-[10px]'} flex items-center justify-center gap-1.5 hover:bg-white transition-all disabled:opacity-50 rounded-sm`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={compact ? 14 : 20} />
      ) : (
        <>
          <CreditCard size={compact ? 14 : 20} />
          <span>{label || `BUY NOW — ${formatPrice(price, price_usd)}`}</span>
        </>
      )}
    </button>
  )
}
