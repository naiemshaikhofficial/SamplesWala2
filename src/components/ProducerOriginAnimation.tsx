'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, RotateCcw, Sparkles, Play, Pause, ChevronUp, ChevronDown, Music, Heart, Flame } from 'lucide-react'

// ============================================================================
// PURE BROWSER SYNTHESIZER (No external mp3s, 0 network bandwidth, zero lag)
// ============================================================================
class CinematicBeatEngine {
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

  private playKick(time: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.frequency.setValueAtTime(140, time)
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.32)
    gain.gain.setValueAtTime(0.75, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.32)

    osc.start(time)
    osc.stop(time + 0.32)
  }

  private playSnare(time: number) {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 0.16
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45
    }
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1100, time)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.38, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.16)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(time)
    noise.stop(time + 0.16)
  }

  private playHat(time: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(8500, time)
    gain.gain.setValueAtTime(0.09, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(time)
    osc.stop(time + 0.04)
  }

  private playDesiSynth(freq: number, time: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, time)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, time)
    filter.frequency.exponentialRampToValueAtTime(2400, time + 0.12)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    gain.gain.setValueAtTime(0.18, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22)

    osc.start(time)
    osc.stop(time + 0.24)
  }

  private scheduleNext() {
    if (!this.isPlaying || !this.ctx) return
    const now = this.ctx.currentTime + 0.04
    const s = this.step % 16

    // Bouncy punchy Indian street / hip-hop groove
    if (s === 0 || s === 6 || s === 10) this.playKick(now)
    if (s === 4 || s === 12) this.playSnare(now)
    if (s % 2 === 0) this.playHat(now)

    // Catchy pentatonic desi riff
    const melody = [220, 246.9, 277.2, 329.6, 370.0, 440.0, 370.0, 329.6]
    if (s % 2 === 0) {
      this.playDesiSynth(melody[(s / 2) % melody.length], now)
    }

    this.step++
    this.timer = window.setTimeout(() => this.scheduleNext(), 145)
  }
}

// ============================================================================
// 6 DISTINCT STORY PHASES:
// 1. 'GIFT_DOLL'    -> Parents walk in smiling, hand kid a pink doll.
// 2. 'YEET_DOLL'    -> Kid is disgusted, throws doll across floor!
// 3. 'PARENTS_SAD'  -> Parents are visibly sad (slumped shoulders, crying eyes).
// 4. 'FETCH_GEAR'   -> Parents walk off to fetch the secret music gear.
// 5. 'REVEAL_GEAR'  -> Parents return carrying glowing SamplesWala MPC & Headphones!
// 6. 'DANCE_PARTY'  -> Kid puts on headphones & dances like crazy while beat drops!
// ============================================================================
export type ScenePhase = 
  | 'GIFT_DOLL'
  | 'YEET_DOLL'
  | 'PARENTS_SAD'
  | 'FETCH_GEAR'
  | 'REVEAL_GEAR'
  | 'DANCE_PARTY'

