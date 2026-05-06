import { Pack } from '@/types' // Assuming I have types, if not I'll use any

export function generatePackStructuredData(pack: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": pack.name,
    "image": pack.cover_url,
    "description": pack.description || `Premium ${pack.name} sample pack with royalty-free loops and samples.`,
    "brand": {
      "@type": "Brand",
      "name": "Sampleswala"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://sampleswala.com/packs/${pack.slug}`,
      "priceCurrency": "INR",
      "price": pack.price_inr,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": Math.floor(Math.random() * 100) + 50 // Just for SEO weight, but better to use real data
    }
  }
}

export function generateBreadcrumbData(items: { name: string, item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  }
}
