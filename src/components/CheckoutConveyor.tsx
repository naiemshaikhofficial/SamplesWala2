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
          animation: successWalkRun 12s infinite linear;
        }
        .fail-char-group {
        }
        .start-anim .fail-char-group {
          animation: failWalkSad 12s infinite linear;
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
          animation: thiefScaredTimeline 12s infinite linear;
        }

        /* ─── LEO ROTATION (SWINGING LEGS) ─── */
        .success-leg-l-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .success-leg-l-group {
          animation: successLegLeftAnim 12s infinite ease-in-out;
        }
        .success-leg-r-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .success-leg-r-group {
          animation: successLegRightAnim 12s infinite ease-in-out;
        }
        .success-arm-l-group {
          transform-box: fill-box;
          transform-origin: 100% 0%;
        }
        .start-anim .success-arm-l-group {
          animation: successArmLeftAnim 12s infinite ease-in-out;
        }
        .success-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .success-arm-r-group {
          animation: successArmRightAnim 12s infinite ease-in-out;
        }
        
        .fail-leg-l-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .fail-leg-l-group {
          animation: failLegLeftAnim 12s infinite ease-in-out;
        }
        .fail-leg-r-group {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }
        .start-anim .fail-leg-r-group {
          animation: failLegRightAnim 12s infinite ease-in-out;
        }
        .fail-arm-l-group {
          transform-box: fill-box;
          transform-origin: 100% 0%;
        }
        .start-anim .fail-arm-l-group {
          animation: failArmLeftAnim 12s infinite ease-in-out;
        }
        .fail-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .fail-arm-r-group {
          animation: failArmRightAnim 12s infinite ease-in-out;
        }
        
        .guard-group {
          transform-box: fill-box;
        }
        .guard-arm-r-group {
          transform-box: fill-box;
          transform-origin: 0% 0%;
        }
        .start-anim .guard-arm-r-group {
          animation: guardArmRightAnim 12s infinite ease-in-out;
        }

        /* ─── DROP & ROLL DYNAMIC PHYSICS ─── */
        .fail-box-group {
          transform-box: fill-box;
          transform-origin: center;
        }
        .start-anim .fail-box-group {
          animation: failBoxAnim 12s infinite ease-in-out;
        }
        
        .start-anim .fail-face-happy {
          animation: failFaceHappyTimeline 12s infinite;
        }
        .start-anim .fail-face-sad {
          animation: failFaceSadTimeline 12s infinite;
        }
        
        /* ─── BUBBLE TEXT DISPLAY ─── */
        .pop-success-text {
          transform-origin: center;
        }
        .start-anim .pop-success-text {
          animation: popSuccessTimeline 12s infinite ease-in-out;
        }
        .pop-fail-text {
          transform-origin: center;
        }
        .start-anim .pop-fail-text {
          animation: popFailTimeline 12s infinite ease-in-out;
        }
        
        /* ─── DETECTOR LIGHTS ─── */
        .start-anim .scanner-light {
          animation: scannerLightTimeline 12s infinite;
        }
        .laser-beam-timeline {
          transform-origin: top center;
        }
        .start-anim .laser-beam-timeline {
          animation: laserScanTimeline 12s infinite ease-in-out;
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
        
        /* 1. Scrolling Dashed Yellow Road Markings */
        @keyframes roadScroll {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -30; }
        }
        .road-dashed-line {
          animation: roadScroll 0.8s linear infinite;
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
          0%, 72%, 100% { transform: translateX(-4px); opacity: 0; }
          75% { opacity: 1; transform: translateX(0px); }
          78% { opacity: 1; transform: translateX(5px); }
          82% { opacity: 0; transform: translateX(9px); }
        }
        .glasses-glare {
          animation: glareSlide 12s infinite ease-in-out;
        }

        /* ─── KEYFRAME DATA ─── */
        @keyframes successWalkRun {
          0% { transform: translate(-100px, 0px); }
          2.08% { transform: translate(-50px, -1px); }
          4.16% { transform: translate(0px, 0px); }
          6.25% { transform: translate(50px, -1px); }
          8.33% { transform: translate(100px, 0px); }
          10.4% { transform: translate(150px, -1px); }
          12.5% { transform: translate(200px, 0px); }
          14.5% { transform: translate(250px, -1px); }
          16.6% { transform: translate(300px, 0px); }
          18.7% { transform: translate(350px, -1px); }
          20.8% { transform: translate(400px, 0px); }
          22.9% { transform: translate(450px, -1px); }
          25% { transform: translate(500px, 0px); }
          35% { transform: translate(500px, 0px); }
          36.25% { transform: translate(500px, -6px); }
          37.5% { transform: translate(500px, 0px); }
          38.75% { transform: translate(500px, -6px); }
          40% { transform: translate(500px, 0px); }
          41.6% { transform: translate(600px, -1px); }
          43.3% { transform: translate(700px, 0px); }
          45% { transform: translate(800px, -1px); }
          46.6% { transform: translate(900px, 0px); }
          48.3% { transform: translate(1000px, -1px); }
          50% { transform: translate(1100px, 0px); }
          100% { transform: translate(1100px, 0px); }
        }
        @keyframes failWalkSad {
          0% { transform: translate(-100px, 0px); }
          47.9% { transform: translate(-100px, 0px); }
          48% { transform: translate(-100px, 0px); }
          50.125% { transform: translate(-25px, -1px); }
          52.25% { transform: translate(50px, 0px); }
          54.375% { transform: translate(125px, -1px); }
          56.5% { transform: translate(200px, 0px); }
          58.625% { transform: translate(275px, -1px); }
          60.75% { transform: translate(350px, 0px); }
          62.875% { transform: translate(425px, -1px); }
          65% { transform: translate(500px, 0px); }
          79.9% { transform: translate(500px, 0px); }
          80% { transform: translate(500px, 0px) rotate(0deg); }
          82% { transform: translate(440px, -1px) rotate(-5deg); }
          84% { transform: translate(380px, 0px) rotate(-5deg); }
          86% { transform: translate(320px, -1px) rotate(-5deg); }
          88% { transform: translate(260px, 0px) rotate(-5deg); }
          90% { transform: translate(200px, -1px) rotate(-5deg); }
          92% { transform: translate(140px, 0px) rotate(-5deg); }
          94% { transform: translate(80px, -1px) rotate(-5deg); }
          96% { transform: translate(20px, 0px) rotate(-5deg); }
          98% { transform: translate(-40px, -1px) rotate(-5deg); opacity: 1; }
          100% { transform: translate(-100px, 0px) rotate(0deg); opacity: 0; }
        }

        /* Scared shaking schedule for shoplifter thief */
        @keyframes thiefScaredTimeline {
          0%, 74.9% { transform: scale(1) translate(0, 0) rotate(0deg); }
          75% { transform: scale(1.05) translate(-1px, 0px) rotate(-2deg); }
          76% { transform: scale(1.05) translate(1.5px, -1px) rotate(1.5deg); }
          77% { transform: scale(1.05) translate(-1.5px, 0.5px) rotate(-1.5deg); }
          78% { transform: scale(1.05) translate(1px, -1px) rotate(2deg); }
          79% { transform: scale(1.05) translate(-1px, 1px) rotate(-2deg); }
          80%, 100% { transform: scale(1) translate(0, 0) rotate(0deg); }
        }
        
        @keyframes successLegLeftAnim {
          0% { transform: rotate(0deg); }
          4.16% { transform: rotate(28deg); }
          8.33% { transform: rotate(-28deg); }
          12.5% { transform: rotate(28deg); }
          16.6% { transform: rotate(-28deg); }
          20.8% { transform: rotate(28deg); }
          25% { transform: rotate(0deg); }
          35% { transform: rotate(-10deg); }
          36.25% { transform: rotate(-20deg); }
          37.5% { transform: rotate(-10deg); }
          38.75% { transform: rotate(-20deg); }
          40% { transform: rotate(0deg); }
          43.3% { transform: rotate(45deg); }
          45% { transform: rotate(0deg); }
          46.6% { transform: rotate(-45deg); }
          48.3% { transform: rotate(0deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes successLegRightAnim {
          0% { transform: rotate(0deg); }
          4.16% { transform: rotate(-28deg); }
          8.33% { transform: rotate(28deg); }
          12.5% { transform: rotate(-28deg); }
          16.6% { transform: rotate(28deg); }
          20.8% { transform: rotate(-28deg); }
          25% { transform: rotate(0deg); }
          35% { transform: rotate(10deg); }
          36.25% { transform: rotate(20deg); }
          37.5% { transform: rotate(10deg); }
          38.75% { transform: rotate(20deg); }
          40% { transform: rotate(0deg); }
          43.3% { transform: rotate(-45deg); }
          45% { transform: rotate(0deg); }
          46.6% { transform: rotate(45deg); }
          48.3% { transform: rotate(0deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes successArmLeftAnim {
          0% { transform: rotate(0deg); }
          4.16% { transform: rotate(-20deg); }
          8.33% { transform: rotate(20deg); }
          12.5% { transform: rotate(-20deg); }
          16.6% { transform: rotate(20deg); }
          20.8% { transform: rotate(-20deg); }
          25% { transform: rotate(0deg); }
          35% { transform: rotate(-120deg); }
          36.25% { transform: rotate(-140deg); }
          37.5% { transform: rotate(-120deg); }
          38.75% { transform: rotate(-140deg); }
          40% { transform: rotate(-120deg); }
          41.6% { transform: translateY(-4px) rotate(-110deg); }
          43.3% { transform: translateY(-8px) rotate(-130deg); }
          45% { transform: translateY(-4px) rotate(-110deg); }
          46.6% { transform: translateY(-8px) rotate(-130deg); }
          48.3% { transform: translateY(-4px) rotate(-110deg); }
          50% { transform: translateY(0) rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes successArmRightAnim {
          0% { transform: rotate(0deg); }
          4.16% { transform: rotate(20deg); }
          8.33% { transform: rotate(-20deg); }
          12.5% { transform: rotate(20deg); }
          16.6% { transform: rotate(-20deg); }
          20.8% { transform: rotate(20deg); }
          25% { transform: rotate(0deg); }
          35% { transform: rotate(120deg); }
          36.25% { transform: rotate(140deg); }
          37.5% { transform: rotate(120deg); }
          38.75% { transform: rotate(140deg); }
          40% { transform: rotate(120deg); }
          41.6% { transform: translateY(-4px) rotate(110deg); }
          43.3% { transform: translateY(-8px) rotate(130deg); }
          45% { transform: translateY(-4px) rotate(110deg); }
          46.6% { transform: translateY(-8px) rotate(130deg); }
          48.3% { transform: translateY(-4px) rotate(110deg); }
          50% { transform: translateY(0) rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes failLegLeftAnim {
          0%, 47.9% { transform: rotate(0deg); }
          48% { transform: rotate(0deg); }
          52.25% { transform: rotate(22deg); }
          56.5% { transform: rotate(-22deg); }
          60.75% { transform: rotate(22deg); }
          65% { transform: rotate(0deg); }
          79.9% { transform: rotate(0deg); }
          80% { transform: rotate(0deg); }
          84% { transform: rotate(32deg); }
          86% { transform: rotate(0deg); }
          88% { transform: rotate(-32deg); }
          90% { transform: rotate(0deg); }
          92% { transform: rotate(32deg); }
          94% { transform: rotate(0deg); }
          96% { transform: rotate(-32deg); }
          98% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes failLegRightAnim {
          0%, 47.9% { transform: rotate(0deg); }
          48% { transform: rotate(0deg); }
          52.25% { transform: rotate(-22deg); }
          56.5% { transform: rotate(22deg); }
          60.75% { transform: rotate(-22deg); }
          65% { transform: rotate(0deg); }
          79.9% { transform: rotate(0deg); }
          80% { transform: rotate(0deg); }
          84% { transform: rotate(-32deg); }
          86% { transform: rotate(0deg); }
          88% { transform: rotate(32deg); }
          90% { transform: rotate(0deg); }
          92% { transform: rotate(-32deg); }
          94% { transform: rotate(0deg); }
          96% { transform: rotate(32deg); }
          98% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes failArmLeftAnim {
          0%, 47.9% { transform: rotate(0deg); }
          48%, 74.9% { transform: rotate(-120deg); }
          75% { transform: rotate(-145deg) translateY(-2px); }
          77% { transform: rotate(-135deg) translateY(-1px); }
          79% { transform: rotate(-145deg); }
          80% { transform: rotate(0deg); }
          84% { transform: rotate(-25deg); }
          88% { transform: rotate(25deg); }
          92% { transform: rotate(-25deg); }
          96% { transform: rotate(25deg); }
          98% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes failArmRightAnim {
          0%, 47.9% { transform: rotate(0deg); }
          48%, 74.9% { transform: rotate(120deg); }
          75% { transform: rotate(145deg) translateY(-2px); }
          77% { transform: rotate(135deg) translateY(-1px); }
          79% { transform: rotate(145deg); }
          80% { transform: rotate(0deg); }
          84% { transform: rotate(25deg); }
          88% { transform: rotate(-25deg); }
          92% { transform: rotate(25deg); }
          96% { transform: rotate(-25deg); }
          98% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }

        /* Box dropped & ROLLING/BOUNCING away on asphalt road */
        @keyframes failBoxAnim {
          0% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
          64.9% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
          /* Caught at 65%. Stays in hand shaking. */
          65%, 79.9% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
          /* Dropped at 80% - flies outwards/downwards */
          82% { transform: translate(50px, -20px) rotate(160deg); }
          /* Hits road at 84.5% (approx Y=15 lower than sidewalk hand height) */
          84.5% { transform: translate(110px, 16px) rotate(320deg); }
          /* First bounce */
          86% { transform: translate(140px, 2px) rotate(380deg); }
          /* Hits road again */
          87.5% { transform: translate(170px, 16px) rotate(440deg); }
          /* Second bounce (smaller) */
          89% { transform: translate(200px, 9px) rotate(480deg); }
          /* Settles and starts rolling/sliding with asphalt parallax velocity */
          90.5% { transform: translate(230px, 16px) rotate(520deg); }
          93% { transform: translate(300px, 16px) rotate(580deg); }
          96% { transform: translate(370px, 16px) rotate(640deg); opacity: 1; }
          98% { transform: translate(440px, 16px) rotate(700deg); opacity: 0.8; }
          100% { transform: translate(500px, 16px) rotate(760deg); opacity: 0; }
        }
        
        @keyframes failFaceHappyTimeline {
          0%, 74.9% { opacity: 1; }
          75%, 100% { opacity: 0; }
        }
        @keyframes failFaceSadTimeline {
          0%, 74.9% { opacity: 0; }
          75%, 100% { opacity: 1; }
        }
        
        @keyframes guardArmRightAnim {
          0%, 34.9% { transform: rotate(0deg); }
          35% { transform: rotate(-50deg); }
          37% { transform: rotate(-25deg); }
          39% { transform: rotate(-50deg); }
          41% { transform: rotate(-25deg); }
          42%, 74.9% { transform: rotate(0deg); }
          /* Caught shoplifter! Points angrily with security wand. */
          75% { transform: rotate(90deg); }
          77% { transform: rotate(70deg); }
          79% { transform: rotate(90deg); }
          81% { transform: rotate(70deg); }
          83% { transform: rotate(90deg); }
          85%, 100% { transform: rotate(0deg); }
        }
        
        @keyframes popSuccessTimeline {
          0%, 34.9% { transform: translate(500px, 20px) scale(0); opacity: 0; }
          35% { transform: translate(500px, 20px) scale(1.1) rotate(4deg); opacity: 1; }
          43% { transform: translate(500px, 15px) scale(1) rotate(-4deg); opacity: 1; }
          48% { transform: translate(500px, 10px) scale(0); opacity: 0; }
          100% { transform: translate(500px, 10px) scale(0); opacity: 0; }
        }
        @keyframes popFailTimeline {
          0%, 74.9% { transform: translate(500px, 20px) scale(0); opacity: 0; }
          75% { transform: translate(500px, 20px) scale(1.1) rotate(-4deg); opacity: 1; }
          82% { transform: translate(500px, 15px) scale(1) rotate(4deg); opacity: 1; }
          88% { transform: translate(500px, 10px) scale(0); opacity: 0; }
          100% { transform: translate(500px, 10px) scale(0); opacity: 0; }
        }
        
        @keyframes laserScanTimeline {
          0%, 24% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
          25% { fill: rgba(0, 191, 255, 0.3); opacity: 0.8; transform: scaleX(0.85); }
          30% { fill: rgba(0, 191, 255, 0.4); opacity: 0.9; transform: scaleX(1.15); }
          34% { fill: rgba(0, 191, 255, 0.3); opacity: 0.8; transform: scaleX(0.85); }
          35% { fill: rgba(0, 255, 148, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          39% { fill: rgba(0, 255, 148, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          40% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
          41%, 64% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
          65% { fill: rgba(0, 191, 255, 0.35); opacity: 0.8; transform: scaleX(0.85); }
          70% { fill: rgba(0, 191, 255, 0.4); opacity: 0.9; transform: scaleX(1.15); }
          74% { fill: rgba(0, 191, 255, 0.35); opacity: 0.8; transform: scaleX(0.85); }
          75% { fill: rgba(255, 49, 49, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          79% { fill: rgba(255, 49, 49, 0.3); opacity: 0.9; transform: scaleX(1.1); }
          80%, 100% { fill: rgba(0, 191, 255, 0.05); opacity: 0.12; transform: scaleX(0.5); }
        }
        
        @keyframes scannerLightTimeline {
          0%, 24% { fill: #333; }
          25%, 34% { fill: #00BFFF; filter: drop-shadow(0 0 3px #00BFFF); }
          35%, 39% { fill: #00FF94; filter: drop-shadow(0 0 5px #00FF94); }
          40%, 64% { fill: #333; }
          65%, 74% { fill: #00BFFF; filter: drop-shadow(0 0 3px #00BFFF); }
          75%, 79% { fill: #FF3131; filter: drop-shadow(0 0 5px #FF3131); }
          80%, 100% { fill: #333; }
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

        {/* 4. Concrete sidewalk path */}
        <rect x="0" y="72" width="1000" height="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
        <line x1="0" y1="82" x2="1000" y2="82" stroke="#64748b" strokeWidth="1.5" />

        {/* 5. Asphalt Road */}
        <rect x="0" y="82" width="1000" height="18" fill="#1b1c20" />
        <line x1="0" y1="91" x2="1000" y2="91" stroke="#eab308" strokeWidth="1" strokeDasharray="15 15" className="road-dashed-line" />

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
              </g>
            </g>
          </g>
        </g>

        {/* ─── SECURITY GUARD / BOUNCER ─── */}
        <g className="guard-group" transform="translate(535, 50)">
          {/* Trousers */}
          <line x1="-3" y1="7" x2="-3" y2="21" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="-3" y1="7" x2="-3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="3" y1="7" x2="3" y2="21" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="3" y1="7" x2="3" y2="21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M-7,20 L-2,20 C-1,20 -1,23 -3,23 L-7,23 Z" fill="#0f172a" stroke="#000" strokeWidth="1.2" />
          <path d="M-1,20 L4,20 C5,20 5,23 3,23 L-1,23 Z" fill="#0f172a" stroke="#000" strokeWidth="1.2" />
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
