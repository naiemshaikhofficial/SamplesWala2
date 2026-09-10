import React from 'react'
import type { Metadata } from 'next'
import { RocketShooterGame } from '@/components/RocketShooterGame'
import { getSiteSettings } from '@/lib/siteSettings'
import { Clock } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `${settings.maintenance_title || 'Site Under Maintenance'} | ${settings.site_name || 'SamplesWala'}`,
    description: settings.maintenance_message || 'SamplesWala is under scheduled maintenance. Play our rocket shooter mini-game while you wait!',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function MaintenancePage() {
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden font-sans select-none">
      {/* HEADER */}
      <div className="w-full max-w-2xl text-center space-y-2 mb-3.5 z-10 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-luckiest-guy tracking-wider text-white uppercase">
          {settings.maintenance_title || 'Site Under Maintenance'}
        </h1>
        <p className="text-xs sm:text-sm font-mono font-medium text-zinc-300 max-w-lg mx-auto">
          {settings.maintenance_message || 'While our team performs scheduled upgrades, play and score!'}
        </p>

        {/* EXPECTED RETURN TIME BADGE */}
        {settings.expected_return_time && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-medium mt-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Expected Return: {settings.expected_return_time}</span>
          </div>
        )}
      </div>

      {/* ROCKET GAME */}
      <div className="w-full max-w-2xl z-10 shrink-0">
        <RocketShooterGame />
      </div>

      {/* FOOTER NOTE */}
      <div className="w-full max-w-2xl mt-3 text-center text-[11px] text-zinc-500 font-mono z-10 shrink-0">
        <span>{settings.site_name || 'SamplesWala'} • We will be back online shortly</span>
      </div>
    </div>
  )
}
