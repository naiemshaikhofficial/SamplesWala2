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
    <main className="min-h-screen bg-[#0d0d10] text-white pt-10 sm:pt-14 pb-20 px-4 sm:px-6 relative overflow-hidden select-none flex flex-col justify-center">
      {/* Studio Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2a2a30_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00FF94]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#FFE600]/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="max-w-md mx-auto py-24 px-6 text-center space-y-4 bg-[#121215] border-3 border-black shadow-[8px_8px_0px_black] rounded-sm">
          <div className="w-12 h-12 border-4 border-black border-t-[#00FF94] rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono font-black uppercase tracking-widest text-[#00FF94]">
            Preparing Your Sound Vault Receipt...
          </p>
        </div>
      }>
        <ThankYouClient />
      </Suspense>
    </main>
  )
}
