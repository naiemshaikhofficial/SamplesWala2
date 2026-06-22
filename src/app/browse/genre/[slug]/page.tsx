import React from 'react'
import { getPacksByCategorySlug, getCategoryBySlug, getAllCategories, getPresetsByCategory } from '../../actions'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { PresetCard } from '@/components/PresetCard'
import Link from 'next/link'
import { generatePageMetadata, generateSmartKeywords } from '@/lib/seo/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { Music, Sparkles, ChevronLeft } from 'lucide-react'

// 🟢 CPU OPTIMIZATION: Infinite cache (until manual or database webhook revalidation triggers).
export const revalidate = false

// 🟢 CPU OPTIMIZATION: Pre-render all genre pages at build time as static HTML.
export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((cat: any) => ({ slug: cat.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ type?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) return {}

  const keywords = generateSmartKeywords(category.name, category.name)

  return generatePageMetadata({
    title: `Best ${category.name} Sample Packs & Presets | SamplesWala`,
    description: `Download premium ${category.name} sample packs, loops, and curated sound kits. 100% royalty-free ${category.name} sounds for music producers.`,
    keywords,
    path: `/browse/genre/${slug}`
  })
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { type = 'packs' } = await searchParams
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  // Parallelize and fetch conditionally to avoid loading unused tab data
  const categoriesPromise = getAllCategories()
  const dataPromise = type === 'packs' 
    ? getPacksByCategorySlug(slug) 
    : getPresetsByCategory(category.id)

  const [categories, data] = await Promise.all([categoriesPromise, dataPromise])
  const packs = type === 'packs' ? data : []
  const presets = type === 'presets' ? data : []

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse', item: 'https://sampleswala.com/browse' },
    { name: category.name, item: `https://sampleswala.com/browse/genre/${slug}` }
  ])

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <Link 
        href="/browse" 
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white mb-8 transition-colors"
      >
        <ChevronLeft size={14} />
        Back to all sounds
      </Link>

      <div className="mb-12 space-y-4">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
          {category.name} <span className={type === 'packs' ? 'text-studio-yellow' : 'text-studio-pink'}>{type === 'packs' ? 'Packs' : 'Presets'}.</span>
        </h1>
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
          Premium {category.name} {type === 'packs' ? 'sample kits' : 'producer presets'}
        </p>
      </div>

      {/* --- TAB SWITCHER --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-16">
         <Link 
            href={`/browse/genre/${slug}?type=packs`}
            className={`flex-1 h-20 flex items-center justify-center gap-4 border-4 border-black text-2xl font-black uppercase italic tracking-tighter transition-all ${type === 'packs' ? 'bg-studio-yellow text-black shadow-[8px_8px_0px_black] -translate-y-1' : 'bg-studio-charcoal text-white/40 hover:text-white'}`}
         >
            <Music size={28} />
            Sample Packs
         </Link>
         
         <Link 
            href={`/browse/genre/${slug}?type=presets`}
            className={`flex-1 h-20 flex items-center justify-center gap-4 border-4 border-black text-2xl font-black uppercase italic tracking-tighter transition-all ${type === 'presets' ? 'bg-studio-pink text-white shadow-[8px_8px_0px_black] -translate-y-1' : 'bg-studio-charcoal text-white/40 hover:text-white'}`}
         >
            <Sparkles size={28} />
            Presets
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-3 space-y-8">
           <div className="bg-black border-4 border-black p-6 space-y-6 shadow-[8px_8px_0px_black] jagged-border">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Other Genres.</h2>
              <div className="space-y-3">
                 {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/browse/genre/${cat.slug}?type=${type}`}
                      className={`block w-full p-3 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-all ${cat.slug === slug ? 'bg-studio-neon text-black' : 'bg-white/5 text-white/40 hover:bg-studio-neon hover:text-black'}`}
                    >
                      {cat.name}
                    </Link>
                 ))}
              </div>
           </div>
        </aside>

        {/* --- CONTENT --- */}
        <main className="lg:col-span-9">
           {type === 'packs' ? (
              packs.length > 0 ? (
                 <BrowseLibrary initialPacks={packs} />
              ) : (
                 <div className="h-64 flex flex-col items-center justify-center border-4 border-black border-dashed opacity-20">
                    <Music size={48} strokeWidth={1} />
                    <p className="font-black uppercase tracking-widest mt-4">No packs in this genre</p>
                 </div>
              )
           ) : (
              presets.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {presets.map((preset: any) => (
                       <PresetCard key={preset.id} preset={preset} />
                    ))}
                 </div>
              ) : (
                 <div className="h-64 flex flex-col items-center justify-center border-4 border-black border-dashed opacity-20">
                    <Sparkles size={48} strokeWidth={1} />
                    <p className="font-black uppercase tracking-widest mt-4">No presets in this genre</p>
                 </div>
              )
           )}
        </main>
      </div>
    </div>
  )
}
