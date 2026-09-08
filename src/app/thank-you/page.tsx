import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { ThankYouClient } from './ThankYouClient'

export const metadata: Metadata = {
  title: 'Order Confirmed — Thank You | Samples Wala',
  description: 'Your order is confirmed. Your royalty-free sounds and sample packs are ready for download in your vault.',
  robots: {
    index: false,
    follow: false
  }
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00FF94]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-studio-yellow/5 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="max-w-2xl mx-auto py-24 text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-studio-neon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-white/40">Loading your receipt...</p>
        </div>
      }>
        <ThankYouClient />
      </Suspense>
    </main>
  )
}
