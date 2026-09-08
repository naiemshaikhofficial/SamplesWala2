'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Gift, Sparkles, Download, ShieldCheck, Zap, ChevronDown, Music, Check, ArrowRight } from 'lucide-react'

interface FreeClientProps {
  initialPacks: any[]
  initialPresets: any[]
}

export function FreeClient({ initialPacks = [], initialPresets = [] }: FreeClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'packs' | 'presets'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const items = useMemo(() => {
    const all = [
      ...initialPacks.map(p => ({ ...p, itemType: 'pack' })),
      ...initialPresets.map(pr => ({ ...pr, itemType: 'preset' }))
    ]

    return all.filter(item => {
      // Tab filter
      if (activeTab === 'packs' && item.itemType !== 'pack') return false
      if (activeTab === 'presets' && item.itemType !== 'preset') return false

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const nameMatch = item.name?.toLowerCase().includes(query)
        const descMatch = item.description?.toLowerCase().includes(query)
        const catMatch = item.categories?.some((c: any) => c.name?.toLowerCase().includes(query))
        return nameMatch || descMatch || catMatch
      }

      return true
    })
  }, [initialPacks, initialPresets, activeTab, searchQuery])

  const faqs = [
    {
      q: "Are these sounds really 100% free?",
      a: "Yes, completely! Every sound pack and preset in this free library is 100% free to download. No payment, credit card, or recurring subscription is required."
    },
    {
      q: "Can I use these free samples in commercial tracks on Spotify & YouTube?",
      a: "Yes! All free packs and presets from SamplesWala come with our full commercial royalty-free license. You keep 100% of your royalties and streaming revenues on Spotify, Apple Music, YouTube, and film scoring."
    },
    {
      q: "Do I have to give credit or attribution?",
      a: "No attribution is legally required! However, tagging @sampleswala on Instagram or YouTube is always appreciated by our team and community."
    },
    {
      q: "In what audio format are the downloads provided?",
      a: "All sample packs are delivered as pristine, uncompressed 24-bit 44.1kHz WAV files, perfectly compatible with FL Studio, Ableton Live, Logic Pro, Cubase, Pro Tools, and all major DAWs."
    },
    {
      q: "How often are new free sounds released?",
      a: "We add fresh free packs, loops, and presets every month to support indie music producers and beatmakers worldwide."
    }
  ]

  return (
    <div className="space-y-16">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[#111114] border-2 border-black shadow-[6px_6px_0px_black] rounded-xl">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#00FF94] text-black shadow-[3px_3px_0px_black]'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            All Freebies ({initialPacks.length + initialPresets.length})
          </button>

          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'packs'
                ? 'bg-[#00FF94] text-black shadow-[3px_3px_0px_black]'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            Sample Packs ({initialPacks.length})
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-[#00FF94] text-black shadow-[3px_3px_0px_black]'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            Presets ({initialPresets.length})
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search free sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/80 border-2 border-black rounded-lg text-xs font-bold text-white placeholder-white/40 focus:outline-none focus:border-[#00FF94] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/40 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Grid of Freebies */}
      {items.length === 0 ? (
        <div className="text-center py-20 border-4 border-dashed border-white/10 rounded-2xl space-y-4">
          <Gift size={48} className="mx-auto text-white/20 animate-pulse" />
          <h3 className="text-xl font-black uppercase text-white tracking-tight">No free sounds found</h3>
          <p className="text-xs text-white/50 uppercase tracking-widest max-w-sm mx-auto">
            Try adjusting your search filter or view all categories to see everything available.
          </p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="px-6 py-2.5 bg-[#00FF94] text-black font-black uppercase text-xs rounded border-2 border-black shadow-[3px_3px_0px_black] hover:bg-white transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const isPack = item.itemType === 'pack'
            const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex flex-col bg-[#121216] border-2 border-black hover:border-[#00FF94] shadow-[6px_6px_0px_black] hover:shadow-[8px_8px_0px_#00FF94] transition-all duration-300 rounded-xl overflow-hidden"
              >
                {/* Thumbnail Card Cover */}
                <Link href={detailUrl} className="relative aspect-square overflow-hidden bg-black/50 block">
                  <Image
                    src={item.cover_url || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#00FF94] text-black font-black text-[9px] uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_black] -rotate-2">
                      100% FREE
                    </span>
                    <span className="bg-black/90 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 border border-white/20 rounded">
                      {isPack ? 'Sample Pack' : (item.type || 'Preset')}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#00FF94] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[3px_3px_0px_black] group-hover:scale-105 transition-transform">
                      Claim Now →
                    </span>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div className="space-y-2">
                    <Link href={detailUrl}>
                      <h3 className="text-sm font-black uppercase text-white hover:text-[#00FF94] transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                    </Link>

                    {item.total_contents_summary && (
                      <p className="text-[10px] font-mono text-white/45 uppercase tracking-wider line-clamp-1">
                        {item.total_contents_summary}
                      </p>
                    )}

                    {item.daws && item.daws.length > 0 && (
                      <p className="text-[9px] font-bold text-studio-yellow uppercase tracking-wider">
                        DAWs: {item.daws.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#00FF94] font-mono italic leading-none">
                        FREE
                      </span>
                      <span className="text-[9px] font-mono font-bold text-white/30 uppercase line-through">
                        ₹999
                      </span>
                    </div>

                    <Link
                      href={detailUrl}
                      className="px-4 py-2 bg-white hover:bg-[#00FF94] text-black font-black uppercase text-[10px] tracking-wider rounded border-2 border-black shadow-[2px_2px_0px_black] hover:shadow-[3px_3px_0px_black] active:scale-95 transition-all"
                    >
                      Claim Pack
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Community Callout Banner */}
      <div className="p-8 md:p-12 bg-gradient-to-r from-[#16161c] via-[#0e0e12] to-[#16161c] border-4 border-black shadow-[8px_8px_0px_black] rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF94]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio-yellow text-black font-black text-[9px] uppercase tracking-widest border border-black shadow-[2px_2px_0px_black] -rotate-1">
            <Zap size={12} />
            <span>NEVER MISS A FREE DROP</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight text-white">
            Want New Free Samples In Your Inbox?
          </h3>
          <p className="text-xs text-white/60 font-bold uppercase tracking-wider leading-relaxed">
            Join thousands of producers getting exclusive unreleased rhythm stems, presets, and secret discounts delivered fresh.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <Link
            href="/auth"
            className="px-8 py-4 bg-[#00FF94] hover:bg-white text-black font-black uppercase text-xs tracking-widest border-3 border-black shadow-[6px_6px_0px_black] hover:shadow-[8px_8px_0px_#00FF94] hover:-translate-y-1 transition-all inline-flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF94]">Frequently Asked Questions</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-white">
            Free Vault FAQs
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y-2 divide-black border-4 border-black shadow-[8px_8px_0px_black] rounded-xl overflow-hidden bg-[#121215]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-xs md:text-sm font-black uppercase tracking-wide text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#00FF94] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-white/60 font-bold uppercase tracking-wider leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
