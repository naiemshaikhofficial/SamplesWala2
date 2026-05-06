'use client'
import { useState } from 'react'
import { Download, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { getSecureDownloadUrl } from '@/app/packs/actions'

export function DownloadButton({ packId }: { packId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const secureUrl = await getSecureDownloadUrl(packId)
      window.location.href = secureUrl
      setTimeout(() => setLoading(false), 5000)
    } catch (err: any) {
      console.error("Download Failed:", err)
      setError(err.message || "DOWNLOAD_FAILED")
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-2">
      <button 
        disabled={loading}
        onClick={handleDownload}
        className="w-full h-14 bg-[#FFC800] text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <ShieldCheck size={18} className="text-black/40" />
            <Download size={18} />
            <span>SECURE DOWNLOAD</span>
          </>
        )}
      </button>
      {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center italic">{error}</p>}
    </div>
  )
}
