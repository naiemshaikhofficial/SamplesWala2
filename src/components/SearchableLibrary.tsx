'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Music, ArrowRight, X, ShieldCheck, ArrowLeft, Play, Pause, Download, Loader2, Sparkles, FolderHeart, Volume2, Receipt } from 'lucide-react'
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

  if (activePack) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
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
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Vault
        </button>

        {/* Pack Details Hero Banner */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 p-8 bg-[#18181c] border border-white/5 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full md:w-auto">
            <div className="aspect-square relative w-32 md:w-40 h-32 md:h-40 bg-[#121212] border border-white/10 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={activePack.cover_url || '/placeholder.jpg'} 
                alt={activePack.name} 
                fill 
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <span className="inline-block px-2.5 py-1 bg-[#2a2a2e] text-white text-[9px] font-bold uppercase tracking-wider rounded-[3px]">
                SAMPLE PACK
              </span>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white line-clamp-2 leading-none">
                {activePack.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] font-medium text-white/40 uppercase tracking-wider">
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
              <Volume2 className="text-studio-neon" size={22} />
              <h3 className="text-base font-bold uppercase tracking-wider text-white">Cloud Preview & STEM Downloads</h3>
            </div>

            {/* In-pack search and tag switcher */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Type Switcher */}
              <div className="flex rounded-[4px] bg-white/5 border border-white/10 p-0.5 w-full sm:w-auto">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`flex-1 sm:flex-none px-5 py-2 text-[9px] font-bold uppercase tracking-wider transition-all rounded-[3px] ${
                    typeFilter === 'all' ? 'bg-[#2a2a2e] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter('loop')}
                  className={`flex-1 sm:flex-none px-5 py-2 text-[9px] font-bold uppercase tracking-wider transition-all rounded-[3px] ${
                    typeFilter === 'loop' ? 'bg-[#2a2a2e] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Loops
                </button>
                <button
                  onClick={() => setTypeFilter('one_shot')}
                  className={`flex-1 sm:flex-none px-5 py-2 text-[9px] font-bold uppercase tracking-wider transition-all rounded-[3px] ${
                    typeFilter === 'one_shot' ? 'bg-[#2a2a2e] text-white' : 'text-white/40 hover:text-white'
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
                  className="w-full bg-white/5 border border-white/10 rounded-[4px] py-2 pl-9 pr-8 text-[10px] font-medium text-white focus:outline-none focus:border-white/20 transition-all"
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
            <div className="w-full text-center py-24 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-studio-neon" size={32} />
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Retrieving secure audio signals...</p>
            </div>
          ) : samplesError ? (
            <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-red-500/10 rounded-lg text-red-500">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{samplesError}</p>
              <button 
                onClick={() => {
                  setSamplesError(null);
                  setActivePack(activePack); // re-trigger fetch
                }}
                className="text-[10px] font-bold uppercase tracking-wider underline hover:text-white"
              >
                Retry Request
              </button>
            </div>
          ) : filteredSamples.length === 0 ? (
            <div className="w-full text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-lg">
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">
                {searchPackText || typeFilter !== 'all' ? 'No matches found in this pack' : 'No individual tracks found for this pre-ordered collection'}
              </p>
              {(searchPackText || typeFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchPackText('');
                    setTypeFilter('all');
                  }}
                  className="mt-4 text-[10px] font-bold uppercase tracking-wider text-studio-neon hover:underline"
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
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg transition-all duration-300 ${
                      currentSampleId === sample.id 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
                    }`}
                  >
                    {/* Left: Play and Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button
                        onClick={() => togglePlay(sample)}
                        className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all flex-shrink-0 cursor-pointer
                          ${currentSampleId === sample.id && isPlaying
                            ? 'bg-[#2a2a2e] border-white/10 text-white'
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                          }
                        `}
                      >
                        {currentSampleId === sample.id && isPlaying ? (
                          <Pause size={16} fill="currentColor" />
                        ) : (
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <h4 className="text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-white truncate italic">
                          {sample.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] ${
                            sample.type === 'loop' 
                              ? 'bg-studio-yellow/10 text-studio-yellow border border-studio-yellow/20' 
                              : 'bg-studio-pink/10 text-studio-pink border border-studio-pink/20'
                          }`}>
                            {sample.type === 'loop' ? 'Loop' : 'One-shot'}
                          </span>
                          {sample.bpm && (
                            <span className="text-[9px] font-mono font-bold text-white/40 uppercase">
                              {sample.bpm} BPM
                            </span>
                          )}
                          {sample.key && (
                            <span className="text-[9px] font-mono font-bold text-studio-neon/80 uppercase">
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
                              className={`w-[2.5px] rounded-xs transition-colors duration-150 ${
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
                        <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      )}
                      {sample.download_url ? (
                        <a
                          href={sample.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all rounded-[4px] cursor-pointer text-white"
                        >
                          <Download size={12} />
                          Download WAV
                        </a>
                      ) : (
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">
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

  return (
    <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl mx-auto px-2">
      {/* 1. Left Sidebar Navigation (EGS Style - Larger sizing) */}
      <div className="hidden md:flex flex-col w-60 border-r border-white/5 pr-8 space-y-8 flex-shrink-0">
        <div className="space-y-2">
          <Link 
            href="/browse" 
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
          >
            <Image src="/cart-bag.png" alt="Store" width={16} height={16} className="brightness-0 invert opacity-60" />
            Store
          </Link>
          <div className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider bg-[#2a2a2e] text-white rounded-[4px]">
            <FolderHeart size={16} className="text-white" />
            Library
          </div>
          
          {/* Nested Sub Tabs inside Library */}
          <div className="pl-8 space-y-2 pt-3 border-l border-white/5 ml-6">
            <button
              onClick={() => setActiveTab('packs')}
              className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'packs' ? 'text-white bg-white/5' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <span>Packs</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                activeTab === 'packs' ? 'bg-[#2a2a2e] text-white' : 'bg-white/5 text-white/40'
              }`}>{packCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'presets' ? 'text-white bg-white/5' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <span>Presets</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                activeTab === 'presets' ? 'bg-[#2a2a2e] text-white' : 'bg-white/5 text-white/40'
              }`}>{presetCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'orders' ? 'text-white bg-white/5' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <span>Orders</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                activeTab === 'orders' ? 'bg-[#2a2a2e] text-white' : 'bg-white/5 text-white/40'
              }`}>{orderCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main content area (Right Column) */}
      <div className="flex-1 w-full min-w-0">
        
        {/* Mobile Horizontal Tabs Row (Hidden on desktop) */}
        <div className="flex md:hidden rounded-[4px] bg-white/5 border border-white/10 p-0.5 mb-6 w-full">
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-[3px] flex items-center justify-center gap-1.5 ${
              activeTab === 'packs' ? 'bg-[#2a2a2e] text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <Music size={12} />
            <span>Packs ({packCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-[3px] flex items-center justify-center gap-1.5 ${
              activeTab === 'presets' ? 'bg-[#2a2a2e] text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <Sparkles size={12} />
            <span>Presets ({presetCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-[3px] flex items-center justify-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-[#2a2a2e] text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <Receipt size={12} />
            <span>Orders ({orderCount})</span>
          </button>
        </div>

        {/* Sort/Filter bar with clean search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Sort by:</span>
            <span className="text-[12px] font-bold text-white uppercase tracking-wider cursor-pointer hover:text-white/80 select-none">
              Alphabetical A-Z
            </span>
          </div>

          {/* Search bar */}
          {activeTab !== 'orders' && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text"
                placeholder={`Search unlocked ${activeTab === 'packs' ? 'packs' : 'presets'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#18181c] border border-white/10 rounded-[4px] py-2 pl-11 pr-8 text-[11px] font-medium text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.03] transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
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
                  className="group flex flex-col space-y-3 cursor-pointer"
                  onClick={() => {
                    if (item.type === 'pack') {
                      setActivePack(item)
                    } else {
                      window.location.href = `/browse/presets/${item.slug}`
                    }
                  }}
                >
                  {/* Larger Portrait/Square Cover image */}
                  <div className="relative aspect-square overflow-hidden bg-[#121212] border border-white/5 rounded-lg group-hover:border-white/20 shadow-md transition-all duration-300">
                    <Image 
                      src={item.cover_url || '/placeholder.jpg'} 
                      alt={item.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 rounded-[3px]">
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${item.type === 'pack' ? 'text-studio-yellow' : 'text-studio-pink'}`}>
                          {item.type === 'pack' ? 'PACK' : 'PRESET'}
                        </p>
                    </div>
                  </div>

                  {/* Card Title & Info */}
                  <div className="space-y-1.5 mt-1 font-sans">
                    <h3 className="text-[14px] font-bold text-white group-hover:text-white/80 transition-colors truncate">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
                        {item.is_downloadable ? (
                          <div className="flex items-center gap-1 text-[#128807] font-semibold">
                            <ShieldCheck size={12} />
                            <span>Purchased</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-studio-neon/80 font-semibold">
                            <Sparkles size={12} />
                            <span>Pre-ordered</span>
                          </div>
                        )}
                      </div>
                      
                      {item.is_downloadable && (
                        <div onClick={(e) => e.stopPropagation()} className="w-28">
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
