'use client'
import { useState, useEffect } from 'react'
import { CreditCard, Loader2, Check } from 'lucide-react'
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
}

export function PaymentButton({ packId, packName, price, price_usd, slug, cover_url, userId, type = 'pack', label, compact = false }: PaymentButtonProps) {
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

  if (owned) {
    const destination = type === 'preset' ? `/browse/presets/${slug}` : `/packs/${slug}`
    return (
      <Link
        href={destination}
        className={`w-full ${compact ? 'h-9 px-2 shadow-[2px_2px_0px_black] border-2 border-black' : 'h-14 shadow-[4px_4px_0px_black] border-2 border-[#00FF94]'} bg-[#00FF94]/15 text-[#00FF94] font-black uppercase ${compact ? 'tracking-[0.1em] text-[8px] md:text-[9px]' : 'tracking-[0.2em] text-[10px]'} flex items-center justify-center gap-1.5 hover:bg-[#00FF94]/25 transition-all rounded-sm`}
      >
        <Check size={compact ? 14 : 18} strokeWidth={3} />
        <span>IN YOUR VAULT</span>
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
