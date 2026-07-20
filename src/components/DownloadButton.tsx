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

  const btnBg = status === 'idle'
    ? 'bg-[#FF3131] text-white hover:bg-[#ff4b4b]'
    : status === 'processing'
      ? 'bg-[#FFE600] text-black'
      : 'bg-[#00FF94] text-black'

  const borderShadowClass = status === 'idle'
    ? (compact ? 'border-2 border-black shadow-[2px_2px_0px_black]' : 'border-4 border-black shadow-[4px_4px_0px_black]')
    : status === 'processing'
      ? (compact ? 'border-2 border-black shadow-[2px_2px_0px_#FFE600]' : 'border-4 border-black shadow-[4px_4px_0px_#FFE600]')
      : (compact ? 'border-2 border-black shadow-[2px_2px_0px_#00FF94]' : 'border-4 border-black shadow-[4px_4px_0px_#00FF94]')

  const containerHeight = compact ? 'h-8' : 'h-11'
  const fontSize = compact ? 'text-[9px]' : 'text-[11px]'

  return (
    <div className={`space-y-1.5 w-full mx-auto`} onClick={(e) => e.stopPropagation()}>
      <div className={`relative overflow-hidden rounded-sm transition-all duration-300 ${borderShadowClass} ${containerHeight} w-full`}>
        {/* Progress Bar overlay */}
        <motion.div
          className="absolute inset-0 z-0 origin-left bg-[#00FF94]/25"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1 }}
        />

        <button
          disabled={status !== 'idle'}
          onClick={handleDownload}
          className={`relative z-10 w-full h-full font-black uppercase tracking-wider ${fontSize} flex items-center justify-center gap-2 transition-all cursor-pointer
            ${btnBg}
            ${status === 'processing' ? 'cursor-wait' : ''}
          `}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 font-black uppercase tracking-widest italic"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="flex items-center"
                >
                  <Download size={compact ? 12 : 16} />
                </motion.div>
                <span>{compact ? 'Download' : 'DOWNLOAD'}</span>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 font-black uppercase tracking-widest italic"
              >
                <Loader2 className="animate-spin text-black shrink-0" size={compact ? 12 : 16} />
                <span className="flex">
                  {(compact ? 'Downloading...' : 'DOWNLOADING...').split('').map((char, index) => (
                    <motion.span
                      key={index}
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: "easeInOut"
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </span>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: -3, 
                  opacity: 1 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10,
                  mass: 0.7
                }}
                className="flex items-center justify-center gap-2 font-black uppercase tracking-widest italic text-black"
              >
                <span className="bg-black text-[#00FF94] px-3 py-1 border-2 border-[#00FF94] shadow-[3px_3px_0px_#00FF94] text-[10px] md:text-[11px] scale-105 font-black tracking-widest italic">
                  {compact ? 'STARTED!' : 'BOOM! STARTED.'}
                </span>
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
