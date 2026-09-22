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

    osc.frequency.setValueAtTime(135, time)
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.35)
    gain.gain.setValueAtTime(0.8, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)

    osc.start(time)
    osc.stop(time + 0.35)
  }

  private playTablaSlap(time: number) {
    if (!this.ctx) return
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12)
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
        transitionTo('YEET_DOLL', 3800)
        break
      case 'YEET_DOLL':
        transitionTo('REVEAL_PACK', 4200)
        break
      case 'REVEAL_PACK':
        transitionTo('DANCE_PARTY', 3800)
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
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 bg-studio-yellow rounded-full animate-ping border border-black" />
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-white italic flex items-center gap-2">
            Producer Origin: <span className="text-studio-neon">"Born for SamplesWala"</span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-studio-yellow text-black text-[9px] font-black uppercase not-italic rounded-xs">
              COMIC ORIGIN
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
        <div className="relative w-full h-[360px] sm:h-[410px] md:h-[450px] bg-gradient-to-b from-[#14141c] via-[#0c0c12] to-[#040406] flex flex-col justify-between overflow-hidden">
          
          {/* Halftone Comic Ambient Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:22px_22px]" />

          {/* English Narrative Dialogue Bubble */}
          <div className="relative z-30 pt-3 flex justify-center px-4 pointer-events-none">
            <div className="max-w-3xl px-5 py-2 bg-black border-3 border-black rounded-sm shadow-[5px_5px_0px_#FFE600] flex items-center gap-2.5 transition-all duration-300">
              <Sparkles size={16} className="text-studio-yellow animate-spin flex-shrink-0" />
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-white italic text-center">
                {scene === 'GIFT_DOLL' && "Parents: 'Surprise Beta! Here is a lovely cute doll for you! 🧸✨' | Kid: 'Wait... what is this?! 🤨'"}
                {scene === 'YEET_DOLL' && "Kid: 'A DOLL?! NO WAY! I'M A PRODUCER, I WANT BEATS!' *YEET!* 💥 | Doll: 'MUJHE KYU TODA?! 😭💔'"}
                {scene === 'REVEAL_PACK' && "Parents: 'Wait... He doesn't want toys! He was born for music! SAMPLESWALA SAMPLES ARE HERE!' ✨🎧"}
                {scene === 'DANCE_PARTY' && "All: 'BOOM!! SAMPLESWALA SAMPLES CHANGED THE GAME! EVEN THE DOLL IS GROOVING!!' 🕺💃🔥🎧"}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DETAILED SVG ANIMATION VIEWPORT (1000 x 380) - ROCK-SOLID STAGE COORDINATES */}
          {/* ========================================================================= */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            <svg
              viewBox="0 0 1000 380"
              className="w-full h-full max-w-5xl mx-auto overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="comicShadowBold" x="-25%" y="-25%" width="150%" height="150%">
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
                <linearGradient id="tearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E0F2FE" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
              </defs>

              {/* STAGE FLOOR */}
              <g className="stage-floor">
                <line x1="30" y1="330" x2="970" y2="330" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
                <line x1="60" y1="338" x2="940" y2="338" stroke="#FFE600" strokeWidth="2.5" strokeDasharray="16 8" />
                <ellipse cx="500" cy="332" rx="430" ry="12" fill="#000000" opacity="0.45" />
              </g>

              {/* ===================================================================== */}
              {/* DAD: POSITIONED ACCORDING TO SCENE */}
              {/* ===================================================================== */}
              <g transform={
                scene === 'GIFT_DOLL' ? 'translate(180, 115)' :
                scene === 'YEET_DOLL' ? 'translate(95, 115)' :
                scene === 'REVEAL_PACK' ? 'translate(160, 115)' :
                'translate(200, 115)'
              }>
                <g 
                  filter="url(#comicShadowBold)" 
                  className={scene === 'DANCE_PARTY' ? 'dad-dance-inner' : scene === 'YEET_DOLL' ? 'dad-shocked-inner' : 'character-breathe'}
                >
                  <ellipse cx="0" cy="220" rx="30" ry="7" fill="#000" opacity="0.5" />

                  {/* Dad Legs */}
                  <g className={scene === 'DANCE_PARTY' ? 'dad-legs-step' : ''}>
                    <path d="M-14,140 L-16,215" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M14,140 L16,215" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M-28,215 L-6,215 L-4,223 L-30,223 Z" fill="#475569" stroke="#000" strokeWidth="3" />
                    <path d="M6,215 L28,215 L30,223 L4,223 Z" fill="#475569" stroke="#000" strokeWidth="3" />
                  </g>

                  {/* Dad Torso */}
                  <path d="M-28,60 L28,60 L32,145 L-32,145 Z" fill="#2563EB" stroke="#000" strokeWidth="4" />
                  <polygon points="0,60 -10,75 0,110 10,75" fill="#FFE600" stroke="#000" strokeWidth="2" />
                  <polygon points="-12,60 0,72 12,60" fill="#FFF" stroke="#000" strokeWidth="2" />

                  {/* Dad Head & Glasses */}
                  <circle cx="0" cy="20" r="26" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                  <path d="M-28,15 Q0,-16 28,15 Q14,0 -28,15 Z" fill="#334155" stroke="#000" strokeWidth="3" />
                  <rect x="-18" y="12" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="4" y="12" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="3" />
                  <line x1="-4" y1="17" x2="4" y2="17" stroke="#000" strokeWidth="3" />

                  {/* Dad Mustache */}
                  <path d="M-10,30 Q0,26 10,30 Q0,35 -10,30 Z" fill="#1E293B" />

                  {/* Dad Facial Expression */}
                  {scene === 'YEET_DOLL' ? (
                    <g>
                      {/* Shocked Open Mouth & Blue Sweat Drop */}
                      <ellipse cx="0" cy="35" rx="7" ry="9" fill="#000" stroke="#000" strokeWidth="2" />
                      <line x1="-16" y1="6" x2="-4" y2="12" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="4" y1="12" x2="16" y2="6" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Big Sweat Drop */}
                      <path d="M22,10 C22,7 28,2 28,2 C28,2 34,7 34,10 C34,14 29,17 25,15 Z" fill="#38BDF8" stroke="#000" strokeWidth="1.5" />
                      <text x="0" y="-12" textAnchor="middle" fontSize="12" fontWeight="900" fill="#FFE600">"BETA NOOO!!"</text>
                    </g>
                  ) : (
                    <g>
                      <line x1="-16" y1="10" x2="-4" y2="8" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <line x1="4" y1="8" x2="16" y2="10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <path d="M-6,34 Q0,42 6,34" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Dad Arms */}
                  {scene === 'GIFT_DOLL' && (
                    <g>
                      <path d="M22,70 Q60,85 92,80" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="95" cy="79" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g>
                      {/* Hands clutching head in comic shock */}
                      <path d="M-26,70 Q-40,25 -22,12" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-20" cy="12" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <path d="M26,70 Q40,25 22,12" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="20" cy="12" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g>
                      <path d="M22,70 Q60,65 95,65" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="97" cy="65" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="dad-arms-dance-pump">
                      <path d="M-26,70 Q-55,30 -40,5" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-38" cy="2" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <path d="M26,70 Q55,30 40,5" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="38" cy="2" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                </g>
              </g>

              {/* ===================================================================== */}
              {/* MOM: POSITIONED ACCORDING TO SCENE */}
              {/* ===================================================================== */}
              <g transform={
                scene === 'GIFT_DOLL' ? 'translate(290, 125)' :
                scene === 'YEET_DOLL' ? 'translate(790, 125)' :
                scene === 'REVEAL_PACK' ? 'translate(270, 125)' :
                'translate(810, 125)'
              }>
                <g 
                  filter="url(#comicShadowBold)" 
                  className={scene === 'DANCE_PARTY' ? 'mom-dance-inner' : scene === 'YEET_DOLL' ? 'mom-shocked-inner' : 'character-breathe'}
                >
                  <ellipse cx="0" cy="205" rx="28" ry="7" fill="#000" opacity="0.5" />

                  {/* Saree Body */}
                  <path d="M-24,65 L24,65 L36,200 L-36,200 Z" fill="#E11D48" stroke="#000" strokeWidth="4" />
                  <path d="M-22,65 Q0,115 -26,180 L-36,180 Q-6,105 -24,65 Z" fill="#FBBF24" stroke="#000" strokeWidth="2.5" />

                  {/* Mom Head */}
                  <circle cx="0" cy="22" r="23" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                  <circle cx="0" cy="3" r="18" fill="#18181B" />
                  <circle cx="18" cy="12" r="10" fill="#18181B" />
                  <circle cx="-18" cy="12" r="10" fill="#18181B" />
                  <circle cx="0" cy="15" r="2.5" fill="#E11D48" />

                  {/* Mom Expression */}
                  {scene === 'YEET_DOLL' ? (
                    <g>
                      <circle cx="-7" cy="21" r="3.5" fill="#000" />
                      <circle cx="7" cy="21" r="3.5" fill="#000" />
                      <ellipse cx="0" cy="32" rx="5" ry="6" fill="#000" />
                      <text x="0" y="-12" textAnchor="middle" fontSize="12" fontWeight="900" fill="#FF0080">"HEI BHAGWAN! 😱"</text>
                    </g>
                  ) : (
                    <g>
                      <circle cx="-7" cy="22" r="3" fill="#000" />
                      <circle cx="7" cy="22" r="3" fill="#000" />
                      <path d="M-6,32 Q0,40 6,32" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Mom Arms */}
                  {scene === 'GIFT_DOLL' && (
                    <g>
                      <path d="M-10,70 Q35,95 76,82" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="78" cy="82" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g>
                      {/* Hands covering mouth in dramatic motherly gasp */}
                      <path d="M-22,70 Q-15,38 -4,29" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="-3" cy="29" r="7" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      <path d="M22,70 Q15,38 4,29" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="3" cy="29" r="7" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g>
                      <path d="M-10,70 Q35,75 80,72" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="82" cy="72" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g className="mom-arms-clapping-sync">
                      <path d="M-15,70 Q-10,40 -25,35" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                      <circle cx="-28" cy="33" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      <path d="M15,70 Q-5,40 -22,35" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              </g>

              {/* ===================================================================== */}
              {/* THE DOLL: PRESENTED, CRASHED & CRYING WATERFALLS, OR DANCING */}
              {/* ===================================================================== */}
              {scene === 'GIFT_DOLL' && (
                <g transform="translate(415, 195)" filter="url(#comicShadowBold)">
                  <g className="character-breathe">
                    <path d="M-18,25 L18,25 L26,75 L-26,75 Z" fill="url(#dollGrad)" stroke="#000" strokeWidth="3.5" />
                    <ellipse cx="0" cy="45" rx="16" ry="5" fill="#FFFFFF" opacity="0.5" />
                    <circle cx="0" cy="5" r="22" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                    <circle cx="-24" cy="-5" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                    <circle cx="24" cy="-5" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                    <circle cx="-8" cy="4" r="4" fill="#000" />
                    <circle cx="8" cy="4" r="4" fill="#000" />
                    <path d="M-4,13 Q0,18 4,13" stroke="#E11D48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <rect x="-24" y="65" width="48" height="15" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <text x="0" y="76" textAnchor="middle" fontSize="9" fontWeight="900" fill="#000">CUTE DOLL 🧸</text>
                  </g>
                </g>
              )}

              {/* SCENE 2: CRASHED DOLL CRYING WATERFALL TEARS ("MUJHE KYU TODA?!") */}
              {scene === 'YEET_DOLL' && (
                <g>
                  {/* Dynamic Yeet Streaks Across Air */}
                  <g stroke="#FFE600" strokeWidth="4" strokeLinecap="round" opacity="0.9">
                    <line x1="500" y1="165" x2="350" y2="235" strokeDasharray="16 8" />
                    <line x1="470" y1="130" x2="280" y2="210" strokeDasharray="18 9" />
                  </g>

                  {/* Mid-Air YEET Comic Burst */}
                  <g transform="translate(360, 180) rotate(-15)" filter="url(#comicShadowBold)">
                    <polygon points="0,-24 28,-10 52,-28 38,10 70,24 35,28 24,52 0,28 -28,44 -20,16 -52,-10 -20,-16" fill="#FF3131" stroke="#000" strokeWidth="4" />
                    <text x="0" y="10" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="19" fontStyle="italic">YEET!!</text>
                  </g>

                  {/* CRASHED & CRYING DOLL ON FLOOR AT (235, 275) */}
                  <g transform="translate(235, 275)">
                    {/* Ripple Puddle of Tears on Floor */}
                    <ellipse cx="0" cy="38" rx="55" ry="12" fill="#38BDF8" opacity="0.6" className="tear-puddle-glow" />
                    <ellipse cx="0" cy="38" rx="35" ry="7" fill="#0284C7" opacity="0.4" />

                    <g filter="url(#comicShadowBold)" className="doll-crying-shake">
                      {/* Doll Body on floor */}
                      <path d="M-22,10 L22,10 L30,55 L-30,55 Z" fill="url(#dollGrad)" stroke="#000" strokeWidth="3.5" />
                      
                      {/* Doll Head with cracked Band-aid */}
                      <circle cx="0" cy="-12" r="24" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                      
                      {/* Pigtails */}
                      <circle cx="-26" cy="-22" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                      <circle cx="26" cy="-22" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />

                      {/* Weeping Crying Anime Eyes (><) */}
                      <path d="M-14,-15 L-6,-11 L-14,-7" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      <path d="M14,-15 L6,-11 L14,-7" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      
                      {/* Crying Wobbly Open Mouth */}
                      <ellipse cx="0" cy="0" rx="9" ry="8" fill="#B91C1C" stroke="#000" strokeWidth="2.5" />
                      <path d="M-6,-2 Q0,-5 6,-2" stroke="#FFE4D6" strokeWidth="2" fill="none" />

                      {/* ========================================================= */}
                      {/* EXTREME WATERFALL TEAR STREAMS SPRAYING FROM BOTH SIDES! */}
                      {/* ========================================================= */}
                      {/* Left Eye Waterfall Stream */}
                      <g className="tear-stream-left">
                        <path d="M-10,-10 C-30,-25 -50,-10 -65,15 C-72,28 -78,36 -82,40" stroke="url(#tearGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="-45" cy="-8" r="4.5" fill="#38BDF8" className="tear-drop-1" />
                        <circle cx="-68" cy="22" r="5.5" fill="#0284C7" className="tear-drop-2" />
                        <circle cx="-85" cy="38" r="3.5" fill="#E0F2FE" className="tear-drop-3" />
                      </g>

                      {/* Right Eye Waterfall Stream */}
                      <g className="tear-stream-right">
                        <path d="M10,-10 C30,-25 50,-10 65,15 C72,28 78,36 82,40" stroke="url(#tearGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="45" cy="-8" r="4.5" fill="#38BDF8" className="tear-drop-1" />
                        <circle cx="68" cy="22" r="5.5" fill="#0284C7" className="tear-drop-2" />
                        <circle cx="85" cy="38" r="3.5" fill="#E0F2FE" className="tear-drop-3" />
                      </g>

                      {/* Floating Broken Heart */}
                      <text x="0" y="-45" textAnchor="middle" fontSize="22" className="animate-bounce">💔</text>

                      {/* COMIC SPEECH BUBBLE: "MUJHE KYU TODA?! 😭💔" */}
                      <g transform="translate(0, -78)" filter="url(#comicShadowBold)">
                        <path d="M-105,-22 L105,-22 L105,18 L14,18 L0,32 L-10,18 L-105,18 Z" fill="#FFE600" stroke="#000" strokeWidth="4" />
                        <text x="0" y="-4" textAnchor="middle" fontSize="13" fontWeight="900" fill="#000" letterSpacing="0.8">
                          "MUJHE KYU TODA?! 😭💔"
                        </text>
                        <text x="0" y="11" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#B91C1C" letterSpacing="0.5">
                          WHY DID YOU YEET ME?!
                        </text>
                      </g>
                    </g>
                  </g>
                </g>
              )}

              {/* SCENE 3: SITTING IN CORNER WITH BANDAGE SNIFFLING */}
              {scene === 'REVEAL_PACK' && (
                <g transform="translate(90, 275)" filter="url(#comicShadowBold)">
                  <ellipse cx="0" cy="35" rx="25" ry="6" fill="#000" opacity="0.4" />
                  <path d="M-16,10 L16,10 L22,48 L-22,48 Z" fill="url(#dollGrad)" stroke="#000" strokeWidth="3" />
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
                <g transform="translate(340, 275)" filter="url(#comicShadowBold)">
                  <ellipse cx="0" cy="35" rx="25" ry="6" fill="#000" opacity="0.4" />
                  <g className="doll-bop-groove">
                    <path d="M-16,10 L16,10 L22,48 L-22,48 Z" fill="url(#dollGrad)" stroke="#000" strokeWidth="3" />
                    <circle cx="0" cy="-6" r="20" fill="#FFE4D6" stroke="#000" strokeWidth="3" />
                    
                    {/* Cool Mini Black Pixel Sunglasses 🕶️ */}
                    <rect x="-14" y="-12" width="12" height="9" fill="#000" stroke="#00FF94" strokeWidth="2" />
                    <rect x="2" y="-12" width="12" height="9" fill="#000" stroke="#00FF94" strokeWidth="2" />
                    <line x1="-2" y1="-8" x2="2" y2="-8" stroke="#00FF94" strokeWidth="2" />

                    {/* Happy Smirk */}
                    <path d="M-4,4 Q0,9 6,3" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                    {/* Speech Bubble: "Beat slaps tho! 🕶️🔥" */}
                    <g transform="translate(0, -42)" filter="url(#comicShadowBold)">
                      <rect x="-55" y="-14" width="110" height="20" rx="3" fill="#000" stroke="#00FF94" strokeWidth="2" />
                      <text x="0" y="0" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#00FF94" letterSpacing="0.5">
                        BEAT SLAPS THO! 🕶️🔥
                      </text>
                    </g>
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* SAMPLESWALA SAMPLES SOUND VAULT PACK (OFFICIAL PRODUCT REVEAL) */}
              {/* ===================================================================== */}
              {(scene === 'REVEAL_PACK' || scene === 'DANCE_PARTY') && (
                <g transform={scene === 'DANCE_PARTY' ? 'translate(435, 140)' : 'translate(410, 145)'} className="animate-packPopIn">
                  {/* Golden Radiating Sunburst Glow */}
                  <circle cx="75" cy="110" r="140" fill="#FFE600" opacity={scene === 'DANCE_PARTY' ? '0.2' : '0.45'} className="animate-pulse" />

                  {/* Heavy Duty Studio Desk */}
                  <rect x="-10" y="100" width="170" height="75" rx="3" fill="#18181E" stroke="#000" strokeWidth="5" filter="url(#comicShadowBold)" />
                  <rect x="5" y="175" width="15" height="45" fill="#0A0A0E" stroke="#000" strokeWidth="3" />
                  <rect x="130" y="175" width="15" height="45" fill="#0A0A0E" stroke="#000" strokeWidth="3" />
                  <line x1="10" y1="195" x2="140" y2="195" stroke="#FFE600" strokeWidth="4" />

                  {/* SAMPLESWALA GOLD SOUND VAULT PACK */}
                  <g transform="translate(0, 18)" filter="url(#comicShadowBold)">
                    <rect x="0" y="0" width="150" height="92" rx="4" fill="url(#goldPackGrad)" stroke="#000" strokeWidth="4" />
                    
                    {/* Header Strip */}
                    <rect x="8" y="8" width="134" height="18" fill="#000000" stroke="#FFE600" strokeWidth="2" />
                    <text x="75" y="21" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#FFE600" letterSpacing="1.5">SAMPLESWALA</text>

                    {/* Artwork Window */}
                    <rect x="8" y="30" width="134" height="38" fill="#121216" stroke="#000" strokeWidth="2" />
                    
                    {/* Waveform graphic inside artwork */}
                    <g stroke="#00FF94" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="16" y1="49" x2="16" y2="49" strokeWidth="4" />
                      <line x1="26" y1="42" x2="26" y2="56" />
                      <line x1="36" y1="36" x2="36" y2="62" />
                      <line x1="46" y1="40" x2="46" y2="58" />
                      <line x1="56" y1="46" x2="56" y2="52" />
                      <line x1="66" y1="34" x2="66" y2="64" stroke="#FFE600" strokeWidth="3" />
                      <line x1="76" y1="40" x2="76" y2="58" stroke="#FFE600" />
                      <line x1="86" y1="45" x2="86" y2="53" />
                      <line x1="96" y1="38" x2="96" y2="60" />
                      <line x1="106" y1="43" x2="106" y2="55" />
                      <line x1="116" y1="37" x2="116" y2="61" />
                      <line x1="126" y1="47" x2="126" y2="51" />
                    </g>

                    {/* Bottom Specification Badge */}
                    <rect x="8" y="72" width="134" height="13" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                    <text x="75" y="82" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#000" letterSpacing="0.8">
                      INDIAN SAMPLES • 24-BIT WAV • 100% ROYALTY FREE
                    </text>

                    {/* Gold Vinyl Record Peeking Out Behind Box */}
                    <g transform="translate(125, -15)">
                      <circle cx="25" cy="25" r="24" fill="#18181B" stroke="#000" strokeWidth="3" />
                      <circle cx="25" cy="25" r="16" fill="none" stroke="#333" strokeWidth="1" />
                      <circle cx="25" cy="25" r="8" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                      <circle cx="25" cy="25" r="2.5" fill="#000" />
                    </g>
                  </g>

                  {/* Left & Right Studio Boom Monitors (Speakers) */}
                  <g transform="translate(-65, 12)" filter="url(#comicShadowBold)" className={scene === 'DANCE_PARTY' ? 'speaker-bass-left' : ''}>
                    <rect x="0" y="0" width="42" height="92" rx="3" fill="#1C1C22" stroke="#000" strokeWidth="4" />
                    <circle cx="21" cy="26" r="12" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="21" cy="26" r={scene === 'DANCE_PARTY' ? '8.5' : '6.5'} fill="#FFE600" />
                    <circle cx="21" cy="66" r="17" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="21" cy="66" r={scene === 'DANCE_PARTY' ? '12.5' : '10'} fill="#00FF94" />
                    {scene === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3" fill="none" strokeLinecap="round">
                        <path d="M-8,18 Q-22,28 -8,38" className="animate-pulse" />
                        <path d="M-14,8 Q-32,28 -14,48" className="animate-pulse" />
                      </g>
                    )}
                  </g>

                  <g transform="translate(172, 12)" filter="url(#comicShadowBold)" className={scene === 'DANCE_PARTY' ? 'speaker-bass-right' : ''}>
                    <rect x="0" y="0" width="42" height="92" rx="3" fill="#1C1C22" stroke="#000" strokeWidth="4" />
                    <circle cx="21" cy="26" r="12" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="21" cy="26" r={scene === 'DANCE_PARTY' ? '8.5' : '6.5'} fill="#FFE600" />
                    <circle cx="21" cy="66" r="17" fill="#111" stroke="#000" strokeWidth="2" />
                    <circle cx="21" cy="66" r={scene === 'DANCE_PARTY' ? '12.5' : '10'} fill="#00FF94" />
                    {scene === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3" fill="none" strokeLinecap="round">
                        <path d="M50,18 Q64,28 50,38" className="animate-pulse" />
                        <path d="M56,8 Q74,28 56,48" className="animate-pulse" />
                      </g>
                    )}
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* THE KID: PROTAGONIST - ROCK-SOLID ANCHORED IN STAGE CENTER! */}
              {/* ===================================================================== */}
              <g transform={
                scene === 'GIFT_DOLL' ? 'translate(540, 120)' :
                scene === 'YEET_DOLL' ? 'translate(510, 120)' :
                scene === 'REVEAL_PACK' ? 'translate(670, 120)' :
                'translate(510, 120)'
              }>
                <g 
                  filter="url(#comicShadowBold)" 
                  className={scene === 'DANCE_PARTY' ? 'kid-dance-inner' : 'character-breathe'}
                >
                  {/* Floor Shadow */}
                  <ellipse cx="0" cy="210" rx="34" ry="8" fill="#000" opacity="0.5" />

                  {/* Legs & Sneakers */}
                  <g className={scene === 'DANCE_PARTY' ? 'kid-legs-step' : ''}>
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
                  <rect x="-20" y="80" width="40" height="16" fill="#000" stroke="#FFE600" strokeWidth="2" />
                  <text x="0" y="91" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#FFE600">SAMPLESWALA</text>

                  {/* Kid Arms per scene */}
                  {scene === 'GIFT_DOLL' && (
                    <g>
                      {/* Pushing doll away skeptically */}
                      <path d="M-28,75 L-68,75" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-70" cy="75" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <path d="M28,75 L40,105" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                    </g>
                  )}
                  {scene === 'YEET_DOLL' && (
                    <g>
                      {/* Full Force Throwing Pitch Arm Follow-through */}
                      <path d="M-28,75 L-88,95" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-92" cy="97" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <path d="M28,75 L38,95" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      {/* Angry Rage Mark */}
                      <text x="-40" y="10" fontSize="18" fill="#FF0000" fontWeight="900">💢</text>
                    </g>
                  )}
                  {scene === 'REVEAL_PACK' && (
                    <g>
                      {/* Star eyes hands on cheeks */}
                      <path d="M-30,75 Q-44,38 -28,24" stroke="#FF3131" strokeWidth="13" strokeLinecap="round" />
                      <circle cx="-28" cy="24" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <path d="M30,75 Q44,38 28,24" stroke="#FF3131" strokeWidth="13" strokeLinecap="round" />
                      <circle cx="28" cy="24" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                  {scene === 'DANCE_PARTY' && (
                    <g>
                      {/* Left arm waving up high in the beat */}
                      <g className="kid-arm-wave-inner">
                        <path d="M-30,75 Q-65,45 -55,8" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                        <circle cx="-53" cy="6" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                        <text x="-55" y="-5" fontSize="18">🔥</text>
                      </g>
                      {/* Right arm grooving / finger drumming on the beat */}
                      <g className="kid-arm-drum-inner">
                        <path d="M30,75 Q-15,95 -60,115" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                        <circle cx="-63" cy="118" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      </g>
                    </g>
                  )}

                  {/* Head & Face */}
                  <g className={scene === 'DANCE_PARTY' ? 'kid-head-bob-inner' : ''}>
                    <circle cx="0" cy="25" r="28" fill="#F8CBA6" stroke="#000" strokeWidth="4" />
                    <path d="M-30,20 Q0,-18 30,20 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                    <path d="M-26,18 Q-42,12 -38,24 Q-22,25 -26,18" fill="#FFE600" stroke="#000" strokeWidth="3" />
                    <circle cx="0" cy="2" r="3.5" fill="#000" />

                    {/* Face Expressions */}
                    {scene === 'GIFT_DOLL' && (
                      <g>
                        {/* Skeptical Side Eye & Raised Eyebrow */}
                        <line x1="-16" y1="14" x2="-4" y2="20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="4" y1="18" x2="16" y2="18" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx="-10" cy="24" r="3" fill="#000" />
                        <circle cx="10" cy="24" r="3" fill="#000" />
                        <path d="M-7,38 Q0,32 7,37" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      </g>
                    )}
                    {scene === 'YEET_DOLL' && (
                      <g>
                        {/* Angry Shouting Producer Face */}
                        <line x1="-17" y1="12" x2="-4" y2="22" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <line x1="4" y1="22" x2="17" y2="12" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <path d="M-15,24 L-5,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <path d="M5,24 L15,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                        <ellipse cx="0" cy="38" rx="9" ry="8" fill="#B91C1C" stroke="#000" strokeWidth="3" />
                        <path d="M-5,35 L5,35" stroke="#FFF" strokeWidth="2" />
                      </g>
                    )}
                    {scene === 'REVEAL_PACK' && (
                      <g>
                        {/* Glowing Star Eyes 🤩 */}
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
                      <g>
                        {/* Neon Pixel Shades with White Streak */}
                        <polygon points="-26,16 -4,16 -7,32 -23,32" fill="#000" stroke="#00FF94" strokeWidth="2.5" />
                        <polygon points="4,16 26,16 23,32 7,32" fill="#000" stroke="#00FF94" strokeWidth="2.5" />
                        <line x1="-4" y1="20" x2="4" y2="20" stroke="#00FF94" strokeWidth="3" />
                        <line x1="-20" y1="20" x2="-14" y2="28" stroke="#FFF" strokeWidth="2.5" />
                        <line x1="10" y1="20" x2="16" y2="28" stroke="#FFF" strokeWidth="2.5" />
                        <path d="M-6,40 Q0,46 10,36" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Over-Ear Studio Headphones (Reveal & Dance) */}
                    {(scene === 'REVEAL_PACK' || scene === 'DANCE_PARTY') && (
                      <g>
                        <path d="M-30,22 Q0,-26 30,22" stroke="#18181B" strokeWidth="8" fill="none" strokeLinecap="round" />
                        <path d="M-30,22 Q0,-26 30,22" stroke="#00FF94" strokeWidth="2.5" fill="none" />
                        <rect x="-37" y="10" width="12" height="30" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
                        <rect x="25" y="10" width="12" height="30" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
                      </g>
                    )}
                  </g>
                </g>
              </g>

              {/* FLOATING MUSIC BEAT NOTES (DANCE PARTY) */}
              {scene === 'DANCE_PARTY' && (
                <g fontWeight="900" fontSize="30" filter="url(#comicShadowBold)">
                  <text x="460" y="60" fill="#00FF94" className="note-float-1">♪</text>
                  <text x="560" y="45" fill="#FFE600" className="note-float-2">♫</text>
                  <text x="410" y="115" fill="#FF0080" className="note-float-3">♬</text>
                  <text x="620" y="90" fill="#00FF94" className="note-float-4">♩</text>
                  <text x="505" y="25" fill="#FFE600" className="note-float-5">⚡</text>
                  <text x="310" y="55" fill="#FFE600" className="note-float-1">♪</text>
                  <text x="730" y="40" fill="#00FF94" className="note-float-3">♫</text>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Interactive Scene Navigator Pills */}
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
              2. Mujhe Kyu Toda?! 😭💔
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

      {/* Embedded High-Performance CSS Animations (Pure Relative Offsets - Safe!) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Continuous Subtle Character Breathing */
        @keyframes subtleBreatheRelative {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        .character-breathe {
          animation: subtleBreatheRelative 2s ease-in-out infinite;
        }

        /* Dad & Mom Shock / Droop */
        @keyframes shockTremble {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-1deg); }
          75% { transform: translateY(-3px) rotate(1deg); }
        }
        .dad-shocked-inner {
          animation: shockTremble 0.25s ease-in-out infinite;
        }
        .mom-shocked-inner {
          animation: shockTremble 0.28s ease-in-out infinite;
        }

        /* ======================================================= */
        /* CRASHED DOLL WATERFALL TEARS & SOBBING ANIMATION       */
        /* ======================================================= */
        @keyframes dollSobbing {
          0%, 100% { transform: rotate(18deg) translateY(0px); }
          50% { transform: rotate(16deg) translateY(-3px); }
        }
        .doll-crying-shake {
          animation: dollSobbing 0.3s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes streamGushLeft {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.1) rotate(-3deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
        }
        .tear-stream-left {
          animation: streamGushLeft 0.25s ease-in-out infinite;
          transform-origin: -10px -10px;
        }

        @keyframes streamGushRight {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
        }
        .tear-stream-right {
          animation: streamGushRight 0.25s ease-in-out infinite 0.1s;
          transform-origin: 10px -10px;
        }

        @keyframes puddleExpand {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        .tear-puddle-glow {
          animation: puddleExpand 1s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes tearDropletShoot {
          0% { transform: translateY(-4px) scale(0.6); opacity: 1; }
          100% { transform: translateY(12px) scale(1.2); opacity: 0.2; }
        }
        .tear-drop-1 { animation: tearDropletShoot 0.4s ease-in infinite; }
        .tear-drop-2 { animation: tearDropletShoot 0.4s ease-in infinite 0.15s; }
        .tear-drop-3 { animation: tearDropletShoot 0.4s ease-in infinite 0.25s; }

        /* Doll Bopping in Dance Party */
        @keyframes dollGrooveRel {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-4deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-4px) rotate(4deg); }
        }
        .doll-bop-groove {
          animation: dollGrooveRel 0.54s ease-in-out infinite;
          transform-origin: center bottom;
        }

        /* SamplesWala Pack Pop & Float */
        @keyframes packPopRelative {
          0% { transform: scale(0.6) translateY(30px); opacity: 0; }
          70% { transform: scale(1.05) translateY(-6px); opacity: 1; }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .animate-packPopIn {
          animation: packPopRelative 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Speaker Bass Thump */
        @keyframes bassThumpLeft {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.04) rotate(-1deg); }
          50% { transform: scale(1); }
          75% { transform: scale(1.04) rotate(-1deg); }
        }
        .speaker-bass-left {
          animation: bassThumpLeft 0.54s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes bassThumpRight {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.04) rotate(1deg); }
          50% { transform: scale(1); }
          75% { transform: scale(1.04) rotate(1deg); }
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
          25% { transform: translateY(-8px) rotate(-3deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .kid-dance-inner {
          animation: kidDanceCenter 0.54s ease-in-out infinite;
          transform-origin: 0px 200px;
        }

        @keyframes kidHeadBobRel {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(4px) rotate(1.5deg); }
        }
        .kid-head-bob-inner {
          animation: kidHeadBobRel 0.27s ease-in-out infinite;
        }

        @keyframes kidArmPumpRel {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-24deg); }
          100% { transform: rotate(0deg); }
        }
        .kid-arm-wave-inner {
          animation: kidArmPumpRel 0.54s ease-in-out infinite;
          transform-origin: -30px 75px;
        }

        @keyframes kidDrumTapRel {
          0% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(0px); }
        }
        .kid-arm-drum-inner {
          animation: kidDrumTapRel 0.27s ease-in-out infinite;
        }

        /* 2. Dad Dance on Left */
        @keyframes dadDanceLeft {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(3deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-6px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .dad-dance-inner {
          animation: dadDanceLeft 0.54s ease-in-out infinite;
          transform-origin: 0px 210px;
        }

        @keyframes dadRoofPumpRel {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .dad-arms-dance-pump {
          animation: dadRoofPumpRel 0.27s ease-in-out infinite;
        }

        /* 3. Mom Dance on Right */
        @keyframes momDanceRight {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(-3deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .mom-dance-inner {
          animation: momDanceRight 0.54s ease-in-out infinite 0.08s;
          transform-origin: 0px 200px;
        }

        @keyframes momClapRel {
          0% { transform: scale(1); }
          50% { transform: scale(1.08) translateY(-2px); }
          100% { transform: scale(1); }
        }
        .mom-arms-clapping-sync {
          animation: momClapRel 0.27s ease-in-out infinite;
        }

        /* Floating Musical Beat Notes */
        @keyframes noteFloatUpRel {
          0% { transform: translateY(0px) scale(0.7); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-45px) scale(1.2); opacity: 0; }
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
