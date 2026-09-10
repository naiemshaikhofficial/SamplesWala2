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
import { getSecureDownloadUrl } from '@/app/packs/actions'

interface ThankYouClientProps {
  initialOrderId?: string
  initialIsFree?: boolean
  initialItems?: any[]
}

export function ThankYouClient({
  initialOrderId,
  initialIsFree,
  initialItems
}: ThankYouClientProps = {}) {
  const searchParams = useSearchParams()
  const orderId = initialOrderId || searchParams.get('order_id') || 'SW-CONFIRMED'
  const isFree = initialIsFree ?? (searchParams.get('free') === 'true' || orderId.startsWith('SW_FREE') || orderId.startsWith('SW_PAY_FREE'))

  const [claimedItems, setClaimedItems] = useState<any[]>(initialItems || [])
  const [fallbackCover, setFallbackCover] = useState<string>('')
  const [replayKey, setReplayKey] = useState(0)
  const [isParcelOpened, setIsParcelOpened] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    if (claimedItems.length === 0) {
      try {
        const supabase = createClient()
        supabase
          .from('sample_packs')
          .select('cover_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.cover_url) setFallbackCover(data.cover_url)
          })
      } catch (e) {}
    }
  }, [claimedItems.length])

  const handleUnboxAndDownload = async () => {
    if (isParcelOpened && !downloadError) return
    setIsParcelOpened(true)
    setIsDownloading(true)
    setDownloadError(null)

    try {
      let targetId = claimedItems[0]?.item_id || claimedItems[0]?.id
      let targetType: 'pack' | 'preset' = claimedItems[0]?.item_type || 'pack'

      // Fallback 1: Query user_vault if not available in state yet
      if (!targetId) {
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            let q = supabase
              .from('user_vault')
              .select('id, item_id, item_type')
              .eq('user_id', user.id)

            if (orderId && orderId !== 'SW-CONFIRMED') {
              q = q.eq('razorpay_order_id', orderId)
            } else {
              q = q.order('created_at', { ascending: false })
            }

            const { data: vaultRec } = await q.limit(1).maybeSingle()
            if (vaultRec) {
              targetId = vaultRec.item_id
              targetType = vaultRec.item_type || 'pack'
            }
          }
        } catch (err) {
          console.warn('Vault query fallback warning:', err)
        }
      }

      // Fallback 2: Default free pack ID if still missing
      if (!targetId) {
        targetId = 'a9bb41c1-3c8d-4617-91e9-c5a6f83c47b8' // India Street Rhythm Free Pack
        targetType = 'pack'
      }

      const secureUrl = await getSecureDownloadUrl(targetId, targetType)
      if (secureUrl) {
        // Trigger browser file download automatically
        const link = document.createElement('a')
        link.href = secureUrl
        link.setAttribute('download', '')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setDownloadSuccess(true)
      } else {
        throw new Error('Could not generate secure download link')
      }
    } catch (e: any) {
      console.error('Failed to auto-download unboxed parcel:', e)
      setDownloadError(e?.message || 'Download failed')
    } finally {
      setTimeout(() => setIsDownloading(false), 3000)
    }
  }

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
    <div className="w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center justify-start relative z-10 select-none space-y-3 sm:space-y-4 px-4 pt-3 sm:pt-5 pb-16">
      {/* Official Brand Logo (Prominent & Cinematic) */}
      <div className="flex justify-center mb-1 sm:mb-2">
        <Link href="/" className="inline-flex items-center hover:opacity-90 hover:scale-105 transition-all duration-200">
          <Image
            src="/Logo.png"
            alt="SamplesWala Logo"
            width={240}
            height={60}
            priority
            className="h-11 sm:h-13 md:h-15 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          />
        </Link>
      </div>

      {/* Pure Detailed Hypercar Delivery & Unboxing Experience */}
      <div className="w-full relative z-10 my-0">
        <DeliveryCarAnimation
          key={replayKey}
          mode="return"
          onParcelClick={handleUnboxAndDownload}
          isParcelOpened={isParcelOpened}
          isDownloading={isDownloading}
          itemCoverUrl={claimedItems[0]?.cover_url || fallbackCover || ''}
        />
      </div>

      {/* ALL STATUS & ACTIONS SIT NICHE (BELOW THE ANIMATION) */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-3 pt-2">
        {/* BURNING NEON STATUS BANNER (Morphs seamlessly from THANK YOU into Downloading) */}
        <div className={`relative px-6 py-3.5 sm:px-9 sm:py-4.5 rounded-xl border-2 bg-[#090a10]/85 backdrop-blur-md transition-all duration-500 flex items-center justify-center ${
          isDownloading
            ? 'border-[#00FF94] shadow-[0_0_28px_rgba(0,255,148,0.5),inset_0_0_16px_rgba(0,255,148,0.25)] animate-pulse'
            : downloadSuccess
              ? 'border-[#00FF94] shadow-[0_0_28px_rgba(0,255,148,0.5),inset_0_0_16px_rgba(0,255,148,0.25)]'
              : 'border-[#FFE600] shadow-[0_0_24px_rgba(255,230,0,0.4),inset_0_0_12px_rgba(255,230,0,0.15)] hover:shadow-[0_0_36px_rgba(255,230,0,0.6)]'
        }`}>
          {/* Glowing Neon Corner Rivets */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#FFE600] rounded-xs shadow-[0_0_8px_#FFE600]" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00FF94] rounded-xs shadow-[0_0_8px_#00FF94]" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00FF94] rounded-xs shadow-[0_0_8px_#00FF94]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#FFE600] rounded-xs shadow-[0_0_8px_#FFE600]" />

          {!isParcelOpened ? (
            /* State 1: Burning Electric Neon "THANK YOU!" */
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-[0.14em] font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] via-white to-[#00FF94] drop-shadow-[0_0_16px_rgba(255,230,0,0.5)]">
                THANK YOU
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-black italic text-[#00FF94] drop-shadow-[0_0_18px_#00FF94]">
                !
              </span>
            </div>
          ) : isDownloading ? (
            /* State 2: Dynamic Downloading Status */
            <div className="flex items-center gap-2.5 px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF94] animate-ping" />
              <span className="text-sm sm:text-base md:text-lg font-black uppercase tracking-wider font-mono text-[#00FF94] drop-shadow-[0_0_12px_#00FF94]">
                ⚡ YOUR FILE IS DOWNLOADING... PLEASE WAIT
              </span>
            </div>
          ) : downloadSuccess ? (
            /* State 3: Download Complete */
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm sm:text-base md:text-lg font-black uppercase tracking-wider font-mono text-[#00FF94] drop-shadow-[0_0_12px_#00FF94]">
                DOWNLOAD STARTED! ENJOY YOUR SOUNDS 🎵
              </span>
            </div>
          ) : downloadError ? (
            /* State 4: Retry */
            <button
              onClick={handleUnboxAndDownload}
              className="flex items-center gap-2 px-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <span className="text-sm sm:text-base md:text-lg font-black uppercase tracking-wider font-mono">
                DOWNLOAD BLOCKED? TAP TO RETRY ↺
              </span>
            </button>
          ) : null}
        </div>

        {/* Minimal Action Footer */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          <Link
            href="/library"
            className="text-[11px] font-mono text-white/40 hover:text-white/90 transition-colors uppercase tracking-widest hover:underline"
          >
            go to library →
          </Link>

          <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-wider pt-1">
            <button
              onClick={() => {
                setReplayKey(k => k + 1)
                setIsParcelOpened(false)
                setIsDownloading(false)
                setDownloadSuccess(false)
                setDownloadError(null)
              }}
              className="hover:text-white/70 transition-colors underline cursor-pointer"
            >
              Replay Delivery ↺
            </button>
            <span>•</span>
            <a href="mailto:support@sampleswala.com" className="text-white/50 hover:text-white underline">
              support@sampleswala.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
