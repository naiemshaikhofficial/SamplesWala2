import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPacks } from '@/app/browse/actions'
import { ArrowRight, Zap, ShieldCheck, Music } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { HomePacks } from '@/components/HomePacks'
import { ArtistTestimonials } from '@/components/ArtistTestimonials'
import { TrustpilotBadge } from '@/components/TrustpilotBadge'
import TrustedBy from '@/components/TrustedBy'

export default async function HomePage() {
  const packs = await getPacks()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/5 bg-black">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-studio-yellow/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-studio-neon/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 z-0" />

        <div className="container mx-auto px-4 relative z-30 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-20">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] text-white graffiti-text">
              SAMPLES WALA: <br /> <span className="text-studio-neon italic">RAW SOUNDS.</span>
            </h1>
            <p className="text-xs md:text-lg text-white/40 max-w-xl mx-auto lg:mx-0 uppercase font-bold tracking-widest leading-relaxed">
              Premium Indian sample packs, loops, and VST tools for modern music production. <br className="hidden md:block" /> Industry standard sounds. 100% Royalty Free.
            </p>
            
            <div className="flex flex-col gap-6 pt-2 md:pt-4">
              <HeroSearch />

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link 
                  href="/browse" 
                  className="w-full sm:w-auto h-14 px-12 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-studio-neon transition-all border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  BROWSE ALL PACKS
                </Link>
              </div>
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

      {/* Social Proof Marquee */}
      <TrustedBy />

      {/* Featured Packs */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Trending Collections</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Top rated by industry veterans</p>
          </div>
          <Link href="/browse" className="text-[10px] font-black text-white/40 uppercase hover:text-studio-neon transition-colors">
            View All Packs
          </Link>
        </div>

        <HomePacks packs={packs.slice(0, 4)} />
      </section>

      <ArtistTestimonials />

      {/* Trust Section */}
      <section className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-studio-neon/[0.02] blur-[120px] -z-10" />
        
        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter graffiti-text text-white">
              TRUSTED BY 500+ ARTISTS
            </h2>
            <div className="h-1 bg-studio-neon w-24 mx-auto shadow-[0_0_20px_#00ff9f]" />
          </div>

          <div className="flex flex-row md:grid md:grid-cols-3 gap-3 md:gap-12">
            <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left p-4 md:p-8 bg-studio-charcoal/50 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
              <div className="h-8 w-8 md:h-12 md:w-12 bg-studio-neon/10 flex items-center justify-center rounded-sm mx-auto md:mx-0 border border-studio-neon/20">
                 <ShieldCheck className="text-studio-neon" size={16} />
              </div>
              <h3 className="text-[8px] md:text-sm font-black uppercase tracking-widest text-white">Royalty Free</h3>
              <p className="hidden md:block text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-[0.2em]">
                All sounds are 100% royalty-free for commercial use. Keep all your royalties.
              </p>
            </div>
            <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left p-4 md:p-8 bg-studio-charcoal/50 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
              <div className="h-8 w-8 md:h-12 md:w-12 bg-studio-yellow/10 flex items-center justify-center rounded-sm mx-auto md:mx-0 border border-studio-yellow/20">
                 <Zap className="text-studio-yellow" size={16} />
              </div>
              <h3 className="text-[8px] md:text-sm font-black uppercase tracking-widest text-white">Instant</h3>
              <p className="hidden md:block text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-[0.2em]">
                Digital delivery immediately after purchase. Start creating in seconds.
              </p>
            </div>
            <div className="flex-1 space-y-2 md:space-y-4 text-center md:text-left p-4 md:p-8 bg-studio-charcoal/50 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
              <div className="h-8 w-8 md:h-12 md:w-12 bg-studio-neon/10 flex items-center justify-center rounded-sm mx-auto md:mx-0 border border-studio-neon/20">
                 <Music className="text-studio-neon" size={16} />
              </div>
              <h3 className="text-[8px] md:text-sm font-black uppercase tracking-widest text-white">High Quality</h3>
              <p className="hidden md:block text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-[0.2em]">
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