export function ProducerOriginAnimation() {
  const [phase, setPhase] = useState<ScenePhase>('GIFT_DOLL')
  const [isSoundOn, setIsSoundOn] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const beatEngineRef = useRef<CinematicBeatEngine | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    beatEngineRef.current = new CinematicBeatEngine()
    return () => {
      beatEngineRef.current?.stop()
    }
  }, [])

  // Sync Audio when dancing
  useEffect(() => {
    if (phase === 'DANCE_PARTY' && isSoundOn && !isPaused) {
      beatEngineRef.current?.start()
    } else {
      beatEngineRef.current?.stop()
    }
  }, [phase, isSoundOn, isPaused])

  // Sequence engine
  const transitionTo = (nextPhase: ScenePhase, delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isPaused) return

    timerRef.current = setTimeout(() => {
      setPhase(nextPhase)
    }, delay)
  }

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    switch (phase) {
      case 'GIFT_DOLL':
        transitionTo('YEET_DOLL', 3200)
        break
      case 'YEET_DOLL':
        transitionTo('PARENTS_SAD', 2600)
        break
      case 'PARENTS_SAD':
        transitionTo('FETCH_GEAR', 2800)
        break
      case 'FETCH_GEAR':
        transitionTo('REVEAL_GEAR', 2400)
        break
      case 'REVEAL_GEAR':
        transitionTo('DANCE_PARTY', 3000)
        break
      case 'DANCE_PARTY':
        // Stays in dance party!
        break
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, isPaused])

  const restartStory = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsPaused(false)
    setPhase('GIFT_DOLL')
  }

  const toggleSound = () => {
    const next = !isSoundOn
    setIsSoundOn(next)
    if (next && phase === 'DANCE_PARTY' && !isPaused) {
      beatEngineRef.current?.start()
    } else {
      beatEngineRef.current?.stop()
    }
  }

  return (
    <div className="w-full relative select-none rounded-sm border-4 border-black bg-zinc-950 shadow-[8px_8px_0px_black] overflow-hidden mb-8">
      {/* Top Header & Interactive Scene Director Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black border-b-4 border-black">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 bg-studio-yellow rounded-full animate-ping border border-black shadow-[0_0_8px_#FFE600]" />
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-white italic">
            Producer Origin Story: <span className="text-studio-neon">"Born to Make Beats"</span>
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xs border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isSoundOn 
                ? 'bg-[#00FF94] text-black shadow-[2px_2px_0px_black]' 
                : 'bg-zinc-800 text-white/60 hover:text-white shadow-[2px_2px_0px_black]'
            }`}
            title="Toggle synthesized beat"
          >
            {isSoundOn ? <Volume2 size={13} className="animate-bounce" /> : <VolumeX size={13} />}
            <span>{isSoundOn ? 'Beat: ON' : 'Beat: OFF'}</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white rounded-xs border-2 border-black shadow-[2px_2px_0px_black] flex items-center gap-1 transition-all cursor-pointer"
            title={isPaused ? 'Resume Story' : 'Pause Story'}
          >
            {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
            <span className="hidden sm:inline">{isPaused ? 'Play' : 'Pause'}</span>
          </button>

          {/* Replay */}
          <button
            onClick={restartStory}
            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-studio-yellow hover:bg-white text-black rounded-xs border-2 border-black shadow-[2px_2px_0px_black] flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 active:shadow-none"
            title="Replay from Beginning"
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

      {/* Main Stage Viewport */}
      {!isCollapsed && (
        <div className="relative w-full h-[320px] sm:h-[370px] md:h-[420px] bg-gradient-to-b from-[#121218] via-[#0c0c10] to-[#050507] flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Halftone Grid & Comic Studio Room Glow */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Neon Studio Wall Banner */}
          <div className="absolute top-3 right-6 hidden md:flex items-center gap-2 opacity-30 border border-white/20 px-3 py-1 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-studio-neon animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-white">STUDIO RECORDING ROOM</span>
          </div>

          {/* Floating Dialogue Speech Bubble (Very Clear Narrative Context) */}
          <div className="relative z-30 pt-3 flex justify-center px-4 pointer-events-none">
            <div className="max-w-2xl px-5 py-2 bg-black border-3 border-black rounded-sm shadow-[5px_5px_0px_#FFE600] flex items-center gap-2.5 transition-all duration-300">
              <Sparkles size={16} className="text-studio-yellow animate-spin flex-shrink-0" />
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-white italic">
                {phase === 'GIFT_DOLL' && "Parents: 'Here beta, play with this cute doll! 🧸'"}
                {phase === 'YEET_DOLL' && "Kid: 'NO WAY!! I DON'T WANT DOLLS, I WANT BEATS!' *YEET!* 💥"}
                {phase === 'PARENTS_SAD' && "Parents: 'Oh no... he feels misunderstood... 🥺 (We need real music gear!)'"}
                {phase === 'FETCH_GEAR' && "Parents: 'Hold on beta! Let us fetch the real SamplesWala surprise! 🏃‍♂️💨'"}
                {phase === 'REVEAL_GEAR' && "Parents: 'Surprise! Your own SamplesWala Studio MPC & Stems!' ✨"}
                {phase === 'DANCE_PARTY' && "Kid: 'YOOOO!! NOW WE COOKING CERTIFIED BANGERS!!' 🎧🔥🕺"}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CINEMATIC SVG STAGE CANVAS */}
          {/* ========================================================================= */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            <svg
              viewBox="0 0 1000 380"
              className="w-full h-full max-w-5xl mx-auto overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="comicShadowHeavy" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                </filter>
                <linearGradient id="pinkDollDress" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF2E93" />
                  <stop offset="100%" stopColor="#FF77B6" />
                </linearGradient>
                <linearGradient id="mpcBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D2D35" />
                  <stop offset="100%" stopColor="#121216" />
                </linearGradient>
              </defs>

              {/* STUDIO FLOOR */}
              <g className="stage-floor">
                <line x1="50" y1="330" x2="950" y2="330" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
                <line x1="100" y1="338" x2="900" y2="338" stroke="#FFE600" strokeWidth="2.5" strokeDasharray="16 8" />
                <ellipse cx="500" cy="332" rx="380" ry="12" fill="#000000" opacity="0.4" />
              </g>

              {/* ===================================================================== */}
              {/* ACTOR 1 & 2: THE PARENTS (MOM & DAD) - LEFT SIDE (x: 140 to 320) */}
              {/* ===================================================================== */}
              {phase !== 'FETCH_GEAR' && (
                <g className={`parents-duo ${phase === 'PARENTS_SAD' ? 'parents-droop animate-sigh' : ''} transition-all duration-500`}>
                  
                  {/* --- DAD --- */}
                  <g transform="translate(180, 110)" filter="url(#comicShadowHeavy)">
                    {/* Dad Floor Shadow */}
                    <ellipse cx="0" cy="220" rx="30" ry="7" fill="#000000" opacity="0.5" />

                    {/* Legs & Shoes */}
                    <path d="M-14,140 L-16,215" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M14,140 L16,215" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
                    <path d="M-28,215 L-6,215 L-4,223 L-30,223 Z" fill="#475569" stroke="#000" strokeWidth="3" />
                    <path d="M6,215 L28,215 L30,223 L4,223 Z" fill="#475569" stroke="#000" strokeWidth="3" />

                    {/* Dad Torso / Sweater */}
                    <path d="M-28,60 L28,60 L32,145 L-32,145 Z" fill="#2563EB" stroke="#000" strokeWidth="4" />
                    {/* Collar & Tie */}
                    <polygon points="0,60 -10,75 0,110 10,75" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <polygon points="-12,60 0,72 12,60" fill="#FFF" stroke="#000" strokeWidth="2" />

                    {/* Dad Head */}
                    <circle cx="0" cy="20" r="26" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                    {/* Hair */}
                    <path d="M-28,15 Q0,-16 28,15 Q14,0 -28,15 Z" fill="#334155" stroke="#000" strokeWidth="3" />
                    {/* Glasses */}
                    <rect x="-18" y="12" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="3" />
                    <rect x="4" y="12" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="3" />
                    <line x1="-4" y1="17" x2="4" y2="17" stroke="#000" strokeWidth="3" />

                    {/* Facial Expression (State-Dependent) */}
                    {phase === 'PARENTS_SAD' ? (
                      <g className="dad-sad-face">
                        {/* Sad drooping eyebrows */}
                        <line x1="-16" y1="8" x2="-4" y2="12" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                        <line x1="4" y1="12" x2="16" y2="8" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                        {/* Sad droop mouth */}
                        <path d="M-7,34 Q0,28 7,34" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                        {/* Teardrop */}
                        <circle cx="20" cy="26" r="3" fill="#38BDF8" />
                      </g>
                    ) : (
                      <g className="dad-happy-face">
                        {/* Cheerful eyebrows */}
                        <line x1="-16" y1="10" x2="-4" y2="8" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                        <line x1="4" y1="8" x2="16" y2="10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                        {/* Mustache */}
                        <path d="M-10,30 Q0,26 10,30 Q0,35 -10,30 Z" fill="#1E293B" />
                        {/* Smile */}
                        <path d="M-6,34 Q0,40 6,34" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Dad Arms */}
                    {phase === 'GIFT_DOLL' && (
                      <g className="dad-holding-gift">
                        {/* Arms pointing right offering doll */}
                        <path d="M22,70 Q45,85 70,80" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                        <circle cx="72" cy="79" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      </g>
                    )}
                    {phase === 'PARENTS_SAD' && (
                      <g className="dad-arms-sad">
                        {/* Limp drooping arms */}
                        <path d="M-26,70 L-34,120" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                        <path d="M26,70 L34,120" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                      </g>
                    )}
                    {(phase === 'REVEAL_GEAR' || phase === 'DANCE_PARTY') && (
                      <g className="dad-arms-presenting">
                        {/* Hands holding up gear or clapping */}
                        <path d="M22,70 Q55,60 75,50" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
                        <circle cx="77" cy="48" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      </g>
                    )}
                  </g>

                  {/* --- MOM --- */}
                  <g transform="translate(260, 130)" filter="url(#comicShadowHeavy)">
                    {/* Mom Floor Shadow */}
                    <ellipse cx="0" cy="200" rx="28" ry="7" fill="#000000" opacity="0.5" />

                    {/* Saree / Skirt Base */}
                    <path d="M-24,65 L24,65 L36,195 L-36,195 Z" fill="#E11D48" stroke="#000" strokeWidth="4" />
                    {/* Saree Pallu drape */}
                    <path d="M-22,65 Q0,110 -26,175 L-36,175 Q-6,100 -24,65 Z" fill="#FBBF24" stroke="#000" strokeWidth="2.5" />

                    {/* Mom Head */}
                    <circle cx="0" cy="22" r="23" fill="#F8CBA6" stroke="#000" strokeWidth="3.5" />
                    {/* Hair Bun & Puffs */}
                    <circle cx="0" cy="3" r="18" fill="#18181B" />
                    <circle cx="18" cy="12" r="10" fill="#18181B" />
                    <circle cx="-18" cy="12" r="10" fill="#18181B" />
                    {/* Bindi */}
                    <circle cx="0" cy="15" r="2.5" fill="#E11D48" />

                    {/* Mom Facial Expression */}
                    {phase === 'PARENTS_SAD' ? (
                      <g className="mom-sad-face">
                        {/* Sad droop eyes */}
                        <path d="M-12,23 Q-7,27 -2,23" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M2,23 Q7,27 12,23" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                        {/* Droop mouth */}
                        <path d="M-6,36 Q0,30 6,36" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
                        {/* Teardrop streaming */}
                        <path d="M-8,26 Q-12,34 -8,36" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                      </g>
                    ) : (
                      <g className="mom-happy-face">
                        {/* Loving Eyes */}
                        <circle cx="-7" cy="22" r="3" fill="#000" />
                        <circle cx="7" cy="22" r="3" fill="#000" />
                        {/* Smile */}
                        <path d="M-6,32 Q0,40 6,32" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Mom Arms */}
                    {phase === 'GIFT_DOLL' && (
                      <g className="mom-holding-gift">
                        <path d="M-10,70 Q30,95 70,85" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="72" cy="85" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      </g>
                    )}
                    {phase === 'PARENTS_SAD' && (
                      <g className="mom-sad-hands">
                        {/* Hands over chest / worried */}
                        <path d="M-15,70 Q0,90 10,78" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="10" cy="78" r="7" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      </g>
                    )}
                    {(phase === 'REVEAL_GEAR' || phase === 'DANCE_PARTY') && (
                      <g className="mom-clapping">
                        {/* Clapping happily */}
                        <path d="M-15,70 Q20,60 30,55" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="32" cy="54" r="7.5" fill="#F8CBA6" stroke="#000" strokeWidth="2.5" />
                      </g>
                    )}
                  </g>
                </g>
              )}

              {/* FETCHING GEAR INTERMISSION (Parents walking off and on) */}
              {phase === 'FETCH_GEAR' && (
                <g className="parents-walking-away animate-fadeOut">
                  <text x="220" y="240" fill="#FFE600" fontSize="22" fontWeight="900" fontStyle="italic" filter="url(#comicShadowHeavy)">
                    *PARENTS RUSH TO GET MUSIC GEAR!* 🏃‍♂️💨
                  </text>
                </g>
              )}

              {/* ===================================================================== */}
              {/* THE DOLL (GUDIYA) - GIFTED, THROWN, AND ON THE FLOOR */}
              {/* ===================================================================== */}
              {phase === 'GIFT_DOLL' && (
                <g transform="translate(370, 200)" filter="url(#comicShadowHeavy)" className="doll-presented animate-gentleFloat">
                  {/* Doll Dress */}
                  <path d="M-18,25 L18,25 L26,75 L-26,75 Z" fill="url(#pinkDollDress)" stroke="#000" strokeWidth="3.5" />
                  <ellipse cx="0" cy="45" rx="16" ry="5" fill="#FFFFFF" opacity="0.5" />
                  {/* Doll Head */}
                  <circle cx="0" cy="5" r="22" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                  {/* Pigtails with ribbons */}
                  <circle cx="-24" cy="-5" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                  <circle cx="24" cy="-5" r="10" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                  <circle cx="-20" cy="-2" r="4" fill="#FF0080" />
                  <circle cx="20" cy="-2" r="4" fill="#FF0080" />
                  {/* Button Eyes */}
                  <circle cx="-8" cy="4" r="4" fill="#000" />
                  <circle cx="8" cy="4" r="4" fill="#000" />
                  <circle cx="-7" cy="3" r="1.5" fill="#FFF" />
                  <circle cx="9" cy="3" r="1.5" fill="#FFF" />
                  {/* Smile */}
                  <path d="M-4,13 Q0,18 4,13" stroke="#E11D48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Comic Label Tag */}
                  <rect x="-20" y="65" width="40" height="14" fill="#FFE600" stroke="#000" strokeWidth="2" />
                  <text x="0" y="75" textAnchor="middle" fontSize="9" fontWeight="900" fill="#000">GUDIYA 🧸</text>
                </g>
              )}

              {phase === 'YEET_DOLL' && (
                <g className="doll-flying-arc">
                  {/* Speed Lines */}
                  <g stroke="#FFE600" strokeWidth="4" strokeLinecap="round" opacity="0.8">
                    <line x1="620" y1="180" x2="480" y2="220" strokeDasharray="16 8" />
                    <line x1="600" y1="140" x2="420" y2="160" strokeDasharray="20 10" />
                    <line x1="580" y1="100" x2="380" y2="110" strokeDasharray="14 7" />
                  </g>

                  {/* Comic YEET Starburst */}
                  <g transform="translate(540, 130) rotate(-15)" filter="url(#comicShadowHeavy)">
                    <polygon points="0,-20 25,-8 45,-25 35,8 60,20 30,25 20,45 0,25 -25,38 -18,12 -45,-8 -18,-12" fill="#FF3131" stroke="#000" strokeWidth="3.5" />
                    <text x="0" y="9" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="18" fontStyle="italic">YEET!!</text>
                  </g>

                  {/* The Doll Spinning away to the floor */}
                  <g className="animate-spinAndCrash">
                    <g transform="translate(430, 260) rotate(115)" filter="url(#comicShadowHeavy)">
                      <path d="M-18,25 L18,25 L26,75 L-26,75 Z" fill="url(#pinkDollDress)" stroke="#000" strokeWidth="3.5" />
                      <circle cx="0" cy="5" r="22" fill="#FFE4D6" stroke="#000" strokeWidth="3.5" />
                      <circle cx="-8" cy="4" r="4" fill="#000" />
                      <circle cx="8" cy="4" r="4" fill="#000" />
                    </g>
                  </g>
                </g>
              )}

              {(phase === 'PARENTS_SAD' || phase === 'FETCH_GEAR') && (
                <g className="doll-on-floor">
                  {/* Doll lying defeated on the floor */}
                  <g transform="translate(460, 310) rotate(95)" filter="url(#comicShadowHeavy)" opacity="0.7">
                    <path d="M-18,25 L18,25 L26,75 L-26,75 Z" fill="url(#pinkDollDress)" stroke="#000" strokeWidth="3" />
                    <circle cx="0" cy="5" r="22" fill="#FFE4D6" stroke="#000" strokeWidth="3" />
                    <circle cx="-8" cy="4" r="4" fill="#000" />
                    <circle cx="8" cy="4" r="4" fill="#000" />
                  </g>
                  {/* Sad dust poof */}
                  <text x="440" y="295" fill="#FFFFFF" opacity="0.4" fontSize="11" fontWeight="bold">...thud 💔</text>
                </g>
              )}

              {/* ===================================================================== */}
              {/* THE SAMPLESWALA MUSIC GEAR (REVEAL & DANCE PHASES) */}
              {/* ===================================================================== */}
              {(phase === 'REVEAL_GEAR' || phase === 'DANCE_PARTY') && (
                <g className="music-gear-setup animate-springIn" transform="translate(450, 150)">
                  {/* Giant Radiating Golden Sunburst Glow */}
                  <circle cx="70" cy="110" r="130" fill="#FFE600" opacity={phase === 'DANCE_PARTY' ? '0.2' : '0.4'} className="animate-pulse" />

                  {/* Heavy Duty Studio Desk */}
                  <rect x="0" y="90" width="180" height="80" rx="4" fill="#18181F" stroke="#000" strokeWidth="5" filter="url(#comicShadowHeavy)" />
                  <rect x="15" y="170" width="16" height="50" fill="#0E0E12" stroke="#000" strokeWidth="3" />
                  <rect x="150" y="170" width="16" height="50" fill="#0E0E12" stroke="#000" strokeWidth="3" />
                  <line x1="25" y1="195" x2="155" y2="195" stroke="#FFE600" strokeWidth="4" />

                  {/* SamplesWala MPC Drum Sampler */}
                  <g transform="translate(15, 38)" filter="url(#comicShadowHeavy)">
                    <rect x="0" y="0" width="150" height="60" rx="3" fill="url(#mpcBodyGrad)" stroke="#000" strokeWidth="4" />
                    
                    {/* Brand Banner */}
                    <rect x="8" y="8" width="70" height="12" fill="#000" stroke="#FFE600" strokeWidth="1.5" />
                    <text x="43" y="17" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#FFE600" letterSpacing="1">SAMPLESWALA</text>

                    {/* LCD Screen with Live Audio Wave / Status */}
                    <rect x="84" y="8" width="58" height="14" fill="#00FF94" stroke="#000" strokeWidth="2" />
                    <text x="113" y="18" textAnchor="middle" fontSize="8" fontWeight="900" fill="#000">
                      {phase === 'DANCE_PARTY' ? '♪ 107 BPM COOKING' : 'LOADED • 24-BIT'}
                    </text>

                    {/* 16 RGB Drum Pads */}
                    <g transform="translate(10, 26)">
                      {[0, 1, 2, 3].map((row) => (
                        <g key={row}>
                          {[0, 1, 2, 3].map((col) => {
                            const isPumping = phase === 'DANCE_PARTY' && ((row + col) % 2 === 0)
                            return (
                              <rect
                                key={col}
                                x={col * 16}
                                y={row * 7.5}
                                width="12"
                                height="6"
                                rx="1"
                                fill={isPumping ? '#FFE600' : '#FF0080'}
                                stroke="#000"
                                strokeWidth="1.2"
                              />
                            )
                          })}
                        </g>
                      ))}
                    </g>

                    {/* Knobs */}
                    <circle cx="95" cy="34" r="5.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <circle cx="112" cy="34" r="5.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                    <circle cx="129" cy="34" r="5.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                  </g>

                  {/* Studio Monitors (Speakers) on sides */}
                  {/* Left Speaker */}
                  <g transform="translate(-65, 10)" filter="url(#comicShadowHeavy)">
                    <rect x="0" y="0" width="46" height="95" rx="4" fill="#1E1E24" stroke="#000" strokeWidth="4" />
                    <circle cx="23" cy="28" r="13" fill="#111" stroke="#000" strokeWidth="2.5" />
                    <circle cx="23" cy="28" r={phase === 'DANCE_PARTY' ? '8.5' : '7'} fill="#FFE600" />
                    <circle cx="23" cy="68" r="18" fill="#111" stroke="#000" strokeWidth="2.5" />
                    <circle cx="23" cy="68" r={phase === 'DANCE_PARTY' ? '12' : '10'} fill="#00FF94" />
                    {/* Thumping soundwaves */}
                    {phase === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3.5" fill="none" strokeLinecap="round">
                        <path d="M-8,20 Q-20,30 -8,42" className="animate-pulse" />
                        <path d="M-15,10 Q-32,30 -15,55" className="animate-pulse" />
                      </g>
                    )}
                  </g>

                  {/* Right Speaker */}
                  <g transform="translate(195, 10)" filter="url(#comicShadowHeavy)">
                    <rect x="0" y="0" width="46" height="95" rx="4" fill="#1E1E24" stroke="#000" strokeWidth="4" />
                    <circle cx="23" cy="28" r="13" fill="#111" stroke="#000" strokeWidth="2.5" />
                    <circle cx="23" cy="28" r={phase === 'DANCE_PARTY' ? '8.5' : '7'} fill="#FFE600" />
                    <circle cx="23" cy="68" r="18" fill="#111" stroke="#000" strokeWidth="2.5" />
                    <circle cx="23" cy="68" r={phase === 'DANCE_PARTY' ? '12' : '10'} fill="#00FF94" />
                    {/* Thumping soundwaves */}
                    {phase === 'DANCE_PARTY' && (
                      <g stroke="#00FF94" strokeWidth="3.5" fill="none" strokeLinecap="round">
                        <path d="M54,20 Q66,30 54,42" className="animate-pulse" />
                        <path d="M62,10 Q78,30 62,55" className="animate-pulse" />
                      </g>
                    )}
                  </g>
                </g>
              )}

              {/* ===================================================================== */}
              {/* ACTOR 3: THE BOY (YOUNG PRODUCER) - RIGHT SIDE (x: 740, y: 120) */}
              {/* ===================================================================== */}
              <g 
                className={`kid-character-group ${phase === 'DANCE_PARTY' ? 'kid-vibing-dance' : ''} transition-all duration-300`}
                transform="translate(740, 120)"
              >
                {/* Floor Shadow */}
                <ellipse cx="0" cy="210" rx="36" ry="8" fill="#000000" opacity="0.5" />

                {/* LEGS & SNEAKERS */}
                <g className="kid-legs">
                  {/* Left Leg */}
                  <path d="M-14,140 L-18,195" stroke="#18181B" strokeWidth="15" strokeLinecap="round" />
                  <path d="M-34,195 L-8,195 L-6,206 L-36,206 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                  <rect x="-36" y="203" width="28" height="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />

                  {/* Right Leg */}
                  <path d="M14,140 L18,195" stroke="#18181B" strokeWidth="15" strokeLinecap="round" />
                  <path d="M8,195 L34,195 L36,206 L6,206 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                  <rect x="6" y="203" width="28" height="5" fill="#FFF" stroke="#000" strokeWidth="1.5" />
                </g>

                {/* HOODIE (TORSO) */}
                <g className="kid-hoodie" filter="url(#comicShadowHeavy)">
                  <path d="M-32,65 L32,65 L40,145 L-40,145 Z" fill="#FF3131" stroke="#000" strokeWidth="4.5" />
                  {/* Front Pocket */}
                  <path d="M-22,112 L22,112 L18,142 L-18,142 Z" fill="#C51D1D" stroke="#000" strokeWidth="3" />
                  {/* Crest Badge */}
                  <rect x="-16" y="80" width="32" height="15" fill="#000" stroke="#FFE600" strokeWidth="2" />
                  <text x="0" y="90" textAnchor="middle" fontSize="8" fontWeight="900" fill="#FFE600">PRODUCER</text>
                </g>

                {/* ARMS (STATE DRIVEN) */}
                {phase === 'GIFT_DOLL' && (
                  <g className="kid-arms-rejecting">
                    {/* Hand pushed out stopping doll */}
                    <path d="M-28,75 L-65,75" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                    <circle cx="-68" cy="75" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                  </g>
                )}
                {phase === 'YEET_DOLL' && (
                  <g className="kid-arms-throwing">
                    {/* Powerful throwing motion towards floor */}
                    <path d="M-28,75 L-80,105" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                    <circle cx="-83" cy="108" r="9" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                  </g>
                )}
                {phase === 'PARENTS_SAD' && (
                  <g className="kid-arms-stubborn">
                    {/* Folded arms in stubborn pout */}
                    <path d="M-30,75 Q0,105 30,75" stroke="#FF3131" strokeWidth="15" strokeLinecap="round" />
                  </g>
                )}
                {phase === 'REVEAL_GEAR' && (
                  <g className="kid-arms-shocked">
                    {/* Hands on cheeks in sheer awe */}
                    <path d="M-30,75 Q-38,40 -25,25" stroke="#FF3131" strokeWidth="13" strokeLinecap="round" />
                    <circle cx="-25" cy="25" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    <path d="M30,75 Q38,40 25,25" stroke="#FF3131" strokeWidth="13" strokeLinecap="round" />
                    <circle cx="25" cy="25" r="8" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                  </g>
                )}
                {phase === 'DANCE_PARTY' && (
                  <g className="kid-arms-dancing">
                    {/* Left arm waving in the air */}
                    <g className="arm-wave-anim">
                      <path d="M-30,75 Q-65,45 -55,10" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-53" cy="6" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                      <text x="-55" y="-6" fontSize="18">🔥</text>
                    </g>
                    {/* Right arm tapping drum machine pad */}
                    <g className="arm-tap-anim">
                      <path d="M30,75 Q-20,95 -65,115" stroke="#FF3131" strokeWidth="14" strokeLinecap="round" />
                      <circle cx="-68" cy="118" r="8.5" fill="#F8CBA6" stroke="#000" strokeWidth="3" />
                    </g>
                  </g>
                )}

                {/* HEAD & FACE */}
                <g className="kid-head" filter="url(#comicShadowHeavy)">
                  {/* Face base */}
                  <circle cx="0" cy="25" r="28" fill="#F8CBA6" stroke="#000" strokeWidth="4" />
                  {/* Backward Cap */}
                  <path d="M-30,20 Q0,-18 30,20 Z" fill="#FFE600" stroke="#000" strokeWidth="3.5" />
                  <path d="M-26,18 Q-42,12 -38,24 Q-22,25 -26,18" fill="#FFE600" stroke="#000" strokeWidth="3" />
                  <circle cx="0" cy="2" r="3.5" fill="#000" />

                  {/* FACIAL EXPRESSIONS */}
                  {phase === 'GIFT_DOLL' && (
                    <g className="kid-face-disgusted">
                      {/* Deadpan / annoyed eyebrows */}
                      <line x1="-16" y1="16" x2="-4" y2="20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="4" y1="20" x2="16" y2="16" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Skeptical horizontal line eyes */}
                      <line x1="-15" y1="24" x2="-5" y2="24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <line x1="5" y1="24" x2="15" y2="24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      {/* Disgusted crooked mouth */}
                      <path d="M-7,38 Q0,32 7,37" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {phase === 'YEET_DOLL' && (
                    <g className="kid-face-angry">
                      {/* Angry slanted eyebrows */}
                      <line x1="-17" y1="14" x2="-4" y2="22" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <line x1="4" y1="22" x2="17" y2="14" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      {/* Winking squint shouting eye */}
                      <path d="M-15,24 L-5,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M5,24 L15,24" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                      {/* Wide open yelling mouth */}
                      <ellipse cx="0" cy="38" rx="9" ry="7" fill="#B91C1C" stroke="#000" strokeWidth="3" />
                    </g>
                  )}

                  {phase === 'PARENTS_SAD' && (
                    <g className="kid-face-pout">
                      {/* Grumpy pout */}
                      <line x1="-16" y1="18" x2="-4" y2="18" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="4" y1="18" x2="16" y2="18" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="-10" cy="24" r="3" fill="#000" />
                      <circle cx="10" cy="24" r="3" fill="#000" />
                      {/* Pouting lips */}
                      <ellipse cx="0" cy="38" rx="5" ry="3" fill="#F43F5E" stroke="#000" strokeWidth="2" />
                    </g>
                  )}

                  {phase === 'REVEAL_GEAR' && (
                    <g className="kid-face-star-eyes">
                      {/* Giant Star Eyes */}
                      <g transform="translate(-10, 22) scale(0.9)">
                        <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#FFE600" stroke="#000" strokeWidth="2" />
                      </g>
                      <g transform="translate(10, 22) scale(0.9)">
                        <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="#FFE600" stroke="#000" strokeWidth="2" />
                      </g>
                      {/* Huge Happy Gasp Smile */}
                      <path d="M-10,34 Q0,48 10,34 Z" fill="#000" stroke="#000" strokeWidth="2.5" />
                      <path d="M-6,36 Q0,40 6,36" stroke="#FFF" strokeWidth="2.5" fill="none" />
                    </g>
                  )}

                  {phase === 'DANCE_PARTY' && (
                    <g className="kid-face-cool-shades">
                      {/* Cool Neon Producer Sunglasses */}
                      <polygon points="-26,16 -4,16 -7,32 -23,32" fill="#000" stroke="#00FF94" strokeWidth="2.5" />
                      <polygon points="4,16 26,16 23,32 7,32" fill="#000" stroke="#00FF94" strokeWidth="2.5" />
                      <line x1="-4" y1="20" x2="4" y2="20" stroke="#00FF94" strokeWidth="3" />
                      {/* Glare streaks */}
                      <line x1="-20" y1="20" x2="-14" y2="28" stroke="#FFF" strokeWidth="2.5" />
                      <line x1="10" y1="20" x2="16" y2="28" stroke="#FFF" strokeWidth="2.5" />
                      {/* Confident smirk */}
                      <path d="M-6,40 Q0,46 10,36" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>
                  )}

                  {/* PRODUCER HEADPHONES (APPEARS IN REVEAL & DANCE) */}
                  {(phase === 'REVEAL_GEAR' || phase === 'DANCE_PARTY') && (
                    <g className="headphones-snap" filter="url(#comicShadowHeavy)">
                      <path d="M-30,22 Q0,-26 30,22" stroke="#18181B" strokeWidth="8" fill="none" strokeLinecap="round" />
                      <path d="M-30,22 Q0,-26 30,22" stroke="#00FF94" strokeWidth="2.5" fill="none" />
                      {/* Neon Ear Cushions */}
                      <rect x="-37" y="10" width="12" height="30" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
                      <rect x="25" y="10" width="12" height="30" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
                    </g>
                  )}
                </g>
              </g>

              {/* DANCE PARTY PARTICLES & FLOATING NOTES */}
              {phase === 'DANCE_PARTY' && (
                <g className="floating-beat-notes" fontWeight="900" fontSize="28" filter="url(#comicShadowHeavy)">
                  <text x="620" y="80" fill="#00FF94" className="note-float-1">♪</text>
                  <text x="780" y="60" fill="#FFE600" className="note-float-2">♫</text>
                  <text x="560" y="130" fill="#FF0080" className="note-float-3">♬</text>
                  <text x="860" y="100" fill="#00FF94" className="note-float-4">♩</text>
                  <text x="700" y="40" fill="#FFE600" className="note-float-5">⚡</text>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Interactive Scene Navigator Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 bg-black/90 border-t-4 border-black z-30">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 mr-1 hidden md:inline">
              Jump to Scene:
            </span>
            <button
              onClick={() => { setPhase('GIFT_DOLL'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                phase === 'GIFT_DOLL' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              1. The Doll 🧸
            </button>
            <button
              onClick={() => { setPhase('YEET_DOLL'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                phase === 'YEET_DOLL' ? 'bg-[#FF3131] text-white shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              2. The Yeet! 💥
            </button>
            <button
              onClick={() => { setPhase('PARENTS_SAD'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                phase === 'PARENTS_SAD' ? 'bg-[#38BDF8] text-black shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              3. Parents Sad 🥺
            </button>
            <button
              onClick={() => { setPhase('REVEAL_GEAR'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                phase === 'REVEAL_GEAR' ? 'bg-[#FF0080] text-white shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              4. Music Gear ✨
            </button>
            <button
              onClick={() => { setPhase('DANCE_PARTY'); setIsPaused(false); }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-xs border-2 border-black transition-all cursor-pointer ${
                phase === 'DANCE_PARTY' ? 'bg-[#00FF94] text-black shadow-[2px_2px_0px_white]' : 'bg-zinc-900 text-white/60 hover:text-white'
              }`}
            >
              5. Dance Party! 🎧🔥
            </button>
          </div>
        </div>
      )}

      {/* High-Performance Hardware Accelerated Keyframe Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sighDroop {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        .parents-droop {
          animation: sighDroop 2s ease-in-out infinite;
        }
        @keyframes spinAndCrash {
          0% { transform: translate(650px, 150px) rotate(0deg) scale(1); opacity: 1; }
          45% { transform: translate(520px, 80px) rotate(-240deg) scale(0.9); opacity: 0.95; }
          85% { transform: translate(440px, 290px) rotate(-480deg) scale(0.85); opacity: 0.9; }
          100% { transform: translate(430px, 280px) rotate(-520deg) scale(0.8); opacity: 0.85; }
        }
        .animate-spinAndCrash {
          animation: spinAndCrash 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes springIn {
          0% { transform: translate(450px, 190px) scale(0.6); opacity: 0; }
          70% { transform: translate(450px, 145px) scale(1.05); opacity: 1; }
          100% { transform: translate(450px, 150px) scale(1); opacity: 1; }
        }
        .animate-springIn {
          animation: springIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes kidVibe {
          0% { transform: translate(740px, 120px) rotate(0deg); }
          25% { transform: translate(740px, 110px) rotate(-4deg); }
          50% { transform: translate(740px, 122px) rotate(0deg); }
          75% { transform: translate(740px, 112px) rotate(4deg); }
          100% { transform: translate(740px, 120px) rotate(0deg); }
        }
        .kid-vibing-dance {
          animation: kidVibe 0.58s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes armWave {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-22deg); }
          100% { transform: rotate(0deg); }
        }
        .arm-wave-anim {
          animation: armWave 0.58s ease-in-out infinite;
          transform-origin: -30px 75px;
        }
        @keyframes armTap {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(6px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .arm-tap-anim {
          animation: armTap 0.29s ease-in-out infinite;
        }
        @keyframes noteFly {
          0% { transform: translateY(0px) scale(0.7); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-42px) scale(1.2); opacity: 0; }
        }
        .note-float-1 { animation: noteFly 1.3s ease-out infinite 0.1s; }
        .note-float-2 { animation: noteFly 1.5s ease-out infinite 0.3s; }
        .note-float-3 { animation: noteFly 1.4s ease-out infinite 0.6s; }
        .note-float-4 { animation: noteFly 1.6s ease-out infinite 0.2s; }
        .note-float-5 { animation: noteFly 1.2s ease-out infinite 0.5s; }
        @keyframes gentleFloat {
          0%, 100% { transform: translate(370px, 200px); }
          50% { transform: translate(370px, 192px); }
        }
        .animate-gentleFloat {
          animation: gentleFloat 1.8s ease-in-out infinite;
        }
        `
      }} />
    </div>
  )
}
