import React from 'react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import UnsubscribeClient from './UnsubscribeClient'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = generatePageMetadata({
  title: 'Newsletter Unsubscribe Preferences | Samples Wala',
  description: 'Manage your newsletter preferences and sound drop subscription.',
  path: '/unsubscribe'
})

interface UnsubscribePageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams
  const email = params.email || ''

  return (
    <div className="h-full h-[100dvh] max-h-[100dvh] w-full bg-[#050505] text-white flex flex-col justify-center items-center p-2.5 sm:p-4 relative overflow-hidden font-mono select-none">
      {/* Background Studio Accent Glows */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#FF3131]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-[#FFE600]/10 rounded-full blur-3xl pointer-events-none" />

      {/* SamplesWala Studio Header Logo */}
      <div className="mb-2 sm:mb-3 z-10">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity" title="SamplesWala Home">
          <Image
            src="https://imageshack.com/scaled/medium/921/S5Mxr5.png"
            alt="Samples Wala"
            width={130}
            height={32}
            className="h-auto w-28 sm:w-36"
            priority
          />
        </Link>
      </div>

      <div className="z-10 w-full flex justify-center items-center">
        <UnsubscribeClient email={email} />
      </div>
    </div>
  )
}
