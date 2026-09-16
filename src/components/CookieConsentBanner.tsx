'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, Check, Lock, Music2, Sparkles, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import { getConsentPreferences, saveConsentPreferences } from '@/lib/telemetryClient'

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  // Toggle states for preferences
  const [analytics, setAnalytics] = useState(true)
  const [personalization, setPersonalization] = useState(true)
  const [functional, setFunctional] = useState(true)

  useEffect(() => {
    setMounted(true)
    const current = getConsentPreferences()
    if (!current.accepted) {
      // Smooth non-intrusive entrance after initial hydration
      const timer = setTimeout(() => {
        setVisible(true)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!mounted || !visible) return null

  const handleAcceptAll = () => {
    saveConsentPreferences({
      analytics: true,
      personalization: true,
      functional: true
    })
    setVisible(false)
  }

  const handleSavePreferences = () => {
    saveConsentPreferences({
      analytics,
      personalization,
      functional
    })
    setVisible(false)
  }

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        aria-label="Sound & Cookie Consent Bar"
        className="fixed bottom-0 left-0 right-0 w-full z-50 pointer-events-auto bg-[#101012]/95 backdrop-blur-2xl border-t-4 border-black shadow-[0_-12px_40px_rgba(0,0,0,0.85)] text-white font-sans"
      >
        {/* Dynamic Studio Gradient Line */}
        <div className="w-full h-1 bg-gradient-to-r from-studio-blue via-studio-yellow to-studio-pink" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Main Bar Flex Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
            
            {/* Left: Branding & Explanation */}
            <div className="flex items-start sm:items-center gap-3.5 flex-1">
              <div className="w-10 h-10 rounded-sm bg-studio-blue text-black font-black flex items-center justify-center shrink-0 border-2 border-black shadow-[3px_3px_0px_black]">
                <Music2 size={20} strokeWidth={2.5} />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white comic-text">
                    Sound &amp; Cookie Preferences
                  </h3>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-studio-yellow text-black border border-black shadow-[2px_2px_0px_black]">
                    PRODUCER PRIVACY
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-white/75 leading-relaxed max-w-3xl">
                  We use cookies and telemetry to personalize sample pack recommendations for your DAW, preserve audio preview waveforms &amp; listening history, and ensure smooth instant vault delivery.
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex-1 sm:flex-none h-10 px-4 bg-[#1e1e24] hover:bg-[#282830] text-zinc-200 hover:text-white font-bold uppercase text-[10px] sm:text-xs tracking-wider border border-white/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-y-[1px]"
              >
                <Sliders size={13} />
                <span>PREFERENCES</span>
                {showPreferences ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none h-10 px-6 sm:px-8 bg-studio-blue hover:bg-white text-black font-black uppercase text-[11px] sm:text-xs tracking-wider border-2 border-black shadow-[3px_3px_0px_black] flex items-center justify-center gap-2 transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <Check size={16} strokeWidth={3} />
                <span>ACCEPT ALL</span>
              </button>
            </div>
          </div>

          {/* Expandable Wide Preferences Grid */}
          <AnimatePresence>
            {showPreferences && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    
                    {/* Category 1: Essential Core */}
                    <div className="p-3 bg-[#151518] border border-white/10 rounded-sm flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Lock size={14} className="text-studio-neon shrink-0" />
                          <span className="font-black text-[11px] text-white uppercase tracking-wider">
                            Essential Core
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-studio-neon px-1.5 py-0.5 bg-black/60 border border-studio-neon/30">
                          Active
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                        Required for secure login, cart persistence, currency conversion, and instant downloads.
                      </p>
                    </div>

                    {/* Category 2: Audio & Waveforms */}
                    <div className="p-3 bg-[#151518] border border-white/10 rounded-sm flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Music2 size={14} className="text-studio-blue shrink-0" />
                          <span className="font-black text-[11px] text-white uppercase tracking-wider">
                            Sound Cache
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFunctional(!functional)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors border border-black cursor-pointer ${
                            functional ? 'bg-studio-blue' : 'bg-[#2a2a30]'
                          }`}
                          aria-label="Toggle sound cache"
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${functional ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                        Saves demo player volume, waveform positions, and listened loops so you don&apos;t lose your spot.
                      </p>
                    </div>

                    {/* Category 3: Producer Analytics */}
                    <div className="p-3 bg-[#151518] border border-white/10 rounded-sm flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={14} className="text-studio-yellow shrink-0" />
                          <span className="font-black text-[11px] text-white uppercase tracking-wider">
                            Producer Trends
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAnalytics(!analytics)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors border border-black cursor-pointer ${
                            analytics ? 'bg-studio-yellow' : 'bg-[#2a2a30]'
                          }`}
                          aria-label="Toggle producer trends"
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${analytics ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                        Anonymously logs search trends and popular tempos so we create the sounds you actually need.
                      </p>
                    </div>

                    {/* Category 4: Smart Sound Picks */}
                    <div className="p-3 bg-[#151518] border border-white/10 rounded-sm flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-studio-pink shrink-0" />
                          <span className="font-black text-[11px] text-white uppercase tracking-wider">
                            Smart Sound Picks
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPersonalization(!personalization)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors border border-black cursor-pointer ${
                            personalization ? 'bg-studio-pink' : 'bg-[#2a2a30]'
                          }`}
                          aria-label="Toggle smart sound picks"
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${personalization ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                        Curates high-relevance sample packs based on your DAW (FL Studio / Ableton / Logic) and beat genre.
                      </p>
                    </div>

                  </div>

                  {/* Save Custom Preferences Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="h-9 px-6 bg-white hover:bg-zinc-200 text-black font-black uppercase text-[10px] sm:text-xs tracking-wider border-2 border-black shadow-[3px_3px_0px_black] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      <Check size={14} strokeWidth={3} />
                      <span>SAVE MY PREFERENCES</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
