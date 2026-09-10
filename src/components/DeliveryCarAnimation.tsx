'use client'

import React, { useState, useEffect } from 'react'

interface DeliveryCarAnimationProps {
  mode: 'drive' | 'return'
  onDeliveryDelivered?: () => void
  onParcelClick?: () => void
  isParcelOpened?: boolean
  isDownloading?: boolean
}

type DeliveryPhase = 
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
  isDownloading = false
}: DeliveryCarAnimationProps) {
  const [phase, setPhase] = useState<DeliveryPhase>(
    mode === 'drive' ? 'screech_in' : 'screech_in'
  )

  useEffect(() => {
    if (mode === 'return') {
      const t1 = setTimeout(() => setPhase('door_up'), 1200)
      const t2 = setTimeout(() => setPhase('dude_step_out'), 1700)
      const t3 = setTimeout(() => setPhase('drop_parcel'), 3200)
      const t4 = setTimeout(() => setPhase('hop_in'), 4800)
      const t5 = setTimeout(() => {
        setPhase('zoom_off')
        onDeliveryDelivered?.()
      }, 5800)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
      }
    }
  }, [mode, onDeliveryDelivered])

  return (
    <div className="w-full relative overflow-hidden select-none my-1">
      {/* Precision CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes supercarRollRight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes supercarRollLeft {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes supercarIdleVibe {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-1.2px); }
          100% { transform: translateY(0px); }
        }
        @keyframes driveFastAcrossStage {
          0% { transform: translateX(-120%); }
          30% { transform: translateX(-10%); }
          65% { transform: translateX(45%); }
          100% { transform: translateX(130vw); }
        }
        @keyframes supercarArriveScreech {
          0% { transform: translateX(110vw); }
          65% { transform: translateX(-14px); }
          85% { transform: translateX(6px); }
          100% { transform: translateX(0px); }
        }
        @keyframes supercarLaunchSpeed {
          0% { transform: translateX(0px); opacity: 1; }
          12% { transform: translateX(-16px); opacity: 1; }
          30% { transform: translateX(45px); opacity: 1; }
          70% { transform: translateX(700px); opacity: 1; }
          100% { transform: translateX(1600px); opacity: 0; pointer-events: none; }
        }
        @keyframes scissorDoorOpen {
          0% { transform: rotate(0deg) translateY(0); }
          100% { transform: rotate(-65deg) translate(-14px, -18px); }
        }
        @keyframes scissorDoorClose {
          0% { transform: rotate(-65deg) translate(-14px, -18px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes dudeStepOutAnim {
          0% { transform: translate(160px, 12px) scale(0.6); opacity: 0; }
          40% { transform: translate(130px, 4px) scale(0.85); opacity: 1; }
          100% { transform: translate(90px, 0px) scale(1); opacity: 1; }
        }
        @keyframes dudeBendAndDropAnim {
          0% { transform: translate(90px, 0px); }
          40% { transform: translate(60px, 4px) rotate(3deg); }
          70% { transform: translate(45px, 6px) rotate(4deg); }
          100% { transform: translate(50px, 0px) rotate(0deg); }
        }
        @keyframes dudeHopBackAnim {
          0% { transform: translate(50px, 0px) scale(1); opacity: 1; }
          50% { transform: translate(100px, 4px) scale(0.85); opacity: 1; }
          100% { transform: translate(160px, 12px) scale(0.5); opacity: 0; }
        }
        @keyframes flameTongue1 {
          0% { transform: scaleX(0.7) scaleY(0.85); opacity: 0.8; }
          50% { transform: scaleX(1.35) scaleY(1.15) translateY(-1px); opacity: 1; }
          100% { transform: scaleX(0.7) scaleY(0.85); opacity: 0.8; }
        }
        @keyframes flameTongue2 {
          0% { transform: scaleX(1.2) scaleY(1.1); opacity: 0.9; }
          50% { transform: scaleX(0.75) scaleY(0.8); opacity: 0.7; }
          100% { transform: scaleX(1.2) scaleY(1.1); opacity: 0.9; }
        }
        @keyframes bubbleCompactPop {
          0% { transform: scale(0.4) translateY(10px); opacity: 0; }
          70% { transform: scale(1.04) translateY(-1px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes giftLidFlyOff {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          30% { transform: translate(8px, -35px) rotate(-15deg) scale(1.08); opacity: 1; }
          60% { transform: translate(25px, -70px) rotate(40deg) scale(1.15); opacity: 0.9; }
          100% { transform: translate(45px, -110px) rotate(85deg) scale(0.7); opacity: 0; }
        }
        @keyframes discPopOut {
          0% { transform: translate(0, 20px) scale(0.2); opacity: 0; }
          50% { transform: translate(0, -42px) scale(1.22); opacity: 1; }
          75% { transform: translate(0, -32px) scale(0.96); opacity: 1; }
          100% { transform: translate(0, -36px) scale(1); opacity: 1; }
        }
        @keyframes vinylSpinGrooves {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes boxExcitedBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-3px) scale(1.03) rotate(-1deg); }
          75% { transform: translateY(-1.5px) scale(1.02) rotate(1deg); }
        }
        @keyframes sunburstRadiate {
          0% { transform: scale(0.3) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(60deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(120deg); opacity: 0.7; }
        }
        @keyframes starFloatUp1 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { transform: translate(-28px, -45px) scale(1.2); opacity: 1; }
          100% { transform: translate(-38px, -70px) scale(0.8); opacity: 0; }
        }
        @keyframes starFloatUp2 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { transform: translate(30px, -48px) scale(1.2); opacity: 1; }
          100% { transform: translate(42px, -75px) scale(0.8); opacity: 0; }
        }
        @keyframes starFloatUp3 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { transform: translate(0px, -55px) scale(1.3); opacity: 1; }
          100% { transform: translate(0px, -85px) scale(0.8); opacity: 0; }
        }

        .supercar-idle {
          animation: supercarIdleVibe 0.15s ease-in-out infinite;
        }
        .roll-forward {
          transform-origin: center;
          animation: supercarRollRight 0.2s linear infinite;
        }
        .nitro-flame-1 {
          transform-origin: 118px 105px;
          animation: flameTongue1 0.08s ease-in-out infinite;
        }
        .nitro-flame-2 {
          transform-origin: 118px 105px;
          animation: flameTongue2 0.1s ease-in-out infinite;
        }
        .door-open-up {
          transform-origin: 228px 72px;
          animation: scissorDoorOpen 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .door-close-down {
          transform-origin: 228px 72px;
          animation: scissorDoorClose 0.35s ease-in forwards;
        }
        .dude-step-out {
          animation: dudeStepOutAnim 0.8s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        .dude-drop-parcel {
          animation: dudeBendAndDropAnim 1.4s ease-in-out forwards;
        }
        .dude-hop-back {
          animation: dudeHopBackAnim 0.75s ease-in forwards;
        }
        .compact-bubble {
          animation: bubbleCompactPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .supercar-launch {
          animation: supercarLaunchSpeed 0.85s cubic-bezier(0.5, 0.05, 0.9, 0.3) forwards;
        }
        .supercar-arrive {
          animation: supercarArriveScreech 1.2s cubic-bezier(0.15, 0.85, 0.25, 1) forwards;
        }
        .supercar-drive-across {
          animation: driveFastAcrossStage 3s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        }
        .lid-fly {
          animation: giftLidFlyOff 0.75s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        .disc-emerge {
          animation: discPopOut 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .vinyl-spin {
          transform-origin: 24px 24px;
          animation: vinylSpinGrooves 4s linear infinite;
        }
        .parcel-waiting-bounce {
          animation: boxExcitedBounce 1.5s ease-in-out infinite;
        }
        .sunburst-anim {
          transform-origin: 40px 30px;
          animation: sunburstRadiate 0.8s ease-out forwards;
        }
        .star-burst-1 {
          animation: starFloatUp1 0.9s cubic-bezier(0.1, 0.9, 0.3, 1) forwards;
        }
        .star-burst-2 {
          animation: starFloatUp2 0.9s cubic-bezier(0.1, 0.9, 0.3, 1) forwards;
        }
        .star-burst-3 {
          animation: starFloatUp3 0.9s cubic-bezier(0.1, 0.9, 0.3, 1) forwards;
        }
        `
      }} />

      {/* Main Visual Stage */}
      <div className="relative w-full max-w-2xl mx-auto h-52 sm:h-56 flex flex-col justify-end items-center overflow-hidden">
        
        {/* Compact Gen-Z English Speech Bubble (Positioned high up) */}
        {mode === 'return' && phase !== 'screech_in' && (
          <div className="absolute top-1 z-40 compact-bubble flex flex-col items-center">
            {phase === 'door_up' ? (
              <div className="relative bg-studio-yellow text-black border-2 border-black px-3 py-1 rounded-sm shadow-[4px_4px_0px_black] text-center rotate-[-1deg]">
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>YO! SPECIAL DROP INCOMING!</span>
                  <span className="text-xs">📦🔥</span>
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-black" />
              </div>
            ) : phase === 'dude_step_out' ? (
              <div className="relative bg-studio-yellow text-black border-2 border-black px-3 py-1 rounded-sm shadow-[4px_4px_0px_black] text-center rotate-[1deg]">
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>ALMOST FORGOT TO DROP YOUR SOUND VAULT!</span>
                  <span className="text-xs">🏎️💨</span>
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-black" />
              </div>
            ) : phase === 'drop_parcel' ? (
              <div className="relative bg-[#00FF94] text-black border-2 border-black px-3.5 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center rotate-[-1deg] animate-pulse">
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>DROPPED YOUR VAULT DROP RIGHT HERE! TAP IT TO UNBOX!</span>
                  <span className="text-xs">📦👇</span>
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-black" />
              </div>
            ) : phase === 'hop_in' ? (
              <div className="relative bg-[#FF5C00] text-white border-2 border-black px-3 py-1 rounded-sm shadow-[3px_3px_0px_black] text-center rotate-[1deg]">
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>SKRRT! TAP TO UNBOX, I&apos;M ZOOMING OUT!</span>
                  <span className="text-xs">🏎️💨</span>
                </p>
              </div>
            ) : isParcelOpened ? (
              <div className="relative bg-[#00FF94] text-black border-2 border-black px-4 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center animate-bounce">
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>{isDownloading ? 'DOWNLOADING 24-BIT AUDIO MASTER...' : 'UNBOXED! ENJOY YOUR NEW SOUNDS!'}</span>
                  <span className="text-xs">🎉🔥</span>
                </p>
              </div>
            ) : (
              <div 
                className="relative bg-studio-yellow text-black border-2 border-black px-3.5 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center animate-bounce cursor-pointer hover:bg-[#00FF94] transition-colors" 
                onClick={onParcelClick}
              >
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>YOUR PARCEL IS WAITING! CLICK THE BOX TO UNBOX &amp; DOWNLOAD!</span>
                  <span className="text-xs">🎁⚡</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* The Animated Supercar & Johnny Bravo Container */}
        <div className={`relative z-20 w-full flex justify-center ${
          mode === 'drive' 
            ? 'supercar-drive-across' 
            : phase === 'zoom_off'
            ? 'supercar-launch'
            : 'supercar-arrive'
        }`}>
          <div className={`${(mode === 'drive' || phase === 'screech_in' || phase === 'zoom_off') ? 'supercar-idle' : ''} relative`}>
            
            {/* Integrated SVG Stage: Tires (y=125) sit directly ON the asphalt road (y=125) */}
            <svg
              viewBox="0 0 460 145"
              className="w-76 sm:w-92 md:w-[460px] h-auto overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Headlight Volumetric Beam */}
                <linearGradient id="hyperBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FF94" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#FFE600" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFE600" stopOpacity="0" />
                </linearGradient>

                {/* Stealth Body Gradient */}
                <linearGradient id="stealthBody" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0a0a0c" />
                  <stop offset="35%" stopColor="#181820" />
                  <stop offset="70%" stopColor="#0d0d12" />
                  <stop offset="100%" stopColor="#1f1f28" />
                </linearGradient>

                {/* Neon Rim Gradient */}
                <radialGradient id="hyperRim" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE600" />
                  <stop offset="65%" stopColor="#00FF94" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>

                {/* High-Heat Nitro Flame Gradients */}
                <linearGradient id="nitroOuter" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFE600" />
                  <stop offset="30%" stopColor="#FF5C00" />
                  <stop offset="70%" stopColor="#FF0055" />
                  <stop offset="100%" stopColor="#0074E4" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="nitroCore" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#0074E4" />
                </linearGradient>
              </defs>

              {/* === TIRE CONTACT SHADOWS ON ROAD (y=125) === */}
              <ellipse cx="167" cy="125" rx="19" ry="2" fill="#000000" />
              <ellipse cx="327" cy="125" rx="19" ry="2" fill="#000000" />

              {/* === NEON ROAD UNDERGLOW (Planted on tarmac at y=125) === */}
              <ellipse cx="250" cy="125" rx="130" ry="4" fill="#00FF94" opacity="0.5" />

              {/* Headlight Beam shining forward on road */}
              <polygon points="390,92 470,75 470,125 390,102" fill="url(#hyperBeam)" opacity="0.65" />

              {/* === PROPER NITRO EXHAUST FLAMES (Blasting directly from tailpipes at x=118, y=105) === */}
              {(phase === 'zoom_off' || mode === 'drive') && (
                <g>
                  {/* Outer Wild Fire Tongue */}
                  <polygon
                    points="118,103 35,93 75,103 20,105 75,107 35,117 118,107"
                    fill="url(#nitroOuter)"
                    className="nitro-flame-1"
                  />
                  {/* Inner Blue-White Torch Flame */}
                  <polygon
                    points="118,104 60,98 88,104 45,105 88,106 60,112 118,106"
                    fill="url(#nitroCore)"
                    className="nitro-flame-2"
                  />
                  {/* Nozzle Hot Spot */}
                  <circle cx="116" cy="105" r="4.5" fill="#FFFFFF" />
                  <circle cx="106" cy="105" r="6.5" fill="#00E5FF" opacity="0.8" />
                  {/* Trailing sparks */}
                  <circle cx="45" cy="100" r="1.5" fill="#FFE600" />
                  <circle cx="28" cy="108" r="1.5" fill="#FF5C00" />
                  <circle cx="16" cy="104" r="2" fill="#00FF94" />
                </g>
              )}

              {/* === SUPERCAR CHASSIS === */}
              {/* Carbon Rear Wing / Spoiler */}
              <path d="M 125 76 L 105 58 L 138 58 L 135 76 Z" fill="#0d0d12" stroke="#000" strokeWidth="2" />
              <rect x="95" y="55" width="48" height="4.5" rx="1.5" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
              <rect x="94" y="54" width="4" height="6" fill="#00FF94" />

              {/* Main Supercar Body Shell */}
              <path
                d="M 120 108 
                   L 125 86 
                   L 155 76 
                   L 205 60 
                   L 275 60 
                   L 335 84 
                   L 395 94 
                   L 395 108 
                   Z"
                fill="url(#stealthBody)"
                stroke="#000000"
                strokeWidth="3.5"
              />

              {/* Dual Exhaust Tailpipe Housing at rear (x=118, y=103-107) */}
              <rect x="116" y="102" width="7" height="7" rx="1.5" fill="#333" stroke="#000" strokeWidth="1" />
              <circle cx="118" cy="105.5" r="2.2" fill="#000" />

              {/* Cockpit Canopy */}
              <path
                d="M 210 63 L 270 63 L 325 84 L 205 84 Z"
                fill="#00E5FF"
                fillOpacity="0.3"
                stroke="#000"
                strokeWidth="2"
              />
              <line x1="225" y1="65" x2="310" y2="82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Front Splitter & Intakes */}
              <polygon points="385,102 398,102 402,110 380,110" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
              <polygon points="360,94 388,94 384,102 355,102" fill="#00FF94" stroke="#000" strokeWidth="1" />

              {/* Twin Sharp LED Headlights */}
              <polygon points="380,88 394,92 388,96 376,92" fill="#00FF94" stroke="#000" strokeWidth="1.2" />
              <polygon points="382,90 392,93 388,95 380,93" fill="#FFFFFF" />

              {/* Side Racing Stripes */}
              <polygon points="145,86 360,86 355,90 145,90" fill="#FFE600" stroke="#000" strokeWidth="0.8" />
              <polygon points="148,90 355,90 350,93 148,93" fill="#00FF94" stroke="#000" strokeWidth="0.8" />

              {/* Brand Label */}
              <g transform="translate(180, 88)">
                <text x="35" y="8" fill="#FFE600" fontSize="7.5" fontWeight="900" fontStyle="italic" fontFamily="monospace" textAnchor="middle">
                  SAMPLES<tspan fill="#00FF94">WALA</tspan>
                </text>
              </g>

              {/* Scissor Door (Swings UPWARD) */}
              <g className={
                (phase === 'door_up' || phase === 'dude_step_out' || phase === 'drop_parcel')
                  ? 'door-open-up'
                  : (phase === 'hop_in' || phase === 'zoom_off')
                  ? 'door-close-down'
                  : ''
              }>
                <path
                  d="M 215 65 L 265 65 L 285 96 L 210 96 Z"
                  fill="#181822"
                  stroke="#FFE600"
                  strokeWidth="2"
                />
                <rect x="250" y="78" width="8" height="3" rx="1" fill="#00FF94" />
              </g>

              {/* Wheels */}
              {/* Rear Wheel */}
              <path d="M 145 108 A 19 19 0 0 1 189 108 Z" fill="#000" />
              <g transform="translate(167, 108)">
                <circle cx="0" cy="0" r="17" fill="#0a0a0a" stroke="#000" strokeWidth="3" />
                <g className={(mode === 'drive' || phase === 'zoom_off') ? 'roll-forward' : ''}>
                  <circle cx="0" cy="0" r="11" fill="url(#hyperRim)" stroke="#000" strokeWidth="1.5" />
                  <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#00FF94" stroke="#000" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFE600" />
                </g>
              </g>

              {/* Front Wheel */}
              <path d="M 305 108 A 19 19 0 0 1 349 108 Z" fill="#000" />
              <g transform="translate(327, 108)">
                <circle cx="0" cy="0" r="17" fill="#0a0a0a" stroke="#000" strokeWidth="3" />
                <g className={(mode === 'drive' || phase === 'zoom_off') ? 'roll-forward' : ''}>
                  <circle cx="0" cy="0" r="11" fill="url(#hyperRim)" stroke="#000" strokeWidth="1.5" />
                  <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#00FF94" stroke="#000" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFE600" />
                </g>
              </g>

              {/* ========================================================================= */}
              {/* === JOHNNY BRAVO COOL DUDE === */}
              {/* ========================================================================= */}
              {mode === 'return' && phase !== 'screech_in' && phase !== 'door_up' && phase !== 'zoom_off' && (
                <g className={
                  phase === 'dude_step_out'
                    ? 'dude-step-out'
                    : phase === 'drop_parcel'
                    ? 'dude-drop-parcel'
                    : phase === 'hop_in'
                    ? 'dude-hop-back'
                    : ''
                }>
                  {/* Shadow under cool dude planted on road */}
                  <ellipse cx="65" cy="125" rx="16" ry="2.5" fill="#000" opacity="0.6" />

                  {/* Legs with dark jeans (Sneakers touch road at y=124) */}
                  <path d="M 58 98 L 55 118 L 50 123" stroke="#16161c" strokeWidth="7.5" strokeLinecap="round" />
                  <path d="M 68 98 L 73 118 L 78 123" stroke="#1c1c24" strokeWidth="7.5" strokeLinecap="round" />
                  {/* High-top Sneakers */}
                  <path d="M 47 124 L 56 124 L 56 120 L 47 120 Z" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                  <path d="M 75 124 L 84 124 L 84 120 L 75 120 Z" fill="#00FF94" stroke="#000" strokeWidth="1.5" />

                  {/* Johnny Bravo Broad-Shouldered Tight Black T-Shirt */}
                  <path
                    d="M 44 70 L 84 70 L 78 98 L 50 98 Z"
                    fill="#050505"
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  <polygon points="60,70 68,70 64,78" fill="#F3A87C" stroke="#000" strokeWidth="1" />

                  {/* Thick Golden Chain around neck */}
                  <path d="M 58 73 Q 64 83 70 73" stroke="#FFE600" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="64" cy="84" r="3.5" fill="#FFE600" stroke="#000" strokeWidth="1.2" />
                  <text x="64" y="86" fill="#000" fontSize="4.5" fontWeight="900" textAnchor="middle">S</text>

                  {/* Head, Johnny Bravo Pompadour Hair & Sunglasses */}
                  <rect x="60" y="63" width="8" height="9" fill="#F3A87C" stroke="#000" strokeWidth="1" />
                  <polygon points="56,52 72,52 70,64 58,64" fill="#F3A87C" stroke="#000" strokeWidth="1.5" />
                  <path d="M 61 60 Q 65 62 68 59" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                  {/* Sunglasses (Chasma) */}
                  <rect x="55" y="52" width="8.5" height="5.5" rx="1.5" fill="#000000" stroke="#FFE600" strokeWidth="1" />
                  <rect x="64.5" y="52" width="8.5" height="5.5" rx="1.5" fill="#000000" stroke="#FFE600" strokeWidth="1" />
                  <line x1="63.5" y1="54" x2="64.5" y2="54" stroke="#000" strokeWidth="2" />
                  <line x1="57" y1="53" x2="61" y2="56" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                  <line x1="66" y1="53" x2="70" y2="56" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

                  {/* Big Slick Pompadour Hair */}
                  <path
                    d="M 55 52 
                       C 52 40, 56 28, 68 28 
                       C 78 28, 86 36, 80 50 
                       C 76 53, 73 52, 72 52 
                       Z"
                    fill="#FFE600"
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  <path d="M 62 33 Q 72 36 73 44" stroke="#FFAA00" strokeWidth="1.8" fill="none" />
                  <path d="M 58 40 Q 66 42 68 48" stroke="#FFAA00" strokeWidth="1.5" fill="none" />

                  {/* Arms & Hands (Holding box while stepping out, pointing down when dropping) */}
                  {phase === 'dude_step_out' ? (
                    <>
                      <path d="M 45 71 L 34 81 L 28 84" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 83 71 L 62 82 L 42 84" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="27" cy="84" r="3.5" fill="#F3A87C" stroke="#000" strokeWidth="1" />
                      <circle cx="39" cy="85" r="3.5" fill="#F3A87C" stroke="#000" strokeWidth="1" />

                      {/* Holding the Golden Parcel in hands */}
                      <g transform="translate(10, 72)" className="animate-pulse">
                        <rect x="0" y="0" width="28" height="22" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="2.5" />
                        <line x1="14" y1="0" x2="14" y2="22" stroke="#FF5C00" strokeWidth="3.5" />
                        <line x1="0" y1="11" x2="28" y2="11" stroke="#FF5C00" strokeWidth="3.5" />
                        <circle cx="14" cy="-1" r="3.5" fill="#FF0055" stroke="#000" strokeWidth="1" />
                        <rect x="3" y="3" width="10" height="6" fill="#000" rx="1" />
                        <text x="4" y="8" fill="#00FF94" fontSize="4.5" fontWeight="900" fontFamily="monospace">VAULT</text>
                      </g>
                    </>
                  ) : phase === 'drop_parcel' ? (
                    <>
                      {/* Hands Pointing Directly Down at the Dropped Parcel on Road */}
                      <path d="M 45 72 L 30 92 L 20 106" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 83 72 L 55 94 L 35 108" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                      {/* Pointing Fingers Down */}
                      <polygon points="17,106 23,106 20,115" fill="#FFE600" stroke="#000" strokeWidth="1" />
                      <polygon points="32,108 38,108 35,117" fill="#FFE600" stroke="#000" strokeWidth="1" />
                    </>
                  ) : (
                    <>
                      {/* Peace Sign Pose when hopping back in */}
                      <path d="M 45 71 L 34 81 L 28 84" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 83 71 L 62 82 L 42 84" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                      <g transform="translate(85, 55)" className="compact-bubble">
                        <rect x="0" y="0" width="16" height="13" rx="2" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                        <text x="8" y="10" fill="#000" fontSize="8" fontWeight="900" textAnchor="middle">✌️</text>
                      </g>
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* === THE PERMANENT PARCEL ON THE ROAD (Dropped by dude, stays forever!) === */}
        {/* ========================================================================= */}
        {mode === 'return' && (phase === 'drop_parcel' || phase === 'hop_in' || phase === 'zoom_off') && (
          <div 
            onClick={onParcelClick}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 flex flex-col items-center cursor-pointer group"
          >
            {/* Click-Me Floating Indicator (Only before opening) */}
            {!isParcelOpened && (
              <div className="absolute -top-9 z-40 animate-bounce pointer-events-none whitespace-nowrap">
                <span className="px-3 py-1 bg-[#FFE600] text-black text-[10px] font-mono font-black uppercase tracking-wider rounded-xs border-2 border-black shadow-[3px_3px_0px_black] flex items-center gap-1.5 hover:bg-[#00FF94]">
                  <span>👆 TAP TO OPEN YOUR GIFT!</span>
                  <span className="text-xs">🎁</span>
                </span>
              </div>
            )}

            {/* Unboxing Container SVG */}
            <svg 
              width="90" 
              height="80" 
              viewBox="0 0 90 80" 
              fill="none" 
              className={`overflow-visible transition-transform duration-200 ${
                !isParcelOpened ? 'parcel-waiting-bounce group-hover:scale-115 group-hover:rotate-1' : ''
              }`}
            >
              <defs>
                {/* Vinyl Groove Gradient */}
                <radialGradient id="vinylShine" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#222228" />
                  <stop offset="45%" stopColor="#08080a" />
                  <stop offset="55%" stopColor="#181820" />
                  <stop offset="85%" stopColor="#050508" />
                  <stop offset="100%" stopColor="#FFE600" />
                </radialGradient>

                {/* Sunburst Burst Gradient */}
                <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE600" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#00FF94" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FF0080" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Tarmac Shadow under parcel */}
              <ellipse cx="45" cy="74" rx="34" ry="5" fill="#000000" opacity="0.75" />
              <ellipse cx="45" cy="74" rx="28" ry="3" fill="#00FF94" opacity="0.4" />

              {/* SUNBURST / LIGHT BURST WHEN OPENED */}
              {isParcelOpened && (
                <g className="sunburst-anim" transform="translate(5, 5)">
                  <circle cx="40" cy="30" r="36" fill="url(#sunburstGrad)" />
                  {/* Exploding Particles Arcs */}
                  <text x="10" y="10" fill="#FFE600" fontSize="15" className="star-burst-1">⭐</text>
                  <text x="60" y="12" fill="#00FF94" fontSize="16" className="star-burst-2">✨</text>
                  <text x="35" y="0" fill="#FF5C00" fontSize="16" className="star-burst-3">🔥</text>
                  <text x="2" y="35" fill="#00E5FF" fontSize="14" className="star-burst-1">🎶</text>
                  <text x="68" y="32" fill="#FF0080" fontSize="14" className="star-burst-2">💥</text>
                </g>
              )}

              {/* UNBOXED 24-BIT GOLD AUDIO MASTER VINYL (Emerges upwards!) */}
              {isParcelOpened && (
                <g className="disc-emerge" transform="translate(21, 6)">
                  {/* Vinyl Outer Halo */}
                  <circle cx="24" cy="24" r="23" fill="#00FF94" opacity="0.25" className="animate-ping" />
                  
                  {/* Shimmering Vinyl Record with concentric grooves */}
                  <g className="vinyl-spin">
                    <circle cx="24" cy="24" r="22" fill="url(#vinylShine)" stroke="#FFE600" strokeWidth="2.5" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#2a2a35" strokeWidth="1.2" strokeDasharray="3,2" />
                    <circle cx="24" cy="24" r="15" fill="none" stroke="#333340" strokeWidth="1" />
                    <circle cx="24" cy="24" r="12" fill="none" stroke="#22222c" strokeWidth="1.2" strokeDasharray="2,2" />
                    
                    {/* Neon Center Label */}
                    <circle cx="24" cy="24" r="9" fill="#00FF94" stroke="#000" strokeWidth="2" />
                    <circle cx="24" cy="24" r="3" fill="#000" />
                  </g>

                  {/* Starburst Highlights */}
                  <text x="-4" y="6" fill="#00FF94" fontSize="12" fontWeight="bold">✨</text>
                  <text x="42" y="8" fill="#FFE600" fontSize="13" fontWeight="bold">⭐</text>
                  <text x="18" y="-4" fill="#FF0080" fontSize="14" fontWeight="bold">🔥</text>
                </g>
              )}

              {/* PARCEL CRATE BODY */}
              <g transform="translate(22, 42)">
                {/* Main Box Body */}
                <rect x="0" y="0" width="46" height="32" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="3" />
                
                {/* Cyber Ribbon Cross */}
                <line x1="23" y1="0" x2="23" y2="32" stroke="#FF5C00" strokeWidth="5" />
                <line x1="0" y1="16" x2="46" y2="16" stroke="#FF5C00" strokeWidth="5" />
                
                {/* VAULT Badge on Box */}
                <rect x="5" y="6" width="16" height="9" fill="#000" rx="1.5" />
                <text x="7" y="13" fill="#00FF94" fontSize="6.5" fontWeight="900" fontFamily="monospace">VAULT</text>

                {/* 24-Bit Gold Stamp */}
                <rect x="27" y="6" width="14" height="9" fill="#000" rx="1.5" />
                <text x="29" y="13" fill="#FFE600" fontSize="6.5" fontWeight="900" fontFamily="monospace">24B</text>
              </g>

              {/* PARCEL LID: Pops off and flies away when clicked! */}
              <g 
                transform="translate(19, 34)"
                className={isParcelOpened ? 'lid-fly' : ''}
              >
                <rect x="0" y="0" width="52" height="10" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="3" />
                <line x1="26" y1="0" x2="26" y2="10" stroke="#FF5C00" strokeWidth="5" />
                {/* Big 3D Ribbon Bow on Lid */}
                <circle cx="26" cy="-3" r="6" fill="#FF0055" stroke="#000" strokeWidth="2" />
                <ellipse cx="20" cy="-4" rx="4" ry="2.5" fill="#FF5C00" stroke="#000" strokeWidth="1.2" transform="rotate(-25 20 -4)" />
                <ellipse cx="32" cy="-4" rx="4" ry="2.5" fill="#FF5C00" stroke="#000" strokeWidth="1.2" transform="rotate(25 32 -4)" />
              </g>

              {/* Sparkles around parcel box (before unboxing) */}
              {!isParcelOpened && (
                <g className="animate-pulse">
                  <text x="6" y="38" fill="#00FF94" fontSize="13" fontWeight="bold">✨</text>
                  <text x="72" y="40" fill="#FFE600" fontSize="14" fontWeight="bold">⭐</text>
                </g>
              )}
            </svg>
          </div>
        )}

        {/* === REAL ASPHALT ROADWAY: Directly Aligned Under Tires (Zero Gap) === */}
        <div className="w-full relative h-7 bg-[#141416] border-t-3 border-b-3 border-black z-10 overflow-hidden flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.8)] -mt-5">
          <div className={`w-[200%] flex items-center justify-around ${
            mode === 'drive'
              ? 'animate-[roadStripes_0.3s_linear_infinite]'
              : phase === 'zoom_off'
              ? 'animate-[roadStripesFast_0.15s_linear_infinite]'
              : (phase === 'screech_in' ? 'animate-[roadStripesRev_0.35s_linear_infinite]' : '')
          }`}>
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-1.5 bg-studio-yellow border border-black rounded-xs shadow-[0_0_8px_#FFE600]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

