'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, X } from 'lucide-react'
import { getSearchSuggestions } from '@/app/browse/actions'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true)
        const results = await getSearchSuggestions(query)
        setSuggestions(results)
        setIsOpen(true)
        setIsLoading(false)
      } else {
        setSuggestions([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = React.useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`)
    }
  }, [query, router])

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto lg:mx-0 z-50">
      <form onSubmit={handleSearch} className="relative border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden bg-studio-charcoal">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
           <Search size={16} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="SEARCH SAMPLES..." 
          className="w-full h-14 bg-transparent pl-12 pr-12 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white/5 transition-all placeholder:text-white/20 text-white"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="text-white/20 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
          <button 
            type="submit"
            className="text-white/40 hover:text-studio-yellow transition-colors"
          >
             <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-studio-charcoal border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-4 text-[8px] font-black uppercase tracking-widest text-white/20 animate-pulse">Searching Signal...</div>
          ) : (
            <div className="divide-y-2 divide-black">
              {suggestions.map((pack) => (
                <Link 
                  key={pack.id}
                  href={`/packs/${pack.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-12 h-12 relative flex-shrink-0 border-2 border-black">
                    <Image 
                      src={pack.cover_url || '/placeholder.jpg'} 
                      alt={pack.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[10px] font-black uppercase truncate group-hover:text-studio-neon transition-colors">
                      {pack.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-white/40 line-through font-bold">
                        ₹{pack.mrp_inr || (Number(pack.price_inr) * 3)}
                      </span>
                      <p className="text-[10px] font-black text-studio-neon uppercase italic tracking-widest">
                        ₹{pack.price_inr}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-white/10 group-hover:text-studio-neon -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
              <button 
                onClick={handleSearch}
                className="w-full p-3 bg-black/40 text-[8px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-studio-yellow text-left"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
