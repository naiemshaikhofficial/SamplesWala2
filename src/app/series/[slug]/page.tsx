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
      description: 'Download 100% royalty-free Indian sample packs, loops, and stems. Get authentic Tabla thekas, Dholak loops, traditional beats, Sitar melodies, and Bansuri flutes for Bollywood, Hip-Hop, Lofi, and Drill.',
      keywords: [
        'indian sample pack',
        'indian sample packs',
        'indian loops free download',
        'bollywood sample pack',
        'bollywood samples',
        'tabla loops free download',
        'tabla theka loops',
        'dholak loops',
        'dholak theka loops',
        'indian rhythm patterns',
        'classical indian loops',
        'sitar loops',
        'bansuri loops',
        'harmonium loops',
        'indian flute stems',
        'desi beats download',
        'punjabi dholak loops',
        'indian percussion samples',
        'royalty free indian sounds',
        'desi loops',
        'indian music loops'
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

          {/* Particle Floating Animation Styles */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes indianFloatUp {
              0% {
                transform: translateY(0) scale(0.8) rotate(0deg);
                opacity: 0;
              }
              15% {
                opacity: 0.55;
              }
              85% {
                opacity: 0.55;
              }
              100% {
                transform: translateY(-110vh) scale(0.4) rotate(360deg);
                opacity: 0;
              }
            }
            .animate-indian-float-up {
              animation: indianFloatUp linear infinite;
            }
          `}} />

          {/* Gentle Floating Indian Lights / Particles (Saffron & Green & Gold) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {[...Array(20)].map((_, i) => {
              const size = Math.floor(Math.random() * 8) + 4; // 4px to 12px
              const left = Math.floor(Math.random() * 100); // 0% to 100%
              const delay = Math.floor(Math.random() * 15); // 0s to 15s
              const duration = Math.floor(Math.random() * 10) + 18; // 18s to 28s
              const color = i % 3 === 0 ? 'bg-[#FF9933]' : i % 3 === 1 ? 'bg-[#128807]' : 'bg-[#ffe477]';
              return (
                <div
                  key={i}
                  className={`absolute rounded-full opacity-0 filter blur-[1.5px] ${color} animate-indian-float-up`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    bottom: `-20px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}
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
                Download premium royalty-free Indian sample packs, loops, and traditional instrument stems. Get authentic Tabla theka loops, Dholak beats, Sitar melodies, and Bansuri flutes. Clean, high-fidelity sounds ready for Bollywood, Desi Hip-Hop, Punjabi Drill, and Lofi music.
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
