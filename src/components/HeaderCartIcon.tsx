'use client'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function HeaderCartIcon() {
  const { itemCount, setSidebarOpen } = useCart()

  return (
    <button 
      onClick={() => setSidebarOpen(true)}
      className="relative hover:text-studio-yellow transition-colors group outline-none"
    >
      <ShoppingCart size={18} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-studio-yellow text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
          {itemCount}
        </span>
      )}
    </button>
  )
}

