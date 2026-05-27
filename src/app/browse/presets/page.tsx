import React from 'react'
import { getPresets } from '../actions'
import { PresetCard } from '@/components/PresetCard'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import Link from 'next/link'

export const revalidate = false

export const metadata = generatePageMetadata({
  title: 'Indian Producer Presets | FL Studio & Ableton Kits',
  description: 'Free and premium vocal presets, mixing templates, and VST sound banks for Indian music production. Compatible with FL Studio, Ableton, and Logic Pro.',
  keywords: ['Indian vocal presets', 'FL Studio presets', 'Ableton mixing templates', 'VST sound banks', 'Bollywood vocal chains', 'producer presets', 'music production templates'],
  path: '/browse/presets'
})

export default async function PresetsPage() {
  const presets = await getPresets()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse Library', item: 'https://sampleswala.com/browse' },
    { name: 'Producer Presets', item: 'https://sampleswala.com/browse/presets' }
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
              Producer <span className="text-studio-pink">Presets.</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.3em]">Signature chains & mixing templates</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            <Link 
              href="/browse"
              className="px-4 py-2 bg-white/10 border-2 border-black text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-studio-yellow hover:text-black hover:shadow-[4px_4px_0px_black] transition-all rounded-sm hover:-rotate-1"
            >
              Sound Packs
            </Link>
            <Link 
              href="/browse/presets"
              className="px-4 py-2 bg-studio-pink text-white border-2 border-black shadow-[4px_4px_0px_black] text-[10px] font-black uppercase tracking-widest transition-all rounded-sm -rotate-1"
            >
              All Presets
            </Link>
          </div>
        </div>

        {presets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presets.map((preset: any, index: number) => (
              <PresetCard 
                key={preset.id} 
                preset={preset} 
                priority={index < 6}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
             <div className="text-studio-yellow/20 inline-block">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                   <path d="m7.5 4.27 9 5.15"/>
                   <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                   <path d="m3.3 7 8.7 5 8.7-5"/>
                   <path d="M12 22V12"/>
                </svg>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Presets are being cooked in the studio...</p>
          </div>
        )}
      </section>
    </div>
  )
}
