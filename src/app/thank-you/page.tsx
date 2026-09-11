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
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-full max-w-full bg-[#0d0d10] text-white px-2 sm:px-4 py-1 sm:py-2 relative overflow-hidden select-none flex flex-col justify-center items-center">
      {/* Studio Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2a2a30_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] h-[220px] bg-[#00FF94]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-full max-w-[320px] h-[180px] bg-[#FFE600]/10 rounded-full blur-[80px] pointer-events-none" />

      <Suspense fallback={
        <div className="max-w-md mx-auto py-24 px-6 text-center space-y-4 bg-[#121215] border-3 border-black shadow-[8px_8px_0px_black] rounded-sm">
          <div className="w-12 h-12 border-4 border-black border-t-[#00FF94] rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono font-black uppercase tracking-widest text-[#00FF94]">
            Loading Sound Vault...
          </p>
        </div>
      }>
        <ThankYouClient />
      </Suspense>
    </div>
  )
}
