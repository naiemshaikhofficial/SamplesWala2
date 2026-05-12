import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Music, Zap, ShieldCheck, Headphones, Users, Instagram, Youtube, Twitter, Heart, Code } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'About Us | Samples Wala - The Soul of Indian Sound',
  description: 'Meet the team behind Samples Wala. Founded by Naiem Shaikh, we are a collective of 50+ musicians and developers dedicated to professional Indian sound design.',
  path: '/about'
})

export default function AboutPage() {
  const founderImage = "https://imagizer.imageshack.com/img922/310/c8UQzL.jpg"

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/graffiti-bg.png"
            alt="Graffiti Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic graffiti-text text-white">
            ABOUT <span className="text-studio-neon">US.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[10px] md:text-sm font-black text-white/40 uppercase tracking-[0.5em]">
            THE STORY BEHIND THE SOUND
          </p>
        </div>
      </section>

      {/* Founder & Mission Section */}
      <section className="py-24 border-b-4 border-black bg-studio-charcoal/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] group">
              <Image 
                src={founderImage}
                alt="Naiem Shaikh"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                unoptimized
              />
              <div className="absolute bottom-6 left-6 bg-white text-black px-6 py-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <p className="text-xl font-black uppercase italic leading-none">Naiem Shaikh</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-studio-pink mt-1">Founder / Creative Director</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex h-10 px-6 bg-studio-neon text-black items-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-widest">The Vision</span>
              </div>
              
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic text-white">
                WE ARE <span className="text-studio-pink">SAMPLES WALA.</span>
              </h3>

              <div className="space-y-6 text-white/60 text-lg leading-relaxed font-bold uppercase tracking-wide">
                <p>
                  SAMPLES WALA WAS BORN FROM A SIMPLE NEED: <span className="text-white">AUTHENTICITY.</span> AS MUSICIANS, WE WERE TIRED OF ARTIFICIAL SOUNDS THAT LACKED THE SOUL OF INDIAN MUSIC.
                </p>
                <p>
                  FOUNDED BY <span className="text-studio-neon">NAIEM SHAIKH</span>, OUR MISSION IS TO BRING THE RAW, UNTAMED SOUNDS OF INDIA TO GLOBAL PRODUCTIONS.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t-2 border-black">
                <div className="p-6 bg-white/5 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <p className="text-3xl font-black italic text-studio-neon leading-none">50+</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mt-2 font-bold">Musicians & Developers</p>
                </div>
                <div className="p-6 bg-white/5 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <p className="text-3xl font-black italic text-studio-pink leading-none">100%</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mt-2 font-bold">Royalty Free Sounds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-studio-neon/[0.03] blur-[150px] -z-10" />
        <div className="container mx-auto px-4 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic graffiti-text text-white">
              BEHIND THE <span className="text-studio-pink">SCENES.</span>
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">A COLLECTIVE OF 50+ PROS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 border-4 border-black bg-studio-charcoal shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6 text-left group hover:border-studio-neon transition-all">
              <Music className="text-studio-neon" size={32} />
              <h4 className="text-xl font-black uppercase italic text-white">The Musicians</h4>
              <p className="text-[11px] text-white/40 font-bold uppercase leading-relaxed tracking-widest">
                FROM CLASSICAL TABLA MAESTROS TO EXPERIMENTAL SITAR PLAYERS, OUR TEAM CAPTURES THE REAL SOUL OF INSTRUMENTS.
              </p>
            </div>
            <div className="p-10 border-4 border-black bg-studio-charcoal shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6 text-left group hover:border-studio-pink transition-all">
              <Code className="text-studio-pink" size={32} />
              <h4 className="text-xl font-black uppercase italic text-white">The Devs</h4>
              <p className="text-[11px] text-white/40 font-bold uppercase leading-relaxed tracking-widest">
                OUR DEVELOPERS ENSURE THAT EVERY PACK IS DAW-READY, OPTIMIZED, AND EASY TO USE FOR MODERN PRODUCERS.
              </p>
            </div>
            <div className="p-10 border-4 border-black bg-studio-charcoal shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6 text-left group hover:border-studio-yellow transition-all">
              <Headphones className="text-studio-yellow" size={32} />
              <h4 className="text-xl font-black uppercase italic text-white">Sound Designers</h4>
              <p className="text-[11px] text-white/40 font-bold uppercase leading-relaxed tracking-widest">
                WE PROCESS EVERY SOUND THROUGH HIGH-END ANALOG GEAR TO GIVE IT THAT PROFESSIONAL PUNCH AND CLARITY.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-studio-neon border-4 border-black p-16 text-center shadow-[16px_16px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 -rotate-12 translate-x-1/4 -translate-y-1/4">
             <Music size={300} className="text-black" />
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter italic leading-none">
              JOIN THE <br/> FAMILY.
            </h2>
            <Link 
              href="/browse" 
              className="inline-flex h-16 px-12 bg-black text-white text-xs font-black uppercase tracking-[0.3em] items-center hover:bg-studio-pink transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              BROWSE SOUNDS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
