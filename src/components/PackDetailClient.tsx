'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, PlayCircle, ShieldCheck, Zap, CheckCircle2, Headphones, HelpCircle, Plus, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DownloadButton } from '@/components/DownloadButton'
import { PaymentButton } from '@/components/PaymentButton'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ShareButton } from '@/components/ShareButton'
import Link from 'next/link'
import { getOptimizedImageUrl } from '@/lib/images'
import { createClient } from '@/lib/supabase/client'

export function PackDetailClient({ initialPack }: { initialPack: any }) {
  const pack = initialPack
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [owned, setOwned] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        fetch(`/api/auth/ownership?itemId=${pack.id}`)
          .then(res => res.ok ? res.json() : { owned: false })
          .then(data => setOwned(data.owned))
          .catch(() => setOwned(false))
      }
    })
  }, [pack.id])

  useEffect(() => {
    if (pack.is_downloadable || !pack.created_at) return

    const calculateTimeLeft = () => {
      const parseDbDate = (dateStr: string) => {
        const str = String(dateStr).trim()
        const direct = new Date(str)
        if (!isNaN(direct.getTime())) return direct.getTime()
        
        // Convert "YYYY-MM-DD HH:mm:ss..." to "YYYY-MM-DDT...Z"
        let formatted = str.replace(' ', 'T')
        
        // Handle postgres +00 timezone format to +00:00 or append Z
        if (formatted.match(/[+-]\d{2}$/)) {
          formatted = formatted + ':00'
        } else if (!formatted.includes('Z') && !formatted.includes('+') && !formatted.includes('-')) {
          formatted = formatted + 'Z'
        }
        
        const secondTry = new Date(formatted)
        if (!isNaN(secondTry.getTime())) return secondTry.getTime()
        
        // Fallback: manual parsing
        const match = str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/)
        if (match) {
          return Date.UTC(
            parseInt(match[1], 10),
            parseInt(match[2], 10) - 1,
            parseInt(match[3], 10),
            parseInt(match[4], 10),
            parseInt(match[5], 10),
            parseInt(match[6], 10)
          )
        }
        return 0
      }

      const launchDate = parseDbDate(pack.created_at)
      if (launchDate === 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
      }

      const expiryDate = launchDate + 10 * 24 * 60 * 60 * 1000 // 10 days in ms
      const now = new Date().getTime()
      const difference = expiryDate - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const calculated = calculateTimeLeft()
      setTimeLeft(calculated)
      if (calculated.isExpired) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [pack.created_at, pack.is_downloadable])

  const vId = React.useMemo(() => {
    if (!pack.video_url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = pack.video_url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [pack.video_url])

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Link href="/browse" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Mobile Order 1: Video Preview & Technical Specs */}
        <div className="lg:col-span-8 space-y-10 order-1 lg:order-2">
          {vId ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 bg-studio-neon shadow-[0_0_10px_#a6e22e]" />
                <h2 className="text-lg font-black uppercase tracking-tighter">Demo</h2>
              </div>
              <div className="aspect-video rounded-sm overflow-hidden border-2 border-white/5 bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${vId}?rel=0&modestbranding=1`}
                  title={`${pack.name} Preview`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-sm border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/10">
               <PlayCircle size={48} strokeWidth={1} />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Preview Signal Found</p>
            </div>
          )}

          {/* Technical Specs / Features - Shown on mobile here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
             <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-neon">Technical Specifications</h3>
                <ul className="space-y-2 text-[10px] font-bold text-white/40 uppercase">
                   <li>• Format: Professional 24-Bit / 44.1kHz WAV</li>
                   <li>• Compatibility: All DAWs (FL Studio, Ableton, Logic, etc.)</li>
                   <li>• License: Personal & Commercial Royalty-Free</li>
                   <li>• Delivery: Secure Digital Download</li>
                </ul>
             </div>
             <div className="space-y-4 hidden md:block">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-yellow">Production Details</h3>
                <p className="text-[10px] font-medium text-white/40 leading-relaxed uppercase">
                   Expertly mixed and mastered using industry-standard equipment. Designed to cut through the mix and provide instant inspiration for modern music producers.
                </p>
             </div>
          </div>
        </div>

        {/* Mobile Order 2: Name & Purchase */}
        <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
          <div className="aspect-square relative rounded-sm overflow-hidden border border-white/5 shadow-2xl group/image">
            <Image 
              src={getOptimizedImageUrl(pack.cover_url, 800, 90)} 
              alt={`${pack.name} - Premium Indian Sample Pack | SamplesWala`} 
              fill 
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute top-4 right-4 z-20">
               <ShareButton 
                 title={pack.name} 
                 text={`Check out ${pack.name} on SamplesWala!`} 
                 url={typeof window !== 'undefined' ? window.location.href : ''}
                 className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/20 hover:bg-studio-red hover:border-studio-red hover:rotate-12"
               />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {pack.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[12px] text-white/50 line-through font-bold">
                    ₹{pack.mrp_inr || (Number(pack.price_inr) * 3)}
                  </span>
                  <p className="text-3xl font-black text-studio-neon uppercase italic tracking-widest leading-none">
                    ₹{pack.price_inr}
                  </p>
                </div>
                <div className="bg-studio-red px-3 py-1 rounded-sm shadow-[4px_4px_0px_black] rotate-2 flex flex-col items-center">
                  <span className="text-[11px] font-black text-white uppercase italic">
                    {Math.round((1 - (Number(pack.price_inr) / (pack.mrp_inr || (Number(pack.price_inr) * 3)))) * 100)}% OFF
                  </span>
                  {!pack.is_downloadable && (
                    <span className={`text-[7px] font-black uppercase tracking-tighter px-2 rounded-sm mt-0.5 ${timeLeft?.isExpired ? 'bg-studio-red text-white' : 'bg-white text-studio-red'}`}>
                      {timeLeft?.isExpired ? 'Pre-Order Ended' : 'Pre-order Offer'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex flex-col gap-3">
                {owned ? (
                  pack.is_downloadable ? (
                    <DownloadButton itemId={pack.id} />
                  ) : (
                    <div className="w-full p-8 bg-studio-neon/5 border-2 border-studio-neon/20 border-dashed rounded-sm text-center space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Zap size={40} className="text-studio-neon" />
                      </div>
                      <p className="text-[12px] font-black uppercase tracking-[0.2em] text-studio-neon italic">Pre-ordered Successfully!</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                        This pack is currently in production.<br/>We will notify you via email once it's available for download.
                      </p>
                    </div>
                  )
                ) : timeLeft?.isExpired ? (
                  <div className="w-full p-6 bg-studio-red/5 border-2 border-studio-red/20 border-dashed rounded-sm text-center space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Zap size={40} className="text-studio-red animate-pulse" />
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-studio-red italic">PRE-ORDER OFFER EXPIRED</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                      This exclusive pre-order offer has ended.<br/>Sign up or stay tuned for the official release!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {!pack.is_downloadable && (
                      <div className="bg-studio-red p-3 rounded-sm mb-1 border-2 border-black shadow-[4px_4px_0px_black] rotate-1">
                        <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] animate-pulse text-center">
                          🔥 PRE-ORDER OFFER: SECURE THIS PRICE NOW!
                        </p>
                      </div>
                    )}
                    {timeLeft && !timeLeft.isExpired && (
                      <div className="p-4 rounded-sm border-2 border-black shadow-[4px_4px_0px_black] bg-studio-neon/10 text-studio-neon border-studio-neon mb-1">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <Zap size={14} className="text-studio-neon animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white">Pre-Order Offer Ends In:</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center font-mono text-white">
                          <div className="bg-black/60 p-1.5 border border-white/10 rounded-sm">
                            <span className="text-base font-black block leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="text-[6px] font-bold text-white/40 uppercase tracking-wider">Days</span>
                          </div>
                          <div className="bg-black/60 p-1.5 border border-white/10 rounded-sm">
                            <span className="text-base font-black block leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-[6px] font-bold text-white/40 uppercase tracking-wider">Hours</span>
                          </div>
                          <div className="bg-black/60 p-1.5 border border-white/10 rounded-sm">
                            <span className="text-base font-black block leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-[6px] font-bold text-white/40 uppercase tracking-wider">Mins</span>
                          </div>
                          <div className="bg-black/60 p-1.5 border border-white/10 rounded-sm">
                            <span className="text-base font-black block leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-[6px] font-bold text-white/40 uppercase tracking-wider">Secs</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <AddToCartButton 
                      label={!pack.is_downloadable ? "Pre-order" : undefined}
                      item={{
                        id: pack.id,
                        name: pack.name,
                        price: Number(pack.price_inr),
                        slug: pack.slug,
                        cover_url: pack.cover_url || undefined,
                        type: 'pack'
                      }} 
                    />
                    <PaymentButton 
                      label={!pack.is_downloadable ? `PRE-ORDER NOW — ₹${pack.price_inr}` : undefined}
                      packId={pack.id} 
                      packName={pack.name} 
                      price={Number(pack.price_inr)} 
                      slug={pack.slug}
                      cover_url={pack.cover_url || ''}
                      userId={user?.id}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Order 3: Description & Details */}
        <div className="lg:col-span-12 lg:grid lg:grid-cols-12 gap-12 order-3">
          <div className="lg:col-span-8 space-y-8">
            <p className="text-xs text-white/80 leading-relaxed font-medium bg-black/40 backdrop-blur-md p-6 border border-white/10 rounded-sm whitespace-pre-wrap">
              {pack.description || "No description available for this collection."}
            </p>
          </div>
          
          <div className="lg:col-span-4 space-y-8 mt-8 lg:mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-sm space-y-1">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Type</span>
                <p className="text-[10px] font-bold uppercase text-white">{pack.categories?.[0]?.name || 'Artifacts'}</p>
              </div>
              <div className="p-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-sm space-y-1">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Quality</span>
                <p className="text-[10px] font-bold uppercase text-white">24-Bit WAV</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 py-4 border-t border-white/5">
               <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
                 <ShieldCheck size={14} className="text-studio-neon" />
                 100% Royalty Free
               </div>
               <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
                 <Zap size={14} className="text-studio-yellow" />
                 Immediate Access
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-12 border-t border-white/5 space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-studio-yellow shadow-[0_0_10px_rgba(255,200,0,0.5)]" />
          <h2 className="text-lg font-black uppercase tracking-tighter italic">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-4xl space-y-4">
          {[
            {
              q: "Is this compatible with FL Studio?",
              a: "Yes! Our samples are professional 24-bit WAV files, compatible with all DAWs including FL Studio, Ableton Live, Logic Pro, Cubase, and more."
            },
            {
              q: "Where is my download link?",
              a: "Delivery is instant. You will get a download link on the screen immediately after payment, and a backup link will be sent to your registered email."
            },
            {
              q: "Will I get an official invoice?",
              a: "Yes, a digital invoice is automatically generated for every purchase and sent to your email for your records."
            },
            {
              q: "Are these sounds royalty-free?",
              a: "Absolutely. Every sound you buy from Samples Wala is 100% royalty-free for use in your commercial music productions without any attribution."
            }
          ].map((faq, idx) => (
            <div key={idx} className="border-2 border-black shadow-[4px_4px_0px_black] bg-studio-charcoal">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/20'}`}>
                    <HelpCircle size={20} />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/80 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                </div>
                
                <motion.div
                  animate={{ rotate: activeFaq === idx ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: "circOut" }}
                  className={`flex-shrink-0 transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/40 group-hover:text-white'}`}
                >
                  <Plus size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 px-6 pl-14">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Guide - ABSOLUTE BOTTOM */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5 pb-12">
         <div className="space-y-4 p-8 bg-black/40 border border-white/10 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="text-studio-pink" size={20} />
               <h3 className="text-[12px] font-black uppercase tracking-widest text-studio-pink">Pro Tip</h3>
            </div>
            <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
               For best results, use high-quality monitors or headphones to hear the full frequency range. Organize your library by bpm and key for faster workflow.
            </p>
         </div>
         <div className="space-y-4 p-8 bg-black/40 border border-white/10 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
               <Download className="text-studio-yellow" size={20} />
               <h3 className="text-[12px] font-black uppercase tracking-widest text-studio-yellow">Installation Guide</h3>
            </div>
            <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
               1. Extract the downloaded ZIP file.<br />
               2. Drag the folder into your DAW's browser or sample library.<br />
               3. Add the folder to your 'Places' for quick access.<br />
               4. Start creating!
            </p>
         </div>
      </section>
    </div>
  )
}
