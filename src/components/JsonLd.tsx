import React from 'react'

export interface StorefrontJsonLdProps {
  url?: string
  name?: string
  description?: string
  logo?: string
}

export function StorefrontJsonLd({
  url = 'https://sampleswala.com',
  name = 'Samples Wala',
  description = 'Premium royalty-free Indian loops, trap samples, bollywood vocals, and producer presets crafted for modern music producers.',
  logo = 'https://sampleswala.com/Logo.png',
}: StorefrontJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url: url,
        name: name,
        description: description,
        inLanguage: 'en-US',
        publisher: {
          '@id': `${url}/#organization`,
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${url}/browse?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: name,
        url: url,
        logo: {
          '@type': 'ImageObject',
          url: logo,
          contentUrl: logo,
          caption: name,
        },
        image: logo,
        sameAs: [
          'https://instagram.com/sampleswala',
          'https://youtube.com/@sampleswala',
          'https://t.me/sampleswala',
          'https://x.com/sampleswala',
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@sampleswala.com',
            availableLanguage: ['English', 'Hindi'],
            areaServed: 'World',
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export interface PackJsonLdProps {
  name: string
  slug: string
  description?: string
  image?: string
  priceInr: number
  priceUsd?: number
  categoryName?: string
  ratingValue?: number | string
  reviewCount?: number
  sampleCount?: number
  bpm?: string
  key?: string
}

export function PackJsonLd({
  name,
  slug,
  description,
  image,
  priceInr,
  priceUsd,
  categoryName = 'Sample Pack',
  ratingValue = '4.9',
  reviewCount = 184,
}: PackJsonLdProps) {
  const canonicalUrl = `https://sampleswala.com/packs/${slug}`
  const coverImg = image?.startsWith('http')
    ? image
    : `https://sampleswala.com${image || '/og-image.jpg'}`

  const numericInr = Number(priceInr) || 0
  const numericUsd = priceUsd ? Number(priceUsd) : Math.round(numericInr / 80) || 9.99
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'MusicAlbum', 'AudioObject'],
    name: name,
    headline: `${name} - Royalty-Free ${categoryName} by Samples Wala`,
    description:
      description ||
      `Download ${name} sample pack by Samples Wala. 100% royalty-free WAV loops, one-shots, and stems for your music production in FL Studio, Ableton, and all DAWs.`,
    image: [coverImg],
    sku: slug,
    brand: {
      '@type': 'Brand',
      name: 'Samples Wala',
    },
    genre: categoryName,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: numericInr.toFixed(2),
      highPrice: numericInr.toFixed(2),
      offerCount: '2',
      offers: [
        {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'INR',
          price: numericInr.toFixed(2),
          priceValidUntil: priceValidUntil,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Samples Wala',
            url: 'https://sampleswala.com',
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
            merchantReturnDays: 0,
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0.00',
              currency: 'INR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'IN',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 0,
                unitCode: 'SEC',
              },
            },
          },
        },
        {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'USD',
          price: numericUsd.toFixed(2),
          priceValidUntil: priceValidUntil,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Samples Wala',
            url: 'https://sampleswala.com',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(ratingValue),
      reviewCount: Number(reviewCount) || 120,
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export interface FaqItem {
  question: string
  answer: string
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://sampleswala.com${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
