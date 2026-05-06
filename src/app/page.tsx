import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPacks } from '@/app/browse/actions'
import { ArrowRight, Zap, ShieldCheck, Music } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'
import { BrowseLibrary } from '@/components/BrowseLibrary'

export default async function HomePage() {
  const packs = await getPacks()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/5 bg-black">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-studio-yellow/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-studio-neon/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 z-0" />

        <div className="container mx-auto px-4 relative z-30 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20">
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white">
              BETTER <br /> <span className="text-studio-yellow italic">SOUNDS.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/40 max-w-xl mx-auto lg:mx-0 uppercase font-bold tracking-widest leading-relaxed">
              Premium sample packs for Indian music producers. <br/> High quality. Instant download. 100% Royalty Free.
            </p>
            
            <div className="flex flex-col gap-6 pt-4">
              <HeroSearch />

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link 
                  href="/browse" 
                  className="w-full sm:w-auto h-14 px-12 bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-studio-yellow transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-studio-yellow/20"
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
                  transform: `translateX(${(index - 1) * 120}px) rotate(${(index - 1) * 8}deg) translateY(${Math.abs(index - 1) * 30}px)`,
                  zIndex: 3 - Math.abs(index - 1)
                }}
              >
                <div className="w-64 aspect-square relative rounded-sm overflow-hidden border border-white/10 shadow-2xl transition-all group-hover:border-studio-yellow/50 group-hover:shadow-studio-yellow/10">
                   <Image 
                     src={pack.cover_url || '/placeholder.jpg'} 
                     alt={pack.name} 
                     fill 
                     className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-0 transition-opacity" />
                   <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <Link href={`/packs/${pack.slug}`} className="block w-full py-2 bg-studio-yellow text-black text-[8px] font-black uppercase text-center tracking-widest">
                        Quick View
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
            <h2 className="text-4xl font-black uppercase tracking-tighter">Trending Collections</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Top rated by industry veterans</p>
          </div>
          <Link href="/browse" className="text-[10px] font-black text-white/40 uppercase hover:text-studio-neon transition-colors">
            View All Packs
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {packs.slice(0, 4).map((pack: any) => (
            <Link 
              key={pack.id} 
              href={`/packs/${pack.slug}`}
              className="group space-y-4"
            >
              <div className="aspect-square relative overflow-hidden bg-white/5 border border-white/5 rounded-sm">
                <Image
                  src={pack.cover_url || '/placeholder.jpg'}
                  alt={pack.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-black bg-studio-yellow text-black px-4 py-2 rounded-xs">GET PACK</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-[14px] font-black uppercase truncate group-hover:text-studio-yellow transition-colors">{pack.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{pack.categories?.name || 'Artifacts'}</p>
                  <p className="text-[10px] font-black text-studio-neon">₹{pack.price_inr}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-studio-charcoal/30 border-y border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="h-12 w-12 bg-studio-neon/10 flex items-center justify-center rounded-sm mx-auto md:mx-0">
               <ShieldCheck className="text-studio-neon" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Royalty Free</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
              All sounds are 100% royalty-free for commercial use. Keep all your royalties.
            </p>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="h-12 w-12 bg-studio-yellow/10 flex items-center justify-center rounded-sm mx-auto md:mx-0">
               <Zap className="text-studio-yellow" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Instant Access</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
              Digital delivery immediately after purchase. Start creating in seconds.
            </p>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="h-12 w-12 bg-studio-neon/10 flex items-center justify-center rounded-sm mx-auto md:mx-0">
               <Music className="text-studio-neon" size={24} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">High Quality</h3>
            <p className="text-[10px] text-white/30 font-medium uppercase leading-relaxed tracking-widest">
              Professional audio files made for making hits and great music.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
