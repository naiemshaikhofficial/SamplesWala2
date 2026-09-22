'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, RotateCcw, Sparkles, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react'

// ============================================================================
// PURE BROWSER SYNTHESIZER FOR SAMPLESWALA INDIAN BEAT GROOVE
// Zero external audio files, 0 network bandwidth, lightweight Web Audio API
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

    osc.frequency.setValueAtTime(145, time)
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.38)
    gain.gain.setValueAtTime(0.85, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.38)

    osc.start(time)
    osc.stop(time + 0.38)
  }

  private playTablaSlap(time: number) {
    if (!this.ctx) return
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1900, time)
    filter.Q.setValueAtTime(3.2, time)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.45, time)
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
    osc.frequency.setValueAtTime(9500, time)
    gain.gain.setValueAtTime(0.09, time)
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
    filter.frequency.setValueAtTime(950, time)
    filter.frequency.exponentialRampToValueAtTime(2800, time + 0.15)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    gain.gain.setValueAtTime(0.2, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25)

    osc.start(time)
    osc.stop(time + 0.26)
  }

  private scheduleNext() {
    if (!this.isPlaying || !this.ctx) return
    const now = this.ctx.currentTime + 0.04
    const s = this.step % 16

    // 108 BPM Indian street rhythm
    if (s === 0 || s === 6 || s === 10) this.playDholakBass(now)
    if (s === 4 || s === 12) this.playTablaSlap(now)
    if (s % 2 === 0) this.playHat(now)

    const melody = [220, 246.9, 277.2, 329.6, 370.0, 440.0, 370.0, 329.6]
    if (s % 2 === 0) {
      this.playDesiFluteSynth(melody[(s / 2) % melody.length], now)
    }

    this.step++
    this.timer = window.setTimeout(() => this.scheduleNext(), 140)
  }
}

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

  // Continuous, smooth story progression
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
        transitionTo('YEET_DOLL', 4200)
        break
      case 'YEET_DOLL':
        transitionTo('REVEAL_PACK', 4600)
        break
      case 'REVEAL_PACK':
        transitionTo('DANCE_PARTY', 4400)
        break
      case 'DANCE_PARTY':
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
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-studio-yellow rounded-full animate-ping border border-black" />
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-white italic flex items-center gap-2">
            Producer Origin: <span className="text-studio-neon">"Born for SamplesWala"</span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-studio-yellow text-black text-[9px] font-black uppercase not-italic rounded-xs">
              ORIGINAL STORY
            </span>
          </h3>
        </div>

        {/* Minimal Progress Step Indicators */}
        <div className="hidden lg:flex items-center gap-1.5">
          {(['GIFT_DOLL', 'YEET_DOLL', 'REVEAL_PACK', 'DANCE_PARTY'] as StoryScene[]).map((s, idx) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                scene === s 
                  ? 'w-10 bg-studio-yellow' 
                  : idx < ['GIFT_DOLL', 'YEET_DOLL', 'REVEAL_PACK', 'DANCE_PARTY'].indexOf(scene)
                    ? 'w-4 bg-[#00FF94]'
                    : 'w-4 bg-zinc-800'
              }`}
            />
          ))}
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

      {/* Main Animated Stage - Clean, Tall, Highly Detailed */}
      {!isCollapsed && (
        <div className="relative w-full h-[390px] sm:h-[450px] md:h-[490px] bg-gradient-to-b from-[#161622] via-[#0d0d14] to-[#040407] flex flex-col justify-between overflow-hidden">
          
          {/* Halftone Comic Ambient Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Dynamic Laser Spotlights in Dance Party */}
          {scene === 'DANCE_PARTY' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute -top-20 left-1/4 w-36 h-[600px] bg-gradient-to-b from-[#00FF94] to-transparent rotate-25 blur-sm animate-pulse" />
              <div className="absolute -top-20 right-1/4 w-36 h-[600px] bg-gradient-to-b from-[#FFE600] to-transparent -rotate-25 blur-sm animate-pulse delay-300" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-52 h-[650px] bg-gradient-to-b from-[#FF0080] to-transparent blur-md animate-pulse delay-500" />
            </div>
          )}

          {/* High-End Comic Narrative Speech Banner */}
          <div className="relative z-30 pt-3 flex justify-center px-4 pointer-events-none">
            <div className="max-w-3xl px-6 py-2.5 bg-black border-3 border-black rounded-sm shadow-[6px_6px_0px_#FFE600] flex items-center gap-3 transition-all duration-300">
              <Sparkles size={16} className="text-studio-yellow animate-spin flex-shrink-0" />
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-white italic text-center leading-relaxed">
                {scene === 'GIFT_DOLL' && "Parents: 'Surprise Beta! Here is a lovely cute doll for you! 🧸✨' | Kid: 'Wait... what is this?! 🤨'"}
                {scene === 'YEET_DOLL' && "Kid: 'A DOLL?! NO WAY! I'M A PRODUCER, I NEED BEATS!' *YEET!* 💥 | Doll: 'MUJHE KYU TODA?! 😭💔'"}
                {scene === 'REVEAL_PACK' && "Parents: 'Wait... He doesn't want toys! He was born for music! SAMPLESWALA SAMPLES ARE HERE!' ✨🎧"}
                {scene === 'DANCE_PARTY' && "All: 'BOOM!! SAMPLESWALA SAMPLES CHANGED THE GAME! EVEN THE DOLL IS GROOVING!!' 🕺💃🔥🎧"}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DETAILED SVG ANIMATION VIEWPORT (1000 x 400) - EXTREME VECTOR ARTWORK */}
          {/* ========================================================================= */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            <svg
              viewBox="0 0 1000 400"
              className="w-full h-full max-w-5xl mx-auto overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="comicShadowBold" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                </filter>
                <filter id="neonGlowYellow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Multi-stop Luxury Gradients */}
                <linearGradient id="goldPackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFCE6" />
                  <stop offset="25%" stopColor="#FFE600" />
                  <stop offset="65%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="kidHoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF4A4A" />
                  <stop offset="60%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#9F1239" />
                </linearGradient>
                <linearGradient id="dadSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="60%" stopColor="#1D4ED8" />
                  <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="momSareeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="55%" stopColor="#BE123C" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>
                <linearGradient id="dollDressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF5BA7" />
                  <stop offset="65%" stopColor="#FF1493" />
                  <stop offset="100%" stopColor="#C71585" />
                </linearGradient>
                <linearGradient id="tearGeyserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#BAE6FD" />
                  <stop offset="60%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id="speakerKevlarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2A2A35" />
                  <stop offset="50%" stopColor="#14141A" />
                  <stop offset="100%" stopColor="#050508" />
                </linearGradient>
              </defs>

              {/* STAGE FLOOR & RUNWAY MARKINGS */}
              <g className="stage-floor">
                {/* Deep Ground Shadow */}
                <ellipse cx="500" cy="354" rx="460" ry="16" fill="#000000" opacity="0.6" />
                {/* Thick Comic Base Line */}
                <line x1="20" y1="350" x2="980" y2="350" stroke="#000000" strokeWidth="9" strokeLinecap="round" />
                {/* High-Contrast Neon Caution Stripes */}
                <line x1="50" y1="358" x2="950" y2="358" stroke="#FFE600" strokeWidth="3" strokeDasharray="16 8" />
              </g>

              {/* ===================================================================== */}
              {/* DAD: ULTRA-DETAILED FATHER CHARACTER */}
              {/* ===================================================================== */}
              <g transform={
                scene === 'GIFT_DOLL' ? 'translate(170, 135)' :
                scene === 'YEET_DOLL' ? 'translate(90, 135)' :
                scene === 'REVEAL_PACK' ? 'translate(150, 135)' :
                'translate(190, 135)'
              }>
                <g 
                  filter="url(#comicShadowBold)" 
                  className={scene === 'DANCE_PARTY' ? 'dad-dance-inner' : scene === 'YEET_DOLL' ? 'dad-shocked-inner' : 'character-breathe'}
                >
                  <ellipse cx="0" cy="220" rx="32" ry="8" fill="#000" opacity="0.5" />

                  {/* Dad Trousers & Dress Shoes with Soles */}
                  <g className={scene === 'DANCE_PARTY' ? 'dad-legs-step' : ''}>
                    <path d="M-14,140 L-17,215" stroke="#1E293B" strokeWidth="17" strokeLinecap="round" />
                    <path d="M14,140 L17,215" stroke="#1E293B" strokeWidth="17" strokeLinecap="round" />
                    {/* Left Shoe */}
                    <path d="M-32,213 L-4,213 L-2,223 L-34,223 Z" fill="#334155" stroke="#000" strokeWidth="3.5" />
                    <rect x="-34" y="221" width="32" height="3" fill="#111" />
                    {/* Right Shoe */}
                    <path d="M4,213 L32,213 L34,223 L2,223 Z" fill="#334155" stroke="#000" strokeWidth="3.5" />
                    <rect x="2" y="221" width="32" height="3" fill="#111" />
                  </g>

                  {/* Dad Formal Shirt & Cardigan Vest */}
                  <path d="M-28,58 L28,58 L33,145 L-33,145 Z" fill="url(#dadSuitGrad)" stroke="#000" strokeWidth="4.5" />
                  {/* Yellow Tie with knot */}
                  <polygon points="0,60 -10,75 0,115 10,75" fill="#FFE600" stroke="#000" strokeWidth="2.5" />
                  <polygon points="-5,60 5,60 3,68 -3,68" fill="#D97706" stroke="#000" strokeWidth="1.5" />
                  {/* White Shirt Collar */}
                  <polygon points="-14,58 0,72 14,58 0,64" fill="#FFF" stroke="#000" strokeWidth="2" />
                  {/* Pocket Square */}
                  <rect x="-26" y="80" width="12" height="4" fill="#FFE600" stroke="#000" strokeWidth="1" />

                  {/* Dad Head, Hair, Spectacles & Mustache */}
                  <circle cx="0" cy="20" r="26" fill="#F8CBA6" stroke="#000" strokeWidth="4" />
                  {/* Combed Hair with Side Parting */}
                  <path d="M-28,15 Q-15,-18 20,4 Q28,14 26,20 Q14,0 -28,15 Z" fill="#1E293B" stroke="#000" strokeWidth="3" />
                  <path d="M-27,10 Q-15,-6 10,8" stroke="#475569" strokeWidth="2" fill="none" />
                  {/* Horn-Rimmed Glasses with White Lens Glint */}
                  <rect x="-19" y="11" width="15" height="11" rx="2.5" fill="#FFFFFF" fillOpacity="0.25" stroke="#000" strokeWidth="3.5" />
                  <rect x="4" y="11" width="15" height="11" rx="2.5" fill="#FFFFFF" fillOpacity="0.25" stroke="#000" strokeWidth="3.5" />
                  <line x1="-4" y1="16" x2="4" y2="16" stroke="#000" strokeWidth="3.5" />
                  <line x1="-16" y1="13" x2="-8" y2="13" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7" y1="13" x2="15" y2="13" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

                  {/* Dad Stylish Mustache */}
                  <path d="M-12,30 Q-5,25 0,28 Q5,25 12,30 Q0,37 -12,30 Z" fill="#0F172A" stroke="#000" strokeWidth="1.5" />

                  {/* Dad Expressions */}
                  {scene === 'YEET_DOLL' ? (
                    <g>
                      {/* Wide-Open Shouting Mouth */}
                      <ellipse cx="0" cy="36" rx="8" ry="11" fill="#000" stroke="#000" strokeWidth="2.5" />
                      <ellipse cx="0" cy="40" rx="5" ry="4" fill="#B91C1C" />
                      {/* Shocked Eyebrows */}
                      <line x1="-18" y1="5" x2="-5" y2="11" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <line x1="5" y1="11" x2="18" y2="5" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      {/* Giant Comic Blue Sweat Drop */}
                      <path d="M22,6 C22,2 29,-4 29,-4 C29,-4 36,2 36,6 C36,11 30,14 26,12 Z" fill="#38BDF8" stroke="#000" strokeWidth="2" />
                      <text x="0" y="-14" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFE600">"BETA NOOO!!"</text>
                    </g>
                  ) : (
                    <g>
                      <line x1="-16" y1="9" x2="-4" y2="7" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="4" y1="7" x2="16" y2="9" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M-7,34 Q0,43 7,34" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Dad Arms per Scene */}
                  {scene === 'GIFT_DOLL' && (
                    <g>
                      {/* Presenting Doll with both hands */}
                      <path d="M22,70 Q60,86 94,80" stroke="#1D4ED8" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="96" cy="79" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g>
                      {/* Both hands holding head in classic comic shock */}
                      <path d="M-26,70 Q-44,24 -24,10" stroke="#1D4ED8" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="-22" cy="10" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      <path d="M26,70 Q44,24 24,10" stroke="#1D4ED8" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="22" cy="10" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g>
                      <path d="M22,70 Q65,65 98,65" stroke="#1D4ED8" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="100" cy="65" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      {/* Apple Watch on wrist */}
                      <rect x="80" y="60" width="8" height="10" rx="2" fill="#000" stroke="#FFE600" strokeWidth="1.5" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="dad-arms-dance-pump">
                      <path d="M-26,70 Q-58,28 -42,2" stroke="#1D4ED8" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="-40" cy="0" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      <path d="M26,70 Q58,28 42,2" stroke="#1D4ED8" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="40" cy="0" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                    </g>
                  )}
                </g>
              </g>

              {/* ===================================================================== */}
              {/* MOM: ULTRA-DETAILED MOTHER IN BANARASI SILK SAREE */}
              {/* ===================================================================== */}
              <g transform={
                scene === 'GIFT_DOLL' ? 'translate(280, 145)' :
                scene === 'YEET_DOLL' ? 'translate(790, 145)' :
                scene === 'REVEAL_PACK' ? 'translate(260, 145)' :
                'translate(810, 145)'
              }>
                <g 
                  filter="url(#comicShadowBold)" 
                  className={scene === 'DANCE_PARTY' ? 'mom-dance-inner' : scene === 'YEET_DOLL' ? 'mom-shocked-inner' : 'character-breathe'}
                >
                  <ellipse cx="0" cy="205" rx="30" ry="7" fill="#000" opacity="0.5" />

                  {/* Flowing Silk Saree with Golden Zari Border */}
                  <path d="M-24,65 L24,65 L38,200 L-38,200 Z" fill="url(#momSareeGrad)" stroke="#000" strokeWidth="4.5" />
                  {/* Saree Pallu Drape across shoulder */}
                  <path d="M-24,65 Q2,115 -28,180 L-38,180 Q-8,105 -26,65 Z" fill="#F59E0B" stroke="#000" strokeWidth="3" />
                  {/* Decorative Golden Border Patterns */}
                  <line x1="-36" y1="195" x2="36" y2="195" stroke="#FFE600" strokeWidth="4" />
                  <line x1="-34" y1="191" x2="34" y2="191" stroke="#000" strokeWidth="1.5" strokeDasharray="4 3" />

                  {/* Mom Head, Bun with Floral Gajra, Bindi & Dangler Earrings */}
                  <circle cx="0" cy="22" r="23" fill="#F8CBA6" stroke="#000" strokeWidth="4" />
                  {/* Black Hair Bun with White Jasmine Gajra Garland */}
                  <circle cx="0" cy="2" r="18" fill="#18181B" stroke="#000" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="15" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="5 3" />
                  <circle cx="19" cy="12" r="10" fill="#18181B" />
                  <circle cx="-19" cy="12" r="10" fill="#18181B" />
                  {/* Traditional Red Bindi */}
                  <circle cx="0" cy="15" r="3" fill="#E11D48" />

                  {/* Gold Jhumka Dangler Earrings */}
                  <g transform="translate(-21, 28)">
                    <circle cx="0" cy="0" r="2" fill="#FFE600" />
                    <polygon points="-4,3 4,3 0,8" fill="#FFE600" stroke="#000" strokeWidth="1" />
                  </g>
                  <g transform="translate(21, 28)">
                    <circle cx="0" cy="0" r="2" fill="#FFE600" />
                    <polygon points="-4,3 4,3 0,8" fill="#FFE600" stroke="#000" strokeWidth="1" />
                  </g>

                  {/* Mom Facial Expressions */}
                  {scene === 'YEET_DOLL' ? (
                    <g>
                      <circle cx="-7" cy="21" r="3.5" fill="#000" />
                      <circle cx="7" cy="21" r="3.5" fill="#000" />
                      <ellipse cx="0" cy="33" rx="5.5" ry="7" fill="#000" />
                      <text x="0" y="-14" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FF0080">"HAI BHAGWAN! 😱"</text>
                    </g>
                  ) : (
                    <g>
                      <circle cx="-7" cy="22" r="3" fill="#000" />
                      <circle cx="7" cy="22" r="3" fill="#000" />
                      <path d="M-6,32 Q0,40 6,32" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Mom Arms with Gold Bangles */}
                  {scene === 'GIFT_DOLL' && (
                    <g>
                      <path d="M-10,70 Q35,95 78,82" stroke="#BE123C" strokeWidth="13" strokeLinecap="round" />
                      {/* Gold Bangles */}
                      <line x1="64" y1="84" x2="67" y2="78" stroke="#FFE600" strokeWidth="3" />
                      <line x1="68" y1="85" x2="71" y2="79" stroke="#FFE600" strokeWidth="3" />
                      <circle cx="80" cy="82" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g>
                      {/* Hands clutching mouth in dramatic Indian mother gasp */}
                      <path d="M-22,70 Q-15,36 -4,27" stroke="#BE123C" strokeWidth="13" strokeLinecap="round" />
                      <circle cx="-3" cy="27" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      <path d="M22,70 Q15,36 4,27" stroke="#BE123C" strokeWidth="13" strokeLinecap="round" />
                      <circle cx="3" cy="27" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g>
                      <path d="M-10,70 Q35,75 82,72" stroke="#BE123C" strokeWidth="13" strokeLinecap="round" />
                      <circle cx="84" cy="72" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="mom-arms-clapping-sync">
                      <path d="M-15,70 Q-10,40 -26,34" stroke="#BE123C" strokeWidth="13" strokeLinecap="round" />
                      <circle cx="-29" cy="32" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      <path d="M15,70 Q-5,40 -23,34" stroke="#BE123C" strokeWidth="13" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              </g>

              {/* ===================================================================== */}
              {/* THE DOLL: PRESENTED, CRASHED & CRYING WATERFALLS ("MUJHE KYU TODA?!") */}
              {/* ===================================================================== */}
              {scene === 'GIFT_DOLL' && (
                <g transform="translate(405, 215)" filter="url(#comicShadowBold)">
                  <g className="character-breathe">
                    {/* Doll Dress with Frilly Lace Ruffles */}
                    <path d="M-20,25 L20,25 L28,78 L-28,78 Z" fill="url(#dollDressGrad)" stroke="#000" strokeWidth="3.5" />
                    <path d="M-28,76 Q-14,84 0,76 Q14,84 28,76" stroke="#FFF" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <circle cx="0" cy="46" r="4" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                    <circle cx="0" cy="58" r="4" fill="#FFE600" stroke="#000" strokeWidth="1.5" />

                    {/* Doll Head, Rosy Cheeks & Sparkly Anime Eyes */}
                    <circle cx="0" cy="5" r="23" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                    {/* Golden Ribbon Hair Bows */}
                    <polygon points="-24,-5 -36,-14 -36,4 -24,-5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <polygon points="24,-5 36,-14 36,4 24,-5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <circle cx="-22" cy="-5" r="5" fill="#F59E0B" stroke="#000" strokeWidth="2" />
                    <circle cx="22" cy="-5" r="5" fill="#F59E0B" stroke="#000" strokeWidth="2" />

                    {/* Cute Sparkly Eyes (✧‿✧) */}
                    <circle cx="-8" cy="4" r="5" fill="#000" />
                    <circle cx="-6" cy="2" r="2" fill="#FFF" />
                    <circle cx="8" cy="4" r="5" fill="#000" />
                    <circle cx="10" cy="2" r="2" fill="#FFF" />
                    {/* Blushing Airbrushed Cheeks */}
                    <ellipse cx="-13" cy="11" rx="5" ry="2.5" fill="#FF80BF" opacity="0.7" />
                    <ellipse cx="13" cy="11" rx="5" ry="2.5" fill="#FF80BF" opacity="0.7" />
                    <path d="M-4,13 Q0,18 4,13" stroke="#E11D48" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                    {/* Label Badge */}
                    <rect x="-26" y="65" width="52" height="15" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <text x="0" y="76" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#000">CUTE DOLL 🧸</text>
                  </g>
                </g>
              )}

              {/* SCENE 2: CRASHED DOLL CRYING WATERFALL TEARS ("MUJHE KYU TODA?!") */}
              {scene === 'YEET_DOLL' && (
                <g>
                  {/* Dynamic Action Yeet Speedlines Across Air */}
                  <g stroke="#FFE600" strokeWidth="4" strokeLinecap="round" opacity="0.95">
                    <line x1="500" y1="185" x2="350" y2="255" strokeDasharray="16 8" />
                    <line x1="470" y1="150" x2="280" y2="230" strokeDasharray="18 9" />
                    <line x1="520" y1="210" x2="380" y2="275" strokeDasharray="14 7" stroke="#FF3131" />
                  </g>

                  {/* Mid-Air YEET Comic Burst Explosion */}
                  <g transform="translate(360, 200) rotate(-15)" filter="url(#comicShadowBold)">
                    <polygon points="0,-26 30,-12 56,-30 42,10 74,26 38,30 26,56 0,30 -30,48 -22,18 -56,-10 -22,-18" fill="#FF3131" stroke="#000" strokeWidth="4.5" />
                    <polygon points="0,-18 20,-8 40,-20 30,8 55,20 28,22 18,40 0,22 -22,34 -16,12 -40,-8 -16,-12" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <text x="0" y="9" textAnchor="middle" fill="#000000" fontWeight="900" fontSize="20" fontStyle="italic">YEET!!</text>
                  </g>

                  {/* CRASHED & CRYING DOLL ON FLOOR AT (235, 295) */}
                  <g transform="translate(235, 295)">
                    {/* Comic Impact Dust Puffs & Cracked Ground */}
                    <path d="M-40,42 L-25,38 L-10,44 L15,39 L40,43" stroke="#000" strokeWidth="2.5" fill="none" />
                    <circle cx="-35" cy="30" r="10" fill="#FFFFFF" opacity="0.4" className="animate-ping" />
                    <circle cx="35" cy="30" r="10" fill="#FFFFFF" opacity="0.4" className="animate-ping delay-100" />

                    {/* Ripple Puddle of Tears on Floor */}
                    <ellipse cx="0" cy="38" rx="65" ry="14" fill="#38BDF8" opacity="0.65" className="tear-puddle-glow" />
                    <ellipse cx="0" cy="38" rx="42" ry="8" fill="#0284C7" opacity="0.5" />
                    <ellipse cx="0" cy="38" rx="20" ry="4" fill="#E0F2FE" opacity="0.7" />

                    <g filter="url(#comicShadowBold)" className="doll-crying-shake">
                      {/* Doll Body on floor */}
                      <path d="M-22,10 L22,10 L30,55 L-30,55 Z" fill="url(#dollDressGrad)" stroke="#000" strokeWidth="3.5" />
                      
                      {/* Doll Head with cracked Band-aid */}
                      <circle cx="0" cy="-12" r="24" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                      
                      {/* Pigtails */}
                      <circle cx="-26" cy="-22" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                      <circle cx="26" cy="-22" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />

                      {/* Weeping Crying Anime Eyes (><) */}
                      <path d="M-15,-15 L-6,-11 L-15,-7" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                      <path d="M15,-15 L6,-11 L15,-7" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                      
                      {/* Crying Wobbly Open Mouth */}
                      <ellipse cx="0" cy="1" rx="10" ry="8" fill="#B91C1C" stroke="#000" strokeWidth="2.5" />
                      <path d="M-7,-2 Q0,-5 7,-2" stroke="#FFE4D6" strokeWidth="2" fill="none" />

                      {/* ========================================================= */}
                      {/* EXTREME WATERFALL TEAR STREAMS SPRAYING FROM BOTH SIDES! */}
                      {/* ========================================================= */}
                      {/* Left Eye Waterfall Stream */}
                      <g className="tear-stream-left">
                        <path d="M-10,-10 C-32,-28 -56,-12 -72,16 C-80,30 -86,38 -92,42" stroke="url(#tearGeyserGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />
                        <circle cx="-48" cy="-8" r="5" fill="#38BDF8" className="tear-drop-1" />
                        <circle cx="-74" cy="24" r="6" fill="#0284C7" className="tear-drop-2" />
                        <circle cx="-94" cy="42" r="4.5" fill="#E0F2FE" className="tear-drop-3" />
                      </g>

                      {/* Right Eye Waterfall Stream */}
                      <g className="tear-stream-right">
                        <path d="M10,-10 C32,-28 56,-12 72,16 C80,30 86,38 92,42" stroke="url(#tearGeyserGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />
                        <circle cx="48" cy="-8" r="5" fill="#38BDF8" className="tear-drop-1" />
                        <circle cx="74" cy="24" r="6" fill="#0284C7" className="tear-drop-2" />
                        <circle cx="94" cy="42" r="4.5" fill="#E0F2FE" className="tear-drop-3" />
                      </g>

                      {/* Floating Broken Heart */}
                      <text x="0" y="-45" textAnchor="middle" fontSize="24" className="animate-bounce">💔</text>

                      {/* COMIC SPEECH BUBBLE: "MUJHE KYU TODA?! 😭💔" */}
                      <g transform="translate(0, -82)" filter="url(#comicShadowBold)">
                        <path d="M-115,-24 L115,-24 L115,18 L16,18 L0,34 L-12,18 L-115,18 Z" fill="#FFE600" stroke="#000" strokeWidth="4.5" />
                        <text x="0" y="-4" textAnchor="middle" fontSize="14" fontWeight="900" fill="#000" letterSpacing="0.8">
                          "MUJHE KYU TODA?! 😭💔"
                        </text>
                        <text x="0" y="12" textAnchor="middle" fontSize="9" fontWeight="900" fill="#B91C1C" letterSpacing="0.5">
                          WHY DID YOU YEET ME?!
                        </text>
                      </g>
                    </g>
                  </g>
                </g>
              )}

              {/* SCENE 3: SITTING IN CORNER WITH BANDAGE SNIFFLING */}
              {scene === 'REVEAL_PACK' && (
                <g transform="translate(90, 295)" filter="url(#comicShadowBold)">
                  <ellipse cx="0" cy="35" rx="25" ry="6" fill="#000" opacity="0.4" />
                  <path d="M-16,10 L16,10 L22,48 L-22,48 Z" fill="url(#dollDressGrad)" stroke="#000" strokeWidth="3" />
                  <circle cx="0" cy="-6" r="20" fill="#FFE4D6" stroke="#000" strokeWidth="3" />
                  
                  {/* Forehead Bandage 🩹 */}
                  <rect x="-10" y="-22" width="20" height="9" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
                  <line x1="-5" y1="-18" x2="5" y2="-18" stroke="#FF0000" strokeWidth="2" />
                  <line x1="0" y1="-21" x2="0" y2="-14" stroke="#FF0000" strokeWidth="2" />
                  
                  {/* Sniffling face */}
                  <line x1="-7" y1="-7" x2="-2" y2="-7" stroke="#000" strokeWidth="2.5" />
                  <line x1="2" y1="-7" x2="7" y2="-7" stroke="#000" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="2" fill="#000" />
                  <text x="0" y="12" textAnchor="middle" fontSize="8" fontWeight="900" fill="#E11D48">(T_T) *sniff*</text>
                </g>
              )}

              {/* SCENE 4: HEALED DOLL WEARING SUNGLASSES GROOVING TO THE BEAT! */}
              {scene === 'DANCE_PARTY' && (
                <g transform="translate(340, 295)" filter="url(#comicShadowBold)">
                  <ellipse cx="0" cy="35" rx="25" ry="6" fill="#000" opacity="0.4" />
                  <g className="doll-bop-groove">
                    <path d="M-16,10 L16,10 L22,48 L-22,48 Z" fill="url(#dollDressGrad)" stroke="#000" strokeWidth="3" />
                    <circle cx="0" cy="-6" r="20" fill="#FFE4D6" stroke="#000" strokeWidth="3" />
                    
                    {/* Cool Mini Black Pixel Sunglasses 🕶️ */}
                    <rect x="-14" y="-12" width="12" height="9" fill="#000" stroke="#00FF94" strokeWidth="2" />
                    <rect x="2" y="-12" width="12" height="9" fill="#000" stroke="#00FF94" strokeWidth="2" />
                    <line x1="-2" y1="-8" x2="2" y2="-8" stroke="#00FF94" strokeWidth="2" />

                    {/* Happy Smirk */}
                    <path d="M-4,4 Q0,9 6,3" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                    {/* Speech Bubble: "Beat slaps tho! 🕶️🔥" */}
                    <g transform="translate(0, -42)" filter="url(#comicShadowBold)">
                      <rect x="-60" y="-14" width="120" height="20" rx="3" fill="#000" stroke="#00FF94" strokeWidth="2" />
                      <text x="0" y="0" textAnchor="middle" fontSize="9" fontWeight="900" fill="#00FF94" letterSpacing="0.5">
                        BEAT SLAPS THO! 🕶️🔥
                      </text>
                    </g>
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* SAMPLESWALA SAMPLES SOUND VAULT WORKSTATION (HERO REVEAL) */}
              {/* ===================================================================== */}
              {(scene === 'REVEAL_PACK' || scene === 'DANCE_PARTY') && (
                <g transform={scene === 'DANCE_PARTY' ? 'translate(435, 160)' : 'translate(410, 165)'} className="animate-packPopIn">
                  {/* Golden Radiating Sunburst Glow */}
                  <circle cx="75" cy="110" r="145" fill="#FFE600" opacity={scene === 'DANCE_PARTY' ? '0.22' : '0.45'} className="animate-pulse" filter="url(#neonGlowYellow)" />

                  {/* Heavy Duty Studio Production Desk */}
                  <rect x="-15" y="100" width="180" height="75" rx="3" fill="#18181E" stroke="#000" strokeWidth="5" filter="url(#comicShadowBold)" />
                  <rect x="0" y="175" width="16" height="45" fill="#0A0A0E" stroke="#000" strokeWidth="3.5" />
                  <rect x="134" y="175" width="16" height="45" fill="#0A0A0E" stroke="#000" strokeWidth="3.5" />
                  <line x1="5" y1="195" x2="145" y2="195" stroke="#FFE600" strokeWidth="4" />

                  {/* 16-Pad MPC Drum Machine on Desk */}
                  <g transform="translate(-8, 86)">
                    <rect x="0" y="0" width="48" height="20" rx="2" fill="#0F172A" stroke="#000" strokeWidth="2" />
                    {/* 4x2 Glowing Pads */}
                    <rect x="4" y="3" width="8" height="6" fill="#00FF94" />
                    <rect x="14" y="3" width="8" height="6" fill="#FFE600" />
                    <rect x="24" y="3" width="8" height="6" fill="#FF0080" />
                    <rect x="34" y="3" width="8" height="6" fill="#00FF94" />
                    <rect x="4" y="11" width="8" height="6" fill="#FFE600" />
                    <rect x="14" y="11" width="8" height="6" fill="#00FF94" />
                    <rect x="24" y="11" width="8" height="6" fill="#FFE600" />
                    <rect x="34" y="11" width="8" height="6" fill="#FF0080" />
                  </g>

                  {/* SAMPLESWALA GOLD SOUND VAULT BOX */}
                  <g transform="translate(0, 18)" filter="url(#comicShadowBold)">
                    <rect x="0" y="0" width="152" height="94" rx="4" fill="url(#goldPackGrad)" stroke="#000" strokeWidth="4.5" />
                    
                    {/* Header Strip with Holographic Text */}
                    <rect x="8" y="8" width="136" height="18" fill="#000000" stroke="#FFE600" strokeWidth="2" />
                    <text x="76" y="21" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FFE600" letterSpacing="1.5">SAMPLESWALA</text>

                    {/* Artwork Window with Active Waveform & VU Spectrum Meters */}
                    <rect x="8" y="30" width="136" height="40" fill="#121216" stroke="#000" strokeWidth="2" />
                    
                    {/* Glowing Audio Spectrum Equalizer */}
                    <g strokeWidth="2.5" strokeLinecap="round">
                      <line x1="16" y1="49" x2="16" y2="49" stroke="#00FF94" strokeWidth="4" />
                      <line x1="26" y1="40" x2="26" y2="58" stroke="#00FF94" />
                      <line x1="36" y1="35" x2="36" y2="63" stroke="#00FF94" />
                      <line x1="46" y1="38" x2="46" y2="60" stroke="#00FF94" />
                      <line x1="56" y1="44" x2="56" y2="54" stroke="#00FF94" />
                      <line x1="66" y1="33" x2="66" y2="65" stroke="#FFE600" strokeWidth="3" />
                      <line x1="76" y1="38" x2="76" y2="60" stroke="#FFE600" />
                      <line x1="86" y1="45" x2="86" y2="53" stroke="#FFE600" />
                      <line x1="96" y1="36" x2="96" y2="62" stroke="#FF0080" />
                      <line x1="106" y1="42" x2="106" y2="56" stroke="#00FF94" />
                      <line x1="116" y1="35" x2="116" y2="63" stroke="#00FF94" />
                      <line x1="126" y1="46" x2="126" y2="52" stroke="#00FF94" />
                      <line x1="134" y1="49" x2="134" y2="49" stroke="#00FF94" strokeWidth="4" />
                    </g>

                    {/* Bottom Technical Specification Badge */}
                    <rect x="8" y="74" width="136" height="13" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                    <text x="76" y="84" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#000" letterSpacing="0.8">
                      INDIAN SAMPLES • 24-BIT WAV • 100% ROYALTY FREE
                    </text>

                    {/* Gold Vinyl Master Record Peeking Out Behind Sleeve */}
                    <g transform="translate(126, -16)">
                      <circle cx="26" cy="26" r="25" fill="#18181B" stroke="#000" strokeWidth="3.5" />
                      <circle cx="26" cy="26" r="18" fill="none" stroke="#333" strokeWidth="1" />
                      <circle cx="26" cy="26" r="12" fill="none" stroke="#222" strokeWidth="1" />
                      <circle cx="26" cy="26" r="8.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                      <circle cx="26" cy="26" r="2.5" fill="#000" />
                    </g>
                  </g>

                  {/* Left & Right High-Power Studio Monitors (Subwoofers) */}
                  <g transform="translate(-68, 10)" filter="url(#comicShadowBold)" className={scene === 'DANCE_PARTY' ? 'speaker-bass-left' : ''}>
                    <rect x="0" y="0" width="44" height="96" rx="4" fill="url(#speakerKevlarGrad)" stroke="#000" strokeWidth="4.5" />
                    {/* Tweeter */}
                    <circle cx="22" cy="26" r="12" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="22" cy="26" r={scene === 'DANCE_PARTY' ? '8.5' : '6.5'} fill="#FFE600" />
                    {/* Woofer */}
                    <circle cx="22" cy="68" r="18" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="22" cy="68" r={scene === 'DANCE_PARTY' ? '13' : '10'} fill="#00FF94" />
                    {/* Bass Sound Waves in Dance Party */}
                    {scene === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3.5" fill="none" strokeLinecap="round">
                        <path d="M-8,18 Q-24,28 -8,38" className="animate-pulse" />
                        <path d="M-14,8 Q-34,28 -14,48" className="animate-pulse" />
                      </g>
                    )}
                  </g>

                  <g transform="translate(176, 10)" filter="url(#comicShadowBold)" className={scene === 'DANCE_PARTY' ? 'speaker-bass-right' : ''}>
                    <rect x="0" y="0" width="44" height="96" rx="4" fill="url(#speakerKevlarGrad)" stroke="#000" strokeWidth="4.5" />
                    {/* Tweeter */}
                    <circle cx="22" cy="26" r="12" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="22" cy="26" r={scene === 'DANCE_PARTY' ? '8.5' : '6.5'} fill="#FFE600" />
                    {/* Woofer */}
                    <circle cx="22" cy="68" r="18" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="22" cy="68" r={scene === 'DANCE_PARTY' ? '13' : '10'} fill="#00FF94" />
                    {/* Bass Sound Waves in Dance Party */}
                    {scene === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3.5" fill="none" strokeLinecap="round">
                        <path d="M52,18 Q68,28 52,38" className="animate-pulse" />
                        <path d="M58,8 Q78,28 58,48" className="animate-pulse" />
                      </g>
                    )}
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* THE KID: PROTAGONIST - ULTRA-DETAILED STREETWEAR PRODUCER */}
              {/* ===================================================================== */}
              <g transform={
                scene === 'GIFT_DOLL' ? 'translate(540, 140)' :
                scene === 'YEET_DOLL' ? 'translate(510, 140)' :
                scene === 'REVEAL_PACK' ? 'translate(670, 140)' :
                'translate(510, 140)'
              }>
                <g 
                  filter="url(#comicShadowBold)" 
                  className={scene === 'DANCE_PARTY' ? 'kid-dance-inner' : 'character-breathe'}
                >
                  {/* Floor Shadow */}
                  <ellipse cx="0" cy="210" rx="36" ry="8" fill="#000" opacity="0.55" />

                  {/* High-Top Air Sneakers & Baggy Cargo Pants */}
                  <g className={scene === 'DANCE_PARTY' ? 'kid-legs-step' : ''}>
                    {/* Left Leg */}
                    <path d="M-14,140 L-18,195" stroke="#18181B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M-36,194 L-8,194 L-6,207 L-38,207 Z" fill="#FFE600" stroke="#000" strokeWidth="4" />
                    <rect x="-38" y="204" width="30" height="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />
                    {/* Sneaker Lightning Swoosh */}
                    <path d="M-30,198 L-14,198 L-22,203 Z" fill="#000" />

                    {/* Right Leg */}
                    <path d="M14,140 L18,195" stroke="#18181B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M8,194 L36,194 L38,207 L6,207 Z" fill="#FFE600" stroke="#000" strokeWidth="4" />
                    <rect x="6" y="204" width="30" height="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />
                    {/* Sneaker Lightning Swoosh */}
                    <path d="M14,198 L30,198 L22,203 Z" fill="#000" />
                  </g>

                  {/* Oversized Red Hoodie with Ribbed Cuffs & Kangaroo Pocket */}
                  <path d="M-34,65 L34,65 L42,145 L-42,145 Z" fill="url(#kidHoodieGrad)" stroke="#000" strokeWidth="5" />
                  {/* Kangaroo Front Pocket */}
                  <path d="M-24,112 L24,112 L20,142 L-20,142 Z" fill="#9F1239" stroke="#000" strokeWidth="3" />
                  {/* White Hanging Hoodie Drawstrings */}
                  <line x1="-12" y1="72" x2="-14" y2="106" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="-15.5" y="104" width="3" height="5" fill="#FFE600" />
                  <line x1="12" y1="72" x2="14" y2="106" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="12.5" y="104" width="3" height="5" fill="#FFE600" />

                  {/* Official SamplesWala Chest Badge */}
                  <rect x="-22" y="80" width="44" height="17" rx="2" fill="#000" stroke="#FFE600" strokeWidth="2.5" />
                  <text x="0" y="92" textAnchor="middle" fontSize="8" fontWeight="900" fill="#FFE600" letterSpacing="0.8">SAMPLESWALA</text>

                  {/* Heavy Gold Cuban Link Chain with 'SW' Medallion */}
                  <path d="M-18,65 Q0,92 18,65" stroke="#FFE600" strokeWidth="4" fill="none" />
                  <circle cx="0" cy="85" r="7" fill="#FFE600" stroke="#000" strokeWidth="2" />
                  <text x="0" y="88" textAnchor="middle" fontSize="7" fontWeight="900" fill="#000">SW</text>

                  {/* Kid Arms per Scene */}
                  {scene === 'GIFT_DOLL' && (
                    <g>
                      {/* Pushing doll away skeptically */}
                      <path d="M-28,75 L-72,75" stroke="#E11D48" strokeWidth="15" strokeLinecap="round" />
                      <circle cx="-74" cy="75" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      <path d="M28,75 L40,105" stroke="#E11D48" strokeWidth="15" strokeLinecap="round" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g>
                      {/* Violent Throw Follow-Through */}
                      <path d="M-28,75 L-92,95" stroke="#E11D48" strokeWidth="16" strokeLinecap="round" />
                      <circle cx="-96" cy="97" r="9.5" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      <path d="M28,75 L38,95" stroke="#E11D48" strokeWidth="15" strokeLinecap="round" />
                      {/* Comic Rage Mark */}
                      <text x="-45" y="10" fontSize="20" fill="#FF0000" fontWeight="900">💢</text>
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g>
                      {/* Hands on cheeks in pure euphoric awe */}
                      <path d="M-30,75 Q-46,38 -28,24" stroke="#E11D48" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-28" cy="24" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      <path d="M30,75 Q46,38 28,24" stroke="#E11D48" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="28" cy="24" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g>
                      {/* Left arm waving high in the air with fire emoji */}
                      <g className="kid-arm-wave-inner">
                        <path d="M-30,75 Q-65,45 -55,6" stroke="#E11D48" strokeWidth="15" strokeLinecap="round" />
                        <circle cx="-53" cy="4" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                        <text x="-56" y="-7" fontSize="22">🔥</text>
                      </g>
                      {/* Right arm finger drumming on the beat */}
                      <g className="kid-arm-drum-inner">
                        <path d="M30,75 Q-15,95 -62,116" stroke="#E11D48" strokeWidth="15" strokeLinecap="round" />
                        <circle cx="-65" cy="118" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                      </g>
                    </g>
                  )}

                  {/* Kid Head, Backwards Snapback Cap & Expressive Face */}
                  <g className={scene === 'DANCE_PARTY' ? 'kid-head-bob-inner' : ''}>
                    <circle cx="0" cy="25" r="29" fill="#F8CBA6" stroke="#000" strokeWidth="4.5" />
                    
                    {/* Backwards Streetwear Snapback Cap */}
                    <path d="M-31,20 Q0,-20 31,20 Z" fill="#FFE600" stroke="#000" strokeWidth="4" />
                    <path d="M-28,18 Q-44,12 -40,26 Q-22,27 -28,18" fill="#000000" stroke="#000" strokeWidth="3.5" />
                    <circle cx="0" cy="0" r="3.5" fill="#000" />
                    {/* Cap Eyelets */}
                    <circle cx="-14" cy="8" r="1.5" fill="#000" />
                    <circle cx="14" cy="8" r="1.5" fill="#000" />

                    {/* Face Expressions */}
                    {scene === 'GIFT_DOLL' && (
                      <g>
                        {/* Skeptical Raised Eyebrow & Side Eye */}
                        <line x1="-17" y1="14" x2="-4" y2="20" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <line x1="4" y1="18" x2="17" y2="18" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="-10" cy="24" r="3.5" fill="#000" />
                        <circle cx="10" cy="24" r="3.5" fill="#000" />
                        <path d="M-7,38 Q0,32 7,37" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                      </g>
                    )}
                    {scene === 'YEET_DOLL' && (
                      <g>
                        {/* Angry Shouting Face */}
                        <line x1="-18" y1="11" x2="-4" y2="22" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="4" y1="22" x2="18" y2="11" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
                        <path d="M-16,24 L-5,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <path d="M5,24 L16,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <ellipse cx="0" cy="38" rx="10" ry="9" fill="#B91C1C" stroke="#000" strokeWidth="3.5" />
                        <path d="M-6,34 L6,34" stroke="#FFF" strokeWidth="2.5" />
                      </g>
                    )}
                    {scene === 'REVEAL_PACK' && (
                      <g>
                        {/* Star Pupils (✦_✦) */}
                        <g transform="translate(-10, 22) scale(1)">
                          <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#FFE600" stroke="#000" strokeWidth="2" />
                        </g>
                        <g transform="translate(10, 22) scale(1)">
                          <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#FFE600" stroke="#000" strokeWidth="2" />
                        </g>
                        <path d="M-10,34 Q0,50 10,34 Z" fill="#000" stroke="#000" strokeWidth="3" />
                      </g>
                    )}
                    {scene === 'DANCE_PARTY' && (
                      <g>
                        {/* Neon Pixel Shades with White Streak */}
                        <polygon points="-27,16 -4,16 -7,33 -24,33" fill="#000" stroke="#00FF94" strokeWidth="3" />
                        <polygon points="4,16 27,16 24,33 7,33" fill="#000" stroke="#00FF94" strokeWidth="3" />
                        <line x1="-4" y1="20" x2="4" y2="20" stroke="#00FF94" strokeWidth="3.5" />
                        <line x1="-21" y1="20" x2="-15" y2="29" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
                        <line x1="11" y1="20" x2="17" y2="29" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
                        <path d="M-7,41 Q0,47 11,36" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Over-Ear Studio Headphones (Reveal & Dance) */}
                    {(scene === 'REVEAL_PACK' || scene === 'DANCE_PARTY') && (
                      <g>
                        <path d="M-31,22 Q0,-28 31,22" stroke="#18181B" strokeWidth="9" fill="none" strokeLinecap="round" />
                        <path d="M-31,22 Q0,-28 31,22" stroke="#00FF94" strokeWidth="3" fill="none" />
                        <rect x="-39" y="10" width="13" height="32" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                        <rect x="26" y="10" width="13" height="32" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                      </g>
                    )}
                  </g>
                </g>
              </g>

              {/* FLOATING MUSIC BEAT NOTES & SPARKS (DANCE PARTY) */}
              {scene === 'DANCE_PARTY' && (
                <g fontWeight="900" fontSize="32" filter="url(#comicShadowBold)">
                  <text x="450" y="70" fill="#00FF94" className="note-float-1">♪</text>
                  <text x="560" y="50" fill="#FFE600" className="note-float-2">♫</text>
                  <text x="400" y="125" fill="#FF0080" className="note-float-3">♬</text>
                  <text x="630" y="95" fill="#00FF94" className="note-float-4">♩</text>
                  <text x="510" y="30" fill="#FFE600" className="note-float-5">⚡</text>
                  <text x="300" y="65" fill="#FFE600" className="note-float-1">♪</text>
                  <text x="740" y="45" fill="#00FF94" className="note-float-3">♫</text>
                  <text x="590" y="130" fill="#FF0080" className="note-float-2">💥</text>
                </g>
              )}
            </svg>
          </div>
        </div>
      )}

      {/* Embedded High-Performance CSS Animations (Pure Relative Offsets - Safe!) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Continuous Subtle Character Breathing */
        @keyframes subtleBreatheRelative {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2.5px); }
        }
        .character-breathe {
          animation: subtleBreatheRelative 2s ease-in-out infinite;
        }

        /* Dad & Mom Shock Tremble */
        @keyframes shockTremble {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-1.5deg); }
          75% { transform: translateY(-3px) rotate(1.5deg); }
        }
        .dad-shocked-inner {
          animation: shockTremble 0.22s ease-in-out infinite;
        }
        .mom-shocked-inner {
          animation: shockTremble 0.25s ease-in-out infinite;
        }

        /* ======================================================= */
        /* CRASHED DOLL WATERFALL TEARS & SOBBING ANIMATION       */
        /* ======================================================= */
        @keyframes dollSobbing {
          0%, 100% { transform: rotate(18deg) translateY(0px); }
          50% { transform: rotate(15deg) translateY(-3.5px); }
        }
        .doll-crying-shake {
          animation: dollSobbing 0.28s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes streamGushLeft {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.12) rotate(-4deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.85; }
        }
        .tear-stream-left {
          animation: streamGushLeft 0.22s ease-in-out infinite;
          transform-origin: -10px -10px;
        }

        @keyframes streamGushRight {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.12) rotate(4deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.85; }
        }
        .tear-stream-right {
          animation: streamGushRight 0.22s ease-in-out infinite 0.1s;
          transform-origin: 10px -10px;
        }

        @keyframes puddleExpand {
          0%, 100% { transform: scale(1); opacity: 0.65; }
          50% { transform: scale(1.1); opacity: 0.85; }
        }
        .tear-puddle-glow {
          animation: puddleExpand 0.9s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes tearDropletShoot {
          0% { transform: translateY(-4px) scale(0.6); opacity: 1; }
          100% { transform: translateY(14px) scale(1.3); opacity: 0.15; }
        }
        .tear-drop-1 { animation: tearDropletShoot 0.35s ease-in infinite; }
        .tear-drop-2 { animation: tearDropletShoot 0.35s ease-in infinite 0.12s; }
        .tear-drop-3 { animation: tearDropletShoot 0.35s ease-in infinite 0.22s; }

        /* Doll Bopping in Dance Party */
        @keyframes dollGrooveRel {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(-5deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(5deg); }
        }
        .doll-bop-groove {
          animation: dollGrooveRel 0.54s ease-in-out infinite;
          transform-origin: center bottom;
        }

        /* SamplesWala Pack Pop & Float */
        @keyframes packPopRelative {
          0% { transform: scale(0.6) translateY(35px); opacity: 0; }
          70% { transform: scale(1.06) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .animate-packPopIn {
          animation: packPopRelative 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Speaker Bass Thump */
        @keyframes bassThumpLeft {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05) rotate(-1.5deg); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05) rotate(-1.5deg); }
        }
        .speaker-bass-left {
          animation: bassThumpLeft 0.54s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes bassThumpRight {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05) rotate(1.5deg); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05) rotate(1.5deg); }
        }
        .speaker-bass-right {
          animation: bassThumpRight 0.54s ease-in-out infinite;
          transform-origin: center center;
        }

        /* ======================================================= */
        /* FAMILY DANCE PARTY - RELATIVE MOTIONS                   */
        /* ======================================================= */

        /* 1. Kid Dance at Center */
        @keyframes kidDanceCenter {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-3.5deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(3.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .kid-dance-inner {
          animation: kidDanceCenter 0.54s ease-in-out infinite;
          transform-origin: 0px 200px;
        }

        @keyframes kidHeadBobRel {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(4.5px) rotate(2deg); }
        }
        .kid-head-bob-inner {
          animation: kidHeadBobRel 0.27s ease-in-out infinite;
        }

        @keyframes kidArmPumpRel {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-26deg); }
          100% { transform: rotate(0deg); }
        }
        .kid-arm-wave-inner {
          animation: kidArmPumpRel 0.54s ease-in-out infinite;
          transform-origin: -30px 75px;
        }

        @keyframes kidDrumTapRel {
          0% { transform: translateY(0px); }
          50% { transform: translateY(7px); }
          100% { transform: translateY(0px); }
        }
        .kid-arm-drum-inner {
          animation: kidDrumTapRel 0.27s ease-in-out infinite;
        }

        /* 2. Dad Dance on Left */
        @keyframes dadDanceLeft {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-7px) rotate(3.5deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-7px) rotate(-3.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .dad-dance-inner {
          animation: dadDanceLeft 0.54s ease-in-out infinite;
          transform-origin: 0px 210px;
        }

        @keyframes dadRoofPumpRel {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
          100% { transform: translateY(0px); }
        }
        .dad-arms-dance-pump {
          animation: dadRoofPumpRel 0.27s ease-in-out infinite;
        }

        /* 3. Mom Dance on Right */
        @keyframes momDanceRight {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-3.5deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-6px) rotate(3.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .mom-dance-inner {
          animation: momDanceRight 0.54s ease-in-out infinite 0.08s;
          transform-origin: 0px 200px;
        }

        @keyframes momClapRel {
          0% { transform: scale(1); }
          50% { transform: scale(1.1) translateY(-2.5px); }
          100% { transform: scale(1); }
        }
        .mom-arms-clapping-sync {
          animation: momClapRel 0.27s ease-in-out infinite;
        }

        /* Floating Musical Beat Notes */
        @keyframes noteFloatUpRel {
          0% { transform: translateY(0px) scale(0.7); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-48px) scale(1.25); opacity: 0; }
        }
        .note-float-1 { animation: noteFloatUpRel 1.3s ease-out infinite 0.1s; }
        .note-float-2 { animation: noteFloatUpRel 1.5s ease-out infinite 0.3s; }
        .note-float-3 { animation: noteFloatUpRel 1.4s ease-out infinite 0.6s; }
        .note-float-4 { animation: noteFloatUpRel 1.6s ease-out infinite 0.2s; }
        .note-float-5 { animation: noteFloatUpRel 1.2s ease-out infinite 0.5s; }
        `
      }} />
    </div>
  )
}
