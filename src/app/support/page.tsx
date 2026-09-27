import React from 'react'
import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { SupportClient } from './SupportClient'

export const metadata: Metadata = generatePageMetadata({
  title: 'Help Center & AI Support Assistant — Samples Wala',
  description:
    'Instant assistance for sound packs, audio downloads, payment verification, invoices, DAW troubleshooting (FL Studio, Ableton, Logic Pro), and support ticket tracking.',
  path: '/support',
  keywords: [
    'Samples Wala support',
    'Samples Wala help center',
    'support ticket',
    'sample pack downloads',
    'FL Studio sample pack help',
    'Ableton Live sound pack import',
    'royalty-free music license',
  ],
})

export default function SupportPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Samples Wala Customer Support & Help Desk',
    description: 'Technical support, AI assistance, and ticket tracking for digital audio products.',
    url: 'https://sampleswala.com/support',
    mainEntity: {
      '@type': 'CustomerService',
      serviceType: 'Audio Software Technical Support',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Hindi'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@sampleswala.com',
        url: 'https://sampleswala.com/support',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SupportClient />
    </>
  )
}
