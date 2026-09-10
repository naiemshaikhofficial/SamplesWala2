'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { DeliveryCarAnimation } from '@/components/DeliveryCarAnimation'
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

      {/* ========================================================================= */}
      {/* 💥 UPAR (TOP): RAW WILD-STYLE GRAFFITI STATUS - NO BORDERS, PURE STREET ART */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center justify-center text-center my-1 sm:my-2 relative z-20 select-none">
        {!isParcelOpened ? (
          /* State 1: Pure Clean Street Graffiti "THANK YOU!" with Paint Drips */
          <div className="flex flex-col items-center group cursor-default">
            {/* RAW WILD GRAFFITI TEXT: THANK YOU! */}
            <div className="relative flex items-center justify-center -rotate-2 sm:-rotate-3 skew-x-[-6deg] transition-transform duration-300 hover:scale-105">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider font-[family-name:var(--font-permanent-marker)] text-transparent bg-clip-text bg-gradient-to-br from-[#FFE600] via-[#FFFFFF] to-[#00FF94] graffiti-shadow select-none">
                THANK YOU!
              </h1>
            </div>

            {/* Street Art Drip SVG Underline */}
            <svg className="w-48 sm:w-64 md:w-80 h-4 mt-0.5 text-[#00FF94] fill-current drop-shadow-[0_0_8px_#00FF94]" viewBox="0 0 260 18" fill="none">
              <path d="M5 9 Q70 2 130 9 T255 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M45 9 C45 14 48 17 50 17 C52 17 55 14 55 9 Z" fill="currentColor" />
              <path d="M125 9 C125 15 128 19 130 19 C132 19 135 15 135 9 Z" fill="currentColor" />
              <path d="M195 8 C195 13 197 16 199 16 C201 16 203 13 203 8 Z" fill="currentColor" />
            </svg>
          </div>
        ) : isDownloading ? (
          /* State 2: Dynamic Downloading Status in Graffiti Style */
          <div className="flex flex-col items-center -rotate-1 sm:-rotate-2 skew-x-[-4deg]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wide font-[family-name:var(--font-permanent-marker)] text-transparent bg-clip-text bg-gradient-to-r from-[#00FF94] via-[#00E5FF] to-[#FFE600] graffiti-downloading-shadow">
              ⚡ DOWNLOADING YOUR FILE...
            </h1>
          </div>
        ) : downloadSuccess ? (
          /* State 3: Download Complete */
          <div className="flex flex-col items-center -rotate-1 sm:-rotate-2 skew-x-[-4deg]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wide font-[family-name:var(--font-permanent-marker)] text-transparent bg-clip-text bg-gradient-to-r from-[#00FF94] via-white to-[#00FF94] graffiti-downloading-shadow">
              🔥 DOWNLOAD STARTED!
            </h1>
          </div>
        ) : downloadError ? (
          /* State 4: Retry */
          <button
            onClick={handleUnboxAndDownload}
            className="flex flex-col items-center -rotate-1 skew-x-[-3deg] text-red-400 hover:text-red-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide font-[family-name:var(--font-permanent-marker)] text-red-400 drop-shadow-[0_0_12px_rgba(255,49,49,0.7)] group-hover:scale-105 transition-transform">
                DOWNLOAD BLOCKED? TAP TO RETRY ↺
              </h1>
            </div>
            <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase mt-1">
              CLICK TO RE-TRIGGER SECURE DOWNLOAD STREAM
            </span>
          </button>
        ) : null}
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

      {/* Minimal Action Footer (Below Car) */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-2 pt-1">
        <Link
          href="/library"
          className="text-[11px] font-mono text-white/40 hover:text-white/90 transition-colors uppercase tracking-widest hover:underline"
        >
          go to library &rarr;
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
            Replay Delivery &#8634;
          </button>
          <span>•</span>
          <a href="mailto:support@sampleswala.com" className="text-white/50 hover:text-white underline">
            support@sampleswala.com
          </a>
        </div>
      </div>
    </div>
  )
}
