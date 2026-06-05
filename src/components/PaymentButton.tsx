'use client'
import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
}

export function PaymentButton({ packId, packName, price, price_usd, slug, cover_url, userId, type = 'pack', label }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addItem, items, setSidebarOpen } = useCart()
  const { formatPrice } = useCurrency()

  const handleBuyNow = async () => {
    setLoading(true)
    setSidebarOpen(false) // Close sidebar if it's open
    
    // 1. Add to cart if not already there
    const isAlreadyInCart = items.some(i => i.id === packId)
    if (!isAlreadyInCart) {
      addItem({
        id: packId,
        name: packName,
        price: price,
        price_usd: price_usd,
        slug: slug,
        cover_url: cover_url,
        type: type
      })
    }

    // 2. Redirect directly to checkout
    router.push('/checkout')
  }

  return (
    <button 
      disabled={loading}
      onClick={handleBuyNow}
      className="w-full h-14 bg-[#FFC800] text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-[0_0_30px_rgba(255,200,0,0.1)]"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <CreditCard size={20} />
          <span>{label || `BUY NOW — ${formatPrice(price, price_usd)}`}</span>
        </>
      )}
    </button>
  )
}
