'use client'
import React from 'react'
import Image from 'next/image'
import { Star, Music, ShieldCheck } from 'lucide-react'

const testimonials = [
  {
    name: "Abhi Bright",
    role: "Singer / Producer",
    image: "/abhi-bright.jpg",
    pack: "THE SOUTH",
    quote: "THE 'THE SOUTH' PACK IS ABSOLUTE FIRE. THOSE TAPORI RHYTHMS AND SOUTH INDIAN VIBES ARE EXACTLY WHAT I NEEDED FOR MY LATEST PRODUCTION. SAMPLESWALA IS THE REAL DEAL."
  },
  {
    name: "Deepak Poojary",
    role: "Professional DJ",
    image: "/deepak-poojary.jpg",
    pack: "THE SOUTH",
    quote: "AS A DJ, FINDING AUTHENTIC SOUTH INDIAN SAMPLES THAT ACTUALLY HIT IN THE CLUB IS HARD. THIS PACK IS A GAME CHANGER. THE PERCUSSION IS SO CRISP AND ENERGETIC."
  },
  {
    name: "Python",
    role: "Music Producer",
    image: "/python-artist.jpg",
    pack: "THE BOLLYWOOD",
    quote: "SAMPLESWALA'S BOLLYWOOD PACK IS THE GOLD STANDARD. THE MELODIES AND PERCUSSION ARE SO AUTHENTIC, THEY BRING THAT CINEMATIC VIBE TO MY TRACKS INSTANTLY."
  }
]

export function ArtistTestimonials() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic graffiti-text text-white">
          ARTIST REVIEWS
        </h2>
        <div className="h-1 bg-studio-pink w-24 mx-auto shadow-[0_0_20px_#ff0080]" />
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
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-studio-neon uppercase italic">{t.pack}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
