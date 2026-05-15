'use client'
import React, { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export function ShareButton({ title, text, url, className = "" }: { title: string, text: string, url?: string, className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <button 
      onClick={handleShare}
      className={`flex items-center justify-center rounded-sm transition-all text-white hover:text-white group ${className}`}
      title="Share Pack"
    >
      {copied ? (
        <Check size={24} className="text-studio-neon" />
      ) : (
        <Share2 size={24} className="transition-transform group-hover:scale-110 drop-shadow-lg" />
      )}
    </button>
  )
}
