'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface PaymentAcceptedProps {
  className?: string
  variant?: 'compact' | 'full'
}

export function PaymentAccepted({ className = '', variant = 'full' }: PaymentAcceptedProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const logos = [
    { name: 'UPI', file: 'upi', shadowColor: '#BF00FF' },
    { name: 'RuPay', file: 'rupay', shadowColor: '#FF5C00' },
    { name: 'Paytm', file: 'paytm', shadowColor: '#00baf2' },
    { name: 'Visa', file: 'visa', shadowColor: '#0074e4' },
    { name: 'Mastercard', file: 'mastercard', shadowColor: '#FF3131' },
    { name: 'American Express', file: 'amex', shadowColor: '#016fd0' },
    { name: 'PayPal', file: 'paypal', shadowColor: '#003087' }
  ]

  const activeLogos = variant === 'compact'
    ? logos.filter(l => ['upi', 'rupay', 'visa', 'mastercard', 'amex', 'paypal'].includes(l.file))
    : logos

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 md:gap-4.5 ${className}`}>
      {activeLogos.map((logo, idx) => {
        const isHovered = hoveredIndex === idx
        return (
          <motion.div
            key={logo.file}
            title={logo.name}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ 
              y: -3, 
              x: -3, 
              scale: 1.06,
              transition: { type: 'spring', stiffness: 350, damping: 12 }
            }}
            whileTap={{ y: 1, x: 1, scale: 0.96 }}
            style={{
              boxShadow: isHovered 
                ? `5px 5px 0px ${logo.shadowColor}` 
                : '3px 3px 0px rgba(255, 255, 255, 0.08)',
              borderColor: isHovered ? logo.shadowColor : 'rgba(255, 255, 255, 0.15)',
            }}
            className="group relative flex items-center justify-center w-[48px] h-[28px] md:w-[68px] md:h-[38px] 
              bg-white/[0.03] hover:bg-white/[0.08] border-2 rounded-xs 
              px-1.5 py-1 select-none transition-all duration-200 cursor-pointer"
          >
            {/* Official Vector Logo Image with white-to-color transition */}
            <img
              src={`/payment-logos/${logo.file}.svg`}
              alt={logo.name}
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
              style={{
                filter: isHovered 
                  ? 'brightness(1) invert(0) opacity(1)' 
                  : 'brightness(0) invert(1) opacity(0.55)'
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
