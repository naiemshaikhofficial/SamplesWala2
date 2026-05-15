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
            
            {/* ULTRA MASSIVE Made In Bharat Badge */}
            <div className="relative h-64 w-[600px] cursor-default -mt-20 -mb-10">
               <Image 
                 src="/made-in-bharat.png" 
                 alt="Made In Bharat" 
                 fill 
                 className="object-contain"
                 priority
               />
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
