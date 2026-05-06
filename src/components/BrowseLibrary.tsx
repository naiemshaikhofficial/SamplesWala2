'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { clientCache } from '@/lib/clientCache'
import { useCart } from '@/context/CartContext'
import { getOptimizedImageUrl } from '@/lib/images'
import { ShoppingCart, Eye } from 'lucide-react'

export function BrowseLibrary({ initialPacks, searchQuery }: { initialPacks: any[], searchQuery?: string }) {
  const [packs, setPacks] = useState<any[]>(initialPacks)
  const { addItem } = useCart()

  useEffect(() => {
    // ... existing cache and filter logic ...
    const cached = clientCache.get('all_packs')
    let currentPacks = initialPacks

    if (cached && (!initialPacks || initialPacks.length === 0)) {
      currentPacks = cached
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      currentPacks = currentPacks.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categories?.name?.toLowerCase().includes(q)
      )
    }

    setPacks(currentPacks)

    if (initialPacks && initialPacks.length > 0) {
      clientCache.set('all_packs', initialPacks)
    }
  }, [initialPacks, searchQuery])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {packs.map((pack: any) => (
        <div 
          key={pack.id} 
          className="group flex flex-col space-y-4"
        >
          <div className="aspect-square relative overflow-hidden bg-studio-charcoal/50 border border-white/5 rounded-sm shadow-2xl">
            <Image
              src={getOptimizedImageUrl(pack.cover_url, 600, 80)}
              alt={pack.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              priority={packs.indexOf(pack) < 5}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            
             {/* Quick Actions Overlay */}
             <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <Link 
                  href={`/packs/${pack.slug}`}
                  className="p-3 bg-white text-black rounded-full hover:bg-studio-yellow transition-colors shadow-xl"
                  title="View Details"
                >
                  <Eye size={18} />
                </Link>
                {pack.full_pack_download_url && (
                  <button 
                    onClick={() => addItem({
                      id: pack.id,
                      name: pack.name,
                      price: Number(pack.price_inr),
                      slug: pack.slug,
                      cover_url: pack.cover_url || undefined
                    })}
                    className="p-3 bg-studio-yellow text-black rounded-full hover:bg-white transition-colors shadow-xl"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                )}
             </div>

             {!pack.full_pack_download_url && (
               <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full">
                 <span className="text-[8px] font-black uppercase tracking-widest text-studio-yellow">Coming Soon</span>
               </div>
             )}
          </div>

          <div className="space-y-1 px-1">
            <Link href={`/packs/${pack.slug}`}>
              <h3 className="text-[13px] font-black uppercase truncate hover:text-studio-yellow transition-colors tracking-tight">
                {pack.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                {pack.categories?.name || 'Artifacts'}
              </p>
              <p className="text-[10px] font-black text-studio-neon">
                ₹{pack.price_inr}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
