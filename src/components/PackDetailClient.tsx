'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, PlayCircle, ShieldCheck, Zap, CheckCircle2, Headphones } from 'lucide-react'
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

  const videoId = React.useCallback((url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [])

  const vId = React.useMemo(() => videoId(pack.video_url), [pack.video_url, videoId])

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
              src={getOptimizedImageUrl(pack.cover_url, 1200, 90)} 
              alt={`${pack.name} Premium Sample Pack Cover - Samples Wala`} 
              fill 
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-500 group-hover/image:scale-105"
              priority
            />
            <div className="absolute top-4 right-4 z-20">
              <ShareButton 
                title={pack.name} 
                text={`Check out this premium sample pack: ${pack.name}`} 
                url={typeof window !== 'undefined' ? window.location.href : ''} 
                className="!h-12 !w-12 bg-black/60 backdrop-blur-xl border-white/20 hover:bg-black/80 hover:border-studio-neon/50 shadow-2xl"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-6">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-[0.9] max-w-xl">{pack.name}</h1>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3 bg-studio-yellow/10 px-3 py-1 border border-studio-yellow/20 rounded-sm">
                  <span className="text-[10px] text-white/40 line-through font-bold tracking-widest">
                    ₹{pack.mrp_inr || (Number(pack.price_inr) * 3)}
                  </span>
                  <span className="text-[12px] font-black text-studio-yellow uppercase italic">
                    {Math.round((1 - (Number(pack.price_inr) / (pack.mrp_inr || (Number(pack.price_inr) * 3)))) * 100)}% OFF
                  </span>
                </div>
                <div className="text-5xl font-black text-studio-neon italic drop-shadow-[0_0_15px_rgba(166,226,46,0.3)]">
                  ₹{pack.price_inr}
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
                      <>
                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                          <div className="flex-1">
                            <AddToCartButton 
                              item={{
                                id: pack.id,
                                name: pack.name,
                                price: Number(pack.price_inr),
                                slug: pack.slug,
                                cover_url: pack.cover_url || undefined
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
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Trust Stack Section */}
              <div className="mt-8 space-y-4 border-t border-white/5 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 group/trust">
                    <div className="w-8 h-8 rounded-sm bg-studio-neon/10 border border-studio-neon/20 flex items-center justify-center group-hover/trust:bg-studio-neon group-hover/trust:text-black transition-all">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tight">Secure Checkout</span>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Via Razorpay & PayPal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/trust">
                    <div className="w-8 h-8 rounded-sm bg-studio-yellow/10 border border-studio-yellow/20 flex items-center justify-center group-hover/trust:bg-studio-yellow group-hover/trust:text-black transition-all">
                      <Zap size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tight">Instant Delivery</span>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Direct to your Email</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/trust">
                    <div className="w-8 h-8 rounded-sm bg-studio-blue/10 border border-studio-blue/20 flex items-center justify-center group-hover/trust:bg-studio-blue group-hover/trust:text-black transition-all">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tight">100% Royalty Free</span>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Commercial Use Ready</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/trust">
                    <div className="w-8 h-8 rounded-sm bg-studio-pink/10 border border-studio-pink/20 flex items-center justify-center group-hover/trust:bg-studio-pink group-hover/trust:text-white transition-all">
                      <Headphones size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tight">High Quality</span>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">24-Bit / 44.1kHz Wav</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Preview (Order 2 on Mobile, Right Column on Desktop) */}
        <div className="lg:col-span-8 space-y-10 order-2 lg:row-span-2">
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

        {/* Description & Details (Order 3 on Mobile, under Top Info on Desktop) */}
        <div className="lg:col-span-4 space-y-8 order-3">
          <p className="text-xs text-white/60 leading-relaxed font-medium bg-white/[0.02] p-4 border border-white/5 rounded-sm whitespace-pre-wrap">
            {pack.description || "No description available for this collection."}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded-sm space-y-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Type</span>
              <p className="text-[10px] font-bold uppercase">{pack.categories?.[0]?.name || 'Artifacts'}</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-sm space-y-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Quality</span>
              <p className="text-[10px] font-bold uppercase">24-Bit WAV</p>
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
        </div>
      </div>
    </div>
  )
}
