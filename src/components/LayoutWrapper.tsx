'use client'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { LaunchOffer } from '@/components/LaunchOffer'
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function LayoutWrapper({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return (
      <main className="flex-grow">
        {children}
      </main>
    )
  }

  return (
    <>
      <LaunchOffer />
      <Header user={user} />
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-studio-charcoal border-t-4 border-black pt-12 md:pt-20 pb-10 shadow-[0_-4px_0_rgba(0,0,0,1)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 md:mb-20">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <Image
                src="/Logo.png"
                alt="Samples Wala Logo"
                width={180}
                height={45}
                className="h-9 w-auto grayscale opacity-50"
              />
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed max-w-sm">
                Premium sound design for the modern producer. Industry standard sample packs, loops, and tools for Indian music production.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-neon italic">Navigation</h4>
              <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Packs</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Production Blog</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Your Library</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors text-studio-neon">Sell Your Samples</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-pink italic">Categories</h4>
              <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <li><Link href="/browse?category=Percussion" className="hover:text-white transition-colors">Percussion</Link></li>
                <li><Link href="/browse?category=Melodic" className="hover:text-white transition-colors">Melodic Loops</Link></li>
                <li><Link href="/browse?category=Vocals" className="hover:text-white transition-colors">Indian Vocals</Link></li>
                <li><Link href="/browse?category=Cinematic" className="hover:text-white transition-colors">Cinematic</Link></li>
                <li><Link href="/browse?category=Bollywood" className="hover:text-white transition-colors">Bollywood</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-blue italic">Socials</h4>
              <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <li>
                  <a href="https://instagram.com/sampleswala" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Instagram size={14} />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/@sampleswala" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Youtube size={14} />
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/sampleswala" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Twitter size={14} />
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-[8px] font-black uppercase tracking-[0.4em] opacity-20">
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation</Link>
              <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
            </div>
            
            {/* ULTRA MASSIVE Made In Bharat Text Badge */}
            <div className="relative w-full max-w-[600px] flex flex-col items-center md:items-end justify-center py-10 md:py-16 group select-none">
              <div className="relative z-10 transform -rotate-3 transition-all duration-500 group-hover:rotate-0 group-hover:scale-105">
                {/* MADE IN - Small brutalist tag */}
                <div className="absolute -top-8 left-4 md:left-auto md:-right-4 z-20 
                  bg-white text-black px-4 py-1 font-black text-sm md:text-xl uppercase italic 
                  border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] 
                  skew-x-[-12deg] group-hover:skew-x-0 transition-transform">
                  Made In
                </div>

                {/* भारत - Main massive text in Hindi with Flag Colors */}
                <h2 className="text-[100px] md:text-[180px] font-kalam font-bold leading-none tracking-tight
                  drop-shadow-[10px_10px_0px_#000] drop-shadow-[10px_10px_20px_rgba(0,0,0,0.5)]
                  relative z-10 flex items-center">
                  <span className="text-[#FF9933]">भा</span>
                  <span className="text-white">र</span>
                  <span className="text-[#128807]">त</span>
                </h2>

                {/* Decorative background elements (No Glow) */}
                <div className="absolute -inset-10 -z-10 overflow-visible pointer-events-none opacity-20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 blur-[70px] rounded-full" />
                </div>
              </div>

              {/* Verified Trust Signal */}
              <div className="mt-4 flex items-center gap-4 opacity-30 group-hover:opacity-60 transition-opacity">
                <div className="h-[1px] w-12 bg-white" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Original Heritage</span>
                <div className="h-[1px] w-12 bg-white" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center pb-8">
            <p className="text-[7px] font-bold text-white/5 uppercase tracking-[0.5em] leading-relaxed max-w-2xl mx-auto">
              ©Samples Wala 2026. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
