import React from 'react'
import { getPacks, getAllCategories, getPresets } from './actions'
import Link from 'next/link'
import { Music, Sparkles, Zap, ShoppingBag } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { PresetCard } from '@/components/PresetCard'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { FlashSalePromo } from '@/components/FlashSalePromo'

export const metadata = generatePageMetadata({
  title: 'Browse Music Production Tools | SamplesWala',
  description: 'Explore our library of premium Indian Sample Packs and Producer Presets.',
  path: '/browse'
})

export default async function BrowsePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; type?: string }> 
}) {
  const { q, type = 'packs' } = await searchParams
  const packs = await getPacks()
  const categories = await getAllCategories()
  const presets = await getPresets()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse', item: 'https://sampleswala.com/browse' }
  ])

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* --- BOLD TAB SWITCHER --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-16">
         <Link 
            href="/browse/packs"
            className={`flex-1 h-14 md:h-20 flex items-center justify-center gap-3 md:gap-4 border-4 border-black text-lg md:text-2xl font-black uppercase italic tracking-tighter transition-all ${type === 'packs' ? 'bg-studio-yellow text-black shadow-[4px_4px_0px_black] md:shadow-[8px_8px_0px_black] -translate-y-1' : 'bg-studio-charcoal text-white/40 hover:text-white hover:bg-studio-charcoal/80'}`}
         >
            <Music size={20} className="md:w-7 md:h-7" />
            Sample Packs
            <span className="ml-1 md:ml-2 text-[8px] md:text-xs bg-black text-studio-yellow px-1 md:px-2 py-0.5 border-2 border-black rotate-12">NEW</span>
         </Link>
         
         <Link 
            href="/browse/presets"
            className={`flex-1 h-14 md:h-20 flex items-center justify-center gap-3 md:gap-4 border-4 border-black text-lg md:text-2xl font-black uppercase italic tracking-tighter transition-all ${type === 'presets' ? 'bg-studio-pink text-white shadow-[4px_4px_0px_black] md:shadow-[8px_8px_0px_black] -translate-y-1' : 'bg-studio-charcoal text-white/40 hover:text-white hover:bg-studio-charcoal/80'}`}
         >
            <Sparkles size={20} className="md:w-7 md:h-7" />
            Producer Presets
            <span className="ml-1 md:ml-2 text-[8px] md:text-xs bg-black text-studio-pink px-1 md:px-2 py-0.5 border-2 border-black rotate-12">HOT</span>
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-3 lg:sticky lg:top-32 space-y-8 order-2 lg:order-1">
           <div className="bg-black border-4 border-black shadow-[8px_8px_0px_rgba(255,200,0,1)] p-6 space-y-6 jagged-border">
              <div className="space-y-1">
                 <h2 className="text-xl font-black uppercase tracking-tighter italic">Quick Filters.</h2>
                 <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Narrow down your sound</p>
              </div>

              <div className="space-y-3">
                 <Link 
                   href={`/browse?type=${type}`}
                   className="block w-full p-3 bg-white/5 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all"
                 >
                    All Genres
                 </Link>
                 {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/browse/genre/${cat.slug}?type=${type}`}
                      className="block w-full p-3 bg-white/5 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-studio-neon hover:text-black transition-all"
                    >
                      {cat.name}
                    </Link>
                 ))}
              </div>
           </div>

           <FlashSalePromo type={type} />
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="lg:col-span-9 order-1 lg:order-2 min-h-[600px]">
          {type === 'packs' ? (
             <div className="space-y-12">
                <div className="space-y-2">
                   <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                      Premium <span className="text-studio-yellow">Packs.</span>
                   </h1>
                   <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Professional Indian Sample Kits & Vocal Stacks</p>
                </div>
                <BrowseLibrary initialPacks={packs} searchQuery={q} />
             </div>
          ) : (
             <div className="space-y-12">
                <div className="space-y-2">
                   <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                      Signature <span className="text-studio-pink">Presets.</span>
                   </h1>
                   <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Mixing Chains & Soundbanks for FL Studio & More</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                   {presets.map((preset: any) => (
                      <PresetCard key={preset.id} preset={preset} />
                   ))}
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  )
}
