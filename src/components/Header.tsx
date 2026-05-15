'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingBag, ChevronRight } from 'lucide-react'
import { HeaderCartIcon } from './HeaderCartIcon'
import { LogoutButton } from './LogoutButton'
import { motion, AnimatePresence } from 'framer-motion'

export function Header({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

      <div className="flex items-center gap-4">
        <HeaderCartIcon />
        {user ? (
          <LogoutButton />
        ) : (
          <Link
            href="/auth"
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 border border-white/10 hover:border-studio-yellow transition-all"
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
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: [0, -2, 2, -2, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Image
              src="/Logo.png"
              alt="Samples Wala Logo"
              width={300}
              height={100}
              priority
              className="h-12 md:h-16 w-auto transition-all"
            />
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] italic">
          <NavLinks />
        </nav>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          {!user && (
            <Link
              href="/auth"
              className="px-3 py-1.5 border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
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

            <nav className="flex flex-col space-y-4 text-2xl font-black uppercase tracking-tighter relative z-10">
              {[
                { name: 'Browse Packs', href: '/browse/packs' },
                { name: 'Producer Presets', href: '/browse/presets' },
                { name: 'Your Library', href: '/library' },
                { name: 'Production Blog', href: '/blog' },
                { name: 'About Us', href: '/about' },
                { name: 'Help Center', href: '/help' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between p-4 bg-studio-charcoal border-4 border-black shadow-[6px_6px_0px_black] hover:-translate-y-1 hover:bg-studio-pink transition-all text-white italic"
                >
                  <span>{link.name}</span>
                  <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
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
