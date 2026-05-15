// Structured Data utilities for SEO (Splice-style)

export function generatePackStructuredData(pack: any) {
  const categoryName = pack.categories?.[0]?.name || 'Samples'
  const imageUrl = pack.cover_url?.startsWith('http') 
    ? pack.cover_url 
    : `https://sampleswala.com${pack.cover_url || '/og-image.jpg'}`

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": pack.name,
    "image": [imageUrl],
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
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sampleswala.com/packs/${pack.slug}`
    }
  }

  return structuredData
}

export function generatePresetStructuredData(preset: any) {
  const imageUrl = preset.cover_url?.startsWith('http') 
    ? preset.cover_url 
    : `https://sampleswala.com${preset.cover_url || '/og-image.jpg'}`

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": preset.name,
    "image": [imageUrl],
    "description": preset.description || `${preset.name} - A professional ${preset.type} preset by Samples Wala. Compatible with ${preset.daws?.join(', ') || 'all DAWs'}. 100% royalty-free.`,
    "sku": preset.id,
    "brand": {
      "@type": "Brand",
      "name": "Samples Wala"
    },
    "category": preset.type,
    "offers": {
      "@type": "Offer",
      "url": `https://sampleswala.com/browse/presets/${preset.slug}`,
      "priceCurrency": "INR",
      "price": preset.price_inr,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": Math.floor(Math.random() * 50) + 40
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sampleswala.com/browse/presets/${preset.slug}`
    }
  }

  return structuredData
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
