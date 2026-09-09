import React from 'react'
import type { Metadata } from 'next'
import { RocketShooterGame } from '@/components/RocketShooterGame'
import { Wrench, Radio, Music, Sparkles, Mail, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maintenance in Progress | SamplesWala',
  description: 'SamplesWala is currently undergoing scheduled system upgrades. Play the arcade Rocket Shooter mini-game while you wait!',
  robots: {
    index: false,
    follow: false
  }
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-between px-4 py-8 sm:py-12 relative overflow-hidden font-sans">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-studio-neon/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-studio-yellow/5 blur-[100px] pointer-events-none rounded-full" />

      {/* TOP BRANDING & STATUS HEADER */}
      <header className="w-full max-w-2xl text-center space-y-3 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#2a2a2a] text-xs font-mono shadow-md">
          <Radio className="w-3.5 h-3.5 text-studio-neon animate-pulse" />
          <span className="text-zinc-400">STATUS:</span>
          <span className="text-studio-neon font-bold tracking-wide">SYSTEM MAINTENANCE LIVE</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-luckiest-guy tracking-wider text-white uppercase drop-shadow-sm">
            Maintenance is on
          </h1>
          <p className="text-sm sm:text-base font-bold font-mono text-studio-yellow uppercase tracking-tight">
            While you wait, score in this game!
          </p>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Our sound catalog and audio processing engines are receiving scheduled upgrades.
          Pilot your rocket below, blast vinyl asteroids, and see how high you can score!
        </p>
      </header>

      {/* MAIN ARCADE GAME SECTION */}
      <main className="w-full my-6 sm:my-8 z-10 flex flex-col items-center">
        <RocketShooterGame />

        {/* TARGET SCORING CHEAT SHEET */}
        <div className="w-full max-w-2xl mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#101010] border border-[#222222]">
            <span className="text-studio-neon font-bold block">💿 Retro Vinyl</span>
            <span className="text-zinc-400 text-[11px]">+150 PTS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101010] border border-[#222222]">
            <span className="text-studio-orange font-bold block">⚡ Audio Glitch</span>
            <span className="text-zinc-400 text-[11px]">+250 PTS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101010] border border-[#222222]">
            <span className="text-zinc-300 font-bold block">🪨 Space Asteroid</span>
            <span className="text-zinc-400 text-[11px]">+100 PTS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101010] border border-[#222222]">
            <span className="text-studio-yellow font-bold block">💎 Beat Crystal</span>
            <span className="text-zinc-400 text-[11px]">+500 PTS (Rapid)</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-2xl pt-4 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono z-10">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Music className="w-3.5 h-3.5 text-studio-neon" />
          <span>SamplesWala Sound Laboratory</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:support@sampleswala.com"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>support@sampleswala.com</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
