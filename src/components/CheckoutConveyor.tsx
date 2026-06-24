'use client'
import React, { useState, useEffect } from 'react'

export function CheckoutConveyor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`h-28 bg-[#0c0d10] relative overflow-hidden select-none pointer-events-none border-y border-black/15 shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)] ${mounted ? 'start-anim' : ''}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* ─── CHARACTER TRANSLATIONS ─── */
        .success-char-group {
        }
        .start-anim .success-char-group {
          animation: successWalkRun 18s infinite linear;
        }
        .fail-char-group {
        }
        .start-anim .fail-char-group {
          animation: failWalkSad 18s infinite linear;
        }
        
        /* ─── WALKING BOBBING (UP & DOWN BODIES) ─── */
        @keyframes successBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2.5px); }
        }
        .success-bob-container {
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .start-anim .success-bob-container {
          animation: successBob 0.6s infinite ease-in-out;
        }
        
        @keyframes failBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .fail-bob-container {
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .start-anim .fail-bob-container {
          /* Faster bob for sneaking/running */
          animation: failBob 0.45s infinite ease-in-out;
        }

        /* ─── SHAKING / SCARED EFFECT ─── */
        @keyframes thiefScaredShaking {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-1px, -1px) rotate(-1.5deg); }
          20% { transform: translate(1.5px, 0px) rotate(1deg); }
          30% { transform: translate(-1.5px, 1px) rotate(-1.5deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 1.5px) rotate(-1deg); }
          60% { transform: translate(1.5px, -1px) rotate(1.5deg); }
          70% { transform: translate(-1px, -1.5px) rotate(-1.5deg); }
          80% { transform: translate(1px, 1px) rotate(1deg); }
          90% { transform: translate(-1.5px, 0px) rotate(-1deg); }
        }
        .thief-body-wrapper {
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .start-anim .thief-body-wrapper {
          animation: thiefScaredTimeline 18s infinite linear;
        }

        /* ─── LEO ROTATION (SWINGING LEGS) ─── */
        .success-leg-l-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .success-leg-l-group {
          animation: successLegLeftAnim 18s infinite ease-in-out;
        }
        .success-leg-r-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .success-leg-r-group {
          animation: successLegRightAnim 18s infinite ease-in-out;
        }
        .success-arm-l-group {
          transform-box: fill-box;
          transform-origin: 100% 0%;
        }
        .start-anim .success-arm-l-group {
          animation: successArmLeftAnim 18s infinite ease-in-out;
        }
        .success-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .success-arm-r-group {
          animation: successArmRightAnim 18s infinite ease-in-out;
        }
        
        .fail-leg-l-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .fail-leg-l-group {
          animation: failLegLeftAnim 18s infinite ease-in-out;
        }
        .fail-leg-r-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .fail-leg-r-group {
          animation: failLegRightAnim 18s infinite ease-in-out;
        }
        .fail-arm-l-group {
          transform-box: fill-box;
          transform-origin: 100% 0%;
        }
        .start-anim .fail-arm-l-group {
          animation: failArmLeftAnim 18s infinite ease-in-out;
        }
        .fail-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .fail-arm-r-group {
          animation: failArmRightAnim 18s infinite ease-in-out;
        }
        
        .guard-group {
          transform-box: fill-box;
        }
        .start-anim .guard-group {
          animation: guardWalkAnim 18s infinite linear;
        }
        .guard-bob-container {
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .start-anim .guard-bob-container {
          animation: guardBobTimeline 18s infinite ease-in-out;
        }
        .guard-leg-l-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .guard-leg-l-group {
          animation: guardLegLeftAnim 18s infinite ease-in-out;
        }
        .guard-leg-r-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .guard-leg-r-group {
          animation: guardLegRightAnim 18s infinite ease-in-out;
        }
        .guard-upper-body {
          transform-box: fill-box;
          transform-origin: 50% 90%;
        }
        .start-anim .guard-upper-body {
          animation: guardUpperBodyTimeline 18s infinite ease-in-out;
        }
        .guard-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .guard-arm-r-group {
          animation: guardArmRightAnim 18s infinite ease-in-out;
        }

        /* ─── DROP & ROLL DYNAMIC PHYSICS ─── */
        .fail-box-group {
          transform-box: fill-box;
          transform-origin: center;
        }
        .start-anim .fail-box-group {
          animation: failBoxAnim 18s infinite ease-in-out;
        }
        
        .start-anim .fail-face-happy {
          animation: failFaceHappyTimeline 18s infinite;
        }
        .start-anim .fail-face-sad {
          animation: failFaceSadTimeline 18s infinite;
        }
        
        /* ─── BUBBLE TEXT DISPLAY ─── */
        .pop-success-text {
          transform-origin: center;
        }
        .start-anim .pop-success-text {
          animation: popSuccessTimeline 18s infinite ease-in-out;
        }
        .pop-fail-text {
          transform-origin: center;
        }
        .start-anim .pop-fail-text {
          animation: popFailTimeline 18s infinite ease-in-out;
        }
        
        .thief-handcuffs {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
        }
        .start-anim .thief-handcuffs {
          animation: thiefHandcuffsTimeline 18s infinite;
        }
        @keyframes thiefHandcuffsTimeline {
          0%, 44.3% { opacity: 0; }
          44.4%, 65% { opacity: 1; }
          65.1%, 100% { opacity: 0; }
        }
        
        /* ─── DETECTOR LIGHTS ─── */
        .start-anim .scanner-light {
          animation: scannerLightTimeline 18s infinite;
        }
        .laser-beam-timeline {
          transform-origin: top center;
        }
        .start-anim .laser-beam-timeline {
          animation: laserScanTimeline 18s infinite ease-in-out;
        }

        /* ─── BACKGROUND VISUALIZERS ─── */
        .eq-bars rect {
          transform-box: fill-box;
          transform-origin: bottom;
        }
        .start-anim .eq-bar-1 { animation: eqWave 0.8s ease-in-out infinite alternate; }
        .start-anim .eq-bar-2 { animation: eqWave 1.2s ease-in-out infinite alternate; }
        .start-anim .eq-bar-3 { animation: eqWave 0.6s ease-in-out infinite alternate; }
        .start-anim .eq-bar-4 { animation: eqWave 1.0s ease-in-out infinite alternate; }

        /* ─── NEW STOREFRONT ROAD STYLES ─── */
        
        /* 1. Scrolling Wooden Plank Floor Joints */
        @keyframes floorScroll {
          from { transform: translateX(0px); }
          to { transform: translateX(-80px); }
        }
        .scrolling-floor {
          /* Steady wood floor - conveyor scroll disabled */
        }

        /* 2. Glowing Awning Canopy Neon Stripe */
        @keyframes canopyNeonGlow {
          0%, 100% { stroke: #0074e4; filter: drop-shadow(0 0 1px #0074e4); }
          50% { stroke: #00ff94; filter: drop-shadow(0 0 3px #00ff94); }
        }
        .canopy-neon {
          animation: canopyNeonGlow 3s ease-in-out infinite;
        }

        /* 3. Wall Display Windows Subtle Glare */
        @keyframes windowGlare {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .window-glare-overlay {
          animation: windowGlare 6s ease-in-out infinite;
        }

        /* 4. Pulsing Neon Store Sign Glow */
        @keyframes neonTextGlow {
          0%, 100% {
            fill: #00f3ff;
            filter: drop-shadow(0 0 1px #00f3ff) drop-shadow(0 0 3px #00f3ff);
          }
          50% {
            fill: #ff007f;
            filter: drop-shadow(0 0 2px #ff007f) drop-shadow(0 0 5px #ff007f) drop-shadow(0 0 9px #ff007f);
          }
        }
        .neon-store-sign-text {
          animation: neonTextGlow 3.5s ease-in-out infinite;
        }

        /* 5. Bouncier Wall Neon Wave Beats */
        @keyframes neonWaveBeat {
          0%, 100% { opacity: 0.4; stroke-width: 1.2px; }
          50% { opacity: 0.9; stroke-width: 2.0px; filter: drop-shadow(0 0 3px currentColor); }
        }
        .neon-wave-left { animation: neonWaveBeat 1.8s ease-in-out infinite; }
        .neon-wave-right { animation: neonWaveBeat 2.2s ease-in-out infinite; }

        /* 6. Spotlight Rig Pulses */
        @keyframes spotlightPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.45; }
        }
        .spotlight-beam-1 { animation: spotlightPulse 4s ease-in-out infinite; }
        .spotlight-beam-2 { animation: spotlightPulse 3s ease-in-out infinite; }
        .spotlight-beam-3 { animation: spotlightPulse 3.5s ease-in-out infinite; }
        .spotlight-beam-4 { animation: spotlightPulse 4.5s ease-in-out infinite; }

        /* 7. Guard Anime Glare */
        @keyframes glareSlide {
          0%, 41.5%, 100% { transform: translateX(-4px); opacity: 0; }
          41.6% { opacity: 1; transform: translateX(0px); }
          42.5% { opacity: 1; transform: translateX(5px); }
          44.4% { opacity: 0; transform: translateX(9px); }
        }
        .glasses-glare {
          animation: glareSlide 18s infinite ease-in-out;
        }

        /* ─── KEYFRAME DATA ─── */
        @keyframes successWalkRun {
          0% { transform: translate(-100px, 0px); }
          1.6% { transform: translate(-20px, -1px); }
          3.2% { transform: translate(60px, 0px); }
          4.8% { transform: translate(140px, -1px); }
          6.4% { transform: translate(220px, 0px); }
          8% { transform: translate(300px, -1px); }
          10% { transform: translate(500px, 0px); }
          16% { transform: translate(500px, 0px); }
          17% { transform: translate(500px, -6px); }
          18% { transform: translate(500px, 0px); }
          19% { transform: translate(500px, 0px); }
          20.3% { transform: translate(700px, -1px); }
          21.6% { transform: translate(900px, 0px); }
          23% { transform: translate(1100px, 0px); }
          100% { transform: translate(1100px, 0px); }
        }
        @keyframes failWalkSad {
          0% { transform: translate(-100px, 0px); opacity: 0; }
          24.9% { transform: translate(-100px, 0px); opacity: 0; }
          25% { transform: translate(-100px, 0px); opacity: 1; }
          27% { transform: translate(20px, -1px); }
          29% { transform: translate(140px, 0px); }
          31% { transform: translate(260px, -1px); }
          33% { transform: translate(380px, 0px); }
          35% { transform: translate(500px, 0px); }
          44.3% { transform: translate(500px, 0px); }
          44.4% { transform: translate(500px, 0px) rotate(0deg); }
          47% { transform: translate(420px, -1px) rotate(-5deg); }
          50% { transform: translate(340px, 0px) rotate(-5deg); }
          53% { transform: translate(260px, -1px) rotate(-5deg); }
          56% { transform: translate(180px, 0px) rotate(-5deg); }
          59% { transform: translate(100px, -1px) rotate(-5deg); }
          62% { transform: translate(20px, 0px) rotate(-5deg); }
          65% { transform: translate(-100px, 0px) rotate(0deg); opacity: 1; }
          65.1%, 100% { transform: translate(-100px, 0px); opacity: 0; }
        }

        /* Scared shaking schedule for shoplifter thief */
        @keyframes thiefScaredTimeline {
          0%, 41.5% { transform: scale(1) translate(0, 0) rotate(0deg); }
          41.6% { transform: scale(1.05) translate(-1px, 0px) rotate(-2deg); }
          42.2% { transform: scale(1.05) translate(1.5px, -1px) rotate(1.5deg); }
          42.8% { transform: scale(1.05) translate(-1.5px, 0.5px) rotate(-1.5deg); }
          43.4% { transform: scale(1.05) translate(1px, -1px) rotate(2deg); }
          44% { transform: scale(1.05) translate(-1px, 1px) rotate(-2deg); }
          44.4%, 100% { transform: scale(1) translate(0, 0) rotate(0deg); }
        }
        
        @keyframes successLegLeftAnim {
          0% { transform: rotate(0deg); }
          1.6% { transform: rotate(28deg); }
          3.2% { transform: rotate(-28deg); }
          4.8% { transform: rotate(28deg); }
          6.4% { transform: rotate(-28deg); }
          8% { transform: rotate(28deg); }
          10% { transform: rotate(0deg); }
          16% { transform: rotate(-10deg); }
          17% { transform: rotate(-20deg); }
          18% { transform: rotate(-10deg); }
          19% { transform: rotate(0deg); }
          20.3% { transform: rotate(28deg); }
          21.6% { transform: rotate(-28deg); }
          23%, 100% { transform: rotate(0deg); }
        }
        @keyframes successLegRightAnim {
          0% { transform: rotate(0deg); }
          1.6% { transform: rotate(-28deg); }
          3.2% { transform: rotate(28deg); }
          4.8% { transform: rotate(-28deg); }
          6.4% { transform: rotate(28deg); }
          8% { transform: rotate(-28deg); }
          10% { transform: rotate(0deg); }
          16% { transform: rotate(10deg); }
          17% { transform: rotate(20deg); }
          18% { transform: rotate(10deg); }
          19% { transform: rotate(0deg); }
          20.3% { transform: rotate(-28deg); }
          21.6% { transform: rotate(28deg); }
          23%, 100% { transform: rotate(0deg); }
        }
        @keyframes successArmLeftAnim {
          0% { transform: rotate(0deg); }
          1.6% { transform: rotate(-20deg); }
          3.2% { transform: rotate(20deg); }
          4.8% { transform: rotate(-20deg); }
          6.4% { transform: rotate(20deg); }
          8% { transform: rotate(-20deg); }
          10% { transform: rotate(0deg); }
          16% { transform: rotate(-120deg); }
          17% { transform: rotate(-140deg); }
          18% { transform: rotate(-120deg); }
          19% { transform: rotate(-120deg); }
          20.3% { transform: translateY(-4px) rotate(-110deg); }
          21.6% { transform: translateY(-8px) rotate(-130deg); }
          23%, 100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes successArmRightAnim {
          0% { transform: rotate(0deg); }
          1.6% { transform: rotate(20deg); }
          3.2% { transform: rotate(-20deg); }
          4.8% { transform: rotate(20deg); }
          6.4% { transform: rotate(-20deg); }
          8% { transform: rotate(20deg); }
          10% { transform: rotate(0deg); }
          16% { transform: rotate(120deg); }
          17% { transform: rotate(140deg); }
          18% { transform: rotate(120deg); }
          19% { transform: rotate(120deg); }
          20.3% { transform: translateY(-4px) rotate(110deg); }
          21.6% { transform: translateY(-8px) rotate(130deg); }
          23%, 100% { transform: translateY(0) rotate(0deg); }
        }
        
        @keyframes failLegLeftAnim {
          0%, 24.9% { transform: rotate(0deg); }
          27% { transform: rotate(22deg); }
          29% { transform: rotate(-22deg); }
          31% { transform: rotate(22deg); }
          33% { transform: rotate(-22deg); }
          35% { transform: rotate(0deg); }
          44.3% { transform: rotate(0deg); }
          46% { transform: rotate(28deg); }
          49% { transform: rotate(-28deg); }
          52% { transform: rotate(28deg); }
          55% { transform: rotate(-28deg); }
          58% { transform: rotate(28deg); }
          61% { transform: rotate(-28deg); }
          64%, 100% { transform: rotate(0deg); }
        }
        @keyframes failLegRightAnim {
          0%, 24.9% { transform: rotate(0deg); }
          27% { transform: rotate(-22deg); }
          29% { transform: rotate(22deg); }
          31% { transform: rotate(-22deg); }
          33% { transform: rotate(22deg); }
          35% { transform: rotate(0deg); }
          44.3% { transform: rotate(0deg); }
          46% { transform: rotate(-28deg); }
          49% { transform: rotate(28deg); }
          52% { transform: rotate(-28deg); }
          55% { transform: rotate(28deg); }
          58% { transform: rotate(-28deg); }
          61% { transform: rotate(28deg); }
          64%, 100% { transform: rotate(0deg); }
        }
        @keyframes failArmLeftAnim {
          0%, 24.9% { transform: rotate(0deg); }
          25%, 41.5% { transform: rotate(-120deg); }
          41.6% { transform: rotate(-145deg) translateY(-2px); }
          42.8% { transform: rotate(-135deg) translateY(-1px); }
          44% { transform: rotate(-145deg); }
          44.4%, 65% { transform: rotate(-40deg); }
          65.1%, 100% { transform: rotate(0deg); }
        }
        @keyframes failArmRightAnim {
          0%, 24.9% { transform: rotate(0deg); }
          25%, 41.5% { transform: rotate(120deg); }
          41.6% { transform: rotate(145deg) translateY(-2px); }
          42.8% { transform: rotate(135deg) translateY(-1px); }
          44% { transform: rotate(145deg); }
          44.4%, 65% { transform: rotate(40deg); }
          65.1%, 100% { transform: rotate(0deg); }
        }

        /* Box dropped & ROLLING/BOUNCING away on wood shop floor */
        @keyframes failBoxAnim {
          0%, 34.9% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
          35%, 44.3% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
          44.4% { transform: translate(0px, 0px) rotate(0deg) opacity: 1; }
          46.4% { transform: translate(50px, -20px) rotate(160deg); }
          48.9% { transform: translate(110px, 16px) rotate(320deg); }
          50.4% { transform: translate(140px, 2px) rotate(380deg); }
          51.9% { transform: translate(170px, 16px) rotate(440deg); }
          53.4% { transform: translate(200px, 9px) rotate(480deg); }
          54.9% { transform: translate(230px, 16px) rotate(520deg); }
          57.4% { transform: translate(300px, 16px) rotate(580deg); }
          60% { transform: translate(370px, 16px) rotate(640deg); }
          62.5% { transform: translate(440px, 16px) rotate(700deg) opacity: 0.8; }
          65% { transform: translate(500px, 16px) rotate(760deg) opacity: 0; }
          65.1%, 100% { opacity: 0; }
        }
        
        @keyframes failFaceHappyTimeline {
          0%, 41.5% { opacity: 1; }
          41.6%, 100% { opacity: 0; }
        }
        @keyframes failFaceSadTimeline {
          0%, 41.5% { opacity: 0; }
          41.6%, 100% { opacity: 1; }
        }
        
        @keyframes guardArmRightAnim {
          0%, 9.9% { transform: rotate(0deg); }
          10% { transform: rotate(-50deg); }
          12% { transform: rotate(-25deg); }
          14% { transform: rotate(-50deg); }
          16% { transform: rotate(-25deg); }
          17%, 41.5% { transform: rotate(0deg); }
          /* Caught shoplifter! Points angrily at first. */
          41.6% { transform: rotate(90deg); }
          42.5% { transform: rotate(70deg); }
          43.5% { transform: rotate(90deg); }
          /* Escorting thief: keeps right arm pointing forward/pushing */
          44.4%, 65% { transform: rotate(80deg); }
          /* Walking back tired: droops hanging loose */
          70%, 90% { transform: rotate(-15deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes guardWalkAnim {
          0%, 41.5% { transform: translate(535px, 50px); opacity: 1; }
          41.6%, 44.3% { transform: translate(515px, 50px); opacity: 1; }
          44.4% { transform: translate(515px, 50px); opacity: 1; }
          47% { transform: translate(435px, 50px); }
          50% { transform: translate(355px, 50px); }
          53% { transform: translate(275px, 50px); }
          56% { transform: translate(195px, 50px); }
          59% { transform: translate(115px, 50px); }
          62% { transform: translate(35px, 50px); }
          65% { transform: translate(-45px, 50px); opacity: 1; }
          65.1%, 69.9% { transform: translate(-45px, 50px); opacity: 1; }
          /* Walking back tired (70% - 90%) */
          70% { transform: translate(-45px, 50px); }
          72.5% { transform: translate(25px, 50px); }
          75% { transform: translate(95px, 50px); }
          77.5% { transform: translate(165px, 50px); }
          80% { transform: translate(235px, 50px); }
          82.5% { transform: translate(305px, 50px); }
          85% { transform: translate(375px, 50px); }
          87.5% { transform: translate(445px, 50px); }
          90% { transform: translate(535px, 50px); }
          90.1%, 100% { transform: translate(535px, 50px); opacity: 1; }
        }

        @keyframes guardBobTimeline {
          0%, 44.3% { transform: translateY(0px); }
          /* Escort bobbing */
          46% { transform: translateY(-2.5px); }
          49% { transform: translateY(0px); }
          52% { transform: translateY(-2.5px); }
          55% { transform: translateY(0px); }
          58% { transform: translateY(-2.5px); }
          61% { transform: translateY(0px); }
          64% { transform: translateY(0px); }
          65%, 69.9% { transform: translateY(0px); }
          /* Tired return bobbing (deeper downwards movement to show heavy step) */
          71.25% { transform: translateY(1.5px); }
          73.75% { transform: translateY(-1.5px); }
          76.25% { transform: translateY(1.5px); }
          78.75% { transform: translateY(-1.5px); }
          81.25% { transform: translateY(1.5px); }
          83.75% { transform: translateY(-1.5px); }
          86.25% { transform: translateY(1.5px); }
          88.75% { transform: translateY(-1.5px); }
          90%, 100% { transform: translateY(0px); }
        }

        @keyframes guardLegLeftAnim {
          0%, 44.3% { transform: rotate(0deg); }
          /* Escorting thief (44.4% - 65%) */
          46% { transform: rotate(28deg); }
          49% { transform: rotate(-28deg); }
          52% { transform: rotate(28deg); }
          55% { transform: rotate(-28deg); }
          58% { transform: rotate(28deg); }
          61% { transform: rotate(-28deg); }
          64% { transform: rotate(0deg); }
          65%, 69.9% { transform: rotate(0deg); }
          /* Walking back tired (70% - 90%) - slower steps */
          72.5% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
          77.5% { transform: rotate(-20deg); }
          80% { transform: rotate(20deg); }
          82.5% { transform: rotate(-20deg); }
          85% { transform: rotate(20deg); }
          87.5% { transform: rotate(-20deg); }
          90%, 100% { transform: rotate(0deg); }
        }

        @keyframes guardLegRightAnim {
          0%, 44.3% { transform: rotate(0deg); }
          /* Escorting thief (44.4% - 65%) */
          46% { transform: rotate(-28deg); }
          49% { transform: rotate(28deg); }
          52% { transform: rotate(-28deg); }
          55% { transform: rotate(28deg); }
          58% { transform: rotate(-28deg); }
          61% { transform: rotate(28deg); }
          64% { transform: rotate(0deg); }
          65%, 69.9% { transform: rotate(0deg); }
          /* Walking back tired (70% - 90%) */
          72.5% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
          77.5% { transform: rotate(20deg); }
          80% { transform: rotate(-20deg); }
          82.5% { transform: rotate(20deg); }
          85% { transform: rotate(-20deg); }
          87.5% { transform: rotate(20deg); }
          90%, 100% { transform: rotate(0deg); }
        }

        @keyframes guardUpperBodyTimeline {
          0%, 69.9% { transform: rotate(0deg); }
          /* Slouched walk back */
          70%, 90% { transform: rotate(-12deg) translateY(1.5px); }
          /* Slowly recover at post */
          95%, 100% { transform: rotate(0deg); }
        }
        
        @keyframes popSuccessTimeline {
          0%, 15.9% { transform: translate(500px, 20px) scale(0); opacity: 0; }
          16% { transform: translate(500px, 20px) scale(1.1) rotate(4deg); opacity: 1; }
          18% { transform: translate(500px, 15px) scale(1) rotate(-4deg); opacity: 1; }
          20% { transform: translate(500px, 10px) scale(0); opacity: 0; }
          100% { transform: translate(500px, 10px) scale(0); opacity: 0; }
        }
        @keyframes popFailTimeline {
          0%, 41.5% { transform: translate(500px, 20px) scale(0); opacity: 0; }
          41.6% { transform: translate(500px, 20px) scale(1.1) rotate(-4deg); opacity: 1; }
          44% { transform: translate(500px, 15px) scale(1) rotate(4deg); opacity: 1; }
          46% { transform: translate(500px, 10px) scale(0); opacity: 0; }
          100% { transform: translate(500px, 10px) scale(0); opacity: 0; }
        }
        
        @keyframes laserScanTimeline {
          0%, 9.9% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
          10% { fill: rgba(0, 191, 255, 0.35); opacity: 0.8; transform: scaleX(0.85); }
          13% { fill: rgba(0, 191, 255, 0.4); opacity: 0.9; transform: scaleX(1.15); }
          15.9% { fill: rgba(0, 191, 255, 0.35); opacity: 0.8; transform: scaleX(0.85); }
          16% { fill: rgba(0, 255, 148, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          19% { fill: rgba(0, 255, 148, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          19.1%, 34.9% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
          35% { fill: rgba(0, 191, 255, 0.35); opacity: 0.8; transform: scaleX(0.85); }
          38% { fill: rgba(0, 191, 255, 0.4); opacity: 0.9; transform: scaleX(1.15); }
          41.5% { fill: rgba(0, 191, 255, 0.35); opacity: 0.8; transform: scaleX(0.85); }
          41.6% { fill: rgba(255, 49, 49, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          44.4% { fill: rgba(255, 49, 49, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          44.5%, 100% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
        }
        
        @keyframes scannerLightTimeline {
          0%, 9.9% { fill: #333; }
          10%, 15.9% { fill: #00BFFF; filter: drop-shadow(0 0 3px #00BFFF); }
          16%, 19% { fill: #00FF94; filter: drop-shadow(0 0 5px #00FF94); }
          19.1%, 34.9% { fill: #333; }
          35%, 41.5% { fill: #00BFFF; filter: drop-shadow(0 0 3px #00BFFF); }
          41.6%, 44.4% { fill: #FF3131; filter: drop-shadow(0 0 5px #FF3131); }
          44.5%, 100% { fill: #333; }
        }
        
        @keyframes eqWave {
          0% { transform: scaleY(0.25); }
          100% { transform: scaleY(1.25); }
        }
      `}} />

      {/* SVG Storefront Street Layout */}
      <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* 1. Backdrop Storefront Facade (Wall background) */}
        <rect width="1000" height="72" fill="#0d0e12" />
        
        {/* Subtle brick paneling line markings */}
        <path d="M 0 24 L 1000 24 M 0 48 L 1000 48" stroke="#171922" strokeWidth="0.5" />
        <path d="M 120 0 L 120 24 M 240 24 L 240 48 M 360 48 L 360 72 M 640 0 L 640 24 M 760 24 L 760 48 M 880 48 L 880 72" stroke="#171922" strokeWidth="0.5" />

        {/* Spotlights glowing beams */}
        <polygon points="120,4 70,72 170,72" fill="rgba(0,191,255,0.01)" className="spotlight-beam-1" />
        <polygon points="340,4 290,72 390,72" fill="rgba(255,230,0,0.01)" className="spotlight-beam-2" />
        <polygon points="660,4 610,72 710,72" fill="rgba(0,255,148,0.01)" className="spotlight-beam-3" />
        <polygon points="880,4 830,72 930,72" fill="rgba(0,191,255,0.01)" className="spotlight-beam-4" />

        {/* 2. Shop Display Windows */}
        {/* Left Window: Sound Packs Display */}
        <rect x="60" y="10" width="240" height="52" fill="#090a0d" stroke="#22252e" strokeWidth="1.8" rx="1.5" />
        {/* Window Shelves */}
        <line x1="60" y1="28" x2="300" y2="28" stroke="#22252e" strokeWidth="1.2" />
        <line x1="60" y1="46" x2="300" y2="46" stroke="#22252e" strokeWidth="1.2" />
        
        {/* Window items (Pack displays) */}
        {/* Top shelf packs */}
        <rect x="75" y="13" width="9" height="12" fill="#FF0080" stroke="#000" strokeWidth="0.8" rx="0.5" />
        <rect x="88" y="13" width="9" height="12" fill="#00FF94" stroke="#000" strokeWidth="0.8" rx="0.5" />
        <rect x="101" y="13" width="9" height="12" fill="#00BFFF" stroke="#000" strokeWidth="0.8" rx="0.5" />
        <rect x="114" y="13" width="9" height="12" fill="#FFE600" stroke="#000" strokeWidth="0.8" rx="0.5" />
        {/* Middle shelf packs */}
        <rect x="150" y="31" width="10" height="12" fill="#FF5C00" stroke="#000" strokeWidth="0.8" rx="0.5" />
        <rect x="164" y="31" width="10" height="12" fill="#BF00FF" stroke="#000" strokeWidth="0.8" rx="0.5" />
        {/* Bottom shelf speaker */}
        <rect x="256" y="15" width="16" height="28" fill="#1b1c21" stroke="#000" strokeWidth="1.2" rx="1" />
        <circle cx="264" cy="22" r="3.5" fill="#FFE600" />
        <circle cx="264" cy="34" r="5" fill="#FFE600" />

        {/* Right Window: Synthesizer & Vinyl crates */}
        <rect x="700" y="10" width="240" height="52" fill="#090a0d" stroke="#22252e" strokeWidth="1.8" rx="1.5" />
        {/* Synth stand */}
        <rect x="720" y="24" width="36" height="5" fill="#1e1e24" stroke="#000" strokeWidth="1" rx="0.5" />
        <rect x="722" y="27" width="32" height="2" fill="#fff" />
        {/* Vinyl Crate */}
        <rect x="870" y="24" width="28" height="22" fill="#16181d" stroke="#000" strokeWidth="1.2" rx="1" />
        <rect x="874" y="27" width="2" height="15" fill="#00FF94" />
        <rect x="878" y="27" width="2" height="15" fill="#FF0080" />
        <rect x="882" y="27" width="2" height="15" fill="#00BFFF" />
        <rect x="886" y="27" width="2" height="15" fill="#FFE600" />

        {/* Glass reflection streaks overlaying windows */}
        <polygon points="70,10 95,10 65,62 40,62" fill="#fff" opacity="0.05" />
        <polygon points="210,10 235,10 205,62 180,62" fill="#fff" opacity="0.05" />
        <polygon points="730,10 755,10 725,62 700,62" fill="none" className="window-glare-overlay" />
        <polygon points="860,10 885,10 855,62 830,62" fill="none" className="window-glare-overlay" />

        {/* Neon Soundwaves on exterior facade wall */}
        <path d="M 25 36 Q 35 25 45 36 T 65 36" fill="none" stroke="#00BFFF" strokeWidth="1.2" strokeLinecap="round" className="neon-wave-left" />
        <path d="M 945 36 Q 955 25 965 36 T 985 36" fill="none" stroke="#FF0080" strokeWidth="1.2" strokeLinecap="round" className="neon-wave-right" />

        {/* Store Entrance Scanner Doorframe */}
        <rect x="474" y="14" width="52" height="58" fill="#15171c" stroke="#25272f" strokeWidth="2" />
        <rect x="478" y="16" width="5" height="56" fill="#2d303b" stroke="#000" strokeWidth="1" />
        <rect x="517" y="16" width="5" height="56" fill="#2d303b" stroke="#000" strokeWidth="1" />
        <rect x="473" y="8" width="54" height="9" rx="1.5" fill="#383d4c" stroke="#000" strokeWidth="1.2" />
        <circle cx="500" cy="12.5" r="2.5" fill="#333" className="scanner-light" />
        
        {/* Pulsing laser gate scan beam */}
        <polygon points="484,16 516,16 521,72 479,72" className="laser-beam-timeline" />

        {/* 3. The Neon Store Signage */}
        <g transform="translate(500, -2)">
          {/* Sign board background */}
          <rect x="-65" y="1" width="130" height="9" rx="1.5" fill="#111" stroke="#000" strokeWidth="1.5" />
          <text y="7.5" textAnchor="middle" fontSize="6.8" fontWeight="950" fontFamily="'Luckiest Guy', sans-serif" letterSpacing="0.8" className="neon-store-sign-text">SAMPLES WALA</text>
        </g>
        
        {/* EQ Background Visualizers inside Shop */}
        <g className="eq-bars" opacity="0.22">
          <rect x="180" y="24" width="4" height="20" rx="1" fill="#00FF94" className="eq-bar-1" />
          <rect x="187" y="20" width="4" height="24" rx="1" fill="#FF0080" className="eq-bar-2" />
          <rect x="194" y="26" width="4" height="18" rx="1" fill="#00BFFF" className="eq-bar-3" />
        </g>

        {/* 4. Polished Wooden Shop Floor */}
        <g className="scrolling-floor">
          {/* Main floor rect, width extended on the left to cover scroll buffer */}
          <rect x="-160" y="72" width="1320" height="28" fill="#583c27" />
          
          {/* Floor Planks Horizontal Borders */}
          <line x1="-160" y1="72" x2="1160" y2="72" stroke="#3d2719" strokeWidth="1.2" />
          <line x1="-160" y1="81" x2="1160" y2="81" stroke="#3d2719" strokeWidth="0.8" />
          <line x1="-160" y1="90" x2="1160" y2="90" stroke="#3d2719" strokeWidth="0.8" />
          <line x1="-160" y1="99" x2="1160" y2="99" stroke="#3d2719" strokeWidth="1.2" />

          {/* Vertical joints for wood planks (offset on each row for realism) */}
          <g stroke="#3d2719" strokeWidth="0.8">
            {/* Top row joints (spaced every 80px) */}
            <line x1="-80" y1="72" x2="-80" y2="81" />
            <line x1="0" y1="72" x2="0" y2="81" />
            <line x1="80" y1="72" x2="80" y2="81" />
            <line x1="160" y1="72" x2="160" y2="81" />
            <line x1="240" y1="72" x2="240" y2="81" />
            <line x1="320" y1="72" x2="320" y2="81" />
            <line x1="400" y1="72" x2="400" y2="81" />
            <line x1="480" y1="72" x2="480" y2="81" />
            <line x1="560" y1="72" x2="560" y2="81" />
            <line x1="640" y1="72" x2="640" y2="81" />
            <line x1="720" y1="72" x2="720" y2="81" />
            <line x1="800" y1="72" x2="800" y2="81" />
            <line x1="880" y1="72" x2="880" y2="81" />
            <line x1="960" y1="72" x2="960" y2="81" />
            <line x1="1040" y1="72" x2="1040" y2="81" />
            <line x1="1120" y1="72" x2="1120" y2="81" />

            {/* Middle row joints (shifted by 40px) */}
            <line x1="-40" y1="81" x2="-40" y2="90" />
            <line x1="40" y1="81" x2="40" y2="90" />
            <line x1="120" y1="81" x2="120" y2="90" />
            <line x1="200" y1="81" x2="200" y2="90" />
            <line x1="280" y1="81" x2="280" y2="90" />
            <line x1="360" y1="81" x2="360" y2="90" />
            <line x1="440" y1="81" x2="440" y2="90" />
            <line x1="520" y1="81" x2="520" y2="90" />
            <line x1="600" y1="81" x2="600" y2="90" />
            <line x1="680" y1="81" x2="680" y2="90" />
            <line x1="760" y1="81" x2="760" y2="90" />
            <line x1="840" y1="81" x2="840" y2="90" />
            <line x1="920" y1="81" x2="920" y2="90" />
            <line x1="1000" y1="81" x2="1000" y2="90" />
            <line x1="1080" y1="81" x2="1080" y2="90" />
            <line x1="1160" y1="81" x2="1160" y2="90" />

            {/* Bottom row joints (shifted by 20px) */}
            <line x1="-60" y1="90" x2="-60" y2="99" />
            <line x1="20" y1="90" x2="20" y2="99" />
            <line x1="100" y1="90" x2="100" y2="99" />
            <line x1="180" y1="90" x2="180" y2="99" />
            <line x1="260" y1="90" x2="260" y2="99" />
            <line x1="340" y1="90" x2="340" y2="99" />
            <line x1="420" y1="90" x2="420" y2="99" />
            <line x1="500" y1="90" x2="500" y2="99" />
            <line x1="580" y1="90" x2="580" y2="99" />
            <line x1="660" y1="90" x2="660" y2="99" />
            <line x1="740" y1="90" x2="740" y2="99" />
            <line x1="820" y1="90" x2="820" y2="99" />
            <line x1="900" y1="90" x2="900" y2="99" />
            <line x1="980" y1="90" x2="980" y2="99" />
            <line x1="1060" y1="90" x2="1060" y2="99" />
            <line x1="1140" y1="90" x2="1140" y2="99" />
          </g>

          {/* Polished wood highlight reflection overlay */}
          <rect x="-160" y="72" width="1320" height="28" fill="#fff" opacity="0.04" />
        </g>

        {/* ─── CHARACTER 1: SUCCESS CUSTOMER ─── */}
        <g className="success-char-group">
          {/* Walk/stealth vertical bob container */}
          <g className="success-bob-container">
            <g transform="translate(0, 50)">
              {/* Left Leg */}
              <g className="success-leg-l-group">
                <line x1="-3" y1="7" x2="-3" y2="21" stroke="#2563eb" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="-3" y1="7" x2="-3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M-7,20 L-2,20 C-1,20 -1,23 -3,23 L-7,23 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
              </g>
              {/* Right Leg */}
              <g className="success-leg-r-group">
                <line x1="3" y1="7" x2="3" y2="21" stroke="#2563eb" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="3" y1="7" x2="3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M-1,20 L4,20 C5,20 5,23 3,23 L-1,23 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
              </g>
              {/* Body (Hip-hop streetwear jacket) */}
              <rect x="-8" y="-14" width="16" height="21" rx="4.5" fill="#ea580c" stroke="#000" strokeWidth="2" />
              {/* White collar strings */}
              <line x1="-2" y1="-8" x2="-2" y2="-2" stroke="#fff" strokeWidth="1" />
              <line x1="2" y1="-8" x2="2" y2="-2" stroke="#fff" strokeWidth="1" />
              {/* Head with Beanie cap */}
              <circle cx="0" cy="-21" r="7.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
              <path d="M-8,-22 C-8,-28 8,-28 8,-22 Z" fill="#1e293b" stroke="#000" strokeWidth="1" />
              
              {/* Happy Eyes & Face */}
              <circle cx="-2.2" cy="-22.5" r="0.8" fill="#000" />
              <circle cx="2.2" cy="-22.5" r="0.8" fill="#000" />
              <path d="M-2.5,-19 Q0,-17 2.5,-19" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
              
              {/* Left Arm */}
              <g className="success-arm-l-group">
                <path d="M-7,-9 L-13,-4 L-9,1" fill="none" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M-7,-9 L-13,-4 L-9,1" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="-9" cy="1" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
              </g>
              {/* Right Arm carrying bag */}
              <g className="success-arm-r-group">
                <path d="M7,-9 L13,-4 L10,3" fill="none" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7,-9 L13,-4 L10,3" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="3" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
                
                {/* 💼 SAMPLESWALA NEON GREEN SHOPPING BAG */}
                <g transform="translate(10, 6)">
                  <rect x="-6" y="-1" width="12" height="14" fill="#00ff87" stroke="#000" strokeWidth="1.2" rx="1" />
                  <path d="M-3,-1 Q0,-6 3,-1" fill="none" stroke="#000" strokeWidth="1.2" />
                  <text x="0" y="8" textAnchor="middle" fill="#000" fontSize="3.8" fontWeight="950" fontFamily="sans-serif">SW</text>
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* ─── CHARACTER 2: SHOPLIFTER THIEF ─── */}
        <g className="fail-char-group">
          {/* Shaking animation wrapped around bob container */}
          <g className="thief-body-wrapper">
            <g className="fail-bob-container">
              <g transform="translate(0, 50)">
                {/* Thief Pants & boots */}
                <g className="fail-leg-l-group">
                  <line x1="-3" y1="7" x2="-3" y2="21" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="-3" y1="7" x2="-3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M-7,20 L-2,20 C-1,20 -1,23 -3,23 L-7,23 Z" fill="#0f172a" stroke="#000" strokeWidth="1.2" />
                </g>
                <g className="fail-leg-r-group">
                  <line x1="3" y1="7" x2="3" y2="21" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="3" y1="7" x2="3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M-1,20 L4,20 C5,20 5,23 3,23 L-1,23 Z" fill="#0f172a" stroke="#000" strokeWidth="1.2" />
                </g>
                {/* Thief Torso (Striped Swag Burglar Outfit) */}
                <g>
                  <rect x="-8" y="-14" width="16" height="21" rx="4.5" fill="#fff" stroke="#000" strokeWidth="2" />
                  <rect x="-7" y="-11" width="14" height="3.2" fill="#1e293b" />
                  <rect x="-7" y="-5" width="14" height="3.2" fill="#1e293b" />
                  <rect x="-7" y="1" width="14" height="3.2" fill="#1e293b" />
                </g>
                {/* Mask & Beanie head */}
                <circle cx="0" cy="-21" r="7.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
                <path d="M-8.2,-22.2 C-8.2,-29 8.2,-29 8.2,-22.2 Z" fill="#111" stroke="#000" strokeWidth="1.5" />
                {/* Black burglar eye mask */}
                <rect x="-5.5" y="-23.5" width="11" height="3.8" fill="#111" rx="1" stroke="#000" strokeWidth="0.6" />
                <circle cx="-2.5" cy="-21.6" r="0.6" fill="#fff" />
                <circle cx="2.5" cy="-21.6" r="0.6" fill="#fff" />
                {/* Face expressions */}
                <g className="fail-face-happy">
                  <path d="M-2.5,-18 Q0,-18 2.5,-18" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                </g>
                <g className="fail-face-sad">
                  <circle cx="-2.5" cy="-19.2" r="0.5" fill="#00BFFF" />
                  <circle cx="2.5" cy="-19.2" r="0.5" fill="#00BFFF" />
                  <path d="M-2.5,-17 Q0,-19 2.5,-17" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                </g>
                {/* Thief Sleeves */}
                <g className="fail-arm-l-group">
                  <path d="M-7,-9 L-13,-4 L-9,1" fill="none" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M-7,-9 L-13,-4 L-9,1" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="-9" cy="1" r="2" fill="#111" stroke="#000" strokeWidth="1" />
                </g>
                <g className="fail-arm-r-group">
                  <path d="M7,-9 L13,-4 L9,1" fill="none" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7,-9 L13,-4 L9,1" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="1" r="2" fill="#111" stroke="#000" strokeWidth="1" />
                </g>
                
                {/* STOLEN CARDBOARD BOX (Detailed packaging) */}
                <g className="fail-box-group">
                  <rect x="-14" y="-7" width="28" height="17" fill="#c08a58" stroke="#000" strokeWidth="1.8" rx="1.2" />
                  <line x1="-14" y1="2" x2="14" y2="2" stroke="#906030" strokeWidth="1" />
                  <rect x="-3.5" y="-7" width="7" height="17" fill="#00BFFF" stroke="#000" strokeWidth="0.8" />
                  <text y="7.5" textAnchor="middle" fill="#000" fontSize="3.5" fontWeight="950" fontFamily="'Luckiest Guy', sans-serif">DRUMS</text>
                </g>
                
                {/* Handcuffs */}
                <g className="thief-handcuffs">
                  <circle cx="-3.5" cy="2" r="3.2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="3.5" cy="2" r="3.2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="-2.0" y1="2" x2="2.0" y2="2" stroke="#94a3b8" strokeWidth="1.5" />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* ─── SECURITY GUARD / BOUNCER ─── */}
        <g className="guard-group" transform="translate(535, 50)">
          <g className="guard-bob-container">
            {/* Left Leg */}
            <g className="guard-leg-l-group">
              <line x1="-3" y1="7" x2="-3" y2="21" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="-3" y1="7" x2="-3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M-7,20 L-2,20 C-1,20 -1,23 -3,23 L-7,23 Z" fill="#0f172a" stroke="#000" strokeWidth="1.2" />
            </g>
            {/* Right Leg */}
            <g className="guard-leg-r-group">
              <line x1="3" y1="7" x2="3" y2="21" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="3" y1="7" x2="3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M-1,20 L4,20 C5,20 5,23 3,23 L-1,23 Z" fill="#0f172a" stroke="#000" strokeWidth="1.2" />
            </g>
            
            {/* Upper body container to hunch when tired */}
            <g className="guard-upper-body">
              {/* Uniform shirt & belt */}
              <rect x="-8" y="-14" width="16" height="21" rx="2" fill="#1e293b" stroke="#000" strokeWidth="2" />
              <rect x="-9" y="4" width="18" height="3" fill="#111" stroke="#000" strokeWidth="1.2" />
              <rect x="-2" y="3.5" width="4" height="4" fill="#FFE600" stroke="#000" strokeWidth="0.5" />
              <polygon points="0,-14 -3,-9 0,-5 3,-9" fill="#111" />
              {/* Shield Badge */}
              <polygon points="2,-7 5,-4 3,-1 1,-4" fill="#FFE600" stroke="#000" strokeWidth="0.6" />
              {/* Head */}
              <circle cx="0" cy="-21" r="7.5" fill="#FFE600" stroke="#000" strokeWidth="2" />
              {/* Cap */}
              <path d="M-8,-26 L8,-26 L9,-22 L-9,-22 Z" fill="#0f172a" stroke="#000" strokeWidth="1.5" />
              <rect x="-4" y="-25" width="8" height="2.2" fill="#FFE600" />
              {/* Sunglasses with Glare Shine */}
              <g className="guard-glasses">
                <rect x="-4.5" y="-23.2" width="3.5" height="2.0" fill="#000" rx="0.5" />
                <rect x="1" y="-23.2" width="3.5" height="2.0" fill="#000" rx="0.5" />
                <line x1="-6" y1="-23" x2="-3.5" y2="-21" stroke="#fff" strokeWidth="0.7" className="glasses-glare" />
                <line x1="-0.5" y1="-23" x2="2" y2="-21" stroke="#fff" strokeWidth="0.7" className="glasses-glare" />
              </g>
              {/* Serious mouth line */}
              <path d="M-2.5,-18 L2.5,-18" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
              
              {/* Left Arm holding security wand */}
              <path d="M-7,-9 L-13,-4 L-10,4" fill="none" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-7,-9 L-13,-4 L-10,4" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="-10" cy="4" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
              <line x1="-10" y1="4" x2="-8" y2="10" stroke="#FFE600" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Right Arm (angry pointer) */}
              <g className="guard-arm-r-group">
                <path d="M7,-9 L13,-4 L10,3" fill="none" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7,-9 L13,-4 L10,3" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="3" r="2" fill="#FFE600" stroke="#000" strokeWidth="1" />
              </g>
            </g>
          </g>
        </g>

        {/* Indicator PASS Pop-up bubble */}
        <g className="pop-success-text" transform="translate(500, 20)">
          <polygon points="-28,-8 28,-8 23,8 -23,8" fill="#00FF94" stroke="#000" strokeWidth="1.8" />
          <text y="3" textAnchor="middle" fill="#000" fontSize="7.5" fontWeight="950" fontFamily="'Luckiest Guy', sans-serif" letterSpacing="0.5">PASS!</text>
        </g>

        {/* Indicator FAIL Pop-up bubble */}
        <g className="pop-fail-text" transform="translate(500, 20)">
          <polygon points="-28,-8 28,-8 23,8 -23,8" fill="#FF3131" stroke="#000" strokeWidth="1.8" />
          <text y="3" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="950" fontFamily="'Luckiest Guy', sans-serif" letterSpacing="0.5">FAIL!</text>
        </g>
      </svg>
    </div>
  )
}
