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
    <div className={`flex flex-wrap items-center justify-center gap-4 md:gap-6 ${className}`}>
      {activeLogos.map((logo, idx) => {
        const isHovered = hoveredIndex === idx
        return (
          <motion.div
            key={logo.file}
            title={logo.name}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ 
              y: -4, 
              scale: 1.15,
              transition: { type: 'spring', stiffness: 350, damping: 10 }
            }}
            whileTap={{ scale: 0.94 }}
            className="relative flex items-center justify-center w-[36px] h-[22px] md:w-[50px] md:h-[30px] select-none cursor-pointer"
          >
            {/* Official Vector Logo Image with white-to-color transition */}
            <img
              src={`/payment-logos/${logo.file}.svg`}
              alt={logo.name}
              className="w-full h-full object-contain transition-all duration-300"
              style={{
                filter: isHovered 
                  ? 'brightness(1) invert(0) opacity(1)' 
                  : 'brightness(0) invert(1) opacity(0.5)'
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
