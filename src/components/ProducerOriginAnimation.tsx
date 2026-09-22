'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, RotateCcw, Sparkles, Play, Pause, ChevronUp, ChevronDown, Music, Disc3, Flame } from 'lucide-react'

// ============================================================================
// PURE BROWSER SYNTHESIZER FOR SAMPLESWALA INDIAN BEAT GROOVE
// Zero external files, 0 network bandwidth, lightweight Web Audio API
// ============================================================================
class SamplesWalaBeatEngine {
  private ctx: AudioContext | null = null
  private isPlaying: boolean = false
  private timer: number | null = null
  private step: number = 0

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public start() {
    this.initCtx()
    if (!this.ctx || this.isPlaying) return
    this.isPlaying = true
    this.step = 0
    this.scheduleNext()
  }

  public stop() {
    this.isPlaying = false
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }

  private playDholakBass(time: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.frequency.setValueAtTime(130, time)
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.35)
    gain.gain.setValueAtTime(0.8, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)

    osc.start(time)
    osc.stop(time + 0.35)
  }

  private playTablaSlap(time: number) {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 0.12
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1800, time)
    filter.Q.setValueAtTime(3.0, time)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.4, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(time)
    noise.stop(time + 0.12)
  }

  private playHat(time: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(9000, time)
    gain.gain.setValueAtTime(0.08, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.035)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(time)
    osc.stop(time + 0.035)
  }

  private playDesiFluteSynth(freq: number, time: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, time)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900, time)
    filter.frequency.exponentialRampToValueAtTime(2600, time + 0.15)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    gain.gain.setValueAtTime(0.18, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25)

    osc.start(time)
    osc.stop(time + 0.26)
  }

  private scheduleNext() {
    if (!this.isPlaying || !this.ctx) return
    const now = this.ctx.currentTime + 0.04
    const s = this.step % 16

    // Authentic Indian Street Groove (108 BPM Dholak + Hip-Hop bounce)
    if (s === 0 || s === 6 || s === 10) this.playDholakBass(now)
    if (s === 4 || s === 12) this.playTablaSlap(now)
    if (s % 2 === 0) this.playHat(now)

    // Bouncy Bollywood/Folk melody hook (A, B, C#, E, F#, A)
    const melody = [220, 246.9, 277.2, 329.6, 370.0, 440.0, 370.0, 329.6]
    if (s % 2 === 0) {
      this.playDesiFluteSynth(melody[(s / 2) % melody.length], now)
    }

    this.step++
    this.timer = window.setTimeout(() => this.scheduleNext(), 140)
  }
}

// ============================================================================
// 4 CONTINUOUS, GAPLESS STORY SCENES:
// 1. 'GIFT_DOLL'    -> Parents offer a cute pink doll; kid looks unimpressed.
// 2. 'YEET_DOLL'    -> Kid throws the doll across the room; parents look sad.
// 3. 'REVEAL_PACK'  -> Parents surprise him with official SAMPLESWALA PACK & Crate!
// 4. 'DANCE_PARTY'  -> KID + DAD + MOM ALL DANCE TOGETHER in full family harmony!
// ============================================================================
export type StoryScene = 'GIFT_DOLL' | 'YEET_DOLL' | 'REVEAL_PACK' | 'DANCE_PARTY'

