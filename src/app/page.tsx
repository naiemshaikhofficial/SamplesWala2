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
        {/* Top Separator: tricolor + scrolling Indian scenery + railroad + forward-moving steam train */}
        <div className="w-full relative overflow-hidden">
          {/* Train Animation CSS */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --wheel-dur: 1.6s;
              --tender-wheel-dur: calc(var(--wheel-dur) * 0.5556);
              --chug-dur: calc(var(--wheel-dur) / 2);
              --scenery-far-dur: 110s;
              --scenery-mid-dur: 55s;
              --scenery-near-dur: 26s;
            }
            @media (max-width: 768px) {
              :root {
                --wheel-dur: 1.0s;
                --scenery-far-dur: 60s;
                --scenery-mid-dur: 30s;
                --scenery-near-dur: 14s;
              }
            }
            @keyframes wheelSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes sideRodMove {
              0% { transform: translate(4.5px, 0px); }
              25% { transform: translate(0px, 4.5px); }
              50% { transform: translate(-4.5px, 0px); }
              75% { transform: translate(0px, -4.5px); }
              100% { transform: translate(4.5px, 0px); }
            }
            @keyframes mainRodMove {
              0% { transform: translate(4.5px, 0px) rotate(0deg); }
              25% { transform: translate(0px, 4.5px) rotate(4deg); }
              50% { transform: translate(-4.5px, 0px) rotate(0deg); }
              75% { transform: translate(0px, -4.5px) rotate(-4deg); }
              100% { transform: translate(4.5px, 0px) rotate(0deg); }
            }
            @keyframes pistonSlider {
              0% { transform: translateX(4.5px); }
              50% { transform: translateX(-4.5px); }
              100% { transform: translateX(4.5px); }
            }
            @keyframes trainChug {
              0% { transform: translateY(0px) translateX(0px); }
              25% { transform: translateY(-0.6px) translateX(0.3px); }
              50% { transform: translateY(0px) translateX(0px); }
              75% { transform: translateY(0.6px) translateX(-0.3px); }
              100% { transform: translateY(0px) translateX(0px); }
            }
            @keyframes smokeTrail1 {
              0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
              15% { opacity: 0.85; transform: translate(-12px, -8px) scale(0.9); }
              50% { opacity: 0.45; transform: translate(-40px, -22px) scale(1.7); }
              100% { opacity: 0; transform: translate(-80px, -36px) scale(2.6); }
            }
            @keyframes smokeTrail2 {
              0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
              15% { opacity: 0.85; transform: translate(-12px, -8px) scale(0.9); }
              50% { opacity: 0.45; transform: translate(-40px, -22px) scale(1.7); }
              100% { opacity: 0; transform: translate(-80px, -36px) scale(2.6); }
            }
            @keyframes sceneryMove {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes trackScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-56.55px); }
            }
            .whl-large {
              transform-origin: center;
              animation: wheelSpin var(--wheel-dur) linear infinite;
            }
            .whl-tender {
              transform-origin: center;
              animation: wheelSpin var(--tender-wheel-dur) linear infinite;
            }
            .side-rod {
              animation: sideRodMove var(--wheel-dur) linear infinite;
            }
            .main-rod {
              transform-origin: 183px 34px;
              animation: mainRodMove var(--wheel-dur) linear infinite;
            }
            .piston-crosshead {
              animation: pistonSlider var(--wheel-dur) linear infinite;
            }
            .train-vibe {
              animation: trainChug var(--chug-dur) ease-in-out infinite;
            }
            .sm1 { animation: smokeTrail1 1.2s ease-out infinite; }
            .sm2 { animation: smokeTrail2 1.6s ease-out infinite 0.4s; }
            .sm3 { animation: smokeTrail1 2.0s ease-out infinite 0.8s; }
            .sm4 { animation: smokeTrail2 2.4s ease-out infinite 1.2s; }
            
            .scenery-scroll-far {
              animation: sceneryMove var(--scenery-far-dur) linear infinite;
            }
            .scenery-scroll-mid {
              animation: sceneryMove var(--scenery-mid-dur) linear infinite;
            }
            .scenery-scroll-near {
              animation: sceneryMove var(--scenery-near-dur) linear infinite;
            }
            .track-scroll {
              width: calc(100% + 56.55px);
              animation: trackScroll var(--wheel-dur) linear infinite;
            }
          `}} />

          {/* Tricolor stripe */}
          <div className="h-1 bg-[#F5F0E8]" />
          <div className="flex h-[3px]">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#128807]" />
          </div>

          {/* Scenery + Railroad Area */}
          <div className="h-20 bg-gradient-to-b from-[#e2d6c1] to-[#F5F0E8] relative overflow-hidden">

            {/* Layer 1: Far Parallax (Distant, Slowest) */}
            <div className="absolute bottom-[16px] left-0 h-[28px] flex w-[200%] scenery-scroll-far select-none pointer-events-none" style={{ willChange: 'transform' }}>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 28" preserveAspectRatio="none" fill="none">
                {/* Distant Hills / Mountains */}
                <path d="M0,28 L0,12 C100,6 180,24 280,18 C380,12 450,4 550,14 C650,24 750,8 850,16 C950,24 1050,6 1150,10 C1250,14 1350,22 1450,16 C1550,10 1600,14 1600,14 L1600,28 Z" fill="#e8ded0" opacity="0.6"/>
                {/* Soft Clouds */}
                <ellipse cx="150" cy="6" rx="20" ry="4" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="480" cy="4" rx="28" ry="5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="820" cy="8" rx="24" ry="4.5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="1180" cy="5" rx="30" ry="6" fill="#f0e9dd" opacity="0.5" />
              </svg>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 28" preserveAspectRatio="none" fill="none">
                <path d="M0,28 L0,12 C100,6 180,24 280,18 C380,12 450,4 550,14 C650,24 750,8 850,16 C950,24 1050,6 1150,10 C1250,14 1350,22 1450,16 C1550,10 1600,14 1600,14 L1600,28 Z" fill="#e8ded0" opacity="0.6"/>
                <ellipse cx="150" cy="6" rx="20" ry="4" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="480" cy="4" rx="28" ry="5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="820" cy="8" rx="24" ry="4.5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="1180" cy="5" rx="30" ry="6" fill="#f0e9dd" opacity="0.5" />
              </svg>
            </div>

            {/* Layer 2: Mid Parallax (Medium Speed) */}
            <div className="absolute bottom-[14px] left-0 h-[36px] flex w-[200%] scenery-scroll-mid select-none pointer-events-none" style={{ willChange: 'transform' }}>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 36" preserveAspectRatio="none" fill="none">
                {/* Village Hut 1 */}
                <rect x="80" y="20" width="22" height="16" fill="#d2c4aa"/>
                <polygon points="75,20 91,8 107,20" fill="#c3b59a"/>
                <rect x="88" y="26" width="6" height="10" fill="#b5a68c"/>

                {/* Mandir / Temple */}
                <rect x="260" y="16" width="18" height="20" fill="#d2c4aa"/>
                <polygon points="257,16 269,4 281,16" fill="#c3b59a"/>
                <line x1="269" y1="0" x2="269" y2="4" stroke="#d2c4aa" strokeWidth="1"/>
                <circle cx="269" cy="0" r="1.5" fill="#e1d4be"/>
                <rect x="265" y="22" width="8" height="4" fill="#c3b59a"/>

                {/* Taj Mahal Silhouette */}
                <g transform="translate(480, 8)">
                  <rect x="20" y="12" width="40" height="16" fill="#d2c4aa"/>
                  <ellipse cx="40" cy="12" rx="14" ry="11" fill="#c3b59a"/>
                  <line x1="40" y1="0" x2="40" y2="3" stroke="#d2c4aa" strokeWidth="0.8"/>
                  <circle cx="40" cy="0" r="1" fill="#e1d4be"/>
                  {/* Minarets */}
                  <rect x="8" y="4" width="4" height="24" fill="#d2c4aa"/>
                  <ellipse cx="10" cy="4" rx="3" ry="2.2" fill="#c3b59a"/>
                  <rect x="68" y="4" width="4" height="24" fill="#d2c4aa"/>
                  <ellipse cx="70" cy="4" rx="3" ry="2.2" fill="#c3b59a"/>
                </g>

                {/* Urban Cityscape */}
                <rect x="740" y="12" width="16" height="24" fill="#d2c4aa"/>
                <rect x="758" y="16" width="14" height="20" fill="#c3b59a"/>
                <rect x="774" y="8" width="12" height="28" fill="#d2c4aa"/>
                <rect x="744" y="15" width="3" height="3" fill="#e1d4be"/>
                <rect x="744" y="21" width="3" height="3" fill="#e1d4be"/>
                <rect x="763" y="20" width="3" height="3" fill="#e1d4be"/>
                <rect x="763" y="25" width="3" height="3" fill="#e1d4be"/>
                <rect x="778" y="12" width="3" height="3" fill="#e1d4be"/>
                <rect x="778" y="18" width="3" height="3" fill="#e1d4be"/>

                {/* Mosque Dome */}
                <rect x="980" y="16" width="22" height="20" fill="#d2c4aa"/>
                <ellipse cx="991" y="16" rx="11" ry="8" fill="#c3b59a"/>
                <line x1="991" y1="5" x2="991" y2="8" stroke="#d2c4aa" strokeWidth="0.8"/>
                <circle cx="991" cy="5" r="1.2" fill="#e1d4be"/>

                {/* Village Hut 2 */}
                <rect x="1150" y="22" width="20" height="14" fill="#d2c4aa"/>
                <polygon points="1146,22 1160,11 1174,22" fill="#c3b59a"/>

                {/* India Gate Gateway Arch */}
                <g transform="translate(1320, 6)">
                  <rect x="4" y="6" width="6" height="24" fill="#d2c4aa"/>
                  <rect x="34" y="6" width="6" height="24" fill="#d2c4aa"/>
                  <rect x="0" y="3" width="44" height="5" rx="1.2" fill="#c3b59a"/>
                  <ellipse cx="22" y="7" rx="14" ry="9" fill="none" stroke="#d2c4aa" strokeWidth="1.2"/>
                  <rect x="14" y="0" width="16" height="3" fill="#b5a68c"/>
                </g>
              </svg>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 36" preserveAspectRatio="none" fill="none">
                <rect x="80" y="20" width="22" height="16" fill="#d2c4aa"/>
                <polygon points="75,20 91,8 107,20" fill="#c3b59a"/>
                <rect x="88" y="26" width="6" height="10" fill="#b5a68c"/>

                <rect x="260" y="16" width="18" height="20" fill="#d2c4aa"/>
                <polygon points="257,16 269,4 281,16" fill="#c3b59a"/>
                <line x1="269" y1="0" x2="269" y2="4" stroke="#d2c4aa" strokeWidth="1"/>
                <circle cx="269" cy="0" r="1.5" fill="#e1d4be"/>
                <rect x="265" y="22" width="8" height="4" fill="#c3b59a"/>

                <g transform="translate(480, 8)">
                  <rect x="20" y="12" width="40" height="16" fill="#d2c4aa"/>
                  <ellipse cx="40" cy="12" rx="14" ry="11" fill="#c3b59a"/>
                  <line x1="40" y1="0" x2="40" y2="3" stroke="#d2c4aa" strokeWidth="0.8"/>
                  <circle cx="40" cy="0" r="1" fill="#e1d4be"/>
                  <rect x="8" y="4" width="4" height="24" fill="#d2c4aa"/>
                  <ellipse cx="10" cy="4" rx="3" ry="2.2" fill="#c3b59a"/>
                  <rect x="68" y="4" width="4" height="24" fill="#d2c4aa"/>
                  <ellipse cx="70" cy="4" rx="3" ry="2.2" fill="#c3b59a"/>
                </g>

                <rect x="740" y="12" width="16" height="24" fill="#d2c4aa"/>
                <rect x="758" y="16" width="14" height="20" fill="#c3b59a"/>
                <rect x="774" y="8" width="12" height="28" fill="#d2c4aa"/>
                <rect x="744" y="15" width="3" height="3" fill="#e1d4be"/>
                <rect x="744" y="21" width="3" height="3" fill="#e1d4be"/>
                <rect x="763" y="20" width="3" height="3" fill="#e1d4be"/>
                <rect x="763" y="25" width="3" height="3" fill="#e1d4be"/>
                <rect x="778" y="12" width="3" height="3" fill="#e1d4be"/>
                <rect x="778" y="18" width="3" height="3" fill="#e1d4be"/>

                <rect x="980" y="16" width="22" height="20" fill="#d2c4aa"/>
                <ellipse cx="991" y="16" rx="11" ry="8" fill="#c3b59a"/>
                <line x1="991" y1="5" x2="991" y2="8" stroke="#d2c4aa" strokeWidth="0.8"/>
                <circle cx="991" cy="5" r="1.2" fill="#e1d4be"/>

                <rect x="1150" y="22" width="20" height="14" fill="#d2c4aa"/>
                <polygon points="1146,22 1160,11 1174,22" fill="#c3b59a"/>

                <g transform="translate(1320, 6)">
                  <rect x="4" y="6" width="6" height="24" fill="#d2c4aa"/>
                  <rect x="34" y="6" width="6" height="24" fill="#d2c4aa"/>
                  <rect x="0" y="3" width="44" height="5" rx="1.2" fill="#c3b59a"/>
                  <ellipse cx="22" cy="7" rx="14" ry="9" fill="none" stroke="#d2c4aa" strokeWidth="1.2"/>
                  <rect x="14" y="0" width="16" height="3" fill="#b5a68c"/>
                </g>
              </svg>
            </div>

            {/* Layer 3: Near Parallax (Fastest Background) */}
            <div className="absolute bottom-[14px] left-0 h-[46px] flex w-[200%] scenery-scroll-near select-none pointer-events-none" style={{ willChange: 'transform' }}>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 46" preserveAspectRatio="none" fill="none">
                {/* Coconut Palms */}
                <g transform="translate(40, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>
                <g transform="translate(320, 0)">
                  <line x1="25" y1="46" x2="20" y2="6" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,6 Q8,8 0,12 M20,6 Q10,2 6,-4 M20,6 Q25,-1 33,-2 M20,6 Q28,6 38,9 M20,6 Q25,12 26,20" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="6" r="1.5" fill="#a99b82" />
                </g>
                
                {/* Telegraph / Electric Pole */}
                <g transform="translate(580, 4)">
                  <line x1="10" y1="42" x2="10" y2="0" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="2" y1="4" x2="18" y2="4" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="4" y1="8" x2="16" y2="8" stroke="#bcae95" strokeWidth="1"/>
                  <circle cx="4" cy="2" r="1" fill="#a99b82"/>
                  <circle cx="16" cy="2" r="1" fill="#a99b82"/>
                </g>

                <g transform="translate(860, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(1120, 0)">
                  <line x1="25" y1="46" x2="20" y2="8" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,8 Q8,10 0,14 M20,8 Q10,4 6,-2 M20,8 Q25,1 33,0 M20,8 Q28,8 38,11 M20,8 Q25,14 26,22" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="8" r="1.5" fill="#a99b82" />
                </g>

                {/* Fence posts */}
                <g transform="translate(1380, 26)">
                  <line x1="0" y1="20" x2="0" y2="0" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="30" y1="20" x2="30" y2="2" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="60" y1="20" x2="60" y2="0" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="0" y1="6" x2="60" y2="7" stroke="#a99b82" strokeWidth="0.8"/>
                  <line x1="0" y1="12" x2="60" y2="13" stroke="#a99b82" strokeWidth="0.8"/>
                </g>
              </svg>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 46" preserveAspectRatio="none" fill="none">
                <g transform="translate(40, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>
                <g transform="translate(320, 0)">
                  <line x1="25" y1="46" x2="20" y2="6" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,6 Q8,8 0,12 M20,6 Q10,2 6,-4 M20,6 Q25,-1 33,-2 M20,6 Q28,6 38,9 M20,6 Q25,12 26,20" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="6" r="1.5" fill="#a99b82" />
                </g>
                
                <g transform="translate(580, 4)">
                  <line x1="10" y1="42" x2="10" y2="0" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="2" y1="4" x2="18" y2="4" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="4" y1="8" x2="16" y2="8" stroke="#bcae95" strokeWidth="1"/>
                  <circle cx="4" cy="2" r="1" fill="#a99b82"/>
                  <circle cx="16" cy="2" r="1" fill="#a99b82"/>
                </g>

                <g transform="translate(860, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(1120, 0)">
                  <line x1="25" y1="46" x2="20" y2="8" stroke="#bcae95" strokeWidth="1.8"/>
                  <path d="M20,8 Q8,10 0,14 M20,8 Q10,4 6,-2 M20,8 Q25,1 33,0 M20,8 Q28,8 38,11 M20,8 Q25,14 26,22" stroke="#a99b82" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="8" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(1380, 26)">
                  <line x1="0" y1="20" x2="0" y2="0" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="30" y1="20" x2="30" y2="2" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="60" y1="20" x2="60" y2="0" stroke="#bcae95" strokeWidth="1.5"/>
                  <line x1="0" y1="6" x2="60" y2="7" stroke="#a99b82" strokeWidth="0.8"/>
                  <line x1="0" y1="12" x2="60" y2="13" stroke="#a99b82" strokeWidth="0.8"/>
                </g>
              </svg>
            </div>

            {/* Railroad Track (Scrolling perfectly in sync with wheel rotation) */}
            <div className="absolute bottom-0 left-0 h-[14px] track-scroll select-none pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <pattern id="movingTies" x="0" y="0" width="56.55" height="14" patternUnits="userSpaceOnUse">
                    {/* Sleeper 1 */}
                    <rect x="8" y="4" width="12" height="5" rx="0.5" fill="#bcaea0" stroke="#8c7d6e" strokeWidth="0.5"/>
                    <line x1="10" y1="5.5" x2="18" y2="5.5" stroke="#9e8f80" strokeWidth="0.3"/>
                    <line x1="9" y1="7.5" x2="19" y2="7.5" stroke="#9e8f80" strokeWidth="0.3"/>
                    {/* Sleeper 2 */}
                    <rect x="36" y="4" width="12" height="5" rx="0.5" fill="#bcaea0" stroke="#8c7d6e" strokeWidth="0.5"/>
                    <line x1="38" y1="5.5" x2="46" y2="5.5" stroke="#9e8f80" strokeWidth="0.3"/>
                    <line x1="37" y1="7.5" x2="47" y2="7.5" stroke="#9e8f80" strokeWidth="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="14" fill="url(#movingTies)"/>
              </svg>
            </div>

            {/* Steel Rails (static overlay on top of sleepers) */}
            <div className="absolute bottom-[3px] left-0 w-full h-[2px] bg-[#c3b6a2] shadow-[0_1px_0_#9c8e7a] opacity-90" />
            <div className="absolute bottom-[9px] left-0 w-full h-[2px] bg-[#c3b6a2] shadow-[0_1px_0_#9c8e7a] opacity-90" />

            {/* === ANIMATED TRAIN IN CINEMATIC TRACKING POSITION === */}
            <div className="absolute bottom-[3px] left-[8%] md:left-[18%] z-20 train-vibe" style={{ willChange: 'transform' }}>

              {/* Smoke trailing behind (to the left) */}
              <svg className="absolute" style={{ top: '-36px', left: '110px' }} width="120" height="42" viewBox="0 0 120 42" fill="none">
                <circle className="sm1" cx="65" cy="38" r="4.5" fill="#eeeeee" />
                <circle className="sm2" cx="65" cy="38" r="5.5" fill="#e6e6e6" />
                <circle className="sm3" cx="65" cy="38" r="7.0" fill="#dddddd" />
                <circle className="sm4" cx="65" cy="38" r="8.5" fill="#d0d0d0" />
              </svg>

              {/* Detailed High-Fidelity Steam Engine SVG */}
              <svg width="240" height="48" viewBox="0 0 240 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Firebox Glow */}
                  <radialGradient id="fireboxGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ff5500" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#ffaa00" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                  </radialGradient>
                  {/* Headlight Beam */}
                  <linearGradient id="headlightBeam" x1="0" y1="0.5" x2="1" y2="0.5">
                    <stop offset="0%" stopColor="#fff294" stopOpacity="0.55" />
                    <stop offset="25%" stopColor="#ffde6a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffde6a" stopOpacity="0" />
                  </linearGradient>
                  {/* Dark Metallic Steel */}
                  <linearGradient id="steelDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3c3d42" />
                    <stop offset="40%" stopColor="#25262a" />
                    <stop offset="85%" stopColor="#17181c" />
                    <stop offset="100%" stopColor="#0f1012" />
                  </linearGradient>
                  {/* Light Metallic Steel */}
                  <linearGradient id="steelLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#80858c" />
                    <stop offset="25%" stopColor="#abb1b8" />
                    <stop offset="60%" stopColor="#606469" />
                    <stop offset="100%" stopColor="#3c3d42" />
                  </linearGradient>
                  {/* Brass / Gold Details */}
                  <linearGradient id="brassGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffe477" />
                    <stop offset="30%" stopColor="#f7c00e" />
                    <stop offset="70%" stopColor="#ca9800" />
                    <stop offset="100%" stopColor="#8d6800" />
                  </linearGradient>
                </defs>

                {/* === LOCOMOTIVE HEADLIGHT GLOW BEAM === */}
                <polygon points="190,19 240,4 240,34" fill="url(#headlightBeam)" opacity="0.8" pointerEvents="none" />

                {/* === INDIA JOURNEY TENDER (Wood/Metal Carriage for Cart) === */}
                <rect x="5" y="14" width="58" height="22" rx="2" fill="url(#steelDark)" stroke="#111" strokeWidth="0.8"/>
                {/* Plaque backing */}
                <rect x="8" y="16" width="52" height="18" rx="1.5" fill="#1b1c20" stroke="#333" strokeWidth="0.5"/>
                {/* Plaque Gold Border */}
                <rect x="9" y="17" width="50" height="16" rx="1" fill="none" stroke="url(#brassGold)" strokeWidth="0.8"/>
                
                {/* Plaque Text - Elegant Tricolor Style */}
                <text x="34" y="24" textAnchor="middle" fill="#FF9933" fontSize="6.5" fontWeight="900" fontFamily="'Outfit', 'Inter', sans-serif" letterSpacing="0.8">INDIA</text>
                <text x="34" y="31" textAnchor="middle" fill="#128807" fontSize="5.5" fontWeight="900" fontFamily="'Outfit', 'Inter', sans-serif" letterSpacing="0.8">JOURNEY</text>

                {/* Tender Wheels Suspension leaf springs */}
                <path d="M12,36 Q20,32 28,36" stroke="#444" strokeWidth="1.2" fill="none" />
                <path d="M40,36 Q48,32 56,36" stroke="#444" strokeWidth="1.2" fill="none" />

                {/* Tender Wheels (r = 5, center y = 38 so bottom touches y = 43) */}
                <g className="whl-tender" style={{ transformOrigin: '20px 38px' }}>
                  <circle cx="20" cy="38" r="5" fill="#222" stroke="#444" strokeWidth="0.8"/>
                  <circle cx="20" cy="38" r="3.5" fill="none" stroke="#555" strokeWidth="0.6"/>
                  <line x1="20" y1="33" x2="20" y2="43" stroke="#555" strokeWidth="0.5" />
                  <line x1="15" y1="38" x2="25" y2="38" stroke="#555" strokeWidth="0.5" />
                  <circle cx="20" cy="38" r="1.5" fill="url(#brassGold)"/>
                </g>
                <g className="whl-tender" style={{ transformOrigin: '48px 38px' }}>
                  <circle cx="48" cy="38" r="5" fill="#222" stroke="#444" strokeWidth="0.8"/>
                  <circle cx="48" cy="38" r="3.5" fill="none" stroke="#555" strokeWidth="0.6"/>
                  <line x1="48" y1="33" x2="48" y2="43" stroke="#555" strokeWidth="0.5" />
                  <line x1="43" y1="38" x2="53" y2="38" stroke="#555" strokeWidth="0.5" />
                  <circle cx="48" cy="38" r="1.5" fill="url(#brassGold)"/>
                </g>

                {/* === COUPLING LINK === */}
                <rect x="63" y="28" width="8" height="2" rx="0.5" fill="#222" stroke="#444" strokeWidth="0.4"/>
                <circle cx="67" cy="29" r="1" fill="#444" />

                {/* === STEAM LOCOMOTIVE ENGINE === */}
                
                {/* Cab Firebox Window Glow Effect */}
                <rect x="76" y="8" width="28" height="28" rx="1.5" fill="url(#steelDark)" stroke="#111" strokeWidth="0.8"/>
                {/* Glow from within */}
                <rect x="80" y="12" width="10" height="10" rx="0.8" fill="url(#fireboxGlow)"/>
                <rect x="92" y="12" width="9" height="10" rx="0.8" fill="url(#fireboxGlow)"/>
                {/* Cabin silhouette of driver */}
                <path d="M83,22 Q86,16 88,18 Q89,20 86,22 Z" fill="#111" opacity="0.85" />
                {/* Gold Handrails on cabin */}
                <line x1="73" y1="12" x2="73" y2="34" stroke="url(#brassGold)" strokeWidth="0.6" />
                <line x1="105" y1="12" x2="105" y2="34" stroke="url(#brassGold)" strokeWidth="0.6" />
                {/* Cab Roof */}
                <path d="M72,8 L108,8 Q108,5 106,5 L74,5 Q72,5 72,8 Z" fill="url(#steelLight)" stroke="#333" strokeWidth="0.5"/>

                {/* Boiler Body */}
                <rect x="104" y="12" width="76" height="24" rx="1" fill="url(#steelDark)" stroke="#111" strokeWidth="0.8"/>
                {/* Boiler front dome cap (Smokebox) */}
                <path d="M180,12 L185,14 Q187,24 185,34 L180,36 Z" fill="#17181c" stroke="#111" strokeWidth="0.5" />

                {/* Shiny Brass/Gold Boiler Rings */}
                <rect x="122" y="11.5" width="2" height="25" fill="url(#brassGold)"/>
                <rect x="142" y="11.5" width="2" height="25" fill="url(#brassGold)"/>
                <rect x="162" y="11.5" width="2" height="25" fill="url(#brassGold)"/>

                {/* Sand Dome & Steam Dome (Gold/Brass) */}
                <path d="M130,12 Q130,5 135,5 Q140,5 140,12 Z" fill="url(#brassGold)" stroke="#977200" strokeWidth="0.5"/>
                <path d="M152,12 Q152,6 156,6 Q160,6 160,12 Z" fill="url(#brassGold)" stroke="#977200" strokeWidth="0.5"/>

                {/* Chimney / Smokestack with Gold Collar */}
                <rect x="171" y="2" width="8" height="10" fill="url(#steelDark)" stroke="#111" strokeWidth="0.5"/>
                <rect x="169" y="0" width="12" height="2.5" rx="0.5" fill="url(#brassGold)" stroke="#977200" strokeWidth="0.4"/>

                {/* Headlight (Volumetric Gold Lantern) */}
                <rect x="184" y="16" width="6" height="7" rx="0.5" fill="url(#brassGold)" stroke="#977200" strokeWidth="0.5"/>
                <circle cx="187" cy="19.5" r="2" fill="#fff" stroke="#ffdd6b" strokeWidth="0.6"/>

                {/* Cow Catcher (Grid-Style Pilot at Front) */}
                <polygon points="184,36 198,36 192,44 184,44" fill="#3c3d42" stroke="#111" strokeWidth="0.5"/>
                <line x1="187" y1="36" x2="187" y2="44" stroke="url(#brassGold)" strokeWidth="0.8" />
                <line x1="191" y1="36" x2="190" y2="44" stroke="url(#brassGold)" strokeWidth="0.8" />
                <line x1="195" y1="36" x2="193" y2="44" stroke="url(#brassGold)" strokeWidth="0.8" />

                {/* === GIANT DRIVE WHEELS (r = 9, center y = 34) === */}
                
                {/* Wheel 1 */}
                <g className="whl-large" style={{ transformOrigin: '110px 34px' }}>
                  <circle cx="110" cy="34" r="9" fill="#1b1c20" stroke="url(#steelLight)" strokeWidth="1.5"/>
                  {/* Heavy Steel Counterweight wedge */}
                  <path d="M101,34 A9,9 0 0,1 119,34 Z" fill="url(#steelDark)" opacity="0.85" />
                  {/* Spokes */}
                  <line x1="110" y1="25" x2="110" y2="43" stroke="#888" strokeWidth="0.5"/>
                  <line x1="101" y1="34" x2="119" y2="34" stroke="#888" strokeWidth="0.5"/>
                  <line x1="103.6" y1="27.6" x2="116.4" y2="40.4" stroke="#888" strokeWidth="0.5"/>
                  <line x1="116.4" y1="27.6" x2="103.6" y2="40.4" stroke="#888" strokeWidth="0.5"/>
                  {/* Brass Hub */}
                  <circle cx="110" cy="34" r="2.2" fill="url(#brassGold)" stroke="#222" strokeWidth="0.4"/>
                  {/* Crank Pin (placed at 3 o'clock initially for animation ease) */}
                  <circle cx="114.5" cy="34" r="1" fill="#fff" stroke="#111" strokeWidth="0.3"/>
                </g>

                {/* Wheel 2 */}
                <g className="whl-large" style={{ transformOrigin: '135px 34px' }}>
                  <circle cx="135" cy="34" r="9" fill="#1b1c20" stroke="url(#steelLight)" strokeWidth="1.5"/>
                  <path d="M126,34 A9,9 0 0,1 144,34 Z" fill="url(#steelDark)" opacity="0.85" />
                  <line x1="135" y1="25" x2="135" y2="43" stroke="#888" strokeWidth="0.5"/>
                  <line x1="126" y1="34" x2="144" y2="34" stroke="#888" strokeWidth="0.5"/>
                  <line x1="128.6" y1="27.6" x2="141.4" y2="40.4" stroke="#888" strokeWidth="0.5"/>
                  <line x1="141.4" y1="27.6" x2="128.6" y2="40.4" stroke="#888" strokeWidth="0.5"/>
                  <circle cx="135" cy="34" r="2.2" fill="url(#brassGold)" stroke="#222" strokeWidth="0.4"/>
                  <circle cx="139.5" cy="34" r="1" fill="#fff" stroke="#111" strokeWidth="0.3"/>
                </g>

                {/* Wheel 3 */}
                <g className="whl-large" style={{ transformOrigin: '160px 34px' }}>
                  <circle cx="160" cy="34" r="9" fill="#1b1c20" stroke="url(#steelLight)" strokeWidth="1.5"/>
                  <path d="M151,34 A9,9 0 0,1 169,34 Z" fill="url(#steelDark)" opacity="0.85" />
                  <line x1="160" y1="25" x2="160" y2="43" stroke="#888" strokeWidth="0.5"/>
                  <line x1="151" y1="34" x2="169" y2="34" stroke="#888" strokeWidth="0.5"/>
                  <line x1="153.6" y1="27.6" x2="166.4" y2="40.4" stroke="#888" strokeWidth="0.5"/>
                  <line x1="166.4" y1="27.6" x2="153.6" y2="40.4" stroke="#888" strokeWidth="0.5"/>
                  <circle cx="160" cy="34" r="2.2" fill="url(#brassGold)" stroke="#222" strokeWidth="0.4"/>
                  <circle cx="164.5" cy="34" r="1" fill="#fff" stroke="#111" strokeWidth="0.3"/>
                </g>

                {/* === MECHANICAL LINKAGES (Pistons & Crankshafts) === */}
                
                {/* Sliding Crosshead Joint (slides horizontally in cylinder) */}
                <g className="piston-crosshead">
                  {/* Crosshead block slider */}
                  <rect x="180" y="32" width="6" height="4" rx="0.5" fill="url(#steelLight)" stroke="#333" strokeWidth="0.4"/>
                  {/* Piston shaft sliding into chamber */}
                  <line x1="186" y1="34" x2="198" y2="34" stroke="url(#steelLight)" strokeWidth="1.5"/>
                </g>

                {/* Steam Cylinder Piston Chamber (Static) */}
                <rect x="194" y="31.5" width="16" height="5" rx="0.8" fill="url(#steelDark)" stroke="#111" strokeWidth="0.6"/>
                <rect x="193" y="31" width="1.5" height="6" fill="url(#brassGold)"/>

                {/* Side Coupling Rod (Stays perfectly horizontal, translates circularly to link wheels) */}
                <g className="side-rod">
                  <rect x="110" y="33" width="50" height="2" rx="0.5" fill="url(#steelLight)" stroke="#333" strokeWidth="0.5"/>
                  {/* Joint caps on wheels */}
                  <circle cx="110" cy="34" r="1.8" fill="url(#steelLight)" stroke="#333" strokeWidth="0.4"/>
                  <circle cx="135" cy="34" r="1.8" fill="url(#steelLight)" stroke="#333" strokeWidth="0.4"/>
                  <circle cx="160" cy="34" r="1.8" fill="url(#steelLight)" stroke="#333" strokeWidth="0.4"/>
                </g>

                {/* Main Connecting Rod (Pivot-attaches to Wheel 2's crank and crosshead at x=183, y=34) */}
                <g className="main-rod">
                  {/* Rod drawn from center of wheel 2 crank pin (x=139.5, y=34) to crosshead (x=183, y=34) */}
                  <line x1="139.5" y1="34" x2="183" y2="34" stroke="url(#steelLight)" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="139.5" cy="34" r="1.6" fill="url(#steelLight)" stroke="#333" strokeWidth="0.4"/>
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
