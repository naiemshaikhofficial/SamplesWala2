'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ArrowRight } from 'lucide-react'

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
      if (activeTab === 'packs' && item.itemType !== 'pack') return false
      if (activeTab === 'presets' && item.itemType !== 'preset') return false

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
      q: "Are these sounds really free to use commercially?",
      a: "Yes. Every sound pack and preset in this catalog includes our full commercial royalty-free license. You keep 100% of your royalties and streaming revenues across Spotify, Apple Music, YouTube, and commercial film scoring."
    },
    {
      q: "Do I have to give credit or attribution?",
      a: "No attribution is legally required. You can use these sounds freely in your beats, songs, and background scores."
    },
    {
      q: "What format are the audio files in?",
      a: "All sample packs are delivered as pristine, uncompressed 24-bit 44.1kHz WAV files, ready to drag and drop into FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, and Reaper."
    },
    {
      q: "How do I claim and download a free pack?",
      a: "Simply click on any sound kit or preset to open its page, and click 'Claim Free' to download your files instantly."
    }
  ]

  return (
    <div className="space-y-16">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 bg-[#121215] border-2 border-black shadow-[4px_4px_0px_black] rounded-lg">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded border border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-[2px_2px_0px_black]'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            All Freebies ({initialPacks.length + initialPresets.length})
          </button>

          <button
            onClick={() => setActiveTab('packs')}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded border border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'packs'
                ? 'bg-white text-black shadow-[2px_2px_0px_black]'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            Sample Packs ({initialPacks.length})
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded border border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-white text-black shadow-[2px_2px_0px_black]'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black'
            }`}
          >
            Presets ({initialPresets.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search free catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/80 border border-white/20 rounded text-xs font-medium text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Grid of Freebies */}
      {items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl space-y-3">
          <h3 className="text-lg font-black uppercase text-white tracking-tight">No sounds found</h3>
          <p className="text-xs text-white/50 uppercase tracking-wider max-w-sm mx-auto">
            Try adjusting your search query or reset the filter to view all free items.
          </p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="px-5 py-2 bg-white text-black font-black uppercase text-xs rounded border border-black shadow-[2px_2px_0px_black] hover:bg-studio-yellow transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const isPack = item.itemType === 'pack'
            const detailUrl = isPack ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group flex flex-col justify-between bg-[#141417] border-2 border-black hover:border-white/30 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all rounded-lg overflow-hidden"
              >
                {/* Thumbnail Card Cover */}
                <Link href={detailUrl} className="relative aspect-square overflow-hidden bg-black/60 block">
                  <Image
                    src={item.cover_url || '/placeholder.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />

                  {/* Clean Type Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-black/90 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 border border-white/20 rounded">
                      {isPack ? 'Sample Pack' : (item.type || 'Preset')}
                    </span>
                  </div>
                </Link>

                {/* Card Details */}
                <div className="p-3.5 flex flex-col flex-grow justify-between gap-3">
                  <div className="space-y-1">
                    <Link href={detailUrl}>
                      <h3 className="text-xs sm:text-sm font-black uppercase text-white hover:text-studio-yellow transition-colors line-clamp-1 italic tracking-tight">
                        {item.name}
                      </h3>
                    </Link>

                    {item.total_contents_summary ? (
                      <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider truncate">
                        {item.total_contents_summary}
                      </p>
                    ) : (
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
                        {isPack ? 'Free Sound Kit' : 'Free Preset'}
                      </p>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                    <span className="text-sm sm:text-base font-black text-[#00FF94] font-mono italic">
                      FREE
                    </span>

                    <Link
                      href={detailUrl}
                      className="px-3 py-1.5 bg-white hover:bg-studio-yellow text-black font-black uppercase text-[9px] tracking-wider rounded border border-black shadow-[2px_2px_0px_black] active:scale-95 transition-all"
                    >
                      Get Free
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Community Callout Banner */}
      <div className="p-6 md:p-10 bg-[#121215] border-2 border-black shadow-[6px_6px_0px_black] rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-studio-yellow">
            COMMUNITY ACCESS
          </span>
          <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tight text-white">
            Create an Account for Direct Library Sync
          </h3>
          <p className="text-xs text-white/50 max-w-lg leading-relaxed">
            Saved free packs are instantly accessible from your personal account library anytime, on any device.
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href="/auth"
            className="px-6 py-3 bg-white hover:bg-studio-yellow text-black font-black uppercase text-xs tracking-wider border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all inline-flex items-center gap-2"
          >
            <span>Sign In / Register</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">
            COMMON QUESTIONS
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight text-white">
            Free Sounds FAQ
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-white/10 border-2 border-black shadow-[6px_6px_0px_black] rounded-lg overflow-hidden bg-[#121215]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-white/60 shrink-0 transition-transform duration-200 ${
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
                      <div className="px-4 pb-4 pt-1 text-xs text-white/60 font-medium leading-relaxed border-t border-white/5">
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
