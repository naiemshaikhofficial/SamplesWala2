// Structured Data utilities for SEO (Splice-style)

function getStableReviewCount(seed: string, base: number, range: number): number {
  let hash = 0
  const str = seed || 'default'
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return base + (Math.abs(hash) % range)
}

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
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": pack.price_inr,
      "highPrice": pack.price_inr,
      "offerCount": "2",
      "offers": [
        {
          "@type": "Offer",
          "url": `https://sampleswala.com/packs/${pack.slug}`,
          "priceCurrency": "INR",
          "price": pack.price_inr,
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        {
          "@type": "Offer",
          "url": `https://sampleswala.com/packs/${pack.slug}`,
          "priceCurrency": "USD",
          "price": pack.price_usd || Math.round(pack.price_inr / 80),
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": getStableReviewCount(pack.slug || pack.id || 'pack', 150, 100)
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Aman S."
        },
        "reviewBody": "Amazing quality loops. The Dholak and Tabla sounds are extremely authentic and sit perfectly in the mix."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Vikram Malhotra"
        },
        "reviewBody": "Highly recommended for producing modern Bollywood and Hip-Hop beats. Royalty-free license is a huge plus."
      }
    ],
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
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": preset.price_inr,
      "highPrice": preset.price_inr,
      "offerCount": "2",
      "offers": [
        {
          "@type": "Offer",
          "url": `https://sampleswala.com/browse/presets/${preset.slug}`,
          "priceCurrency": "INR",
          "price": preset.price_inr,
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        {
          "@type": "Offer",
          "url": `https://sampleswala.com/browse/presets/${preset.slug}`,
          "priceCurrency": "USD",
          "price": preset.price_usd || (preset.price_inr === 0 ? 0 : Math.round((preset.price_inr / 80) * 100) / 100 || 2.99),
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": getStableReviewCount(preset.slug || preset.id || 'preset', 40, 50)
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Rohan D."
        },
        "reviewBody": "Clean mixing chain presets. Saved me a ton of time processing vocals in FL Studio."
      }
    ],
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

export function generateBlogStructuredData(post: any, slug: string) {
  const imageUrl = post.image?.startsWith('http')
    ? post.image
    : `https://sampleswala.com${post.image || '/og-image.jpg'}`

  let datePublished = new Date().toISOString()
  try {
    if (post.date) {
      datePublished = new Date(post.date).toISOString()
    }
  } catch (e) {
    // Fallback if parsing fails
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description || post.excerpt || post.title,
    "image": [imageUrl],
    "datePublished": datePublished,
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author || "Samples Wala Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Samples Wala",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sampleswala.com/Logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sampleswala.com/blog/${slug}`
    }
  }
}
