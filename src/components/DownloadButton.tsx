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

  // ============================================================================
  // 1. COMPACT VARIANT (FOR VAULT GRID CARDS - DEDICATED DISTINCT DESIGN)
  // ============================================================================
  if (compact) {
    return (
      <div className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
        <div 
          className={`group relative overflow-hidden rounded-xs select-none transition-all duration-200 h-8 border-2 border-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
            ${status === 'idle' 
              ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_black] hover:shadow-[3px_3px_0px_black] hover:bg-[#00FF94] hover:-translate-x-0.5 hover:-translate-y-0.5' 
              : status === 'processing'
                ? 'bg-[#00FF94] text-black shadow-[2px_2px_0px_black]'
                : 'bg-white text-black shadow-[2px_2px_0px_black]'
            }
          `}
        >
          {/* Progress bar fill for card */}
          {status === 'processing' && (
            <motion.div
              className="absolute inset-0 z-0 origin-left bg-black/15"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.15 }}
            />
          )}

          {/* Shimmer sweep on hover */}
          {status === 'idle' && (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
          )}

          <button
            type="button"
            disabled={status !== 'idle'}
            onClick={handleDownload}
            aria-label="Download pack"
            className={`relative z-10 h-full px-3 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider italic cursor-pointer outline-none whitespace-nowrap
              ${status === 'processing' ? 'cursor-wait' : ''}
            `}
          >
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div
                  key="card-idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="flex items-center"
                  >
                    <Download size={13} strokeWidth={3} className="shrink-0" />
                  </motion.div>
                  <span>DOWNLOAD</span>
                </motion.div>
              )}

              {status === 'processing' && (
                <motion.div
                  key="card-processing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Loader2 size={12} strokeWidth={3} className="animate-spin shrink-0 text-black" />
                  <span>{progress}%</span>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="card-success"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check size={12} strokeWidth={3.5} className="text-[#128807] shrink-0" />
                  <span>READY!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {error && (
          <div className="absolute right-0 top-full mt-1 z-30 bg-black/90 border border-red-500 text-red-400 text-[8px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    )
  }

  // ============================================================================
  // 2. HERO VARIANT (FOR PACK DETAIL VIEW - LARGE, BOLD, PROMINENT)
  // ============================================================================
  const borderShadowClass = status === 'idle'
    ? 'border-4 border-black shadow-[6px_6px_0px_black] hover:shadow-[8px_8px_0px_black] hover:-translate-x-1 hover:-translate-y-1'
    : status === 'processing'
      ? 'border-4 border-black shadow-[6px_6px_0px_#FFE600]'
      : 'border-4 border-black shadow-[6px_6px_0px_#00FF94]'

  const btnBg = status === 'idle'
    ? 'bg-[#FF3131] text-white hover:bg-[#ff1f1f]'
    : status === 'processing'
      ? 'bg-[#FFE600] text-black'
      : 'bg-[#00FF94] text-black'

  return (
    <div className="space-y-2 w-full md:w-auto md:min-w-[280px]" onClick={(e) => e.stopPropagation()}>
      <div 
        className={`group relative overflow-hidden rounded-sm select-none transition-all duration-200 h-14 sm:h-16 ${borderShadowClass} active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_black]`}
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
          className={`relative z-10 w-full h-full font-black uppercase tracking-wider text-sm sm:text-base px-6 sm:px-8 flex items-center justify-center gap-2.5 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white
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
                  <Download size={20} strokeWidth={2.8} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                </motion.div>
                
                <span className="truncate">DOWNLOAD PACK</span>

                <span className="hidden sm:inline-block bg-black text-white text-[9px] font-mono px-2 py-0.5 rounded-xs border border-white/20 tracking-widest uppercase ml-1">
                  ZIP
                </span>
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
                <Loader2 className="animate-spin shrink-0 text-black" size={20} strokeWidth={2.8} />
                <span className="truncate">
                  {`PREPARING ZIP (${progress}%)`}
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
                  <Check size={14} strokeWidth={3.5} />
                </div>
                <span className="truncate">
                  DOWNLOAD STARTED!
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
