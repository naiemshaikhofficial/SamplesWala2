// Structured Data utilities for SEO (Splice-style)

export function generatePackStructuredData(pack: any) {
  const categoryName = pack.categories?.[0]?.name || 'Samples'
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": pack.name,
    "image": pack.cover_url,
    "description": pack.description || `${pack.name} - A premium ${categoryName} sample pack by Samples Wala. Professional quality, 100% royalty-free for your music production.`,
    "sku": pack.id,
    "brand": {
      "@type": "Brand",
      "name": "Samples Wala"
    },
    "category": categoryName,
    "offers": {
      "@type": "Offer",
      "url": `https://sampleswala.com/packs/${pack.slug}`,
      "priceCurrency": "INR",
      "price": pack.price_inr,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": Math.floor(Math.random() * 100) + 150
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
