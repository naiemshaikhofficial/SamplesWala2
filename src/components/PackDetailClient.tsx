'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, PlayCircle, ShieldCheck, Zap } from 'lucide-react'
import { DownloadButton } from '@/components/DownloadButton'
import { PaymentButton } from '@/components/PaymentButton'
import { AddToCartButton } from '@/components/AddToCartButton'
import Link from 'next/link'
import { clientCache } from '@/lib/clientCache'
import { getOptimizedImageUrl } from '@/lib/images'

export function PackDetailClient({ initialPack, owned, user }: { initialPack: any, owned: boolean, user: any }) {
  const [pack, setPack] = useState(initialPack)

  useEffect(() => {
    // 1. Load from cache if exists (to show instant data if we navigate back)
    const cached = clientCache.get(`pack_${initialPack.slug}`)
    if (cached) {
      setPack(cached)
    }

    // 2. Cache the latest data
    clientCache.set(`pack_${initialPack.slug}`, initialPack)
  }, [initialPack])

  const videoId = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const vId = videoId(pack.video_url)

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Link href="/browse" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Pack Info Left */}
        <div className="lg:col-span-4 space-y-8">
          <div className="aspect-square relative rounded-sm overflow-hidden border border-white/5 shadow-2xl">
            <Image 
              src={getOptimizedImageUrl(pack.cover_url, 1200, 90)} 
              alt={pack.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
              priority
            />
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{pack.name}</h1>
              <div className="text-2xl font-black text-studio-neon">₹{pack.price_inr}</div>
            </div>

            <div className="pt-2">
              {!pack.is_downloadable ? (
                <div className="w-full h-14 bg-white/5 border border-dashed border-white/20 rounded-sm flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">Coming Soon</span>
                </div>
              ) : owned ? (
                <DownloadButton packId={pack.id} />
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-grow">
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
                  <div className="flex-grow">
                    <PaymentButton 
                      packId={pack.id} 
                      packName={pack.name} 
                      price={Number(pack.price_inr)} 
                      userId={user?.id}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-xs text-white/60 leading-relaxed font-medium bg-white/[0.02] p-4 border border-white/5 rounded-sm">
              {pack.description || "No description available for this collection."}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-sm space-y-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Type</span>
                <p className="text-[10px] font-bold uppercase">{pack.categories?.name || 'Artifacts'}</p>
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

        {/* Video Preview Right */}
        <div className="lg:col-span-8 space-y-10">
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
      </div>
    </div>
  )
}
