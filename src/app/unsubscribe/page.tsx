import React from 'react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import UnsubscribeClient from './UnsubscribeClient'

export const metadata = generatePageMetadata({
  title: 'Unsubscribe Preferences | Samples Wala',
  description: 'Manage your newsletter subscription preferences.',
  path: '/unsubscribe'
})

interface UnsubscribePageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams
  const email = params.email || ''

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-20 font-sans">
      <UnsubscribeClient email={email} />
    </div>
  )
}
