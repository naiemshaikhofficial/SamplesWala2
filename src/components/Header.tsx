'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, ShoppingBag, ChevronRight, Search, ArrowRight } from 'lucide-react'
import { HeaderCartIcon } from './HeaderCartIcon'
import { LogoutButton } from './LogoutButton'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedLogo } from './AnimatedLogo'
import { useAuth } from '@/context/AuthContext'
import { getSearchSuggestions } from '@/app/browse/actions'

function HeaderSearch({ onSearchClose }: { onSearchClose?: () => void }) {
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
      if (onSearchClose) onSearchClose()
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`)
    }
  }, [query, router, onSearchClose])

  const [placeholderText, setPlaceholderText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)

  const words = ['TRAP SAMPLES', 'HIP HOP LOOPS', 'BOLLYWOOD VOCALS', 'DRILL KITS', 'LO-FI MELODIES', 'PRESETS']

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleType = () => {
      const i = loopNum % words.length
      const fullTxt = `SEARCH ${words[i]}...`

      if (isDeleting) {
        setPlaceholderText(fullTxt.substring(0, placeholderText.length - 1))
        setTypingSpeed(45) // Faster when deleting
      } else {
        setPlaceholderText(fullTxt.substring(0, placeholderText.length + 1))
        setTypingSpeed(90) // Smooth normal typing speed
      }

      if (!isDeleting && placeholderText === fullTxt) {
        // Pause at the end of the word
        timer = setTimeout(() => setIsDeleting(true), 2500)
      } else if (isDeleting && placeholderText === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
        setTypingSpeed(250) // Short pause before next word
      } else {
        timer = setTimeout(handleType, typingSpeed)
      }
    }

    timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [placeholderText, isDeleting, loopNum, typingSpeed])

  return (
    <div ref={searchRef} className="relative w-full md:max-w-[280px] z-50">
      <motion.form
        onSubmit={handleSearch}
        whileHover={{ scale: 1.03, y: -1 }}
        transition={{ type: "spring", stiffness: 450, damping: 18 }}
        className="relative border-4 border-black bg-studio-charcoal shadow-[4px_4px_0px_#00BFFF] focus-within:shadow-[4px_4px_0px_#FFE600] focus-within:-translate-y-0.5 transition-all overflow-hidden h-11 flex items-center"
      >
        <div className="absolute left-3 text-white/20">
          <Search size={14} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholderText}
          className="w-full h-full bg-transparent pl-9 pr-9 text-[10px] font-black uppercase tracking-widest focus:outline-none placeholder:text-white/20 text-white"
        />
        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="text-white/20 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
          <button
            type="submit"
            className="text-white/40 hover:text-studio-yellow transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.form>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-studio-charcoal border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 w-full md:w-[300px]">
          {isLoading ? (
            <div className="p-3 text-[8px] font-black uppercase tracking-widest text-white/20 animate-pulse">Searching Signal...</div>
          ) : (
            <div className="divide-y-2 divide-black">
              {suggestions.map((pack) => (
                <Link
                  key={pack.id}
                  href={`/packs/${pack.slug}`}
                  onClick={() => {
                    setIsOpen(false)
                    if (onSearchClose) onSearchClose()
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-9 h-9 relative flex-shrink-0 border-2 border-black">
                    <Image
                      src={pack.cover_url || '/placeholder.jpg'}
                      alt={pack.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[9px] font-black uppercase truncate group-hover:text-studio-neon transition-colors">
                      {pack.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] text-white/40 line-through font-bold">
                        ₹{pack.mrp_inr || (Number(pack.price_inr) * 3)}
                      </span>
                      <p className="text-[9px] font-black text-studio-neon uppercase italic tracking-widest leading-none">
                        ₹{pack.price_inr}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={10} className="text-white/10 group-hover:text-studio-neon -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-2 bg-black/40 text-[7px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-studio-yellow text-left"
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

export function Header() {
  const { user, isArtist } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const dashboardUrl = process.env.NODE_ENV === 'production'
    ? 'https://dashboard.sampleswala.com'
    : 'http://dashboard.localhost:3000';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Scroll Lock
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.documentElement.style.overflow = 'unset'
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
    return () => {
      document.documentElement.style.overflow = 'unset'
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
  }, [isMenuOpen])

  const NavLinks = () => (
    <>
      <Link href="/browse/packs" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors">Sample Packs</Link>
      <Link href="/browse/presets" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-pink transition-colors">Presets</Link>
      <Link href="/library" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors">Library</Link>

      {isArtist && (
        <a
          href={dashboardUrl}
          className="px-3 py-1 bg-studio-neon text-black font-black italic hover:bg-white transition-colors skew-x-[-10deg]"
        >
          DASHBOARD
        </a>
      )}

      <div className="flex items-center gap-4">
        <HeaderCartIcon />
        {user ? (
          <LogoutButton />
        ) : (
          <Link
            href="/auth"
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 bg-[#00FF94] hover:bg-[#00e685] text-black font-bold transition-all rounded-lg shadow-sm text-[11px] tracking-wide"
          >
            Sign In
          </Link>
        )}
      </div>
    </>
  )

  return (
    <header className={`${isMenuOpen ? 'fixed top-0' : 'sticky top-0'} z-[100] h-20 border-b-4 border-black ${isMenuOpen ? 'bg-black' : 'bg-studio-charcoal/80 backdrop-blur-md'} transition-all flex items-center shadow-[0_4px_0_rgba(0,0,0,1)] w-full`}>
      <div className="container mx-auto px-4 flex items-center justify-between w-full h-full relative z-[110]">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center select-none hover:scale-105 translate-y-[28px] transition-transform duration-200"
        >
          <Image
            src="/Logo.png"
            alt="SamplesWala Logo"
            width={150}
            height={30}
            priority
            className="object-contain"
          />
        </Link>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:block flex-grow max-w-[200px] lg:max-w-[280px] mx-4 lg:mx-6">
          <HeaderSearch />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-black uppercase tracking-[0.2em] italic">
          <NavLinks />
        </nav>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          {!user && (
            <Link
              href="/auth"
              className="px-3 py-1.5 bg-[#00FF94] hover:bg-[#00e685] text-black font-bold transition-all rounded-lg shadow-sm text-[10px]"
            >
              Sign In
            </Link>
          )}
          <HeaderCartIcon />
          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1 border-4 border-black bg-white shadow-[3px_3px_0px_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group overflow-hidden"
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-5 h-1 bg-black rounded-full origin-center"
            />
            <motion.div
              animate={isMenuOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
              className="w-5 h-1 bg-black rounded-full"
            />
            <motion.div
              animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="w-5 h-1 bg-black rounded-full origin-center"
            />
          </button>
        </div>
      </div>


      {/* Mobile Menu Overlay - Framer Motion */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-full left-0 right-0 h-[calc(100dvh-5rem)] bg-black z-[100] flex flex-col p-6 md:p-8 space-y-8 overflow-y-auto border-t-4 border-black"
          >
            {/* Comic Accent */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:16px_16px]" />

            {/* Mobile Search Bar */}
            <div className="w-full relative z-20">
              <HeaderSearch onSearchClose={() => setIsMenuOpen(false)} />
            </div>

            <nav className="flex flex-col space-y-4 text-2xl font-black uppercase tracking-tighter relative z-10">
              {[
                { name: 'Browse Packs', href: '/browse/packs' },
                { name: 'Producer Presets', href: '/browse/presets' },
                { name: 'Your Library', href: '/library' },
                ...(isArtist ? [{ name: 'ARTIST DASHBOARD', href: dashboardUrl }] : []),
                { name: 'Production Blog', href: '/blog' },
                { name: 'About Us', href: '/about' },
                { name: 'Help Center', href: '/help' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center justify-between p-4 border-4 border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 transition-all italic ${link.name === 'ARTIST DASHBOARD'
                    ? 'bg-studio-neon text-black font-black'
                    : 'bg-studio-charcoal text-white hover:bg-studio-pink'
                    }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </a>
              ))}

              <div className="pt-8">
                {user ? (
                  <div className="p-6 bg-white/5 border-4 border-black flex flex-col gap-4 italic shadow-[6px_6px_0px_black]">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Account</span>
                      <p className="text-sm text-studio-neon truncate font-black">{user.email}</p>
                    </div>
                    <LogoutButton />
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full h-16 bg-studio-yellow text-black flex items-center justify-center text-lg font-black tracking-widest border-4 border-black shadow-[8px_8px_0px_black] italic hover:bg-white transition-all"
                  >
                    SIGN IN NOW
                  </Link>
                )}
              </div>
            </nav>

            <div className="mt-auto pt-8 border-t-2 border-white/5 text-center">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">SAMPLESWALA :: NOISE 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
