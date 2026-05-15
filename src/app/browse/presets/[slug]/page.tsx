import React from 'react'
import { getPresetBySlug } from '../../actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Youtube, Download, ShieldCheck, Zap, Music, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData, generatePresetStructuredData } from '@/lib/seo/structuredData'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ShareButton } from '@/components/ShareButton'
import { DownloadButton } from '@/components/DownloadButton'

async function checkOwnership(presetId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data, error } = await supabase
      .from('user_vault')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', presetId)
      .maybeSingle()

    if (error) return false
    return !!data
  } catch (e) {
    return false
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const preset = await getPresetBySlug(slug)
  if (!preset) return { title: 'Preset Not Found' }

  const dawList = preset.daws?.join(', ') || 'FL Studio, Ableton, Logic Pro'

  return generatePageMetadata({
    title: `${preset.name} | ${preset.type} Preset for ${preset.daws?.[0] || 'FL Studio'}`,
    description: `Download ${preset.name}, a professional ${preset.type} preset chain for ${dawList}. 100% royalty-free. Includes vocal chains, master presets, and more.`,
    keywords: [
      `${preset.name} preset`,
      `${preset.type} preset`,
      `${preset.daws?.[0] || 'FL Studio'} vocal presets`,
      'Indian vocal presets',
      'Samples Wala presets',
      ...preset.daws || []
    ],
    path: `/browse/presets/${preset.slug}`,
    image: preset.cover_url
  })
}

export default async function PresetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const preset = await getPresetBySlug(slug)
  if (!preset) notFound()

  const isOwned = await checkOwnership(preset.id)
  const isFree = preset.price_inr === 0

  const vId = (() => {
    if (!preset.youtube_url) return null;
    
    // Support for studio.youtube.com/video/ID/edit
    if (preset.youtube_url.includes('studio.youtube.com/video/')) {
        const parts = preset.youtube_url.split('/video/');
        if (parts[1]) {
            const id = parts[1].split('/')[0];
            if (id.length === 11) return id;
        }
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = preset.youtube_url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  })()

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Presets', item: 'https://sampleswala.com/browse/presets' },
    { name: preset.name, item: `https://sampleswala.com/browse/presets/${preset.slug}` }
  ])

  const productData = generatePresetStructuredData(preset)

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
      />

      <Link href="/browse/presets" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-pink transition-colors group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Presets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Info & Action */}
        <div className="lg:col-span-5 space-y-8">
           <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-studio-pink text-white text-[10px] font-black uppercase tracking-widest jagged-border -rotate-2">
                {preset.type}
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {preset.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-black text-studio-neon uppercase italic tracking-widest">
                  {preset.price_inr === 0 ? 'FREE' : `₹${preset.price_inr}`}
                </p>
                {preset.price_inr === 0 && (
                   <div className="px-3 py-1 bg-studio-yellow text-black text-[10px] font-black uppercase tracking-widest jagged-border rotate-2">
                      COMMUNITY GIFT
                   </div>
                )}
              </div>
           </div>

           <p className="text-xs text-white/60 leading-relaxed font-medium bg-black/40 backdrop-blur-md p-6 border border-white/10 rounded-sm">
              {preset.description || `Take your sound to the next level with ${preset.name}. Professionally crafted for high-quality music production.`}
           </p>

           <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-neon">Compatibility</h3>
              <div className="flex flex-wrap gap-3">
                 {preset.daws.map((daw: string) => (
                    <div key={daw} className="px-4 py-2 bg-white/5 border-2 border-black shadow-[4px_4px_0px_black] rounded-sm flex items-center gap-2">
                       {daw === 'FL Studio' && (
                          <div className="relative w-4 h-4">
                             <Image src="/logos/Fl-Studio.png" alt="FL Studio" fill className="object-contain" />
                          </div>
                       )}
                       <span className="text-[10px] font-black uppercase">{daw}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="pt-4">
              {isOwned ? (
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-studio-neon font-black uppercase tracking-widest text-[10px]">
                       <CheckCircle2 size={16} />
                       You own this preset
                    </div>
                    <DownloadButton itemId={preset.id} type="preset" />
                 </div>
              ) : (
                  <div className="grid grid-cols-1 gap-4">
                     <AddToCartButton 
                       item={{
                         id: preset.id,
                         name: preset.name,
                         price: Number(preset.price_inr),
                         slug: preset.slug,
                         cover_url: preset.cover_url || undefined,
                         type: 'preset'
                       }} 
                     />
                     <Link 
                        href={`/checkout?direct=${preset.id}&type=preset`}
                        className="w-full h-16 bg-studio-neon text-black font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[8px_8px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] border-4 border-black"
                     >
                        <Zap size={20} fill="currentColor" />
                        {isFree ? 'GET FOR FREE' : 'BUY NOW'}
                     </Link>
                  </div>
               )}
               
               <div className="pt-2">
                 <ShareButton title={preset.name} text={`Check out this ${preset.type} preset on SamplesWala: ${preset.name}`} />
               </div>
           </div>

           <div className="flex items-center justify-center gap-6 py-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
                <ShieldCheck size={14} className="text-studio-neon" />
                100% Royalty Free
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase">
                <Zap size={14} className="text-studio-yellow" />
                Immediate Access
              </div>
           </div>
        </div>

        {/* Right Column: Video Preview */}
        <div className="lg:col-span-7 space-y-8">
           {vId ? (
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-studio-pink shadow-[0_0_10px_#ff0080]" />
                    <h2 className="text-lg font-black uppercase tracking-tighter italic">Preset Demo</h2>
                 </div>
                 <div className="aspect-video rounded-sm overflow-hidden border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${vId}?rel=0&modestbranding=1`}
                      title={`${preset.name} Demo`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                 </div>
              </div>
           ) : (
              <div className="aspect-video rounded-sm border-4 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/10">
                 <Music size={64} strokeWidth={1} />
                 <p className="text-xs font-black uppercase tracking-[0.4em]">Audio preview coming soon</p>
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4 p-6 bg-black/40 border border-white/10 rounded-sm">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-pink">Pro Tip</h3>
                 <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-wider">
                    For best results, make sure you have the latest version of your DAW and all required stock plugins installed.
                 </p>
              </div>
              <div className="space-y-4 p-6 bg-black/40 border border-white/10 rounded-sm">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-studio-yellow">Installation</h3>
                 <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-wider">
                    Extract the downloaded file and move the preset files into your DAW's respective preset directory.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
