import React from 'react'
import { getPackBySlug } from '@/app/browse/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, PlayCircle, ShieldCheck, Zap } from 'lucide-react'
import { DownloadButton } from '@/components/DownloadButton'
import { PaymentButton } from '@/components/PaymentButton'
import { AddToCartButton } from '@/components/AddToCartButton'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { generatePackStructuredData, generateBreadcrumbData } from '@/lib/seo/structuredData'

import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) return { title: 'Pack Not Found' }

  const categoryName = pack.categories?.name || 'Samples'
  const packKeywords = [
    `${pack.name} sample pack`,
    `${pack.name} loops`,
    `${categoryName} samples`,
    `Indian ${categoryName}`,
    'professional sample pack',
    'royalty free loops'
  ]

  return generatePageMetadata({
    title: `${pack.name} - Premium ${categoryName} Pack`,
    description: pack.description || `Download the ${pack.name} ${categoryName} sample pack. Professional quality royalty-free loops and samples for your music production.`,
    image: pack.cover_url || '/og-image.jpg',
    keywords: packKeywords
  })
}

async function checkOwnership(packId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, owned: false }

  // Check vault
  const { data: vaultRecord } = await supabase
    .from('user_vault')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', packId)
    .maybeSingle()

  if (vaultRecord) return { user, owned: true }

  // Check admin
  const { data: adminRecord } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  return { user, owned: !!adminRecord }
}

function getYouTubeId(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

import { PackDetailClient } from '@/components/PackDetailClient'

export default async function PackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)

  if (!pack) notFound()

  const jsonLd = generatePackStructuredData(pack)
  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Library', item: 'https://sampleswala.com/browse' },
    { name: pack.name, item: `https://sampleswala.com/packs/${pack.slug}` }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <PackDetailClient initialPack={pack} owned={owned} user={user} />
    </>
  )
}
