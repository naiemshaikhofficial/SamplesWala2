'use client'

import React, { useState, useEffect, useRef, useId } from 'react'

export interface DeliveryCarAnimationProps {
  mode: 'drive' | 'return' | 'seamless'
  onDeliveryDelivered?: () => void
  onParcelClick?: () => void
  isParcelOpened?: boolean
  isDownloading?: boolean
  progress?: number // 0 to 100 for dispatch progress
  itemCoverUrl?: string
  itemName?: string
  itemFormat?: string
}

export type DeliveryPhase =
  | 'drive_speed'
  | 'zoom_past'
  | 'reverse_screech'
  | 'door_up'
  | 'dude_step_out'
  | 'drop_parcel'
  | 'hop_in'
  | 'car_leaving'
  | 'delivered_idle'

// =========================================================================
// === PURE WEB AUDIO SYNTHESIZER (Zero external files, safe lifecycle) ===
// =========================================================================
class SoundEngine {
  private ctx: AudioContext | null = null
  public isMuted: boolean = true

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          this.ctx = new AudioCtx()
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return this.ctx
    } catch {
      return null
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (!muted) {
      const ctx = this.initCtx()
      if (ctx) {
        try {
          const now = ctx.currentTime
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(880, now)
          gain.gain.setValueAtTime(0.001, now)
          gain.gain.linearRampToValueAtTime(0.08, now + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.13)
        } catch {}
      }
    }
  }

  public playEngineZoom(reverse = false) {
    if (this.isMuted) return
    const ctx = this.initCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      filter.type = 'lowpass'

      if (reverse) {
        osc.frequency.setValueAtTime(380, now)
        osc.frequency.exponentialRampToValueAtTime(110, now + 1.2)
        filter.frequency.setValueAtTime(1600, now)
        filter.frequency.exponentialRampToValueAtTime(350, now + 1.2)
        gain.gain.setValueAtTime(0.01, now)
        gain.gain.linearRampToValueAtTime(0.16, now + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35)
      } else {
        osc.frequency.setValueAtTime(115, now)
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.85)
        filter.frequency.setValueAtTime(550, now)
        filter.frequency.exponentialRampToValueAtTime(2800, now + 0.85)
        gain.gain.setValueAtTime(0.01, now)
        gain.gain.linearRampToValueAtTime(0.18, now + 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95)
      }

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + (reverse ? 1.35 : 0.95))
    } catch {}
  }

  public playBrakeScreech() {
    if (this.isMuted) return
    const ctx = this.initCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const mod = ctx.createOscillator()
      const modGain = ctx.createGain()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'triangle'
      mod.type = 'sawtooth'
      filter.type = 'bandpass'
      filter.Q.value = 6

      osc.frequency.setValueAtTime(2600, now)
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.75)

      mod.frequency.setValueAtTime(320, now)
      modGain.gain.setValueAtTime(650, now)
      modGain.gain.linearRampToValueAtTime(150, now + 0.75)

      filter.frequency.setValueAtTime(2400, now)
      filter.frequency.exponentialRampToValueAtTime(1000, now + 0.75)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.14, now + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

      mod.connect(modGain)
      modGain.connect(osc.frequency)
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      mod.start(now)
      osc.start(now)
      mod.stop(now + 0.8)
      osc.stop(now + 0.8)
    } catch {}
  }

  public playHydraulicDoor() {
    if (this.isMuted) return
    const ctx = this.initCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const bufferSize = Math.floor(ctx.sampleRate * 0.5)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1500, now)
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.45)
      filter.Q.value = 2.5

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.11, now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start(now)
      noise.stop(now + 0.52)
    } catch {}
  }

  public playBassBoom() {
    if (this.isMuted) return
    const ctx = this.initCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(138, now)
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.6)

      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.3, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.72)
    } catch {}
  }

  public playVaultUnlock() {
    if (this.isMuted) return
    const ctx = this.initCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const freqs = [880, 1174, 1568]
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const t = now + idx * 0.08

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, t)

        gain.gain.setValueAtTime(0.001, t)
        gain.gain.linearRampToValueAtTime(0.12, t + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(t)
        osc.stop(t + 0.075)
      })
    } catch {}
  }

  public playPackRevealChime() {
    if (this.isMuted) return
    const ctx = this.initCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const notes = [1046.5, 1318.5, 1567.98, 1975.53, 2349.32]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const t = now + i * 0.06

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, t)

        gain.gain.setValueAtTime(0.001, t)
        gain.gain.linearRampToValueAtTime(0.11, t + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(t)
        osc.stop(t + 0.42)
      })
    } catch {}
  }

  public dispose() {
    if (this.ctx) {
      try {
        if (this.ctx.state !== 'closed') {
          this.ctx.close().catch(() => {})
        }
      } catch {}
      this.ctx = null
    }
  }
}

