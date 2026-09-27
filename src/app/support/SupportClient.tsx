'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { EpicSupportAssistant } from '@/components/support/EpicSupportAssistant'
import { SupportDeskClient } from '@/components/support/SupportDeskClient'
import { SupportConveyor } from '@/components/support/SupportConveyor'
import { Bot, Ticket, ArrowLeft, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

function SupportClientInner() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab') || ''
  const ticketParam = searchParams?.get('ticket') || ''
  const emailParam = searchParams?.get('email') || ''

  const [activeView, setActiveView] = useState<'assistant' | 'tickets'>(
    tabParam === 'tickets' || tabParam === 'track' ? 'tickets' : 'assistant'
  )

  useEffect(() => {
    if (tabParam === 'tickets' || tabParam === 'track') {
      setActiveView('tickets')
    }
  }, [tabParam])

  return (
    <div className="w-full relative min-h-screen bg-[#07080a] text-white">
      {/* Top Floating View Switcher Bar for Seamless Navigation */}
      <div className="w-full bg-[#0b0e14] border-b border-white/[0.06] py-2 px-4 sm:px-8 flex items-center justify-between z-30 relative text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-studio-neon animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
            Samples Wala Support Portal
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#141824] p-1 rounded-lg border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveView('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
              activeView === 'assistant'
                ? 'bg-[#0074e4] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bot size={13} />
            <span>AI Assistant</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('tickets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
              activeView === 'tickets'
                ? 'bg-[#0074e4] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Ticket size={13} />
            <span>Tickets Desk</span>
          </button>
        </div>
      </div>

      {activeView === 'assistant' ? (
        <EpicSupportAssistant
          initialTicketNumber={ticketParam}
          initialEmail={emailParam}
        />
      ) : (
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <button
              onClick={() => setActiveView('assistant')}
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white/50 hover:text-studio-neon transition-colors cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AI Support Assistant
            </button>
          </div>

          {/* Conveyor Animation Banner */}
          <div className="border-2 border-white/10 rounded-sm shadow-[6px_6px_0px_#0074e4] overflow-hidden relative z-20 bg-zinc-950">
            <div className="h-1 bg-[#1e1e24]" />
            <div className="flex h-[3px]">
              <div className="flex-1 bg-studio-neon" />
              <div className="flex-1 bg-studio-blue" />
              <div className="flex-1 bg-studio-yellow" />
            </div>
            <SupportConveyor />
          </div>

          {/* Tickets Desk & Tracking */}
          <SupportDeskClient />
        </div>
      )}
    </div>
  )
}

export function SupportClient() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100vh-76px)] bg-[#07080a] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#0074e4]/20 border-t-[#0074e4] animate-spin" />
        </div>
      }
    >
      <SupportClientInner />
    </Suspense>
  )
}
