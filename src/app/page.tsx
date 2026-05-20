import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPacks, getPresets, getPacksBySeries } from '@/app/browse/actions'
import { ArrowRight, Zap, ShieldCheck, Music, Sparkles } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { HomePacks } from '@/components/HomePacks'
import { ArtistTestimonials } from '@/components/ArtistTestimonials'
import { TrustpilotBadge } from '@/components/TrustpilotBadge'
import { PresetCard } from '@/components/PresetCard'
import { HeroSlider } from '@/components/HeroSlider'


import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: "Samples Wala | Premium Indian Sample Packs & Loops",
  description: "Download high-quality Indian sample packs, loops, and curated collections for Bollywood, Hip-Hop, and Electronic music. 100% royalty-free.",
  path: '/'
})

export default async function HomePage() {
  const [packs, presets, indiaJourneyPacks] = await Promise.all([
    getPacks(4),
    getPresets(4),
    getPacksBySeries('India Journey', 4)
  ])

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Samples Wala",
    "url": "https://sampleswala.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sampleswala.com/browse?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Samples Wala",
    "url": "https://sampleswala.com",
    "logo": "https://sampleswala.com/logo.png",
    "sameAs": [
      "https://instagram.com/sampleswala",
      "https://youtube.com/sampleswala"
    ]
  }

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Epic Hero Section */}
      <section className="relative min-h-[90dvh] flex flex-col justify-center overflow-hidden border-b border-white/5 bg-black pt-28 pb-16">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-studio-yellow/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-studio-neon/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 z-0" />

        <div className="container mx-auto px-4 relative z-30 space-y-10">
          
          {/* Epic-Style Header Row */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-3 text-center lg:text-left relative">
              <div className="inline-block px-4 py-1 bg-studio-red text-white font-black uppercase text-[9px] tracking-[0.3em] shadow-[3px_3px_0px_black] border-2 border-black rotate-[-1.5deg] mb-1">
                OFFICIALLY LAUNCHED!
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white comic-text">
                SAMPLES<span className="text-studio-yellow italic">WALA</span>
              </h1>
              <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-xl leading-normal border-l-2 border-studio-blue pl-3">
                Premium Indian sample packs, presets & synthesizers. Built for the creative community.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <HeroSearch />
            </div>
          </div>

          {/* Custom Interactive Epic Games Slider */}
          <HeroSlider packs={packs} />

        </div>
      </section>

      {/* The India Journey Series Showcase */}
      <div className="relative">
        {/* Top Separator: tricolor + Indian scenery + railroad + forward-moving steam train */}
        <div className="w-full relative overflow-hidden">
          {/* Train Animation CSS */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes trainForward {
              0% { transform: translateX(-300px); }
              100% { transform: translateX(calc(100vw + 100px)); }
            }
            @keyframes wheelSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes crankPush {
              0% { transform: translateX(0); }
              25% { transform: translateX(2px) translateY(-1px); }
              50% { transform: translateX(0); }
              75% { transform: translateX(-2px) translateY(1px); }
              100% { transform: translateX(0); }
            }
            @keyframes pistonMove {
              0% { transform: scaleX(1); }
              50% { transform: scaleX(0.82); }
              100% { transform: scaleX(1); }
            }
            @keyframes smokeTrail {
              0% { opacity: 0.85; transform: translate(0,0) scale(0.5); }
              50% { opacity: 0.35; transform: translate(-20px,-14px) scale(1.6); }
              100% { opacity: 0; transform: translate(-45px,-28px) scale(2.8); }
            }
            .train-go {
              animation: trainForward 16s linear infinite;
            }
            .whl {
              transform-origin: center;
              animation: wheelSpin 0.7s linear infinite;
            }
            .crank {
              animation: crankPush 0.35s ease-in-out infinite;
            }
            .piston {
              transform-origin: left center;
              animation: pistonMove 0.35s ease-in-out infinite;
            }
            .sm1 { animation: smokeTrail 1.1s ease-out infinite; }
            .sm2 { animation: smokeTrail 1.4s ease-out infinite 0.35s; }
            .sm3 { animation: smokeTrail 1.8s ease-out infinite 0.7s; }
            .sm4 { animation: smokeTrail 2.2s ease-out infinite 1.1s; }
          `}} />

          {/* Tricolor stripe */}
          <div className="h-1 bg-[#F5F0E8]" />
          <div className="flex h-[3px]">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#128807]" />
          </div>

          {/* Scenery + Railroad Area */}
          <div className="h-16 bg-gradient-to-b from-[#e8dfd0] to-[#F5F0E8] relative overflow-hidden">

            {/* Indian Scenery Silhouettes (static background) */}
            <svg className="absolute bottom-[14px] left-0 w-full h-[38px]" viewBox="0 0 1600 38" preserveAspectRatio="none" fill="none">
              {/* Coconut trees */}
              <line x1="60" y1="38" x2="60" y2="10" stroke="#c4b8a0" strokeWidth="1.5"/>
              <ellipse cx="54" cy="10" rx="8" ry="5" fill="#b5a88e"/>
              <ellipse cx="66" cy="8" rx="7" ry="4" fill="#b5a88e"/>
              <ellipse cx="58" cy="6" rx="6" ry="4" fill="#c4b8a0"/>

              <line x1="340" y1="38" x2="340" y2="8" stroke="#c4b8a0" strokeWidth="1.5"/>
              <ellipse cx="334" cy="8" rx="7" ry="4" fill="#b5a88e"/>
              <ellipse cx="346" cy="6" rx="8" ry="5" fill="#b5a88e"/>
              <ellipse cx="338" cy="4" rx="6" ry="4" fill="#c4b8a0"/>

              <line x1="1200" y1="38" x2="1200" y2="9" stroke="#c4b8a0" strokeWidth="1.5"/>
              <ellipse cx="1194" cy="9" rx="7" ry="4" fill="#b5a88e"/>
              <ellipse cx="1206" cy="7" rx="8" ry="5" fill="#b5a88e"/>
              <ellipse cx="1198" cy="5" rx="6" ry="4" fill="#c4b8a0"/>

              {/* Village Hut */}
              <rect x="140" y="22" width="20" height="16" fill="#c4b8a0"/>
              <polygon points="135,22 150,10 165,22" fill="#b5a88e"/>
              <rect x="147" y="28" width="6" height="10" fill="#a89880"/>

              {/* Temple / Mandir */}
              <rect x="480" y="18" width="16" height="20" fill="#c4b8a0"/>
              <polygon points="478,18 488,6 498,18" fill="#b5a88e"/>
              <line x1="488" y1="2" x2="488" y2="6" stroke="#c4b8a0" strokeWidth="1"/>
              <circle cx="488" cy="2" r="1.5" fill="#d4c9b8"/>
              <rect x="484" y="24" width="8" height="3" fill="#b5a88e"/>

              {/* Urban Buildings */}
              <rect x="700" y="16" width="14" height="22" fill="#c4b8a0"/>
              <rect x="716" y="20" width="12" height="18" fill="#b5a88e"/>
              <rect x="730" y="12" width="10" height="26" fill="#c4b8a0"/>
              <rect x="703" y="18" width="3" height="3" fill="#d4c9b8"/>
              <rect x="703" y="24" width="3" height="3" fill="#d4c9b8"/>
              <rect x="708" y="18" width="3" height="3" fill="#d4c9b8"/>
              <rect x="719" y="23" width="3" height="3" fill="#d4c9b8"/>
              <rect x="719" y="28" width="3" height="3" fill="#d4c9b8"/>
              <rect x="733" y="15" width="3" height="3" fill="#d4c9b8"/>
              <rect x="733" y="21" width="3" height="3" fill="#d4c9b8"/>

              {/* More coconut trees */}
              <line x1="900" y1="38" x2="900" y2="11" stroke="#c4b8a0" strokeWidth="1.5"/>
              <ellipse cx="894" cy="11" rx="7" ry="4" fill="#b5a88e"/>
              <ellipse cx="906" cy="9" rx="8" ry="5" fill="#b5a88e"/>

              {/* Mosque / Dome */}
              <rect x="1020" y="20" width="18" height="18" fill="#c4b8a0"/>
              <ellipse cx="1029" cy="20" rx="9" ry="7" fill="#b5a88e"/>
              <line x1="1029" y1="10" x2="1029" y2="13" stroke="#c4b8a0" strokeWidth="0.8"/>
              <circle cx="1029" cy="10" r="1.2" fill="#d4c9b8"/>

              {/* Village hut 2 */}
              <rect x="1380" y="24" width="18" height="14" fill="#c4b8a0"/>
              <polygon points="1376,24 1389,13 1402,24" fill="#b5a88e"/>

              {/* Gateway / Arch */}
              <rect x="1500" y="14" width="4" height="24" fill="#c4b8a0"/>
              <rect x="1530" y="14" width="4" height="24" fill="#c4b8a0"/>
              <rect x="1498" y="12" width="38" height="4" rx="1" fill="#b5a88e"/>
              <ellipse cx="1517" cy="14" rx="14" ry="8" fill="none" stroke="#c4b8a0" strokeWidth="1"/>
            </svg>

            {/* Static Railroad Ties (wooden sleepers) */}
            <svg className="absolute bottom-0 left-0 w-full h-[14px]" preserveAspectRatio="none">
              <defs>
                <pattern id="staticTies" x="0" y="0" width="40" height="14" patternUnits="userSpaceOnUse">
                  <rect x="14" y="4" width="12" height="5" rx="0.5" fill="#b5956a" stroke="#8b7355" strokeWidth="0.5"/>
                  <line x1="16" y1="5.5" x2="24" y2="5.5" stroke="#a08060" strokeWidth="0.3"/>
                  <line x1="15" y1="7.5" x2="25" y2="7.5" stroke="#a08060" strokeWidth="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="14" fill="url(#staticTies)"/>
            </svg>

            {/* Steel Rails (static) */}
            <div className="absolute bottom-[3px] left-0 w-full h-[2px] bg-[#999] shadow-[0_1px_0_#777]" />
            <div className="absolute bottom-[9px] left-0 w-full h-[2px] bg-[#999] shadow-[0_1px_0_#777]" />

            {/* === ANIMATED TRAIN (faces RIGHT, moves LEFT→RIGHT) === */}
            <div className="train-go absolute bottom-[0px] left-0 z-20" style={{ willChange: 'transform' }}>

              {/* Smoke trailing behind (to the left) */}
              <svg className="absolute" style={{ top: '-26px', right: '60px' }} width="70" height="32" viewBox="0 0 70 32" fill="none">
                <circle className="sm1" cx="58" cy="26" r="3.5" fill="#bbb" opacity="0.7"/>
                <circle className="sm2" cx="45" cy="20" r="4.5" fill="#aaa" opacity="0.5"/>
                <circle className="sm3" cx="28" cy="12" r="5.5" fill="#999" opacity="0.35"/>
                <circle className="sm4" cx="10" cy="5" r="5" fill="#888" opacity="0.2"/>
              </svg>

              {/* Train SVG — FLIPPED so front faces RIGHT */}
              <svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* === INDIA JOURNEY CART (behind, left side) === */}
                <rect x="2" y="10" width="36" height="16" rx="1.5" fill="#777" stroke="#555" strokeWidth="0.8"/>
                <rect x="4" y="12" width="32" height="12" rx="1" fill="#666" stroke="#555" strokeWidth="0.5"/>
                {/* "INDIA JOURNEY" text on cart */}
                <text x="20" y="17" textAnchor="middle" fill="#FF9933" fontSize="4" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">INDIA</text>
                <text x="20" y="22" textAnchor="middle" fill="#128807" fontSize="3.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">JOURNEY</text>

                {/* Cart wheels */}
                <g className="whl" style={{ transformOrigin: '12px 28px' }}>
                  <circle cx="12" cy="28" r="3.5" fill="#555" stroke="#333" strokeWidth="0.7"/>
                  <line x1="12" y1="24.5" x2="12" y2="31.5" stroke="#777" strokeWidth="0.5"/>
                  <line x1="8.5" y1="28" x2="15.5" y2="28" stroke="#777" strokeWidth="0.5"/>
                  <circle cx="12" cy="28" r="1" fill="#888"/>
                </g>
                <g className="whl" style={{ transformOrigin: '30px 28px' }}>
                  <circle cx="30" cy="28" r="3.5" fill="#555" stroke="#333" strokeWidth="0.7"/>
                  <line x1="30" y1="24.5" x2="30" y2="31.5" stroke="#777" strokeWidth="0.5"/>
                  <line x1="26.5" y1="28" x2="33.5" y2="28" stroke="#777" strokeWidth="0.5"/>
                  <circle cx="30" cy="28" r="1" fill="#888"/>
                </g>

                {/* === COUPLING === */}
                <rect x="38" y="22" width="6" height="2" rx="0.5" fill="#888"/>

                {/* === LOCOMOTIVE (front faces RIGHT) === */}
                {/* Cabin */}
                <rect x="44" y="6" width="20" height="20" rx="1" fill="#777" stroke="#555" strokeWidth="0.8"/>
                <rect x="47" y="9" width="6" height="6" rx="0.5" fill="#b0c4de" stroke="#555" strokeWidth="0.5"/>
                <rect x="55" y="9" width="5" height="6" rx="0.5" fill="#b0c4de" stroke="#555" strokeWidth="0.5"/>
                {/* Cabin roof */}
                <rect x="42" y="3" width="24" height="4" rx="1" fill="#666" stroke="#444" strokeWidth="0.6"/>

                {/* Boiler */}
                <rect x="64" y="10" width="44" height="16" rx="5" fill="#888" stroke="#555" strokeWidth="0.8"/>
                {/* Boiler rings */}
                <rect x="74" y="10" width="1.5" height="16" fill="#777" rx="0.5"/>
                <rect x="86" y="10" width="1.5" height="16" fill="#777" rx="0.5"/>
                <rect x="98" y="10" width="1.5" height="16" fill="#777" rx="0.5"/>
                {/* Steam dome */}
                <ellipse cx="82" cy="10" rx="5" ry="3.5" fill="#999" stroke="#666" strokeWidth="0.5"/>

                {/* Chimney / Smokestack (near front-right) */}
                <rect x="100" y="2" width="7" height="10" rx="1" fill="#666" stroke="#444" strokeWidth="0.6"/>
                <rect x="98" y="0" width="11" height="3.5" rx="1.5" fill="#777" stroke="#555" strokeWidth="0.6"/>

                {/* Headlight (front-right) */}
                <circle cx="112" cy="14" r="2.5" fill="#FFD700" stroke="#b8860b" strokeWidth="0.5" opacity="0.9"/>

                {/* Cow catcher / pilot (front-right) */}
                <polygon points="108,26 116,14 116,26" fill="#888" stroke="#666" strokeWidth="0.6"/>

                {/* === WHEELS WITH SPOKES (engine) === */}
                <g className="whl" style={{ transformOrigin: '72px 28px' }}>
                  <circle cx="72" cy="28" r="4" fill="#555" stroke="#333" strokeWidth="0.8"/>
                  <line x1="72" y1="24" x2="72" y2="32" stroke="#777" strokeWidth="0.6"/>
                  <line x1="68" y1="28" x2="76" y2="28" stroke="#777" strokeWidth="0.6"/>
                  <line x1="69.2" y1="25.2" x2="74.8" y2="30.8" stroke="#777" strokeWidth="0.5"/>
                  <line x1="74.8" y1="25.2" x2="69.2" y2="30.8" stroke="#777" strokeWidth="0.5"/>
                  <circle cx="72" cy="28" r="1.2" fill="#888" stroke="#555" strokeWidth="0.4"/>
                </g>
                <g className="whl" style={{ transformOrigin: '86px 28px' }}>
                  <circle cx="86" cy="28" r="4" fill="#555" stroke="#333" strokeWidth="0.8"/>
                  <line x1="86" y1="24" x2="86" y2="32" stroke="#777" strokeWidth="0.6"/>
                  <line x1="82" y1="28" x2="90" y2="28" stroke="#777" strokeWidth="0.6"/>
                  <line x1="83.2" y1="25.2" x2="88.8" y2="30.8" stroke="#777" strokeWidth="0.5"/>
                  <line x1="88.8" y1="25.2" x2="83.2" y2="30.8" stroke="#777" strokeWidth="0.5"/>
                  <circle cx="86" cy="28" r="1.2" fill="#888" stroke="#555" strokeWidth="0.4"/>
                </g>
                <g className="whl" style={{ transformOrigin: '100px 28px' }}>
                  <circle cx="100" cy="28" r="4" fill="#555" stroke="#333" strokeWidth="0.8"/>
                  <line x1="100" y1="24" x2="100" y2="32" stroke="#777" strokeWidth="0.6"/>
                  <line x1="96" y1="28" x2="104" y2="28" stroke="#777" strokeWidth="0.6"/>
                  <line x1="97.2" y1="25.2" x2="102.8" y2="30.8" stroke="#777" strokeWidth="0.5"/>
                  <line x1="102.8" y1="25.2" x2="97.2" y2="30.8" stroke="#777" strokeWidth="0.5"/>
                  <circle cx="100" cy="28" r="1.2" fill="#888" stroke="#555" strokeWidth="0.4"/>
                </g>

                {/* Connecting rod / crank between drive wheels */}
                <g className="crank">
                  <line x1="72" y1="28" x2="100" y2="28" stroke="#aaa" strokeWidth="1.3"/>
                </g>

                {/* Piston rod */}
                <g className="piston">
                  <rect x="104" y="20" width="12" height="2.5" rx="0.5" fill="#aaa" stroke="#888" strokeWidth="0.4"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="h-[1px] bg-[#c9bfa8]" />
        </div>
      </div>
      <section className="py-28 relative overflow-hidden bg-[#0d0d0d] select-none">
        
        {/* Comic Halftone & Graffiti Backdrop */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Splashes of India Flag Colors (Graffiti style) */}
        {/* Saffron Splat */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#FF9933]/15 blur-[80px] rounded-[30%_70%_70%_30%] rotate-[15deg] pointer-events-none" />
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#FF9933]/10 rounded-full blur-[20px] -rotate-12 pointer-events-none" />
        {/* White Center Glow */}
        <div className="absolute top-[20%] left-[30%] w-[35%] h-[50%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
        {/* Green Splat */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[60%] bg-[#128807]/15 blur-[80px] rounded-[70%_30%_50%_50%] -rotate-[12deg] pointer-events-none" />
        <div className="absolute bottom-16 right-20 w-32 h-32 bg-[#128807]/10 rounded-full blur-[30px] rotate-45 pointer-events-none" />

        {/* Ashoka Blue / Indigo Accents */}
        <div className="absolute top-[40%] left-[45%] w-48 h-48 bg-[#000080]/15 blur-[60px] rounded-full pointer-events-none animate-pulse" />

        {/* Background Image (User Map) mixed in */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://imagizer.imageshack.com/v2/1200x800q90/924/42PWtN.png"
            alt="India Journey Map"
            fill
            className="object-cover opacity-20 mix-blend-screen pointer-events-none select-none"
            unoptimized
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8 border-b-4 border-black pb-8">
            <div className="space-y-4">
              
              {/* India Colors Themed Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black border-2 border-black shadow-[4px_4px_0px_#FF9933] rotate-[-1.5deg]">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  AUTHENTIC <span className="text-[#FF9933]">INDIAN</span> <span className="text-white">FOLK</span> &amp; <span className="text-[#128807]">BEATS</span>
                </span>
              </div>

              {/* Graffiti Title */}
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text">
                <span className="text-[#FF9933] drop-shadow-[4px_4px_0px_#000]">INDIA</span>{' '}
                <span className="text-[#128807] drop-shadow-[4px_4px_0px_#000]">JOURNEY</span>
              </h2>
              
              <p className="text-sm font-bold text-white uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2">
                <span className="text-[#FF9933]">EXPLORE</span>
                <span className="text-white/40">EVERY REGION SOUND OF</span>
                <span className="text-[#128807]">INDIA</span>
              </p>
            </div>
            
            {/* Explore Button with India Colors Shadow */}
            <Link 
              href="/series/india-journey" 
              className="px-10 py-4 border-4 border-black bg-white text-black hover:bg-studio-yellow transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 group shadow-[8px_8px_0px_rgba(255,153,51,1)] hover:shadow-[8px_8px_0px_rgba(18,136,7,1)] hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Explore Series
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform text-[#000080]" />
            </Link>
          </div>

          {/* Cards Container with drop shadow and border */}
          <div className="relative z-20">
            <HomePacks packs={indiaJourneyPacks.slice(0, 4)} />
          </div>
        </div>
      </section>
      {/* Bottom Separator: cream border + tricolor stripe */}
      <div className="w-full">
        <div className="h-1.5 bg-[#F5F0E8]" />
        <div className="flex h-[3px]">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#128807]" />
        </div>
        <div className="h-1.5 bg-[#F5F0E8]" />
      </div>

      {/* Featured Packs - Hidden for now
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Trending <span className="text-studio-neon">Collections</span></h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Top rated by industry veterans</p>
          </div>
          <Link href="/browse" className="text-[10px] font-black text-white/40 uppercase hover:text-studio-neon transition-colors flex items-center gap-2">
            View All
            <ArrowRight size={12} />
          </Link>
        </div>

        <HomePacks packs={packs.slice(0, 4)} />
      </section>
      */}

      {/* Featured Presets */}
      <section className="py-24 bg-studio-charcoal/30 border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio-neon text-black text-[10px] font-black uppercase tracking-widest jagged-border -rotate-1">
                <Sparkles size={12} fill="currentColor" />
                Vocal Chains & Mix Presets
              </div>
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                PRODUCER <span className="text-studio-neon">PRESETS</span>
              </h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em]">Professional FL Studio & DAW Chains</p>
            </div>
            <Link 
              href="/browse?type=presets" 
              className="px-8 py-3 border-2 border-white/10 hover:border-studio-neon hover:text-studio-neon transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
            >
              Explore Presets
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {presets.slice(0, 4).map((preset: any) => (
              <PresetCard key={preset.id} preset={preset} />
            ))}
          </div>
        </div>
      </section>

      <ArtistTestimonials />

      {/* Trust Section */}
      <section className="pt-24 pb-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-studio-neon/[0.02] blur-[120px] -z-10" />

        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center space-y-4 relative">
            <div className="splatter-effect bg-studio-blue/20 -top-10 left-1/2 -translate-x-1/2" />
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-black uppercase italic tracking-tighter comic-text text-white break-words">
              USED BY 500+ ARTISTS
            </h2>
            <div className="h-1.5 md:h-2 bg-studio-neon w-16 md:w-24 mx-auto border-2 border-black shadow-[4px_4px_0px_black]" />
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-12">
            <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left p-2 md:p-8 bg-studio-red border-2 md:border-4 border-black shadow-[3px_3px_0px_black] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 md:hover:-translate-y-2 transition-all group">
              <div className="h-6 w-6 md:h-12 md:w-12 bg-white flex items-center justify-center rounded-sm mx-auto md:mx-0 border-2 border-black shadow-[2px_2px_0px_black] md:shadow-[3px_3px_0px_black]">
                <ShieldCheck className="text-black w-3 h-3 md:w-4 md:h-4" />
              </div>
              <h3 className="text-[7px] md:text-lg font-black uppercase tracking-widest text-black leading-tight">Royalty Free</h3>
              <p className="hidden md:block text-[11px] text-black font-bold uppercase leading-relaxed tracking-[0.1em]">
                All sounds are 100% royalty-free for commercial use. Keep all your royalties.
              </p>
            </div>
            <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left p-2 md:p-8 bg-studio-yellow border-2 md:border-4 border-black shadow-[3px_3px_0px_black] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 md:hover:-translate-y-2 transition-all group">
              <div className="h-6 w-6 md:h-12 md:w-12 bg-white flex items-center justify-center rounded-sm mx-auto md:mx-0 border-2 border-black shadow-[2px_2px_0px_black] md:shadow-[3px_3px_0px_black]">
                <Zap className="text-black w-3 h-3 md:w-4 md:h-4" />
              </div>
              <h3 className="text-[7px] md:text-lg font-black uppercase tracking-widest text-black leading-tight">Instant</h3>
              <p className="hidden md:block text-[11px] text-black font-bold uppercase leading-relaxed tracking-[0.1em]">
                Digital delivery immediately after purchase. Start creating in seconds.
              </p>
            </div>
            <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left p-2 md:p-8 bg-studio-blue border-2 md:border-4 border-black shadow-[3px_3px_0px_black] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 md:hover:-translate-y-2 transition-all group">
              <div className="h-6 w-6 md:h-12 md:w-12 bg-white flex items-center justify-center rounded-sm mx-auto md:mx-0 border-2 border-black shadow-[2px_2px_0px_black] md:shadow-[3px_3px_0px_black]">
                <Music className="text-black w-3 h-3 md:w-4 md:h-4" />
              </div>
              <h3 className="text-[7px] md:text-lg font-black uppercase tracking-widest text-black leading-tight">High Quality</h3>
              <p className="hidden md:block text-[11px] text-black font-bold uppercase leading-relaxed tracking-[0.1em]">
                Professional audio files made for making hits and great music.
              </p>
            </div>
          </div>

          {/* Trustpilot Widget - Comic Verified Badge */}
          <TrustpilotBadge />

        </div>
      </section>

    </div>
  )
}