export function DeliveryCarAnimation({
  mode,
  onDeliveryDelivered,
  onParcelClick,
  isParcelOpened = false,
  isDownloading = false,
  progress = 0,
  itemCoverUrl,
  itemName = 'Sample Pack',
  itemFormat = 'WAV • 24-BIT'
}: DeliveryCarAnimationProps) {
  // Scoped IDs for multi-instance SVG and DOM safety
  const rawId = useId()
  const uid = rawId.replace(/:/g, '_')
  const ids = {
    moonGlowAura: `${uid}-moonGlowAura`,
    moonSurfaceGradient: `${uid}-moonSurfaceGradient`,
    moonCrescentCutout: `${uid}-moonCrescentCutout`,
    soundFxToggle: `${uid}-sound-fx-toggle`,
    bungalowGlass: `${uid}-bungalowGlass`,
    bodyCarbonMetal: `${uid}-bodyCarbonMetal`,
    canopyGlass: `${uid}-canopyGlass`,
    headlightVolumetric: `${uid}-headlightVolumetric`,
    roadSpecularPool: `${uid}-roadSpecularPool`,
    rimForgedAlloy: `${uid}-rimForgedAlloy`,
    brakeRotor: `${uid}-brakeRotor`,
    plasmaFireOuter: `${uid}-plasmaFireOuter`,
    plasmaFireCore: `${uid}-plasmaFireCore`,
    goldVinylMaster: `${uid}-goldVinylMaster`,
    deliveryVaultCrate: `${uid}-delivery-vault-crate`,
    cdVinylDiscClip: `${uid}-cdVinylDiscClip`
  }

  const [phase, setPhase] = useState<DeliveryPhase>(
    mode === 'return' ? 'zoom_past' : 'drive_speed'
  )
  const [dialogueStep, setDialogueStep] = useState<0 | 1 | 2 | 3>(0)
  const [isMuted, setIsMuted] = useState(true)
  const [hasImpactShockwave, setHasImpactShockwave] = useState(false)
  const [isImpactShaking, setIsImpactShaking] = useState(false)
  const [unlockStage, setUnlockStage] = useState<'locked' | 'authorizing' | 'revealed'>(
    isParcelOpened ? 'revealed' : 'locked'
  )

  // Guard against rapid multiple clicks
  const isAuthorizingRef = useRef(false)
  const isMountedRef = useRef(true)

  // Stable callback refs
  const onDeliveryDeliveredRef = useRef(onDeliveryDelivered)
  onDeliveryDeliveredRef.current = onDeliveryDelivered
  const onParcelClickRef = useRef(onParcelClick)
  onParcelClickRef.current = onParcelClick

  // Sound Engine ref
  const soundEngineRef = useRef<SoundEngine | null>(null)

  // Centralized timer tracker
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const safeSetTimeout = (fn: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      if (isMountedRef.current) {
        fn()
      }
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current.clear()
  }

  // Lifecycle: Initialize SoundEngine & cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    const engine = new SoundEngine()
    soundEngineRef.current = engine

    return () => {
      isMountedRef.current = false
      clearAllTimers()
      engine.dispose()
      soundEngineRef.current = null
    }
  }, [])

  // Sync external isParcelOpened prop changes safely
  useEffect(() => {
    if (isParcelOpened) {
      isAuthorizingRef.current = false
      setUnlockStage('revealed')
    } else {
      isAuthorizingRef.current = false
      setUnlockStage('locked')
    }
  }, [isParcelOpened])

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newMuted = !isMuted
    setIsMuted(newMuted)
    soundEngineRef.current?.setMuted(newMuted)
  }

  // Robust Crate Click State Machine
  const handleCrateClick = () => {
    // 1. If currently in the authorizing phase, ignore repeated clicks
    if (isAuthorizingRef.current) return

    // 2. If already revealed/opened, preserve existing callback semantics
    if (isParcelOpened || unlockStage === 'revealed') {
      onParcelClickRef.current?.()
      return
    }

    // 3. Initiate single authorization sequence
    isAuthorizingRef.current = true
    setUnlockStage('authorizing')
    soundEngineRef.current?.playVaultUnlock()

    safeSetTimeout(() => {
      isAuthorizingRef.current = false
      soundEngineRef.current?.playPackRevealChime()
      setUnlockStage('revealed')
      onParcelClickRef.current?.()
    }, 350)
  }

  // Delivery Timeline State Machine
  useEffect(() => {
    clearAllTimers()

    if (mode === 'drive' || mode === 'seamless') {
      setPhase('drive_speed')
      setDialogueStep(0)
      setHasImpactShockwave(false)
      return
    }

    if (mode === 'return') {
      // 1. Car zooms past forward (overshoots drop-off)
      setPhase('zoom_past')
      setDialogueStep(0)
      setHasImpactShockwave(false)
      soundEngineRef.current?.playEngineZoom(false)

      // 2. Realizes mistake & screeches in REVERSE
      safeSetTimeout(() => {
        setPhase('reverse_screech')
        soundEngineRef.current?.playBrakeScreech()
      }, 700)

      // 3. Comes to dead stop, scissor hydraulic door swings up
      safeSetTimeout(() => {
        setPhase('door_up')
        soundEngineRef.current?.playHydraulicDoor()
      }, 2200)

      // 4. Johnny steps out carrying gold vault crate
      safeSetTimeout(() => setPhase('dude_step_out'), 2800)

      // 5. Drops crate firmly on tarmac (808 boom + shockwave + camera shake)
      safeSetTimeout(() => {
        setPhase('drop_parcel')
        soundEngineRef.current?.playBassBoom()
        setHasImpactShockwave(true)
        setIsImpactShaking(true)
        safeSetTimeout(() => setIsImpactShaking(false), 380)
      }, 4300)

      // 5a. Gen-Z Dialogue Line 1
      safeSetTimeout(() => setDialogueStep(1), 4700)

      // 5b. Gen-Z Dialogue Line 2
      safeSetTimeout(() => setDialogueStep(2), 6200)

      // 5c. Gen-Z Dialogue Line 3
      safeSetTimeout(() => setDialogueStep(3), 7700)

      // 6. Johnny adjusts shades, flashes peace sign ✌️, hops back inside
      safeSetTimeout(() => {
        setDialogueStep(0)
        setPhase('hop_in')
      }, 9300)

      // 7. Scissor door seals shut, quad exhausts spit fiery plasma & hologram, hypercar zooms away
      safeSetTimeout(() => {
        setPhase('car_leaving')
        soundEngineRef.current?.playHydraulicDoor()
        safeSetTimeout(() => soundEngineRef.current?.playEngineZoom(false), 200)
      }, 10800)

      // 8. Car is completely gone, motion stops, crate ready to unbox
      safeSetTimeout(() => {
        setPhase('delivered_idle')
        onDeliveryDeliveredRef.current?.()
      }, 11900)

      return () => {
        clearAllTimers()
      }
    }
  }, [mode])

  const isDriving = phase === 'drive_speed'
  const isZoomingPast = phase === 'zoom_past'
  const isReversing = phase === 'reverse_screech'
  const isCarLeaving = phase === 'car_leaving'
  const isDeliveredIdle = phase === 'delivered_idle'
  const isParked = phase === 'door_up' || phase === 'dude_step_out' || phase === 'drop_parcel' || phase === 'hop_in'
  const isWheelsSpinning = isDriving || isZoomingPast || isReversing || isCarLeaving

  // Real progress clamped to valid 0-100 range
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress || 0)))

  return (
    <div className="w-full relative overflow-hidden select-none my-0.5 sm:my-1 font-mono">
      {/* Precision High-End Visual Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Supercar Dynamic Physics */
        @keyframes chassisVibe {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-0.8px) rotate(-0.15deg); }
          50% { transform: translateY(0.4px) rotate(0.1deg); }
          75% { transform: translateY(-0.5px) rotate(-0.08deg); }
        }
        @keyframes accelerationSquat {
          0% { transform: translateY(0px) rotate(0deg); }
          30% { transform: translateY(2px) rotate(1.2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes brakeDive {
          0% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(2.2px) rotate(-1.8deg); }
          75% { transform: translateY(-0.8px) rotate(0.4deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* Scenery Parallax Forward & Reverse */
        @keyframes sceneryMoveForward {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes sceneryMoveReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        /* High-speed road line streaming */
        @keyframes roadStreamForward {
          from { background-position-x: 0px; }
          to { background-position-x: -48px; }
        }
        @keyframes roadStreamReverse {
          from { background-position-x: -48px; }
          to { background-position-x: 0px; }
        }

        .road-dashes-stream {
          background-image: repeating-linear-gradient(
            90deg,
            #FFE600 0px,
            #FFE600 24px,
            transparent 24px,
            transparent 48px
          );
          background-size: 48px 3px;
          background-position: 0 center;
          background-repeat: repeat-x;
        }

        /* Scenery animation classes */
        .scenery-drive { animation: sceneryMoveForward 24s linear infinite; }
        .scenery-zoom { animation: sceneryMoveForward 0.7s linear infinite; }
        .scenery-reverse { animation: sceneryMoveReverse 1.5s cubic-bezier(0.16, 0.85, 0.25, 1) infinite; }
        .scenery-leaving { animation: sceneryMoveForward 0.8s linear infinite; }
        .scenery-paused { animation-play-state: paused !important; }

        /* Road animation classes */
        .road-drive { animation: roadStreamForward 0.22s linear infinite; }
        .road-zoom { animation: roadStreamForward 0.12s linear infinite; }
        .road-reverse { animation: roadStreamReverse 0.22s linear infinite; }
        .road-leaving { animation: roadStreamForward 0.1s linear infinite; }
        .road-paused { animation-play-state: paused !important; }

        /* Forward Zoom Past & Reverse Screech Travel */
        @keyframes hyperCarZoomPast {
          0% { transform: translateX(0%); opacity: 1; }
          100% { transform: translateX(135%); opacity: 1; }
        }
        @keyframes hyperCarReverseScreech {
          0% { transform: translateX(135%); opacity: 1; }
          55% { transform: translateX(-6%); }
          80% { transform: translateX(2%); }
          100% { transform: translateX(0%); opacity: 1; }
        }
        @keyframes hyperCarLaunchOut {
          0% { transform: translateX(0%); opacity: 1; }
          15% { transform: translateX(-3%); opacity: 1; }
          40% { transform: translateX(15%); opacity: 1; }
          100% { transform: translateX(135%); opacity: 0; }
        }
        @keyframes driveCruise {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(8px); }
        }

        /* Tire Skid Smoke Puff */
        @keyframes skidSmokePuff {
          0% { transform: scale(0.3) translateY(0); opacity: 0.85; }
          50% { transform: scale(1.4) translateY(-14px); opacity: 0.6; }
          100% { transform: scale(2.2) translateY(-28px); opacity: 0; }
        }
        .anim-skid-smoke {
          animation: skidSmokePuff 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        /* Speed Streaks across air */
        @keyframes speedStreakMove {
          0% { transform: translateX(180%) scaleX(0.4); opacity: 0; }
          30% { opacity: 0.9; transform: translateX(50%) scaleX(1.4); }
          80% { opacity: 0.8; transform: translateX(-120%) scaleX(2); }
          100% { transform: translateX(-220%) scaleX(0.2); opacity: 0; }
        }

        /* Scissor Hydraulic Door Lift */
        @keyframes scissorHydraulicOpen {
          0% { transform: rotate(0deg) translate(0, 0); }
          40% { transform: rotate(-25deg) translate(-6px, -10px); }
          100% { transform: rotate(-58deg) translate(-10px, -20px); }
        }
        @keyframes scissorHydraulicClose {
          0% { transform: rotate(-58deg) translate(-10px, -20px); }
          60% { transform: rotate(-15deg) translate(-4px, -6px); }
          100% { transform: rotate(0deg) translate(0, 0); }
        }

        /* Johnny Step Out, Drop & Hop-In Animations with Leg Strides */
        @keyframes driverEmerge {
          0% { transform: translate(165px, 14px) scale(0.6); opacity: 0; }
          20% { transform: translate(145px, 8px) scale(0.72); opacity: 1; }
          50% { transform: translate(110px, 0px) scale(0.88); opacity: 1; }
          80% { transform: translate(75px, -2px) scale(0.96); opacity: 1; }
          100% { transform: translate(45px, 0px) scale(1); opacity: 1; }
        }
        @keyframes driverPlaceParcel {
          0% { transform: translate(45px, 0px); }
          35% { transform: translate(45px, 8px) scaleY(0.94); }
          65% { transform: translate(45px, 8px) scaleY(0.94); }
          100% { transform: translate(45px, 0px) scaleY(1); }
        }
        @keyframes driverHopInside {
          0% { transform: translate(45px, 0px) scale(1); opacity: 1; }
          35% { transform: translate(85px, -2px) scale(0.92); opacity: 1; }
          70% { transform: translate(130px, 6px) scale(0.78); opacity: 1; }
          90% { transform: translate(155px, 12px) scale(0.65); opacity: 0.7; }
          100% { transform: translate(165px, 16px) scale(0.5); opacity: 0; }
        }

        /* Johnny Leg Walking Strides */
        @keyframes strideLegL {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-24deg) translate(-2px, -3px); }
          75% { transform: rotate(18deg) translate(2px, 0px); }
        }
        @keyframes strideLegR {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg) translate(2px, 0px); }
          75% { transform: rotate(-24deg) translate(-2px, -3px); }
        }
        .anim-leg-left {
          transform-origin: 58px 102px;
          animation: strideLegL 0.45s ease-in-out infinite;
        }
        .anim-leg-right {
          transform-origin: 76px 102px;
          animation: strideLegR 0.45s ease-in-out infinite;
        }

        /* Nitro Plasma Fire Jet */
        @keyframes plasmaTorchPulse {
          0% { transform: scaleX(0.85) scaleY(0.9); opacity: 0.85; filter: brightness(1.1); }
          50% { transform: scaleX(1.3) scaleY(1.18) translateY(-1px); opacity: 1; filter: brightness(1.4); }
          100% { transform: scaleX(0.85) scaleY(0.9); opacity: 0.85; filter: brightness(1.1); }
        }
        @keyframes plasmaCoreFlicker {
          0%, 100% { transform: scaleX(0.9) scaleY(0.8); opacity: 0.95; }
          50% { transform: scaleX(1.45) scaleY(1.2); opacity: 1; }
        }

        /* Johnny Gestures */
        @keyframes funkyHandWave {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-36deg) translate(-3px, -3px); }
          45% { transform: rotate(28deg) translate(3px, 2px); }
          70% { transform: rotate(-32deg) translate(-2px, -2px); }
          90% { transform: rotate(22deg) translate(2px, 1px); }
          100% { transform: rotate(0deg); }
        }
        .anim-funky-wave {
          transform-origin: 88px 72px;
          animation: funkyHandWave 0.42s ease-in-out infinite;
        }
        @keyframes johnnyBodyGroove {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          30% { transform: rotate(-4deg) translateY(-2px); }
          70% { transform: rotate(3deg) translateY(1px); }
        }
        .anim-body-groove {
          transform-origin: 67px 101px;
          animation: johnnyBodyGroove 0.42s ease-in-out infinite;
        }
        @keyframes johnnyHairScratch {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(3px, -4px) rotate(8deg); }
        }
        .anim-hair-scratch {
          transform-origin: 88px 72px;
          animation: johnnyHairScratch 0.35s ease-in-out infinite alternate;
        }
        @keyframes johnnyBicepFlex {
          0% { transform: scale(1); }
          50% { transform: scale(1.08) translateY(-3px); }
          100% { transform: scale(1); }
        }
        .anim-bicep-flex {
          animation: johnnyBicepFlex 0.45s ease-in-out infinite;
        }

        /* Comic Bubble Pop */
        @keyframes comicBubblePop {
          0% { transform: scale(0.3) translateY(12px); opacity: 0; }
          65% { transform: scale(1.08) translateY(-3px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .anim-bubble-pop {
          transform-origin: 20px 30px;
          animation: comicBubblePop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }

        /* Parcel unboxing & vinyl burst */
        @keyframes crateLidFlyAway {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          25% { transform: translate(12px, -35px) rotate(-18deg) scale(1.1); opacity: 1; }
          60% { transform: translate(35px, -80px) rotate(45deg) scale(1.15); opacity: 0.85; }
          100% { transform: translate(65px, -130px) rotate(110deg) scale(0.6); opacity: 0; }
        }
        @keyframes vinylRecordRise {
          0% { transform: translate(0, 24px) scale(0.25); opacity: 0; }
          45% { transform: translate(0, -48px) scale(1.25); opacity: 1; }
          75% { transform: translate(0, -36px) scale(0.96); opacity: 1; }
          100% { transform: translate(0, -40px) scale(1); opacity: 1; }
        }

        .anim-chassis-vibe {
          animation: chassisVibe 0.18s linear infinite;
        }
        .anim-acceleration-squat {
          animation: accelerationSquat 0.8s ease-out forwards;
        }
        .anim-brake-dive {
          animation: brakeDive 1.35s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }

        .anim-flame-outer {
          transform-origin: 105px 105px;
          animation: plasmaTorchPulse 0.08s ease-in-out infinite alternate;
        }
        .anim-flame-core {
          transform-origin: 105px 105px;
          animation: plasmaCoreFlicker 0.06s ease-in-out infinite alternate;
        }
        .anim-scissor-open {
          transform-origin: 304px 72px;
          animation: scissorHydraulicOpen 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-scissor-close {
          transform-origin: 304px 72px;
          animation: scissorHydraulicClose 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .anim-driver-step {
          animation: driverEmerge 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-driver-drop {
          animation: driverPlaceParcel 0.5s ease-out forwards;
        }
        .anim-driver-hop {
          animation: driverHopInside 0.85s ease-in forwards;
        }
        .anim-lid-pop {
          animation: crateLidFlyAway 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-vinyl-rise {
          animation: vinylRecordRise 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Sound Vault LED Spectrum Equalizer Bars */
        @keyframes eqBounce1 { 0%, 100% { height: 2px; } 50% { height: 8.5px; } }
        @keyframes eqBounce2 { 0%, 100% { height: 7px; } 50% { height: 2.5px; } }
        @keyframes eqBounce3 { 0%, 100% { height: 3.5px; } 50% { height: 9px; } }
        .anim-eq-bar-1 { animation: eqBounce1 0.28s ease-in-out infinite alternate; }
        .anim-eq-bar-2 { animation: eqBounce2 0.36s ease-in-out infinite alternate; }
        .anim-eq-bar-3 { animation: eqBounce3 0.22s ease-in-out infinite alternate; }
        .anim-eq-bar-4 { animation: eqBounce1 0.32s ease-in-out infinite alternate; }
        .anim-eq-bar-5 { animation: eqBounce2 0.25s ease-in-out infinite alternate; }
        .anim-eq-bar-6 { animation: eqBounce3 0.4s ease-in-out infinite alternate; }

        /* Audio Waveform Shockwave Rings */
        @keyframes audioShockwaveExpand {
          0% { transform: scale(0.2); opacity: 1; }
          60% { opacity: 0.85; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .anim-impact-shockwave {
          transform-origin: 50px 82px;
          animation: audioShockwaveExpand 0.75s cubic-bezier(0.1, 0.85, 0.25, 1) forwards;
        }

        /* Subtle Tarmac Impact Camera Shake */
        @keyframes impactCameraShake {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(2.5px) translateX(-1px); }
          50% { transform: translateY(-2px) translateX(1px); }
          75% { transform: translateY(1px) translateX(-0.5px); }
        }
        .anim-impact-shake {
          animation: impactCameraShake 0.35s ease-out;
        }

        /* Star Constellation Twinkle */
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .anim-star-twinkle {
          animation: starTwinkle 2.4s ease-in-out infinite alternate;
        }

        /* Floating Pack Card Reveal */
        @keyframes cardFloatIn {
          0% { transform: translateY(12px) scale(0.92); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .anim-card-float {
          animation: cardFloatIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Circular Waveform Visualizer on Vinyl */
        @keyframes radialWavePulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        .anim-radial-wave {
          transform-origin: 26px 26px;
          animation: radialWavePulse 1.2s ease-in-out infinite alternate;
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .anim-impact-shake {
            animation: none !important;
          }
          .anim-star-twinkle {
            animation: none !important;
            opacity: 0.6 !important;
          }
          .anim-radial-wave {
            animation: none !important;
            opacity: 0.4 !important;
          }
          .anim-eq-bar-1, .anim-eq-bar-2, .anim-eq-bar-3, .anim-eq-bar-4, .anim-eq-bar-5, .anim-eq-bar-6 {
            animation: none !important;
            height: 5px !important;
          }
          .speed-streak-air {
            display: none !important;
          }
          .road-drive, .road-zoom, .road-reverse, .road-leaving {
            animation: none !important;
          }
          .scenery-drive, .scenery-zoom, .scenery-reverse, .scenery-leaving {
            animation: none !important;
          }
        }
        `
      }} />

      {/* Main Cinematic Scene Canvas: Mobile large & immersive, PC/Desktop widescreen & cinematic */}
      <div
        className={`relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto h-[300px] sm:h-[360px] md:h-[410px] lg:h-[450px] max-h-[50vh] flex flex-col justify-end items-center overflow-hidden rounded-xl bg-gradient-to-b from-[#08080c] via-[#0d0e14] to-[#07070a] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.95)] ${
          isImpactShaking ? 'anim-impact-shake' : ''
        }`}
      >
        {/* ========================================================================= */}
        {/* === ATMOSPHERIC NIGHT SKY: CYBERPUNK MOON & TWINKLING STARS === */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Cyberpunk Crescent Moon with Cyan Halo */}
          <svg
            viewBox="0 0 100 100"
            className="absolute top-2.5 right-6 sm:right-12 md:right-20 w-11 h-11 sm:w-15 sm:h-15 md:w-18 md:h-18 opacity-85"
          >
            <defs>
              <radialGradient id={ids.moonGlowAura} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00FF94" stopOpacity="0.4" />
                <stop offset="55%" stopColor="#00E5FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={ids.moonSurfaceGradient} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#E0F7FA" />
                <stop offset="70%" stopColor="#00FF94" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
              <mask id={ids.moonCrescentCutout}>
                <circle cx="50" cy="50" r="32" fill="#fff" />
                <circle cx="63" cy="42" r="28" fill="#000" />
              </mask>
            </defs>
            {/* Outer Halo */}
            <circle cx="50" cy="50" r="48" fill={`url(#${ids.moonGlowAura})`} />
            {/* Crescent Moon */}
            <circle cx="50" cy="50" r="30" fill={`url(#${ids.moonSurfaceGradient})`} mask={`url(#${ids.moonCrescentCutout})`} />
            {/* Geometric Craters */}
            <circle cx="34" cy="48" r="2.5" fill="#00B0FF" opacity="0.4" mask={`url(#${ids.moonCrescentCutout})`} />
            <circle cx="42" cy="62" r="3.2" fill="#00B0FF" opacity="0.35" mask={`url(#${ids.moonCrescentCutout})`} />
            <circle cx="38" cy="36" r="1.8" fill="#00B0FF" opacity="0.4" mask={`url(#${ids.moonCrescentCutout})`} />
            {/* Cyberpunk Scanlines */}
            <line x1="20" y1="44" x2="52" y2="44" stroke="#00FF94" strokeWidth="0.8" opacity="0.6" mask={`url(#${ids.moonCrescentCutout})`} />
            <line x1="24" y1="56" x2="58" y2="56" stroke="#00FF94" strokeWidth="0.8" opacity="0.6" mask={`url(#${ids.moonCrescentCutout})`} />
          </svg>

          {/* Twinkling Stars */}
          <svg className="absolute inset-0 w-full h-full" fill="none">
            {[
              { cx: '7%', cy: '12%', r: 1.1, delay: '0.1s' },
              { cx: '14%', cy: '22%', r: 0.8, delay: '0.8s' },
              { cx: '21%', cy: '9%', r: 1.3, delay: '1.3s' },
              { cx: '29%', cy: '17%', r: 0.8, delay: '0.4s' },
              { cx: '42%', cy: '11%', r: 1.0, delay: '1.7s' },
              { cx: '50%', cy: '21%', r: 0.8, delay: '0.2s' },
              { cx: '61%', cy: '13%', r: 1.2, delay: '1.0s' },
              { cx: '69%', cy: '7%', r: 0.9, delay: '0.6s' },
              { cx: '78%', cy: '25%', r: 0.8, delay: '1.4s' },
              { cx: '90%', cy: '15%', r: 1.1, delay: '0.3s' },
              { cx: '95%', cy: '27%', r: 0.8, delay: '1.8s' },
            ].map((star, i) => (
              <circle
                key={i}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#FFFFFF"
                className="anim-star-twinkle"
                style={{ animationDelay: star.delay }}
              />
            ))}
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 md:h-44 bg-gradient-to-b from-[#00FF94]/12 via-[#FFE600]/6 to-transparent blur-2xl md:blur-3xl" />
        </div>

        {/* ========================================================================= */}
        {/* === AUDIO FX TOGGLE BUTTON (Accessible Web Audio Synthesizer Control) === */}
        {/* ========================================================================= */}
        <button
          id={ids.soundFxToggle}
          type="button"
          onClick={toggleAudio}
          aria-label={isMuted ? 'Enable Sound FX' : 'Mute Sound FX'}
          aria-pressed={!isMuted}
          className="absolute top-2.5 left-2.5 z-40 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:border-[#00FF94]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF94] flex items-center gap-1.5 text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer"
          title={isMuted ? 'Click to enable Sound FX' : 'Click to mute Sound FX'}
        >
          <span className="text-xs" aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
          <span className="text-[9px] uppercase tracking-widest text-white/70">
            {isMuted ? 'SOUND OFF' : 'SOUND ON'}
          </span>
        </button>

        {/* ========================================================================= */}
        {/* === PARALLAX BACKGROUND SCENERY (Forward, Reverse, and Frozen on Stop) === */}
        {/* ========================================================================= */}
        <div
          className={`absolute bottom-6 sm:bottom-7 md:bottom-10 lg:bottom-12 left-0 h-40 sm:h-46 md:h-52 lg:h-58 flex w-[200%] select-none pointer-events-none z-0 ${
            isDriving
              ? 'scenery-drive'
              : isZoomingPast
                ? 'scenery-zoom'
                : isReversing
                  ? 'scenery-reverse'
                  : isCarLeaving
                    ? 'scenery-leaving'
                    : ''
          } ${isParked || isDeliveredIdle ? 'scenery-paused' : ''}`}
          style={{ willChange: 'transform' }}
        >
          {/* Scenery Block A */}
          <svg className="w-1/2 h-full" viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id={ids.bungalowGlass} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE600" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF9900" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Distant Skyline Silhouettes */}
            <rect x="0" y="55" width="1200" height="25" fill="#07080c" />
            <path d="M 0 55 L 60 42 L 140 55 L 240 38 L 320 55 L 480 32 L 540 55 L 720 40 L 820 55 L 980 36 L 1080 55 L 1200 45" stroke="#181a24" strokeWidth="1" fill="none" opacity="0.4" />

            {/* Modern Architectural Sound Villa 1 */}
            <g transform="translate(60, 14)">
              <rect x="0" y="24" width="90" height="42" fill="#13151f" stroke="#000" strokeWidth="1" />
              <polygon points="-8,24 98,24 82,14 6,14" fill="#1e2130" stroke="#FFE600" strokeWidth="0.8" />
              <rect x="10" y="28" width="22" height="15" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
              <rect x="42" y="28" width="22" height="15" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
              <line x1="8" y1="46" x2="82" y2="46" stroke="#00FF94" strokeWidth="0.8" />
              <line x1="12" y1="46" x2="12" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="28" y1="46" x2="28" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="44" y1="46" x2="44" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="60" y1="46" x2="60" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="76" y1="46" x2="76" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <rect x="28" y="52" width="16" height="14" rx="1" fill="#0a0b10" stroke="#FFE600" strokeWidth="0.5" />
            </g>

            {/* Modern Streetlight with Soft Volumetric Glow */}
            <g transform="translate(180, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 46,64 -4,64" fill="#FFE600" opacity="0.08" />
            </g>

            {/* Palm Tree 1 */}
            <g transform="translate(230, 10)">
              <path d="M 12 70 Q 16 35 22 14" stroke="#1c1e28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22 14 Q 10 16 2 24" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 12 8 8 0" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 28 6 38 4" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 34 16 42 22" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            {/* SamplesWala Sound Studio Landmark */}
            <g transform="translate(340, 6)">
              <rect x="0" y="28" width="130" height="46" fill="#11131c" stroke="#000" strokeWidth="1" />
              <rect x="-6" y="24" width="142" height="5" rx="1" fill="#1f2230" stroke="#00FF94" strokeWidth="0.8" />
              <rect x="18" y="10" width="94" height="14" rx="2" fill="#08090e" stroke="#00FF94" strokeWidth="1" />
              <text x="65" y="20" fill="#00FF94" fontSize="6.5" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
                SAMPLES WALA LABS
              </text>
              <rect x="12" y="34" width="30" height="18" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#00FF94" strokeWidth="0.5" />
              <rect x="50" y="34" width="30" height="18" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#00FF94" strokeWidth="0.5" />
              <rect x="88" y="34" width="30" height="18" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#00FF94" strokeWidth="0.5" />
              <line x1="16" y1="43" x2="38" y2="43" stroke="#FFE600" strokeWidth="1" />
              <line x1="54" y1="43" x2="76" y2="43" stroke="#00FF94" strokeWidth="1" />
              <line x1="92" y1="43" x2="114" y2="43" stroke="#00E5FF" strokeWidth="1" />
            </g>

            {/* Contemporary Luxury Villa 3 */}
            <g transform="translate(560, 16)">
              <polygon points="0,26 65,12 85,26" fill="#1c1f2b" stroke="#000" strokeWidth="1" />
              <rect x="6" y="26" width="74" height="38" fill="#13151e" stroke="#000" strokeWidth="1" />
              <rect x="14" y="32" width="24" height="14" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
              <rect x="46" y="32" width="24" height="14" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
            </g>

            {/* Streetlight 2 */}
            <g transform="translate(680, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 46,64 -4,64" fill="#FFE600" opacity="0.08" />
            </g>

            {/* Palm Tree 2 */}
            <g transform="translate(740, 10)">
              <path d="M 12 70 Q 14 38 20 14" stroke="#1c1e28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 20 14 Q 8 16 0 24" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 20 14 Q 10 8 6 0" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 20 14 Q 26 6 36 4" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 20 14 Q 32 16 40 22" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            {/* Modern Villa 4 */}
            <g transform="translate(860, 14)">
              <rect x="0" y="24" width="80" height="42" fill="#13151f" stroke="#000" strokeWidth="1" />
              <polygon points="-6,24 86,24 72,14 6,14" fill="#1e2130" stroke="#FFE600" strokeWidth="0.8" />
              <rect x="10" y="28" width="20" height="14" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
              <rect x="38" y="28" width="20" height="14" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
            </g>

            {/* Electric / Telegraph Pole */}
            <g transform="translate(1000, 20)">
              <line x1="8" y1="60" x2="8" y2="4" stroke="#2b2d3d" strokeWidth="1.5" />
              <line x1="0" y1="8" x2="16" y2="8" stroke="#2b2d3d" strokeWidth="1.5" />
              <line x1="2" y1="14" x2="14" y2="14" stroke="#2b2d3d" strokeWidth="1" />
              <circle cx="0" cy="8" r="1" fill="#00FF94" />
              <circle cx="16" cy="8" r="1" fill="#00FF94" />
            </g>
          </svg>

          {/* Scenery Block B (Seamless Duplicate) */}
          <svg className="w-1/2 h-full" viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none">
            <rect x="0" y="55" width="1200" height="25" fill="#07080c" />
            <path d="M 0 55 L 60 42 L 140 55 L 240 38 L 320 55 L 480 32 L 540 55 L 720 40 L 820 55 L 980 36 L 1080 55 L 1200 45" stroke="#181a24" strokeWidth="1" fill="none" opacity="0.4" />

            <g transform="translate(60, 14)">
              <rect x="0" y="24" width="90" height="42" fill="#13151f" stroke="#000" strokeWidth="1" />
              <polygon points="-8,24 98,24 82,14 6,14" fill="#1e2130" stroke="#FFE600" strokeWidth="0.8" />
              <rect x="10" y="28" width="22" height="15" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
              <rect x="42" y="28" width="22" height="15" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
              <line x1="8" y1="46" x2="82" y2="46" stroke="#00FF94" strokeWidth="0.8" />
            </g>

            <g transform="translate(180, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 46,64 -4,64" fill="#FFE600" opacity="0.08" />
            </g>

            <g transform="translate(230, 10)">
              <path d="M 12 70 Q 16 35 22 14" stroke="#1c1e28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22 14 Q 10 16 2 24" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 12 8 8 0" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 28 6 38 4" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 34 16 42 22" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            <g transform="translate(340, 6)">
              <rect x="0" y="28" width="130" height="46" fill="#11131c" stroke="#000" strokeWidth="1" />
              <rect x="-6" y="24" width="142" height="5" rx="1" fill="#1f2230" stroke="#00FF94" strokeWidth="0.8" />
              <rect x="18" y="10" width="94" height="14" rx="2" fill="#08090e" stroke="#00FF94" strokeWidth="1" />
              <text x="65" y="20" fill="#00FF94" fontSize="6.5" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
                SAMPLES WALA LABS
              </text>
              <rect x="12" y="34" width="30" height="18" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#00FF94" strokeWidth="0.5" />
              <rect x="50" y="34" width="30" height="18" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#00FF94" strokeWidth="0.5" />
              <rect x="88" y="34" width="30" height="18" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#00FF94" strokeWidth="0.5" />
            </g>

            <g transform="translate(560, 16)">
              <polygon points="0,26 65,12 85,26" fill="#1c1f2b" stroke="#000" strokeWidth="1" />
              <rect x="6" y="26" width="74" height="38" fill="#13151e" stroke="#000" strokeWidth="1" />
              <rect x="14" y="32" width="24" height="14" rx="1" fill={`url(#${ids.bungalowGlass})`} stroke="#FFE600" strokeWidth="0.5" />
            </g>

            <g transform="translate(680, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
            </g>

            <g transform="translate(740, 10)">
              <path d="M 12 70 Q 14 38 20 14" stroke="#1c1e28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 20 14 Q 8 16 0 24" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            <g transform="translate(860, 14)">
              <rect x="0" y="24" width="80" height="42" fill="#13151f" stroke="#000" strokeWidth="1" />
              <polygon points="-6,24 86,24 72,14 6,14" fill="#1e2130" stroke="#FFE600" strokeWidth="0.8" />
            </g>

            <g transform="translate(1000, 20)">
              <line x1="8" y1="60" x2="8" y2="4" stroke="#2b2d3d" strokeWidth="1.5" />
              <line x1="0" y1="8" x2="16" y2="8" stroke="#2b2d3d" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Speed Streaks in the Air */}
        {isDriving && (
          <div className="speed-streak-air absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[1.5px] bg-gradient-to-r from-transparent via-[#00FF94] to-white rounded-full opacity-0"
                style={{
                  top: `${18 + (i * 9)}%`,
                  width: `${60 + (i % 3) * 45}px`,
                  left: '100%',
                  animation: `speedStreakMove ${0.6 + (i * 0.08)}s cubic-bezier(0.1, 0.7, 0.2, 1) infinite`,
                  animationDelay: `${i * 0.12}s`
                }}
              />
            ))}
          </div>
        )}

        {/* SamplesWala Hologram Exhaust Trail when Car Launches */}
        {isCarLeaving && (
          <div className="absolute left-[12%] sm:left-[18%] bottom-14 sm:bottom-16 md:bottom-20 z-25 pointer-events-none animate-pulse select-none">
            <div className="px-2.5 sm:px-3 py-1 bg-black/85 border border-[#00FF94] rounded-md shadow-[0_0_18px_rgba(0,255,148,0.7)] backdrop-blur-md">
              <p className="text-[8.5px] sm:text-[10px] md:text-[11px] font-mono font-black tracking-widest text-[#00FF94] flex items-center gap-1.5 whitespace-nowrap">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-ping" />
                SAMPLESWALA // SOUND DELIVERED.
              </p>
            </div>
          </div>
        )}

        {/* The Animated Hypercar Stage (Hidden once car has zoomed off) */}
        {!isDeliveredIdle && (
          <div
            className={`relative z-20 w-full flex justify-center ${
              isDriving
                ? 'animate-[driveCruise_2.5s_ease-in-out_infinite]'
                : isZoomingPast
                  ? 'animate-[hyperCarZoomPast_0.7s_cubic-bezier(0.4,0,0.2,1)_forwards]'
                  : isReversing
                    ? 'animate-[hyperCarReverseScreech_1.5s_cubic-bezier(0.16,0.85,0.25,1)_forwards]'
                    : isCarLeaving
                      ? 'animate-[hyperCarLaunchOut_1.0s_cubic-bezier(0.5,0.05,0.9,0.3)_forwards]'
                      : ''
            }`}
          >
            <div
              className={`relative ${
                isDriving || isCarLeaving || isZoomingPast
                  ? 'anim-acceleration-squat'
                  : isReversing
                    ? 'anim-brake-dive'
                    : isParked
                      ? ''
                      : 'anim-chassis-vibe'
              }`}
            >
              {/* Volumetric Tire Skid Smoke during Reverse Screech Halt */}
              {isReversing && (
                <div className="absolute -bottom-2 left-0 right-0 pointer-events-none z-30">
                  <div className="absolute left-[30%] -top-3 w-8 h-8 rounded-full bg-white/40 blur-md anim-skid-smoke" />
                  <div className="absolute left-[68%] -top-3 w-9 h-9 rounded-full bg-white/40 blur-md anim-skid-smoke" style={{ animationDelay: '0.1s' }} />
                </div>
              )}

              {/* SVG Hypercar Model */}
              <svg
                viewBox="0 0 520 160"
                className="w-[340px] xs:w-[380px] sm:w-[440px] md:w-[620px] lg:w-[740px] xl:w-[840px] max-w-full h-auto overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={ids.bodyCarbonMetal} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#08080a" />
                    <stop offset="25%" stopColor="#181920" />
                    <stop offset="50%" stopColor="#22242e" />
                    <stop offset="75%" stopColor="#13141a" />
                    <stop offset="100%" stopColor="#252733" />
                  </linearGradient>

                  <linearGradient id={ids.canopyGlass} x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.55" />
                    <stop offset="45%" stopColor="#002b36" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#00FF94" stopOpacity="0.4" />
                  </linearGradient>

                  <linearGradient id={ids.headlightVolumetric} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#00FF94" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#FFE600" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#FFE600" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id={ids.roadSpecularPool} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#00FF94" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id={ids.rimForgedAlloy} cx="45%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="#444654" />
                    <stop offset="45%" stopColor="#181920" />
                    <stop offset="85%" stopColor="#0a0a0d" />
                    <stop offset="100%" stopColor="#00FF94" />
                  </radialGradient>

                  <radialGradient id={ids.brakeRotor} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#888c99" />
                    <stop offset="65%" stopColor="#3a3d47" />
                    <stop offset="100%" stopColor="#1a1a20" />
                  </radialGradient>

                  <linearGradient id={ids.plasmaFireOuter} x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#00F0FF" />
                    <stop offset="40%" stopColor="#0066FF" />
                    <stop offset="70%" stopColor="#FF0077" />
                    <stop offset="90%" stopColor="#FF9900" />
                    <stop offset="100%" stopColor="#FFE600" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id={ids.plasmaFireCore} x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#CCFFFF" />
                    <stop offset="70%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#0044FF" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id={ids.goldVinylMaster} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff8db" />
                    <stop offset="25%" stopColor="#d4af37" />
                    <stop offset="55%" stopColor="#aa820a" />
                    <stop offset="80%" stopColor="#664d00" />
                    <stop offset="95%" stopColor="#FFE600" />
                    <stop offset="100%" stopColor="#111111" />
                  </radialGradient>
                </defs>

                {/* Tire Ground Shadows */}
                <ellipse cx="178" cy="145" rx="26" ry="3.5" fill="#000000" opacity="0.9" />
                <ellipse cx="366" cy="145" rx="26" ry="3.5" fill="#000000" opacity="0.9" />

                {/* Rubber Brake Skid Marks */}
                {(isReversing || isParked) && (
                  <g opacity="0.6">
                    <line x1="140" y1="144.5" x2="190" y2="144.5" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                    <line x1="330" y1="144.5" x2="380" y2="144.5" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}

                {/* Neon Underglow */}
                <ellipse cx="270" cy="145" rx="160" ry="5.5" fill="#00FF94" opacity="0.65" />
                <ellipse cx="270" cy="145" rx="90" ry="3" fill="#FFE600" opacity="0.5" />

                {/* Headlight Beam */}
                <polygon
                  points="435,102 535,78 535,142 435,116"
                  fill={`url(#${ids.headlightVolumetric})`}
                  opacity="0.8"
                />
                <ellipse cx="490" cy="136" rx="40" ry="4" fill={`url(#${ids.roadSpecularPool})`} />

                {/* Nitro Exhaust Flames */}
                {(isDriving || isCarLeaving || isZoomingPast) && (
                  <g>
                    <polygon
                      points="122,112 30,98 75,112 10,114 75,116 30,130 122,116"
                      fill={`url(#${ids.plasmaFireOuter})`}
                      className="anim-flame-outer"
                    />
                    <polygon
                      points="122,113 55,107 90,113 35,114 90,115 55,121 122,115"
                      fill={`url(#${ids.plasmaFireCore})`}
                      className="anim-flame-core"
                    />
                    <circle cx="120" cy="114" r="5" fill="#FFFFFF" />
                    <circle cx="112" cy="114" r="7.5" fill="#00F0FF" opacity="0.85" />
                    <ellipse cx="98" cy="114" rx="4" ry="2" fill="#FFFFFF" opacity="0.9" />
                    <ellipse cx="78" cy="114" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.75" />
                  </g>
                )}

                {/* Hypercar Rear GT Spoiler */}
                <path d="M 148 84 L 126 56 L 134 56 L 154 84 Z" fill="#0a0a0d" stroke="#000" strokeWidth="1.5" />
                <path d="M 166 84 L 148 56 L 156 56 L 172 84 Z" fill="#0a0a0d" stroke="#000" strokeWidth="1.5" />
                <path
                  d="M 112 55 C 125 53, 168 53, 178 57 L 176 61 C 166 58, 125 58, 114 60 Z"
                  fill="#FFE600"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                <polygon points="108,48 122,48 118,66 104,66" fill="#08080a" stroke="#FFE600" strokeWidth="1.2" />
                <rect x="109" y="52" width="2" height="10" fill="#00FF94" />

                {/* Chassis Bodywork */}
                <polygon points="120,122 138,122 135,127 116,127" fill="#050507" stroke="#000" strokeWidth="1" />
                <polygon points="138,122 156,122 153,127 136,127" fill="#050507" stroke="#000" strokeWidth="1" />

                <path
                  d="M 124 122 
                     L 128 98 
                     C 134 84, 155 78, 175 76 
                     L 225 58 
                     C 260 55, 305 55, 335 68 
                     L 395 86 
                     C 418 90, 435 98, 445 106 
                     L 448 120 
                     L 435 124 
                     C 425 116, 400 116, 390 124 
                     L 205 124 
                     C 198 116, 162 116, 152 124 
                     Z"
                  fill={`url(#${ids.bodyCarbonMetal})`}
                  stroke="#000000"
                  strokeWidth="2.5"
                />

                <path
                  d="M 132 96 C 160 84, 210 74, 260 74 L 370 86 L 438 104"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.35"
                />

                {/* Exhausts */}
                <rect x="120" y="108" width="9" height="11" rx="2" fill="#22242e" stroke="#000" strokeWidth="1.2" />
                <ellipse cx="122" cy="114" rx="2.5" ry="4.5" fill="#08080a" />

                {/* Radiator Scoop */}
                <path
                  d="M 215 88 L 260 88 L 255 108 L 220 108 Z"
                  fill="#050508"
                  stroke="#00FF94"
                  strokeWidth="1"
                />
                <line x1="225" y1="92" x2="225" y2="104" stroke="#1c1d26" strokeWidth="1" />
                <line x1="235" y1="92" x2="235" y2="104" stroke="#1c1d26" strokeWidth="1" />
                <line x1="245" y1="92" x2="245" y2="104" stroke="#1c1d26" strokeWidth="1" />

                {/* Carbon Canards & Splitter */}
                <polygon points="432,118 456,118 452,126 428,126" fill="#050508" stroke="#FFE600" strokeWidth="1.5" />
                <polygon points="410,110 442,110 438,118 406,118" fill="#00FF94" stroke="#000" strokeWidth="1" />

                {/* Quad Projector Headlights */}
                <polygon points="424,102 444,106 438,112 418,108" fill="#05050a" stroke="#00E5FF" strokeWidth="1.2" />
                <circle cx="426" cy="105" r="2" fill="#00E5FF" />
                <circle cx="432" cy="106.5" r="2" fill="#00E5FF" />
                <circle cx="438" cy="108" r="2.2" fill="#FFFFFF" />
                <line x1="422" y1="102" x2="444" y2="106" stroke="#00FF94" strokeWidth="1.8" strokeLinecap="round" />

                {/* Racing Livery */}
                <polygon points="170,94 405,94 400,99 170,99" fill="#FFE600" opacity="0.9" />
                <polygon points="175,99 400,99 395,103 175,103" fill="#00FF94" opacity="0.9" />
                <g transform="translate(268, 97)">
                  <text x="0" y="5" fill="#000000" fontSize="7" fontWeight="900" fontStyle="italic" textAnchor="middle">
                    SAMPLES<tspan fill="#FFFFFF">WALA</tspan>
                  </text>
                </g>

                {/* ========================================================================= */}
                {/* === FIXED FRONT WINDSHIELD & A-PILLAR === */}
                {/* ========================================================================= */}
                <path
                  d="M 304 67 
                     C 324 67, 348 74, 378 88 
                     L 304 88 
                     Z"
                  fill={`url(#${ids.canopyGlass})`}
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                <line x1="310" y1="70" x2="370" y2="86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <line x1="304" y1="67" x2="378" y2="88" stroke="#111216" strokeWidth="3" />

                {/* ========================================================================= */}
                {/* === SOUND VAULT LUXURY SUPERCAR CABIN INTERIOR === */}
                {/* ========================================================================= */}
                <path d="M 230 65 L 305 67 L 305 106 L 230 106 Z" fill="#090a10" />
                <path d="M 232 67 L 304 69" stroke="#00FF94" strokeWidth="1" opacity="0.7" />
                <line x1="233" y1="66" x2="250" y2="100" stroke="#1c1e28" strokeWidth="2.5" strokeLinecap="round" />

                {/* Sports Racing Bucket Seat with Neon-Yellow Quilted Twin Stitching */}
                <g transform="translate(236, 66)">
                  <path d="M 6 0 C 14 0, 18 4, 18 12 L 17 28 L 2 28 C 2 18, 2 8, 6 0 Z" fill="#12131a" stroke="#000" strokeWidth="1" />
                  <rect x="7" y="1" width="10" height="7" rx="2" fill="#1c1e28" stroke="#FFE600" strokeWidth="0.8" />
                  <rect x="9" y="3.5" width="2" height="2" rx="0.5" fill="#000" />
                  <rect x="13" y="3.5" width="2" height="2" rx="0.5" fill="#000" />

                  <rect x="6" y="9" width="12" height="15" rx="2" fill="#222533" stroke="#000" strokeWidth="0.8" />
                  <line x1="7" y1="12" x2="17" y2="12" stroke="#FFE600" strokeWidth="0.9" />
                  <line x1="7" y1="15" x2="17" y2="15" stroke="#FFE600" strokeWidth="0.9" />
                  <line x1="7" y1="18" x2="17" y2="18" stroke="#FFE600" strokeWidth="0.9" />
                  <line x1="7" y1="21" x2="17" y2="21" stroke="#FFE600" strokeWidth="0.9" />

                  <path d="M 2 24 L 22 24 C 23 28, 20 30, 18 30 L 2 30 Z" fill="#1c1e28" stroke="#000" strokeWidth="0.8" />
                  <line x1="4" y1="27" x2="20" y2="27" stroke="#00FF94" strokeWidth="0.8" />

                  <path d="M 10 5 L 8 24" stroke="#FF0055" strokeWidth="1.2" />
                  <path d="M 14 5 L 16 24" stroke="#FF0055" strokeWidth="1.2" />
                  <circle cx="12" cy="22" r="1.5" fill="#FFE600" stroke="#000" strokeWidth="0.5" />
                </g>

                {/* SOUND VAULT LED SPECTRUM EQUALIZER BARS (Inside Hypercar Bulkhead) */}
                <g transform="translate(262, 74)">
                  <rect x="0" y="0" width="22" height="15" rx="1.5" fill="#040508" stroke="#00FF94" strokeWidth="0.6" />
                  <rect x="2" y="3" width="2" height="9" fill="#00FF94" className="anim-eq-bar-1" />
                  <rect x="5.5" y="3" width="2" height="9" fill="#00FF94" className="anim-eq-bar-2" />
                  <rect x="9" y="3" width="2" height="9" fill="#FFE600" className="anim-eq-bar-3" />
                  <rect x="12.5" y="3" width="2" height="9" fill="#FFE600" className="anim-eq-bar-4" />
                  <rect x="16" y="3" width="2" height="9" fill="#00E5FF" className="anim-eq-bar-5" />
                  <rect x="18.5" y="3" width="1.5" height="9" fill="#FF0055" className="anim-eq-bar-6" />
                </g>

                {/* Flat-Bottom F1 Alcantara Steering Wheel */}
                <g transform="translate(288, 77)">
                  <rect x="1" y="5" width="8" height="3" fill="#14151c" />
                  <path d="M 0 3 C 0 -3, 8 -3, 8 3 L 8 11 C 6 13, 2 13, 0 11 Z" fill="none" stroke="#2b2e3d" strokeWidth="2" strokeLinecap="round" />
                  <rect x="3" y="-3.5" width="2" height="1.8" fill="#FFE600" />
                  <circle cx="4" cy="4" r="2.5" fill="#FFE600" stroke="#000" strokeWidth="0.6" />
                  <line x1="-1" y1="0" x2="-1" y2="8" stroke="#00FF94" strokeWidth="1" />
                </g>

                {/* Digital Cockpit Telemetry HUD */}
                <g transform="translate(294, 71)">
                  <rect x="0" y="0" width="10" height="6" rx="1" fill="#000000" stroke="#00FF94" strokeWidth="0.6" />
                  <path d="M 1.5 4.5 A 3 3 0 0 1 7.5 2" fill="none" stroke="#00FF94" strokeWidth="0.8" />
                  <circle cx="7.5" cy="2" r="0.6" fill="#FFE600" />
                  <text x="5" y="4.8" fill="#FFFFFF" fontSize="2.5" fontWeight="900" textAnchor="middle">24B</text>
                </g>

                {/* ========================================================================= */}
                {/* === UNIFIED SCISSOR DOOR (Lifts frameless window + carbon panel together) === */}
                {/* ========================================================================= */}
                <g className={
                  (phase === 'door_up' || phase === 'dude_step_out' || phase === 'drop_parcel')
                    ? 'anim-scissor-open'
                    : (phase === 'hop_in' || phase === 'car_leaving')
                      ? 'anim-scissor-close'
                      : ''
                }>
                  {/* Frameless Tinted Window Glass */}
                  <path
                    d="M 232 66 L 304 67 L 304 84 L 232 84 Z"
                    fill={`url(#${ids.canopyGlass})`}
                    stroke="#FFE600"
                    strokeWidth="1.2"
                    opacity="0.9"
                  />
                  <line x1="238" y1="69" x2="300" y2="80" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

                  {/* Lower Sculpted Carbon Door Body Panel */}
                  <path
                    d="M 230 84 L 305 84 L 305 106 L 230 106 Z"
                    fill={`url(#${ids.bodyCarbonMetal})`}
                    stroke="#FFE600"
                    strokeWidth="1.5"
                  />
                  <line x1="234" y1="94" x2="302" y2="94" stroke="#00FF94" strokeWidth="1.5" />
                  <polygon points="303,80 317,78 315,84 302,84" fill="#0a0a0d" stroke="#000" strokeWidth="1" />
                  <circle cx="315" cy="81" r="1.5" fill="#00FF94" />
                  <rect x="268" y="88" width="12" height="3" rx="1.5" fill="#FFE600" stroke="#000" strokeWidth="0.6" />
                </g>

                {/* === HIGH-PERFORMANCE 3D FORGED ALLOY WHEELS === */}
                {/* Rear Wheel */}
                <path d="M 152 122 A 26 26 0 0 1 204 122 Z" fill="#000000" />
                <g transform="translate(178, 122)">
                  <circle cx="0" cy="0" r="23" fill="#0d0d12" stroke="#000000" strokeWidth="3" />
                  <circle cx="0" cy="0" r="20.5" fill="none" stroke="#222430" strokeWidth="1" strokeDasharray="3,2" />
                  <circle cx="0" cy="0" r="16.5" fill={`url(#${ids.brakeRotor})`} stroke="#111" strokeWidth="1" />
                  <path d="M -15 -8 A 16 16 0 0 1 -7 -15 L -5 -11 A 12 12 0 0 0 -11 -6 Z" fill="#00FF94" stroke="#000" strokeWidth="1" />

                  <g>
                    {isWheelsSpinning && (
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 0 0"
                        to={isReversing ? "-360 0 0" : "360 0 0"}
                        dur={isCarLeaving ? "0.1s" : "0.2s"}
                        repeatCount="indefinite"
                      />
                    )}
                    <circle cx="0" cy="0" r="14.5" fill={`url(#${ids.rimForgedAlloy})`} stroke="#FFE600" strokeWidth="1.2" />
                    {[0, 72, 144, 216, 288].map((angle) => (
                      <g key={angle} transform={`rotate(${angle})`}>
                        <line x1="0" y1="-2" x2="0" y2="-13" stroke="#CCCCCC" strokeWidth="2.2" strokeLinecap="round" />
                        <line x1="-2" y1="-5" x2="-4" y2="-12" stroke="#666677" strokeWidth="1.2" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="4.5" fill="#00FF94" stroke="#000000" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2" fill="#FFE600" />
                  </g>
                </g>

                {/* Front Wheel */}
                <path d="M 340 122 A 26 26 0 0 1 392 122 Z" fill="#000000" />
                <g transform="translate(366, 122)">
                  <circle cx="0" cy="0" r="23" fill="#0d0d12" stroke="#000000" strokeWidth="3" />
                  <circle cx="0" cy="0" r="20.5" fill="none" stroke="#222430" strokeWidth="1" strokeDasharray="3,2" />
                  <circle cx="0" cy="0" r="16.5" fill={`url(#${ids.brakeRotor})`} stroke="#111" strokeWidth="1" />
                  <path d="M -15 -8 A 16 16 0 0 1 -7 -15 L -5 -11 A 12 12 0 0 0 -11 -6 Z" fill="#00FF94" stroke="#000" strokeWidth="1" />

                  <g>
                    {isWheelsSpinning && (
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 0 0"
                        to={isReversing ? "-360 0 0" : "360 0 0"}
                        dur={isCarLeaving ? "0.1s" : "0.2s"}
                        repeatCount="indefinite"
                      />
                    )}
                    <circle cx="0" cy="0" r="14.5" fill={`url(#${ids.rimForgedAlloy})`} stroke="#FFE600" strokeWidth="1.2" />
                    {[0, 72, 144, 216, 288].map((angle) => (
                      <g key={angle} transform={`rotate(${angle})`}>
                        <line x1="0" y1="-2" x2="0" y2="-13" stroke="#CCCCCC" strokeWidth="2.2" strokeLinecap="round" />
                        <line x1="-2" y1="-5" x2="-4" y2="-12" stroke="#666677" strokeWidth="1.2" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="4.5" fill="#00FF94" stroke="#000000" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2" fill="#FFE600" />
                  </g>
                </g>

                {/* ========================================================================= */}
                {/* === AUTHENTIC JOHNNY CHARACTER (Steps out, drops crate, Gen-Z speech) === */}
                {/* ========================================================================= */}
                {mode === 'return' && (phase === 'dude_step_out' || phase === 'drop_parcel' || phase === 'hop_in') && (
                  <g className={
                    phase === 'dude_step_out'
                      ? 'anim-driver-step'
                      : phase === 'drop_parcel'
                        ? 'anim-driver-drop'
                        : phase === 'hop_in'
                          ? 'anim-driver-hop'
                          : ''
                  }>
                    {/* Shadow under Johnny */}
                    <ellipse cx="68" cy="138" rx="22" ry="3.5" fill="#000" opacity="0.8" />

                    {/* Animated Walking/Striding Legs */}
                    <g className={phase === 'dude_step_out' || phase === 'hop_in' ? 'anim-leg-left' : ''}>
                      <path d="M 58 102 L 53 126 L 47 136" stroke="#1d3557" strokeWidth="8" strokeLinecap="round" />
                      <polygon points="41,137 54,137 54,131 41,131" fill="#08080c" stroke="#000" strokeWidth="1.5" />
                    </g>
                    <g className={phase === 'dude_step_out' || phase === 'hop_in' ? 'anim-leg-right' : ''}>
                      <path d="M 76 102 L 81 126 L 87 136" stroke="#25446e" strokeWidth="8" strokeLinecap="round" />
                      <polygon points="83,137 96,137 96,131 83,131" fill="#08080c" stroke="#000" strokeWidth="1.5" />
                    </g>
                    <rect x="55" y="100" width="24" height="4" fill="#111116" stroke="#000" strokeWidth="0.8" />
                    <rect x="64" y="99.5" width="6" height="5" rx="1" fill="#FFE600" stroke="#000" strokeWidth="1" />

                    {/* Upper Torso & Head */}
                    <g className={dialogueStep === 1 ? 'anim-body-groove' : ''}>
                      {/* Massive Buff V-Taper Chest in Tight Black T-Shirt */}
                      <path
                        d="M 38 68 
                           C 48 63, 86 63, 96 68 
                           L 79 101 
                           L 55 101 
                           Z"
                        fill="#0a0a0f"
                        stroke="#000000"
                        strokeWidth="2.5"
                      />
                      <path d="M 52 74 Q 67 80 82 74" stroke="#232533" strokeWidth="2" fill="none" />
                      <line x1="67" y1="74" x2="67" y2="92" stroke="#232533" strokeWidth="2" />

                      {/* Golden Chain & "SW" Medallion */}
                      <path d="M 54 70 Q 67 84 80 70" stroke="#FFE600" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <circle cx="67" cy="85" r="4.5" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                      <text x="67" y="87.5" fill="#000" fontSize="5" fontWeight="900" textAnchor="middle">SW</text>

                      {/* Chiseled Jaw & Smirk */}
                      <polygon points="58,50 76,50 73,66 61,66" fill="#F4A982" stroke="#000" strokeWidth="1.5" />
                      <path d="M 61 66 L 67 69 L 73 66" fill="#F4A982" stroke="#000" strokeWidth="1.5" />
                      <path d="M 64 62 Q 67 65 72 61" stroke="#8A3B14" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                      {/* Pitch-Black Sunglasses with White Glare Streak */}
                      <rect x="54" y="47" width="12" height="9" rx="1.5" fill="#050505" stroke="#000" strokeWidth="1.5" />
                      <rect x="68" y="47" width="12" height="9" rx="1.5" fill="#050505" stroke="#000" strokeWidth="1.5" />
                      <rect x="64" y="49" width="6" height="3" fill="#050505" />
                      <line x1="56" y1="49" x2="63" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="70" y1="49" x2="77" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Giant Golden Pompadour Hair */}
                      <path
                        d="M 52 48 
                           C 45 30, 48 14, 64 10 
                           C 80 7, 96 15, 93 34 
                           C 91 42, 85 48, 79 50 
                           Z"
                        fill="#FFE600"
                        stroke="#000000"
                        strokeWidth="2.5"
                      />
                      <path d="M 60 20 C 72 17, 84 24, 82 35" stroke="#CCA000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 64 28 C 72 27, 80 34, 78 42" stroke="#CCA000" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>

                    {/* Step Out: Holding Vault Crate in Hands */}
                    {phase === 'dude_step_out' && (
                      <>
                        <path d="M 46 72 L 34 86 L 26 90" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 88 72 L 68 86 L 48 90" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                        <g transform="translate(14, 78)">
                          <rect x="0" y="0" width="34" height="24" rx="2" fill="#FFE600" stroke="#000" strokeWidth="2.5" />
                          <line x1="17" y1="0" x2="17" y2="24" stroke="#FF5C00" strokeWidth="4" />
                          <line x1="0" y1="12" x2="34" y2="12" stroke="#FF5C00" strokeWidth="4" />
                          <rect x="4" y="4" width="13" height="7" fill="#000" rx="1" />
                          <text x="5.5" y="9.5" fill="#00FF94" fontSize="5" fontWeight="900">VAULT</text>
                        </g>
                      </>
                    )}

                    {/* Dropped Parcel: Gen-Z Dialogue Bubbles One-by-One with Audio Meter Accents */}
                    {phase === 'drop_parcel' && (
                      <>
                        {/* Pose 1 (Beat 1): Wild hand wave while speaking Gen-Z Line 1 */}
                        {dialogueStep === 1 && (
                          <g>
                            <path d="M 46 72 L 30 84 L 42 96" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                            <g className="anim-funky-wave">
                              <path d="M 88 72 L 104 58 L 118 64" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                              <circle cx="120" cy="64" r="5" fill="#F4A982" />
                            </g>
                            {/* Dialogue Box 1 (Gen-Z) */}
                            <g key="dialogue-1" className="anim-bubble-pop" transform="translate(90, 4)">
                              <polygon points="0,26 -14,34 4,30" fill="#0d0e14" stroke="#FFE600" strokeWidth="2" />
                              <rect x="0" y="0" width="186" height="34" rx="7" fill="#0d0e14" stroke="#FFE600" strokeWidth="2" />
                              {/* Mini Audio Equalizer Accent */}
                              <rect x="168" y="12" width="2" height="10" fill="#FFE600" className="anim-eq-bar-1" />
                              <rect x="172" y="12" width="2" height="10" fill="#00FF94" className="anim-eq-bar-2" />
                              <rect x="176" y="12" width="2" height="10" fill="#FFE600" className="anim-eq-bar-3" />
                              <text x="10" y="21.5" fill="#FFE600" fontSize="8.6" fontWeight="900" fontFamily="monospace">
                                YO CHILL FAM! 💀 My bad on that drift...
                              </text>
                            </g>
                          </g>
                        )}

                        {/* Pose 2 (Beat 2): Hair scratch with Gen-Z Line 2 */}
                        {dialogueStep === 2 && (
                          <g>
                            <path d="M 46 72 L 30 84 L 42 96" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                            <g className="anim-hair-scratch">
                              <path d="M 88 72 L 86 48 L 74 36" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                              <circle cx="74" cy="34" r="4.5" fill="#F4A982" />
                            </g>
                            {/* Dialogue Box 2 (Gen-Z) */}
                            <g key="dialogue-2" className="anim-bubble-pop" transform="translate(86, 4)">
                              <polygon points="0,26 -14,34 4,30" fill="#0d0e14" stroke="#FFE600" strokeWidth="2" />
                              <rect x="0" y="0" width="194" height="34" rx="7" fill="#0d0e14" stroke="#FFE600" strokeWidth="2" />
                              <rect x="176" y="12" width="2" height="10" fill="#00FF94" className="anim-eq-bar-2" />
                              <rect x="180" y="12" width="2" height="10" fill="#FFE600" className="anim-eq-bar-3" />
                              <rect x="184" y="12" width="2" height="10" fill="#00E5FF" className="anim-eq-bar-1" />
                              <text x="10" y="21.5" fill="#FFFFFF" fontSize="8.2" fontWeight="800" fontFamily="monospace">
                                Almost ghosted your drop... no cap 🧢
                              </text>
                            </g>
                          </g>
                        )}

                        {/* Pose 3 (Beat 3): Biceps flex & pointing directly down at vault with Gen-Z Line 3 */}
                        {(dialogueStep === 3 || dialogueStep === 0) && (
                          <g>
                            <g className="anim-bicep-flex">
                              <path d="M 46 72 L 28 82 L 40 94" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                              <path d="M 88 72 L 72 94 L 56 112" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                              <polygon points="52,112 60,112 56,120" fill="#FFE600" stroke="#000" strokeWidth="1.2" />
                            </g>
                            {/* Dialogue Box 3 (Gen-Z) */}
                            {dialogueStep === 3 && (
                              <g key="dialogue-3" className="anim-bubble-pop" transform="translate(78, 2)">
                                <polygon points="0,28 -14,36 4,32" fill="#0d0e14" stroke="#00FF94" strokeWidth="2" />
                                <rect x="0" y="0" width="216" height="36" rx="7" fill="#0d0e14" stroke="#00FF94" strokeWidth="2" />
                                <rect x="198" y="13" width="2" height="10" fill="#00FF94" className="anim-eq-bar-1" />
                                <rect x="202" y="13" width="2" height="10" fill="#FFE600" className="anim-eq-bar-2" />
                                <rect x="206" y="13" width="2" height="10" fill="#00E5FF" className="anim-eq-bar-3" />
                                <text x="10" y="23" fill="#00FF94" fontSize="8.2" fontWeight="900" fontFamily="monospace">
                                  HERE IS YOUR 24-BIT HEAT! Certified banger 🔥
                                </text>
                              </g>
                            )}
                          </g>
                        )}
                      </>
                    )}

                    {/* Hop In: Peace Sign ✌️ Wave & Adjusts Sunglasses */}
                    {phase === 'hop_in' && (
                      <>
                        <path d="M 46 72 L 34 56 L 54 44" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 88 72 L 72 88 L 60 92" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                        <g transform="translate(92, 54)">
                          <rect x="0" y="0" width="20" height="17" rx="3" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                          <text x="10" y="12.5" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">✌️</text>
                        </g>
                      </>
                    )}
                  </g>
                )}
              </svg>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* === INTERACTIVE PARCEL ON ASPHALT (Planted firmly - 100% STUCK) === */}
        {/* ========================================================================= */}
        {mode === 'return' && (phase === 'drop_parcel' || phase === 'hop_in' || phase === 'car_leaving' || phase === 'delivered_idle') && (
          <div
            id={ids.deliveryVaultCrate}
            role="button"
            tabIndex={0}
            aria-label="Open delivered sample pack"
            onClick={handleCrateClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCrateClick()
              }
            }}
            className="absolute left-1/2 -translate-x-1/2 bottom-2.5 sm:bottom-3 md:bottom-4 lg:bottom-5 z-30 flex flex-col items-center cursor-pointer group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF94] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg transition-shadow"
          >
            {/* FLOATING GLASSMORPHIC SOUND PACK PREVIEW CARD (Smooth reveal when unlocked) */}
            {isParcelOpened && (
              <div className="mb-1.5 sm:mb-2 w-[270px] sm:w-[320px] md:w-[360px] p-2 sm:p-2.5 rounded-lg bg-[#0d0e14]/92 backdrop-blur-xl border border-[#00FF94]/50 shadow-[0_0_24px_rgba(0,255,148,0.28)] flex items-center gap-2.5 sm:gap-3 anim-card-float">
                {/* Artwork / Vinyl Master Preview */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-black border border-[#FFE600]/40 shrink-0 relative flex items-center justify-center shadow-inner">
                  {itemCoverUrl ? (
                    <img
                      src={itemCoverUrl}
                      alt={itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FFE600] to-[#FF5C00] flex items-center justify-center text-black font-black text-xs">
                      24B
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono text-[#00FF94] font-bold">WAV</span>
                </div>

                {/* Pack Metadata */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-[11px] sm:text-[12px] font-mono font-black text-white truncate drop-shadow">
                      {itemName}
                    </h4>
                    <span className="text-[7.5px] sm:text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00FF94]/15 text-[#00FF94] border border-[#00FF94]/30 shrink-0 whitespace-nowrap">
                      {itemFormat}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5 text-[7.5px] sm:text-[8.5px] font-mono text-white/50">
                    <span className="text-[#00FF94]" aria-hidden="true">📦</span>
                    <span className="tracking-wider truncate uppercase">SAMPLESWALA // SOUND VAULT</span>
                  </div>

                  {/* Real Download Progress Synchronizer */}
                  {isDownloading ? (
                    <div className="mt-1 w-full">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-[#FFE600] mb-0.5">
                        <span>DOWNLOADING MASTER...</span>
                        <span>{clampedProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00FF94] to-[#FFE600] transition-all duration-200"
                          style={{ width: `${clampedProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-0.5 flex items-center gap-1 text-[8px] sm:text-[8.5px] font-mono text-[#00FF94] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-ping" />
                      <span>VAULT UNLOCKED • READY</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subtle Minimal Pulse Tap Hint (When locked) */}
            {(phase === 'delivered_idle' || phase === 'car_leaving') && !isParcelOpened && (
              <span className="text-[9px] md:text-xs font-mono tracking-widest text-[#00FF94] animate-pulse mb-1 md:mb-1.5 pointer-events-none whitespace-nowrap drop-shadow-[0_0_8px_#00FF94]">
                TAP TO UNLOCK VAULT
              </span>
            )}

            {/* Unboxing SVG Component */}
            <svg
              viewBox="0 0 100 88"
              fill="none"
              className={`w-[94px] h-[82px] sm:w-[110px] sm:h-[96px] md:w-[130px] md:h-[114px] lg:w-[150px] lg:h-[132px] overflow-visible transition-all duration-200 ${
                !isParcelOpened ? 'group-hover:drop-shadow-[0_0_24px_rgba(255,230,0,0.9)] group-hover:brightness-110' : ''
              }`}
            >
              <defs>
                <clipPath id={ids.cdVinylDiscClip}>
                  <circle cx="26" cy="26" r="23.5" />
                </clipPath>
              </defs>

              {/* Tarmac Shadow under Crate */}
              <ellipse cx="50" cy="82" rx="38" ry="5.5" fill="#000000" opacity="0.85" />
              <ellipse cx="50" cy="82" rx="30" ry="3.5" fill="#00FF94" opacity="0.45" />

              {/* AUDIO WAVEFORM SHOCKWAVE ON CRATE IMPACT (At 4.3s) */}
              {hasImpactShockwave && (
                <g className="anim-impact-shockwave pointer-events-none" transform="translate(0, 0)">
                  <ellipse cx="50" cy="82" rx="36" ry="5.5" fill="none" stroke="#00FF94" strokeWidth="2" opacity="0.9" />
                  <ellipse cx="50" cy="82" rx="58" ry="9" fill="none" stroke="#FFE600" strokeWidth="1.5" opacity="0.75" />
                  <ellipse cx="50" cy="82" rx="82" ry="12" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.6" />
                  {/* Radial frequency tick spikes */}
                  {[-30, -18, -6, 6, 18, 30].map((offset, idx) => (
                    <line
                      key={idx}
                      x1={50 + offset}
                      y1={82}
                      x2={50 + offset * 1.5}
                      y2={80 - Math.abs(offset) * 0.2}
                      stroke="#00FF94"
                      strokeWidth="1.2"
                      opacity="0.8"
                    />
                  ))}
                </g>
              )}

              {/* UNBOXING BURST OF PARTICLES & STARS */}
              {isParcelOpened && (
                <g transform="translate(10, 8)">
                  <circle cx="40" cy="30" r="38" fill={`url(#${ids.headlightVolumetric})`} opacity="0.4" className="animate-ping" />
                  <text x="5" y="10" fill="#FFE600" fontSize="16" className="animate-bounce">⭐</text>
                  <text x="65" y="12" fill="#00FF94" fontSize="16" className="animate-pulse">✨</text>
                  <text x="38" y="-4" fill="#FF5C00" fontSize="18">🔥</text>
                  <text x="-4" y="38" fill="#00E5FF" fontSize="14">🎵</text>
                  <text x="74" y="34" fill="#FF0080" fontSize="15">💥</text>
                </g>
              )}

              {/* 24-BIT CUSTOM PACK CD / VINYL MASTER (Rises out of crate) */}
              {isParcelOpened && (
                <g className="anim-vinyl-rise" transform="translate(24, 6)">
                  {/* Circular Audio Waveform Ripple Rings */}
                  <circle cx="26" cy="26" r="30" fill="none" stroke="#00FF94" strokeWidth="0.8" strokeDasharray="4,2" className="anim-radial-wave" />
                  <circle cx="26" cy="26" r="25" fill="#00FF94" opacity="0.25" className="animate-ping" />

                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 26 26"
                      to="360 26 26"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                    {/* Vinyl Disc Base */}
                    <circle cx="26" cy="26" r="24" fill="#0c0d12" stroke="#FFE600" strokeWidth="2" />

                    {/* Sound Pack Artwork / Cover Art */}
                    {itemCoverUrl ? (
                      <image
                        href={itemCoverUrl}
                        x="2.5"
                        y="2.5"
                        width="47"
                        height="47"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#${ids.cdVinylDiscClip})`}
                      />
                    ) : (
                      <circle cx="26" cy="26" r="24" fill={`url(#${ids.goldVinylMaster})`} />
                    )}

                    {/* Realistic Vinyl Grooves & Holographic Sheen Overlay */}
                    <circle cx="26" cy="26" r="23.5" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.45" />
                    <circle cx="26" cy="26" r="21" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" strokeDasharray="3,2" />
                    <circle cx="26" cy="26" r="17" fill="none" stroke="#000000" strokeWidth="1" opacity="0.35" />
                    <circle cx="26" cy="26" r="13" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />

                    {/* High-Gloss Light Flare */}
                    <path d="M 6 6 L 22 22 L 16 38 L 2 20 Z" fill="#ffffff" opacity="0.16" clipPath={`url(#${ids.cdVinylDiscClip})`} />

                    {/* Center Hub & Spindle Cutout */}
                    <circle cx="26" cy="26" r="7" fill="#0a0b10" stroke="#00FF94" strokeWidth="1.2" />
                    <text x="26" y="24" fill="#00FF94" fontSize="2.5" fontWeight="900" textAnchor="middle">24-BIT</text>
                    <text x="26" y="30.5" fill="#FFE600" fontSize="2.2" fontWeight="900" textAnchor="middle">MASTER</text>
                    <circle cx="26" cy="26" r="2.8" fill="#000000" stroke="#FFE600" strokeWidth="0.8" />
                  </g>
                </g>
              )}

              {/* PARCEL CRATE BODY (Completely static and firmly planted on tarmac) */}
              <g transform="translate(24, 46)">
                <rect x="0" y="0" width="52" height="34" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="3" />
                <line x1="26" y1="0" x2="26" y2="34" stroke="#FF5C00" strokeWidth="5.5" />
                <line x1="0" y1="17" x2="52" y2="17" stroke="#FF5C00" strokeWidth="5.5" />

                {/* Digital Lock Screen */}
                <rect x="5" y="6" width="18" height="10" fill="#000000" rx="1.5" />
                <text
                  x="6.5"
                  y="13.5"
                  fill={isParcelOpened ? '#00FF94' : unlockStage === 'authorizing' ? '#FFE600' : '#FF0055'}
                  fontSize="6.5"
                  fontWeight="900"
                >
                  {isParcelOpened ? 'OPEN' : unlockStage === 'authorizing' ? 'AUTH' : 'VAULT'}
                </text>

                {/* Status Indicator */}
                <rect x="30" y="6" width="16" height="10" fill="#000000" rx="1.5" />
                <text x="32" y="13.5" fill="#FFE600" fontSize="7" fontWeight="900">24B</text>

                {/* 3 Mechanical Vault Status LEDs */}
                <circle
                  cx="12"
                  cy="25"
                  r="2"
                  fill={isParcelOpened ? '#00FF94' : '#FF0055'}
                  stroke="#000"
                  strokeWidth="0.5"
                />
                <circle
                  cx="26"
                  cy="25"
                  r="2"
                  fill={isParcelOpened ? '#00FF94' : unlockStage === 'authorizing' ? '#FFE600' : '#FF0055'}
                  stroke="#000"
                  strokeWidth="0.5"
                />
                <circle
                  cx="40"
                  cy="25"
                  r="2"
                  fill={isParcelOpened ? '#00FF94' : '#FF0055'}
                  stroke="#000"
                  strokeWidth="0.5"
                />
              </g>

              {/* CRATE LID: Pops off when unboxed */}
              <g
                transform="translate(21, 38)"
                className={isParcelOpened ? 'anim-lid-pop' : ''}
              >
                <rect x="0" y="0" width="58" height="11" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="3" />
                <line x1="29" y1="0" x2="29" y2="11" stroke="#FF5C00" strokeWidth="5.5" />
                <circle cx="29" cy="-3.5" r="7" fill="#FF0055" stroke="#000" strokeWidth="2" />
                <ellipse cx="22" cy="-4.5" rx="4.5" ry="3" fill="#FF5C00" stroke="#000" strokeWidth="1.2" transform="rotate(-25 22 -4.5)" />
                <ellipse cx="36" cy="-4.5" rx="4.5" ry="3" fill="#FF5C00" stroke="#000" strokeWidth="1.2" transform="rotate(25 36 -4.5)" />
              </g>
            </svg>
          </div>
        )}

        {/* ========================================================================= */}
        {/* === REALISTIC ASPHALT HIGHWAY (Streaming Forward & Reverse, Frozen on Stop) === */}
        {/* ========================================================================= */}
        <div className="w-full relative h-6 sm:h-7 md:h-10 lg:h-12 bg-[#111216] border-t border-b border-black z-10 overflow-hidden flex items-center shadow-[0_4px_16px_rgba(0,0,0,0.9)] -mt-3 sm:-mt-3.5 md:-mt-5 lg:-mt-6">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] md:h-[2.5px] bg-gradient-to-r from-[#00FF94] via-[#FFE600] to-[#00FF94] opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] md:h-[2.5px] bg-black" />

          {/* Continuous Dashed Lane Markers with Hardware CSS Streaming */}
          <div
            className={`w-full h-1 sm:h-1.5 md:h-2.5 road-dashes-stream shadow-[0_0_8px_#FFE600] ${
              isDriving
                ? 'road-drive'
                : isZoomingPast
                  ? 'road-zoom'
                  : isReversing
                    ? 'road-reverse'
                    : isCarLeaving
                      ? 'road-leaving'
                      : ''
            } ${isParked || isDeliveredIdle ? 'road-paused' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}
