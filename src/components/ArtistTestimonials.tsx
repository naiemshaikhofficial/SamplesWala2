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
    <section className="pt-24 pb-20 bg-black/20 border-t border-white/5">
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

      <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-auto max-w-7xl">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-auto aspect-square snap-center bg-studio-charcoal border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Decorative Background Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white pointer-events-none">
              <Music size={120} />
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 relative border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <p className="text-base md:text-lg font-black text-white uppercase italic tracking-tighter leading-tight">{t.name}</p>
                  <p className="text-[8px] text-studio-neon font-bold uppercase tracking-[0.2em]">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-6 relative z-10">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="fill-studio-yellow text-studio-yellow" />
                ))}
              </div>

              <p className="text-[11px] font-bold uppercase leading-relaxed text-white/80 tracking-widest relative z-10 italic">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-studio-pink">
                <ShieldCheck size={10} />
                <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {t.youtube && (
                    <Link href={t.youtube} target="_blank" className="text-white/40 hover:text-studio-pink transition-colors">
                      <Youtube size={12} />
                    </Link>
                  )}
                  {t.instagram && (
                    <Link href={t.instagram} target="_blank" className="text-white/40 hover:text-studio-pink transition-colors">
                      <Instagram size={12} />
                    </Link>
                  )}
                </div>
                <span className="text-[9px] font-black text-studio-yellow uppercase italic comic-text ml-1">{t.pack}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
      <div className="mt-20 md:mt-32">
        <TrustedBy />
      </div>
    </section>
  )
}
