import React from 'react'
import { FolderHeart, Download, ArrowRight, Music } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getOptimizedImageUrl } from '@/lib/images'

import { DownloadButton } from '@/components/DownloadButton'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white/20">Access Denied</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Please sign in to view your vault</p>
        <Link href="/auth" className="inline-block px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-studio-yellow transition-all">Sign In</Link>
      </div>
    )
  }

  // 1. Fetch vault items
  const { data: vaultItems } = await supabase
    .from('user_vault')
    .select('*')
    .eq('user_id', user.id)
    .eq('item_type', 'pack')

  // 2. Fetch pack details for those items
  let packs: any[] = []
  if (vaultItems && vaultItems.length > 0) {
    const packIds = vaultItems.map(v => v.item_id)
    const { data: packData } = await supabase
      .from('sample_packs')
      .select('*')
      .in('id', packIds)
    packs = packData || []
  }

  return (
    <div className="container mx-auto px-4 py-32 space-y-16">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-16 w-16 bg-studio-yellow/10 flex items-center justify-center rounded-sm mb-4">
          <FolderHeart className="text-studio-yellow" size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Your Vault</h1>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Unlocked High-Fidelity Artifacts</p>
      </div>
      
      {packs.length === 0 ? (
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
           <div className="p-12 border border-dashed border-white/5 rounded-sm flex flex-col items-center gap-6">
              <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Vault is currently empty</p>
              <Link href="/browse" className="text-[10px] font-black bg-white/5 border border-white/10 px-6 py-3 uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all">
                Discover Packs
              </Link>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div key={pack.id} className="group bg-white/5 border border-white/5 rounded-sm overflow-hidden hover:border-white/20 transition-all flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <Image 
                  src={getOptimizedImageUrl(pack.cover_url, 800, 80)} 
                  alt={pack.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <h3 className="text-xl font-black uppercase italic tracking-tight">{pack.name}</h3>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow space-y-6">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <span className="flex items-center gap-2"><Music size={12} /> Full Pack</span>
                  <span>Unlocked</span>
                </div>

                <div className="flex gap-3 mt-auto">
                   <DownloadButton packId={pack.id} />
                   <Link 
                     href={`/packs/${pack.slug}`}
                     className="h-14 w-14 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                   >
                     <ArrowRight size={18} />
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


