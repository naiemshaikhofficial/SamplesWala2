'use client'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart, CartItem } from '@/context/CartContext'
import { useState } from 'react'

export function AddToCartButton({ item }: { item: CartItem }) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  
  const isAlreadyInCart = items.some(i => i.id === item.id)

  const handleAdd = () => {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (isAlreadyInCart) {
    return (
      <div className="w-full h-14 bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-sm cursor-not-allowed">
        <Check size={18} />
        <span>In Cart</span>
      </div>
    )
  }

  return (
    <button 
      onClick={handleAdd}
      className="w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-studio-yellow transition-all rounded-sm"
    >
      {added ? (
        <>
          <Check size={18} />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingBag size={18} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  )
}
