'use client'

import React, { useState, useEffect } from 'react'

interface DeliveryCarAnimationProps {
  mode: 'drive' | 'return'
  onDeliveryDelivered?: () => void
}

export function DeliveryCarAnimation({ mode, onDeliveryDelivered }: DeliveryCarAnimationProps) {
  // Timeline phases for the cinematic Supercar + Johnny Bravo story:
  // 1. 'screech_in': Supercar zooms in and screeches to stop in center (0 - 1.2s)
  // 2. 'door_up': Scissor door swings open upward (1.2s - 1.8s)
  // 3. 'dude_step_out': Johnny Bravo cool dude steps out with shades & gold chain (1.8s - 3.2s)
  // 4. 'handover': He walks forward and hands over parcel (3.2s - 4.8s)
  // 5. 'hop_in': He drops parcel, gives peace sign, hops back into supercar (4.8s - 6.0s)
  // 6. 'zoom_off': Scissor door shuts, nitro flames burst, supercar zooms away at lightspeed! (6.0s+)
  const [phase, setPhase] = useState<'screech_in' | 'door_up' | 'dude_step_out' | 'handover' | 'hop_in' | 'zoom_off'>(
    mode === 'drive' ? 'screech_in' : 'screech_in'
  )

  useEffect(() => {
    if (mode === 'return') {
      const t1 = setTimeout(() => setPhase('door_up'), 1200)
      const t2 = setTimeout(() => setPhase('dude_step_out'), 1800)
      const t3 = setTimeout(() => setPhase('handover'), 3200)
      const t4 = setTimeout(() => setPhase('hop_in'), 4800)
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

  return (
    <div className="w-full relative overflow-hidden select-none my-2">
      {/* Animation Styles */}
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
          50% { transform: translateY(-1px); }
          100% { transform: translateY(0px); }
        }
        @keyframes roadStripes {
          0% { transform: translateX(0); }
          100% { transform: translateX(-60px); }
        }
        @keyframes roadStripesRev {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
        @keyframes driveFastAcross {
          0% { transform: translateX(-120%); }
          40% { transform: translateX(-10%); }
          70% { transform: translateX(45%); }
          100% { transform: translateX(120vw); }
        }
        @keyframes supercarArriveScreech {
          0% { transform: translateX(110vw); }
          65% { transform: translateX(-15px); }
          85% { transform: translateX(8px); }
          100% { transform: translateX(0px); }
        }
        @keyframes supercarLaunchSpeed {
          0% { transform: translateX(0px); }
          20% { transform: translateX(-12px); }
          45% { transform: translateX(35px); }
          100% { transform: translateX(130vw); }
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
          0% { transform: translate(160px, 30px) scale(0.5); opacity: 0; }
          40% { transform: translate(130px, 15px) scale(0.85); opacity: 1; }
          100% { transform: translate(100px, 6px) scale(1); opacity: 1; }
        }
        @keyframes dudeWalkForwardAnim {
          0% { transform: translate(100px, 6px); }
          50% { transform: translate(65px, 2px); }
          100% { transform: translate(35px, 6px); }
        }
        @keyframes dudeHopBackAnim {
          0% { transform: translate(35px, 6px) scale(1); opacity: 1; }
          50% { transform: translate(85px, 10px) scale(0.85); opacity: 1; }
          100% { transform: translate(150px, 25px) scale(0.5); opacity: 0; }
        }
        @keyframes nitroFirePulse {
          0% { transform: scale(0.7) skewX(-15deg); opacity: 0.6; }
          50% { transform: scale(1.4) skewX(-20deg); opacity: 1; }
          100% { transform: scale(0.7) skewX(-15deg); opacity: 0.6; }
        }
        @keyframes deliveredParcelRest {
          0% { transform: translate(0, -10px) scale(0.8); opacity: 0.6; }
          60% { transform: translate(0, 2px) scale(1.1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes skidSmokePuff {
          0% { opacity: 0.9; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(2.4) translate(25px, -12px); }
        }
        @keyframes bubbleCompactPop {
          0% { transform: scale(0.4) translateY(10px); opacity: 0; }
          70% { transform: scale(1.04) translateY(-1px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .supercar-idle {
          animation: supercarIdleVibe 0.15s ease-in-out infinite;
        }
        .roll-forward {
          transform-origin: center;
          animation: supercarRollRight 0.28s linear infinite;
        }
        .roll-backward {
          transform-origin: center;
          animation: supercarRollLeft 0.28s linear infinite;
        }
        .nitro-blast {
          animation: nitroFirePulse 0.12s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: right center;
        }
        .door-open-up {
          transform-origin: 228px 72px;
          animation: scissorDoorOpen 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .door-close-down {
          transform-origin: 228px 72px;
          animation: scissorDoorClose 0.4s ease-in forwards;
        }
        .dude-step-out {
          animation: dudeStepOutAnim 0.75s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        .dude-walk-handover {
          animation: dudeWalkForwardAnim 1.2s ease-in-out forwards;
        }
        .dude-hop-back {
          animation: dudeHopBackAnim 0.85s ease-in forwards;
        }
        .parcel-rest-anim {
          animation: deliveredParcelRest 0.5s ease-out forwards;
        }
        .compact-bubble {
          animation: bubbleCompactPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        `
      }} />

      {/* Main Stage Stage Container */}
      <div className="relative w-full max-w-2xl mx-auto h-48 sm:h-54 flex flex-col justify-end items-center overflow-hidden">
        
        {/* Compact Daily-Use Dialogue Bubble (Positioned high up so it NEVER covers car) */}
        {mode === 'return' && phase !== 'screech_in' && (
          <div className="absolute top-1 z-40 compact-bubble flex flex-col items-center">
            {phase === 'door_up' || phase === 'dude_step_out' ? (
              <div className="relative bg-studio-yellow text-black border-2 border-black px-3.5 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center rotate-[-1deg]">
                <p className="text-[11px] sm:text-xs font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>Yo bro! Parcel bhool gaya tha!</span>
                  <span className="text-sm">📦💨</span>
                </p>
                {/* Subtle Arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-black" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-studio-yellow" />
              </div>
            ) : phase === 'handover' ? (
              <div className="relative bg-[#00FF94] text-black border-2 border-black px-3.5 py-1.5 rounded-sm shadow-[4px_4px_0px_black] text-center rotate-[1deg]">
                <p className="text-[11px] sm:text-xs font-black font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span>Yeh le tera 24-bit sound pack, aag laga de!</span>
                  <span className="text-sm">🔥🎶</span>
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-black" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#00FF94]" />
              </div>
            ) : (
              <div className="relative bg-[#FF5C00] text-white border-2 border-black px-3 py-1 rounded-sm shadow-[3px_3px_0px_black] text-center rotate-[-1deg]">
                <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider flex items-center gap-1">
                  <span>Main chala, peace out!</span>
                  <span className="text-sm">✌️💨</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* The Supercar & Character Stage */}
        <div className={`relative z-20 w-full flex justify-center ${
          mode === 'drive' 
            ? 'animate-[driveFastAcross_3s_cubic-bezier(0.2,0.8,0.4,1)_infinite]' 
            : phase === 'zoom_off'
            ? 'animate-[supercarLaunchSpeed_0.9s_cubic-bezier(0.6,0.05,0.9,0.3)_forwards]'
            : 'animate-[supercarArriveScreech_1.2s_cubic-bezier(0.15,0.85,0.25,1)_forwards]'
        }`}>
          <div className={`${(mode === 'drive' || phase === 'screech_in' || phase === 'zoom_off') ? 'supercar-idle' : ''} relative`}>
            
            {/* SVG Stage */}
            <svg
              viewBox="0 0 460 145"
              className="w-80 sm:w-96 md:w-[480px] h-auto overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Headlight Beam */}
                <linearGradient id="hyperBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FF94" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#FFE600" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFE600" stopOpacity="0" />
                </linearGradient>

                {/* Cyber Stealth Body Gradient */}
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

                {/* Nitro Flame Gradient */}
                <linearGradient id="nitroFlameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="40%" stopColor="#0074E4" />
                  <stop offset="80%" stopColor="#FF5C00" />
                  <stop offset="100%" stopColor="#FFE600" />
                </linearGradient>
              </defs>

              {/* === NEON UNDERGLOW === */}
              <ellipse cx="260" cy="116" rx="140" ry="8" fill="#00FF94" opacity="0.4" />

              {/* Headlight Volumetric Beam */}
              <polygon points="390,92 470,72 470,118 390,102" fill="url(#hyperBeam)" opacity="0.65" />

              {/* Skid Smoke at arrival stop */}
              {phase === 'door_up' && (
                <g>
                  <circle cx="170" cy="116" r="16" fill="#FFFFFF" className="opacity-60 animate-[skidSmokePuff_0.6s_ease-out_forwards]" />
                  <circle cx="340" cy="116" r="20" fill="#FFFFFF" className="opacity-70 animate-[skidSmokePuff_0.7s_ease-out_forwards]" />
                </g>
              )}

              {/* Nitro Exhaust Flames (when zooming off) */}
              {(phase === 'zoom_off' || mode === 'drive') && (
                <g transform="translate(90, 94)" className="nitro-blast">
                  <polygon points="0,5 -35,-2 -25,5 -42,7 -25,9 -35,16 0,10" fill="url(#nitroFlameGrad)" />
                  <circle cx="-15" cy="7" r="5" fill="#FFFFFF" opacity="0.8" />
                </g>
              )}

              {/* === SUPERCAR CHASSIS (Aggressive Cyberpunk / Lambo Silhouette) === */}
              {/* Giant Carbon Rear Wing / Spoiler */}
              <path d="M 125 76 L 105 58 L 138 58 L 135 76 Z" fill="#0d0d12" stroke="#000" strokeWidth="2" />
              {/* Spoiler Wing Blade */}
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

              {/* Supercar Cockpit Glass Canopy */}
              <path
                d="M 210 63 L 270 63 L 325 84 L 205 84 Z"
                fill="#00E5FF"
                fillOpacity="0.3"
                stroke="#000"
                strokeWidth="2"
              />
              <line x1="225" y1="65" x2="310" y2="82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Aggressive Front Splitter & Air Intake */}
              <polygon points="385,102 398,102 402,110 380,110" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
              <polygon points="360,94 388,94 384,102 355,102" fill="#00FF94" stroke="#000" strokeWidth="1" />

              {/* Twin Sharp LED Headlights */}
              <polygon points="380,88 394,92 388,96 376,92" fill="#00FF94" stroke="#000" strokeWidth="1.2" />
              <polygon points="382,90 392,93 388,95 380,93" fill="#FFFFFF" />

              {/* Side Comic Racing Stripes */}
              <polygon points="145,86 360,86 355,90 145,90" fill="#FFE600" stroke="#000" strokeWidth="0.8" />
              <polygon points="148,90 355,90 350,93 148,93" fill="#00FF94" stroke="#000" strokeWidth="0.8" />

              {/* Stenciled Brand Label */}
              <g transform="translate(180, 88)">
                <text x="35" y="8" fill="#FFE600" fontSize="7.5" fontWeight="900" fontStyle="italic" fontFamily="monospace" textAnchor="middle">
                  SAMPLES<tspan fill="#00FF94">WALA</tspan>
                </text>
              </g>

              {/* Scissor Door Component (Swings UPWARD like Lambo) */}
              <g className={
                (phase === 'door_up' || phase === 'dude_step_out' || phase === 'handover')
                  ? 'door-open-up'
                  : phase === 'hop_in'
                  ? 'door-close-down'
                  : ''
              }>
                {/* Scissor Door Panel */}
                <path
                  d="M 215 65 L 265 65 L 285 96 L 210 96 Z"
                  fill="#181822"
                  stroke="#FFE600"
                  strokeWidth="2"
                />
                <rect x="250" y="78" width="8" height="3" rx="1" fill="#00FF94" />
              </g>

              {/* Rear Wheel Arch & Low-profile Wide Wheel */}
              <path d="M 145 108 A 19 19 0 0 1 189 108 Z" fill="#000" />
              <g transform="translate(167, 108)">
                <circle cx="0" cy="0" r="17" fill="#0a0a0a" stroke="#000" strokeWidth="3" />
                <g className={mode === 'drive' ? 'roll-forward' : (phase === 'zoom_off' ? 'roll-forward' : '')}>
                  <circle cx="0" cy="0" r="11" fill="url(#hyperRim)" stroke="#000" strokeWidth="1.5" />
                  {/* Star spokes */}
                  <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#00FF94" stroke="#000" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFE600" />
                </g>
              </g>

              {/* Front Wheel Arch & Low-profile Wide Wheel */}
              <path d="M 305 108 A 19 19 0 0 1 349 108 Z" fill="#000" />
              <g transform="translate(327, 108)">
                <circle cx="0" cy="0" r="17" fill="#0a0a0a" stroke="#000" strokeWidth="3" />
                <g className={mode === 'drive' ? 'roll-forward' : (phase === 'zoom_off' ? 'roll-forward' : '')}>
                  <circle cx="0" cy="0" r="11" fill="url(#hyperRim)" stroke="#000" strokeWidth="1.5" />
                  <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#00FF94" stroke="#000" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFE600" />
                </g>
              </g>

              {/* ========================================================================= */}
              {/* === JOHNNY BRAVO STYLE COOL DUDE (Shades, Pompadour Hair, Gold Chain) === */}
              {/* ========================================================================= */}
              {mode === 'return' && phase !== 'screech_in' && phase !== 'door_up' && (
                <g className={
                  phase === 'dude_step_out'
                    ? 'dude-step-out'
                    : phase === 'handover'
                    ? 'dude-walk-handover'
                    : phase === 'hop_in'
                    ? 'dude-hop-back'
                    : ''
                }>
                  {/* Shadow under cool dude */}
                  <ellipse cx="65" cy="115" rx="16" ry="3.5" fill="#000" opacity="0.6" />

                  {/* Muscular Body & Stance */}
                  {/* Legs with cool dark jeans */}
                  <path d="M 58 88 L 55 108 L 50 113" stroke="#16161c" strokeWidth="7.5" strokeLinecap="round" />
                  <path d="M 68 88 L 73 108 L 78 113" stroke="#1c1c24" strokeWidth="7.5" strokeLinecap="round" />
                  {/* Black & Gold High-top Sneakers */}
                  <path d="M 47 113 L 56 113 L 56 109 L 47 109 Z" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
                  <path d="M 75 113 L 84 113 L 84 109 L 75 109 Z" fill="#00FF94" stroke="#000" strokeWidth="1.5" />

                  {/* Johnny Bravo Broad-Shouldered Tight Black T-Shirt */}
                  <path
                    d="M 44 60 L 84 60 L 78 88 L 50 88 Z"
                    fill="#050505"
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  {/* V-Neck Cutout */}
                  <polygon points="60,60 68,60 64,68" fill="#F3A87C" stroke="#000" strokeWidth="1" />

                  {/* Thick Golden Chain around neck (Gale mein Gold Chain!) */}
                  <path d="M 58 63 Q 64 73 70 63" stroke="#FFE600" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Gold Chain Locket / Medallion */}
                  <circle cx="64" cy="74" r="3.5" fill="#FFE600" stroke="#000" strokeWidth="1.2" />
                  <text x="64" y="76" fill="#000" fontSize="4.5" fontWeight="900" textAnchor="middle">S</text>

                  {/* Head, Johnny Bravo Pompadour Hair & Sunglasses */}
                  {/* Neck */}
                  <rect x="60" y="53" width="8" height="9" fill="#F3A87C" stroke="#000" strokeWidth="1" />
                  {/* Strong Jawline / Face */}
                  <polygon points="56,42 72,42 70,54 58,54" fill="#F3A87C" stroke="#000" strokeWidth="1.5" />
                  {/* Cool Smirk */}
                  <path d="M 61 50 Q 65 52 68 49" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                  {/* Pitch-Black Cool Guy Sunglasses (Chasma!) */}
                  <rect x="55" y="42" width="8.5" height="5.5" rx="1.5" fill="#000000" stroke="#FFE600" strokeWidth="1" />
                  <rect x="64.5" y="42" width="8.5" height="5.5" rx="1.5" fill="#000000" stroke="#FFE600" strokeWidth="1" />
                  <line x1="63.5" y1="44" x2="64.5" y2="44" stroke="#000" strokeWidth="2" />
                  {/* Sunglasses white shine streak */}
                  <line x1="57" y1="43" x2="61" y2="46" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                  <line x1="66" y1="43" x2="70" y2="46" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

                  {/* Johnny Bravo Big Slick Pompadour Hair (Golden/Blonde) */}
                  <path
                    d="M 55 42 
                       C 52 30, 56 18, 68 18 
                       C 78 18, 86 26, 80 40 
                       C 76 43, 73 42, 72 42 
                       Z"
                    fill="#FFE600"
                    stroke="#000000"
                    strokeWidth="2.5"
                  />
                  {/* Hair Comb Shine Lines */}
                  <path d="M 62 23 Q 72 26 73 34" stroke="#FFAA00" strokeWidth="1.8" fill="none" />
                  <path d="M 58 30 Q 66 32 68 38" stroke="#FFAA00" strokeWidth="1.5" fill="none" />

                  {/* Muscular Arms & Hands */}
                  <path d="M 45 61 L 34 71 L 28 74" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 83 61 L 62 72 L 42 74" stroke="#F3A87C" strokeWidth="6" strokeLinecap="round" />
                  {/* Hands */}
                  <circle cx="27" cy="74" r="3.5" fill="#F3A87C" stroke="#000" strokeWidth="1" />
                  <circle cx="39" cy="75" r="3.5" fill="#F3A87C" stroke="#000" strokeWidth="1" />

                  {/* Handing Over the Golden Sound Vault Parcel */}
                  {phase === 'handover' && (
                    <g transform="translate(10, 60)" className="animate-pulse">
                      <rect x="0" y="0" width="28" height="24" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="2.5" />
                      <line x1="14" y1="0" x2="14" y2="24" stroke="#FF5C00" strokeWidth="3.5" />
                      <line x1="0" y1="12" x2="28" y2="12" stroke="#FF5C00" strokeWidth="3.5" />
                      <circle cx="14" cy="-1" r="3.5" fill="#FF0055" stroke="#000" strokeWidth="1" />
                      <rect x="3" y="3" width="10" height="6" fill="#000" rx="1" />
                      <text x="4" y="8" fill="#00FF94" fontSize="4.5" fontWeight="900" fontFamily="monospace">VAULT</text>
                    </g>
                  )}

                  {/* Peace Sign / Swagger Pose in Hop-In phase */}
                  {phase === 'hop_in' && (
                    <g transform="translate(85, 45)" className="compact-bubble">
                      <rect x="0" y="0" width="16" height="13" rx="2" fill="#00FF94" stroke="#000" strokeWidth="1.5" />
                      <text x="8" y="10" fill="#000" fontSize="8" fontWeight="900" textAnchor="middle">✌️</text>
                    </g>
                  )}
                </g>
              )}

              {/* Delivered Parcel Resting in Front (Remains after cool dude zooms off!) */}
              {(phase === 'hop_in' || phase === 'zoom_off') && (
                <g transform="translate(45, 95)" className="parcel-rest-anim">
                  <ellipse cx="14" cy="24" rx="18" ry="3" fill="#000" opacity="0.6" />
                  {/* Delivered Parcel Box */}
                  <rect x="0" y="0" width="28" height="23" rx="2" fill="#FFE600" stroke="#000000" strokeWidth="2.5" />
                  <line x1="14" y1="0" x2="14" y2="23" stroke="#FF5C00" strokeWidth="3.5" />
                  <line x1="0" y1="11.5" x2="28" y2="11.5" stroke="#FF5C00" strokeWidth="3.5" />
                  <circle cx="14" cy="-1" r="3.5" fill="#FF0055" stroke="#000" strokeWidth="1" />
                  <rect x="3" y="3" width="10" height="6" fill="#000" rx="1" />
                  <text x="4" y="8" fill="#00FF94" fontSize="4.5" fontWeight="900" fontFamily="monospace">VAULT</text>
                  {/* Sparkles around delivered parcel */}
                  <g className="animate-pulse">
                    <text x="-8" y="4" fill="#00FF94" fontSize="12" fontWeight="bold">✨</text>
                    <text x="28" y="6" fill="#FFE600" fontSize="13" fontWeight="bold">⭐</text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Asphalt Road with Yellow Center Lines */}
        <div className="w-full relative h-7 bg-[#141416] border-t-3 border-b-3 border-black z-10 overflow-hidden flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <div className={`w-[200%] flex items-center justify-around ${
            mode === 'drive' || phase === 'zoom_off' 
              ? 'road-stripes animate-[roadStripes_0.3s_linear_infinite]' 
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
