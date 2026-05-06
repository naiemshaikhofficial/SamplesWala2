import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Music, Zap, ShieldCheck, Star, CheckCircle2, Heart, Headphones, Users, Instagram, Youtube } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'About Us | SamplesWala',
  description: 'Learn about SamplesWala, founded by Naiem Shaikh. We are a team of 50+ musicians providing the best Indian sample packs.',
})

export default function AboutPage() {
  const founderImage = "https://imagizer.imageshack.com/img922/310/c8UQzL.jpg"

  const socialLinks = [
    { icon: Instagram, url: "https://www.instagram.com/naiemShaikhofficial/", label: "Instagram" },
    { icon: Youtube, url: "https://www.youtube.com/@naiemshaikh", label: "YouTube" },
    { icon: Music, url: "https://open.spotify.com/artist/08cXWillp8iGPYijt84FpO", label: "Spotify" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/about-hero.png"
            alt="Studio"
            fill
            className="object-cover opacity-20 grayscale brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">
            REAL INDIAN <span className="text-studio-yellow">SOUNDS.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base font-bold text-white/40 uppercase tracking-widest">
            Made for producers, by producers.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={founderImage}
                alt="Naiem Shaikh"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl font-black uppercase italic">Naiem Shaikh</h2>
                <p className="text-studio-yellow font-bold uppercase tracking-widest text-[10px]">Founder & Musician</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-yellow/10 border border-studio-yellow/20">
                <Heart size={12} className="text-studio-yellow fill-studio-yellow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow">The Story</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
                HI, I'M <span className="text-studio-yellow">NAIEM.</span>
              </h3>

              <div className="space-y-6 text-white/60 text-lg leading-relaxed font-medium">
                <p>
                  I'm a music producer and musician just like you. I started SamplesWala because I was frustrated. I couldn't find high-quality, real Indian sounds to use in my tracks. Everything felt "fake" or old.
                </p>
                <p>
                  I decided to change that. I wanted to bring the soul of Indian music to every producer in the world. Today, we have a huge family of over <span className="text-white font-bold">50+ professional musicians</span> who work with me to record the best loops and samples you've ever heard.
                </p>
              </div>

              {/* Social Links Row */}
              <div className="flex flex-wrap gap-4 pt-4">
                {socialLinks.map((link, i) => (
                  <a 
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-sm hover:bg-studio-yellow hover:text-black hover:border-studio-yellow transition-all group"
                  >
                    <link.icon size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
                  </a>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <div className="flex-1">
                  <p className="text-2xl font-black italic text-white">50+</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Musicians</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-black italic text-studio-yellow">100%</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Real Instruments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Quality Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                OUR TEAM IS <span className="text-studio-neon">YOUR TEAM.</span>
              </h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                When you use our sounds, you're working with 50+ of the best studio musicians in India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Music, title: "Real Players", desc: "No MIDI. We record real Sitar, Tabla, and Flute players." },
                { icon: Headphones, title: "Studio Quality", desc: "Recorded in top studios with the best gear." },
                { icon: Zap, title: "Easy To Use", desc: "Everything is key-labeled and ready to drag-and-drop." }
              ].map((item, i) => (
                <div key={i} className="p-8 border border-white/5 bg-black/50 rounded-sm space-y-4 text-left group hover:border-studio-neon/30 transition-all">
                  <item.icon className="text-studio-neon" size={24} />
                  <h4 className="text-xs font-black uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                WHY <span className="text-studio-yellow">SAMPLES WALA?</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  "100% Royalty Free - Keep all your earnings.",
                  "High Resolution Audio - 24-bit studio quality.",
                  "BPM & Key Matched - Fits perfectly in your project.",
                  "Authentic Indian Soul - Sounds that tell a story."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 size={16} className="text-studio-yellow" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">{text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link href="/browse" className="studio-button">
                  Check Out The Sounds
                </Link>
              </div>
            </div>

            <div className="relative aspect-video rounded-sm overflow-hidden border border-white/5 opacity-40">
              <Image 
                src="/Logo.png"
                alt="Logo"
                fill
                className="object-contain p-20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-studio-yellow">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter italic">
            LET'S MAKE SOME <br /> <span className="underline decoration-black/20">MUSIC.</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/browse" className="px-12 py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform">
              Explore Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}



