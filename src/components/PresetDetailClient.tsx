'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Youtube, Download, ShieldCheck, Zap, Music, ShoppingBag, CheckCircle2, Layout, HelpCircle, Plus } from 'lucide-react'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ShareButton } from '@/components/ShareButton'
import { DownloadButton } from '@/components/DownloadButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'

interface PresetDetailClientProps {
  preset: any
  isFree: boolean
  vId: string | null
}

export function PresetDetailClient({ preset, isFree, vId }: PresetDetailClientProps) {
  const { user } = useAuth()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [isOwned, setIsOwned] = useState(false)
  const { formatPrice, getAmount } = useCurrency()

  useEffect(() => {
    if (user) {
      fetch(`/api/auth/ownership?itemId=${preset.id}`)
        .then(res => res.ok ? res.json() : { owned: false })
        .then(data => setIsOwned(data.owned))
        .catch(() => setIsOwned(false))
    } else {
      setIsOwned(false)
    }
  }, [user, preset.id])

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Link href="/browse/presets" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-pink transition-colors group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Presets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Mobile: 1. Video Preview | Desktop: Right Column */}
        <div className="lg:col-span-7 lg:order-2 space-y-8">
           {vId ? (
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-studio-pink shadow-[0_0_10px_#ff0080]" />
                    <h2 className="text-lg font-black uppercase tracking-tighter italic">Preset Demo</h2>
                 </div>
                 <div className="aspect-video rounded-sm overflow-hidden border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${vId}?rel=0&modestbranding=1`}
                      title={`${preset.name} Demo`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                 </div>
              </div>
           ) : (
              <div className="aspect-video rounded-sm border-4 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/10">
                 <Music size={64} strokeWidth={1} />
                 <p className="text-xs font-black uppercase tracking-[0.4em]">Audio preview coming soon</p>
              </div>
           )}
        </div>

        {/* Mobile: 2. Info & Actions | Desktop: Left Column */}
        <div className="lg:col-span-5 lg:order-1 space-y-8 lg:sticky lg:top-24">
           <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-studio-pink text-white text-[10px] font-black uppercase tracking-widest jagged-border -rotate-2">
                {preset.type}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {preset.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  {preset.mrp_inr && (
                    <span className="text-sm text-white/40 line-through font-bold">
                      {formatPrice(preset.mrp_inr, preset.price_usd ? Number(preset.price_usd) * 3 : null)}
                    </span>
                  )}
                  <p className="text-3xl font-black text-studio-neon uppercase italic tracking-widest">
                    {preset.price_inr === 0 ? 'FREE' : formatPrice(preset.price_inr, preset.price_usd)}
                  </p>
                </div>
                {preset.mrp_inr && preset.price_inr > 0 && (
                  <div className="bg-studio-red px-3 py-1 rounded-sm shadow-[4px_4px_0px_black] rotate-2">
                    <span className="text-[11px] font-black text-white uppercase italic">
                      {Math.round((1 - (getAmount(preset.price_inr, preset.price_usd) / getAmount(preset.mrp_inr, preset.price_usd ? Number(preset.price_usd) * 3 : null))) * 100)}% OFF
                    </span>
                  </div>
                )}
                {preset.price_inr === 0 && (
                   <div className="px-3 py-1 bg-studio-yellow text-black text-[10px] font-black uppercase tracking-widest jagged-border rotate-2">
                      COMMUNITY GIFT
                   </div>
                )}
              </div>
           </div>

           {/* Compatibility */}
           <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-neon">Compatibility</h3>
              <div className="flex flex-wrap gap-3">
                 {preset.daws.map((daw: string) => (
                    <div key={daw} className="px-4 py-2 bg-white/5 border-2 border-black shadow-[4px_4px_0px_black] rounded-sm flex items-center gap-2">
                       {daw === 'FL Studio' && (
                          <div className="relative w-4 h-4">
                             <Image src="/logos/Fl-Studio.png" alt="FL Studio" fill sizes="16px" className="object-contain" />
                          </div>
                       )}
                       <span className="text-[10px] font-black uppercase">{daw}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Purchase Buttons */}
           <div className="pt-4">
              {isOwned ? (
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-studio-neon font-black uppercase tracking-widest text-[10px]">
                       <CheckCircle2 size={16} />
                       You own this preset
                    </div>
                    <DownloadButton itemId={preset.id} type="preset" />
                 </div>
              ) : (
                  <div className="grid grid-cols-1 gap-4">
                     <AddToCartButton 
                       item={{
                         id: preset.id,
                         name: preset.name,
                         price: Number(preset.price_inr),
                         price_usd: preset.price_usd ? Number(preset.price_usd) : undefined,
                         slug: preset.slug,
                         cover_url: preset.cover_url || undefined,
                         type: 'preset'
                       }} 
                     />
                     <Link 
                        href={`/checkout?direct=${preset.id}&type=preset`}
                        className="w-full h-14 md:h-16 bg-studio-neon text-black font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-3 md:gap-4 hover:bg-white transition-all shadow-[4px_4px_0px_black] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] border-4 border-black"
                     >
                        <Zap size={18} className="md:w-5 md:h-5" fill="currentColor" />
                        {isFree ? 'GET FOR FREE' : `BUY NOW — ${formatPrice(preset.price_inr, preset.price_usd)}`}
                     </Link>
                  </div>
               )}
               
               <div className="pt-2">
                 <ShareButton title={preset.name} text={`Check out this ${preset.type} preset on SamplesWala: ${preset.name}`} />
               </div>
           </div>

           <p className="text-xs text-white/60 leading-relaxed font-medium bg-black/40 backdrop-blur-md p-6 border border-white/10 rounded-sm">
              {preset.description || `Take your sound to the next level with ${preset.name}. Professionally crafted for high-quality music production.`}
           </p>

           {/* Plugins Used Section - Moved Below Description & Compact for Mobile */}
           {preset.plugins_used && preset.plugins_used.flat().length > 0 && (
             <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="h-5 w-1 bg-studio-neon shadow-[0_0_10px_#a6e22e]" />
                   <h2 className="text-sm font-black uppercase tracking-tighter italic">Plugins Used</h2>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                   {preset.plugins_used.flat().map((plugin: string, i: number) => {
                      const colors = [
                        { bg: 'bg-studio-neon', shadow: 'shadow-[3px_3px_0px_#a6e22e]', text: 'text-black' },
                        { bg: 'bg-studio-pink', shadow: 'shadow-[3px_3px_0px_#ff0080]', text: 'text-white' },
                        { bg: 'bg-studio-yellow', shadow: 'shadow-[3px_3px_0px_#ffc800]', text: 'text-black' }
                      ];
                      const style = colors[i % colors.length];
                      return (
                        <div 
                          key={plugin} 
                          className={`p-2 ${style.bg} border-2 border-black ${style.shadow} flex flex-col gap-0.5 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_black] active:translate-x-0 active:translate-y-0 active:shadow-none`}
                        >
                           <span className={`text-[8px] md:text-[10px] font-black uppercase ${style.text} tracking-tight leading-tight truncate`}>{plugin}</span>
                           <span className={`text-[5px] md:text-[7px] font-black ${style.text} opacity-40 uppercase tracking-tighter`}>Required</span>
                        </div>
                      );
                   })}
                </div>
             </div>
           )}

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

      {/* FAQ Section */}
      <section className="pt-12 border-t border-white/5 space-y-8">
         <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-studio-yellow shadow-[0_0_10px_#FFE600]" />
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">Common Questions</h2>
         </div>
         
         <div className="max-w-4xl space-y-4">
            {[
               { q: "Are these presets royalty-free?", a: "Yes, 100%. You can use these presets in your commercial projects, songs, and background scores without any additional payments or attribution." },
               { q: "What if I use a different DAW?", a: `Presets are DAW-specific. If you use a different DAW than ${preset.daws.join(' & ')}, the files will not work. We strongly suggest checking compatibility before purchasing to ensure the presets work for you.` },
               { q: "Do I need external plugins?", a: "Yes, you might need external plugins depending on the preset. You'll be able to see the full list of required plugins once you drag and drop or apply the preset in your DAW." },
               { q: "How do I get the files after purchase?", a: "Immediately after your payment is successful, you'll receive an email with a download link. You can also access all your purchases in 'Your Library'." }
            ].map((faq, i) => (
              <div key={i} className="border-2 border-black shadow-[4px_4px_0px_black] bg-studio-charcoal">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`transition-colors duration-300 ${activeFaq === i ? 'text-studio-yellow' : 'text-white/20'}`}>
                      <HelpCircle size={20} />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${activeFaq === i ? 'text-studio-yellow' : 'text-white/80 group-hover:text-white'}`}>
                      {faq.q}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className={`flex-shrink-0 transition-colors duration-300 ${activeFaq === i ? 'text-studio-yellow' : 'text-white/40 group-hover:text-white'}`}
                  >
                    <Plus size={24} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeFaq === i && (
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
      </section>

      {/* Installation Guide - ABSOLUTE BOTTOM */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5 pb-12">
         <div className="space-y-4 p-8 bg-black/40 border border-white/10 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="text-studio-pink" size={20} />
               <h3 className="text-[12px] font-black uppercase tracking-widest text-studio-pink">Pro Tip</h3>
            </div>
            <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
               For best results, make sure you have the latest versions of both stock and external plugins installed. Always check your gain staging before applying vocal chains.
            </p>
         </div>
         <div className="space-y-4 p-8 bg-black/40 border border-white/10 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
               <Download className="text-studio-yellow" size={20} />
               <h3 className="text-[12px] font-black uppercase tracking-widest text-studio-yellow">Installation Guide</h3>
            </div>
            <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
               1. Extract the downloaded ZIP file.<br />
               2. Drag and drop the preset file directly onto your mixer bus.<br />
               3. The preset will be applied automatically.<br />
               4. Ensure you have the required plugins installed as mentioned.<br />
               5. Start creating!
            </p>
         </div>
      </section>

      {/* Mobile Sticky CTA Bar */}
      {!isOwned && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[10px] font-black uppercase text-white/50 truncate block max-w-[120px]">
              {preset.name}
            </span>
            <span className="text-xs font-black text-studio-neon leading-none mt-1">
              {preset.price_inr === 0 ? 'FREE' : formatPrice(preset.price_inr, preset.price_usd)}
            </span>
          </div>
          <div className="flex gap-2 flex-grow max-w-[220px] min-w-[160px]">
            <div className="flex-grow">
              <AddToCartButton 
                compact
                item={{
                  id: preset.id,
                  name: preset.name,
                  price: Number(preset.price_inr),
                  price_usd: preset.price_usd ? Number(preset.price_usd) : undefined,
                  slug: preset.slug,
                  cover_url: preset.cover_url || undefined,
                  type: 'preset'
                }} 
              />
            </div>
            <div className="flex-grow">
              <Link 
                 href={`/checkout?direct=${preset.id}&type=preset`}
                 className="w-full h-9 bg-studio-neon text-black font-black uppercase tracking-[0.1em] text-[8px] md:text-[9px] flex items-center justify-center gap-1.5 hover:bg-white transition-all shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] border-2 border-black rounded-sm"
              >
                 <Zap size={10} fill="currentColor" />
                 <span>{isFree ? 'GET FREE' : 'BUY NOW'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
