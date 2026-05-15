import React from 'react'
import { getPacksByCategorySlug, getCategoryBySlug, getAllCategories } from '../../actions'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) return {}

  return generatePageMetadata({
    title: `Best ${category.name} Sample Packs & Loops | SamplesWala`,
    description: `Download premium ${category.name} sample packs, loops, and curated sound kits. 100% royalty-free ${category.name} sounds for music producers.`,
    path: `/browse/genre/${slug}`,
    keywords: [category.name, `${category.name} samples`, `${category.name} loops`, 'Indian sample packs', 'Bollywood sounds']
  })
}

export default async function GenrePage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const packs = await getPacksByCategorySlug(slug)
  const categories = await getAllCategories()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse', item: 'https://sampleswala.com/browse' },
    { name: category.name, item: `https://sampleswala.com/browse/genre/${slug}` }
  ])

  return (
    <div className="container mx-auto px-4 py-20 space-y-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center border-b border-white/5 pb-12 gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              {category.name} <span className="text-studio-yellow">Packs.</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.3em]">
              Premium {category.name} sounds for your next hit
            </p>
          </div>

          {/* Genre Navigation */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            <Link 
              href="/browse"
              className="px-4 py-2 bg-white/10 border-2 border-black text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-studio-neon hover:text-black hover:shadow-[4px_4px_0px_black] transition-all rounded-sm"
            >
              All Genres
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/browse/genre/${cat.slug}`}
                className={`px-4 py-2 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${cat.slug === slug ? 'bg-studio-yellow text-black shadow-[4px_4px_0px_black] -rotate-1' : 'bg-white/10 text-white/80 hover:bg-studio-neon hover:text-black hover:shadow-[4px_4px_0px_black] hover:-rotate-1'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <BrowseLibrary initialPacks={packs} />
        
        {packs.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/40 font-bold uppercase tracking-widest">No packs found in this genre yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
