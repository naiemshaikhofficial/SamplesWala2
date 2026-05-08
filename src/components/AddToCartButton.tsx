'use client'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart, CartItem } from '@/context/CartContext'
import { useState } from 'react'

export function AddToCartButton({ item }: { item: CartItem }) {
  const { addItem, items, setSidebarOpen } = useCart()
  const [added, setAdded] = useState(false)
  
  const isAlreadyInCart = items.some(i => i.id === item.id)

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
        className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-sm hover:bg-white/10 transition-all cursor-pointer"
      >
        <Check size={18} />
        <span>In Cart</span>
      </button>
    )
  }

  return (
    <button 
      onClick={handleAdd}
      className="w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-studio-yellow transition-all rounded-sm"
    >
      {added ? (
        <>
          <Check size={20} />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingBag size={20} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  )
}
