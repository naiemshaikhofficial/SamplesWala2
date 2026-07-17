'use client'
import { useState, useEffect } from 'react'
import { Download, Loader2, AlertTriangle } from 'lucide-react'
import { getSecureDownloadUrl } from '@/app/packs/actions'
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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click trigger
    setStatus('processing')
    setError(null)
    setProgress(0)

    try {
      // Start fetching immediately
      const secureUrlPromise = getSecureDownloadUrl(itemId, type)

      // Artificial wait only if server is too fast (for visual feedback)
      const [secureUrl] = await Promise.all([
        secureUrlPromise,
        new Promise(resolve => setTimeout(resolve, 2500))
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

  const btnBg = compact
    ? (status === 'success' ? 'bg-[#128807] text-white' : 'bg-[#2a2a2e] hover:bg-[#34343a] text-white')
    : (status === 'success' ? 'bg-studio-blue text-white' : 'bg-studio-neon hover:bg-studio-neon/90 text-black')

  const containerHeight = compact ? 'h-8' : 'h-11'
  const fontSize = compact ? 'text-[9px]' : 'text-[11px]'

  return (
    <div className={`space-y-1.5 ${compact ? 'w-full' : 'w-full md:w-52 min-w-[170px]'}`} onClick={(e) => e.stopPropagation()}>
      <div className={`relative overflow-hidden rounded-[4px] ${containerHeight} w-full`}>
        {/* Progress Bar overlay */}
        <motion.div
          className={`absolute inset-0 z-0 origin-left ${compact ? 'bg-white/10' : 'bg-black/10'}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1 }}
        />

        <button
          disabled={status !== 'idle'}
          onClick={handleDownload}
          className={`relative z-10 w-full h-full font-bold uppercase tracking-wider ${fontSize} flex items-center justify-center gap-2 transition-all rounded-[4px] cursor-pointer
            ${btnBg}
            ${status === 'processing' ? 'cursor-wait' : ''}
          `}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="flex items-center gap-1.5"
              >
                <Download size={compact ? 12 : 16} />
                <span>{compact ? 'Download' : 'DOWNLOAD'}</span>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Loader2 className="animate-spin" size={compact ? 12 : 18} />
                <span>{compact ? 'Saving...' : 'SPEEDING UP...'}</span>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <span>{compact ? 'Started' : 'BOOM! STARTED.'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-1 text-red-500">
          <AlertTriangle size={10} />
          <p className="text-[8px] font-bold uppercase tracking-widest italic">{error}</p>
        </div>
      )}
    </div>
  )
}
