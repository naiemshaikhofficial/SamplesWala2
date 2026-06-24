'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Youtube, Download, ShieldCheck, Zap, Music, ShoppingBag, CheckCircle2, Layout, HelpCircle, Plus, Check, CreditCard, Loader2 } from 'lucide-react'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ShareButton } from '@/components/ShareButton'
import { DownloadButton } from '@/components/DownloadButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useCart } from '@/context/CartContext'

interface PresetDetailClientProps {
  preset: any
  isFree: boolean
  vId: string | null
}

function FormattedDescription({ text }: { text: string }) {
  if (!text) return <p className="text-xs text-white/50">No description available.</p>;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-none space-y-2.5 my-3.5 pl-5">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      elements.push(<div key={`spacer-${index}`} className="h-4" />);
      return;
    }

    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const content = trimmed.substring(1).trim();
      currentList.push(
        <li key={`li-${index}`} className="flex items-start gap-2 text-[13px] text-white/80 font-medium">
          <span className="text-studio-neon mt-1 flex-shrink-0 text-xs">⚡</span>
          <span>{content}</span>
        </li>
      );
    } else {
      flushList();
      const hasEmoji = /^[^\w\s\d]/.test(trimmed);
      if (hasEmoji) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-[13px] font-black uppercase tracking-wider text-studio-yellow mt-5 mb-2.5 font-mono flex items-center gap-2">
            {trimmed}
          </h3>
        );
      } else {
        elements.push(
          <p key={`p-${index}`} className="text-[13px] text-white/95 leading-relaxed mb-3.5 font-medium">
            {trimmed}
          </p>
        );
      }
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export function PresetDetailClient({ preset, isFree, vId }: PresetDetailClientProps) {
  const { user } = useAuth()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [isOwned, setIsOwned] = useState(false)
  const { formatPrice, getAmount } = useCurrency()

  const [showFloatingBar, setShowFloatingBar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const faqRef = React.useRef<HTMLElement>(null)
  const router = useRouter()
  const { addItem, items: cartItems, setSidebarOpen } = useCart()
  const isAlreadyInCart = cartItems.some(i => i.id === preset.id)
  const [added, setAdded] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/auth/ownership?itemId=${preset.id}`)
        .then(res => res.ok ? res.json() : { owned: false })
        .then(data => setIsOwned(data.owned))
        .catch(() => setIsOwned(false))
    } else {
      setIsOwned(false)
    }
  }, [user?.id, preset.id])

  useEffect(() => {
    const handleScroll = () => {
      const isMobileDevice = window.innerWidth < 1024
      if (isMobileDevice) {
        if (window.scrollY > 300) {
          setShowFloatingBar(true)
        } else {
          setShowFloatingBar(false)
        }
      } else {
        if (faqRef.current) {
          const rect = faqRef.current.getBoundingClientRect()
          // Show floating bar exactly when the FAQ section header reaches the upper part of viewport (rect.top < 300)
          if (rect.top < 300) {
            setShowFloatingBar(true)
          } else {
            setShowFloatingBar(false)
          }
        } else {
          if (window.scrollY > 800) {
            setShowFloatingBar(true)
          } else {
            setShowFloatingBar(false)
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFloatingAddToCart = () => {
    if (isAlreadyInCart) {
      setSidebarOpen(true)
      return
    }
    addItem({
      id: preset.id,
      name: preset.name,
      price: Number(preset.price_inr),
      price_usd: preset.price_usd ? Number(preset.price_usd) : undefined,
      slug: preset.slug,
      cover_url: preset.cover_url || undefined,
      type: 'preset'
    })
    setAdded(true)
    setSidebarOpen(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleFloatingBuyNow = async () => {
    setBuyLoading(true)
    setSidebarOpen(false)
    if (!isAlreadyInCart) {
      addItem({
        id: preset.id,
        name: preset.name,
        price: Number(preset.price_inr),
        price_usd: preset.price_usd ? Number(preset.price_usd) : undefined,
        slug: preset.slug,
        cover_url: preset.cover_url || undefined,
        type: 'preset'
      })
    }
    router.push('/checkout')
  }

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
              <div className="inline-block px-3 py-1 bg-[#FFE600] text-black text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#FF3131] rounded-sm -rotate-2">
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
                    <div key={daw} className="px-4 py-2 bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_#FF3131] rounded-sm flex items-center gap-2">
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
                  <div id="main-buy-button-container" className="grid grid-cols-1 gap-4">
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

            <div className="bg-black/40 backdrop-blur-md p-6 border border-white/10 rounded-sm">
               <FormattedDescription text={preset.description || `Take your sound to the next level with ${preset.name}. Professionally crafted for high-quality music production.`} />
            </div>

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
      <section id="faq-section" ref={faqRef} className="pt-12 border-t border-white/5 space-y-8">
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

      {/* Floating Sticky CTA Bar */}
      <AnimatePresence>
        {showFloatingBar && !isOwned && mounted && (
          <div 
            className="fixed left-0 right-0 z-50 pointer-events-none" 
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="pointer-events-auto w-full relative"
              >
                {/* Animated shadow backdrop */}
                <motion.div
                  className="absolute inset-0 bg-[#00BFFF] border-2 border-black rounded-full"
                  animate={{ 
                    x: [3, 7, 3],
                    y: [3, 7, 3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Foreground Yellow Capsule */}
                <div
                  className="relative w-full bg-[#FFE600] border-2 border-black rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between gap-3 md:gap-6 group/float-bar"
                >
                  {/* Product Image and info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                      <Image
                        src={preset.cover_url || '/placeholder.jpg'}
                        alt={preset.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-black text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[120px] sm:max-w-[250px] lg:max-w-none">
                        {preset.name.split(/[-–—]/)[0].trim()}
                      </span>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    {preset.mrp_inr && (
                      <span className="text-[9px] md:text-xs text-black/50 line-through font-bold">
                        {formatPrice(preset.mrp_inr, preset.price_usd ? Number(preset.price_usd) * 3 : null)}
                      </span>
                    )}
                    <span className="text-xs md:text-sm font-black text-black leading-none italic uppercase tracking-wider">
                      {preset.price_inr === 0 ? 'FREE' : formatPrice(preset.price_inr, preset.price_usd)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 md:gap-2 flex-1 sm:flex-initial justify-end">
                    {/* Add to Cart Button - Green Pill */}
                    <button
                      onClick={handleFloatingAddToCart}
                      className={`h-9 w-9 sm:w-auto sm:px-5 font-black uppercase tracking-wider text-[8px] md:text-[10px] flex items-center justify-center sm:gap-1.5 rounded-full transition-all cursor-pointer border-2 border-black shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex-shrink-0 ${
                        isAlreadyInCart
                          ? 'bg-black/10 text-black border-black/20 shadow-none'
                          : 'bg-[#00FF94] text-black hover:bg-white'
                      }`}
                    >
                      {isAlreadyInCart ? (
                        <>
                          <Check size={12} />
                          <span className="hidden sm:inline">In Cart</span>
                        </>
                      ) : added ? (
                        <>
                          <Check size={12} />
                          <span className="hidden sm:inline">Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={12} />
                          <span className="hidden sm:inline">Add to cart</span>
                        </>
                      )}
                    </button>

                    {/* Buy Now Button - Black Pill with comic shadow */}
                    <button
                      disabled={buyLoading}
                      onClick={handleFloatingBuyNow}
                      className="h-9 px-6 sm:px-5 bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-wider text-[8px] md:text-[10px] flex items-center justify-center gap-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_black] transition-all duration-300 active:scale-95 disabled:opacity-50 flex-1 sm:flex-initial max-w-[140px] sm:max-w-none"
                    >
                      {buyLoading ? (
                        <Loader2 className="animate-spin" size={12} />
                      ) : (
                        <>
                          <CreditCard size={12} />
                          <span>{isFree ? 'GET FREE' : 'Buy Now'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
