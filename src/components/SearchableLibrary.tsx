'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Music, ArrowRight, X, ShieldCheck, ArrowLeft, Play, Pause, Download, Loader2, Sparkles, FolderHeart, Volume2, HelpCircle, Receipt } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DownloadButton } from '@/components/DownloadButton'
import { BillingHistory } from '@/components/BillingHistory'
import { getPackSamples } from '@/app/library/actions'

interface LibraryItem {
  id: string
  name: string
  slug: string
  cover_url: string
  type: 'pack' | 'preset'
  is_downloadable: boolean
  created_at?: string
}

function getWaveformPoints(id: string): number[] {
  const points = 32
  const signal: number[] = []
  let seed = 0
  for (let i = 0; i < id.length; i++) {
    seed += id.charCodeAt(i)
  }
  for (let i = 0; i < points; i++) {
    const val = Math.abs(
      Math.sin(i * 0.75 + seed) * 35 + 
      Math.sin(i * 0.25) * 20 + 
      Math.cos(i * 0.4 + seed) * 15 +
      10
    )
    signal.push(Math.floor(val))
  }
  return signal
}

function formatTime(secs: number) {
  if (isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
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
  const [samples, setSamples] = useState<any[]>([])
  const [loadingSamples, setLoadingSamples] = useState(false)
  const [samplesError, setSamplesError] = useState<string | null>(null)
  const [searchPackText, setSearchPackText] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'loop' | 'one_shot'>('all')
  // Client-side cache to save Vercel serverless function invocations
  const [packSamplesCache, setPackSamplesCache] = useState<Record<string, any[]>>({})

  // Audio Player states
  const [currentSampleId, setCurrentSampleId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize global audio element
  useEffect(() => {
    audioRef.current = new Audio()

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleDurationChange = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('durationchange', handleDurationChange)
    audioRef.current.addEventListener('ended', handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('durationchange', handleDurationChange)
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current = null
      }
    }
  }, [])

  // Load samples when a pack is selected in the explorer
  useEffect(() => {
    if (!activePack) {
      setSamples([])
      setSamplesError(null)
      return
    }

    // Check client-side cache first to avoid Vercel API / Serverless execution
    if (packSamplesCache[activePack.id]) {
      setSamples(packSamplesCache[activePack.id])
      setSamplesError(null)
      return
    }

    const loadSamples = async () => {
      setLoadingSamples(true)
      setSamplesError(null)
      try {
        const data = await getPackSamples(activePack.id)
        setSamples(data)
        // Save in client cache
        setPackSamplesCache(prev => ({
          ...prev,
          [activePack.id]: data
        }))
      } catch (err: any) {
        console.error('Error fetching samples:', err)
        setSamplesError(err.message || 'Failed to retrieve cloud samples.')
      } finally {
        setLoadingSamples(false)
      }
    }

    loadSamples()
  }, [activePack, packSamplesCache])

  // Playback handlers
  const togglePlay = (sample: any) => {
    if (!audioRef.current || !sample.stream_url) return

    if (currentSampleId === sample.id) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch(err => console.error('Playback error:', err))
        setIsPlaying(true)
      }
    } else {
      audioRef.current.src = sample.stream_url
      audioRef.current.load()
      audioRef.current.play().catch(err => console.error('Playback error:', err))
      setCurrentSampleId(sample.id)
      setIsPlaying(true)
      setCurrentTime(0)
      setDuration(0)
    }
  }

  const handleSeek = (sample: any, e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || currentSampleId !== sample.id || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickPct = clickX / rect.width
    audioRef.current.currentTime = clickPct * duration
  }

  // Filter calculations
  const filteredItems = items.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesTab = (activeTab === 'packs' && p.type === 'pack') || (activeTab === 'presets' && p.type === 'preset')
    return matchesSearch && matchesTab
  })

  const filteredSamples = samples.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchPackText.toLowerCase()) ||
                          s.tags.some((t: string) => t.toLowerCase().includes(searchPackText.toLowerCase()))
    const matchesType = typeFilter === 'all' || s.type === typeFilter
    return matchesSearch && matchesType
  })

  // Dynamic counts for tabs
  const packCount = items.filter(p => p.type === 'pack').length
  const presetCount = items.filter(p => p.type === 'preset').length
  const orderCount = billingItems?.length || 0

  // Render Pack Explorer Mode
  if (activePack) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Back breadcrumb */}
        <button 
          onClick={() => {
            setActivePack(null)
            if (audioRef.current) {
              audioRef.current.pause()
              setIsPlaying(false)
              setCurrentSampleId(null)
            }
          }}
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Vault
        </button>

        {/* Pack Details Hero Banner */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-sm">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full md:w-auto">
            <div className="aspect-square relative w-24 md:w-36 h-24 md:h-36 bg-studio-charcoal border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <Image 
                src={activePack.cover_url || '/placeholder.jpg'} 
                alt={activePack.name} 
                fill 
                sizes="(max-width: 768px) 96px, 144px"
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 bg-studio-yellow text-black text-[8px] font-black uppercase tracking-widest rounded-xs rotate-[-1deg]">
                SAMPLE PACK
              </span>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight italic text-white line-clamp-2 leading-none">
                {activePack.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                <span>{loadingSamples ? '...' : samples.length} Cloud Sounds Loaded</span>
                <span className="text-white/10">•</span>
                {activePack.created_at && (
                  <span>Unlocked on {new Date(activePack.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <DownloadButton itemId={activePack.id} type="pack" />
          </div>
        </div>

        {/* Inside Pack Audio Stream Explorer */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Volume2 className="text-studio-neon" size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Cloud Preview & STEM Downloads</h3>
            </div>

            {/* In-pack search and tag switcher */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Type Switcher */}
              <div className="flex rounded-sm bg-white/5 border border-white/10 p-0.5 w-full sm:w-auto">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all rounded-xs ${
                    typeFilter === 'all' ? 'bg-studio-yellow text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter('loop')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all rounded-xs ${
                    typeFilter === 'loop' ? 'bg-studio-yellow text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Loops
                </button>
                <button
                  onClick={() => setTypeFilter('one_shot')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all rounded-xs ${
                    typeFilter === 'one_shot' ? 'bg-studio-yellow text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  One-shots
                </button>
              </div>

              {/* Sub-search input */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <input 
                  type="text"
                  placeholder="Search pack sounds..."
                  value={searchPackText}
                  onChange={(e) => setSearchPackText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-2 pl-9 pr-8 text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:border-studio-neon/50 focus:bg-white/[0.08] transition-all"
                />
                {searchPackText && (
                  <button 
                    onClick={() => setSearchPackText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sound list container */}
          {loadingSamples ? (
            <div className="w-full text-center py-24 bg-white/[0.01] border border-white/5 rounded-sm flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-studio-neon" size={32} />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Retrieving secure audio signals...</p>
            </div>
          ) : samplesError ? (
            <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-red-500/10 rounded-sm text-red-500">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">{samplesError}</p>
              <button 
                onClick={() => {
                  setSamplesError(null);
                  setActivePack(activePack); // re-trigger fetch
                }}
                className="text-[9px] font-black uppercase tracking-widest underline hover:text-white"
              >
                Retry Request
              </button>
            </div>
          ) : filteredSamples.length === 0 ? (
            <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-sm">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                {searchPackText || typeFilter !== 'all' ? 'No matches found in this pack' : 'No individual tracks found for this pre-ordered collection'}
              </p>
              {(searchPackText || typeFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchPackText('');
                    setTypeFilter('all');
                  }}
                  className="mt-4 text-[9px] font-black uppercase tracking-widest text-studio-neon hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSamples.map((sample) => {
                const progressPct = currentSampleId === sample.id && duration > 0
                  ? (currentTime / duration) * 100
                  : 0
                const points = getWaveformPoints(sample.id)

                return (
                  <div 
                    key={sample.id} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-sm transition-all duration-300 ${
                      currentSampleId === sample.id 
                        ? 'bg-studio-neon/[0.04] border-studio-neon/30' 
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
                    }`}
                  >
                    {/* Left: Play and Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button
                        onClick={() => togglePlay(sample)}
                        className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0
                          ${currentSampleId === sample.id && isPlaying
                            ? 'bg-studio-neon border-studio-neon text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                            : 'bg-white/5 border-white/10 hover:border-studio-neon text-white hover:text-studio-neon'
                          }
                        `}
                      >
                        {currentSampleId === sample.id && isPlaying ? (
                          <Pause size={18} fill="currentColor" />
                        ) : (
                          <Play size={18} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <h4 className="text-[11px] md:text-[12px] font-black uppercase tracking-wider text-white truncate italic">
                          {sample.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
                            sample.type === 'loop' 
                              ? 'bg-studio-yellow/10 text-studio-yellow border border-studio-yellow/20' 
                              : 'bg-studio-pink/10 text-studio-pink border border-studio-pink/20'
                          }`}>
                            {sample.type === 'loop' ? 'Loop' : 'One-shot'}
                          </span>
                          {sample.bpm && (
                            <span className="text-[8px] font-mono font-bold text-white/40 uppercase">
                              {sample.bpm} BPM
                            </span>
                          )}
                          {sample.key && (
                            <span className="text-[8px] font-mono font-bold text-studio-neon/80 uppercase">
                              {sample.key}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Waveform Visualizer */}
                    <div className="hidden sm:flex flex-1 justify-center max-w-xs px-4">
                      <div 
                        onClick={(e) => handleSeek(sample, e)}
                        className="flex items-end gap-[3px] h-9 w-full cursor-pointer group/waveform relative py-1"
                      >
                        {points.map((pt, idx) => {
                          const barPct = (idx / points.length) * 100
                          const isPlayed = barPct <= progressPct
                          return (
                            <div
                              key={idx}
                              style={{ height: `${pt}%` }}
                              className={`w-[3px] rounded-xs transition-colors duration-150 ${
                                currentSampleId === sample.id
                                  ? isPlayed
                                    ? 'bg-studio-neon'
                                    : 'bg-white/10 group-hover/waveform:bg-white/30'
                                  : 'bg-white/20 group-hover/waveform:bg-white/45'
                              }`}
                            />
                          )
                        })}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {currentSampleId === sample.id && duration > 0 && (
                        <span className="text-[9px] font-mono text-white/40 hidden md:inline">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      )}
                      {sample.download_url ? (
                        <a
                          href={sample.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 px-4 bg-white/5 hover:bg-studio-neon hover:text-black border border-white/10 hover:border-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                          <Download size={12} />
                          Download WAV
                        </a>
                      ) : (
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render Grid Mode (Standard Vault Page)
  return (
    <div className="space-y-12">
      {/* Premium Dashboard Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-black border-4 border-black p-6 shadow-[8px_8px_0px_rgba(255,200,0,1)] hover:-translate-y-1 transition-all">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sample Packs Unlocked</h4>
          <p className="text-3xl font-black text-studio-yellow italic mt-1">{packCount} PACKS</p>
        </div>
        <div className="bg-black border-4 border-black p-6 shadow-[8px_8px_0px_rgba(255,0,128,1)] hover:-translate-y-1 transition-all">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Producer Presets</h4>
          <p className="text-3xl font-black text-studio-pink italic mt-1">{presetCount} PRESETS</p>
        </div>
        <div className="bg-black border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,255,159,1)] hover:-translate-y-1 transition-all">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Orders</h4>
          <p className="text-3xl font-black text-studio-neon italic mt-1">{orderCount} ORDERS</p>
        </div>
      </div>

      {/* Category tabs and Search bar row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full lg:w-auto">
          {/* Dashboard Tab Selector */}
          <div className="flex flex-wrap rounded-sm bg-white/5 border border-white/10 p-0.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('packs')}
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs flex items-center gap-2 ${
                activeTab === 'packs' ? 'bg-studio-yellow text-black shadow-[2px_2px_0px_black]' : 'text-white/40 hover:text-white'
              }`}
            >
              <Music size={12} />
              Sample Packs
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-xs ${activeTab === 'packs' ? 'bg-black text-studio-yellow' : 'bg-white/10 text-white/60'}`}>
                {packCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs flex items-center gap-2 ${
                activeTab === 'presets' ? 'bg-studio-pink text-white shadow-[2px_2px_0px_black]' : 'text-white/40 hover:text-white'
              }`}
            >
              <Sparkles size={12} />
              Producer Presets
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-xs ${activeTab === 'presets' ? 'bg-black text-white' : 'bg-white/10 text-white/60'}`}>
                {presetCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-studio-neon text-black shadow-[2px_2px_0px_black]' : 'text-white/40 hover:text-white'
              }`}
            >
              <Receipt size={12} />
              Order History
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-xs ${activeTab === 'orders' ? 'bg-black text-studio-neon' : 'bg-white/10 text-white/60'}`}>
                {orderCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar - hidden on Orders tab */}
        {activeTab !== 'orders' && (
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text"
              placeholder={`Search unlocked ${activeTab === 'packs' ? 'packs' : 'presets'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-10 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-studio-neon/50 focus:bg-white/[0.08] transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Content Area */}
      {activeTab === 'orders' ? (
        <div className="animate-fadeIn !mt-0">
          <BillingHistory items={billingItems} profile={profile} email={email} />
        </div>
      ) : (
        /* Grid items */
        filteredItems.length === 0 ? (
          <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-sm">
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
               {search ? 'No matches found for your search' : `No ${activeTab === 'packs' ? 'sample packs' : 'producer presets'} found in your collection`}
             </p>
             {search ? (
               <button 
                 onClick={() => setSearch('')}
                 className="mt-4 text-[9px] font-black uppercase tracking-widest text-studio-neon hover:underline"
               >
                 Clear Search
               </button>
             ) : (
               <Link 
                 href="/browse"
                 className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-studio-yellow transition-all border border-black shadow-[4px_4px_0px_rgba(255,200,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
               >
                 <Sparkles size={12} />
                 Browse Sounds Store
               </Link>
             )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 animate-fadeIn">
            {filteredItems.map((item) => (
              <div key={item.id} className="group flex flex-col space-y-4">
                <div className="aspect-square relative overflow-hidden bg-studio-charcoal border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] block group-hover:border-studio-neon transition-all">
                  <Image 
                    src={item.cover_url || '/placeholder.jpg'} 
                    alt={item.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 border border-white/10 rounded-sm">
                      <p className={`text-[7px] font-black uppercase tracking-widest ${item.type === 'pack' ? 'text-studio-yellow' : 'text-studio-pink'}`}>
                        {item.type === 'pack' ? 'PACK' : 'PRESET'}
                      </p>
                  </div>
                </div>
                
                <div className="space-y-4 px-1 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck size={10} className="text-studio-neon" />
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] text-studio-neon/80 font-mono">Verified License</span>
                    </div>
                    <h3 className="text-[13px] font-black uppercase truncate italic tracking-tight text-white">{item.name}</h3>
                    {item.created_at && (
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                        Purchased on {new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 pt-1">
                      <span className="flex items-center gap-2"><Music size={10} /> Full {item.type === 'pack' ? 'Pack' : 'Preset'}</span>
                      <span className="text-studio-neon/60">Unlocked</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 items-start w-full">
                    {item.is_downloadable ? (
                      item.type === 'pack' ? (
                        <div className="flex flex-col gap-2 w-full">
                          <DownloadButton itemId={item.id} type={item.type} />
                          <button
                            onClick={() => setActivePack(item)}
                            className="w-full h-11 border-2 border-black bg-studio-neon/10 hover:bg-studio-neon hover:text-black text-studio-neon text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                          >
                            <Music size={12} />
                            Explore Sounds
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full items-start">
                          <div className="flex-1">
                            <DownloadButton itemId={item.id} type={item.type} />
                          </div>
                          <Link 
                            href={`/browse/presets/${item.slug}`}
                            className="h-16 w-16 border-4 border-black bg-white/5 shadow-[6px_6px_0px_black] flex-shrink-0 flex items-center justify-center hover:bg-white/10 transition-all group/link active:translate-x-1 active:translate-y-1 active:shadow-none"
                          >
                            <ArrowRight size={18} className="text-white/40 group-hover/link:text-white transition-colors" />
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="w-full bg-studio-neon/5 border border-studio-neon/20 p-4 rounded-sm flex items-center justify-between group/pre">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-studio-neon uppercase tracking-widest italic">Pre-ordered</p>
                          <p className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">Will be sent once available</p>
                        </div>
                        <Link 
                          href={item.type === 'pack' ? `/packs/${item.slug}` : `/browse/presets/${item.slug}`}
                          className="h-10 w-10 bg-studio-neon/10 border border-studio-neon/20 flex items-center justify-center hover:bg-studio-neon hover:border-black transition-all group-hover/pre:rotate-12"
                        >
                          <ArrowRight size={14} className="text-studio-neon group-hover/pre:text-black" />
                        </Link>
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
  )
}
