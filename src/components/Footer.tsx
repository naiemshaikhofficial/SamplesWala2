'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Youtube, Facebook, Send, Linkedin } from 'lucide-react'
import { PaymentAccepted } from '@/components/ui/PaymentAccepted'

export function Footer() {
  const dashboardUrl = process.env.NODE_ENV === 'production'
    ? 'https://dashboard.sampleswala.com'
    : 'http://dashboard.localhost:3000';

  return (
    <footer className="relative bg-studio-charcoal border-t-8 border-black pt-12 md:pt-20 pb-10 shadow-[0_-8px_0_rgba(0,0,0,1)] overflow-hidden">
      {/* 🇮🇳 Tricolor Top Border Accent - Matches the dynamic theme of India Journey */}
      <div className="absolute top-0 left-0 w-full flex h-[6px]">
        <div className="flex-1 bg-studio-orange h-full" />
        <div className="flex-1 bg-white h-full" />
        <div className="flex-1 bg-studio-neon h-full" />
      </div>
      {/* Cyber Comic Dots Ambient Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:16px_16px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 md:mb-20">
          <div className="col-span-1 space-y-6">
            <Link
              href="/"
              className="flex items-center select-none hover:scale-105 transition-transform duration-200 opacity-95 hover:opacity-100"
            >
              <Image
                src="/Logo.png"
                alt="SamplesWala Logo"
                width={120}
                height={30}
                priority
                className="object-contain"
              />
            </Link>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed max-w-sm">
              Premium sound design for the modern producer. Industry standard sample packs, loops, and presets for Indian &amp; global music production.
            </p>
            {/* Value Proposition Tags */}
            <div className="flex flex-col gap-2 pt-2 text-[8px] font-black uppercase tracking-wider text-white/30 select-none">
              <div className="flex items-center gap-2">
                <span className="text-studio-neon">✓</span> 100% Royalty-Free
              </div>
              <div className="flex items-center gap-2">
                <span className="text-studio-yellow">✓</span> Instant Download
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-neon italic">Navigation</h4>
            <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <li>
                <Link href="/browse" className="hover:text-studio-yellow hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Browse Packs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-studio-yellow hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Production Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-studio-yellow hover:translate-x-1.5 transition-all duration-200 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-studio-yellow hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Your Library
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-studio-neon hover:translate-x-1.5 transition-all duration-200 inline-block text-studio-neon/80">
                  Sell Your Samples
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-studio-yellow hover:translate-x-1.5 transition-all duration-200 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-studio-yellow hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Category Filters */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-blue italic">Categories</h4>
            <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <li>
                <Link href="/browse?category=Percussion" className="hover:text-studio-blue hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Percussion
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Melodic" className="hover:text-studio-blue hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Melodic Loops
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Vocals" className="hover:text-studio-blue hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Vocals
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Cinematic" className="hover:text-studio-blue hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Cinematic
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Bollywood" className="hover:text-studio-blue hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Bollywood
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Connection */}
          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Connect With Us</h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/40">
              {/* YouTube */}
              <a
                href="https://youtube.com/@sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                data-social="youtube"
                style={{ '--social-color': 'var(--color-social-youtube)' } as React.CSSProperties}
                className="w-10 h-10 bg-black/40 border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 text-white/40 hover:shadow-[4px_4px_0px_#ff0000] hover:border-[#ff0000] rounded-sm"
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
                style={{ '--social-color': 'var(--color-social-instagram)' } as React.CSSProperties}
                className="w-10 h-10 bg-black/40 border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 text-white/40 hover:shadow-[4px_4px_0px_#E1306C] hover:border-[#E1306C] rounded-sm"
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
                style={{ '--social-color': 'var(--color-social-facebook)' } as React.CSSProperties}
                className="w-10 h-10 bg-black/40 border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 text-white/40 hover:shadow-[4px_4px_0px_#1877F2] hover:border-[#1877F2] rounded-sm"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" strokeWidth={2.2} />
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                data-social="twitter"
                style={{ '--social-color': '#ffffff' } as React.CSSProperties}
                className="w-10 h-10 bg-black/40 border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 text-white/40 hover:shadow-[4px_4px_0px_#ffffff] hover:border-[#ffffff] rounded-sm"
                title="Twitter / X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/sampleswala"
                target="_blank"
                rel="noopener noreferrer"
                data-social="telegram"
                style={{ '--social-color': 'var(--color-social-telegram)' } as React.CSSProperties}
                className="w-10 h-10 bg-black/40 border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 text-white/40 hover:shadow-[4px_4px_0px_#0088cc] hover:border-[#0088cc] rounded-sm"
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
                style={{ '--social-color': 'var(--color-social-linkedin)' } as React.CSSProperties}
                className="w-10 h-10 bg-black/40 border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 text-white/40 hover:shadow-[4px_4px_0px_#0A66C2] hover:border-[#0A66C2] rounded-sm"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>



        {/* Bottom Section */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-white/5 pt-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
            <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors duration-200">Refund & Cancellation</Link>
            <Link href="/dmca" className="hover:text-white transition-colors duration-200">DMCA</Link>
          </div>

          {/* Minimalist Made In Bharat Tag */}
          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-white/20 select-none">
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

        {/* Copyright */}
        <div className="mt-8 text-center border-t border-white/5 pt-8">
          <p className="text-[7px] font-bold text-white/5 uppercase tracking-[0.5em] leading-relaxed max-w-2xl mx-auto">
            © Samples Wala 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
