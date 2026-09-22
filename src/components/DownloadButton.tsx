'use client'
import { useState, useEffect } from 'react'
import { Download, Loader2, AlertTriangle, Check } from 'lucide-react'
import { getSecureDownloadUrl } from '@/app/packs/actions'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export function DownloadButton({ 
  itemId, 
  type = 'pack',
  compact = false 
}: { 
  itemId: string, 
  type?: 'pack' | 'preset',
  compact?: boolean
}) {
  const { syncOwnedIds } = useCart()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: any
    if (status === 'processing') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev
          const increment = prev < 50 ? 12 : prev < 80 ? 6 : 2
          return Math.min(prev + increment, 95)
        })
      }, 70)
    } else if (status === 'success') {
      setProgress(100)
    } else {
      setProgress(0)
    }
    return () => clearInterval(interval)
  }, [status])

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click trigger
    if (status !== 'idle') return

    setStatus('processing')
    setError(null)
    setProgress(15)

    try {
      const secureUrlPromise = getSecureDownloadUrl(itemId, type)

      const [res] = await Promise.all([
        secureUrlPromise,
        new Promise(resolve => setTimeout(resolve, 800))
      ])

      if (res && res.success && res.url) {
        setProgress(100)
        window.location.href = res.url
        setStatus('success')
        setTimeout(() => {
          setStatus('idle')
          setProgress(0)
        }, 5000)
      } else {
        const errorMsg = (res && res.error) || "Download failed. Please try again."
        setError(errorMsg)
        setStatus('idle')
        setProgress(0)
        if (errorMsg.toLowerCase().includes("own") || errorMsg.toLowerCase().includes("login")) {
          syncOwnedIds()
        }
      }
    } catch (err: any) {
      console.error("Download Failed:", err)
      setError(err?.message || "Failed to start download. Please refresh.")
      setStatus('idle')
      setProgress(0)
      syncOwnedIds()
    }
  }

  // Sizing tokens
  const containerHeight = compact ? 'h-10' : 'h-14 sm:h-16'
  const containerWidth = compact ? 'w-full' : 'w-full md:w-auto md:min-w-[280px]'
  const fontSize = compact ? 'text-[10px]' : 'text-sm sm:text-base'
  const paddingX = compact ? 'px-3' : 'px-6 sm:px-8'
  const iconSize = compact ? 14 : 20

  // Brutalist shadow states
  const borderShadowClass = status === 'idle'
    ? (compact 
        ? 'border-2 border-black shadow-[3px_3px_0px_black] hover:shadow-[4px_4px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5' 
        : 'border-4 border-black shadow-[6px_6px_0px_black] hover:shadow-[8px_8px_0px_black] hover:-translate-x-1 hover:-translate-y-1')
    : status === 'processing'
      ? (compact 
          ? 'border-2 border-black shadow-[3px_3px_0px_#FFE600]' 
          : 'border-4 border-black shadow-[6px_6px_0px_#FFE600]')
      : (compact 
          ? 'border-2 border-black shadow-[3px_3px_0px_#00FF94]' 
          : 'border-4 border-black shadow-[6px_6px_0px_#00FF94]')

  const btnBg = status === 'idle'
    ? 'bg-[#FF3131] text-white hover:bg-[#ff1f1f]'
    : status === 'processing'
      ? 'bg-[#FFE600] text-black'
      : 'bg-[#00FF94] text-black'

  return (
    <div className={`space-y-2 ${containerWidth}`} onClick={(e) => e.stopPropagation()}>
      <div 
        className={`group relative overflow-hidden rounded-sm select-none transition-all duration-200 ${containerHeight} ${borderShadowClass} active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_black]`}
      >
        {/* Progress Bar overlay */}
        {status === 'processing' && (
          <motion.div
            className="absolute inset-0 z-0 origin-left bg-[#00FF94]/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        )}

        {/* Shimmer / Light sweep effect on idle */}
        {status === 'idle' && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />
        )}

        <button
          type="button"
          disabled={status !== 'idle'}
          onClick={handleDownload}
          aria-label={status === 'processing' ? 'Downloading...' : 'Download sample pack'}
          className={`relative z-10 w-full h-full font-black uppercase tracking-wider ${fontSize} ${paddingX} flex items-center justify-center gap-2.5 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white
            ${btnBg}
            ${status === 'processing' ? 'cursor-wait' : ''}
          `}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-2.5 font-black uppercase tracking-widest italic w-full"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  className="flex items-center justify-center shrink-0"
                >
                  <Download size={iconSize} strokeWidth={2.8} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                </motion.div>
                
                <span className="truncate">{compact ? 'Download' : 'DOWNLOAD PACK'}</span>

                {!compact && (
                  <span className="hidden sm:inline-block bg-black text-white text-[9px] font-mono px-2 py-0.5 rounded-xs border border-white/20 tracking-widest uppercase ml-1">
                    ZIP
                  </span>
                )}
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-2.5 font-black uppercase tracking-widest italic w-full text-black"
              >
                <Loader2 className="animate-spin shrink-0 text-black" size={iconSize} strokeWidth={2.8} />
                <span className="truncate">
                  {compact ? 'PREPARING...' : `PREPARING ZIP (${progress}%)`}
                </span>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0.7, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 450, damping: 15 }}
                className="flex items-center justify-center gap-2 font-black uppercase tracking-widest italic w-full text-black"
              >
                <div className="bg-black text-[#00FF94] p-1 rounded-full">
                  <Check size={compact ? 10 : 14} strokeWidth={3.5} />
                </div>
                <span className="truncate">
                  {compact ? 'STARTED!' : 'DOWNLOAD STARTED!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 text-red-400 bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-sm"
        >
          <AlertTriangle size={12} className="shrink-0" />
          <p className="text-[9px] font-bold uppercase tracking-wider italic text-center">{error}</p>
        </motion.div>
      )}
    </div>
  )
}
