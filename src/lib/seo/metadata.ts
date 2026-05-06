import { Metadata } from 'next'

export function generatePageMetadata({
  title,
  description,
  image = '/og-image.jpg',
  noIndex = false
}: {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    }
  }
}
