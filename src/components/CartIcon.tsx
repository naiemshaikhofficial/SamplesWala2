'use client'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export function CartIcon() {
  const { itemCount, setSidebarOpen } = useCart()

  return (
    <button 
      onClick={() => setSidebarOpen(true)}
      className="relative p-2 hover:text-studio-yellow transition-colors group"
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-studio-neon text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
          {itemCount}
        </span>
      )}
      <div className="absolute top-full right-0 mt-2 py-1 px-2 bg-white text-black text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        View Cart
      </div>
    </button>
  )
}
