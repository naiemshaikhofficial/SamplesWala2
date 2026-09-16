'use client'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart, CartItem } from '@/context/CartContext'
import { useState } from 'react'

export function AddToCartButton({ item, compact = false, label }: { item: CartItem, compact?: boolean, label?: string }) {
  const { addItem, items, setSidebarOpen, isItemOwned } = useCart()
  const [added, setAdded] = useState(false)
  
  const isOwned = isItemOwned(item.id, item.slug)
  const isAlreadyInCart = items.some(i => i.id === item.id)
  const isIndia = (item as any)?.series === 'India Journey' || (item as any)?.series_name === 'India Journey'

  if (isOwned) {
    return (
      <div 
        className={`w-full ${compact ? 'h-9' : 'h-14'} ${
          isIndia 
            ? 'bg-[#128807] text-white border-2 border-black shadow-[4px_4px_0px_#FF9933]' 
            : 'bg-[#18181b] text-zinc-300 border-2 border-zinc-700 shadow-[4px_4px_0px_black]'
        } font-black uppercase tracking-widest ${compact ? 'text-[9px]' : 'text-xs'} flex items-center justify-center gap-2 rounded-sm select-none`}
      >
        <Check size={compact ? 14 : 18} strokeWidth={3} className={isIndia ? 'text-white' : 'text-zinc-400'} />
        <span>Owned</span>
      </div>
    )
  }

  const handleAdd = () => {
    addItem(item)
    setAdded(true)
    setSidebarOpen(true) // Open sidebar when adding to cart
    setTimeout(() => setAdded(false), 2000)
  }

  if (isAlreadyInCart) {
    return (
      <button 
        onClick={() => setSidebarOpen(true)}
        className={`w-full ${compact ? 'h-9' : 'h-14'} bg-white/5 border-2 border-black text-white font-black uppercase tracking-widest ${compact ? 'text-[9px]' : 'text-xs'} flex items-center justify-center gap-2 rounded-sm hover:bg-white/10 transition-all cursor-pointer shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]`}
      >
        <Check size={compact ? 14 : 18} />
        <span>In Cart</span>
      </button>
    )
  }

  return (
    <button 
      onClick={handleAdd}
      className={`w-full ${compact ? 'h-9' : 'h-14'} bg-white text-black font-black uppercase tracking-widest ${compact ? 'text-[9px]' : 'text-xs'} flex items-center justify-center gap-2 hover:bg-studio-yellow transition-all rounded-sm border-2 border-black shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]`}
    >
      {added ? (
        <>
          <Check size={compact ? 14 : 20} />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingBag size={compact ? 14 : 20} />
          <span>{label || "Add to Cart"}</span>
        </>
      )}
    </button>
  )
}
