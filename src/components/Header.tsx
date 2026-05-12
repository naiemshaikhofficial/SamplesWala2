'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { HeaderCartIcon } from './HeaderCartIcon'
import { LogoutButton } from './LogoutButton'

export function Header({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const NavLinks = () => (
    <>
      <Link href="/browse" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors">Browse</Link>
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
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 border-b-4 border-black ${isMenuOpen ? 'bg-black' : 'bg-studio-charcoal/80 backdrop-blur-md'} transition-all flex items-center shadow-[0_4px_0_rgba(0,0,0,1)]`}>
      <div className="container mx-auto px-4 flex items-center justify-between w-full h-full">
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/Logo.png" 
            alt="Samples Wala Logo" 
            width={200} 
            height={50} 
            priority
            className="h-8 md:h-10 w-auto transition-all group-hover:drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]"
          />
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
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-black z-[60] flex flex-col p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
          <nav className="flex flex-col space-y-8 text-xl font-black uppercase tracking-[0.2em]">
            <Link href="/browse" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors border-b border-white/5 pb-4">Browse Packs</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors border-b border-white/5 pb-4">About Us</Link>
            <Link href="/library" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors border-b border-white/5 pb-4">Your Library</Link>
            <Link href="/help" onClick={() => setIsMenuOpen(false)} className="hover:text-studio-yellow transition-colors border-b border-white/5 pb-4">Help Center</Link>

            
            <div className="pt-4">
              {user ? (
                <div className="flex flex-col gap-4">
                   <p className="text-[10px] text-white/20">Signed in as {user.email}</p>
                   <LogoutButton />
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full h-14 bg-white text-black flex items-center justify-center text-sm font-black tracking-widest"
                >
                  SIGN IN
                </Link>
              )}
            </div>
          </nav>
          
          <div className="mt-auto pt-8 border-t border-white/5">
             <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">Samples Wala :: 2026</p>
          </div>
        </div>
      )}
    </header>
  )
}
