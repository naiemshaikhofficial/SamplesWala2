'use client'
import React, { useState } from 'react'
import { Search, Music, ArrowRight, X, ShieldCheck, ArrowLeft, Sparkles, FolderHeart, Receipt } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DownloadButton } from '@/components/DownloadButton'
import { BillingHistory } from '@/components/BillingHistory'

interface LibraryItem {
  id: string
  name: string
  slug: string
  cover_url: string
  type: 'pack' | 'preset'
  is_downloadable: boolean
  created_at?: string
}

export function SearchableLibrary({ 
  items, 
  billingItems, 
  profile, 
  email 
}: { 
  items: LibraryItem[]
  billingItems: any[]
  profile: any
  email?: string
}) {
  // Main vault states
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'packs' | 'presets' | 'orders'>('packs')

  // Pack Explorer states
  const [activePack, setActivePack] = useState<LibraryItem | null>(null)

  // Filter calculations
  const filteredItems = items.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesTab = (activeTab === 'packs' && p.type === 'pack') || (activeTab === 'presets' && p.type === 'preset')
    return matchesSearch && matchesTab
  })

  // Dynamic counts for tabs
  const packCount = items.filter(p => p.type === 'pack').length
  const presetCount = items.filter(p => p.type === 'preset').length
  const orderCount = billingItems?.length || 0

  if (activePack) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
        {/* Back breadcrumb */}
        <button 
          onClick={() => setActivePack(null)}
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Vault
        </button>

        {/* Pack Details Hero Banner */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 p-8 bg-zinc-950 border-4 border-black rounded-sm shadow-[8px_8px_0px_black] relative overflow-hidden select-none">
          {/* Comic background gradient accents */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-studio-pink/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full md:w-auto z-10">
            <div className="aspect-square relative w-32 md:w-40 h-32 md:h-40 bg-black border-4 border-black rounded-sm overflow-hidden flex-shrink-0 shadow-[4px_4px_0px_black]">
              <Image 
                src={activePack.cover_url || '/placeholder.jpg'} 
                alt={activePack.name} 
                fill 
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
              />
            </div>
            <div className="space-y-3.5">
              <span className="inline-block px-3 py-1 bg-studio-yellow text-black text-[9px] font-black uppercase tracking-wider rounded-sm border-2 border-black shadow-[2px_2px_0px_black] skew-x-[-10deg]">
                SAMPLE PACK
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white line-clamp-2 leading-none italic">
                {activePack.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest">
                <span className="text-studio-neon">100% Royalty-Free</span>
                <span className="text-white/10">•</span>
                <span>24-bit Lossless WAV</span>
                {activePack.created_at && (
                  <>
                    <span className="text-white/10">•</span>
                    <span>Unlocked on {new Date(activePack.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto relative z-10">
            <DownloadButton itemId={activePack.id} type="pack" />
          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl mx-auto px-2">
      {/* 1. Left Sidebar Navigation (Comic Brutalist Style) */}
      <div className="hidden md:flex flex-col w-60 border-r-4 border-black pr-8 space-y-8 flex-shrink-0">
        <div className="space-y-4">
          <Link 
            href="/browse" 
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-studio-pink/20 hover:skew-x-[-10deg] border-2 border-transparent hover:border-black hover:shadow-[3px_3px_0px_black] transition-all rounded-sm cursor-pointer"
          >
            <Image src="/cart-bag.png" alt="Store" width={16} height={16} className="brightness-0 invert opacity-60" />
            Store
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-[13px] font-black uppercase tracking-widest bg-studio-charcoal text-white border-4 border-black shadow-[4px_4px_0px_black] skew-x-[-8deg] rounded-sm">
            <FolderHeart size={16} className="text-white" />
            Library
          </div>
          
          {/* Nested Sub Tabs inside Library */}
          <div className="pl-6 space-y-3 pt-3 border-l-4 border-black ml-4">
            <button
              onClick={() => setActiveTab('packs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer border-2 active:translate-y-0.5 active:shadow-none ${
                activeTab === 'packs' 
                  ? 'text-black bg-[#FFE600] border-black shadow-[2px_2px_0px_black] skew-x-[-8deg]' 
                  : 'text-white/60 hover:text-white border-transparent hover:bg-white/5 hover:skew-x-[-8deg]'
              }`}
            >
              <span>Packs</span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border ${
                activeTab === 'packs' ? 'bg-black text-white border-black' : 'bg-white/5 text-white/40 border-white/10'
              }`}>{packCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer border-2 active:translate-y-0.5 active:shadow-none ${
                activeTab === 'presets' 
                  ? 'text-white bg-studio-pink border-black shadow-[2px_2px_0px_black] skew-x-[-8deg]' 
                  : 'text-white/60 hover:text-white border-transparent hover:bg-white/5 hover:skew-x-[-8deg]'
              }`}
            >
              <span>Presets</span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border ${
                activeTab === 'presets' ? 'bg-black text-white border-black' : 'bg-white/5 text-white/40 border-white/10'
              }`}>{presetCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer border-2 active:translate-y-0.5 active:shadow-none ${
                activeTab === 'orders' 
                  ? 'text-black bg-studio-neon border-black shadow-[2px_2px_0px_black] skew-x-[-8deg]' 
                  : 'text-white/60 hover:text-white border-transparent hover:bg-white/5 hover:skew-x-[-8deg]'
              }`}
            >
              <span>Orders</span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border ${
                activeTab === 'orders' ? 'bg-black text-white border-black' : 'bg-white/5 text-white/40 border-white/10'
              }`}>{orderCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main content area (Right Column) */}
      <div className="flex-1 w-full min-w-0">
        
        {/* Mobile Horizontal Tabs Row (Comic styled) */}
        <div className="flex md:hidden rounded-sm bg-black/40 border-4 border-black p-1 mb-8 w-full gap-2">
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 px-1.5 sm:px-3 py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-1 sm:gap-1.5 border-2 border-black cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeTab === 'packs' 
                ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_black]' 
                : 'bg-studio-charcoal text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Music size={12} className="flex-shrink-0" />
            <span className="truncate">Packs ({packCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-1.5 sm:px-3 py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-1 sm:gap-1.5 border-2 border-black cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeTab === 'presets' 
                ? 'bg-studio-pink text-white shadow-[2px_2px_0px_black]' 
                : 'bg-studio-charcoal text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Sparkles size={12} className="flex-shrink-0" />
            <span className="truncate">Presets ({presetCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-1.5 sm:px-3 py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-1 sm:gap-1.5 border-2 border-black cursor-pointer active:translate-y-0.5 active:shadow-none ${
              activeTab === 'orders' 
                ? 'bg-studio-neon text-black shadow-[2px_2px_0px_black]' 
                : 'bg-studio-charcoal text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Receipt size={12} className="flex-shrink-0" />
            <span className="truncate">Orders ({orderCount})</span>
          </button>
        </div>

        {/* Sort/Filter bar with clean search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-4 border-black mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-black text-white/40 uppercase tracking-widest">Sort by:</span>
            <span className="text-[12px] font-black text-studio-neon uppercase tracking-widest cursor-pointer hover:text-white transition-colors select-none italic">
              Alphabetical A-Z
            </span>
          </div>

          {/* Search bar */}
          {activeTab !== 'orders' && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text"
                placeholder={`Search unlocked ${activeTab === 'packs' ? 'packs' : 'presets'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black border-4 border-black p-3.5 pl-11 pr-8 rounded-sm focus:outline-none focus:border-studio-yellow text-[11px] font-black uppercase tracking-widest transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#FFE600] outline-none text-white placeholder:text-white/30"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic content rendering */}
        {activeTab === 'orders' ? (
          <div className="animate-fadeIn">
            <BillingHistory items={billingItems} profile={profile} email={email} />
          </div>
        ) : (
          filteredItems.length === 0 ? (
            <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-lg">
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-wider">
                {search ? 'No matches found' : `No ${activeTab === 'packs' ? 'packs' : 'presets'} found`}
              </p>
              {search ? (
                <button 
                  onClick={() => setSearch('')}
                  className="mt-4 text-[10px] font-bold uppercase tracking-wider text-studio-neon hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                <Link 
                  href="/browse"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[11px] tracking-wider rounded-[4px]"
                >
                  <Sparkles size={14} />
                  Browse Sounds Store
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fadeIn">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`group flex flex-col space-y-3 cursor-pointer min-w-0 border-4 border-black p-4 bg-zinc-950/80 rounded-sm shadow-[6px_6px_0px_black] hover:-translate-y-1 transition-all duration-200 ${
                    item.type === 'pack' 
                      ? 'hover:shadow-[10px_10px_0px_#FFE600]' 
                      : 'hover:shadow-[10px_10px_0px_#FF0080]'
                  }`}
                  onClick={() => {
                    if (item.type === 'pack') {
                      setActivePack(item)
                    } else {
                      window.location.href = `/browse/presets/${item.slug}`
                    }
                  }}
                >
                  {/* Larger Portrait/Square Cover image */}
                  <div className="relative aspect-square overflow-hidden bg-black border-2 border-black rounded-sm transition-all duration-300">
                    <Image 
                      src={item.cover_url || '/placeholder.jpg'} 
                      alt={item.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 right-3 bg-black border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_black] skew-x-[-10deg] rounded-sm z-10">
                        <p className={`text-[8px] font-black uppercase tracking-wider ${item.type === 'pack' ? 'text-studio-yellow' : 'text-studio-pink'}`}>
                          {item.type === 'pack' ? 'PACK' : 'PRESET'}
                        </p>
                    </div>
                  </div>

                  {/* Card Title & Info */}
                  <div className="space-y-1.5 mt-1 font-sans min-w-0">
                    <h3 className="text-[14px] font-black text-white group-hover:text-studio-yellow transition-colors truncate uppercase italic tracking-wider">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between gap-2 mt-1.5 w-full min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/40 group-hover:text-white/60 transition-colors min-w-0 flex-shrink-0">
                        {item.is_downloadable ? (
                          <div className="flex items-center gap-1 text-[#128807] font-semibold">
                            <ShieldCheck size={12} className="flex-shrink-0" />
                            <span className="truncate">Purchased</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-studio-neon/80 font-semibold">
                            <Sparkles size={12} className="flex-shrink-0" />
                            <span className="truncate">Pre-ordered</span>
                          </div>
                        )}
                      </div>
                      
                      {item.is_downloadable && (
                        <div onClick={(e) => e.stopPropagation()} className="w-28 flex-shrink-0">
                          <DownloadButton itemId={item.id} type={item.type} compact />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  )
}
