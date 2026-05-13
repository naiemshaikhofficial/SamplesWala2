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
    <div className="flex justify-center pt-16">
      <div className="bg-white p-4 border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] -rotate-1 max-w-sm w-full transition-transform hover:scale-105">
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
    </div>
  )
}
