'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, PlayCircle, ShieldCheck, Zap, CheckCircle2, Headphones, HelpCircle, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DownloadButton } from '@/components/DownloadButton'
import { PaymentButton } from '@/components/PaymentButton'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ShareButton } from '@/components/ShareButton'
import Link from 'next/link'
import { clientCache } from '@/lib/clientCache'
import { getOptimizedImageUrl } from '@/lib/images'

export function PackDetailClient({ initialPack, owned, user }: { initialPack: any, owned: boolean, user: any }) {
  // Use prop directly to avoid unnecessary re-renders
  const pack = initialPack
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

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
        {/* Top Info: Name & Purchase (Order 1 on Mobile) */}
        <div className="lg:col-span-4 space-y-8 order-1">
          <div className="aspect-square relative rounded-sm overflow-hidden border border-white/5 shadow-2xl group/image">
            <Image 
              src={getOptimizedImageUrl(pack.cover_url, 800, 90)} 
              alt={pack.name} 
              fill 
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
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
                <div className="bg-studio-yellow px-3 py-1 rounded-sm shadow-[4px_4px_0px_black] rotate-2">
                  <span className="text-[11px] font-black text-black uppercase italic">
                    {Math.round((1 - (Number(pack.price_inr) / (pack.mrp_inr || (Number(pack.price_inr) * 3)))) * 100)}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-studio-blue animate-pulse shadow-[0_0_10px_#00BFFF]" />
                  <span className="text-[9px] font-black text-studio-blue uppercase tracking-[0.2em]">Limited Time Offer</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              {!pack.is_downloadable ? (
                <div className="w-full h-14 bg-white/5 border border-dashed border-white/20 rounded-sm flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">Coming Soon</span>
                </div>
              ) : (
                <div className="flex items-stretch gap-3">
                  <div className="flex-grow">
                    {owned ? (
                      <DownloadButton packId={pack.id} />
                    ) : (
                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="flex-1">
                          <AddToCartButton 
                            item={{
                              id: pack.id,
                              name: pack.name,
                              price: Number(pack.price_inr),
                              slug: pack.slug,
                              cover_url: pack.cover_url || undefined,
                              type: 'pack'
                            }} 
                          />
                        </div>
                        <div className="flex-1">
                          <PaymentButton 
                            packId={pack.id} 
                            packName={pack.name} 
                            price={Number(pack.price_inr)} 
                            slug={pack.slug}
                            cover_url={pack.cover_url || ''}
                            userId={user?.id}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Video Preview & Technical Specs (Order 2 on Mobile, Center Column on Desktop) */}
        <div className="lg:col-span-8 space-y-10 order-2">
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

          {/* Technical Specs / Features */}
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
             <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-yellow">Production Details</h3>
                <p className="text-[10px] font-medium text-white/40 leading-relaxed uppercase">
                   Expertly mixed and mastered using industry-standard equipment. Designed to cut through the mix and provide instant inspiration for modern music producers.
                </p>
             </div>
          </div>
        </div>

        {/* Description & Details (Order 3 on Mobile, Bottom Right on Desktop) */}
        <div className="lg:col-span-4 space-y-8 order-3">
          <p className="text-xs text-white/80 leading-relaxed font-medium bg-black/40 backdrop-blur-md p-6 border border-white/10 rounded-sm whitespace-pre-wrap">
            {pack.description || "No description available for this collection."}
          </p>

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
          
          <div className="flex items-center justify-center gap-6 py-2 border-t border-white/5">
             <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
               <ShieldCheck size={14} className="text-studio-neon" />
               100% Royalty Free
             </div>
             <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
               <Zap size={14} className="text-studio-yellow" />
               Immediate Access
             </div>
          </div>

          {/* Trust Stack Section - Compact 1-Line Layout */}
          <div className="mt-8 border-t border-white/5 pt-8">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center text-center gap-2 group/trust">
                <div className="w-8 h-8 rounded-sm bg-studio-neon/10 border border-studio-neon/20 flex items-center justify-center group-hover/trust:bg-studio-neon group-hover/trust:text-black transition-all">
                  <ShieldCheck size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-tight">Secure</span>
                  <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter">Checkout</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-2 group/trust">
                <div className="w-8 h-8 rounded-sm bg-studio-yellow/10 border border-studio-yellow/20 flex items-center justify-center group-hover/trust:bg-studio-yellow group-hover/trust:text-black transition-all">
                  <Zap size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-tight">Instant</span>
                  <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter">Delivery</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-2 group/trust">
                <div className="w-8 h-8 rounded-sm bg-studio-blue/10 border border-studio-blue/20 flex items-center justify-center group-hover/trust:bg-studio-blue group-hover/trust:text-black transition-all">
                  <CheckCircle2 size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-tight">100%</span>
                  <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter">Royalty Free</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-2 group/trust">
                <div className="w-8 h-8 rounded-sm bg-studio-pink/10 border border-studio-pink/20 flex items-center justify-center group-hover/trust:bg-studio-pink group-hover/trust:text-white transition-all">
                  <Headphones size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-tight">High</span>
                  <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter">Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Netflix Style Accordion */}
      <div className="pt-12 border-t border-white/5 space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-studio-yellow shadow-[0_0_10px_rgba(255,200,0,0.5)]" />
          <h2 className="text-lg font-black uppercase tracking-tighter">Frequently Asked Questions</h2>
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
            <div key={idx} className="border-b border-white/5 last:border-0">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full py-6 flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/20'}`}>
                    <HelpCircle size={20} />
                  </div>
                  <span className={`text-sm md:text-base font-black uppercase tracking-tight transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/80 group-hover:text-white'}`}>
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
                    <div className="pb-8 pl-9">
                      <p className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed">
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
    </div>
  )
}
