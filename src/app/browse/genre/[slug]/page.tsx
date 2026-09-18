import React from 'react'
import { getPacksByCategorySlug, getCategoryBySlug, getAllCategories, getPresetsByCategory } from '../../actions'
import { GenreTabsView } from './GenreTabsView'
import Link from 'next/link'
import { generatePageMetadata, generateSmartKeywords } from '@/lib/seo/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { ChevronLeft } from 'lucide-react'

// 🟢 CPU OPTIMIZATION: Infinite cache (until manual or database webhook revalidation triggers).
export const revalidate = false

// 🟢 CPU OPTIMIZATION: Pre-render all genre pages at build time as static HTML.
export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((cat: any) => ({ slug: cat.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) return {}

  const baseName = category.name.toLowerCase()
  const categoryKeywords = [
    `${baseName} free download`,
    `${baseName} loops free`,
    `free ${baseName} download`,
    `download free ${baseName} loops`,
    `best free ${baseName}`,
  ]

  const keywords = [...new Set([
    ...generateSmartKeywords(category.name, category.name),
    ...categoryKeywords
  ])]

  return generatePageMetadata({
    title: `Best ${category.name} Sample Packs & Presets | SamplesWala`,
    description: `Download premium ${category.name} sample packs, loops, and curated sound kits. 100% royalty-free ${category.name} sounds for music producers.`,
    keywords,
    path: `/browse/genre/${slug}`
  })
}

export default async function GenrePage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const [categories, packs, presets] = await Promise.all([
    getAllCategories(),
    getPacksByCategorySlug(slug),
    getPresetsByCategory(category.id)
  ])

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-3 space-y-8">
           <div className="bg-black border-4 border-black p-6 space-y-6 shadow-[8px_8px_0px_black] jagged-border">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Other Genres.</h2>
              <div className="space-y-3">
                 {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/browse/genre/${cat.slug}`}
                      className={`block w-full p-3 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-all ${cat.slug === slug ? 'bg-studio-neon text-black' : 'bg-white/5 text-white/40 hover:bg-studio-neon hover:text-black'}`}
                    >
                      {cat.name}
                    </Link>
                 ))}
              </div>
           </div>
        </aside>

        {/* --- CONTENT WITH TABS --- */}
        <main className="lg:col-span-9">
           <GenreTabsView
             slug={slug}
             categoryName={category.name}
             initialPacks={packs}
             initialPresets={presets}
           />
        </main>
      </div>
    </div>
  )
}
