import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPacks, getPresets } from '@/app/browse/actions'
import { ArrowRight, Zap, ShieldCheck, Music, Sparkles } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { HomePacks } from '@/components/HomePacks'
import { ArtistTestimonials } from '@/components/ArtistTestimonials'
import { TrustpilotBadge } from '@/components/TrustpilotBadge'
import { PresetCard } from '@/components/PresetCard'


import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: "Samples Wala | Premium Indian Sample Packs & Loops",
  description: "Download high-quality Indian sample packs, loops, and curated collections for Bollywood, Hip-Hop, and Electronic music. 100% royalty-free.",
  path: '/'
})

export default async function HomePage() {
  const [packs, presets] = await Promise.all([
    getPacks(),
    getPresets()
  ])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center overflow-hidden border-b border-white/5 bg-black">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-studio-yellow/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-studio-neon/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 z-0" />

        <div className="container mx-auto px-4 relative z-30 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-20">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left relative">
            {/* Splatter Backdrop */}
            <div className="splatter-effect bg-studio-pink/30 -top-10 -left-10 animate-pulse" />

            <div className="inline-block px-4 py-1 bg-studio-red text-white font-black uppercase text-[10px] tracking-[0.3em] jagged-border mb-4 rotate-[-2deg]">
              OFFICIALLY LAUNCHED!
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] md:leading-[0.75] text-white comic-text break-words">
              SAMPLES<br />
              <span className="text-studio-yellow italic">WALA</span>
            </h1>
            <p className="text-xs md:text-lg text-white/60 max-w-xl mx-auto lg:mx-0 uppercase font-bold tracking-widest leading-relaxed border-l-4 border-studio-blue pl-4">
              Premium Indian sample packs, presets & plugin sounds. <br className="hidden md:block" /> Built for the creative community. 100% Royalty Free.
            </p>

              <div className="flex justify-center lg:justify-start pt-4">
                <div 
                  className="relative flex flex-wrap gap-x-4 gap-y-2 select-none"
                  style={{ fontFamily: 'var(--font-luckiest-guy), cursive' }}
                >
                  <span className="text-3xl md:text-6xl text-studio-neon comic-text -rotate-3 hover:rotate-0 transition-transform">BY</span>
                  <span className="text-3xl md:text-6xl text-studio-pink comic-text rotate-2 hover:rotate-0 transition-transform">ARTIST</span>
                  <span className="text-3xl md:text-6xl text-studio-yellow comic-text -rotate-1 hover:rotate-0 transition-transform">FOR</span>
                  <span className="text-3xl md:text-6xl text-studio-blue comic-text rotate-3 hover:rotate-0 transition-transform">ARTIST</span>
                  
                  {/* Decorative Comic Elements */}
                  <div className="absolute -top-4 -right-4 text-studio-red animate-pulse">
                    <Sparkles size={24} fill="currentColor" />
                  </div>
                </div>
              </div>

              <HeroSearch />

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link
                  href="/browse"
                  className="w-full sm:w-auto h-14 px-12 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-studio-red hover:text-white transition-all border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  BROWSE ALL PACKS
                </Link>
              </div>
            </div>

            {/* Hero Packs Showcase */}
            <div className="relative h-[500px] hidden lg:flex items-center justify-center">
              {packs.slice(0, 3).map((pack: any, index: number) => (
                <div
                  key={pack.id}
                  className="absolute transition-all duration-700 hover:z-50 hover:scale-110 cursor-pointer group"
                  style={{
                    transform: `translateX(${(index - 1) * 140}px) rotate(${(index - 1) * 12}deg) translateY(${Math.abs(index - 1) * 40}px)`,
                    zIndex: 3 - Math.abs(index - 1)
                  }}
                >
                  <div className="w-64 aspect-square relative border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all group-hover:border-studio-pink group-hover:-translate-y-4">
                    <Image
                      src={pack.cover_url || '/placeholder.jpg'}
                      alt={pack.name}
                      fill
                      sizes="256px"
                      className="object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-0 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <Link href={`/packs/${pack.slug}`} className="block w-full py-3 bg-white text-black text-[10px] font-black uppercase text-center tracking-widest border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        GET THIS PACK
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Featured Packs */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Trending Collections</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Top rated by industry veterans</p>
          </div>
          <Link href="/browse" className="text-[10px] font-black text-white/40 uppercase hover:text-studio-neon transition-colors">
            View All Packs
          </Link>
        </div>

        <HomePacks packs={packs.slice(0, 4)} />
      </section>

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
