'use client'
import React from 'react'
import Image from 'next/image'
import { Star, Music, ShieldCheck, Youtube, Instagram } from 'lucide-react'
import Link from 'next/link'
import TrustedBy from './TrustedBy'

const testimonials = [
  {
    name: "Abhi Bright",
    role: "Singer / Producer",
    image: "/abhi-bright.jpg",
    pack: "THE SOUTH",
    quote: "Honestly, 'THE SOUTH' pack is a complete vibe. Those tapori rhythms and South Indian elements were exactly what my latest track needed. SamplesWala is definitely the real deal."
  },
  {
    name: "Deepak Poojary",
    role: "DJ",
    image: "/deepak-poojary.jpg",
    pack: "THE SOUTH",
    quote: "Finding authentic South Indian samples that actually work in a club setting used to be a struggle. This pack changed everything for me. The percussion is so crisp and hard-hitting."
  },
  {
    name: "Python",
    role: "Producer",
    image: "/python-artist.jpg",
    pack: "THE BOLLYWOOD",
    quote: "SamplesWala's Bollywood pack is basically the gold standard. The melodies and percussion feel so authentic, they bring that cinematic feel to my tracks instantly. Great stuff."
  },
  {
    name: "Sohan Beatz",
    role: "Music Producer",
    image: "/Sohan.jpeg",
    pack: "THE SOUTH",
    quote: "Just picked up 'The South' pack and I'm really impressed. The authenticity of the percussion adds so much energy to my beats. It's a must-have for anyone producing Indian hip-hop.",
    youtube: "https://www.youtube.com/@sohanbeatz",
    instagram: "https://www.instagram.com/sohanbeatz/"
  }
]

export function ArtistTestimonials() {
  return (
    <section className="py-24 bg-black/20 border-t border-white/5">
      <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4 relative">
        {/* Splatter Accents */}
        <div className="splatter-effect bg-studio-pink/20 -top-20 -left-20 animate-pulse" />
        <div className="splatter-effect bg-studio-blue/10 bottom-0 -right-20" />
        
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic comic-text text-white">
          ARTIST REVIEWS
        </h2>
        <div className="h-2 bg-studio-yellow w-32 mx-auto border-2 border-black shadow-[4px_4px_0px_black]" />
      </div>

      <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible pb-10 md:pb-0 snap-x snap-mandatory scrollbar-hide max-w-7xl mx-auto -mx-4 px-4 md:px-0 md:mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[85vw] md:w-auto snap-center bg-studio-charcoal border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Decorative Background Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white pointer-events-none">
              <Music size={120} />
            </div>

            <div>
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 relative border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 80px, 120px"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">{t.name}</p>
                  <p className="text-[9px] md:text-[10px] text-studio-neon font-bold uppercase tracking-[0.3em]">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-6 relative z-10">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="fill-studio-yellow text-studio-yellow" />
                ))}
              </div>

              <p className="text-xs md:text-sm font-bold uppercase leading-relaxed text-white/80 tracking-widest relative z-10 italic">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-studio-pink">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
              </div>
              <div className="flex items-center gap-3">
                {t.youtube && (
                  <Link href={t.youtube} target="_blank" className="text-white/40 hover:text-studio-pink transition-colors">
                    <Youtube size={14} />
                  </Link>
                )}
                {t.instagram && (
                  <Link href={t.instagram} target="_blank" className="text-white/40 hover:text-studio-pink transition-colors">
                    <Instagram size={14} />
                  </Link>
                )}
                <span className="text-[10px] font-black text-studio-yellow uppercase italic comic-text">{t.pack}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
      <div className="mt-8">
        <TrustedBy />
      </div>
    </section>
  )
}
