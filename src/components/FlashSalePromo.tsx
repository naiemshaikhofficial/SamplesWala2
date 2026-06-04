'use client'
import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FlashSalePromoProps {
  type: string
}

export function FlashSalePromo({ type }: FlashSalePromoProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    // Check cached value immediately on mount for fast reaction
    const cached = sessionStorage.getItem('show_flash_sale')
    if (cached !== null) {
      setIsVisible(cached !== 'false')
    }

    const fetchStatus = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('app_metadata')
          .select('value')
          .eq('key', 'show_flash_sale')
          .maybeSingle()

        if (!error) {
          const value = data ? data.value !== 'false' : false
          setIsVisible(value)
          sessionStorage.setItem('show_flash_sale', String(value))
        }
      } catch (err) {
        console.error('Error fetching flash sale status:', err)
      }
    }

    fetchStatus()
  }, [])

  if (!mounted || !isVisible) {
    return null
  }

  return (
    <div className="p-5 bg-studio-pink/10 border-2 border-studio-pink/20 rounded-sm">
      <div className="flex items-center gap-2 text-studio-pink mb-2">
        <ShoppingBag size={14} />
        <span className="text-[9px] font-black uppercase tracking-widest">Flash Sale</span>
      </div>
      <p className="text-[11px] font-black uppercase tracking-tighter text-white">
        Get any {type === 'packs' ? 'Pack' : 'Preset'} for <span className="text-studio-neon">₹499</span>
      </p>
    </div>
  )
}
