'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export function HeroSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-md mx-auto lg:mx-0 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="SEARCH SAMPLES..." 
        className="w-full h-14 bg-studio-charcoal px-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white/5 transition-all placeholder:text-white/20 text-white"
      />
      <button 
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-studio-yellow transition-colors"
      >
         <ArrowRight size={18} />
      </button>
    </form>
  )
}
