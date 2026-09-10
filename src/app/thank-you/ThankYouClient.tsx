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

  const [copied, setCopied] = useState(false)
  const [claimedItems, setClaimedItems] = useState<any[]>(initialItems || [])
  const [replayKey, setReplayKey] = useState(0)
  const [isParcelOpened, setIsParcelOpened] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

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
      {/* Official Brand Logo */}
      <div className="flex justify-center mb-1 sm:mb-2">
        <Link href="/" className="inline-flex items-center hover:opacity-90 hover:scale-105 transition-all duration-200">
          <Image
            src="/Logo.png"
            alt="SamplesWala Logo"
            width={180}
            height={45}
            priority
            className="h-8 sm:h-10 md:h-12 w-auto object-contain"
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
        />
      </div>

      {/* ALL STATUS & ACTIONS SIT NICHE (BELOW THE ANIMATION) */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-3 pt-1">
        {/* AUTHENTIC STREET GRAFFITI "THANK YOU!" */}
        <div className="relative flex flex-col items-center justify-center my-1 select-none">
          <svg viewBox="0 0 380 76" className="w-64 sm:w-72 md:w-88 h-auto overflow-visible">
            <defs>
              <linearGradient id="graffitiYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF275" />
                <stop offset="45%" stopColor="#FFE600" />
                <stop offset="100%" stopColor="#00FF94" />
              </linearGradient>
              <filter id="graffitiGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 3D Deep Street Shadow Extrusion */}
            <text
              x="194"
              y="54"
              textAnchor="middle"
              fill="#000000"
              stroke="#000000"
              strokeWidth="11"
              strokeLinejoin="round"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontSize="52"
              fontStyle="italic"
              letterSpacing="4"
              transform="skewX(-10)"
              opacity="0.95"
            >
              THANK YOU!
            </text>

            {/* Cyber Mint Neon Spray Outline */}
            <text
              x="190"
              y="50"
              textAnchor="middle"
              fill="#000000"
              stroke="#00FF94"
              strokeWidth="7"
              strokeLinejoin="round"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontSize="52"
              fontStyle="italic"
              letterSpacing="4"
              transform="skewX(-10)"
              filter="url(#graffitiGlowFilter)"
            >
              THANK YOU!
            </text>

            {/* Electric Yellow Core */}
            <text
              x="190"
              y="50"
              textAnchor="middle"
              fill="url(#graffitiYellowGrad)"
              stroke="#FFE600"
              strokeWidth="1.2"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontSize="52"
              fontStyle="italic"
              letterSpacing="4"
              transform="skewX(-10)"
            >
              THANK YOU!
            </text>

            {/* Street Tag Spray Splatters */}
            <circle cx="48" cy="52" r="2.5" fill="#FFE600" />
            <circle cx="52" cy="59" r="1.6" fill="#00FF94" />
            <circle cx="332" cy="22" r="3" fill="#00FF94" />
            <circle cx="337" cy="29" r="1.8" fill="#FFE600" />
          </svg>
        </div>

        {/* Clean Unboxing / Download Status Alert */}
        {isParcelOpened && (
          <div className="flex flex-col items-center gap-1.5 pt-1 text-center">
            {isDownloading ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 text-white border border-white/15 font-mono text-xs uppercase rounded-xs">
                <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-ping" />
                <span>PREPARING 24-BIT AUDIO MASTER DOWNLOAD...</span>
              </div>
            ) : downloadSuccess ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/30 font-mono text-xs uppercase rounded-xs">
                <span>DOWNLOAD STARTED! ENJOY YOUR SOUNDS 🎵</span>
              </div>
            ) : downloadError ? (
              <button
                onClick={handleUnboxAndDownload}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-xs uppercase rounded-xs cursor-pointer hover:bg-red-500/20"
              >
                <span>DOWNLOAD BLOCKED? TAP TO RETRY ↺</span>
              </button>
            ) : null}
          </div>
        )}

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
