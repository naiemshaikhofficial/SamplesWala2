import React from 'react'
import { getPacksBySeries } from '../../browse/actions'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import Link from 'next/link'
import Image from 'next/image'
import { generatePageMetadata, generateSmartKeywords } from '@/lib/seo/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { Music, ChevronLeft } from 'lucide-react'
import { getPackPriceDetails } from '@/lib/pricing'
import { TrainAnimation } from '@/components/TrainAnimation'

// 🟢 CDN CACHING: Infinite static cache (cleared on-demand via database webhook only)
export const revalidate = false

export async function generateStaticParams() {
  return [
    { slug: 'india-journey' }
  ]
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const seriesName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  if (slug === 'india-journey') {
    return generatePageMetadata({
      title: 'Indian Sample Packs & Loops | India Journey Series | SamplesWala',
      description: 'Download 100% royalty-free authentic Indian sample packs. Professional Tabla loops, Dholak beats, Sitar melodies, Bansuri flutes, and vocal chops for Bollywood, Hip-Hop, and Lofi.',
      keywords: [
        'indian sample pack',
        'indian sample packs',
        'indian loops free download',
        'bollywood sample pack',
        'bollywood samples',
        'tabla loops free download',
        'dholak loops',
        'indian music loops',
        'sambhalpuri samples',
        'sambhalpuri rythm',
        'indian instrument samples',
        'royalty free indian loops',
        'sitar samples',
        'indian flute loops',
        'indian vocal samples',
        'desi samples',
        'punjabi sample pack',
        'mumbai sample pack',
        'desi loops'
      ],
      path: `/series/${slug}`
    })
  }

  const keywords = generateSmartKeywords(seriesName, seriesName)

  return generatePageMetadata({
    title: `${seriesName} Series | Premium Indian Sample Packs & Loops | SamplesWala`,
    description: `Explore the official ${seriesName} collection. Download premium royalty-free Indian loops, sample kits, and sounds for modern music production.`,
    keywords,
    path: `/series/${slug}`
  })
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params

  const seriesName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const rawPacks = await getPacksBySeries(seriesName)

  if (!rawPacks || rawPacks.length === 0) {
    notFound()
  }

  // Resolve dynamic prices and status for the whole series list
  const packs = rawPacks.map((p: any) => {
    const priceDetails = getPackPriceDetails(p)
    return {
      ...p,
      price_inr: priceDetails.priceInr,
      price_usd: priceDetails.priceUsd
    }
  })

  const isIndiaJourney = slug === 'india-journey'

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Browse', item: 'https://sampleswala.com/browse' },
    { name: `${seriesName} Series`, item: `https://sampleswala.com/series/${slug}` }
  ])

  // Generate high-fidelity Product Collection Schema for advanced Google ranking
  const collectionSchema = isIndiaJourney ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Indian Sample Packs & Loops | India Journey Series | SamplesWala",
    "description": "Download 100% royalty-free authentic Indian sample packs. Professional Tabla loops, Dholak beats, Sitar melodies, Bansuri flutes, and vocal chops for Bollywood, Hip-Hop, and Lofi.",
    "url": "https://sampleswala.com/series/india-journey",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": packs.length,
      "itemListElement": packs.map((pack: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": pack.name,
          "image": pack.cover_url?.startsWith('http') ? pack.cover_url : `https://sampleswala.com${pack.cover_url || '/og-image.jpg'}`,
          "description": pack.description || `${pack.name} - A premium Indian sample pack in the India Journey Series.`,
          "brand": {
            "@type": "Brand",
            "name": "Samples Wala"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": pack.price_inr || 499,
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "url": `https://sampleswala.com/packs/${pack.slug}`
          }
        }
      }))
    }
  } : null

  // Generate high-fidelity FAQ structured data schema for ultimate Google indexation
  const faqSchema = isIndiaJourney ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes the Samples Wala \"India Journey\" series authentic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our samples are recorded by veteran, award-winning classical musicians in Mumbai, Delhi, and Punjab. Every single percussion hit, flute run, and vocal glide is captured using high-end vintage microphones (such as the Neumann U87 and AKG C414) in acoustically-treated professional studio spaces."
        }
      },
      {
        "@type": "Question",
        "name": "Are these Indian sample packs 100% royalty-free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely! Every loop, one-shot, and melodic stem included in the India Journey series is 100% royalty-free. Once purchased, you own an unrestricted commercial license. You can use these sounds in your commercial music releases, Spotify uploads, Bollywood sound design, film scoring, YouTube videos, or streaming platforms without paying any future royalties, licensing fees, or providing musical credits."
        }
      },
      {
        "@type": "Question",
        "name": "Which DAWs are compatible with these sample packs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our loops and samples are delivered in industry-standard, high-definition 24-bit WAV format. This makes them universally compatible with every major digital audio workstation (DAW) on the market including FL Studio, Ableton Live, Logic Pro, Cubase, Pro Tools, Studio One, GarageBand, Reason, and Bitwig Studio."
        }
      },
      {
        "@type": "Question",
        "name": "What sub-genres can I produce using these loops?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While these sounds are deeply rooted in traditional folk and classical Ragas, they are specifically BPM-labeled, key-labeled, and tailored for modern electronic and urban music fusion including Bollywood & Desi Pop, Punjabi Drill, Desi Hip-Hop, Lofi Beats, Indian Trap, and Organic House."
        }
      },
      {
        "@type": "Question",
        "name": "How do I receive the files after ordering?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "As soon as your payment is completed successfully, you will receive instant digital delivery. You can download your packs directly from your user dashboard, and you will also receive an email receipt featuring high-speed Google Drive and server direct-download links."
        }
      }
    ]
  } : null

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {isIndiaJourney && (
        <div className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10 bg-black">
          {/* Tri-color Ambient Glows */}
          <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#FF9933]/8 blur-[130px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[55%] h-[55%] bg-[#128807]/8 blur-[130px] rounded-full" />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-white/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[30%] left-[10%] w-[35%] h-[35%] bg-[#000080]/5 blur-[120px] rounded-full" />

          {/* Majestic Rotating Watermark Mandala Watermarks */}
          <div className="absolute left-[2%] top-[25%] w-[500px] h-[500px] opacity-[0.03] select-none pointer-events-none animate-[spin_180s_linear_infinite] text-[#FF9933]">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="0.8">
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="42" strokeDasharray="3,3" />
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="28" strokeDasharray="2,2" />
              <circle cx="50" cy="50" r="20" />
              <circle cx="50" cy="50" r="10" />
              {[...Array(36)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 10} 50 50)`}>
                  <path d="M50,15 Q47,25 50,30 Q53,25 50,15" />
                  <line x1="50" y1="5" x2="50" y2="50" opacity="0.5" />
                  <circle cx="50" cy="15" r="1" fill="#FF9933" />
                </g>
              ))}
            </svg>
          </div>

          <div className="absolute right-[2%] bottom-[15%] w-[500px] h-[500px] opacity-[0.03] select-none pointer-events-none animate-[spin_240s_linear_reverse] text-[#128807]">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="0.8">
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="40" />
              <circle cx="50" cy="50" r="32" strokeDasharray="4,4" />
              <circle cx="50" cy="50" r="24" />
              <circle cx="50" cy="50" r="16" />
              <circle cx="50" cy="50" r="8" />
              {[...Array(24)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 15} 50 50)`}>
                  <path d="M50,10 Q45,20 50,26 Q55,20 50,10" />
                  <line x1="50" y1="2" x2="50" y2="50" opacity="0.6" />
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-12">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to all sounds
        </Link>
      </div>

      {isIndiaJourney && <TrainAnimation />}

      <div className="container mx-auto px-4 pb-16 flex-1">
        {/* Packs in this series */}
        <div className="space-y-8 mb-24">
          {isIndiaJourney ? (
            <div className="relative p-6 border-4 border-black bg-black/75 backdrop-blur-md shadow-[6px_6px_0px_#128807] rounded-sm overflow-hidden select-none jagged-border">
              {/* Map Overlay Background */}
              <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none">
                <Image
                  src="https://imagizer.imageshack.com/v2/1200x800q90/924/42PWtN.png"
                  alt="India Journey Map Background"
                  fill
                  className="object-cover mix-blend-screen"
                  unoptimized
                />
              </div>

              {/* Saffron, White, Green Flag Blur Highlights */}
              <div className="absolute top-[-50%] left-[-10%] w-[30%] h-[200%] bg-[#FF9933]/10 blur-[40px] rounded-full z-0 pointer-events-none" />
              <div className="absolute bottom-[-50%] right-[-10%] w-[30%] h-[200%] bg-[#128807]/10 blur-[40px] rounded-full z-0 pointer-events-none" />

              <div className="relative z-10 flex items-center gap-2">
                <Music size={18} className="text-[#FF9933]" />
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white">
                  Packs in this series ({packs.length})
                </h2>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pb-4 border-b border-white/5">
              <Music size={18} className="text-studio-yellow" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Packs in this series ({packs.length})</h2>
            </div>
          )}

          <div className="min-h-[500px]">
            <BrowseLibrary initialPacks={packs} isIndiaJourney={isIndiaJourney} />
          </div>
        </div>

                {/* Epic Series Title Card */}
        {isIndiaJourney ? (
          <div className="relative p-8 md:p-16 border-4 border-black bg-black/75 backdrop-blur-md shadow-[8px_8px_0px_#FF9933] rounded-sm overflow-hidden mb-16 select-none jagged-border">
            {/* Saffron, White, Green Flag Blur Highlights */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#FF9933]/15 blur-[60px] rounded-full z-0 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[60%] bg-[#128807]/15 blur-[60px] rounded-full z-0 pointer-events-none" />
            <div className="absolute top-[20%] left-[30%] w-[30%] h-[40%] bg-white/5 blur-[80px] rounded-full z-0 pointer-events-none" />

            {/* Ashoka Chakra Slow Spin Background Accent */}
            <div className="absolute right-[-2%] bottom-[-10%] w-60 h-60 opacity-5 pointer-events-none select-none animate-[spin_120s_linear_infinite] text-[#000080] z-0">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="1.2">
                <circle cx="50" cy="50" r="46" />
                <circle cx="50" cy="50" r="40" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="6" fill="#000080" />
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Map Overlay Background */}
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none">
              <Image
                src="https://imagizer.imageshack.com/v2/1200x800q90/924/42PWtN.png"
                alt="India Journey Map Background"
                fill
                className="object-cover mix-blend-screen"
                unoptimized
              />
            </div>

            <div className="relative z-10 space-y-4">
              {/* India Colors Themed Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black border-2 border-black shadow-[3px_3px_0px_#FF9933] rotate-[-1.5deg]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-ping" />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white">
                  AUTHENTIC <span className="text-[#FF9933]">INDIAN</span> <span className="text-white">FOLK</span> &amp; <span className="text-[#128807]">BEATS</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text text-white">
                THE <span className="text-[#FF9933] drop-shadow-[4px_4px_0px_#000]">INDIA</span>{' '}
                <span className="text-[#128807] drop-shadow-[4px_4px_0px_#000]">JOURNEY</span>.
              </h1>
              <p className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-[0.2em] max-w-2xl border-l-2 border-[#FF9933] pl-3 leading-relaxed">
                A premium production suite of high-fidelity Indian folk loops, traditional instrument stems, and authentic percussion. From organic North-Indian Tabla grooves to deep South-Indian Dholak beats, explore royalty-free sounds engineered for Bollywood, Hip-Hop, Drill, and global electronic fusion.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative p-8 md:p-16 border-4 border-black bg-black shadow-[8px_8px_0px_rgba(255,200,0,1)] rounded-sm overflow-hidden mb-16 select-none jagged-border">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-studio-yellow/10 blur-[80px] rounded-full z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-studio-red/10 blur-[80px] rounded-full z-0 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-block px-3 py-1 bg-studio-red text-white font-black uppercase text-[8px] md:text-[9px] tracking-[0.3em] shadow-[3px_3px_0px_black] border-2 border-black rotate-[-1.5deg]">
                OFFICIAL SIGNATURE SERIES
              </div>
              <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text text-white">
                THE {seriesName}.
              </h1>
              <p className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-[0.2em] max-w-2xl border-l-2 border-studio-yellow pl-3">
                A premium collection of high-fidelity Indian folk loops, vocal stacks, and authentic percussion. Built for Bollywood, Hip-Hop, and global crossover productions.
              </p>
            </div>
          </div>
        )}

        {/* Interactive Indian Instrument Showcase Section */}
        {isIndiaJourney && (
          <div className="mt-32 mb-24 space-y-12 select-none">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
              <div>
                <div className="inline-block px-2.5 py-1 bg-[#128807] text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0px_black] border border-black mb-3">
                  CULTURAL SOUND DESIGN
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic text-white">
                  TRADITIONAL <span className="text-[#FF9933]">INSTRUMENT</span> SHOWCASE
                </h2>
              </div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest max-w-sm leading-relaxed">
                Every loop is recorded in high fidelity to capture transient dynamics and rich, authentic resonance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Tabla Card */}
              <div className="border-4 border-black p-6 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#FF9933] transition-all rounded-sm">
                <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform text-[#FF9933]">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="40" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="3" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-[#FF9933] text-white font-black text-[9px] uppercase shadow-[2px_2px_0px_black] border border-black">
                    PERCUSSION
                  </span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Classical rhythm</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-white mb-2 group-hover:text-[#FF9933] transition-colors">
                  THE TABLA
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-wider">
                  The iconic heartbeat of Indian classical music. Intricate bayan (bass) bends and high-pitched, resonant dayan strokes, captured in Mumbai studios. Perfect for Bollywood Pop, Hip-Hop, and Lofi.
                </p>
              </div>

              {/* Dholak Card */}
              <div className="border-4 border-black p-6 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#FFFFFF] transition-all rounded-sm">
                <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform text-white">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <ellipse cx="50" cy="50" rx="45" ry="30" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-white text-black font-black text-[9px] uppercase shadow-[2px_2px_0px_black] border border-black">
                    FOLK BEATS
                  </span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Festive &amp; Energetic</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-white mb-2 group-hover:text-white transition-colors">
                  THE DHOLAK
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-wider">
                  The soul of festive folk. Punchy low-ends and high-pitched wooden taps, custom engineered for maximum impact. Widely used in energetic Punjabi Pop, Desi Drill, and modern street beats.
                </p>
              </div>

              {/* Bansuri Card */}
              <div className="border-4 border-black p-6 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#128807] transition-all rounded-sm">
                <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform text-[#128807]">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                    <line x1="10" y1="50" x2="90" y2="50" />
                    <circle cx="25" cy="50" r="3" fill="currentColor" />
                    <circle cx="40" cy="50" r="3" fill="currentColor" />
                    <circle cx="55" cy="50" r="3" fill="currentColor" />
                    <circle cx="70" cy="50" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-[#128807] text-white font-black text-[9px] uppercase shadow-[2px_2px_0px_black] border border-black">
                    WOODWIND
                  </span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Breathy Melodies</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-white mb-2 group-hover:text-[#128807] transition-colors">
                  THE BANSURI
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-wider">
                  Traditional Indian bamboo flute. Captivating legato phrases, dynamic breath vibratos, and deep emotional textures. Adds instant atmosphere and organic warmth to Lofi, Chillout, and Trap.
                </p>
              </div>

              {/* Sitar Card */}
              <div className="border-4 border-black p-6 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#000080] transition-all rounded-sm">
                <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform text-[#000080]">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M30,90 Q40,40 50,10 Q60,40 70,90 Z" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-[#000080] text-white font-black text-[9px] uppercase shadow-[2px_2px_0px_black] border border-black">
                    STRINGS
                  </span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Mystical resonance</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-white mb-2 group-hover:text-white transition-colors">
                  SITAR &amp; SARANGI
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-wider">
                  Authentic stringed instruments captured using premium condenser mics. Featuring microtonal sliding ornaments (Meend) and sympathetic sympathetic resonances that instantly define the classic Indian sound.
                </p>
              </div>

              {/* Vocal Card */}
              <div className="border-4 border-black p-6 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#FF9933] transition-all rounded-sm">
                <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform text-[#FF9933]">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50,10 A20,20 0 0,0 30,30 V50 A20,20 0 0,0 70,50 V30 A20,20 0 0,0 50,10 Z" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-[#FF9933] text-white font-black text-[9px] uppercase shadow-[2px_2px_0px_black] border border-black">
                    VOCAL ART
                  </span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Desi chants &amp; alaaps</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-white mb-2 group-hover:text-[#FF9933] transition-colors">
                  BOLLYWOOD VOCALS
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-wider">
                  Expressive male and female vocal alaaps, classical sargam phrases, and rhythmic chants. Recorded completely dry to allow maximum flexibility with custom reverbs, delays, and vocal tuning chains.
                </p>
              </div>

              {/* Ragas & Scales Card */}
              <div className="border-4 border-black p-6 bg-[#128807]/10 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#128807] transition-all rounded-sm border-dashed">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-[#128807] text-white font-black text-[9px] uppercase shadow-[2px_2px_0px_black] border border-black">
                    PRO SPEC
                  </span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">BPM &amp; Key Labeled</span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-[#128807] mb-2">
                  MODERN FUSION READY
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-wider">
                  All loops are carefully organized by BPM and key, making them incredibly easy to drop into FL Studio, Ableton, or Logic. Built to blend flawlessly with standard Western minor, Phrygian, and major scales.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Accordion FAQ Section */}
        {isIndiaJourney && (
          <div className="mt-32 mb-24 max-w-4xl mx-auto select-none">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black border border-[#FF9933] shadow-[2px_2px_0px_#FF9933] rotate-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white">
                ANSWERS FOR <span className="text-[#FF9933]">DESI</span> PRODUCERS
              </h2>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                Everything you need to know about the premier Indian Loop &amp; Sample collection.
              </p>
            </div>

            <div className="space-y-6">
              <details className="group border-4 border-black bg-black/60 backdrop-blur-md rounded-sm open:shadow-[6px_6px_0px_#FF9933] transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-xs md:text-sm uppercase tracking-wider text-white list-none group-open:border-b-4 border-black">
                  <span>What makes the Samples Wala &quot;India Journey&quot; series authentic?</span>
                  <span className="transition-transform group-open:rotate-180 text-[#FF9933] font-bold text-xl">&#9662;</span>
                </summary>
                <div className="p-6 text-xs md:text-sm text-white/70 font-semibold uppercase tracking-wide leading-relaxed space-y-2">
                  <p>Our samples are recorded by veteran, award-winning classical musicians in Mumbai, Delhi, and Punjab. Every single percussion hit, flute run, and vocal glide is captured using high-end vintage microphones (such as the Neumann U87 and AKG C414) in acoustically-treated professional studio spaces.</p>
                  <p>This preserves the rich, organic, and authentic acoustic characteristics of traditional Indian instruments, delivering a premium sound library that standard synthetic synths or midi keys cannot replicate.</p>
                </div>
              </details>

              <details className="group border-4 border-black bg-black/60 backdrop-blur-md rounded-sm open:shadow-[6px_6px_0px_#FFFFFF] transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-xs md:text-sm uppercase tracking-wider text-white list-none group-open:border-b-4 border-black">
                  <span>Are these Indian sample packs 100% royalty-free?</span>
                  <span className="transition-transform group-open:rotate-180 text-white font-bold text-xl">&#9662;</span>
                </summary>
                <div className="p-6 text-xs md:text-sm text-white/70 font-semibold uppercase tracking-wide leading-relaxed">
                  Yes, absolutely! Every loop, one-shot, and melodic stem included in the India Journey series is 100% royalty-free. Once purchased, you own an unrestricted commercial license. You can use these sounds in your commercial music releases, Spotify uploads, Bollywood sound design, film scoring, YouTube videos, or streaming platforms without paying any future royalties, licensing fees, or providing musical credits.
                </div>
              </details>

              <details className="group border-4 border-black bg-black/60 backdrop-blur-md rounded-sm open:shadow-[6px_6px_0px_#128807] transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-xs md:text-sm uppercase tracking-wider text-white list-none group-open:border-b-4 border-black">
                  <span>Which DAWs are compatible with these sample packs?</span>
                  <span className="transition-transform group-open:rotate-180 text-[#128807] font-bold text-xl">&#9662;</span>
                </summary>
                <div className="p-6 text-xs md:text-sm text-white/70 font-semibold uppercase tracking-wide leading-relaxed">
                  Our loops and samples are delivered in industry-standard, high-definition 24-bit WAV format. This makes them universally compatible with every major digital audio workstation (DAW) on the market including FL Studio, Ableton Live, Logic Pro, Cubase, Pro Tools, Studio One, GarageBand, Reason, and Bitwig Studio.
                </div>
              </details>

              <details className="group border-4 border-black bg-black/60 backdrop-blur-md rounded-sm open:shadow-[6px_6px_0px_#000080] transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-xs md:text-sm uppercase tracking-wider text-white list-none group-open:border-b-4 border-black">
                  <span>What sub-genres can I produce using these loops?</span>
                  <span className="transition-transform group-open:rotate-180 text-[#000080] font-bold text-xl">&#9662;</span>
                </summary>
                <div className="p-6 text-xs md:text-sm text-white/70 font-semibold uppercase tracking-wide leading-relaxed space-y-2">
                  <p>While these sounds are deeply rooted in traditional folk and classical Ragas, they are specifically BPM-labeled, key-labeled, and tailored for modern electronic and urban music fusion:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bollywood &amp; Desi Pop tracks</li>
                    <li>Punjabi Drill &amp; Desi Hip-Hop beats</li>
                    <li>Lofi Beats &amp; Downtempo Chillout</li>
                    <li>Indian Trap &amp; Ethnic Moombahton</li>
                    <li>Organic House &amp; Afro-Desi Fusion</li>
                  </ul>
                </div>
              </details>

              <details className="group border-4 border-black bg-black/60 backdrop-blur-md rounded-sm open:shadow-[6px_6px_0px_#FF9933] transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-xs md:text-sm uppercase tracking-wider text-white list-none group-open:border-b-4 border-black">
                  <span>How do I receive the files after ordering?</span>
                  <span className="transition-transform group-open:rotate-180 text-[#FF9933] font-bold text-xl">&#9662;</span>
                </summary>
                <div className="p-6 text-xs md:text-sm text-white/70 font-semibold uppercase tracking-wide leading-relaxed">
                  As soon as your payment is completed successfully, you will receive instant digital delivery. You can download your packs directly from your user dashboard, and you will also receive an email receipt featuring high-speed Google Drive and server direct-download links. You can download the zip files immediately and start producing.
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Desi Production Guide (Educational SEO Copy) */}
        {isIndiaJourney && (
          <div className="mt-32 border-4 border-black p-8 md:p-12 bg-black/60 backdrop-blur-md relative overflow-hidden rounded-sm select-none shadow-[8px_8px_0px_rgba(255,255,255,0.05)] mb-16">
            <div className="absolute top-0 right-0 w-[30%] h-full bg-[#128807]/5 skew-x-12 z-0" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-[#FF9933]">
                PRO PRODUCER GUIDE: MIXING INDIAN INSTRUMENTS IN MODERN BEATS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm text-white/60 font-semibold uppercase tracking-wider leading-relaxed">
                <div className="space-y-4">
                  <h4 className="font-black text-white text-[13px] tracking-tight">1. SHAPING TABLA TRANSIENTS</h4>
                  <p>
                    Tabla loops consist of highly dynamic transient hits. To blend them into heavy Hip-Hop or electronic tracks, use a fast transient shaper to pull down the initial sustain if they clash with your primary claps. Applying a high-pass filter at 120Hz will instantly clean up the low mud, allowing the Dayan clicks to cut cleanly through vocal stacks.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-white text-[13px] tracking-tight">2. CONTROLLING DHOLAK LOW FREQUENCIES</h4>
                  <p>
                    Dholak bass hits (Bayan) carry massive organic sub energy that can mud-clash with standard 808s or trap kick drums. We recommend carving a narrow pocket at 50Hz–80Hz using a dynamic EQ. This preserves the warm wooden resonance of the Dholak while keeping your sub bass punching with maximum digital weight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
