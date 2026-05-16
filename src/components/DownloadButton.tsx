'use client'
import { useState, useEffect } from 'react'
import { Download, Loader2, AlertTriangle, ShieldCheck, CheckCircle2, Zap } from 'lucide-react'
import { getSecureDownloadUrl } from '@/app/packs/actions'
import { motion, AnimatePresence } from 'framer-motion'

export function DownloadButton({ itemId, type = 'pack' }: { itemId: string, type?: 'pack' | 'preset' }) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: any
    if (status === 'processing') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev
          return prev + 10 // Rapid increment
        })
      }, 50)
    } else if (status === 'success') {
      setProgress(100)
    } else {
      setProgress(0)
    }
    return () => clearInterval(interval)
  }, [status])

  const handleDownload = async () => {
    setStatus('processing')
    setError(null)
    setProgress(0)

    try {
      // Start fetching immediately
      const secureUrlPromise = getSecureDownloadUrl(itemId, type)

      // Artificial wait only if server is too fast (for visual feedback)
      const [secureUrl] = await Promise.all([
        secureUrlPromise,
        new Promise(resolve => setTimeout(resolve, 800))
      ])

      if (secureUrl) {
        // Instant trigger
        window.location.href = secureUrl
        setStatus('success')

        // Revert to idle after 5 seconds
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        throw new Error("No link generated")
      }
    } catch (err: any) {
      console.error("Download Failed:", err)
      setError(err.message || "DOWNLOAD_FAILED")
      setStatus('idle')
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="relative overflow-hidden border-4 border-black shadow-[6px_6px_0px_black] group transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
        {/* Hyper-Fast Progress Bar */}
        <motion.div
          className="absolute inset-0 bg-studio-neon z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1 }}
        />

        <button
          disabled={status !== 'idle'}
          onClick={handleDownload}
          className={`relative z-10 w-full h-16 font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all
            ${status === 'idle' ? 'bg-studio-neon text-black hover:bg-white' : 'cursor-wait text-black'}
            ${status === 'success' ? 'bg-studio-blue text-white' : ''}
          `}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-3"
              >
                <Download size={20} className="text-black animate-pulse" />
                <span>DOWNLOAD</span>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="animate-spin" size={20} />
                <span>SPEEDING UP...</span>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 size={20} className="text-white" />
                <span>BOOM! STARTED.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {status === 'processing' && (
        <p className="text-[9px] font-black text-studio-neon uppercase tracking-widest text-center animate-pulse">
          Bypassing latency... connecting directly.
        </p>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500">
          <AlertTriangle size={12} />
          <p className="text-[10px] font-black uppercase tracking-widest italic">{error}</p>
        </div>
      )}
    </div>
  )
}
