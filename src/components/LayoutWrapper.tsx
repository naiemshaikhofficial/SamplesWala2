'use client'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { LaunchOffer } from '@/components/LaunchOffer'
import Link from "next/link";
import Image from "next/image";
import { AnimatedLogo } from '@/components/AnimatedLogo'
import { Instagram, Youtube, Twitter, Facebook, Linkedin, Send, MessageSquare, Music } from "lucide-react";

import { FloatingMusicNotes } from '@/components/FloatingMusicNotes'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isDashboardPage = pathname?.startsWith('/dashboard')

  if (isAuthPage || isDashboardPage) {
    return (
      <main className="flex-grow flex flex-col relative">
        <FloatingMusicNotes />
        {children}
      </main>
    )
  }

  return (
    <>
      <FloatingMusicNotes />
      <LaunchOffer />
      <Header />

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-studio-charcoal border-t-4 border-black pt-12 md:pt-20 pb-10 shadow-[0_-4px_0_rgba(0,0,0,1)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 md:mb-20">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <AnimatedLogo className="opacity-80 hover:opacity-100 transition-all" />
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

            <div className="space-y-6 text-center">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Follow Us</h4>
              <div className="flex flex-wrap items-center justify-center gap-4 text-white/40">
                {/* YouTube */}
                <a
                  href="https://youtube.com/@sampleswala"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social="youtube"
                  style={{ '--social-color': '#FF0000' } as React.CSSProperties}
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 text-white/40"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" strokeWidth={2.2} />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/sampleswala"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social="instagram"
                  style={{ '--social-color': '#E1306C' } as React.CSSProperties}
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 text-white/40"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" strokeWidth={2.2} />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/sampleswala"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social="facebook"
                  style={{ '--social-color': '#1877F2' } as React.CSSProperties}
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 text-white/40"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" strokeWidth={2.2} />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com/sampleswala"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social="twitter"
                  style={{ '--social-color': '#ffffff' } as React.CSSProperties}
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 text-white/40"
                  title="Twitter / X"
                >
                  <Twitter className="w-5 h-5" strokeWidth={2.2} />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/sampleswala"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social="telegram"
                  style={{ '--social-color': '#0088cc' } as React.CSSProperties}
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 text-white/40"
                  title="Telegram"
                >
                  <Send className="w-5 h-5" strokeWidth={2.2} />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/sampleswala"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social="linkedin"
                  style={{ '--social-color': '#0A66C2' } as React.CSSProperties}
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-all duration-200 text-white/40"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" strokeWidth={2.2} />
                </a>
              </div>
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
              <div className="relative z-10 transform -rotate-3 transition-all duration-500">
                {/* MADE IN - Small brutalist tag */}
                <div className="absolute -top-8 left-4 md:left-auto md:-right-4 z-20 
                  bg-white text-black px-4 py-1 font-black text-sm md:text-xl uppercase italic 
                  border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] 
                  skew-x-[-12deg] transition-transform">
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

                {/* Decorative background elements (Static) */}
                <div className="absolute -inset-10 -z-10 overflow-visible pointer-events-none opacity-20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 blur-[70px] rounded-full" />
                </div>
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
