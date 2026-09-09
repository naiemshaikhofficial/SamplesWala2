import React from 'react'
import type { Metadata } from 'next'
import { RocketShooterGame } from '@/components/RocketShooterGame'

export const metadata: Metadata = {
  title: 'Maintenance | SamplesWala',
  description: 'SamplesWala is under maintenance. Play our rocket shooter mini-game while you wait!',
  robots: {
    index: false,
    follow: false
  }
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden font-sans select-none">
      {/* HEADER */}
      <div className="w-full max-w-2xl text-center space-y-1 mb-3.5 z-10 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-luckiest-guy tracking-wider text-white uppercase">
          Maintenance is on
        </h1>
        <p className="text-xs sm:text-sm font-mono font-bold text-studio-yellow uppercase tracking-wide">
          While you wait, score in this game!
        </p>
      </div>

      {/* ROCKET GAME */}
      <div className="w-full max-w-2xl z-10 shrink-0">
        <RocketShooterGame />
      </div>

      {/* FOOTER NOTE */}
      <div className="w-full max-w-2xl mt-3 text-center text-[11px] text-zinc-500 font-mono z-10 shrink-0">
        <span>SamplesWala • We will be back online shortly</span>
      </div>
    </div>
  )
}
