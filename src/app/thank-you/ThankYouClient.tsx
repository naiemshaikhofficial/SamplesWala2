'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PartyPopper,
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Music, 
  Volume2,
  MailCheck,
  HelpCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PartyCelebration } from '@/components/PartyCelebration'
import { DeliveryCarAnimation } from '@/components/DeliveryCarAnimation'
import { DownloadButton } from '@/components/DownloadButton'

export function ThankYouClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'SW-CONFIRMED'
  const isFree = searchParams.get('free') === 'true' || orderId.startsWith('SW_FREE') || orderId.startsWith('SW_PAY_FREE')
  
  const [copied, setCopied] = useState(false)
  const [claimedItems, setClaimedItems] = useState<any[]>([])
  const [replayKey, setReplayKey] = useState(0)

  // Fetch claimed sound packs/presets from user_vault
  useEffect(() => {
    let isMounted = true

    async function fetchClaimedVaultItems() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        let query = supabase
          .from('user_vault')
          .select('id, item_id, item_type, item_name, amount, razorpay_order_id, created_at')
          .eq('user_id', user.id)

        if (orderId && orderId !== 'SW-CONFIRMED') {
          query = query.eq('razorpay_order_id', orderId)
        } else {
          query = query.order('created_at', { ascending: false }).limit(2)
        }

        const { data: vaultItems, error } = await query
        if (error || !vaultItems || vaultItems.length === 0) return

        // Enrich with pack metadata if available
        const packIds = vaultItems.filter(v => v.item_type === 'pack').map(v => v.item_id)
        if (packIds.length > 0) {
          const { data: packs } = await supabase
            .from('sample_packs')
            .select('id, name, slug, cover_url')
            .in('id', packIds)

          if (isMounted) {
            const enriched = vaultItems.map(v => {
              const pack = packs?.find(p => p.id === v.item_id)
              return {
                ...v,
                cover_url: pack?.cover_url,
                slug: pack?.slug
              }
            })
            setClaimedItems(enriched)
          }
        } else {
          if (isMounted) {
            setClaimedItems(vaultItems)
          }
        }
      } catch (err) {
        console.error('Failed to load claimed vault items:', err)
      }
    }

    fetchClaimedVaultItems()
    return () => {
      isMounted = false
    }
  }, [orderId])

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* 60FPS Confetti & Multi-Stage Fireworks Celebration */}
      <PartyCelebration />

      <div className="max-w-2xl mx-auto relative z-10 space-y-6 select-none pt-4 pb-12">
        {/* Minimal Centered Brand Logo (Since Global Header is Hidden) */}
        <div className="flex justify-center">
          <Link href="/" className="group inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic font-mono text-white">
              SAMPLES<span className="text-studio-yellow">WALA</span>
            </span>
          </Link>
        </div>

        {/* Center Branded Payment Confirmation Comic Badge */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {/* Radiant glow ring matching payment confirmation */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF0080] via-[#FFC800] to-[#00FF94] opacity-75 blur-xl animate-pulse" />

            {/* Comic Badge */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-black border-4 border-[#FFC800] flex items-center justify-center text-[#FFC800] shadow-[8px_8px_0px_#FF0080] rounded-md transition-transform hover:scale-105">
              <PartyPopper size={52} className="animate-wiggle" />

              {/* Comic Floating BOOM! sticker */}
              <div className="absolute -top-3.5 -right-3.5 bg-[#FF5C00] text-white text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-0.5 rounded-xs border-2 border-white rotate-12 shadow-[2px_2px_0px_black] animate-bounce">
                {isFree ? 'FREE!' : 'BOOM!'}
              </div>

              {/* Comic Sparkle badge */}
              <div className="absolute -bottom-2.5 -left-3 bg-[#00FF94] text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-xs -rotate-6 border border-black shadow-[2px_2px_0px_black] flex items-center gap-1">
                <Sparkles size={11} />
                <span>UNLOCKED</span>
              </div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-2 pt-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white font-mono leading-none">
              {isFree ? (
                <>
                  YOUR FREE SOUNDS{' '}
                  <span className="text-studio-yellow graffiti-title-text underline decoration-4 decoration-[#00FF94] underline-offset-8">
                    ARE READY!
                  </span>
                </>
              ) : (
                <>
                  PAYMENT{' '}
                  <span className="text-studio-yellow graffiti-title-text underline decoration-4 decoration-[#FF0080] underline-offset-8">
                    SUCCESSFUL!
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white/75 max-w-md mx-auto leading-relaxed">
              {isFree ? (
                'Your free sound pack has been added to your Sound Vault. Instant 24-bit WAV download available anytime.'
              ) : (
                'Your transaction is complete. All sounds are ready in your library and tax invoice has been sent to your email.'
              )}
            </p>
          </div>
        </div>

        {/* Detailed Animated SamplesWala Delivery Car (Return & Dialogue Sequence) */}
        <div className="w-full relative">
          <DeliveryCarAnimation key={replayKey} mode="return" />
          <div className="flex justify-end pt-1 pr-2">
            <button
              onClick={() => setReplayKey(k => k + 1)}
              className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/30 hover:text-studio-yellow transition-colors underline cursor-pointer"
            >
              Replay Delivery ↺
            </button>
          </div>
        </div>

        {/* Payment Confirmation Style Card */}
        <div className="max-w-xl mx-auto w-full bg-black/95 backdrop-blur-xl border-2 border-black rounded-sm shadow-[8px_8px_0px_#FFE600] overflow-hidden relative">
          {/* Top Tricolor Strip */}
          <div className="h-2 w-full bg-gradient-to-r from-[#FF0080] via-[#FFC800] to-[#00FF94] border-b-2 border-black" />

          <div className="p-6 sm:p-7 space-y-5">
            {/* Email & License Pill Alert */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio-yellow/10 border border-studio-yellow/25 rounded-full">
              <span className="w-2 h-2 rounded-full bg-studio-yellow animate-pulse" />
              <span className="text-[9px] font-mono font-black text-studio-yellow uppercase tracking-widest flex items-center gap-1.5">
                <MailCheck size={12} />
                {isFree ? 'FREE COMMERCIAL LICENSE UNLOCKED' : 'INVOICE & ORDER EMAIL SENT'}
              </span>
            </div>

            {/* Order Reference Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white/40">
                  <Volume2 size={13} className="text-[#00FF94]" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest block">
                    Order Reference ID
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#121215] border-2 border-black rounded-sm px-3 py-1.5 shadow-[2px_2px_0px_black]">
                    <span className="text-xs sm:text-sm font-mono font-black text-studio-yellow tracking-wider">
                      {orderId}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 bg-[#1e1e24] hover:bg-studio-yellow hover:text-black rounded-sm border-2 border-black text-white/70 hover:font-bold transition-all shadow-[2px_2px_0px_black] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-[#00FF94]" />
                        <span className="text-[9px] font-mono font-black text-[#00FF94] uppercase">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span className="text-[9px] font-mono font-black uppercase">COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40 block">
                  Vault Status
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00FF94] text-black border-2 border-black rounded-sm shadow-[2px_2px_0px_black]">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                    INSTANT ACCESS
                  </span>
                </div>
              </div>
            </div>

            {/* Unlocked Pack Preview (If Found) */}
            {claimedItems.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/50 block">
                  Unlocked Sounds:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {claimedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 bg-[#121215] border-2 border-black rounded-sm shadow-[3px_3px_0px_black]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 relative rounded-xs overflow-hidden bg-black border-2 border-black flex-shrink-0">
                          {item.cover_url ? (
                            <Image
                              src={item.cover_url}
                              alt={item.item_name || 'Sound Pack'}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#00FF94]">
                              <Music size={18} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8px] font-mono font-black text-studio-yellow uppercase tracking-wider block">
                            {item.item_type === 'pack' ? 'Sample Pack' : 'Preset'} • 24-Bit WAV
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-white uppercase italic tracking-tight truncate">
                            {item.item_name}
                          </h4>
                        </div>
                      </div>

                      <div className="w-32 sm:w-36 flex-shrink-0">
                        <DownloadButton
                          itemId={item.item_id || item.id}
                          type={item.item_type || 'pack'}
                          compact={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vault Confirmation Notice Text (Matching Payment Confirmation) */}
            <div className="pt-1">
              <p className="text-[11px] text-white/70 font-mono font-bold uppercase tracking-wider leading-relaxed">
                ℹ️ You can find all your sounds, WAV downloads, invoices and license details inside your{' '}
                <Link href="/library" className="text-studio-yellow hover:text-white transition-colors underline font-black">
                  Vault / Library
                </Link>{' '}
                at any time.
              </p>
            </div>

            {/* Big Action Button (Only Go To Library) */}
            <div className="pt-2">
              <Link
                href="/library"
                className="w-full h-14 bg-studio-yellow hover:bg-[#00FF94] text-black font-black uppercase tracking-[0.15em] text-xs sm:text-sm flex items-center justify-center gap-2 rounded-sm border-3 border-black shadow-[6px_6px_0px_black] hover:shadow-[8px_8px_0px_black] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all font-mono cursor-pointer"
              >
                <span>GO TO LIBRARY</span>
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>
          </div>

          {/* Clean Support Footer */}
          <div className="p-3.5 bg-black/80 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-studio-yellow" />
              <span className="font-mono text-[10px] uppercase font-bold">
                Need help? Contact support at{' '}
                <a href="mailto:support@sampleswala.com" className="text-studio-yellow hover:text-white underline">
                  support@sampleswala.com
                </a>
              </span>
            </div>
            <Link 
              href="/support" 
              className="text-white hover:text-studio-yellow font-black font-mono text-[10px] uppercase tracking-wider hover:underline"
            >
              Support →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
