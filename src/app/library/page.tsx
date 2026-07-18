import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SearchableLibrary } from '@/components/SearchableLibrary'

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

  // 2. Filter for items and fetch details
  const vaultPacks = allVaultItems?.filter(v => v.item_type === 'pack') || []
  const vaultPresets = allVaultItems?.filter(v => v.item_type === 'preset') || []
  
  const packIds = vaultPacks.map(v => v.item_id)
  const presetIds = vaultPresets.map(v => v.item_id)

  // Run queries in parallel
  const packsPromise = packIds.length > 0
    ? supabase
        .from('sample_packs')
        .select('id, name, slug, cover_url, full_pack_download_url')
        .in('id', packIds)
    : Promise.resolve({ data: null })

  const presetsPromise = presetIds.length > 0
    ? supabase
        .from('presets')
        .select('id, name, slug, cover_url, drive_url')
        .in('id', presetIds)
    : Promise.resolve({ data: null })

  const profilePromise = supabase
    .from('user_accounts')
    .select('full_name, phone_number, address_line1, city, state, postal_code, gstin')
    .eq('user_id', user.id)
    .maybeSingle()

  const [packsResult, presetsResult, profileResult] = await Promise.all([
    packsPromise,
    presetsPromise,
    profilePromise
  ])

  const packData = packsResult.data
  const presetData = presetsResult.data
  const profile = profileResult.data

  let libraryItems: any[] = []
  
  if (packData) {
    libraryItems.push(...packData.map((p: any) => ({
      ...p,
      type: 'pack',
      created_at: vaultPacks.find(v => v.item_id === p.id)?.created_at,
      is_downloadable: !!p.full_pack_download_url
    })))
  }

  if (presetData) {
    libraryItems.push(...presetData.map((p: any) => ({
      ...p,
      type: 'preset',
      created_at: vaultPresets.find(v => v.item_id === p.id)?.created_at,
      is_downloadable: !!p.drive_url
    })))
  }

  const billingItems = allVaultItems?.map(item => ({
    ...item,
    item_name: libraryItems.find(p => p.id === item.item_id)?.name || item.item_name || 'Digital Asset'
  })) || []

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white pt-24 md:pt-28 pb-20 relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        <SearchableLibrary 
          items={libraryItems} 
          billingItems={billingItems}
          profile={profile}
          email={user.email}
        />
      </div>
    </div>
  )
}
