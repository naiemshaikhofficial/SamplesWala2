import React from 'react'
import { FolderHeart, Download, ArrowRight, Music } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getOptimizedImageUrl } from '@/lib/images'

import { DownloadButton } from '@/components/DownloadButton'
import { BillingHistory } from '@/components/BillingHistory'


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

  // 1. Fetch ALL vault items for billing history
  const { data: allVaultItems } = await supabase
    .from('user_vault')
    .select('id, item_id, item_type, item_name, amount, razorpay_order_id, razorpay_payment_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Filter for packs and fetch details
  const vaultPacks = allVaultItems?.filter(v => v.item_type === 'pack') || []
  let packs: any[] = []
  
  if (vaultPacks.length > 0) {
    const packIds = vaultPacks.map(v => v.item_id)
    const { data: packData } = await supabase
      .from('sample_packs')
      .select('id, name, slug, cover_url, full_pack_download_url')
      .in('id', packIds)
    // Map to is_downloadable and hide the URL
    packs = (packData || []).map(p => ({
      ...p,
      is_downloadable: !!p.full_pack_download_url,
      full_pack_download_url: undefined
    }))
  }

  // 3. Fetch user account profile for billing
  const { data: profile } = await supabase
    .from('user_accounts')
    .select('full_name, phone_number, address_line1, city, state, postal_code, gstin')
    .eq('user_id', user.id)
    .maybeSingle()

  // 4. Map names to billing items for the table
  const billingItems = allVaultItems?.map(item => ({
    ...item,
    item_name: packs.find(p => p.id === item.item_id)?.name || item.item_name || 'Digital Pack'
  })) || []

  return (
    <div className="container mx-auto px-4 py-32 space-y-24">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-16 w-16 bg-studio-yellow/10 flex items-center justify-center rounded-sm mb-4">
          <FolderHeart className="text-studio-yellow" size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Your Vault</h1>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Unlocked High-Fidelity Artifacts</p>
      </div>
      
      <div className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-sm">
            <Music size={20} className="text-white/40" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">Purchased Packs</h2>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Your collection of premium sound kits</p>
          </div>
        </div>

        {packs.length === 0 ? (
          <div className="w-full max-w-2xl text-center space-y-8">
             <div className="p-12 border border-dashed border-white/5 rounded-sm flex flex-col items-center gap-6">
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Vault is currently empty</p>
                <Link href="/browse" className="text-[10px] font-black bg-white/5 border border-white/10 px-6 py-3 uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all">
                  Discover Packs
                </Link>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {packs.map((pack) => (
              <div key={pack.id} className="group flex flex-col space-y-4">
                <div className="aspect-square relative overflow-hidden bg-studio-charcoal/50 border border-white/5 rounded-sm shadow-2xl block group-hover:border-studio-neon/30 transition-all">
                  <Image 
                    src={getOptimizedImageUrl(pack.cover_url, 600, 80)} 
                    alt={pack.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={packs.indexOf(pack) < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="space-y-4 px-1">
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-black uppercase truncate italic tracking-tight">{pack.name}</h3>
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                      <span className="flex items-center gap-2"><Music size={10} /> Full Pack</span>
                      <span className="text-studio-neon/60">Unlocked</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <DownloadButton packId={pack.id} />
                     <Link 
                       href={`/packs/${pack.slug}`}
                       className="h-14 w-14 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group/link"
                     >
                       <ArrowRight size={18} className="text-white/20 group-hover/link:text-white transition-colors" />
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Billing Section */}
      <BillingHistory items={billingItems} profile={profile} email={user.email} />
    </div>
  )
}





