import React from 'react'
import { FolderHeart } from 'lucide-react'
import Link from 'next/link'

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-8">
      <div className="h-16 w-16 bg-studio-yellow/10 flex items-center justify-center rounded-sm">
        <FolderHeart className="text-studio-yellow" size={32} />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Your Vault</h1>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Unlocked High-Fidelity Artifacts</p>
      </div>
      
      <div className="w-full max-w-2xl text-center space-y-8">
         <div className="p-12 border border-dashed border-white/5 rounded-sm flex flex-col items-center gap-6">
            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Vault is currently empty</p>
            <Link href="/browse" className="text-[10px] font-black bg-white/5 border border-white/10 px-6 py-3 uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all">
              Discover Packs
            </Link>
         </div>
      </div>
    </div>
  )
}
