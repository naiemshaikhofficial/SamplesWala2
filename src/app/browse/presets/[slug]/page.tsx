import React from 'react'
import { getPresetBySlug } from '../../actions'
import { notFound } from 'next/navigation'
import { generatePageMetadata, generatePresetMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData, generatePresetStructuredData } from '@/lib/seo/structuredData'
import { createClient } from '@/lib/supabase/server'
import { PresetDetailClient } from '@/components/PresetDetailClient'

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

  return generatePresetMetadata(preset)
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
      />
      <PresetDetailClient 
        preset={preset} 
        isOwned={isOwned} 
        isFree={isFree} 
        vId={vId} 
      />
    </>
  )
}
