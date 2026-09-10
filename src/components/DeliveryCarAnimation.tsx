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
  | 'screech_in'
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
    mode === 'drive' ? 'drive_speed' : 'screech_in'
  )

  useEffect(() => {
    if (mode === 'drive') {
      setPhase('drive_speed')
      return
    }

    if (mode === 'return') {
      setPhase('screech_in')
      const t1 = setTimeout(() => setPhase('door_up'), 1400)
      const t2 = setTimeout(() => setPhase('dude_step_out'), 1900)
      const t3 = setTimeout(() => setPhase('drop_parcel'), 3400)
      const t4 = setTimeout(() => setPhase('hop_in'), 5000)
      const t5 = setTimeout(() => {
        setPhase('zoom_off')
        onDeliveryDelivered?.()
      }, 6000)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
      }
    }
  }, [mode, onDeliveryDelivered])

  const isDriving = phase === 'drive_speed'
  const isLaunching = phase === 'zoom_off'
  const isArriving = phase === 'screech_in'
  const isWheelsSpinning = isDriving || isLaunching || isArriving

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
          40% { transform: translateY(1.8px) rotate(-1.5deg); }
          75% { transform: translateY(-0.8px) rotate(0.4deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* High-speed road line streaming */
        @keyframes asphaltDash {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes asphaltDashHyper {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Speed Streaks across air */
        @keyframes speedStreakMove {
          0% { transform: translateX(180%) scaleX(0.4); opacity: 0; }
          30% { opacity: 0.9; transform: translateX(50%) scaleX(1.4); }
          80% { opacity: 0.8; transform: translateX(-120%) scaleX(2); }
          100% { transform: translateX(-220%) scaleX(0.2); opacity: 0; }
        }


        /* Scissor Door Hydraulic Lift */
        @keyframes scissorHydraulicOpen {
          0% { transform: rotate(0deg) translate(0, 0); }
          40% { transform: rotate(-25deg) translate(-6px, -10px); }
          100% { transform: rotate(-62deg) translate(-16px, -24px); }
        }
        @keyframes scissorHydraulicClose {
          0% { transform: rotate(-62deg) translate(-16px, -24px); }
          60% { transform: rotate(-15deg) translate(-4px, -6px); }
          100% { transform: rotate(0deg) translate(0, 0); }
        }

        /* Driver step out & drop animations */
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
        @keyframes emberFlyBack {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-140px, calc(var(--driftY, 0px) - 15px)) scale(0.2); opacity: 0; }
        }

        /* Screech In & Launch Out Travel */
        @keyframes hyperCarArrive {
          0% { transform: translateX(120vw); }
          60% { transform: translateX(-16px); }
          82% { transform: translateX(8px); }
          100% { transform: translateX(0px); }
        }
        @keyframes hyperCarLaunchOut {
          0% { transform: translateX(0px); opacity: 1; }
          15% { transform: translateX(-18px); opacity: 1; }
          35% { transform: translateX(60px); opacity: 1; }
          75% { transform: translateX(850px); opacity: 1; }
          100% { transform: translateX(1800px); opacity: 0; }
        }
        @keyframes driveCruise {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(8px); }
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

        @keyframes starFloat {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
          40% { transform: translate(var(--sx), var(--sy)) scale(1.25); opacity: 1; }
          100% { transform: translate(calc(var(--sx) * 1.5), calc(var(--sy) * 1.6)) scale(0.7); opacity: 0; }
        }

        .anim-chassis-vibe {
          animation: chassisVibe 0.18s linear infinite;
        }
        .anim-acceleration-squat {
          animation: accelerationSquat 0.8s ease-out forwards;
        }
        .anim-brake-dive {
          animation: brakeDive 1.1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
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
          transform-origin: 220px 72px;
          animation: scissorHydraulicOpen 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-scissor-close {
          transform-origin: 220px 72px;
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
        .anim-vinyl-spin {
          transform-origin: 26px 26px;
          animation: vinylGrooveSpin 3.5s linear infinite;
        }
        `
      }} />

      {/* Main Cinematic Scene Canvas */}
      <div className="relative w-full max-w-2xl mx-auto h-56 sm:h-64 flex flex-col justify-end items-center overflow-hidden rounded-md bg-gradient-to-b from-[#08080c]/60 via-[#0e0f14]/80 to-[#07070a] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">

        {/* Ambient Top Glow & Speed Grid Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#00FF94]/10 via-[#FFE600]/5 to-transparent blur-2xl" />
          {/* Subtle Cyber Horizon Line */}
          <div className="absolute bottom-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FF94]/30 to-transparent" />
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

        {/* Dynamic Context Speech Bubble (When Driver Interacts) */}
        {mode === 'return' && phase !== 'screech_in' && (
          <div className="absolute top-2 z-40 flex flex-col items-center">
            {phase === 'door_up' ? (
              <div className="relative bg-[#FFE600] text-black border-2 border-black px-3.5 py-1 rounded-sm shadow-[4px_4px_0px_#00FF94] text-center rotate-[-1deg] animate-bounce">
                <p className="text-[10.5px] sm:text-xs font-black tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  <span>SPECIAL SOUND VAULT DROP INCOMING!</span>
                  <span>📦⚡</span>
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black" />
              </div>
            ) : phase === 'dude_step_out' ? (
              <div className="relative bg-[#FFE600] text-black border-2 border-black px-3.5 py-1 rounded-sm shadow-[4px_4px_0px_#FF0080] text-center rotate-[1deg]">
                <p className="text-[10.5px] sm:text-xs font-black tracking-wider flex items-center gap-1.5">
                  <span>DROPPING YOUR 24-BIT MASTER AUDIO TOKENS!</span>
                  <span>🏎️💨</span>
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black" />
              </div>
            ) : phase === 'drop_parcel' ? (
              <div className="relative bg-[#00FF94] text-black border-2 border-black px-4 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center rotate-[-1deg] animate-pulse">
                <p className="text-[11px] sm:text-xs font-black tracking-wider flex items-center gap-1.5">
                  <span>VAULT CRATE PLANTED ON TARMAC! TAP TO UNBOX!</span>
                  <span>📦👇</span>
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black" />
              </div>
            ) : phase === 'hop_in' ? (
              <div className="relative bg-[#FF5C00] text-white border-2 border-black px-3.5 py-1 rounded-sm shadow-[3px_3px_0px_black] text-center rotate-[1deg]">
                <p className="text-[10.5px] sm:text-xs font-black tracking-wider flex items-center gap-1.5">
                  <span>SKRRT! NITRO CHARGED, ZOOMING OUT!</span>
                  <span>✌️🔥</span>
                </p>
              </div>
            ) : isParcelOpened ? (
              <div className="relative bg-[#00FF94] text-black border-2 border-black px-4 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center animate-bounce">
                <p className="text-[11px] sm:text-xs font-black tracking-wider flex items-center gap-1.5">
                  <span>{isDownloading ? 'EXTRACTING 24-BIT AUDIO MASTER...' : 'UNBOXED! MASTER AUDIO READY TO PLAY!'}</span>
                  <span>🎉🔥</span>
                </p>
              </div>
            ) : (
              <div
                className="relative bg-[#FFE600] text-black border-2 border-black px-4 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center animate-bounce cursor-pointer hover:bg-[#00FF94] transition-colors"
                onClick={onParcelClick}
              >
                <p className="text-[11px] sm:text-xs font-black tracking-wider flex items-center gap-1.5">
                  <span>CLICK THE CRATE TO UNBOX &amp; DOWNLOAD!</span>
                  <span>🎁⚡</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Live Token Dispatch Counter Bar (During Drive Mode) */}
        {isDriving && (
          <div className="absolute top-2.5 z-30 flex flex-col items-center w-full px-6 max-w-md">
            <div className="w-full flex items-center justify-between text-[10px] uppercase font-mono font-black text-white/70 mb-1">
              <span className="flex items-center gap-1.5 text-[#00FF94]">
                <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-ping" />
                TELEMETRY: NITRO BOOST ACTIVE
              </span>
              <span className="text-[#FFE600]">{Math.min(100, Math.round(progress || 78))}% LOCKED</span>
            </div>
            <div className="w-full h-2 bg-black/80 rounded-full border border-white/20 p-0.5 overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
              <div
                className="h-full bg-gradient-to-r from-[#FFE600] via-[#00FF94] to-[#00E5FF] rounded-full transition-all duration-300 shadow-[0_0_10px_#00FF94]"
                style={{ width: `${Math.min(100, Math.max(15, progress || 78))}%` }}
              />
            </div>
          </div>
        )}

        {/* The Animated Hypercar Stage */}
        <div
          className={`relative z-20 w-full flex justify-center ${mode === 'drive'
              ? 'animate-[driveCruise_2.5s_ease-in-out_infinite]'
              : isLaunching
                ? 'animate-[hyperCarLaunchOut_0.9s_cubic-bezier(0.5,0.05,0.9,0.3)_forwards]'
                : isArriving
                  ? 'animate-[hyperCarArrive_1.2s_cubic-bezier(0.16,0.85,0.25,1)_forwards]'
                  : ''
            }`}
        >
          <div
            className={`relative ${isDriving || isLaunching
                ? 'anim-acceleration-squat'
                : isArriving
                  ? 'anim-brake-dive'
                  : 'anim-chassis-vibe'
              }`}
          >
            {/* SVG Hypercar Model: Designed with Aerodynamic Depth & 3D Shading */}
            <svg
              viewBox="0 0 520 160"
              className="w-80 sm:w-96 md:w-[480px] h-auto overflow-visible"
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

                {/* Roof & Cockpit Gloss Highlight */}
                <linearGradient id="roofGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4a4d5e" />
                  <stop offset="50%" stopColor="#1a1b22" />
                  <stop offset="100%" stopColor="#0a0a0d" />
                </linearGradient>

                {/* Tinted Aerodynamic Glass with Interior Glow */}
                <linearGradient id="canopyGlass" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.45" />
                  <stop offset="45%" stopColor="#002b36" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00FF94" stopOpacity="0.3" />
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

                {/* Cross-Drilled Ceramic Brake Rotor */}
                <radialGradient id="brakeRotor" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#888c99" />
                  <stop offset="65%" stopColor="#3a3d47" />
                  <stop offset="100%" stopColor="#1a1a20" />
                </radialGradient>

                {/* Nitro Plasma Torch Jet (High Heat) */}
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

                {/* Scorched Titanium Exhaust Bluing */}
                <linearGradient id="titaniumBluing" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#33333d" />
                  <stop offset="45%" stopColor="#9966cc" />
                  <stop offset="80%" stopColor="#00aaff" />
                  <stop offset="100%" stopColor="#ffaa00" />
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

              {/* === NEON GROUND UNDERGLOW (Illuminating the tarmac) === */}
              <ellipse cx="270" cy="145" rx="160" ry="5.5" fill="#00FF94" opacity="0.65" />
              <ellipse cx="270" cy="145" rx="90" ry="3" fill="#FFE600" opacity="0.5" />

              {/* === VOLUMETRIC FORWARD HEADLIGHT BEAM === */}
              <polygon
                points="435,102 535,78 535,142 435,116"
                fill="url(#headlightVolumetric)"
                opacity="0.8"
              />
              <ellipse cx="490" cy="136" rx="40" ry="4" fill="url(#roadSpecularPool)" />

              {/* === NITRO EXHAUST SYSTEM (Mounted at rear x=122, y=114) === */}
              {(isDriving || isLaunching) && (
                <g>
                  {/* Outer Roaring Plasma Plume */}
                  <polygon
                    points="122,112 30,98 75,112 10,114 75,116 30,130 122,116"
                    fill="url(#plasmaFireOuter)"
                    className="anim-flame-outer"
                  />
                  {/* Inner Supersonic Shock Core */}
                  <polygon
                    points="122,113 55,107 90,113 35,114 90,115 55,121 122,115"
                    fill="url(#plasmaFireCore)"
                    className="anim-flame-core"
                  />
                  {/* Nozzle White Ignition Spot */}
                  <circle cx="120" cy="114" r="5" fill="#FFFFFF" />
                  <circle cx="112" cy="114" r="7.5" fill="#00F0FF" opacity="0.85" />

                  {/* Supersonic Mach Shock Diamonds */}
                  <ellipse cx="98" cy="114" rx="4" ry="2" fill="#FFFFFF" opacity="0.9" />
                  <ellipse cx="78" cy="114" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.75" />
                  <ellipse cx="60" cy="114" rx="2.5" ry="1.2" fill="#CCFFFF" opacity="0.6" />

                  {/* Trailing Fiery Embers & Sparks */}
                  <circle cx="48" cy="108" r="2" fill="#FFE600" />
                  <circle cx="28" cy="118" r="1.5" fill="#FF5C00" />
                  <circle cx="12" cy="112" r="2.2" fill="#00FF94" />
                  <circle cx="-5" cy="106" r="1.5" fill="#00E5FF" />
                  <circle cx="-18" cy="120" r="1.2" fill="#FFFFFF" />
                </g>
              )}

              {/* === HYPERCAR REAR SPOILER / SWAN-NECK GT WING === */}
              {/* Carbon Uprights */}
              <path d="M 148 84 L 126 56 L 134 56 L 154 84 Z" fill="#0a0a0d" stroke="#000" strokeWidth="1.5" />
              <path d="M 166 84 L 148 56 L 156 56 L 172 84 Z" fill="#0a0a0d" stroke="#000" strokeWidth="1.5" />
              {/* Main Aerofoil Wing with Gurney Flap */}
              <path
                d="M 112 55 C 125 53, 168 53, 178 57 L 176 61 C 166 58, 125 58, 114 60 Z"
                fill="#FFE600"
                stroke="#000000"
                strokeWidth="1.5"
              />
              {/* Wing Endplate with Neon Accent */}
              <polygon points="108,48 122,48 118,66 104,66" fill="#08080a" stroke="#FFE600" strokeWidth="1.2" />
              <rect x="109" y="52" width="2" height="10" fill="#00FF94" />

              {/* === MAIN HYPERCAR CHASSIS BODYWORK (Sculpted with 3D curves) === */}
              {/* Bottom Aerodynamic Carbon Diffuser Strakes */}
              <polygon points="120,122 138,122 135,127 116,127" fill="#050507" stroke="#000" strokeWidth="1" />
              <polygon points="138,122 156,122 153,127 136,127" fill="#050507" stroke="#000" strokeWidth="1" />

              {/* Main Silhouette Path with Muscular Fenders & Air Scoops */}
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

              {/* Upper Body Reflective Specular Shoulder Crease */}
              <path
                d="M 132 96 C 160 84, 210 74, 260 74 L 370 86 L 438 104"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.35"
              />

              {/* Dual Titanium Exhaust Nozzles (x=122, y=114) */}
              <rect x="120" y="108" width="9" height="11" rx="2" fill="url(#titaniumBluing)" stroke="#000" strokeWidth="1.2" />
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

              {/* Panoramic Cockpit Windshield & Glass Canopy */}
              <path
                d="M 230 62 
                   C 265 60, 298 60, 328 72 
                   L 378 88 
                   L 230 88 
                   Z"
                fill="url(#canopyGlass)"
                stroke="#000000"
                strokeWidth="2"
              />
              {/* Glass Horizon Reflection Streak */}
              <line x1="250" y1="65" x2="355" y2="84" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

              {/* Interior Digital Cockpit HUD (Glow behind glass) */}
              <rect x="330" y="78" width="8" height="5" rx="1" fill="#00FF94" opacity="0.8" />
              <circle cx="334" cy="80.5" r="1.5" fill="#FFE600" />

              {/* Front Aerodynamic Splitter & Carbon Canards */}
              <polygon points="432,118 456,118 452,126 428,126" fill="#050508" stroke="#FFE600" strokeWidth="1.5" />
              <polygon points="410,110 442,110 438,118 406,118" fill="#00FF94" stroke="#000" strokeWidth="1" />

              {/* Aggressive Quad LED Projector Headlights */}
              <polygon points="424,102 444,106 438,112 418,108" fill="#05050a" stroke="#00E5FF" strokeWidth="1.2" />
              <circle cx="426" cy="105" r="2" fill="#00E5FF" />
              <circle cx="432" cy="106.5" r="2" fill="#00E5FF" />
              <circle cx="438" cy="108" r="2.2" fill="#FFFFFF" />
              {/* Cyan DRL Eyebrow */}
              <line x1="422" y1="102" x2="444" y2="106" stroke="#00FF94" strokeWidth="1.8" strokeLinecap="round" />

              {/* Racing Livery & SamplesWala Monogram */}
              <polygon points="170,94 405,94 400,99 170,99" fill="#FFE600" opacity="0.9" />
              <polygon points="175,99 400,99 395,103 175,103" fill="#00FF94" opacity="0.9" />
              <g transform="translate(268, 97)">
                <text x="0" y="5" fill="#000000" fontSize="7" fontWeight="900" fontStyle="italic" textAnchor="middle">
                  SAMPLES<tspan fill="#FFFFFF">WALA</tspan>
                </text>
              </g>

              {/* Scissor / Butterfly Door (Swings Upward) */}
              <g className={
                (phase === 'door_up' || phase === 'dude_step_out' || phase === 'drop_parcel')
                  ? 'anim-scissor-open'
                  : (phase === 'hop_in' || phase === 'zoom_off')
                    ? 'anim-scissor-close'
                    : ''
              }>
                <path
                  d="M 235 65 L 285 65 L 310 102 L 230 102 Z"
                  fill="#181924"
                  stroke="#FFE600"
                  strokeWidth="2"
                />
                {/* Door Carbon Mirror */}
                <polygon points="305,82 318,80 316,86 304,86" fill="#0a0a0d" stroke="#000" strokeWidth="1" />
                <circle cx="316" cy="83" r="1.5" fill="#00FF94" />
                {/* Door Handle */}
                <rect x="270" y="88" width="10" height="3" rx="1.5" fill="#00FF94" />
              </g>

              {/* === HIGH-PERFORMANCE 3D FORGED WHEELS === */}
              {/* REAR WHEEL (Center: x=178, y=122) */}
              <path d="M 152 122 A 26 26 0 0 1 204 122 Z" fill="#000000" />
              <g transform="translate(178, 122)">
                {/* Rubber Tire Outer with Tread Rib */}
                <circle cx="0" cy="0" r="23" fill="#0d0d12" stroke="#000000" strokeWidth="3" />
                <circle cx="0" cy="0" r="20.5" fill="none" stroke="#222430" strokeWidth="1" strokeDasharray="3,2" />

                {/* Disc Brake Rotor & Neon Brembo Caliper */}
                <circle cx="0" cy="0" r="16.5" fill="url(#brakeRotor)" stroke="#111" strokeWidth="1" />
                <path d="M -15 -8 A 16 16 0 0 1 -7 -15 L -5 -11 A 12 12 0 0 0 -11 -6 Z" fill="#00FF94" stroke="#000" strokeWidth="1" />

                {/* Spinning Alloy Rim Assembly */}
                <g className={isWheelsSpinning ? (isLaunching ? 'anim-wheel-hyper' : 'anim-wheel-fast') : ''}>
                  <circle cx="0" cy="0" r="14.5" fill="url(#rimForgedAlloy)" stroke="#FFE600" strokeWidth="1.2" />
                  {/* 5-Split Spoke Architecture */}
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <g key={angle} transform={`rotate(${angle})`}>
                      <line x1="0" y1="-2" x2="0" y2="-13" stroke="#CCCCCC" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="-2" y1="-5" x2="-4" y2="-12" stroke="#666677" strokeWidth="1.2" />
                    </g>
                  ))}
                  {/* Center Hub Nut */}
                  <circle cx="0" cy="0" r="4.5" fill="#00FF94" stroke="#000000" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="2" fill="#FFE600" />
                </g>
              </g>

              {/* FRONT WHEEL (Center: x=366, y=122) */}
              <path d="M 340 122 A 26 26 0 0 1 392 122 Z" fill="#000000" />
              <g transform="translate(366, 122)">
                {/* Rubber Tire Outer with Tread Rib */}
                <circle cx="0" cy="0" r="23" fill="#0d0d12" stroke="#000000" strokeWidth="3" />
                <circle cx="0" cy="0" r="20.5" fill="none" stroke="#222430" strokeWidth="1" strokeDasharray="3,2" />

                {/* Disc Brake Rotor & Neon Brembo Caliper */}
                <circle cx="0" cy="0" r="16.5" fill="url(#brakeRotor)" stroke="#111" strokeWidth="1" />
                <path d="M -15 -8 A 16 16 0 0 1 -7 -15 L -5 -11 A 12 12 0 0 0 -11 -6 Z" fill="#00FF94" stroke="#000" strokeWidth="1" />

                {/* Spinning Alloy Rim Assembly */}
                <g className={isWheelsSpinning ? (isLaunching ? 'anim-wheel-hyper' : 'anim-wheel-fast') : ''}>
                  <circle cx="0" cy="0" r="14.5" fill="url(#rimForgedAlloy)" stroke="#FFE600" strokeWidth="1.2" />
                  {/* 5-Split Spoke Architecture */}
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <g key={angle} transform={`rotate(${angle})`}>
                      <line x1="0" y1="-2" x2="0" y2="-13" stroke="#CCCCCC" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="-2" y1="-5" x2="-4" y2="-12" stroke="#666677" strokeWidth="1.2" />
                    </g>
                  ))}
                  {/* Center Hub Nut */}
                  <circle cx="0" cy="0" r="4.5" fill="#00FF94" stroke="#000000" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="2" fill="#FFE600" />
                </g>
              </g>

              {/* === STYLIZED STREETWEAR DRIVER (Step out & Drop Parcel) === */}
              {mode === 'return' && phase !== 'screech_in' && phase !== 'door_up' && phase !== 'zoom_off' && (
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
                  <ellipse cx="68" cy="138" rx="18" ry="3" fill="#000" opacity="0.75" />

                  {/* Denim Jeans & Sneakers */}
                  <path d="M 60 106 L 56 128 L 50 137" stroke="#161822" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 74 106 L 80 128 L 86 137" stroke="#1e212d" strokeWidth="8" strokeLinecap="round" />
                  {/* Cyber Sneakers */}
                  <polygon points="46,138 58,138 58,133 46,133" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                  <polygon points="82,138 94,138 94,133 82,133" fill="#00FF94" stroke="#000" strokeWidth="1.5" />

                  {/* Bomber Jacket with Metallic Zipper */}
                  <path
                    d="M 46 76 L 90 76 L 82 108 L 52 108 Z"
                    fill="#0a0a0f"
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  <line x1="67" y1="76" x2="67" y2="108" stroke="#FFE600" strokeWidth="2" />

                  {/* Chunky Golden Chain & "SW" Medallion */}
                  <path d="M 58 78 Q 67 92 76 78" stroke="#FFE600" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="67" cy="92" r="4.5" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                  <text x="67" y="94.5" fill="#000" fontSize="5" fontWeight="900" textAnchor="middle">SW</text>

                  {/* Head, Aviators & Pompadour Hair */}
                  <rect x="62" y="66" width="10" height="12" fill="#F4A982" stroke="#000" strokeWidth="1.2" />
                  <polygon points="56,54 78,54 74,68 60,68" fill="#F4A982" stroke="#000" strokeWidth="1.5" />

                  {/* Dark Aviator Sunglasses with Neon Horizon Reflection */}
                  <rect x="56" y="55" width="10" height="7" rx="2" fill="#000000" stroke="#FFE600" strokeWidth="1.2" />
                  <rect x="67" y="55" width="10" height="7" rx="2" fill="#000000" stroke="#FFE600" strokeWidth="1.2" />
                  <line x1="57" y1="57" x2="65" y2="60" stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="68" y1="57" x2="76" y2="60" stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Voluminous Pompadour Hairstyle */}
                  <path
                    d="M 55 54 
                       C 50 38, 56 25, 70 25 
                       C 82 25, 92 34, 85 52 
                       C 81 55, 78 54, 76 54 
                       Z"
                    fill="#FFE600"
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  <path d="M 64 32 Q 76 36 78 46" stroke="#FFAA00" strokeWidth="2" fill="none" />

                  {/* Arm Action: Holding Parcel or Pointing */}
                  {phase === 'dude_step_out' ? (
                    <>
                      <path d="M 48 78 L 36 90 L 28 94" stroke="#F4A982" strokeWidth="6.5" strokeLinecap="round" />
                      <path d="M 88 78 L 66 91 L 46 94" stroke="#F4A982" strokeWidth="6.5" strokeLinecap="round" />
                      {/* Holding the Sound Vault Parcel in hands */}
                      <g transform="translate(14, 82)">
                        <rect x="0" y="0" width="32" height="24" rx="2" fill="#FFE600" stroke="#000" strokeWidth="2.5" />
                        <line x1="16" y1="0" x2="16" y2="24" stroke="#FF5C00" strokeWidth="4" />
                        <line x1="0" y1="12" x2="32" y2="12" stroke="#FF5C00" strokeWidth="4" />
                        <rect x="4" y="4" width="12" height="7" fill="#000" rx="1" />
                        <text x="5" y="9.5" fill="#00FF94" fontSize="5" fontWeight="900">VAULT</text>
                      </g>
                    </>
                  ) : phase === 'drop_parcel' ? (
                    <>
                      {/* Pointing down at parcel on tarmac */}
                      <path d="M 48 80 L 32 102 L 20 118" stroke="#F4A982" strokeWidth="6.5" strokeLinecap="round" />
                      <path d="M 88 80 L 58 106 L 36 120" stroke="#F4A982" strokeWidth="6.5" strokeLinecap="round" />
                      <polygon points="17,118 24,118 20,128" fill="#FFE600" stroke="#000" strokeWidth="1.2" />
                      <polygon points="33,120 40,120 36,130" fill="#FFE600" stroke="#000" strokeWidth="1.2" />
                    </>
                  ) : (
                    <>
                      {/* Peace Sign when hopping back in */}
                      <path d="M 48 78 L 36 90 L 28 94" stroke="#F4A982" strokeWidth="6.5" strokeLinecap="round" />
                      <path d="M 88 78 L 66 91 L 46 94" stroke="#F4A982" strokeWidth="6.5" strokeLinecap="round" />
                      <g transform="translate(92, 58)">
                        <rect x="0" y="0" width="18" height="15" rx="3" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                        <text x="9" y="11" fill="#000" fontSize="9" fontWeight="900" textAnchor="middle">✌️</text>
                      </g>
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* === INTERACTIVE PARCEL ON ASPHALT (Planted by driver) === */}
        {/* ========================================================================= */}
        {mode === 'return' && (phase === 'drop_parcel' || phase === 'hop_in' || phase === 'zoom_off') && (
          <div
            onClick={onParcelClick}
            className="absolute left-1/2 -translate-x-1/2 bottom-3.5 z-30 flex flex-col items-center cursor-pointer group"
          >
            {/* Click to Unbox Floating Label */}
            {!isParcelOpened && (
              <div className="absolute -top-10 z-40 animate-bounce pointer-events-none whitespace-nowrap">
                <span className="px-3 py-1 bg-[#FFE600] text-black text-[10px] font-mono font-black uppercase tracking-wider rounded-xs border-2 border-black shadow-[3px_3px_0px_#00FF94] flex items-center gap-1.5 hover:bg-[#00FF94]">
                  <span>TAP TO UNBOX YOUR 24-BIT SOUNDS!</span>
                  <span className="text-xs">🎁🔥</span>
                </span>
              </div>
            )}

            {/* Unboxing SVG Component */}
            <svg
              width="100"
              height="88"
              viewBox="0 0 100 88"
              fill="none"
              className={`overflow-visible transition-transform duration-200 ${!isParcelOpened ? 'group-hover:scale-110 group-hover:rotate-1' : ''
                }`}
            >
              {/* Tarmac Shadow under Crate */}
              <ellipse cx="50" cy="82" rx="38" ry="5.5" fill="#000000" opacity="0.85" />
              <ellipse cx="50" cy="82" rx="30" ry="3.5" fill="#00FF94" opacity="0.45" />

              {/* UNBOXING BURST OF PARTICLES & STARS */}
              {isParcelOpened && (
                <g transform="translate(10, 8)">
                  <circle cx="40" cy="30" r="38" fill="url(#headlightVolumetric)" opacity="0.4" className="animate-ping" />
                  {/* Floating Starburst Emojis */}
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
                  <g className="anim-vinyl-spin">
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
                {/* 3D Bow Knot */}
                <circle cx="29" cy="-3.5" r="7" fill="#FF0055" stroke="#000" strokeWidth="2" />
                <ellipse cx="22" cy="-4.5" rx="4.5" ry="3" fill="#FF5C00" stroke="#000" strokeWidth="1.2" transform="rotate(-25 22 -4.5)" />
                <ellipse cx="36" cy="-4.5" rx="4.5" ry="3" fill="#FF5C00" stroke="#000" strokeWidth="1.2" transform="rotate(25 36 -4.5)" />
              </g>
            </svg>
          </div>
        )}

        {/* ========================================================================= */}
        {/* === REALISTIC ASPHALT HIGHWAY (Directly aligned with tire contact) === */}
        {/* ========================================================================= */}
        <div className="w-full relative h-8 bg-[#111216] border-t-2 border-b-2 border-black z-10 overflow-hidden flex items-center shadow-[0_4px_16px_rgba(0,0,0,0.9)] -mt-4">
          {/* Textured Tarmac Grain & Shoulder Lines */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00FF94] via-[#FFE600] to-[#00FF94] opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />

          {/* Continuous Dashed Lane Markers with Speed Blur */}
          <div
            className="w-[200%] flex items-center justify-around"
            style={{
              animation: isDriving || isLaunching
                ? 'asphaltDash 0.22s linear infinite'
                : isArriving
                  ? 'asphaltDash 0.35s linear infinite'
                  : 'none'
            }}
          >
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-1.5 bg-[#FFE600] border border-black rounded-xs shadow-[0_0_8px_#FFE600]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
