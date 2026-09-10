'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Music, 
  HelpCircle, 
  Volume2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PartyCelebration } from '@/components/PartyCelebration'

export function ThankYouClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'SW-CONFIRMED'
  const isFree = searchParams.get('free') === 'true' || orderId.startsWith('SW_FREE') || orderId.startsWith('SW_PAY_FREE')
  
  const [copied, setCopied] = useState(false)
  const [claimedItems, setClaimedItems] = useState<any[]>([])

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
      {/* 60FPS Confetti Cannon & Party Animation */}
      <PartyCelebration />

      <div className="max-w-2xl mx-auto relative z-10 space-y-7 select-none">
        {/* Top Celebration Badge & Party Title */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Party Stamp / Badge */}
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#00FF94] border-4 border-black rounded-sm flex items-center justify-center shadow-[6px_6px_0px_black] rotate-[-2deg] transition-transform hover:scale-105">
              <CheckCircle2 className="text-black" size={46} strokeWidth={3} />
            </div>

            {/* Party Bouncing Stickers */}
            <div className="absolute -top-3 -right-4 bg-studio-yellow text-black border-2 border-black text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-xs rotate-12 shadow-[3px_3px_0px_black] animate-bounce">
              {isFree ? '🎉 100% FREE!' : '🎉 BOOM! PAID'}
            </div>

            <div className="absolute -bottom-2 -left-3 bg-[#FF5C00] text-white border-2 border-black text-[8px] font-black uppercase px-2 py-0.5 rounded-xs -rotate-6 shadow-[2px_2px_0px_black]">
              <Sparkles size={11} className="inline mr-1" />
              UNLOCKED
            </div>
          </div>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black text-[#00FF94] border-2 border-black rounded-sm shadow-[3px_3px_0px_black] skew-x-[-8deg]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF94] animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-widest text-[#00FF94]">
              {isFree ? 'FREE SOUND VAULT ACCESS GRANTED' : 'PAYMENT VERIFIED & SOUNDS UNLOCKED'}
            </span>
          </div>

          {/* Main Hero Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-none font-mono">
              {isFree ? (
                <>
                  YOUR FREE SOUNDS{' '}
                  <span className="text-[#00FF94] graffiti-title-text underline decoration-4 decoration-studio-yellow underline-offset-8">
                    ARE READY!
                  </span>
                </>
              ) : (
                <>
                  THANK YOU FOR{' '}
                  <span className="text-studio-yellow graffiti-title-text underline decoration-4 decoration-[#00FF94] underline-offset-8">
                    YOUR ORDER!
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white/70 max-w-lg mx-auto leading-relaxed pt-1">
              {isFree ? (
                <>Your royalty-free pack has been added to your <span className="text-[#00FF94] font-black">Sound Vault</span>. Uncompressed 24-bit WAV audio files are ready for download.</>
              ) : (
                <>Your commercial transaction is verified. All sounds are unlocked in your vault and tax receipt has been emailed.</>
              )}
            </p>
          </div>
        </div>

        {/* Clean Studio Vault Receipt Console */}
        <div className="bg-[#121215] border-3 sm:border-4 border-black rounded-sm shadow-[8px_8px_0px_black] overflow-hidden relative">
          {/* Top Tricolor Accent Line */}
          <div className="h-2 w-full bg-gradient-to-r from-[#00FF94] via-studio-yellow to-[#0074e4] border-b-2 border-black" />

          <div className="p-6 sm:p-7 space-y-6">
            {/* Order Reference & Vault Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-black/40">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white/40">
                  <Volume2 size={13} className="text-[#00FF94]" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest block">
                    Vault Order Reference
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black border-2 border-black rounded-sm px-3 py-1.5 shadow-[2px_2px_0px_black]">
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
                  Status
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00FF94] text-black border-2 border-black rounded-sm shadow-[2px_2px_0px_black]">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                    INSTANT LIFETIME ACCESS
                  </span>
                </div>
              </div>
            </div>

            {/* Unlocked Pack Preview (If Loaded) */}
            {claimedItems.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/50 block">
                  Unlocked in Your Vault:
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {claimedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 bg-black border-2 border-black rounded-sm shadow-[3px_3px_0px_black]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 relative rounded-xs overflow-hidden bg-[#18181c] border-2 border-black flex-shrink-0">
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

                      <Link
                        href="/library"
                        className="px-3 py-1.5 bg-[#00FF94] hover:bg-studio-yellow text-black font-black uppercase text-[10px] font-mono tracking-wider rounded-sm border-2 border-black shadow-[2px_2px_0px_black] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Download size={12} strokeWidth={3} />
                        <span>DOWNLOAD</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Big Tactile Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/library"
                className="flex-1 h-14 bg-studio-yellow hover:bg-[#00FF94] text-black font-black uppercase tracking-[0.15em] text-xs sm:text-sm flex items-center justify-center gap-2 rounded-sm border-3 border-black shadow-[5px_5px_0px_black] hover:shadow-[7px_7px_0px_black] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all font-mono cursor-pointer"
              >
                <span>GO TO SOUND VAULT &amp; DOWNLOAD</span>
                <ArrowRight size={18} strokeWidth={3} />
              </Link>

              <Link
                href="/free"
                className="sm:w-auto px-6 h-14 bg-[#18181c] hover:bg-white hover:text-black text-white font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 rounded-sm border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all font-mono cursor-pointer"
              >
                <span>EXPLORE MORE FREE PACKS</span>
              </Link>
            </div>
          </div>

          {/* Minimal Clean Support Bar */}
          <div className="p-3.5 bg-black border-t-2 border-black flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-studio-yellow" />
              <span className="font-mono text-[10px] uppercase font-bold">
                Need help with your download or license?
              </span>
            </div>
            <Link 
              href="/support" 
              className="text-white hover:text-studio-yellow font-black font-mono text-[10px] uppercase tracking-wider hover:underline"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