export function ProducerOriginAnimation() {
  const [scene, setScene] = useState<StoryScene>('GIFT_DOLL')
  const [isSoundOn, setIsSoundOn] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const beatEngineRef = useRef<SamplesWalaBeatEngine | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    beatEngineRef.current = new SamplesWalaBeatEngine()
    return () => {
      beatEngineRef.current?.stop()
    }
  }, [])

  // Sync music groove during Dance Party
  useEffect(() => {
    if (scene === 'DANCE_PARTY' && isSoundOn && !isPaused) {
      beatEngineRef.current?.start()
    } else {
      beatEngineRef.current?.stop()
    }
  }, [scene, isSoundOn, isPaused])

  // Continuous, smooth transition without awkward dead pauses
  const transitionTo = (nextScene: StoryScene, durationMs: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isPaused) return

    timerRef.current = setTimeout(() => {
      setScene(nextScene)
    }, durationMs)
  }

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    switch (scene) {
      case 'GIFT_DOLL':
        transitionTo('YEET_DOLL', 3600)
        break
      case 'YEET_DOLL':
        transitionTo('REVEAL_PACK', 3400)
        break
      case 'REVEAL_PACK':
        transitionTo('DANCE_PARTY', 3600)
        break
      case 'DANCE_PARTY':
        // Continuous celebratory loop!
        break
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [scene, isPaused])

  const restartStory = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsPaused(false)
    setScene('GIFT_DOLL')
  }

  const toggleSound = () => {
    const nextState = !isSoundOn
    setIsSoundOn(nextState)
    if (nextState && scene === 'DANCE_PARTY' && !isPaused) {
      beatEngineRef.current?.start()
    } else {
      beatEngineRef.current?.stop()
    }
  }

  return (
    <div className="w-full relative select-none rounded-sm border-4 border-black bg-zinc-950 shadow-[8px_8px_0px_black] overflow-hidden mb-8">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black border-b-4 border-black">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 bg-studio-yellow rounded-full animate-ping border border-black" />
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-white italic flex items-center gap-2">
            Producer Origin: <span className="text-studio-neon">"Born for SamplesWala"</span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-studio-yellow text-black text-[9px] font-black uppercase not-italic rounded-xs">
              ORIGINAL STORY
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xs border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isSoundOn 
                ? 'bg-[#00FF94] text-black shadow-[2px_2px_0px_black]' 
                : 'bg-zinc-800 text-white/60 hover:text-white shadow-[2px_2px_0px_black]'
            }`}
            title="Toggle synthesized Indian street beat"
          >
            {isSoundOn ? <Volume2 size={13} className="animate-bounce" /> : <VolumeX size={13} />}
            <span>{isSoundOn ? 'Beat: ON' : 'Beat: OFF'}</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white rounded-xs border-2 border-black shadow-[2px_2px_0px_black] flex items-center gap-1 transition-all cursor-pointer"
          >
            {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Replay */}
          <button
            onClick={restartStory}
            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-studio-yellow hover:bg-white text-black rounded-xs border-2 border-black shadow-[2px_2px_0px_black] flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 active:shadow-none"
          >
            <RotateCcw size={12} />
            <span>Replay</span>
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-white/50 hover:text-white rounded-xs border-2 border-transparent hover:border-black cursor-pointer transition-colors"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Main Animated Stage */}
      {!isCollapsed && (
        <div className="relative w-full h-[340px] sm:h-[390px] md:h-[440px] bg-gradient-to-b from-[#14141c] via-[#0c0c12] to-[#040406] flex flex-col justify-between overflow-hidden">
          
          {/* Halftone Comic Ambient Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:22px_22px]" />

          {/* English Narrative Dialogue Bubble */}
          <div className="relative z-30 pt-3 flex justify-center px-4 pointer-events-none">
            <div className="max-w-3xl px-5 py-2 bg-black border-3 border-black rounded-sm shadow-[5px_5px_0px_#FFE600] flex items-center gap-2.5 transition-all duration-300">
              <Sparkles size={16} className="text-studio-yellow animate-spin flex-shrink-0" />
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-white italic text-center">
                {scene === 'GIFT_DOLL' && "Parents: 'Surprise sweetheart! Here is a lovely cute doll for you! 🧸'"}
                {scene === 'YEET_DOLL' && "Kid: 'A DOLL?! NO WAY! I'M A PRODUCER, I WANT BEATS!' *YEET!* 💥"}
                {scene === 'REVEAL_PACK' && "Parents: 'Wait... He doesn't want toys! He wants SAMPLESWALA SAMPLES!' ✨"}
                {scene === 'DANCE_PARTY' && "All: 'BOOM!! SAMPLESWALA SAMPLES ARE HERE! LET'S GROOVE TOGETHER!!' 🎧🕺💃"}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DETAILED SVG ANIMATION VIEWPORT (1000 x 380) */}
          {/* ========================================================================= */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            <svg
              viewBox="0 0 1000 380"
              className="w-full h-full max-w-5xl mx-auto overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="comicShadowBold" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                </filter>
                <linearGradient id="goldPackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF275" />
                  <stop offset="45%" stopColor="#FFE600" />
                  <stop offset="100%" stopColor="#FF9F1C" />
                </linearGradient>
                <linearGradient id="dollGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF2E93" />
                  <stop offset="100%" stopColor="#FF77B6" />
                </linearGradient>
              </defs>

              {/* STAGE FLOOR */}
              <g className="stage-floor">
                <line x1="40" y1="330" x2="960" y2="330" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
                <line x1="80" y1="338" x2="920" y2="338" stroke="#FFE600" strokeWidth="2.5" strokeDasharray="16 8" />
                <ellipse cx="500" cy="332" rx="420" ry="12" fill="#000000" opacity="0.4" />
              </g>

              {/* ===================================================================== */}
              {/* CHARACTERS: DAD & MOM (LEFT SIDE: x ~ 170 - 320) */}
              {/* ===================================================================== */}
              <g className={`parents-group ${scene === 'DANCE_PARTY' ? 'parents-dancing-groove' : ''}`}>
                
                {/* --- DAD --- */}
                <g 
                  transform="translate(180, 110)" 
                  filter="url(#comicShadowBold)"
                  className={`dad-character ${scene === 'DANCE_PARTY' ? 'dad-dancing-body' : scene === 'YEET_DOLL' ? 'dad-sad-droop' : 'character-breathe'}`}
                >
                  {/* Floor Shadow */}
                  <ellipse cx="0" cy="220" rx="32" ry="7" fill="#000" opacity="0.5" />

                  {/* Dad Legs */}
                  <g className={scene === 'DANCE_PARTY' ? 'dad-dancing-legs' : ''}>
                    <path d="M-14,140 L-16,215" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M14,140 L16,215" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M-28,215 L-6,215 L-4,223 L-30,223 Z" fill="#475569" stroke="#000" strokeWidth="3" />
                    <path d="M6,215 L28,215 L30,223 L4,223 Z" fill="#475569" stroke="#000" strokeWidth="3" />
                  </g>

                  {/* Dad Sweater & Tie */}
                  <path d="M-28,60 L28,60 L32,145 L-32,145 Z" fill="#2563EB" stroke="#000" strokeWidth="4" />
                  <polygon points="0,60 -10,75 0,110 10,75" fill="#FFE600" stroke="#000" strokeWidth="2" />
                  <polygon points="-12,60 0,72 12,60" fill="#FFF" stroke="#000" strokeWidth="2" />

                  {/* Dad Head & Glasses */}
                  <circle cx="0" cy="20" r="26" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                  <path d="M-28,15 Q0,-16 28,15 Q14,0 -28,15 Z" fill="#334155" stroke="#000" strokeWidth="3" />
                  <rect x="-18" y="12" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="4" y="12" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="3" />
                  <line x1="-4" y1="17" x2="4" y2="17" stroke="#000" strokeWidth="3" />

                  {/* Dad Expressions & Mustache */}
                  <path d="M-10,30 Q0,26 10,30 Q0,35 -10,30 Z" fill="#1E293B" />

                  {scene === 'YEET_DOLL' ? (
                    <g className="dad-sad-face">
                      {/* Sad Drooping Eyebrows & Mouth */}
                      <line x1="-16" y1="8" x2="-4" y2="12" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <line x1="4" y1="12" x2="16" y2="8" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <path d="M-7,34 Q0,28 7,34" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <circle cx="18" cy="25" r="3" fill="#38BDF8" className="animate-bounce" />
                    </g>
                  ) : (
                    <g className="dad-happy-face">
                      <line x1="-16" y1="10" x2="-4" y2="8" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <line x1="4" y1="8" x2="16" y2="10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <path d="M-6,34 Q0,42 6,34" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Dad Arms (Animated per scene) */}
                  {scene === 'GIFT_DOLL' && (
                    <g className="dad-holding-doll">
                      <path d="M22,70 Q50,85 75,78" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="78" cy="77" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g className="dad-arms-sad">
                      <path d="M-26,70 L-34,120" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <path d="M26,70 L34,120" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g className="dad-revealing-pack">
                      <path d="M22,70 Q60,65 90,65" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="92" cy="65" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="dad-dancing-arms">
                      {/* Hands up grooving to the bhangra / desi beat! */}
                      <path d="M-26,70 Q-55,30 -40,5" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-38" cy="2" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <path d="M26,70 Q55,30 40,5" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="38" cy="2" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                </g>

                {/* --- MOM --- */}
                <g 
                  transform="translate(265, 125)" 
                  filter="url(#comicShadowBold)"
                  className={`mom-character ${scene === 'DANCE_PARTY' ? 'mom-dancing-body' : scene === 'YEET_DOLL' ? 'mom-sad-droop' : 'character-breathe'}`}
                >
                  {/* Floor Shadow */}
                  <ellipse cx="0" cy="205" rx="28" ry="7" fill="#000" opacity="0.5" />

                  {/* Saree & Pleats */}
                  <path d="M-24,65 L24,65 L36,200 L-36,200 Z" fill="#E11D48" stroke="#000" strokeWidth="4" />
                  <path d="M-22,65 Q0,115 -26,180 L-36,180 Q-6,105 -24,65 Z" fill="#FBBF24" stroke="#000" strokeWidth="2.5" />

                  {/* Mom Head & Hair Bun */}
                  <circle cx="0" cy="22" r="23" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                  <circle cx="0" cy="3" r="18" fill="#18181B" />
                  <circle cx="18" cy="12" r="10" fill="#18181B" />
                  <circle cx="-18" cy="12" r="10" fill="#18181B" />
                  <circle cx="0" cy="15" r="2.5" fill="#E11D48" />

                  {/* Mom Expression */}
                  {scene === 'YEET_DOLL' ? (
                    <g className="mom-sad-face">
                      <path d="M-12,22 Q-7,26 -2,22" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M2,22 Q7,26 12,22" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M-6,35 Q0,29 6,35" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M-8,25 Q-12,33 -8,35" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                    </g>
                  ) : (
                    <g className="mom-happy-face">
                      <circle cx="-7" cy="22" r="3" fill="#000" />
                      <circle cx="7" cy="22" r="3" fill="#000" />
                      <path d="M-6,32 Q0,40 6,32" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Mom Arms */}
                  {scene === 'GIFT_DOLL' && (
                    <g className="mom-holding-doll">
                      <path d="M-10,70 Q30,95 72,82" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="74" cy="82" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g className="mom-sad-arms">
                      <path d="M-15,70 Q0,88 12,78" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="12" cy="78" r="7" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g className="mom-holding-pack">
                      <path d="M-10,70 Q35,75 80,72" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="82" cy="72" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="mom-dancing-clapping">
                      {/* Rhythmic Indian Garba / Bhangra clapping */}
                      <path d="M-15,70 Q10,40 25,35" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="28" cy="33" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      <path d="M15,70 Q5,40 22,35" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              </g>

              {/* ===================================================================== */}
              {/* THE DOLL (GUDIYA): OFFERED, THROWN IN AIR, AND RESTING */}
              {/* ===================================================================== */}
              {scene === 'GIFT_DOLL' && (
                <g transform="translate(370, 200)" filter="url(#comicShadowBold)" className="doll-presented-gentle">
                  <path d="M-18,25 L18,25 L26,75 L-26,75 Z" fill="url(#dollGrad)" stroke="#000" strokeWidth="3.5" />
                  <ellipse cx="0" cy="45" rx="16" ry="5" fill="#FFFFFF" opacity="0.5" />
                  <circle cx="0" cy="5" r="22" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                  <circle cx="-24" cy="-5" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                  <circle cx="24" cy="-5" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                  <circle cx="-8" cy="4" r="4" fill="#000" />
                  <circle cx="8" cy="4" r="4" fill="#000" />
                  <path d="M-4,13 Q0,18 4,13" stroke="#E11D48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <rect x="-22" y="65" width="44" height="14" fill="#FFE600" stroke="#000" strokeWidth="2" />
                  <text x="0" y="75" textAnchor="middle" fontSize="9" fontWeight="900" fill="#000">DOLL 🧸</text>
                </g>
              )}

              {scene === 'YEET_DOLL' && (
                <g className="doll-flying-trajectory">
                  {/* Action Motion Streaks */}
                  <g stroke="#FFE600" strokeWidth="4" strokeLinecap="round" opacity="0.85">
                    <line x1="620" y1="180" x2="480" y2="230" strokeDasharray="16 8" />
                    <line x1="600" y1="130" x2="420" y2="160" strokeDasharray="20 10" />
                  </g>

                  {/* Comic YEET Explosion Badge */}
                  <g transform="translate(540, 120) rotate(-14)" filter="url(#comicShadowBold)">
                    <polygon points="0,-22 26,-8 48,-26 36,8 65,22 32,26 22,48 0,26 -26,40 -18,14 -48,-8 -18,-14" fill="#FF3131" stroke="#000" strokeWidth="3.5" />
                    <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="18" fontStyle="italic">YEET!!</text>
                  </g>

                  {/* Spinning Doll crashing to floor */}
                  <g className="animate-spinToFloor">
                    <g transform="translate(420, 290) rotate(110)" filter="url(#comicShadowBold)">
                      <path d="M-18,25 L18,25 L26,75 L-26,75 Z" fill="url(#dollGrad)" stroke="#000" strokeWidth="3.5" />
                      <circle cx="0" cy="5" r="22" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                      <circle cx="-8" cy="4" r="4" fill="#000" />
                      <circle cx="8" cy="4" r="4" fill="#000" />
                    </g>
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* SAMPLESWALA SAMPLES CRATE & VAULT PACK (OFFICIAL PRODUCT) */}
              {/* ===================================================================== */}
              {(scene === 'REVEAL_PACK' || scene === 'DANCE_PARTY') && (
                <g className="sampleswala-pack-center animate-popBounce" transform="translate(435, 140)">
                  {/* Huge Radiating Golden & Neon Aura */}
                  <circle cx="80" cy="110" r="140" fill="#FFE600" opacity={scene === 'DANCE_PARTY' ? '0.22' : '0.45'} className="animate-pulse" />

                  {/* Studio Pedestal / Table */}
                  <rect x="0" y="100" width="160" height="75" rx="3" fill="#18181E" stroke="#000" strokeWidth="5" filter="url(#comicShadowBold)" />
                  <rect x="15" y="175" width="14" height="45" fill="#0A0A0E" stroke="#000" strokeWidth="3" />
                  <rect x="131" y="175" width="14" height="45" fill="#0A0A0E" stroke="#000" strokeWidth="3" />
                  <line x1="20" y1="195" x2="140" y2="195" stroke="#FFE600" strokeWidth="4" />

                  {/* SAMPLESWALA GOLD SOUND VAULT BOX */}
                  <g transform="translate(10, 20)" filter="url(#comicShadowBold)">
                    <rect x="0" y="0" width="140" height="90" rx="4" fill="url(#goldPackGrad)" stroke="#000" strokeWidth="4" />
                    
                    {/* Header Strip */}
                    <rect x="8" y="8" width="124" height="18" fill="#000000" stroke="#FFE600" strokeWidth="2" />
                    <text x="70" y="21" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFE600" letterSpacing="1.5">SAMPLESWALA</text>

                    {/* Artwork Window */}
                    <rect x="8" y="30" width="124" height="38" fill="#121216" stroke="#000" strokeWidth="2" />
                    
                    {/* Waveform graphic inside artwork */}
                    <g stroke="#00FF94" strokeWidth="2" strokeLinecap="round">
                      <line x1="16" y1="49" x2="16" y2="49" strokeWidth="4" />
                      <line x1="26" y1="42" x2="26" y2="56" />
                      <line x1="36" y1="36" x2="36" y2="62" />
                      <line x1="46" y1="40" x2="46" y2="58" />
                      <line x1="56" y1="46" x2="56" y2="52" />
                      <line x1="66" y1="34" x2="66" y2="64" stroke="#FFE600" strokeWidth="2.5" />
                      <line x1="76" y1="40" x2="76" y2="58" stroke="#FFE600" />
                      <line x1="86" y1="45" x2="86" y2="53" />
                      <line x1="96" y1="38" x2="96" y2="60" />
                      <line x1="106" y1="43" x2="106" y2="55" />
                      <line x1="116" y1="47" x2="116" y2="51" />
                    </g>

                    {/* Bottom Specification Badge */}
                    <rect x="8" y="72" width="124" height="12" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                    <text x="70" y="81" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#000" letterSpacing="0.8">
                      INDIAN SAMPLES • 24-BIT WAV
                    </text>

                    {/* Gold Vinyl Record Peeking Out Behind Box */}
                    <g transform="translate(115, -15)">
                      <circle cx="25" cy="25" r="24" fill="#18181B" stroke="#000" strokeWidth="3" />
                      <circle cx="25" cy="25" r="16" fill="none" stroke="#333" strokeWidth="1" />
                      <circle cx="25" cy="25" r="8" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                      <circle cx="25" cy="25" r="2.5" fill="#000" />
                    </g>
                  </g>

                  {/* Left & Right Studio Boom Monitors (Speakers) */}
                  <g transform="translate(-55, 15)" filter="url(#comicShadowBold)">
                    <rect x="0" y="0" width="40" height="90" rx="3" fill="#1C1C22" stroke="#000" strokeWidth="4" />
                    <circle cx="20" cy="26" r="12" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="20" cy="26" r={scene === 'DANCE_PARTY' ? '8' : '6'} fill="#FFE600" />
                    <circle cx="20" cy="65" r="17" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="20" cy="65" r={scene === 'DANCE_PARTY' ? '12' : '9.5'} fill="#00FF94" />
                    {scene === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3" fill="none" strokeLinecap="round">
                        <path d="M-8,18 Q-22,28 -8,38" className="animate-pulse" />
                        <path d="M-14,8 Q-32,28 -14,48" className="animate-pulse" />
                      </g>
                    )}
                  </g>

                  <g transform="translate(175, 15)" filter="url(#comicShadowBold)">
                    <rect x="0" y="0" width="40" height="90" rx="3" fill="#1C1C22" stroke="#000" strokeWidth="4" />
                    <circle cx="20" cy="26" r="12" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="20" cy="26" r={scene === 'DANCE_PARTY' ? '8' : '6'} fill="#FFE600" />
                    <circle cx="20" cy="65" r="17" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="20" cy="65" r={scene === 'DANCE_PARTY' ? '12' : '9.5'} fill="#00FF94" />
                    {scene === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3" fill="none" strokeLinecap="round">
                        <path d="M48,18 Q62,28 48,38" className="animate-pulse" />
                        <path d="M54,8 Q72,28 54,48" className="animate-pulse" />
                      </g>
                    )}
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* THE KID (YOUNG PRODUCER): RIGHT SIDE (x ~ 740, y ~ 120) */}
              {/* ===================================================================== */}
              <g 
                transform="translate(745, 120)" 
                filter="url(#comicShadowBold)"
                className={`kid-actor ${scene === 'DANCE_PARTY' ? 'kid-breakdance-body' : 'character-breathe'}`}
              >
                {/* Floor Shadow */}
                <ellipse cx="0" cy="210" rx="34" ry="8" fill="#000" opacity="0.5" />

                {/* Legs & Sneakers */}
                <g className={scene === 'DANCE_PARTY' ? 'kid-dancing-legs' : ''}>
                  <path d="M-14,140 L-18,195" stroke="#18181B" strokeWidth="15" strokeLinecap="round" />
                  <path d="M-34,195 L-8,195 L-6,206 L-36,206 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                  <rect x="-36" y="203" width="28" height="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />

                  <path d="M14,140 L18,195" stroke="#18181B" strokeWidth="15" strokeLinecap="round" />
                  <path d="M8,195 L34,195 L36,206 L6,206 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                  <rect x="6" y="203" width="28" height="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />
                </g>

                {/* Hoodie Torso */}
                <path d="M-32,65 L32,65 L40,145 L-40,145 Z" fill="#FF3131" stroke="#000" strokeWidth="4.5" />
                <path d="M-22,112 L22,112 L18,142 L-18,142 Z" fill="#C51D1D" stroke="#000" strokeWidth="3" />
                <rect x="-18" y="80" width="36" height="15" fill="#000" stroke="#FFE600" strokeWidth="2" />
                <text x="0" y="90" textAnchor="middle" fontSize="7" fontWeight="900" fill="#FFE600">SAMPLESWALA</text>

                {/* Arms (Action state) */}
                {scene === 'GIFT_DOLL' && (
                  <g className="kid-arms-reject">
                    <path d="M-28,75 L-65,75" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                    <circle cx="-68" cy="75" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                  </g>
                )}
                {scene === 'YEET_DOLL' && (
                  <g className="kid-arms-yeet">
                    <path d="M-28,75 L-80,105" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                    <circle cx="-83" cy="108" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                  </g>
                )}
                {scene === 'REVEAL_PACK' && (
                  <g className="kid-arms-excited-stars">
                    <path d="M-30,75 Q-42,38 -28,24" stroke="#FF3131" strokeWidth="13" strokeLinecap="round" />
                    <circle cx="-28" cy="24" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    <path d="M30,75 Q42,38 28,24" stroke="#FF3131" strokeWidth="13" strokeLinecap="round" />
                    <circle cx="28" cy="24" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                  </g>
                )}
                {scene === 'DANCE_PARTY' && (
                  <g className="kid-dancing-arms">
                    {/* Left arm waving up in the beat */}
                    <g className="kid-left-arm-wave">
                      <path d="M-30,75 Q-65,45 -55,8" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-53" cy="6" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <text x="-55" y="-5" fontSize="18">🔥</text>
                    </g>
                    {/* Right arm grooving / finger drumming */}
                    <g className="kid-right-arm-drum">
                      <path d="M30,75 Q-15,95 -60,115" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-63" cy="118" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  </g>
                )}

                {/* Head, Face, Cap */}
                <g className={`kid-head-group ${scene === 'DANCE_PARTY' ? 'kid-head-bob' : ''}`}>
                  <circle cx="0" cy="25" r="28" fill="#F8CBA6" stroke="#000" strokeWidth="4" />
                  <path d="M-30,20 Q0,-18 30,20 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                  <path d="M-26,18 Q-42,12 -38,24 Q-22,25 -26,18" fill="#FFE600" stroke="#000" strokeWidth="3" />
                  <circle cx="0" cy="2" r="3.5" fill="#000" />

                  {/* Face Expression */}
                  {scene === 'GIFT_DOLL' && (
                    <g className="face-disgusted">
                      <line x1="-16" y1="16" x2="-4" y2="20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="4" y1="20" x2="16" y2="16" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="-15" y1="24" x2="-5" y2="24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <line x1="5" y1="24" x2="15" y2="24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M-7,38 Q0,32 7,37" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g className="face-shouting">
                      <line x1="-17" y1="14" x2="-4" y2="22" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <line x1="4" y1="22" x2="17" y2="14" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M-15,24 L-5,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M5,24 L15,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <ellipse cx="0" cy="38" rx="9" ry="7" fill="#B91C1C" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g className="face-star-eyes">
                      <g transform="translate(-10, 22) scale(0.9)">
                        <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#FFE600" stroke="#000" strokeWidth="2" />
                      </g>
                      <g transform="translate(10, 22) scale(0.9)">
                        <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#FFE600" stroke="#000" strokeWidth="2" />
                      </g>
                      <path d="M-10,34 Q0,48 10,34 Z" fill="#000" stroke="#000" strokeWidth="2.5" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="face-shades-cool">
                      <polygon points="-26,16 -4,16 -7,32 -23,32" fill="#000" stroke="#00FF94" strokeWidth="2.5" />
                      <polygon points="4,16 26,16 23,32 7,32" fill="#000" stroke="#00FF94" strokeWidth="2.5" />
                      <line x1="-4" y1="20" x2="4" y2="20" stroke="#00FF94" strokeWidth="3" />
                      <line x1="-20" y1="20" x2="-14" y2="28" stroke="#FFF" strokeWidth="2.5" />
                      <line x1="10" y1="20" x2="16" y2="28" stroke="#FFF" strokeWidth="2.5" />
                      <path d="M-6,40 Q0,46 10,36" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Over-Ear Headphones (Reveal & Dance) */}
                  {(scene === 'REVEAL_PACK' || scene === 'DANCE_PARTY') && (
                    <g className="kid-headphones">
                      <path d="M-30,22 Q0,-26 30,22" stroke="#18181B" strokeWidth="8" fill="none" strokeLinecap="round" />
                      <path d="M-30,22 Q0,-26 30,22" stroke="#00FF94" strokeWidth="2.5" fill="none" />
                      <rect x="-37" y="10" width="12" height="30" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
                      <rect x="25" y="10" width="12" height="30" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                </g>
              </g>

              {/* FLOATING MUSIC NOTES (DANCE PARTY) */}
              {scene === 'DANCE_PARTY' && (
                <g className="floating-musical-notes" fontWeight="900" fontSize="30" filter="url(#comicShadowBold)">
                  <text x="630" y="70" fill="#00FF94" className="note-float-1">♪</text>
                  <text x="790" y="55" fill="#FFE600" className="note-float-2">♫</text>
                  <text x="560" y="125" fill="#FF0080" className="note-float-3">♬</text>
                  <text x="860" y="95" fill="#00FF94" className="note-float-4">♩</text>
                  <text x="700" y="35" fill="#FFE600" className="note-float-5">⚡</text>
                  <text x="360" y="60" fill="#FFE600" className="note-float-1">♪</text>
                  <text x="210" y="45" fill="#00FF94" className="note-float-3">♫</text>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Interactive Scene Pills (100% English) */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 bg-black/95 border-t-4 border-black z-30">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 mr-1 hidden md:inline">
              Story Chapter:
            </span>
            <button
              onClick={() => { setScene('GIFT_DOLL'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                scene === 'GIFT_DOLL' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              1. The Doll 🧸
            </button>
            <button
              onClick={() => { setScene('YEET_DOLL'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                scene === 'YEET_DOLL' ? 'bg-[#FF3131] text-white shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              2. The Yeet! 💥
            </button>
            <button
              onClick={() => { setScene('REVEAL_PACK'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                scene === 'REVEAL_PACK' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              3. SamplesWala Reveal ✨
            </button>
            <button
              onClick={() => { setScene('DANCE_PARTY'); setIsPaused(false); }}
              className={`px-3.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                scene === 'DANCE_PARTY' ? 'bg-[#00FF94] text-black shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              4. Family Dance Party! 🕺💃🔥
            </button>
          </div>
        </div>
      )}

      {/* Embedded Fluid 60 FPS CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Continuous Subtle Character Breathing (Never Freeze!) */
        @keyframes subtleBreathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        .character-breathe {
          animation: subtleBreathe 2s ease-in-out infinite;
        }

        /* Dad & Mom Sad Droop */
        @keyframes sadDroop {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(5px) rotate(-1.5deg); }
        }
        .dad-sad-droop {
          animation: sadDroop 1.8s ease-in-out infinite;
        }
        .mom-sad-droop {
          animation: sadDroop 1.8s ease-in-out infinite 0.2s;
        }

        /* Doll Flying Arc */
        @keyframes spinToFloor {
          0% { transform: translate(620px, 150px) rotate(0deg) scale(1); opacity: 1; }
          40% { transform: translate(500px, 70px) rotate(-240deg) scale(0.95); opacity: 0.95; }
          80% { transform: translate(430px, 280px) rotate(-480deg) scale(0.9); opacity: 0.9; }
          100% { transform: translate(420px, 275px) rotate(-510deg) scale(0.85); opacity: 0.85; }
        }
        .animate-spinToFloor {
          animation: spinToFloor 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* SamplesWala Pack Pop & Float */
        @keyframes popBounce {
          0% { transform: translate(435px, 180px) scale(0.65); opacity: 0; }
          70% { transform: translate(435px, 135px) scale(1.06); opacity: 1; }
          100% { transform: translate(435px, 140px) scale(1); opacity: 1; }
        }
        .animate-popBounce {
          animation: popBounce 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* ======================================================= */
        /* FAMILY DANCE PARTY (EVERYONE GROOVES CONTINUOUSLY!)     */
        /* ======================================================= */
        
        /* 1. Kid Breakdance / Groove */
        @keyframes kidBreakdance {
          0% { transform: translate(745px, 120px) rotate(0deg); }
          25% { transform: translate(745px, 110px) rotate(-4deg); }
          50% { transform: translate(745px, 122px) rotate(0deg); }
          75% { transform: translate(745px, 112px) rotate(4deg); }
          100% { transform: translate(745px, 120px) rotate(0deg); }
        }
        .kid-breakdance-body {
          animation: kidBreakdance 0.56s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes kidHeadNod {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(5px) rotate(2deg); }
        }
        .kid-head-bob {
          animation: kidHeadNod 0.28s ease-in-out infinite;
        }
        @keyframes kidArmPump {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-24deg); }
          100% { transform: rotate(0deg); }
        }
        .kid-left-arm-wave {
          animation: kidArmPump 0.56s ease-in-out infinite;
          transform-origin: -30px 75px;
        }
        @keyframes kidDrumTap {
          0% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(0px); }
        }
        .kid-right-arm-drum {
          animation: kidDrumTap 0.28s ease-in-out infinite;
        }

        /* 2. Dad Dancing Groove (Raising the roof / shoulder bounce) */
        @keyframes dadGroove {
          0% { transform: translate(180px, 110px) rotate(0deg); }
          25% { transform: translate(180px, 104px) rotate(3deg); }
          50% { transform: translate(180px, 110px) rotate(0deg); }
          75% { transform: translate(180px, 104px) rotate(-3deg); }
          100% { transform: translate(180px, 110px) rotate(0deg); }
        }
        .dad-dancing-body {
          animation: dadGroove 0.56s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes dadRoofPump {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .dad-dancing-arms {
          animation: dadRoofPump 0.28s ease-in-out infinite;
        }

        /* 3. Mom Dancing Sway & Clapping */
        @keyframes momSway {
          0% { transform: translate(265px, 125px) rotate(0deg); }
          25% { transform: translate(265px, 120px) rotate(-3deg); }
          50% { transform: translate(265px, 125px) rotate(0deg); }
          75% { transform: translate(265px, 120px) rotate(3deg); }
          100% { transform: translate(265px, 125px) rotate(0deg); }
        }
        .mom-dancing-body {
          animation: momSway 0.56s ease-in-out infinite 0.1s;
          transform-origin: bottom center;
        }
        @keyframes momClapSync {
          0% { transform: scale(1); }
          50% { transform: scale(1.08) translateY(-3px); }
          100% { transform: scale(1); }
        }
        .mom-dancing-clapping {
          animation: momClapSync 0.28s ease-in-out infinite;
          transform-origin: 28px 33px;
        }

        /* Floating Musical Beat Notes */
        @keyframes noteFloatUp {
          0% { transform: translateY(0px) scale(0.7); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-45px) scale(1.2); opacity: 0; }
        }
        .note-float-1 { animation: noteFloatUp 1.3s ease-out infinite 0.1s; }
        .note-float-2 { animation: noteFloatUp 1.5s ease-out infinite 0.3s; }
        .note-float-3 { animation: noteFloatUp 1.4s ease-out infinite 0.6s; }
        .note-float-4 { animation: noteFloatUp 1.6s ease-out infinite 0.2s; }
        .note-float-5 { animation: noteFloatUp 1.2s ease-out infinite 0.5s; }

        .doll-presented-gentle {
          animation: subtleBreathe 1.8s ease-in-out infinite;
        }
        `
      }} />
    </div>
  )
}
