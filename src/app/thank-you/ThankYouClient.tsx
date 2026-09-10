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
    <div className="max-w-2xl mx-auto relative z-10 space-y-6 select-none pt-4 pb-16 px-4">
      {/* Minimal Brand Logo */}
      <div className="flex justify-center">
        <Link href="/" className="inline-flex items-center opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-lg sm:text-xl font-black uppercase tracking-tight font-mono text-white">
            SAMPLES<span className="text-white/40">WALA</span>
          </span>
        </Link>
      </div>

      {/* Clean Minimal Title (Kam Highlight) */}
      <div className="flex flex-col items-center text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono">
          {isFree ? 'FREE SOUNDS READY' : 'ORDER CONFIRMED'}
        </h1>
        <p className="text-[11px] font-mono text-white/45 uppercase tracking-wider">

        </p>
      </div>

      {/* Detailed Animated SamplesWala Delivery Car & Unboxing Experience */}
      <div className="w-full relative">
        <DeliveryCarAnimation
          key={replayKey}
          mode="return"
          onParcelClick={handleUnboxAndDownload}
          isParcelOpened={isParcelOpened}
          isDownloading={isDownloading}
        />

        {/* Clean Unboxing / Download Status Alert */}
        {isParcelOpened && (
          <div className="flex flex-col items-center gap-1.5 pt-3 text-center">
            {isDownloading ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white border border-white/20 font-mono text-xs uppercase rounded-xs">
                <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-ping" />
                <span>PREPARING 24-BIT AUDIO MASTER DOWNLOAD...</span>
              </div>
            ) : downloadSuccess ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FF94]/20 text-[#00FF94] border border-[#00FF94]/40 font-mono text-xs uppercase rounded-xs">
                <span> DOWNLOAD STARTED! ENJOY YOUR SOUNDS</span>
              </div>
            ) : downloadError ? (
              <button
                onClick={handleUnboxAndDownload}
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-xs uppercase rounded-xs cursor-pointer hover:bg-red-500/30"
              >
                <span>DOWNLOAD BLOCKED? TAP TO RETRY ↺</span>
              </button>
            ) : null}
          </div>
        )}

        <div className="flex justify-end pt-1 pr-2">
          <button
            onClick={() => {
              setReplayKey(k => k + 1)
              setIsParcelOpened(false)
              setIsDownloading(false)
              setDownloadSuccess(false)
              setDownloadError(null)
            }}
            className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/30 hover:text-white/70 transition-colors underline cursor-pointer"
          >
            Replay Delivery ↺
          </button>
        </div>
      </div>

      {/* Clean, Low-Highlight Action Footer */}
      <div className="flex flex-col items-center space-y-4 pt-6">
        <Link
          href="/library"
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest border border-white/20 hover:border-white/40 transition-all rounded-xs hover:scale-[1.02] active:scale-[0.98]"
        >
          GO TO LIBRARY →
        </Link>

        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
          Need help? Contact{' '}
          <a href="mailto:support@sampleswala.com" className="text-white/50 hover:text-white underline">
            support@sampleswala.com
          </a>
        </p>
      </div>
    </div>
  )
}
