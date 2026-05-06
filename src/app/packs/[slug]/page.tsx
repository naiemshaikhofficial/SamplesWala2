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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) return { title: 'Pack Not Found' }

  return {
    title: `${pack.name} | Sampleswala`,
    description: pack.description || `Download ${pack.name} sample pack for professional music production.`,
  }
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

  const { user, owned } = await checkOwnership(pack.id)

  return (
    <PackDetailClient initialPack={pack} owned={owned} user={user} />
  )
}
