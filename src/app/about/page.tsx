import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Music, Zap, ShieldCheck, Award, Globe, Users } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'About Samples Wala | Definitive Indian Sound Library',
  description: 'The story behind Samples Wala - India\'s premier destination for high-quality, royalty-free sample packs, loops, and music production tools.',
  keywords: ['about samples wala', 'indian music production', 'best sample packs india']
})

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/about-hero.png"
          alt="Professional Studio"
          fill
          className="object-cover opacity-40 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">
            DEFFINITIVE <span className="text-studio-yellow">SOUND.</span>
          </h1>
          <p className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-[0.5em]">
            Bridging Traditional Heritage with Modern Production
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Our Mission</h2>
              <p className="text-lg text-white/60 leading-relaxed font-medium italic">
                "Samples Wala was born out of a simple necessity: the lack of high-quality, professionally recorded Indian sound libraries that meet modern industry standards. Our mission is to empower producers worldwide with authentic, royalty-free sounds that capture the true essence of Indian music culture."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/5 border border-white/5 rounded-sm space-y-4 hover:border-studio-yellow/20 transition-all">
                <Award className="text-studio-yellow" size={32} />
                <h3 className="text-sm font-black uppercase tracking-widest">Quality First</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
                  Every loop and one-shot is meticulously recorded, edited, and processed by industry experts.
                </p>
              </div>
              <div className="p-8 bg-white/5 border border-white/5 rounded-sm space-y-4 hover:border-studio-neon/20 transition-all">
                <Globe className="text-studio-neon" size={32} />
                <h3 className="text-sm font-black uppercase tracking-widest">Global Reach</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
                  From Bollywood to Billboard, our sounds are used by thousands of producers across the globe.
                </p>
              </div>
              <div className="p-8 bg-white/5 border border-white/5 rounded-sm space-y-4 hover:border-white/20 transition-all">
                <Users className="text-white" size={32} />
                <h3 className="text-sm font-black uppercase tracking-widest">Community</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
                  Supporting the next generation of Indian music producers with affordable, professional tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Why Choose <br /> <span className="text-studio-yellow">Samples Wala?</span></h2>
                <div className="h-1 w-20 bg-studio-yellow" />
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Authentic Recordings", desc: "No synthetic imitations. We record real instruments played by master musicians." },
                  { title: "DAW Ready", desc: "Key-labeled and BPM-synced. Drag and drop directly into your production." },
                  { title: "100% Royalty Free", desc: "Use our sounds in any commercial project without paying another cent." },
                  { title: "Modern Processing", desc: "Mixed and mastered to sit perfectly in your track with minimal effort." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-studio-yellow/10 flex items-center justify-center text-studio-yellow font-black text-[10px]">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  href="/browse" 
                  className="inline-flex h-14 px-12 bg-white text-black font-black uppercase tracking-widest text-[10px] items-center justify-center gap-3 hover:bg-studio-yellow transition-all"
                >
                  Explore the Library
                </Link>
              </div>
            </div>

            <div className="relative aspect-video rounded-sm overflow-hidden border border-white/5 shadow-2xl">
              <Image 
                src="/Logo.png"
                alt="Samples Wala"
                fill
                className="object-contain p-12 opacity-10"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-6xl md:text-8xl font-black text-white/5 italic">2026</p>
                  <p className="text-[10px] font-black tracking-[1em] text-white/20 uppercase">The Future of Sound</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section Sync */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="h-12 w-12 bg-studio-neon/10 flex items-center justify-center rounded-sm mx-auto md:mx-0">
               <ShieldCheck className="text-studio-neon" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Secured Delivery</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
              Industry-standard encryption for all downloads and transactions.
            </p>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="h-12 w-12 bg-studio-yellow/10 flex items-center justify-center rounded-sm mx-auto md:mx-0">
               <Zap className="text-studio-yellow" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Lightning Fast</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
              Global CDN ensured low latency for all audio previews and downloads.
            </p>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="h-12 w-12 bg-studio-neon/10 flex items-center justify-center rounded-sm mx-auto md:mx-0">
               <Music className="text-studio-neon" size={24} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Curated Quality</h3>
            <p className="text-[10px] text-white/30 font-medium uppercase leading-relaxed tracking-widest">
              Hand-picked collections from world-renowned Indian musicians.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
