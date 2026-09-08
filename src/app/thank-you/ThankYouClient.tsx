'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Copy, Check, Download, ShieldCheck, Sparkles, Music, HelpCircle } from 'lucide-react'

export function ThankYouClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'SW-CONFIRMED'
  const isFree = searchParams.get('free') === 'true' || orderId.startsWith('SW_FREE') || orderId.startsWith('SW_PAY_FREE')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Top Celebration Badge */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-[#00FF94]/10 border-2 border-[#00FF94] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,148,0.25)] animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="text-[#00FF94]" size={42} strokeWidth={2.5} />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-studio-yellow border-2 border-black rotate-12 flex items-center justify-center animate-bounce">
            <Sparkles size={14} className="text-black" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00FF94]">
            {isFree ? 'Free Claim Confirmed' : 'Payment Verified & Unlocked'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight italic text-white leading-tight">
          {isFree ? (
            <>YOUR FREE SOUNDS <span className="text-[#00FF94]">ARE READY!</span></>
          ) : (
            <>THANK YOU FOR <span className="text-studio-yellow">YOUR ORDER!</span></>
          )}
        </h1>

        <p className="text-sm text-white/60 max-w-lg leading-relaxed font-sans">
          {isFree ? (
            'Your free sound pack has been permanently added to your personal Sound Vault. You can download the 24-bit WAV audio files anytime.'
          ) : (
            'Your transaction is complete. We have added all sounds to your vault and dispatched your commercial license receipt to your email.'
          )}
        </p>
      </div>

      {/* Order Details Receipt Card */}
      <div className="bg-[#101012] border-2 border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">Order Reference</span>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-mono font-black text-white">{orderId}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-white transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check size={14} className="text-[#00FF94]" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FF94] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94]" />
              INSTANT VAULT ACCESS
            </span>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-white/80">
              <Download size={14} className="text-[#00FF94]" />
              <span className="text-[10px] font-black uppercase tracking-wider font-mono">24-Bit WAV</span>
            </div>
            <p className="text-[11px] text-white/40 leading-snug">Uncompressed studio master quality audio files.</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck size={14} className="text-studio-neon" />
              <span className="text-[10px] font-black uppercase tracking-wider font-mono">100% Royalty Free</span>
            </div>
            <p className="text-[11px] text-white/40 leading-snug">Clearance for Spotify, YouTube, Beats & Sync.</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-white/80">
              <Music size={14} className="text-studio-yellow" />
              <span className="text-[10px] font-black uppercase tracking-wider font-mono">All DAWs</span>
            </div>
            <p className="text-[11px] text-white/40 leading-snug">Works inside FL Studio, Ableton, Logic & Cubase.</p>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/library"
            className="flex-1 h-14 bg-white text-black font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 rounded-xl hover:bg-[#00FF94] transition-all border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>GO TO SOUND VAULT</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/free"
            className="h-14 px-6 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 rounded-xl border border-white/10 transition-all font-mono"
          >
            <span>MORE FREE PACKS</span>
          </Link>
        </div>
      </div>

      {/* Quick Help & Support Box */}
      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-2">
          <HelpCircle size={15} />
          <span>Need help with your download or license?</span>
        </div>
        <Link href="/support" className="text-white hover:underline font-bold font-mono">
          Contact Support →
        </Link>
      </div>
    </div>
  )
}
