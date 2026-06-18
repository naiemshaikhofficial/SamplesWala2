'use client'
import React from 'react'

interface PaymentAcceptedProps {
  className?: string
  variant?: 'compact' | 'full'
}

export function PaymentAccepted({ className = '', variant = 'full' }: PaymentAcceptedProps) {
  const logos = [
    { name: 'UPI', file: 'upi' },
    { name: 'Google Pay', file: 'gpay' },
    { name: 'PhonePe', file: 'phonepe' },
    { name: 'Paytm', file: 'paytm' },
    { name: 'RuPay', file: 'rupay' },
    { name: 'Visa', file: 'visa' },
    { name: 'Mastercard', file: 'mastercard' },
    { name: 'American Express', file: 'amex' },
    { name: 'PayPal', file: 'paypal' }
  ]

  const activeLogos = variant === 'compact'
    ? logos.filter(l => ['upi', 'gpay', 'phonepe', 'visa', 'mastercard', 'paypal'].includes(l.file))
    : logos

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 md:gap-3 ${className}`}>
      {activeLogos.map((logo) => (
        <div
          key={logo.file}
          title={logo.name}
          className="group relative flex items-center justify-center w-[50px] h-[28px] md:w-[76px] md:h-[40px] 
            bg-[#0d0d0d] border border-white/10 hover:border-studio-yellow/60 rounded-xs 
            px-1.5 py-1 md:px-2.5 md:py-1.5 transition-all duration-300 select-none
            shadow-[1px_1px_0px_rgba(0,0,0,1)] md:shadow-[2px_2px_0px_rgba(0,0,0,1)]
            hover:shadow-[2px_2px_0px_rgba(255,200,0,0.25)] md:hover:shadow-[4px_4px_0px_rgba(255,200,0,0.25)] 
            hover:-translate-y-0.5"
        >
          {/* Official Vector Logo Image */}
          <img
            src={`/payment-logos/${logo.file}.svg`}
            alt={logo.name}
            className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
          />
          
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xs pointer-events-none" />
        </div>
      ))}
    </div>
  )
}
