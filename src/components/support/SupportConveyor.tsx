'use client'

import React, { useState, useEffect } from 'react'

export function SupportConveyor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={`h-28 md:h-32 bg-[#0c0d10] relative overflow-hidden select-none pointer-events-none border-y border-white/10 shadow-[inset_0_4px_16px_rgba(0,0,0,0.6)] ${
        mounted ? 'start-anim' : ''
      }`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ─── CHARACTER TRANSLATIONS ─── */
        .start-anim .distressed-char-group {
          animation: producerWalkStory 18s infinite linear;
        }

        /* ─── WALKING BOBBING ─── */
        @keyframes producerBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2.5px); }
        }
        .distressed-bob-container {
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .start-anim .distressed-bob-container {
          animation: producerBob 0.5s infinite ease-in-out;
        }

        /* ─── LEGS & ARMS ROTATIONS ─── */
        .prod-leg-l-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .prod-leg-l-group {
          animation: prodLegLeftAnim 18s infinite ease-in-out;
        }
        .prod-leg-r-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .prod-leg-r-group {
          animation: prodLegRightAnim 18s infinite ease-in-out;
        }
        .prod-arm-l-group {
          transform-box: fill-box;
          transform-origin: 100% 0%;
        }
        .start-anim .prod-arm-l-group {
          animation: prodArmLeftAnim 18s infinite ease-in-out;
        }
        .prod-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .prod-arm-r-group {
          animation: prodArmRightAnim 18s infinite ease-in-out;
        }

        /* ─── DOCTOR HEAD BOB & HAND ACTIONS ─── */
        @keyframes doctorHeadBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-1.5px) rotate(2deg); }
        }
        .doctor-head-group {
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .start-anim .doctor-head-group {
          animation: doctorHeadBob 1.2s infinite ease-in-out;
        }

        @keyframes doctorArmWork {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-8deg); }
        }
        .doctor-arm-work {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .doctor-arm-work {
          animation: doctorArmWork 2s infinite ease-in-out;
        }

        /* ─── GLITCH TAPE VS FIXED GOLDEN TAPE TRANSFORMATION ─── */
        .broken-tape-group {
          transform-box: fill-box;
          transform-origin: center;
        }
        .start-anim .broken-tape-group {
          animation: brokenTapeTimeline 18s infinite;
        }
        .fixed-tape-group {
          transform-box: fill-box;
          transform-origin: center;
        }
        .start-anim .fixed-tape-group {
          animation: fixedTapeTimeline 18s infinite;
        }

        @keyframes brokenTapeTimeline {
          0%, 39.9% { opacity: 1; transform: scale(1); }
          40%, 42% { opacity: 1; transform: scale(1.15) rotate(-3deg); }
          42.1%, 100% { opacity: 0; transform: scale(0.2); }
        }
        @keyframes fixedTapeTimeline {
          0%, 42% { opacity: 0; transform: scale(0.2); }
          42.1% { opacity: 1; transform: scale(1.25) rotate(4deg); }
          44% { opacity: 1; transform: scale(1) rotate(0deg); }
          65% { opacity: 1; }
          65.1%, 100% { opacity: 0; }
        }

        /* ─── PRODUCER FACE MOOD SWITCH ─── */
        .start-anim .face-sad {
          animation: faceSadTimeline 18s infinite;
        }
        .start-anim .face-happy {
          animation: faceHappyTimeline 18s infinite;
        }
        @keyframes faceSadTimeline {
          0%, 41.9% { opacity: 1; }
          42%, 100% { opacity: 0; }
        }
        @keyframes faceHappyTimeline {
          0%, 41.9% { opacity: 0; }
          42%, 100% { opacity: 1; }
        }

        /* ─── DIAGNOSTIC LASER BEAM & SCANNER ─── */
        .diagnostic-beam {
          transform-origin: top center;
        }
        .start-anim .diagnostic-beam {
          animation: diagnosticBeamTimeline 18s infinite ease-in-out;
        }
        @keyframes diagnosticBeamTimeline {
          0%, 9.9% { fill: rgba(0, 191, 255, 0.04); opacity: 0.1; transform: scaleX(0.4); }
          10%, 25% { fill: rgba(0, 191, 255, 0.3); opacity: 0.85; transform: scaleX(0.9); }
          25.1%, 38% { fill: rgba(255, 0, 128, 0.35); opacity: 0.9; transform: scaleX(1.1); }
          38.1%, 43% { fill: rgba(0, 255, 148, 0.45); opacity: 1; transform: scaleX(1.2); }
          43.1%, 100% { fill: rgba(0, 191, 255, 0.04); opacity: 0.1; transform: scaleX(0.4); }
        }

        .start-anim .scanner-bulb {
          animation: scannerBulbTimeline 18s infinite;
        }
        @keyframes scannerBulbTimeline {
          0%, 9.9% { fill: #222; }
          10%, 25% { fill: #00BFFF; filter: drop-shadow(0 0 4px #00BFFF); }
          25.1%, 38% { fill: #FF0080; filter: drop-shadow(0 0 5px #FF0080); }
          38.1%, 43% { fill: #00FF94; filter: drop-shadow(0 0 7px #00FF94); }
          43.1%, 100% { fill: #222; }
        }

        /* ─── POP-UP FEEDBACK BUBBLES ─── */
        .start-anim .bubble-glitch {
          animation: bubbleGlitchTimeline 18s infinite ease-in-out;
        }
        @keyframes bubbleGlitchTimeline {
          0%, 10.9% { transform: translate(460px, 18px) scale(0); opacity: 0; }
          11% { transform: translate(460px, 18px) scale(1.05); opacity: 1; }
          24% { transform: translate(460px, 16px) scale(1); opacity: 1; }
          25% { transform: translate(460px, 12px) scale(0); opacity: 0; }
          100% { transform: translate(460px, 12px) scale(0); opacity: 0; }
        }

        .start-anim .bubble-fixing {
          animation: bubbleFixingTimeline 18s infinite ease-in-out;
        }
        @keyframes bubbleFixingTimeline {
          0%, 25.9% { transform: translate(460px, 18px) scale(0); opacity: 0; }
          26% { transform: translate(460px, 18px) scale(1.05); opacity: 1; }
          37.5% { transform: translate(460px, 16px) scale(1); opacity: 1; }
          38% { transform: translate(460px, 12px) scale(0); opacity: 0; }
          100% { transform: translate(460px, 12px) scale(0); opacity: 0; }
        }

        .start-anim .bubble-fixed {
          animation: bubbleFixedTimeline 18s infinite ease-in-out;
        }
        @keyframes bubbleFixedTimeline {
          0%, 38.4% { transform: translate(460px, 18px) scale(0); opacity: 0; }
          38.5% { transform: translate(460px, 18px) scale(1.1) rotate(2deg); opacity: 1; }
          43.5% { transform: translate(460px, 16px) scale(1) rotate(-1deg); opacity: 1; }
          45% { transform: translate(460px, 12px) scale(0); opacity: 0; }
          100% { transform: translate(460px, 12px) scale(0); opacity: 0; }
        }

        /* ─── OSCILLOSCOPE SINE & GLITCH WAVES ─── */
        @keyframes glitchWaveAnim {
          0% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 40; }
        }
        .oscilloscope-wave {
          animation: glitchWaveAnim 1s linear infinite;
        }

        @keyframes neonPulse {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 1px currentColor); }
          50% { opacity: 1; filter: drop-shadow(0 0 4px currentColor); }
        }
        .neon-sign-glow {
          animation: neonPulse 2.5s ease-in-out infinite;
        }

        /* ─── PRODUCER STORYLINE TIMELINE KEYFRAMES ─── */
        @keyframes producerWalkStory {
          /* Enters from left, sad & carrying broken file */
          0% { transform: translate(-80px, 0px); opacity: 0; }
          1% { opacity: 1; }
          2% { transform: translate(0px, 0px); }
          4% { transform: translate(80px, -1px); }
          6% { transform: translate(160px, 0px); }
          8% { transform: translate(240px, -1px); }
          9.5% { transform: translate(320px, 0px); }
          11% { transform: translate(430px, 0px); }
          /* Arrives at support desk, stops for repair */
          12%, 41% { transform: translate(430px, 0px); }
          /* Signal restored! Producer gets excited and struts away happily */
          42% { transform: translate(430px, -3px); }
          43% { transform: translate(430px, 0px); }
          44.5% { transform: translate(490px, -1px); }
          46.5% { transform: translate(570px, 0px); }
          49% { transform: translate(660px, -1px); }
          52% { transform: translate(750px, 0px); }
          55% { transform: translate(840px, -1px); }
          58% { transform: translate(940px, 0px); }
          61% { transform: translate(1040px, 0px); opacity: 1; }
          62%, 100% { transform: translate(1100px, 0px); opacity: 0; }
        }

        @keyframes prodLegLeftAnim {
          0% { transform: rotate(0deg); }
          2% { transform: rotate(26deg); }
          4% { transform: rotate(-26deg); }
          6% { transform: rotate(26deg); }
          8% { transform: rotate(-26deg); }
          10% { transform: rotate(26deg); }
          11%, 41% { transform: rotate(0deg); }
          42% { transform: rotate(-10deg); }
          44.5% { transform: rotate(28deg); }
          46.5% { transform: rotate(-28deg); }
          49% { transform: rotate(28deg); }
          52% { transform: rotate(-28deg); }
          55% { transform: rotate(28deg); }
          58% { transform: rotate(-28deg); }
          61%, 100% { transform: rotate(0deg); }
        }
        @keyframes prodLegRightAnim {
          0% { transform: rotate(0deg); }
          2% { transform: rotate(-26deg); }
          4% { transform: rotate(26deg); }
          6% { transform: rotate(-26deg); }
          8% { transform: rotate(26deg); }
          10% { transform: rotate(-26deg); }
          11%, 41% { transform: rotate(0deg); }
          42% { transform: rotate(10deg); }
          44.5% { transform: rotate(-28deg); }
          46.5% { transform: rotate(28deg); }
          49% { transform: rotate(-28deg); }
          52% { transform: rotate(28deg); }
          55% { transform: rotate(-28deg); }
          58% { transform: rotate(28deg); }
          61%, 100% { transform: rotate(0deg); }
        }
        @keyframes prodArmLeftAnim {
          0% { transform: rotate(0deg); }
          2% { transform: rotate(-20deg); }
          4% { transform: rotate(20deg); }
          6% { transform: rotate(-20deg); }
          8% { transform: rotate(20deg); }
          10% { transform: rotate(-20deg); }
          11%, 41% { transform: rotate(0deg); }
          42% { transform: rotate(-120deg); }
          44.5% { transform: rotate(-90deg); }
          46.5% { transform: rotate(-30deg); }
          49% { transform: rotate(-90deg); }
          52% { transform: rotate(-30deg); }
          55% { transform: rotate(-90deg); }
          58%, 100% { transform: rotate(0deg); }
        }
        @keyframes prodArmRightAnim {
          0% { transform: rotate(0deg); }
          2% { transform: rotate(20deg); }
          4% { transform: rotate(-20deg); }
          6% { transform: rotate(20deg); }
          8% { transform: rotate(-20deg); }
          10% { transform: rotate(20deg); }
          11%, 41% { transform: rotate(15deg); }
          /* Thumbs up & celebration */
          42% { transform: rotate(110deg); }
          44.5% { transform: rotate(90deg); }
          46.5% { transform: rotate(40deg); }
          49% { transform: rotate(90deg); }
          52% { transform: rotate(40deg); }
          55% { transform: rotate(90deg); }
          58%, 100% { transform: rotate(0deg); }
        }
      `}}
      />

      <svg
        className="w-full h-full"
        viewBox="0 0 1000 100"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Backdrop Studio Tech Wall */}
        <rect width="1000" height="74" fill="#0d0e12" />

        {/* Rack Paneling lines */}
        <path d="M 0 24 L 1000 24 M 0 48 L 1000 48" stroke="#171922" strokeWidth="0.5" />
        <path
          d="M 140 0 L 140 24 M 260 24 L 260 48 M 380 48 L 380 74 M 640 0 L 640 24 M 760 24 L 760 48 M 880 48 L 880 74"
          stroke="#171922"
          strokeWidth="0.5"
        />

        {/* Studio Ambient Downlights */}
        <polygon points="120,0 80,74 160,74" fill="rgba(0,191,255,0.015)" />
        <polygon points="460,0 410,74 510,74" fill="rgba(0,255,148,0.02)" />
        <polygon points="860,0 810,74 910,74" fill="rgba(255,0,128,0.015)" />

        {/* 2. Left Wall: Audio Racks, VU Meters & Tape Machine */}
        <rect x="40" y="10" width="180" height="54" fill="#090a0d" stroke="#22252e" strokeWidth="1.8" rx="2" />
        {/* Rack 1: Analog EQ unit */}
        <rect x="48" y="16" width="164" height="12" fill="#15171d" stroke="#000" strokeWidth="0.8" rx="1" />
        {/* LED VU indicators */}
        <rect x="54" y="20" width="3" height="4" fill="#00FF94" />
        <rect x="59" y="20" width="3" height="4" fill="#00FF94" />
        <rect x="64" y="20" width="3" height="4" fill="#00FF94" />
        <rect x="69" y="20" width="3" height="4" fill="#FFE600" />
        <rect x="74" y="20" width="3" height="4" fill="#FF0080" />
        <circle cx="100" cy="22" r="2.5" fill="#2d303b" stroke="#000" strokeWidth="0.6" />
        <circle cx="120" cy="22" r="2.5" fill="#2d303b" stroke="#000" strokeWidth="0.6" />
        <circle cx="140" cy="22" r="2.5" fill="#2d303b" stroke="#000" strokeWidth="0.6" />
        <text x="175" y="24" fill="#00BFFF" fontSize="4" fontWeight="900" fontFamily="monospace">
          24/7 HOTLINE
        </text>

        {/* Rack 2: Real-time Audio Tape Deck */}
        <rect x="48" y="32" width="164" height="26" fill="#15171d" stroke="#000" strokeWidth="0.8" rx="1" />
        {/* Spinning tape reels */}
        <g transform="translate(80, 45)">
          <circle cx="0" cy="0" r="8" fill="#22252e" stroke="#000" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#FFE600" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#111" strokeWidth="1.2" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#111" strokeWidth="1.2" />
        </g>
        <g transform="translate(130, 45)">
          <circle cx="0" cy="0" r="8" fill="#22252e" stroke="#000" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#FFE600" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#111" strokeWidth="1.2" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#111" strokeWidth="1.2" />
        </g>
        {/* Mini Tape level meter */}
        <rect x="156" y="37" width="46" height="15" fill="#0b0c10" stroke="#000" strokeWidth="0.6" rx="1" />
        <path d="M 160 47 Q 170 38 180 44 T 198 42" fill="none" stroke="#00FF94" strokeWidth="1.2" />

        {/* 3. Center Station: AUDIO CLINIC & DIAGNOSTIC SCANNER CONSOLE */}
        {/* Top Diagnostic Scanner Rig */}
        <rect x="424" y="6" width="72" height="10" rx="2" fill="#20232c" stroke="#000" strokeWidth="1.5" />
        <circle cx="460" cy="11" r="3" fill="#222" className="scanner-bulb" />
        <polygon points="440,16 480,16 496,74 424,74" className="diagnostic-beam" />

        {/* Center Doctor Console Desk */}
        <rect x="495" y="36" width="90" height="38" fill="#15171e" stroke="#2b2e3b" strokeWidth="1.6" rx="2" />
        {/* Oscilloscope Screen */}
        <rect x="502" y="41" width="38" height="22" fill="#080b0f" stroke="#000" strokeWidth="1" rx="1" />
        <path
          d="M 504 52 Q 511 44 518 52 T 536 52"
          fill="none"
          stroke="#00FF94"
          strokeWidth="1.4"
          className="oscilloscope-wave"
          strokeDasharray="4 2"
        />
        <text x="506" y="46" fill="#00BFFF" fontSize="2.8" fontWeight="900" fontFamily="monospace">
          SIGNAL: OK
        </text>

        {/* Mixing Console Faders on Doctor Desk */}
        <line x1="548" y1="44" x2="548" y2="60" stroke="#333" strokeWidth="1.2" />
        <rect x="546" y="48" width="4" height="2.5" fill="#FFE600" rx="0.5" />
        <line x1="558" y1="44" x2="558" y2="60" stroke="#333" strokeWidth="1.2" />
        <rect x="556" y="52" width="4" height="2.5" fill="#00FF94" rx="0.5" />
        <line x1="568" y1="44" x2="568" y2="60" stroke="#333" strokeWidth="1.2" />
        <rect x="566" y="46" width="4" height="2.5" fill="#FF0080" rx="0.5" />

        {/* 4. Right Wall: Master Synthesizer & Vinyl Vault */}
        <rect x="740" y="10" width="220" height="54" fill="#090a0d" stroke="#22252e" strokeWidth="1.8" rx="2" />
        {/* Synth keyboard */}
        <rect x="752" y="16" width="90" height="12" fill="#1b1d24" stroke="#000" strokeWidth="0.8" rx="1" />
        {/* Black and white keys */}
        <rect x="754" y="21" width="86" height="6" fill="#fff" />
        <rect x="760" y="21" width="3" height="4" fill="#000" />
        <rect x="766" y="21" width="3" height="4" fill="#000" />
        <rect x="776" y="21" width="3" height="4" fill="#000" />
        <rect x="782" y="21" width="3" height="4" fill="#000" />
        <rect x="788" y="21" width="3" height="4" fill="#000" />
        {/* Patchbay jacks & glowing patch cables */}
        <circle cx="860" cy="22" r="2" fill="#2d303b" stroke="#FFE600" strokeWidth="0.8" />
        <circle cx="880" cy="22" r="2" fill="#2d303b" stroke="#00FF94" strokeWidth="0.8" />
        <path d="M 860 22 Q 870 34 880 22" fill="none" stroke="#FFE600" strokeWidth="1.2" opacity="0.85" />

        {/* Golden Vinyl Vault shelf */}
        <rect x="752" y="34" width="198" height="24" fill="#14161c" stroke="#000" strokeWidth="0.8" rx="1" />
        <rect x="760" y="38" width="14" height="16" fill="#111" stroke="#FFE600" strokeWidth="0.8" rx="1" />
        <circle cx="767" cy="46" r="4.5" fill="#FFE600" opacity="0.8" />
        <rect x="780" y="38" width="14" height="16" fill="#111" stroke="#00FF94" strokeWidth="0.8" rx="1" />
        <circle cx="787" cy="46" r="4.5" fill="#00FF94" opacity="0.8" />
        <text x="810" y="48" fill="#fff" opacity="0.5" fontSize="3.5" fontWeight="900" fontFamily="monospace">
          LIFETIME VAULT BACKUP
        </text>

        {/* 5. Top Neon Sign: "SAMPLESWALA AUDIO CLINIC // 24/7 SUPPORT" */}
        <g transform="translate(500, 0)">
          <rect x="-105" y="1" width="210" height="9" rx="1.5" fill="#111" stroke="#000" strokeWidth="1.5" />
          <text
            y="7.5"
            textAnchor="middle"
            fontSize="5.8"
            fontWeight="950"
            fontFamily="'Luckiest Guy', sans-serif"
            letterSpacing="0.8"
            fill="#00FF94"
            className="neon-sign-glow"
          >
            SAMPLESWALA AUDIO CLINIC // 24/7 PRODUCER SUPPORT
          </text>
        </g>

        {/* 6. Studio Floor */}
        <rect x="0" y="74" width="1000" height="26" fill="#1c130c" />
        <line x1="0" y1="74" x2="1000" y2="74" stroke="#332216" strokeWidth="1.5" />
        <line x1="0" y1="83" x2="1000" y2="83" stroke="#332216" strokeWidth="0.8" />
        <line x1="0" y1="92" x2="1000" y2="92" stroke="#332216" strokeWidth="0.8" />

        {/* Planks joints */}
        <g stroke="#332216" strokeWidth="0.8">
          <line x1="100" y1="74" x2="100" y2="83" />
          <line x1="260" y1="74" x2="260" y2="83" />
          <line x1="420" y1="74" x2="420" y2="83" />
          <line x1="580" y1="74" x2="580" y2="83" />
          <line x1="740" y1="74" x2="740" y2="83" />
          <line x1="900" y1="74" x2="900" y2="83" />
          <line x1="180" y1="83" x2="180" y2="92" />
          <line x1="340" y1="83" x2="340" y2="92" />
          <line x1="500" y1="83" x2="500" y2="92" />
          <line x1="660" y1="83" x2="660" y2="92" />
          <line x1="820" y1="83" x2="820" y2="92" />
        </g>

        {/* 7. SOUND DOCTOR / AUDIO TECHNICIAN (Stationed Behind Desk) */}
        <g transform="translate(545, 49)">
          {/* Doctor Body */}
          <rect x="-8" y="-12" width="16" height="18" rx="3" fill="#0074e4" stroke="#000" strokeWidth="1.8" />
          {/* Tie or badge */}
          <polygon points="0,-12 -2,-7 0,-3 2,-7" fill="#FFE600" />

          {/* Doctor Head with Studio Headphones */}
          <g className="doctor-head-group">
            <circle cx="0" cy="-19" r="7" fill="#FFE600" stroke="#000" strokeWidth="1.8" />
            {/* Friendly face */}
            <circle cx="-2" cy="-20" r="0.7" fill="#000" />
            <circle cx="2" cy="-20" r="0.7" fill="#000" />
            <path d="M -2.5 -17 Q 0 -15 2.5 -17" fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" />

            {/* Studio Pro Headphones over ears */}
            <path d="M -8 -19 C -8 -28 8 -28 8 -19" fill="none" stroke="#111" strokeWidth="2.2" />
            <rect x="-9.5" y="-21" width="3" height="6" rx="1.5" fill="#00FF94" stroke="#000" strokeWidth="0.8" />
            <rect x="6.5" y="-21" width="3" height="6" rx="1.5" fill="#00FF94" stroke="#000" strokeWidth="0.8" />
            {/* Mic boom */}
            <path d="M -8 -17 L -4 -15" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="-4" cy="-15" r="1.2" fill="#00FF94" />
          </g>

          {/* Doctor Arms / Hands on Console */}
          <g className="doctor-arm-work">
            <path
              d="M -7 -8 L -14 -2 L -10 4"
              fill="none"
              stroke="#0074e4"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="-10" cy="4" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
          </g>
        </g>

        {/* 8. THE PRODUCER CHARACTER (Distressed -> Repaired -> Triumphant) */}
        <g className="distressed-char-group">
          <g className="distressed-bob-container">
            <g transform="translate(0, 52)">
              {/* Left Leg */}
              <g className="prod-leg-l-group">
                <line x1="-3" y1="7" x2="-3" y2="21" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
                <line x1="-3" y1="7" x2="-3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M -7,20 L -2,20 C -1,20 -1,23 -3,23 L -7,23 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
              </g>

              {/* Right Leg */}
              <g className="prod-leg-r-group">
                <line x1="3" y1="7" x2="3" y2="21" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
                <line x1="3" y1="7" x2="3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M -1,20 L 4,20 C 5,20 5,23 3,23 L -1,23 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
              </g>

              {/* Body: Streetwear Orange Hoodie */}
              <rect x="-8" y="-14" width="16" height="21" rx="4" fill="#ea580c" stroke="#000" strokeWidth="2" />
              <line x1="-2" y1="-8" x2="-2" y2="-2" stroke="#fff" strokeWidth="1" />
              <line x1="2" y1="-8" x2="2" y2="-2" stroke="#fff" strokeWidth="1" />

              {/* Head with Beanie */}
              <circle cx="0" cy="-21" r="7.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
              <path d="M -8,-22 C -8,-28 8,-28 8,-22 Z" fill="#1e293b" stroke="#000" strokeWidth="1" />

              {/* Producer Face: Sad (when arriving) */}
              <g className="face-sad">
                <circle cx="-2.2" cy="-22.5" r="0.8" fill="#000" />
                <circle cx="2.2" cy="-22.5" r="0.8" fill="#000" />
                <path
                  d="M -2.5,-18 Q 0,-20 2.5,-18"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>

              {/* Producer Face: Happy with Sunglasses (after fix) */}
              <g className="face-happy">
                {/* Cool pixel shades */}
                <rect x="-5" y="-23.5" width="4.5" height="3" fill="#000" rx="0.5" />
                <rect x="0.5" y="-23.5" width="4.5" height="3" fill="#000" rx="0.5" />
                <line x1="-1" y1="-22.5" x2="1" y2="-22.5" stroke="#000" strokeWidth="1" />
                {/* Big happy smile */}
                <path
                  d="M -2.8,-18 Q 0,-15 2.8,-18"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </g>

              {/* Left Arm */}
              <g className="prod-arm-l-group">
                <path
                  d="M -7,-9 L -13,-4 L -9,1"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="-9" cy="1" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
              </g>

              {/* Right Arm: Carrying Audio File */}
              <g className="prod-arm-r-group">
                <path
                  d="M 7,-9 L 13,-4 L 10,3"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="3" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />

                {/* 1. BROKEN / GLITCH AUDIO CASSETTE (Red/Corrupt) */}
                <g className="broken-tape-group" transform="translate(14, 5)">
                  <rect x="-9" y="-6" width="18" height="13" fill="#2d1215" stroke="#FF3131" strokeWidth="1.4" rx="1.5" />
                  <circle cx="-4" cy="0" r="2.5" fill="#111" stroke="#FF3131" strokeWidth="0.8" />
                  <circle cx="4" cy="0" r="2.5" fill="#111" stroke="#FF3131" strokeWidth="0.8" />
                  <line x1="-9" y1="4" x2="9" y2="4" stroke="#FF3131" strokeWidth="0.8" strokeDasharray="1 1" />
                  <text x="0" y="-1" textAnchor="middle" fill="#FF3131" fontSize="3" fontWeight="950" fontFamily="monospace">
                    !ERR
                  </text>
                </g>

                {/* 2. RESTORED GOLDEN 24-BIT MASTER TAPE (Neon Green / Gold) */}
                <g className="fixed-tape-group" transform="translate(14, 5)">
                  <rect x="-9" y="-6" width="18" height="13" fill="#00FF94" stroke="#000" strokeWidth="1.4" rx="1.5" />
                  <circle cx="-4" cy="0" r="2.5" fill="#000" />
                  <circle cx="4" cy="0" r="2.5" fill="#000" />
                  <text x="0" y="-1" textAnchor="middle" fill="#000" fontSize="3" fontWeight="950" fontFamily="monospace">
                    100% OK
                  </text>
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* 9. POP-UP STATUS BUBBLES */}
        {/* Bubble 1: Glitch Error Reported */}
        <g className="bubble-glitch">
          <polygon points="-32,-8 32,-8 28,8 -28,8" fill="#FF3131" stroke="#000" strokeWidth="1.6" />
          <text y="3" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="950" fontFamily="'Luckiest Guy', sans-serif">
            SIGNAL CORRUPT!
          </text>
        </g>

        {/* Bubble 2: Diagnosing / Patching */}
        <g className="bubble-fixing">
          <polygon points="-32,-8 32,-8 28,8 -28,8" fill="#00BFFF" stroke="#000" strokeWidth="1.6" />
          <text y="3" textAnchor="middle" fill="#000" fontSize="6" fontWeight="950" fontFamily="'Luckiest Guy', sans-serif">
            DIAGNOSING...
          </text>
        </g>

        {/* Bubble 3: Audio Restored 100%! */}
        <g className="bubble-fixed">
          <polygon points="-35,-9 35,-9 30,9 -30,9" fill="#00FF94" stroke="#000" strokeWidth="1.8" />
          <text
            y="3.5"
            textAnchor="middle"
            fill="#000"
            fontSize="6.5"
            fontWeight="950"
            fontFamily="'Luckiest Guy', sans-serif"
            letterSpacing="0.4"
          >
            AUDIO RESTORED!
          </text>
        </g>
      </svg>
    </div>
  )
}
