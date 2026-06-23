'use client'
import React, { useEffect, useRef } from 'react'

export function TrustpilotBadge() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trustpilot bootstrap script creates window.Trustpilot
    // We need to re-initialize the widget when the component mounts
    // especially during client-side navigation in Next.js
    const loadWidget = () => {
      if ((window as any).Trustpilot && ref.current) {
        (window as any).Trustpilot.loadFromElement(ref.current)
      }
    }

    // Small delay to ensure the script is fully ready
    const timer = setTimeout(loadWidget, 200)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-16">
      {/* Trustpilot Card */}
      <div className="bg-white p-4 border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] -rotate-1 max-w-sm w-full transition-transform hover:scale-105 min-h-[110px] flex flex-col justify-between">
        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-black/40 mb-3 text-center">Industry Verified</div>
        <div 
          ref={ref}
          className="trustpilot-widget" 
          data-locale="en-US" 
          data-template-id="56278e9abfbbba0bdcd568bc" 
          data-businessunit-id="69de81c9756cf3ddd0de99d0" 
          data-style-height="52px" 
          data-style-width="100%" 
          data-token="39be7cba-7af6-4523-95f2-780d1f4e857c"
        >
          <a href="https://www.trustpilot.com/review/sampleswala.com" target="_blank" rel="noopener">Trustpilot</a>
        </div>
      </div>

      {/* ScamAdviser Card */}
      <a 
        href="https://www.scamadviser.com/check-website/sampleswala.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-white p-4 border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] rotate-1 max-w-sm w-full transition-transform hover:scale-105 min-h-[110px] flex flex-col justify-between"
      >
        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-black/40 mb-3 text-center">Safety Rating</div>
        <div className="flex items-center justify-center gap-4 flex-1">
          {/* Logo representation */}
          <div className="flex items-center gap-1.5 select-none">
            {/* Red shield with checkmark */}
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L2 4V13C2 19.2 6.2 24.8 12 28C17.8 24.8 22 19.2 22 13V4L12 0Z" fill="#E52427"/>
              <path d="M7 13.5L10.5 17L17 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-black text-black tracking-tighter font-sans">SCAM</span>
              <span className="text-[12px] font-black text-[#E52427] tracking-tighter font-sans">ADVISER</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-black/10" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-[7px] font-black uppercase tracking-wider text-black/40 leading-none">TRUST SCORE</span>
            <span className="text-[20px] font-black text-[#56B949] leading-none mt-1 font-mono">82/100</span>
          </div>
        </div>
      </a>
    </div>
  )
}
