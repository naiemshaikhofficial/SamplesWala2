'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Youtube, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative bg-studio-charcoal border-t-8 border-black pt-16 pb-12 shadow-[0_-8px_0_rgba(0,0,0,1)] overflow-hidden">
      {/* 🇮🇳 Tricolor Top Border Accent */}
      <div className="absolute top-0 left-0 w-full flex h-[6px]">
        <div className="flex-1 bg-[#FF9933] h-full" />
        <div className="flex-1 bg-white h-full" />
        <div className="flex-1 bg-[#128807] h-full" />
      </div>

      {/* Cyber Comic Dots Ambient Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:16px_16px]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-16">
          
          {/* Brand & Mission Column */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <Link
              href="/"
              className="flex items-center select-none w-fit hover:scale-102 transition-transform duration-200"
            >
              <Image
                src="/Logo.png"
                alt="SamplesWala Logo"
                width={130}
                height={32}
                priority
                className="object-contain"
              />
            </Link>
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest leading-relaxed max-w-sm">
              Premium loops, presets, and sample packs crafted for modern music production. 100% royalty-free, instantly downloadable hits.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-2">
              {/* Instagram */}
              <a
                href="https://instagram.com/sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-black/50 border border-white/10 flex items-center justify-center transition-all duration-200 text-white/40 hover:text-[#E1306C] hover:border-[#E1306C] hover:shadow-[3px_3px_0px_#E1306C] rounded-sm"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={2.2} />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-black/50 border border-white/10 flex items-center justify-center transition-all duration-200 text-white/40 hover:text-[#FF0000] hover:border-[#FF0000] hover:shadow-[3px_3px_0px_#FF0000] rounded-sm"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" strokeWidth={2.2} />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-black/50 border border-white/10 flex items-center justify-center transition-all duration-200 text-white/40 hover:text-[#0088cc] hover:border-[#0088cc] hover:shadow-[3px_3px_0px_#0088cc] rounded-sm"
                title="Telegram"
              >
                <Send className="w-4 h-4" strokeWidth={2.2} />
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-black/50 border border-white/10 flex items-center justify-center transition-all duration-200 text-white/40 hover:text-white hover:border-white hover:shadow-[3px_3px_0px_white] rounded-sm"
                title="Twitter / X"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="col-span-1 md:col-span-3 md:col-start-7 space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-neon italic">Explore</h4>
            <ul className="space-y-2.5 text-[10px] font-bold text-white/45 uppercase tracking-widest">
              <li>
                <Link href="/browse" className="hover:text-studio-yellow transition-all duration-150">
                  Browse Packs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-studio-yellow transition-all duration-150">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-studio-yellow transition-all duration-150">
                  Your Library
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-studio-yellow transition-all duration-150">
                  Production Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-studio-yellow transition-all duration-150">
                  Sell Your Samples
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-studio-yellow transition-all duration-150">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-studio-yellow transition-all duration-150">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy Column */}
          <div className="col-span-1 md:col-span-3 space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-blue italic">Support & Legal</h4>
            <ul className="space-y-2.5 text-[10px] font-bold text-white/45 uppercase tracking-widest">
              <li>
                <Link href="/terms" className="hover:text-studio-yellow transition-all duration-150">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-studio-yellow transition-all duration-150">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-studio-yellow transition-all duration-150">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-studio-yellow transition-all duration-150">
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
          
          {/* Copyright */}
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] select-none text-center sm:text-left">
            © 2026 SAMPLES WALA. ALL RIGHTS RESERVED.
          </p>

          {/* Made In Bharat Tag */}
          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-white/25 select-none">
            <span>Made with</span>
            <span className="text-studio-pink">❤️</span>
            <span>in</span>
            <span className="flex items-center font-bold tracking-tight">
              <span className="text-[#FF9933]">भा</span>
              <span className="text-white">र</span>
              <span className="text-[#128807]">त</span>
            </span>
          </div>

        </div>
      </div>
    </footer>
  )
}

