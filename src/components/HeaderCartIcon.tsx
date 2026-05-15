'use client'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export function HeaderCartIcon() {
  const { itemCount, setSidebarOpen } = useCart()

  return (
    <button 
      onClick={() => setSidebarOpen(true)}
      className="relative hover:opacity-70 transition-all group outline-none"
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          key={`cart-bag-${itemCount}`}
          animate={itemCount > 0 ? {
            scaleY: [1, 0.85, 1.1, 0.95, 1], // Reduced squash
            scaleX: [1, 1.15, 0.9, 1.05, 1], // Reduced stretch
            y: [0, 2, -1, 0],               // Minimal downward movement
            rotate: [0, -4, 3, -1, 0]        // Subtle rock
          } : {}}
          transition={{ 
            duration: 0.5,
            times: [0, 0.2, 0.5, 0.8, 1],
            ease: "easeOut"
          }}
          className="relative flex items-center justify-center"
        >
          <Image 
            src="/cart-bag.png" 
            alt="Cart" 
            width={24} 
            height={24} 
            priority
            className="object-contain brightness-0 invert" 
          />
          
          <AnimatePresence mode="popLayout">
            {itemCount > 0 && (
              <motion.span 
                key={`badge-${itemCount}`}
                initial={{ y: -60, x: 20, scale: 0, rotate: -180, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  x: 0, 
                  scale: 1, 
                  rotate: 0,
                  opacity: 1
                }}
                exit={{ 
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 0.1 } 
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  mass: 1
                }}
                className="absolute -top-2 -right-2 bg-studio-red text-white text-[9px] font-black w-4 h-4 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_black] z-50 rounded-sm"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </button>
  )
}

