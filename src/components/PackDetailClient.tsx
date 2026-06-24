'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, PlayCircle, ShieldCheck, Zap, HelpCircle, Plus, Download, Clock, ShoppingBag, Check, CreditCard, Loader2, Music, Layers, Disc, SlidersHorizontal, Sparkles, Share2, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DownloadButton } from '@/components/DownloadButton'
import { PaymentButton } from '@/components/PaymentButton'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ShareButton } from '@/components/ShareButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPackPriceDetails } from '@/lib/pricing'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useCart } from '@/context/CartContext'


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

export function PackDetailClient({ initialPack }: { initialPack: any }) {
  const pack = initialPack
  const { user } = useAuth()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [owned, setOwned] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [mounted, setMounted] = useState(false)
  const { formatPrice, getAmount } = useCurrency()

  const [showFloatingBar, setShowFloatingBar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const { addItem, items: cartItems, setSidebarOpen } = useCart()
  const isAlreadyInCart = cartItems.some(i => i.id === pack.id)
  const [added, setAdded] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
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
    const handleScroll = () => {
      const faqEl = document.getElementById('faq-section')
      if (faqEl) {
        const rect = faqEl.getBoundingClientRect()
        // Show floating bar exactly when the FAQ section starts scrolling into view (rect.top < 350)
        if (rect.top < 350) {
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
      id: pack.id,
      name: pack.name,
      price: Number(pack.price_inr),
      price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
      slug: pack.slug,
      cover_url: pack.cover_url || undefined,
      type: 'pack',
      is_downloadable: pack.is_downloadable
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
        id: pack.id,
        name: pack.name,
        price: Number(pack.price_inr),
        price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
        slug: pack.slug,
        cover_url: pack.cover_url || undefined,
        type: 'pack',
        is_downloadable: pack.is_downloadable
      })
    }
    router.push('/checkout')
  }

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/auth/ownership?itemId=${pack.id}`)
        .then(res => res.ok ? res.json() : { owned: false })
        .then(data => setOwned(data.owned))
        .catch(() => setOwned(false))
    } else {
      setOwned(false)
    }
  }, [user?.id, pack.id])

  const priceDetails = React.useMemo(() => {
    return getPackPriceDetails(pack)
  }, [pack, now])

  const faqs = React.useMemo(() => {
    const list = [
      {
        q: "Is this compatible with FL Studio?",
        a: "Yes! Our samples are professional 24-bit WAV files, compatible with all DAWs including FL Studio, Ableton Live, Logic Pro, Cubase, and more."
      }
    ];

    if (!pack.is_downloadable) {
      list.push(
        {
          q: "How does the pre-order process work?",
          a: "By pre-ordering, you secure the pack at a highly discounted special price while it is in the studio. Once completed, the download link will automatically appear in your Library/Vault and we'll email you immediately."
        },
        {
          q: "Why does it take 1-2 months to deliver?",
          a: "Our sample packs are premium products featuring real musicians and live-recorded instruments. Post-production (editing, sound design, mixing, and mastering) is highly time-consuming because we are committed to delivering unmatched, commercial-grade sound quality. But we are trying hard to make it available as soon as possible!"
        },
        {
          q: "Can I get a refund on my pre-order?",
          a: "No, all pre-orders are strictly non-refundable and final, similar to our digital products. A refund will only be issued in the extremely rare event that the production is officially cancelled by SamplesWala."
        },
        {
          q: "How will I be notified when it's ready?",
          a: "We will notify you instantly via your registered email address and through our official social media channels. You'll be able to log in and download it instantly."
        }
      );
    } else {
      list.push({
        q: "Where is my download link?",
        a: "Delivery is instant. You will get a download link on the screen immediately after payment, and a backup link will be sent to your registered email."
      });
    }

    list.push(
      {
        q: "Will I get an official invoice?",
        a: "Yes, a digital tax invoice is automatically generated for every purchase and sent to your email for your records."
      },
      {
        q: "Are these sounds royalty-free?",
        a: "Absolutely. Every sound you buy from Samples Wala is 100% royalty-free for use in your commercial music productions without any attribution."
      }
    );

    return list;
  }, [pack.is_downloadable]);

  const isPreorderActive = priceDetails.isPreorderActive
  const isExpired = priceDetails.isExpired

  const currentPriceInr = priceDetails.priceInr
  const priceNum = getAmount(currentPriceInr, pack.price_usd)
  const mrpNum = getAmount(pack.mrp_inr || (currentPriceInr * 3), pack.price_usd ? Number(pack.price_usd) * 3 : null)

  const displayPrice = formatPrice(currentPriceInr, pack.price_usd)
  const displayMrp = formatPrice(pack.mrp_inr || (currentPriceInr * 3), pack.price_usd ? Number(pack.price_usd) * 3 : null)
  const discountPercent = Math.round((1 - (priceNum / mrpNum)) * 100)

  const days = priceDetails.daysLeft
  const hours = priceDetails.hoursLeft
  const minutes = priceDetails.minutesLeft
  const seconds = priceDetails.secondsLeft

  const videoIds = React.useMemo(() => {
    if (!pack.video_url) return [];
    const urls = pack.video_url.split(',').map((url: string) => url.trim()).filter(Boolean);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    return urls.map((url: string) => {
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }).filter(Boolean) as string[];
  }, [pack.video_url])

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Back Button */}
      <Link href="/browse" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 group w-fit">
        <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back to Library
      </Link>

      {/* Cinematic Title Header (Desktop Only, hidden on mobile to avoid duplication) */}
      <div className="hidden lg:flex flex-col gap-3">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black bg-[#FFE600] px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#FF3131] rounded-sm w-fit -rotate-1">
          {pack.categories?.[0]?.name || 'Sound Collection'}
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          {pack.name}
        </h1>
        {pack.total_contents_summary && (
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest font-mono">
            {pack.total_contents_summary}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
        {/* Left Section: Cover Art & Checkout Deck (sticky) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Cover Art with 3D Hover & Glow */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full aspect-square relative rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group/image"
          >
            <Image 
              src={pack.cover_url || '/placeholder.jpg'} 
              alt={`${pack.name} - Premium Indian Sample Pack | SamplesWala`} 
              fill 
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-700 group-hover/image:scale-105"
            />
            
            <div className="absolute top-4 right-4 z-20">
               <ShareButton 
                 title={pack.name} 
                 text={`Check out ${pack.name} on SamplesWala!`} 
                 url={typeof window !== 'undefined' ? window.location.href : ''}
                 className="w-9 h-9 bg-black/60 backdrop-blur-md border border-white/15 rounded-full hover:bg-studio-red hover:border-studio-red hover:rotate-12 transition-all flex items-center justify-center text-white cursor-pointer"
               />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Mobile Title (Only shown on mobile) */}
          <div className="flex lg:hidden flex-col gap-3">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black bg-[#FFE600] px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#FF3131] rounded-sm w-fit -rotate-1">
              {pack.categories?.[0]?.name || 'Sound Collection'}
            </span>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white">
              {pack.name}
            </h1>
            {pack.total_contents_summary && (
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest font-mono">
                {pack.total_contents_summary}
              </p>
            )}
          </div>

          {/* Pricing Card Deck */}
          <div className="p-6 bg-[#0a0a0af0] backdrop-blur-md border border-white/10 rounded-2xl space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-white/45 uppercase tracking-wider block font-mono">Price & Value</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white italic tracking-tight font-mono">{displayPrice}</span>
                  <span className="text-xs text-white/35 line-through font-bold font-mono">{displayMrp}</span>
                </div>
              </div>
              
              <div className="bg-studio-red px-3 py-1.5 rounded-lg shadow-[0_4px_12px_rgba(255,49,49,0.25)] flex flex-col items-center rotate-3">
                <span className="text-xs font-black text-white uppercase italic font-mono">{discountPercent}% OFF</span>
                {!pack.is_downloadable && (
                  <span className={`text-[7px] font-black uppercase tracking-tighter px-1.5 rounded-sm mt-0.5 ${isExpired ? 'bg-black/40 text-white/60' : 'bg-white text-studio-red'}`}>
                    {isExpired ? 'Regular' : 'Pre-order'}
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div id="main-buy-button-container" className="flex flex-col gap-3">
              {owned ? (
                pack.is_downloadable ? (
                  <DownloadButton itemId={pack.id} />
                ) : (
                  <div className="w-full p-6 bg-studio-neon/5 border border-studio-neon/20 border-dashed rounded-xl text-center space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Zap size={32} className="text-studio-neon" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-studio-neon italic font-mono">Pre-ordered Successfully!</p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider leading-relaxed">
                      This pack is currently in production. We will email you once it is released.
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-3">
                  {!pack.is_downloadable && isPreorderActive && (
                    <div className="bg-studio-red/10 border border-studio-red/20 p-2.5 rounded-xl text-center">
                      <p className="text-[9px] font-black text-studio-red uppercase tracking-widest animate-pulse font-mono">
                        🔥 Special Pre-order Offer Active
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    <AddToCartButton 
                      label={isPreorderActive ? "Pre-order" : "Add to Cart"}
                      item={{
                        id: pack.id,
                        name: pack.name,
                        price: Number(pack.price_inr),
                        price_usd: pack.price_usd ? Number(pack.price_usd) : undefined,
                        slug: pack.slug,
                        cover_url: pack.cover_url || undefined,
                        type: 'pack',
                        is_downloadable: pack.is_downloadable
                      }} 
                    />
                    <PaymentButton 
                      label={isPreorderActive ? `PRE-ORDER NOW — ${displayPrice}` : `BUY NOW — ${displayPrice}`}
                      packId={pack.id} 
                      packName={pack.name} 
                      price={currentPriceInr} 
                      price_usd={pack.price_usd ? Number(pack.price_usd) : undefined}
                      slug={pack.slug}
                      cover_url={pack.cover_url || ''}
                      userId={user?.id}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Countdown timer */}
            {!owned && !pack.is_downloadable && isPreorderActive && (
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-1.5 text-white/50 justify-center">
                  <Clock size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest font-mono">Ends In:</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-white">
                  <div className="bg-white/5 p-2 border border-white/5 rounded-lg">
                    <span className="text-lg font-black block leading-none">{mounted ? String(days).padStart(2, '0') : '00'}</span>
                    <span className="text-[7px] font-bold text-white/40 uppercase tracking-wider">Days</span>
                  </div>
                  <div className="bg-white/5 p-2 border border-white/5 rounded-lg">
                    <span className="text-lg font-black block leading-none">{mounted ? String(hours).padStart(2, '0') : '00'}</span>
                    <span className="text-[7px] font-bold text-white/40 uppercase tracking-wider">Hrs</span>
                  </div>
                  <div className="bg-white/5 p-2 border border-white/5 rounded-lg">
                    <span className="text-lg font-black block leading-none">{mounted ? String(minutes).padStart(2, '0') : '00'}</span>
                    <span className="text-[7px] font-bold text-white/40 uppercase tracking-wider">Mins</span>
                  </div>
                  <div className="bg-white/5 p-2 border border-white/5 rounded-lg">
                    <span className="text-lg font-black block leading-none">{mounted ? String(seconds).padStart(2, '0') : '00'}</span>
                    <span className="text-[7px] font-bold text-white/40 uppercase tracking-wider">Secs</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pre-order notices */}
          {!pack.is_downloadable && (
            <div className="p-5 rounded-2xl border border-studio-yellow/20 bg-studio-yellow/5 text-left space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-studio-yellow">
                <Clock size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider font-mono">Pre-order Notice</span>
              </div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider leading-relaxed">
                Our sample packs are mostly <span className="text-studio-yellow">live-recorded</span> or highly <span className="text-studio-red">time-consuming</span> to produce, <span className="text-studio-neon">but we are trying hard to release them ASAP!</span>
              </p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                🚀 Usually takes <span className="text-white underline decoration-studio-yellow">1-2 months to deliver</span>. You will be notified instantly via email upon completion.
              </p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed pt-2 border-t border-white/5">
                📧 Inquiries: email us at{' '}
                <a href="mailto:contact@sampleswala.com" className="text-studio-yellow hover:text-white underline font-black transition-colors lowercase">
                  contact@sampleswala.com
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Right Section: Sound Stats, Previews, Details, and FAQ */}
        <div className="lg:col-span-8 space-y-8">
          {/* Sound Statistics Grid */}
          {(() => {
            const activeStats = [
              { label: 'Melodies', count: pack.melody_count, icon: Music, bg: 'bg-[#FF0080]', shadow: 'shadow-[2.5px_2.5px_0px_#00BFFF] md:shadow-[4px_4px_0px_#00BFFF]', text: 'text-white' },
              { label: 'Loops', count: pack.loop_count, icon: Layers, bg: 'bg-[#00FF94]', shadow: 'shadow-[2.5px_2.5px_0px_#FF3131] md:shadow-[4px_4px_0px_#FF3131]', text: 'text-black' },
              { label: 'One-shots', count: pack.one_shot_count, icon: Disc, bg: 'bg-[#FFAA00]', shadow: 'shadow-[2.5px_2.5px_0px_#00BFFF] md:shadow-[4px_4px_0px_#00BFFF]', text: 'text-black' },
              { label: 'Presets', count: pack.preset_count, icon: SlidersHorizontal, bg: 'bg-[#FFE600]', shadow: 'shadow-[2.5px_2.5px_0px_#FF3131] md:shadow-[4px_4px_0px_#FF3131]', text: 'text-black' }
            ].filter(stat => stat.count !== undefined && stat.count !== null && stat.count > 0);

            if (activeStats.length === 0) return null;

            const gridColsMap: Record<number, string> = {
              1: 'grid-cols-2', // Keep half width on mobile for single item
              2: 'grid-cols-2',
              3: 'grid-cols-3',
              4: 'grid-cols-4'
            };
            const mobileGridClass = gridColsMap[activeStats.length] || 'grid-cols-4';

            return (
              <div className={`grid ${mobileGridClass} md:grid-cols-4 gap-2 md:gap-4`}>
                {activeStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -4 }}
                      className={`p-2.5 md:p-5 rounded-xl md:rounded-2xl border-2 border-black ${stat.bg} ${stat.shadow} ${stat.text} flex flex-col justify-between h-20 md:h-28 relative overflow-hidden group transition-all duration-300`}
                    >
                      <div className="absolute right-1 top-1 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon className={`w-8 h-8 md:w-12 md:h-12 ${stat.text === 'text-white' ? 'text-white' : 'text-black'}`} />
                      </div>
                      <div className="flex items-center gap-1 opacity-80 min-w-0 z-10">
                        <Icon className={`w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0 ${stat.text === 'text-white' ? 'text-white' : 'text-black'}`} />
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-wider font-mono truncate">{stat.label}</span>
                      </div>
                      <span className="text-xl md:text-3xl font-black italic tracking-tight font-mono leading-none z-10">{stat.count}</span>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}

          {/* Sound Count Fallback block */}
          {(!pack.melody_count && !pack.loop_count && !pack.one_shot_count && !pack.preset_count) && (
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block font-mono">Collection Content Info</span>
                <span className="text-base font-black uppercase tracking-wide text-white">{pack.total_contents_summary || 'Premium Quality Audio Assets'}</span>
              </div>
              <Sparkles className="text-studio-yellow animate-pulse" size={24} />
            </div>
          )}

          {/* Preview Theatre */}
          {videoIds.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-studio-neon" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 font-mono">
                  {videoIds.length > 1 ? 'Product Demos' : 'Product Demo'}
                </h2>
              </div>
              <div className={videoIds.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "w-full"}>
                {videoIds.map((id, index) => (
                  <div key={id} className="space-y-2 group">
                    {videoIds.length > 1 && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/75 block font-mono">
                        Demo {index + 1}
                      </span>
                    )}
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg group-hover:border-white/20 transition-all duration-300">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                        title={`${pack.name} Preview ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/20 bg-black/10">
               <Volume2 size={40} className="text-white/20 animate-pulse" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 font-mono">No Preview Audio Signal Available</p>
            </div>
          )}

          {/* Details Panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-studio-blue" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 font-mono">Overview</h2>
            </div>
            <div className="p-6 bg-[#0a0a0af0] backdrop-blur-md border border-white/10 rounded-2xl space-y-6 shadow-lg">
              <FormattedDescription text={pack.description} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-studio-neon font-mono">Technical Specifications</h3>
                  <ul className="space-y-2 text-[9px] font-bold text-white/40 uppercase font-mono">
                    <li className="flex items-center gap-2"><span className="text-studio-neon">•</span> Format: Professional 24-Bit / 44.1kHz WAV</li>
                    <li className="flex items-center gap-2"><span className="text-studio-neon">•</span> Compatibility: All DAWs (FL Studio, Ableton, Logic, etc.)</li>
                    <li className="flex items-center gap-2"><span className="text-studio-neon">•</span> License: 100% Royalty-Free Commercial Usage</li>
                    <li className="flex items-center gap-2"><span className="text-studio-neon">•</span> Delivery: Secure Direct Digital Download</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-studio-yellow font-mono">Production Quality</h3>
                  <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-wider font-mono">
                    Expertly mixed and mastered using industry-standard equipment. Designed to cut through the mix and provide instant inspiration for modern music producers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick specs pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Format', value: '24-Bit WAV', icon: Music },
              { label: 'Category', value: pack.categories?.[0]?.name || 'Sound Kits', icon: Layers },
              { label: 'Licensing', value: 'Royalty Free', icon: ShieldCheck },
              { label: 'Delivery', value: 'Instant', icon: Zap }
            ].map((spec, i) => {
              const Icon = spec.icon
              return (
                <div key={i} className="p-4 bg-[#00BFFF] text-black border-2 border-black rounded-2xl flex items-center justify-between shadow-[4px_4px_0px_#FFE600] transition-transform hover:-translate-y-1 duration-300">
                  <div>
                    <span className="text-[8px] font-black text-black/55 uppercase tracking-widest font-mono block">{spec.label}</span>
                    <p className="text-[10px] font-bold uppercase text-black font-mono mt-0.5">{spec.value}</p>
                  </div>
                  <Icon className="text-black/35" size={18} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq-section" className="pt-12 border-t border-white/5 space-y-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-studio-yellow shadow-[0_0_10px_rgba(255,200,0,0.5)]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 font-mono">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-4xl space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-white/20 shadow-md">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between group text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/20'}`}>
                    <HelpCircle size={18} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/80 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                </div>
                
                <motion.div
                  animate={{ rotate: activeFaq === idx ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: "circOut" }}
                  className={`flex-shrink-0 transition-colors duration-300 ${activeFaq === idx ? 'text-studio-yellow' : 'text-white/40 group-hover:text-white'}`}
                >
                  <Plus size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                     className="overflow-hidden"
                  >
                    <div className="pb-6 px-5 pl-14 border-t border-white/5 pt-4">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] leading-relaxed font-mono">
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

      {/* Guide & Tips */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5 pb-12">
         <div className="space-y-3 p-6 bg-black/40 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
               <ShieldCheck className="text-studio-pink" size={16} />
               <h3 className="text-[10px] font-black uppercase tracking-wider text-studio-pink font-mono">Pro Tip</h3>
            </div>
            <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-wider font-mono">
               For best results, use high-quality studio monitors or headphones to hear the full sub-bass frequency range. Organize your library by bpm and key for faster, more creative workflows.
            </p>
         </div>
         <div className="space-y-3 p-6 bg-black/40 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
               <Download className="text-studio-yellow" size={16} />
               <h3 className="text-[10px] font-black uppercase tracking-wider text-studio-yellow font-mono">Installation Guide</h3>
            </div>
            <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-wider font-mono">
               1. Extract the downloaded ZIP archive file.<br />
               2. Drag the folder directly into your DAW's file browser (FL Studio, Ableton, Logic).<br />
               3. Add the folder path to your 'Places' or 'Bookmarks' for quick drag-and-drop access.<br />
               4. Start creating!
            </p>
         </div>
      </section>

      {/* Floating Sticky CTA Bar */}
      <AnimatePresence>
        {showFloatingBar && !owned && mounted && (
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
                   <div 
                     onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                     className="flex items-center gap-3 min-w-0 cursor-pointer group/float-info"
                   >
                     <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-black shadow-md group-hover/float-info:scale-105 transition-transform duration-300">
                       <Image
                         src={pack.cover_url || '/placeholder.jpg'}
                         alt={pack.name}
                         fill
                         sizes="40px"
                         className="object-cover"
                       />
                     </div>
                     <div className="flex flex-col min-w-0">
                       <span className="text-black text-xs md:text-sm font-black uppercase tracking-tight truncate max-w-[120px] sm:max-w-[250px] lg:max-w-none group-hover/float-info:text-studio-red transition-colors">
                         {pack.name.split(/[-–—]/)[0].trim()}
                       </span>
                     </div>
                   </div>

                   {/* Price Info */}
                   <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                     <span className="text-[9px] md:text-xs text-black/50 line-through font-bold font-mono tracking-wider">
                       {displayMrp}
                     </span>
                     <span className="text-xs md:text-sm font-black text-black leading-none italic uppercase tracking-wider font-mono">
                       {displayPrice}
                     </span>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex items-center gap-1.5 md:gap-2 flex-1 sm:flex-initial justify-end">
                     {/* Add to Cart Button - Green Pill / Glass style */}
                     <button
                       onClick={handleFloatingAddToCart}
                       className={`h-9 w-9 sm:w-auto sm:px-5 font-black uppercase tracking-widest text-[8px] md:text-[9px] flex items-center justify-center sm:gap-1.5 rounded-full transition-all cursor-pointer duration-300 active:scale-95 flex-shrink-0 border-2 border-black shadow-[2px_2px_0px_black] ${
                         isAlreadyInCart
                           ? 'bg-black/10 text-black border-black/20 shadow-none'
                           : 'bg-[#00FF94] text-black hover:bg-white'
                       }`}
                     >
                       {isAlreadyInCart ? (
                         <>
                           <Check size={12} strokeWidth={3} />
                           <span className="hidden sm:inline">In Cart</span>
                         </>
                       ) : added ? (
                         <>
                           <Check size={12} strokeWidth={3} />
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
                       className="h-9 px-6 sm:px-5 bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-widest text-[8px] md:text-[9px] flex items-center justify-center gap-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_black] transition-all duration-300 active:scale-95 disabled:opacity-50 flex-1 sm:flex-initial max-w-[140px] sm:max-w-none"
                     >
                       {buyLoading ? (
                         <Loader2 className="animate-spin" size={12} />
                       ) : (
                         <>
                           <CreditCard size={12} />
                           <span>Buy Now</span>
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
