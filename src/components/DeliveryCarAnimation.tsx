'use client'

import React, { useState, useEffect } from 'react'

export interface DeliveryCarAnimationProps {
  mode: 'drive' | 'return' | 'seamless'
  onDeliveryDelivered?: () => void
  onParcelClick?: () => void
  isParcelOpened?: boolean
  isDownloading?: boolean
  progress?: number // 0 to 100 for dispatch progress
}

export type DeliveryPhase =
  | 'drive_speed'
  | 'zoom_past'
  | 'reverse_screech'
  | 'door_up'
  | 'dude_step_out'
  | 'drop_parcel'
  | 'hop_in'
  | 'zoom_off'

export function DeliveryCarAnimation({
  mode,
  onDeliveryDelivered,
  onParcelClick,
  isParcelOpened = false,
  isDownloading = false,
  progress = 0
}: DeliveryCarAnimationProps) {
  const [phase, setPhase] = useState<DeliveryPhase>(
    mode === 'drive' ? 'drive_speed' : 'zoom_past'
  )

  useEffect(() => {
    if (mode === 'drive') {
      setPhase('drive_speed')
      return
    }

    if (mode === 'return') {
      // 1. Car zooms past forward (overshoots customer drop-off)
      setPhase('zoom_past')
      // 2. Realizes mistake & screeches in REVERSE with tire smoke & brake dive
      const t1 = setTimeout(() => setPhase('reverse_screech'), 650)
      // 3. Comes to dead stop, scissor hydraulic door swings up (revealing luxury interior)
      const t2 = setTimeout(() => setPhase('door_up'), 2000)
      // 4. Johnny Bravo steps out carrying the gold sound vault crate
      const t3 = setTimeout(() => setPhase('dude_step_out'), 2600)
      // 5. Johnny drops crate, strikes hand-on-hip swagger pose with comic speech bubble
      const t4 = setTimeout(() => setPhase('drop_parcel'), 3800)
      // 6. Johnny slicks his golden pompadour, flashes peace sign ✌️, hops back inside
      const t5 = setTimeout(() => setPhase('hop_in'), 6300)
      // 7. Scissor door seals shut, quad exhausts spit fiery plasma, hypercar zooms away
      const t6 = setTimeout(() => {
        setPhase('zoom_off')
        onDeliveryDelivered?.()
      }, 7400)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
        clearTimeout(t6)
      }
    }
  }, [mode, onDeliveryDelivered])

  const isDriving = phase === 'drive_speed'
  const isZoomingPast = phase === 'zoom_past'
  const isReversing = phase === 'reverse_screech'
  const isLaunching = phase === 'zoom_off'
  const isWheelsSpinning = isDriving || isLaunching || isZoomingPast || isReversing

  return (
    <div className="w-full relative overflow-hidden select-none my-2 font-mono">
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

        /* Multi-layer Scenery Parallax Streaming (Like TrainAnimation) */
        @keyframes sceneryMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scenery-scroll-far {
          animation: sceneryMove 40s linear infinite;
        }
        .scenery-scroll-mid {
          animation: sceneryMove 14s linear infinite;
        }
        .scenery-scroll-fast {
          animation: sceneryMove 4s linear infinite;
        }

        /* High-speed road line streaming (Hardware-accelerated CSS) */
        @keyframes roadStream {
          from { background-position-x: 0px; }
          to { background-position-x: -48px; }
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

        /* Scissor Hydraulic Door Lift (Frameless Window + Carbon Door lifting together) */
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

        /* Johnny Bravo Step Out, Drop & Hop-In Animations */
        @keyframes driverEmerge {
          0% { transform: translate(160px, 14px) scale(0.65); opacity: 0; }
          45% { transform: translate(120px, 5px) scale(0.88); opacity: 1; }
          100% { transform: translate(75px, 0px) scale(1); opacity: 1; }
        }
        @keyframes driverPlaceParcel {
          0% { transform: translate(75px, 0px); }
          35% { transform: translate(50px, 4px) rotate(3deg); }
          70% { transform: translate(40px, 6px) rotate(4deg); }
          100% { transform: translate(45px, 0px) rotate(0deg); }
        }
        @keyframes driverHopInside {
          0% { transform: translate(45px, 0px) scale(1); opacity: 1; }
          40% { transform: translate(95px, 5px) scale(0.85); opacity: 1; }
          100% { transform: translate(160px, 14px) scale(0.5); opacity: 0; }
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
        @keyframes vinylGrooveSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          animation: driverEmerge 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-driver-drop {
          animation: driverPlaceParcel 1.4s ease-in-out forwards;
        }
        .anim-driver-hop {
          animation: driverHopInside 0.75s ease-in forwards;
        }
        .anim-lid-pop {
          animation: crateLidFlyAway 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-vinyl-rise {
          animation: vinylRecordRise 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        `
      }} />

      {/* Main Cinematic Scene Canvas */}
      <div className="relative w-full max-w-lg mx-auto h-40 sm:h-48 md:h-56 flex flex-col justify-end items-center overflow-hidden rounded-md bg-gradient-to-b from-[#08080c] via-[#0d0e14] to-[#07070a] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">

        {/* Ambient Top Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-[#00FF94]/10 via-[#FFE600]/5 to-transparent blur-2xl" />
        </div>

        {/* ========================================================================= */}
        {/* === PARALLAX BACKGROUND SCENERY (Modern Villas, Bungalows, Palms & City) === */}
        {/* ========================================================================= */}
        <div
          className={`absolute bottom-6 sm:bottom-7 left-0 h-20 sm:h-24 flex w-[200%] select-none pointer-events-none z-0 ${
            isDriving || isZoomingPast ? 'scenery-scroll-mid' : isLaunching ? 'scenery-scroll-fast' : ''
          }`}
          style={{ willChange: 'transform' }}
        >
          {/* Scenery Block A */}
          <svg className="w-1/2 h-full" viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="bungalowGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE600" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF9900" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Distant Skyline / Horizon Silhouettes */}
            <rect x="0" y="55" width="1200" height="25" fill="#07080c" />
            <path d="M 0 55 L 60 42 L 140 55 L 240 38 L 320 55 L 480 32 L 540 55 L 720 40 L 820 55 L 980 36 L 1080 55 L 1200 45" stroke="#181a24" strokeWidth="1" fill="none" opacity="0.4" />

            {/* Modern Architectural Sound Villa 1 (Bungalow with Slanted Roof & Balcony) */}
            <g transform="translate(60, 14)">
              <rect x="0" y="24" width="90" height="42" fill="#13151f" stroke="#000" strokeWidth="1" />
              <polygon points="-8,24 98,24 82,14 6,14" fill="#1e2130" stroke="#FFE600" strokeWidth="0.8" />
              <rect x="10" y="28" width="22" height="15" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <rect x="42" y="28" width="22" height="15" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <line x1="8" y1="46" x2="82" y2="46" stroke="#00FF94" strokeWidth="0.8" />
              <line x1="12" y1="46" x2="12" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="28" y1="46" x2="28" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="44" y1="46" x2="44" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="60" y1="46" x2="60" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <line x1="76" y1="46" x2="76" y2="52" stroke="#2b2e40" strokeWidth="0.5" />
              <rect x="28" y="52" width="16" height="14" rx="1" fill="#0a0b10" stroke="#FFE600" strokeWidth="0.5" />
            </g>

            {/* Modern Streetlight */}
            <g transform="translate(180, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 42,64 0,64" fill="#FFE600" opacity="0.06" />
            </g>

            {/* Indian Coconut Palm Tree 1 */}
            <g transform="translate(230, 10)">
              <path d="M 12 70 Q 16 35 22 14" stroke="#1c1e28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22 14 Q 10 16 2 24" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 12 8 8 0" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 28 6 38 4" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 22 14 Q 34 16 42 22" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            {/* SamplesWala Sound Studio Landmark (Bungalow 2 with Neon Signboard) */}
            <g transform="translate(340, 6)">
              <rect x="0" y="28" width="130" height="46" fill="#11131c" stroke="#000" strokeWidth="1" />
              <rect x="-6" y="24" width="142" height="5" rx="1" fill="#1f2230" stroke="#00FF94" strokeWidth="0.8" />
              <rect x="18" y="10" width="94" height="14" rx="2" fill="#08090e" stroke="#00FF94" strokeWidth="1" />
              <text x="65" y="20" fill="#00FF94" fontSize="6.5" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
                SAMPLES WALA LABS
              </text>
              <rect x="12" y="34" width="30" height="18" rx="1" fill="url(#bungalowGlass)" stroke="#00FF94" strokeWidth="0.5" />
              <rect x="50" y="34" width="30" height="18" rx="1" fill="url(#bungalowGlass)" stroke="#00FF94" strokeWidth="0.5" />
              <rect x="88" y="34" width="30" height="18" rx="1" fill="url(#bungalowGlass)" stroke="#00FF94" strokeWidth="0.5" />
              <line x1="16" y1="43" x2="38" y2="43" stroke="#FFE600" strokeWidth="1" />
              <line x1="54" y1="43" x2="76" y2="43" stroke="#00FF94" strokeWidth="1" />
              <line x1="92" y1="43" x2="114" y2="43" stroke="#00E5FF" strokeWidth="1" />
            </g>

            {/* Contemporary Luxury Villa / Bungalow 3 */}
            <g transform="translate(560, 16)">
              <polygon points="0,26 65,12 85,26" fill="#1c1f2b" stroke="#000" strokeWidth="1" />
              <rect x="6" y="26" width="74" height="38" fill="#13151e" stroke="#000" strokeWidth="1" />
              <rect x="14" y="32" width="24" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <rect x="46" y="32" width="24" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
            </g>

            {/* Streetlight 2 */}
            <g transform="translate(680, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 42,64 0,64" fill="#FFE600" opacity="0.06" />
            </g>

            {/* Coconut Palm Tree 2 */}
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
              <rect x="10" y="28" width="20" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <rect x="38" y="28" width="20" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
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
              <rect x="10" y="28" width="22" height="15" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <rect x="42" y="28" width="22" height="15" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <line x1="8" y1="46" x2="82" y2="46" stroke="#00FF94" strokeWidth="0.8" />
            </g>

            <g transform="translate(180, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 42,64 0,64" fill="#FFE600" opacity="0.06" />
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
              <rect x="12" y="34" width="30" height="18" rx="1" fill="url(#bungalowGlass)" stroke="#00FF94" strokeWidth="0.5" />
              <rect x="50" y="34" width="30" height="18" rx="1" fill="url(#bungalowGlass)" stroke="#00FF94" strokeWidth="0.5" />
              <rect x="88" y="34" width="30" height="18" rx="1" fill="url(#bungalowGlass)" stroke="#00FF94" strokeWidth="0.5" />
            </g>

            <g transform="translate(560, 16)">
              <polygon points="0,26 65,12 85,26" fill="#1c1f2b" stroke="#000" strokeWidth="1" />
              <rect x="6" y="26" width="74" height="38" fill="#13151e" stroke="#000" strokeWidth="1" />
              <rect x="14" y="32" width="24" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <rect x="46" y="32" width="24" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
            </g>

            <g transform="translate(680, 16)">
              <line x1="6" y1="64" x2="6" y2="8" stroke="#333647" strokeWidth="1.5" />
              <path d="M 6 8 Q 6 0 16 0 L 22 0" stroke="#333647" strokeWidth="1.5" fill="none" />
              <polygon points="18,0 24,0 26,4 16,4" fill="#FFE600" />
              <polygon points="17,4 25,4 42,64 0,64" fill="#FFE600" opacity="0.06" />
            </g>

            <g transform="translate(740, 10)">
              <path d="M 12 70 Q 14 38 20 14" stroke="#1c1e28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 20 14 Q 8 16 0 24" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 20 14 Q 10 8 6 0" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 20 14 Q 26 6 36 4" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M 20 14 Q 32 16 40 22" stroke="#00FF94" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            <g transform="translate(860, 14)">
              <rect x="0" y="24" width="80" height="42" fill="#13151f" stroke="#000" strokeWidth="1" />
              <polygon points="-6,24 86,24 72,14 6,14" fill="#1e2130" stroke="#FFE600" strokeWidth="0.8" />
              <rect x="10" y="28" width="20" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
              <rect x="38" y="28" width="20" height="14" rx="1" fill="url(#bungalowGlass)" stroke="#FFE600" strokeWidth="0.5" />
            </g>

            <g transform="translate(1000, 20)">
              <line x1="8" y1="60" x2="8" y2="4" stroke="#2b2d3d" strokeWidth="1.5" />
              <line x1="0" y1="8" x2="16" y2="8" stroke="#2b2d3d" strokeWidth="1.5" />
              <line x1="2" y1="14" x2="14" y2="14" stroke="#2b2d3d" strokeWidth="1" />
              <circle cx="0" cy="8" r="1" fill="#00FF94" />
              <circle cx="16" cy="8" r="1" fill="#00FF94" />
            </g>
          </svg>
        </div>

        {/* Speed Streaks in the Air (High Velocity Feel) */}
        {isDriving && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
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

        {/* The Animated Hypercar Stage */}
        <div
          className={`relative z-20 w-full flex justify-center ${
            isDriving
              ? 'animate-[driveCruise_2.5s_ease-in-out_infinite]'
              : isZoomingPast
                ? 'animate-[hyperCarZoomPast_0.65s_cubic-bezier(0.4,0,0.2,1)_forwards]'
                : isReversing
                  ? 'animate-[hyperCarReverseScreech_1.35s_cubic-bezier(0.16,0.85,0.25,1)_forwards]'
                  : isLaunching
                    ? 'animate-[hyperCarLaunchOut_0.9s_cubic-bezier(0.5,0.05,0.9,0.3)_forwards]'
                    : ''
          }`}
        >
          <div
            className={`relative ${
              isDriving || isLaunching || isZoomingPast
                ? 'anim-acceleration-squat'
                : isReversing
                  ? 'anim-brake-dive'
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
              className="w-[260px] xs:w-[300px] sm:w-[360px] md:w-[420px] max-w-full h-auto overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Metallic Carbon Hypercar Body Gradient */}
                <linearGradient id="bodyCarbonMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#08080a" />
                  <stop offset="25%" stopColor="#181920" />
                  <stop offset="50%" stopColor="#22242e" />
                  <stop offset="75%" stopColor="#13141a" />
                  <stop offset="100%" stopColor="#252733" />
                </linearGradient>

                {/* Tinted Aerodynamic Glass */}
                <linearGradient id="canopyGlass" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#002b36" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#00FF94" stopOpacity="0.4" />
                </linearGradient>

                {/* Volumetric Headlight Projection */}
                <linearGradient id="headlightVolumetric" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#00FF94" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#FFE600" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FFE600" stopOpacity="0" />
                </linearGradient>

                {/* Ground Specular Light Pool */}
                <radialGradient id="roadSpecularPool" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#00FF94" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                {/* 3D Concave Alloy Wheel Rim Gradient */}
                <radialGradient id="rimForgedAlloy" cx="45%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#444654" />
                  <stop offset="45%" stopColor="#181920" />
                  <stop offset="85%" stopColor="#0a0a0d" />
                  <stop offset="100%" stopColor="#00FF94" />
                </radialGradient>

                {/* Ceramic Brake Rotor */}
                <radialGradient id="brakeRotor" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#888c99" />
                  <stop offset="65%" stopColor="#3a3d47" />
                  <stop offset="100%" stopColor="#1a1a20" />
                </radialGradient>

                {/* Nitro Plasma Torch Jet */}
                <linearGradient id="plasmaFireOuter" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="15%" stopColor="#00F0FF" />
                  <stop offset="40%" stopColor="#0066FF" />
                  <stop offset="70%" stopColor="#FF0077" />
                  <stop offset="90%" stopColor="#FF9900" />
                  <stop offset="100%" stopColor="#FFE600" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="plasmaFireCore" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#CCFFFF" />
                  <stop offset="70%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#0044FF" stopOpacity="0" />
                </linearGradient>

                {/* Golden Vinyl Master Gradient */}
                <radialGradient id="goldVinylMaster" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff8db" />
                  <stop offset="25%" stopColor="#d4af37" />
                  <stop offset="55%" stopColor="#aa820a" />
                  <stop offset="80%" stopColor="#664d00" />
                  <stop offset="95%" stopColor="#FFE600" />
                  <stop offset="100%" stopColor="#111111" />
                </radialGradient>
              </defs>

              {/* === TIRE CONTACT GROUND SHADOWS === */}
              <ellipse cx="178" cy="145" rx="26" ry="3.5" fill="#000000" opacity="0.9" />
              <ellipse cx="366" cy="145" rx="26" ry="3.5" fill="#000000" opacity="0.9" />

              {/* Rubber Brake Skid Marks (on reverse screech & parked) */}
              {(isReversing || phase === 'door_up' || phase === 'dude_step_out' || phase === 'drop_parcel' || phase === 'hop_in') && (
                <g opacity="0.6">
                  <line x1="140" y1="144.5" x2="190" y2="144.5" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                  <line x1="330" y1="144.5" x2="380" y2="144.5" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}

              {/* === NEON GROUND UNDERGLOW === */}
              <ellipse cx="270" cy="145" rx="160" ry="5.5" fill="#00FF94" opacity="0.65" />
              <ellipse cx="270" cy="145" rx="90" ry="3" fill="#FFE600" opacity="0.5" />

              {/* === VOLUMETRIC FORWARD HEADLIGHT BEAM === */}
              <polygon
                points="435,102 535,78 535,142 435,116"
                fill="url(#headlightVolumetric)"
                opacity="0.8"
              />
              <ellipse cx="490" cy="136" rx="40" ry="4" fill="url(#roadSpecularPool)" />

              {/* === NITRO EXHAUST SYSTEM (Rear x=122, y=114) === */}
              {(isDriving || isLaunching || isZoomingPast) && (
                <g>
                  <polygon
                    points="122,112 30,98 75,112 10,114 75,116 30,130 122,116"
                    fill="url(#plasmaFireOuter)"
                    className="anim-flame-outer"
                  />
                  <polygon
                    points="122,113 55,107 90,113 35,114 90,115 55,121 122,115"
                    fill="url(#plasmaFireCore)"
                    className="anim-flame-core"
                  />
                  <circle cx="120" cy="114" r="5" fill="#FFFFFF" />
                  <circle cx="112" cy="114" r="7.5" fill="#00F0FF" opacity="0.85" />
                  <ellipse cx="98" cy="114" rx="4" ry="2" fill="#FFFFFF" opacity="0.9" />
                  <ellipse cx="78" cy="114" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.75" />
                </g>
              )}

              {/* === HYPERCAR REAR GT SPOILER === */}
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

              {/* === MAIN HYPERCAR CHASSIS BODYWORK === */}
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
                fill="url(#bodyCarbonMetal)"
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

              {/* Dual Titanium Exhausts */}
              <rect x="120" y="108" width="9" height="11" rx="2" fill="#22242e" stroke="#000" strokeWidth="1.2" />
              <ellipse cx="122" cy="114" rx="2.5" ry="4.5" fill="#08080a" />

              {/* Mid-Engine Recessed Side Radiator Scoop */}
              <path
                d="M 215 88 L 260 88 L 255 108 L 220 108 Z"
                fill="#050508"
                stroke="#00FF94"
                strokeWidth="1"
              />
              <line x1="225" y1="92" x2="225" y2="104" stroke="#1c1d26" strokeWidth="1" />
              <line x1="235" y1="92" x2="235" y2="104" stroke="#1c1d26" strokeWidth="1" />
              <line x1="245" y1="92" x2="245" y2="104" stroke="#1c1d26" strokeWidth="1" />

              {/* Front Aerodynamic Splitter & Carbon Canards */}
              <polygon points="432,118 456,118 452,126 428,126" fill="#050508" stroke="#FFE600" strokeWidth="1.5" />
              <polygon points="410,110 442,110 438,118 406,118" fill="#00FF94" stroke="#000" strokeWidth="1" />

              {/* Quad LED Projector Headlights */}
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
              {/* === FIXED FRONT WINDSHIELD & A-PILLAR (Windshield stays, window lifts!) === */}
              {/* ========================================================================= */}
              <path
                d="M 304 67 
                   C 324 67, 348 74, 378 88 
                   L 304 88 
                   Z"
                fill="url(#canopyGlass)"
                stroke="#000000"
                strokeWidth="1.5"
              />
              <line x1="310" y1="70" x2="370" y2="86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              {/* Front Carbon A-Pillar Spar */}
              <line x1="304" y1="67" x2="378" y2="88" stroke="#111216" strokeWidth="3" />

              {/* ========================================================================= */}
              {/* === LUXURY SUPERCAR CABIN INTERIOR (Exposed when scissor door lifts!) === */}
              {/* ========================================================================= */}
              {/* Dark Interior Cavity */}
              <path d="M 230 65 L 305 67 L 305 106 L 230 106 Z" fill="#090a10" />

              {/* Interior Ambient LED Glow Line */}
              <path d="M 232 67 L 304 69" stroke="#00FF94" strokeWidth="1" opacity="0.7" />

              {/* Roll-Cage Diagonal Carbon Strut */}
              <line x1="233" y1="66" x2="250" y2="100" stroke="#1c1e28" strokeWidth="2.5" strokeLinecap="round" />

              {/* --- SPORTS RACING BUCKET SEAT WITH DETAILED CUSHIONS & HARNESS --- */}
              <g transform="translate(236, 66)">
                {/* Carbon Seat Shell Backing */}
                <path d="M 6 0 C 14 0, 18 4, 18 12 L 17 28 L 2 28 C 2 18, 2 8, 6 0 Z" fill="#12131a" stroke="#000" strokeWidth="1" />

                {/* Ergonomic Headrest with Twin Harness Ports */}
                <rect x="7" y="1" width="10" height="7" rx="2" fill="#1c1e28" stroke="#FFE600" strokeWidth="0.8" />
                <rect x="9" y="3.5" width="2" height="2" rx="0.5" fill="#000" />
                <rect x="13" y="3.5" width="2" height="2" rx="0.5" fill="#000" />

                {/* Quilted Leather Backrest Cushion Bolsters */}
                <rect x="6" y="9" width="12" height="15" rx="2" fill="#222533" stroke="#000" strokeWidth="0.8" />
                {/* Horizontal Leather Cushion Ribs with Neon Yellow Twin Stitching */}
                <line x1="7" y1="12" x2="17" y2="12" stroke="#FFE600" strokeWidth="0.9" />
                <line x1="7" y1="15" x2="17" y2="15" stroke="#FFE600" strokeWidth="0.9" />
                <line x1="7" y1="18" x2="17" y2="18" stroke="#FFE600" strokeWidth="0.9" />
                <line x1="7" y1="21" x2="17" y2="21" stroke="#FFE600" strokeWidth="0.9" />

                {/* Leather Seat Bottom Base Cushion */}
                <path d="M 2 24 L 22 24 C 23 28, 20 30, 18 30 L 2 30 Z" fill="#1c1e28" stroke="#000" strokeWidth="0.8" />
                <line x1="4" y1="27" x2="20" y2="27" stroke="#00FF94" strokeWidth="0.8" />

                {/* Racing 4-Point Shoulder Harness Straps */}
                <path d="M 10 5 L 8 24" stroke="#FF0055" strokeWidth="1.2" />
                <path d="M 14 5 L 16 24" stroke="#FF0055" strokeWidth="1.2" />
                <circle cx="12" cy="22" r="1.5" fill="#FFE600" stroke="#000" strokeWidth="0.5" />
              </g>

              {/* --- F1-STYLE FLAT-BOTTOM ALCANTARA STEERING WHEEL --- */}
              <g transform="translate(288, 77)">
                <rect x="1" y="5" width="8" height="3" fill="#14151c" />
                <path d="M 0 3 C 0 -3, 8 -3, 8 3 L 8 11 C 6 13, 2 13, 0 11 Z" fill="none" stroke="#2b2e3d" strokeWidth="2" strokeLinecap="round" />
                <rect x="3" y="-3.5" width="2" height="1.8" fill="#FFE600" />
                <circle cx="4" cy="4" r="2.5" fill="#FFE600" stroke="#000" strokeWidth="0.6" />
                <line x1="-1" y1="0" x2="-1" y2="8" stroke="#00FF94" strokeWidth="1" />
              </g>

              {/* --- DIGITAL COCKPIT INSTRUMENT CLUSTER (HUD GLOW) --- */}
              <g transform="translate(294, 71)">
                <rect x="0" y="0" width="10" height="6" rx="1" fill="#000000" stroke="#00FF94" strokeWidth="0.6" />
                <path d="M 1.5 4.5 A 3 3 0 0 1 7.5 2" fill="none" stroke="#00FF94" strokeWidth="0.8" />
                <circle cx="7.5" cy="2" r="0.6" fill="#FFE600" />
                <text x="5" y="4.8" fill="#FFFFFF" fontSize="2.5" fontWeight="900" textAnchor="middle">24B</text>
              </g>

              {/* ========================================================================= */}
              {/* === UNIFIED SCISSOR DOOR (Lifts frameless window + carbon panel together!) === */}
              {/* ========================================================================= */}
              <g className={
                (phase === 'door_up' || phase === 'dude_step_out' || phase === 'drop_parcel')
                  ? 'anim-scissor-open'
                  : (phase === 'hop_in' || phase === 'zoom_off')
                    ? 'anim-scissor-close'
                    : ''
              }>
                {/* Frameless Tinted Window Glass (SWINGS UP WITH DOOR!) */}
                <path
                  d="M 232 66 L 304 67 L 304 84 L 232 84 Z"
                  fill="url(#canopyGlass)"
                  stroke="#FFE600"
                  strokeWidth="1.2"
                  opacity="0.9"
                />
                <line x1="238" y1="69" x2="300" y2="80" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

                {/* Lower Sculpted Carbon Door Body Panel */}
                <path
                  d="M 230 84 L 305 84 L 305 106 L 230 106 Z"
                  fill="url(#bodyCarbonMetal)"
                  stroke="#FFE600"
                  strokeWidth="1.5"
                />
                <line x1="234" y1="94" x2="302" y2="94" stroke="#00FF94" strokeWidth="1.5" />
                {/* Aerodynamic Carbon Wing Mirror */}
                <polygon points="303,80 317,78 315,84 302,84" fill="#0a0a0d" stroke="#000" strokeWidth="1" />
                <circle cx="315" cy="81" r="1.5" fill="#00FF94" />
                {/* Flush Door Handle */}
                <rect x="268" y="88" width="12" height="3" rx="1.5" fill="#FFE600" stroke="#000" strokeWidth="0.6" />
              </g>

              {/* === HIGH-PERFORMANCE 3D FORGED WHEELS === */}
              {/* REAR WHEEL (Center: x=178, y=122) */}
              <path d="M 152 122 A 26 26 0 0 1 204 122 Z" fill="#000000" />
              <g transform="translate(178, 122)">
                <circle cx="0" cy="0" r="23" fill="#0d0d12" stroke="#000000" strokeWidth="3" />
                <circle cx="0" cy="0" r="20.5" fill="none" stroke="#222430" strokeWidth="1" strokeDasharray="3,2" />
                <circle cx="0" cy="0" r="16.5" fill="url(#brakeRotor)" stroke="#111" strokeWidth="1" />
                <path d="M -15 -8 A 16 16 0 0 1 -7 -15 L -5 -11 A 12 12 0 0 0 -11 -6 Z" fill="#00FF94" stroke="#000" strokeWidth="1" />

                <g>
                  {isWheelsSpinning && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to={isReversing ? "-360 0 0" : "360 0 0"}
                      dur={isLaunching ? "0.1s" : "0.2s"}
                      repeatCount="indefinite"
                    />
                  )}
                  <circle cx="0" cy="0" r="14.5" fill="url(#rimForgedAlloy)" stroke="#FFE600" strokeWidth="1.2" />
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

              {/* FRONT WHEEL (Center: x=366, y=122) */}
              <path d="M 340 122 A 26 26 0 0 1 392 122 Z" fill="#000000" />
              <g transform="translate(366, 122)">
                <circle cx="0" cy="0" r="23" fill="#0d0d12" stroke="#000000" strokeWidth="3" />
                <circle cx="0" cy="0" r="20.5" fill="none" stroke="#222430" strokeWidth="1" strokeDasharray="3,2" />
                <circle cx="0" cy="0" r="16.5" fill="url(#brakeRotor)" stroke="#111" strokeWidth="1" />
                <path d="M -15 -8 A 16 16 0 0 1 -7 -15 L -5 -11 A 12 12 0 0 0 -11 -6 Z" fill="#00FF94" stroke="#000" strokeWidth="1" />

                <g>
                  {isWheelsSpinning && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to={isReversing ? "-360 0 0" : "360 0 0"}
                      dur={isLaunching ? "0.1s" : "0.2s"}
                      repeatCount="indefinite"
                    />
                  )}
                  <circle cx="0" cy="0" r="14.5" fill="url(#rimForgedAlloy)" stroke="#FFE600" strokeWidth="1.2" />
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
              {/* === AUTHENTIC JOHNNY BRAVO CHARACTER (Only appears when stepping out!) === */}
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
                  {/* Ground Shadow */}
                  <ellipse cx="68" cy="138" rx="22" ry="3.5" fill="#000" opacity="0.8" />

                  {/* Classic Indigo Blue Denim Jeans */}
                  <path d="M 58 102 L 53 126 L 47 136" stroke="#1d3557" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 76 102 L 81 126 L 87 136" stroke="#25446e" strokeWidth="8" strokeLinecap="round" />
                  {/* Chunky Black Streetwear Boots */}
                  <polygon points="41,137 54,137 54,131 41,131" fill="#08080c" stroke="#000" strokeWidth="1.5" />
                  <polygon points="83,137 96,137 96,131 83,131" fill="#08080c" stroke="#000" strokeWidth="1.5" />
                  {/* Black Leather Belt with Gold Buckle */}
                  <rect x="55" y="100" width="24" height="4" fill="#111116" stroke="#000" strokeWidth="0.8" />
                  <rect x="64" y="99.5" width="6" height="5" rx="1" fill="#FFE600" stroke="#000" strokeWidth="1" />

                  {/* Massive Buff Chest in Tight Black T-Shirt (Johnny's V-Taper) */}
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
                  {/* Pectoral Muscle Contours */}
                  <path d="M 52 74 Q 67 80 82 74" stroke="#232533" strokeWidth="2" fill="none" />
                  <line x1="67" y1="74" x2="67" y2="92" stroke="#232533" strokeWidth="2" />

                  {/* Chunky Golden Chain & "SW" Medallion */}
                  <path d="M 54 70 Q 67 84 80 70" stroke="#FFE600" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="67" cy="85" r="4.5" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                  <text x="67" y="87.5" fill="#000" fontSize="5" fontWeight="900" textAnchor="middle">SW</text>

                  {/* Chiseled Square Jaw with Johnny's Smirk */}
                  <polygon points="58,50 76,50 73,66 61,66" fill="#F4A982" stroke="#000" strokeWidth="1.5" />
                  <path d="M 61 66 L 67 69 L 73 66" fill="#F4A982" stroke="#000" strokeWidth="1.5" />
                  <path d="M 64 62 Q 67 65 72 61" stroke="#8A3B14" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                  {/* Iconic Pitch-Black Sunglasses with Glare Streak */}
                  <rect x="54" y="47" width="12" height="9" rx="1.5" fill="#050505" stroke="#000" strokeWidth="1.5" />
                  <rect x="68" y="47" width="12" height="9" rx="1.5" fill="#050505" stroke="#000" strokeWidth="1.5" />
                  <rect x="64" y="49" width="6" height="3" fill="#050505" />
                  <line x1="56" y1="49" x2="63" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="70" y1="49" x2="77" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Iconic Gigantic Johnny Bravo Golden Pompadour Hairstyle */}
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
                  {/* Pompadour Volume Swirl Creases */}
                  <path d="M 60 20 C 72 17, 84 24, 82 35" stroke="#CCA000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 64 28 C 72 27, 80 34, 78 42" stroke="#CCA000" strokeWidth="2" fill="none" strokeLinecap="round" />

                  {/* Arm Action: Johnny Bravo Iconic Poses */}
                  {phase === 'dude_step_out' ? (
                    <>
                      {/* Carrying Gold Sound Vault in both arms */}
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
                  ) : phase === 'drop_parcel' ? (
                    <>
                      {/* Hand on hip with bicep flex */}
                      <path d="M 46 72 L 32 82 L 44 94" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                      {/* Pointing down at parcel with swagger */}
                      <path d="M 88 72 L 68 96 L 42 114" stroke="#F4A982" strokeWidth="7" strokeLinecap="round" />
                      <polygon points="38,114 46,114 42,124" fill="#FFE600" stroke="#000" strokeWidth="1.2" />

                      {/* Cool Gen-Z Street Dialogue Bubble */}
                      <g transform="translate(94, 8)">
                        <polygon points="0,34 -16,42 2,38" fill="#111216" stroke="#FFE600" strokeWidth="1.5" />
                        <rect x="0" y="0" width="150" height="48" rx="5" fill="#111216" stroke="#FFE600" strokeWidth="1.5" />
                        <text x="8" y="14" fill="#FFE600" fontSize="7.8" fontWeight="900" fontFamily="monospace">YO MY BAD FAM! 💀</text>
                        <text x="8" y="27" fill="#E4E4E7" fontSize="7" fontWeight="700" fontFamily="monospace">Almost forgot your drop...</text>
                        <text x="8" y="40" fill="#00FF94" fontSize="7.5" fontWeight="900" fontFamily="monospace">HERE IS YOUR 24-BIT HEAT! 🔥</text>
                      </g>
                    </>
                  ) : (
                    <>
                      {/* Johnny Bravo Hair-Slick & Peace Sign ✌️ */}
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

        {/* ========================================================================= */}
        {/* === INTERACTIVE PARCEL ON ASPHALT (Planted by Johnny Bravo) === */}
        {/* ========================================================================= */}
        {mode === 'return' && (phase === 'drop_parcel' || phase === 'hop_in' || phase === 'zoom_off') && (
          <div
            onClick={onParcelClick}
            className={`absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer group transition-all duration-500 ${
              phase === 'zoom_off' ? 'bottom-3 sm:bottom-4' : 'bottom-2.5 sm:bottom-3'
            }`}
          >
            {/* Subtle Minimal Pulse Tap Hint (Only when car has zoomed off and parcel is ready) */}
            {phase === 'zoom_off' && !isParcelOpened && (
              <span className="text-[9px] font-mono tracking-widest text-[#00FF94] animate-pulse mb-1 pointer-events-none whitespace-nowrap">
                TAP TO OPEN
              </span>
            )}

            {/* Unboxing SVG Component */}
            <svg
              width="84"
              height="74"
              viewBox="0 0 100 88"
              fill="none"
              className={`overflow-visible transition-all duration-300 ${!isParcelOpened ? 'group-hover:scale-105 group-hover:-translate-y-1 drop-shadow-[0_0_12px_rgba(255,230,0,0.5)]' : ''
                }`}
            >
              {/* Tarmac Shadow under Crate */}
              <ellipse cx="50" cy="82" rx="38" ry="5.5" fill="#000000" opacity="0.85" />
              <ellipse cx="50" cy="82" rx="30" ry="3.5" fill="#00FF94" opacity="0.45" />

              {/* UNBOXING BURST OF PARTICLES & STARS */}
              {isParcelOpened && (
                <g transform="translate(10, 8)">
                  <circle cx="40" cy="30" r="38" fill="url(#headlightVolumetric)" opacity="0.4" className="animate-ping" />
                  <text x="5" y="10" fill="#FFE600" fontSize="16" className="animate-bounce">⭐</text>
                  <text x="65" y="12" fill="#00FF94" fontSize="16" className="animate-pulse">✨</text>
                  <text x="38" y="-4" fill="#FF5C00" fontSize="18">🔥</text>
                  <text x="-4" y="38" fill="#00E5FF" fontSize="14">🎵</text>
                  <text x="74" y="34" fill="#FF0080" fontSize="15">💥</text>
                </g>
              )}

              {/* 24-BIT GOLD AUDIO MASTER VINYL (Rises out of crate) */}
              {isParcelOpened && (
                <g className="anim-vinyl-rise" transform="translate(24, 6)">
                  <circle cx="26" cy="26" r="25" fill="#00FF94" opacity="0.25" className="animate-ping" />
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 26 26"
                      to="360 26 26"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                    <circle cx="26" cy="26" r="24" fill="url(#goldVinylMaster)" stroke="#FFE600" strokeWidth="2.5" />
                    {/* Concentric Grooves */}
                    <circle cx="26" cy="26" r="20" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="3,2" />
                    <circle cx="26" cy="26" r="16" fill="none" stroke="#333" strokeWidth="1" />
                    <circle cx="26" cy="26" r="12" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="2,2" />
                    {/* Center Label */}
                    <circle cx="26" cy="26" r="9" fill="#00FF94" stroke="#000" strokeWidth="2" />
                    <circle cx="26" cy="26" r="3.5" fill="#000000" />
                  </g>
                </g>
              )}

              {/* PARCEL CRATE BODY */}
              <g transform="translate(24, 46)">
                <rect x="0" y="0" width="52" height="34" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="3" />
                <line x1="26" y1="0" x2="26" y2="34" stroke="#FF5C00" strokeWidth="5.5" />
                <line x1="0" y1="17" x2="52" y2="17" stroke="#FF5C00" strokeWidth="5.5" />

                {/* Badges on Box */}
                <rect x="5" y="6" width="18" height="10" fill="#000000" rx="1.5" />
                <text x="6.5" y="13.5" fill="#00FF94" fontSize="7" fontWeight="900">VAULT</text>

                <rect x="30" y="6" width="16" height="10" fill="#000000" rx="1.5" />
                <text x="32" y="13.5" fill="#FFE600" fontSize="7" fontWeight="900">24B</text>
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
        {/* === REALISTIC ASPHALT HIGHWAY (Zero Overflow CSS Streaming) === */}
        {/* ========================================================================= */}
        <div className="w-full relative h-6 sm:h-7 bg-[#111216] border-t border-b border-black z-10 overflow-hidden flex items-center shadow-[0_4px_16px_rgba(0,0,0,0.9)] -mt-3 sm:-mt-3.5">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#00FF94] via-[#FFE600] to-[#00FF94] opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black" />

          {/* Continuous Dashed Lane Markers with Hardware CSS Streaming */}
          <div
            className="w-full h-1 sm:h-1.5 road-dashes-stream shadow-[0_0_8px_#FFE600]"
            style={{
              animation: isDriving || isLaunching || isZoomingPast
                ? 'roadStream 0.18s linear infinite'
                : isReversing
                  ? 'roadStream 0.3s linear infinite reverse'
                  : 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}
