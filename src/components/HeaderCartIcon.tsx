'use client'
import React from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export function HeaderCartIcon() {
  const { itemCount, setSidebarOpen } = useCart()

  return (
    <button 
      onClick={() => setSidebarOpen(true)}
      className="relative hover:opacity-80 transition-all group outline-none"
    >
      <Image 
        src="/cart-bag.png" 
        alt="Cart" 
        width={20} 
        height={20} 
        className="object-contain brightness-0 invert" 
      />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-studio-yellow text-black text-[9px] font-black w-4 h-4 border-2 border-black flex items-center justify-center animate-in zoom-in rotate-6 shadow-[2px_2px_0px_black]">
          {itemCount}
        </span>
      )}
    </button>
  )
}

