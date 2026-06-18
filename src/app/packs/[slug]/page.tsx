import React from 'react'
import { getPackBySlug, getRelatedPacks, getPacks } from '@/app/browse/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { generatePackStructuredData, generateBreadcrumbData } from '@/lib/seo/structuredData'
import { getPackPriceDetails } from '@/lib/pricing'

// 🟢 CPU OPTIMIZATION: Infinite cache (until dynamic on-demand revalidation triggers via webhook).
export const revalidate = false

// 🟢 CPU OPTIMIZATION: Pre-render all pack pages at build time as static HTML.
// This eliminates server CPU usage for the most visited product pages.
export async function generateStaticParams() {
  const packs = await getPacks()
  return packs.map((pack: any) => ({ slug: pack.slug }))
}

import { generatePageMetadata, generatePackMetadata } from '@/lib/seo/metadata'
import { PackDetailClient } from '@/components/PackDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) return { title: 'Pack Not Found' }

  const priceDetails = getPackPriceDetails(pack)
  const dynamicPack = {
    ...pack,
    price_inr: priceDetails.priceInr,
    price_usd: priceDetails.priceUsd
  }

  return generatePackMetadata(dynamicPack)
}

export default async function PackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) notFound()

  const priceDetails = getPackPriceDetails(pack)
  const dynamicPack = {
    ...pack,
    price_inr: priceDetails.priceInr,
    price_usd: priceDetails.priceUsd
  }

  const relatedPacks = await getRelatedPacks((pack as any).categories?.[0]?.name || 'Samples', pack.id)

  const categoryName = (pack as any).categories?.[0]?.name || 'Samples'
  const jsonLd = generatePackStructuredData(dynamicPack)
  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Library', item: 'https://sampleswala.com/browse' },
    { name: pack.name, item: `https://sampleswala.com/packs/${pack.slug}` }
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="flex-grow">
        <PackDetailClient initialPack={pack} />
      </div>

      {/* Related Packs Section */}
      {relatedPacks.length > 0 && (
        <section className="pt-24 pb-36 lg:pb-24 bg-black border-t border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col mb-12">
              <div className="h-1 bg-studio-yellow w-12 mb-4 shadow-[0_0_15px_#FFC800]" />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                You Might Also <span className="text-studio-yellow">Like</span>
              </h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mt-2">
                Explore more {categoryName} sounds
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedPacks.map((item: any) => (
                <Link 
                  key={item.id} 
                  href={`/packs/${item.slug}`}
                  className="group block space-y-4"
                >
                  <div className="aspect-square relative overflow-hidden rounded-sm border border-white/5 group-hover:border-studio-yellow/30 transition-all">
                    <Image 
                      src={item.cover_url || '/placeholder.jpg'} 
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="px-4 py-2 bg-studio-yellow text-black text-[8px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all">
                         View Details
                       </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-black uppercase tracking-tight text-xs group-hover:text-studio-yellow transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-white/40 line-through font-bold">
                        ₹{item.mrp_inr || (Number(item.price_inr) * 3)}
                      </span>
                      <p className="text-[10px] font-black text-studio-neon uppercase italic tracking-tighter">₹{item.price_inr}</p>
                      <div className="bg-studio-yellow px-1 py-0.5 rounded-sm shadow-[2px_2px_0px_black]">
                        <span className="text-[7px] font-black text-black uppercase italic">
                          {Math.round((1 - (Number(item.price_inr) / (item.mrp_inr || (Number(item.price_inr) * 3)))) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
