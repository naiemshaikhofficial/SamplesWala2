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
    <form onSubmit={handleSearch} className="relative max-w-md mx-auto lg:mx-0">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="SEARCH SAMPLES..." 
        className="w-full h-14 bg-white/5 border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-studio-yellow transition-colors placeholder:text-white/20"
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
