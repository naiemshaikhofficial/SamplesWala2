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

  const packs = await getPacksBySeries(seriesName)

  if (!packs || packs.length === 0) {
    notFound()
  }

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

      {isIndiaJourney && (
        <div className="w-full relative overflow-hidden mb-12 select-none">
          {/* Train Animation CSS */}
          <style dangerouslySetInnerHTML={{
            __html: `
            :root {
              --wheel-dur: 1.6s;
              --tender-wheel-dur: calc(var(--wheel-dur) * 0.5556);
              --chug-dur: calc(var(--wheel-dur) / 2);
              --scenery-far-dur: 110s;
              --scenery-mid-dur: 55s;
              --scenery-near-dur: 26s;
            }
            @media (max-width: 768px) {
              :root {
                --wheel-dur: 1.0s;
                --scenery-far-dur: 60s;
                --scenery-mid-dur: 30s;
                --scenery-near-dur: 14s;
              }
            }
            @keyframes wheelSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes sideRodMove {
              0% { transform: translate(4.5px, 0px); }
              25% { transform: translate(0px, 4.5px); }
              50% { transform: translate(-4.5px, 0px); }
              75% { transform: translate(0px, -4.5px); }
              100% { transform: translate(4.5px, 0px); }
            }
            @keyframes mainRodMove {
              0% { transform: translate(4.5px, 0px) rotate(0deg); }
              25% { transform: translate(0px, 4.5px) rotate(4deg); }
              50% { transform: translate(-4.5px, 0px) rotate(0deg); }
              75% { transform: translate(0px, -4.5px) rotate(-4deg); }
              100% { transform: translate(4.5px, 0px) rotate(0deg); }
            }
            @keyframes pistonSlider {
              0% { transform: translateX(4.5px); }
              50% { transform: translateX(-4.5px); }
              100% { transform: translateX(4.5px); }
            }
            @keyframes trainChug {
              0% { transform: translateY(0px) translateX(0px); }
              25% { transform: translateY(-0.6px) translateX(0.3px); }
              50% { transform: translateY(0px) translateX(0px); }
              75% { transform: translateY(0.6px) translateX(-0.3px); }
              100% { transform: translateY(0px) translateX(0px); }
            }
            @keyframes smokeTrail1 {
              0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
              15% { opacity: 0.85; transform: translate(-12px, -8px) scale(0.9); }
              50% { opacity: 0.45; transform: translate(-40px, -22px) scale(1.7); }
              100% { opacity: 0; transform: translate(-80px, -36px) scale(2.6); }
            }
            @keyframes smokeTrail2 {
              0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
              15% { opacity: 0.85; transform: translate(-12px, -8px) scale(0.9); }
              50% { opacity: 0.45; transform: translate(-40px, -22px) scale(1.7); }
              100% { opacity: 0; transform: translate(-80px, -36px) scale(2.6); }
            }
            @keyframes sceneryMove {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes trackScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-56.55px); }
            }
            .whl-large {
              transform-origin: center;
              animation: wheelSpin var(--wheel-dur) linear infinite;
            }
            .whl-tender {
              transform-origin: center;
              animation: wheelSpin var(--tender-wheel-dur) linear infinite;
            }
            .side-rod {
              animation: sideRodMove var(--wheel-dur) linear infinite;
            }
            .main-rod {
              transform-origin: 183px 34px;
              animation: mainRodMove var(--wheel-dur) linear infinite;
            }
            .piston-crosshead {
              animation: pistonSlider var(--wheel-dur) linear infinite;
            }
            .train-vibe {
              animation: trainChug var(--chug-dur) ease-in-out infinite;
            }
            .sm1 { animation: smokeTrail1 1.2s ease-out infinite; transform-box: fill-box; transform-origin: center; }
            .sm2 { animation: smokeTrail2 1.6s ease-out infinite 0.4s; transform-box: fill-box; transform-origin: center; }
            .sm3 { animation: smokeTrail1 2.0s ease-out infinite 0.8s; transform-box: fill-box; transform-origin: center; }
            .sm4 { animation: smokeTrail2 2.4s ease-out infinite 1.2s; transform-box: fill-box; transform-origin: center; }
            
            .scenery-scroll-far {
              animation: sceneryMove var(--scenery-far-dur) linear infinite;
            }
            .scenery-scroll-mid {
              animation: sceneryMove var(--scenery-mid-dur) linear infinite;
            }
            .scenery-scroll-near {
              animation: sceneryMove var(--scenery-near-dur) linear infinite;
            }
            .track-scroll {
              width: calc(100% + 56.55px);
              animation: trackScroll var(--wheel-dur) linear infinite;
            }
          `}} />

          {/* Tricolor stripe */}
          <div className="h-1 bg-[#F5F0E8]" />
          <div className="flex h-[3px]">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#128807]" />
          </div>

          {/* Scenery + Railroad Area */}
          <div className="h-20 bg-gradient-to-b from-[#e2d6c1] to-[#F5F0E8] relative overflow-hidden">

            {/* Layer 1: Far Parallax (Distant, Slowest) */}
            <div className="absolute bottom-[16px] left-0 h-[28px] flex w-[200%] scenery-scroll-far select-none pointer-events-none" style={{ willChange: 'transform' }}>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 28" preserveAspectRatio="none" fill="none">
                {/* Distant Hills / Mountains */}
                <path d="M0,28 L0,12 C100,6 180,24 280,18 C380,12 450,4 550,14 C650,24 750,8 850,16 C950,24 1050,6 1150,10 C1250,14 1350,22 1450,16 C1550,10 1600,14 1600,14 L1600,28 Z" fill="#e8ded0" opacity="0.6" />
                {/* Soft Clouds */}
                <ellipse cx="150" cy="6" rx="20" ry="4" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="480" cy="4" rx="28" ry="5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="820" cy="8" rx="24" ry="4.5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="1180" cy="5" rx="30" ry="6" fill="#f0e9dd" opacity="0.5" />
              </svg>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 28" preserveAspectRatio="none" fill="none">
                <path d="M0,28 L0,12 C100,6 180,24 280,18 C380,12 450,4 550,14 C650,24 750,8 850,16 C950,24 1050,6 1150,10 C1250,14 1350,22 1450,16 C1550,10 1600,14 1600,14 L1600,28 Z" fill="#e8ded0" opacity="0.6" />
                <ellipse cx="150" cy="6" rx="20" ry="4" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="480" cy="4" rx="28" ry="5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="820" cy="8" rx="24" ry="4.5" fill="#f0e9dd" opacity="0.5" />
                <ellipse cx="1180" cy="5" rx="30" ry="6" fill="#f0e9dd" opacity="0.5" />
              </svg>
            </div>

            {/* Layer 2: Mid Parallax (Medium Speed) */}
            <div className="absolute bottom-[14px] left-0 h-[36px] flex w-[200%] scenery-scroll-mid select-none pointer-events-none" style={{ willChange: 'transform' }}>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 36" preserveAspectRatio="none" fill="none">
                {/* Village Hut 1 */}
                <rect x="80" y="20" width="22" height="16" fill="#d2c4aa" />
                <polygon points="75,20 91,8 107,20" fill="#c3b59a" />
                <rect x="88" y="26" width="6" height="10" fill="#b5a68c" />

                {/* Mandir / Temple */}
                <rect x="260" y="16" width="18" height="20" fill="#d2c4aa" />
                <polygon points="257,16 269,4 281,16" fill="#c3b59a" />
                <line x1="269" y1="0" x2="269" y2="4" stroke="#d2c4aa" strokeWidth="1" />
                <circle cx="269" cy="0" r="1.5" fill="#e1d4be" />
                <rect x="265" y="22" width="8" height="4" fill="#c3b59a" />

                {/* Taj Mahal Silhouette */}
                <g transform="translate(480, 8)">
                  <rect x="20" y="12" width="40" height="16" fill="#d2c4aa" />
                  <ellipse cx="40" cy="12" rx="14" ry="11" fill="#c3b59a" />
                  <line x1="40" y1="0" x2="40" y2="3" stroke="#d2c4aa" strokeWidth="0.8" />
                  <circle cx="40" cy="0" r="1" fill="#e1d4be" />
                  {/* Minarets */}
                  <rect x="8" y="4" width="4" height="24" fill="#d2c4aa" />
                  <ellipse cx="10" cy="4" rx="3" ry="2.2" fill="#c3b59a" />
                  <rect x="68" y="4" width="4" height="24" fill="#d2c4aa" />
                  <ellipse cx="70" cy="4" rx="3" ry="2.2" fill="#c3b59a" />
                </g>

                {/* Samples Wala Station (Classic Platform, Clock Tower, Yellow Signboard) */}
                <g transform="translate(580, 0)">
                  {/* Station building */}
                  <rect x="0" y="16" width="70" height="20" fill="#d2c4aa" />
                  {/* Arched entrance cutouts */}
                  <rect x="8" y="22" width="10" height="14" rx="2" fill="#c3b59a" />
                  <rect x="24" y="22" width="10" height="14" rx="2" fill="#c3b59a" />
                  <rect x="52" y="22" width="10" height="14" rx="2" fill="#c3b59a" />
                  {/* Slanted canopy */}
                  <polygon points="-5,16 75,16 70,12 0,12" fill="#c3b59a" />
                  {/* Central clock tower */}
                  <rect x="38" y="4" width="14" height="12" fill="#d2c4aa" />
                  <path d="M38,4 L45,0 L52,4 Z" fill="#b5a68c" />
                  <circle cx="45" cy="7" r="2.2" fill="#e1d4be" stroke="#d2c4aa" strokeWidth="0.5" />
                  {/* Station Signboard */}
                  <line x1="78" y1="20" x2="78" y2="36" stroke="#b5a68c" strokeWidth="0.8" />
                  <line x1="102" y1="20" x2="102" y2="36" stroke="#b5a68c" strokeWidth="0.8" />
                  <rect x="74" y="15" width="32" height="9" rx="1" fill="#ffe477" stroke="#ca9800" strokeWidth="0.6" />
                  {/* Black border inside yellow sign */}
                  <rect x="75" y="16" width="30" height="7" rx="0.5" fill="none" stroke="#222" strokeWidth="0.3" />
                  <text x="90" y="21.5" textAnchor="middle" fill="#000" fontSize="3.8" fontWeight="900" fontFamily="'Outfit', 'Inter', sans-serif" letterSpacing="0.2">SAMPLES WALA</text>
                </g>

                {/* Urban Cityscape */}
                <rect x="740" y="12" width="16" height="24" fill="#d2c4aa" />
                <rect x="758" y="16" width="14" height="20" fill="#c3b59a" />
                <rect x="774" y="8" width="12" height="28" fill="#d2c4aa" />
                <rect x="744" y="15" width="3" height="3" fill="#e1d4be" />
                <rect x="744" y="21" width="3" height="3" fill="#e1d4be" />
                <rect x="763" y="20" width="3" height="3" fill="#e1d4be" />
                <rect x="763" y="25" width="3" height="3" fill="#e1d4be" />
                <rect x="778" y="12" width="3" height="3" fill="#e1d4be" />
                <rect x="778" y="18" width="3" height="3" fill="#e1d4be" />

                {/* Mosque Dome */}
                <rect x="980" y="16" width="22" height="20" fill="#d2c4aa" />
                <ellipse cx="991" y="16" rx="11" ry="8" fill="#c3b59a" />
                <line x1="991" y1="5" x2="991" y2="8" stroke="#d2c4aa" strokeWidth="0.8" />
                <circle cx="991" cy="5" r="1.2" fill="#e1d4be" />

                {/* Village Hut 2 */}
                <rect x="1150" y="22" width="20" height="14" fill="#d2c4aa" />
                <polygon points="1146,22 1160,11 1174,22" fill="#c3b59a" />

                {/* India Gate Gateway Arch */}
                <g transform="translate(1320, 6)">
                  <rect x="4" y="6" width="6" height="24" fill="#d2c4aa" />
                  <rect x="34" y="6" width="6" height="24" fill="#d2c4aa" />
                  <rect x="0" y="3" width="44" height="5" rx="1.2" fill="#c3b59a" />
                  <ellipse cx="22" y="7" rx="14" ry="9" fill="none" stroke="#d2c4aa" strokeWidth="1.2" />
                  <rect x="14" y="0" width="16" height="3" fill="#b5a68c" />
                </g>
              </svg>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 36" preserveAspectRatio="none" fill="none">
                <rect x="80" y="20" width="22" height="16" fill="#d2c4aa" />
                <polygon points="75,20 91,8 107,20" fill="#c3b59a" />
                <rect x="88" y="26" width="6" height="10" fill="#b5a68c" />

                <rect x="260" y="16" width="18" height="20" fill="#d2c4aa" />
                <polygon points="257,16 269,4 281,16" fill="#c3b59a" />
                <line x1="269" y1="0" x2="269" y2="4" stroke="#d2c4aa" strokeWidth="1" />
                <circle cx="269" cy="0" r="1.5" fill="#e1d4be" />
                <rect x="265" y="22" width="8" height="4" fill="#c3b59a" />

                <g transform="translate(480, 8)">
                  <rect x="20" y="12" width="40" height="16" fill="#d2c4aa" />
                  <ellipse cx="40" cy="12" rx="14" ry="11" fill="#c3b59a" />
                  <line x1="40" y1="0" x2="40" y2="3" stroke="#d2c4aa" strokeWidth="0.8" />
                  <circle cx="40" cy="0" r="1" fill="#e1d4be" />
                  <rect x="8" y="4" width="4" height="24" fill="#d2c4aa" />
                  <ellipse cx="10" cy="4" rx="3" ry="2.2" fill="#c3b59a" />
                  <rect x="68" y="4" width="4" height="24" fill="#d2c4aa" />
                  <ellipse cx="70" cy="4" rx="3" ry="2.2" fill="#c3b59a" />
                </g>

                {/* Samples Wala Station (Classic Platform, Clock Tower, Yellow Signboard) */}
                <g transform="translate(580, 0)">
                  {/* Station building */}
                  <rect x="0" y="16" width="70" height="20" fill="#d2c4aa" />
                  {/* Arched entrance cutouts */}
                  <rect x="8" y="22" width="10" height="14" rx="2" fill="#c3b59a" />
                  <rect x="24" y="22" width="10" height="14" rx="2" fill="#c3b59a" />
                  <rect x="52" y="22" width="10" height="14" rx="2" fill="#c3b59a" />
                  {/* Slanted canopy */}
                  <polygon points="-5,16 75,16 70,12 0,12" fill="#c3b59a" />
                  {/* Central clock tower */}
                  <rect x="38" y="4" width="14" height="12" fill="#d2c4aa" />
                  <path d="M38,4 L45,0 L52,4 Z" fill="#b5a68c" />
                  <circle cx="45" cy="7" r="2.2" fill="#e1d4be" stroke="#d2c4aa" strokeWidth="0.5" />
                  {/* Station Signboard */}
                  <line x1="78" y1="20" x2="78" y2="36" stroke="#b5a68c" strokeWidth="0.8" />
                  <line x1="102" y1="20" x2="102" y2="36" stroke="#b5a68c" strokeWidth="0.8" />
                  <rect x="74" y="15" width="32" height="9" rx="1" fill="#ffe477" stroke="#ca9800" strokeWidth="0.6" />
                  {/* Black border inside yellow sign */}
                  <rect x="75" y="16" width="30" height="7" rx="0.5" fill="none" stroke="#222" strokeWidth="0.3" />
                  <text x="90" y="21.5" textAnchor="middle" fill="#000" fontSize="3.8" fontWeight="900" fontFamily="'Outfit', 'Inter', sans-serif" letterSpacing="0.2">SAMPLES WALA</text>
                </g>

                <rect x="740" y="12" width="16" height="24" fill="#d2c4aa" />
                <rect x="758" y="16" width="14" height="20" fill="#c3b59a" />
                <rect x="774" y="8" width="12" height="28" fill="#d2c4aa" />
                <rect x="744" y="15" width="3" height="3" fill="#e1d4be" />
                <rect x="744" y="21" width="3" height="3" fill="#e1d4be" />
                <rect x="763" y="20" width="3" height="3" fill="#e1d4be" />
                <rect x="763" y="25" width="3" height="3" fill="#e1d4be" />
                <rect x="778" y="12" width="3" height="3" fill="#e1d4be" />
                <rect x="778" y="18" width="3" height="3" fill="#e1d4be" />

                <rect x="980" y="16" width="22" height="20" fill="#d2c4aa" />
                <ellipse cx="991" y="16" rx="11" ry="8" fill="#c3b59a" />
                <line x1="991" y1="5" x2="991" y2="8" stroke="#d2c4aa" strokeWidth="0.8" />
                <circle cx="991" cy="5" r="1.2" fill="#e1d4be" />

                <rect x="1150" y="22" width="20" height="14" fill="#d2c4aa" />
                <polygon points="1146,22 1160,11 1174,22" fill="#c3b59a" />

                <g transform="translate(1320, 6)">
                  <rect x="4" y="6" width="6" height="24" fill="#d2c4aa" />
                  <rect x="34" y="6" width="6" height="24" fill="#d2c4aa" />
                  <rect x="0" y="3" width="44" height="5" rx="1.2" fill="#c3b59a" />
                  <ellipse cx="22" y="7" rx="14" ry="9" fill="none" stroke="#d2c4aa" strokeWidth="1.2" />
                  <rect x="14" y="0" width="16" height="3" fill="#b5a68c" />
                </g>
              </svg>
            </div>

            {/* Layer 3: Near Parallax (Fastest Background) */}
            <div className="absolute bottom-[14px] left-0 h-[46px] flex w-[200%] scenery-scroll-near select-none pointer-events-none" style={{ willChange: 'transform' }}>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 46" preserveAspectRatio="none" fill="none">
                {/* Coconut Palms */}
                <g transform="translate(40, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>
                <g transform="translate(320, 0)">
                  <line x1="25" y1="46" x2="20" y2="6" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,6 Q8,8 0,12 M20,6 Q10,2 6,-4 M20,6 Q25,-1 33,-2 M20,6 Q28,6 38,9 M20,6 Q25,12 26,20" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="6" r="1.5" fill="#a99b82" />
                </g>

                {/* Telegraph / Electric Pole */}
                <g transform="translate(580, 4)">
                  <line x1="10" y1="42" x2="10" y2="0" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="2" y1="4" x2="18" y2="4" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="4" y1="8" x2="16" y2="8" stroke="#bcae95" strokeWidth="1" />
                  <circle cx="4" cy="2" r="1" fill="#a99b82" />
                  <circle cx="16" cy="2" r="1" fill="#a99b82" />
                </g>

                <g transform="translate(860, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(1120, 0)">
                  <line x1="25" y1="46" x2="20" y2="8" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,8 Q8,10 0,14 M20,8 Q10,4 6,-2 M20,8 Q25,1 33,0 M20,8 Q28,8 38,11 M20,8 Q25,14 26,22" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="8" r="1.5" fill="#a99b82" />
                </g>

                {/* Fence posts */}
                <g transform="translate(1380, 26)">
                  <line x1="0" y1="20" x2="0" y2="0" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="30" y2="2" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="60" y1="20" x2="60" y2="0" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="0" y1="6" x2="60" y2="7" stroke="#a99b82" strokeWidth="0.8" />
                  <line x1="0" y1="12" x2="60" y2="13" stroke="#a99b82" strokeWidth="0.8" />
                </g>
              </svg>
              <svg className="w-1/2 h-full" viewBox="0 0 1600 46" preserveAspectRatio="none" fill="none">
                <g transform="translate(40, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>
                <g transform="translate(320, 0)">
                  <line x1="25" y1="46" x2="20" y2="6" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,6 Q8,8 0,12 M20,6 Q10,2 6,-4 M20,6 Q25,-1 33,-2 M20,6 Q28,6 38,9 M20,6 Q25,12 26,20" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="6" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(580, 4)">
                  <line x1="10" y1="42" x2="10" y2="0" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="2" y1="4" x2="18" y2="4" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="4" y1="8" x2="16" y2="8" stroke="#bcae95" strokeWidth="1" />
                  <circle cx="4" cy="2" r="1" fill="#a99b82" />
                  <circle cx="16" cy="2" r="1" fill="#a99b82" />
                </g>

                <g transform="translate(860, 0)">
                  <line x1="15" y1="46" x2="20" y2="10" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,10 Q10,12 2,16 M20,10 Q12,6 8,0 M20,10 Q24,4 32,2 M20,10 Q28,10 38,13 M20,10 Q25,16 28,24" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="10" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(1120, 0)">
                  <line x1="25" y1="46" x2="20" y2="8" stroke="#bcae95" strokeWidth="1.8" />
                  <path d="M20,8 Q8,10 0,14 M20,8 Q10,4 6,-2 M20,8 Q25,1 33,0 M20,8 Q28,8 38,11 M20,8 Q25,14 26,22" stroke="#a99b82" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="8" r="1.5" fill="#a99b82" />
                </g>

                <g transform="translate(1380, 26)">
                  <line x1="0" y1="20" x2="0" y2="0" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="30" y2="2" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="60" y1="20" x2="60" y2="0" stroke="#bcae95" strokeWidth="1.5" />
                  <line x1="0" y1="6" x2="60" y2="7" stroke="#a99b82" strokeWidth="0.8" />
                  <line x1="0" y1="12" x2="60" y2="13" stroke="#a99b82" strokeWidth="0.8" />
                </g>
              </svg>
            </div>

            {/* Railroad Track (Scrolling perfectly in sync with wheel rotation) */}
            <div className="absolute bottom-0 left-0 h-[14px] track-scroll select-none pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <pattern id="movingTiesSeries" x="0" y="0" width="56.55" height="14" patternUnits="userSpaceOnUse">
                    {/* Sleeper 1 */}
                    <rect x="8" y="4" width="12" height="5" rx="0.5" fill="#bcaea0" stroke="#8c7d6e" strokeWidth="0.5" />
                    <line x1="10" y1="5.5" x2="18" y2="5.5" stroke="#9e8f80" strokeWidth="0.3" />
                    <line x1="9" y1="7.5" x2="19" y2="7.5" stroke="#9e8f80" strokeWidth="0.3" />
                    {/* Sleeper 2 */}
                    <rect x="36" y="4" width="12" height="5" rx="0.5" fill="#bcaea0" stroke="#8c7d6e" strokeWidth="0.5" />
                    <line x1="38" y1="5.5" x2="46" y2="5.5" stroke="#9e8f80" strokeWidth="0.3" />
                    <line x1="37" y1="7.5" x2="47" y2="7.5" stroke="#9e8f80" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="14" fill="url(#movingTiesSeries)" />
              </svg>
            </div>

            {/* Steel Rails (static overlay on top of sleepers) */}
            <div className="absolute bottom-[3px] left-0 w-full h-[2px] bg-[#c3b6a2] shadow-[0_1px_0_#9c8e7a] opacity-90" />
            <div className="absolute bottom-[9px] left-0 w-full h-[2px] bg-[#c3b6a2] shadow-[0_1px_0_#9c8e7a] opacity-90" />

            {/* === ANIMATED TRAIN IN CINEMATIC TRACKING POSITION === */}
            <div className="absolute bottom-[3px] left-[8%] md:left-[18%] z-20 train-vibe" style={{ willChange: 'transform' }}>

              {/* Smoke trailing behind (to the left) */}
              <svg className="absolute overflow-visible" style={{ top: '-36px', left: '110px' }} width="120" height="42" viewBox="0 0 120 42" fill="none">
                <circle className="sm1" cx="65" cy="38" r="4.5" fill="#eeeeee" />
                <circle className="sm2" cx="65" cy="38" r="5.5" fill="#e6e6e6" />
                <circle className="sm3" cx="65" cy="38" r="7.0" fill="#dddddd" />
                <circle className="sm4" cx="65" cy="38" r="8.5" fill="#d0d0d0" />
              </svg>

              {/* Detailed High-Fidelity Steam Engine SVG */}
              <svg width="240" height="48" viewBox="0 0 240 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Firebox Glow */}
                  <radialGradient id="fireboxGlowSeries" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ff5500" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#ffaa00" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                  </radialGradient>
                  {/* Headlight Beam */}
                  <linearGradient id="headlightBeamSeries" x1="0" y1="0.5" x2="1" y2="0.5">
                    <stop offset="0%" stopColor="#fff294" stopOpacity="0.55" />
                    <stop offset="25%" stopColor="#ffde6a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffde6a" stopOpacity="0" />
                  </linearGradient>
                  {/* Dark Metallic Steel */}
                  <linearGradient id="steelDarkSeries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3c3d42" />
                    <stop offset="40%" stopColor="#25262a" />
                    <stop offset="85%" stopColor="#17181c" />
                    <stop offset="100%" stopColor="#0f1012" />
                  </linearGradient>
                  {/* Light Metallic Steel */}
                  <linearGradient id="steelLightSeries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#80858c" />
                    <stop offset="25%" stopColor="#abb1b8" />
                    <stop offset="60%" stopColor="#606469" />
                    <stop offset="100%" stopColor="#3c3d42" />
                  </linearGradient>
                  {/* Brass / Gold Details */}
                  <linearGradient id="brassGoldSeries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffe477" />
                    <stop offset="30%" stopColor="#f7c00e" />
                    <stop offset="70%" stopColor="#ca9800" />
                    <stop offset="100%" stopColor="#8d6800" />
                  </linearGradient>
                </defs>

                {/* === LOCOMOTIVE HEADLIGHT GLOW BEAM === */}
                <polygon points="190,19 240,4 240,34" fill="url(#headlightBeamSeries)" opacity="0.8" pointerEvents="none" />

                {/* === INDIA JOURNEY TENDER (Wood/Metal Carriage for Cart) === */}
                <rect x="5" y="14" width="58" height="22" rx="2" fill="url(#steelDarkSeries)" stroke="#111" strokeWidth="0.8" />
                {/* Plaque backing */}
                <rect x="8" y="16" width="52" height="18" rx="1.5" fill="#1b1c20" stroke="#333" strokeWidth="0.5" />
                {/* Plaque Gold Border */}
                <rect x="9" y="17" width="50" height="16" rx="1" fill="none" stroke="url(#brassGoldSeries)" strokeWidth="0.8" />

                {/* Plaque Text - Elegant Tricolor Style */}
                <text x="34" y="24" textAnchor="middle" fill="#FF9933" fontSize="6.5" fontWeight="900" fontFamily="'Outfit', 'Inter', sans-serif" letterSpacing="0.8">INDIA</text>
                <text x="34" y="31" textAnchor="middle" fill="#128807" fontSize="5.5" fontWeight="900" fontFamily="'Outfit', 'Inter', sans-serif" letterSpacing="0.8">JOURNEY</text>

                {/* Tender Wheels Suspension leaf springs */}
                <path d="M12,36 Q20,32 28,36" stroke="#444" strokeWidth="1.2" fill="none" />
                <path d="M40,36 Q48,32 56,36" stroke="#444" strokeWidth="1.2" fill="none" />

                {/* Tender Wheels (r = 5, center y = 38 so bottom touches y = 43) */}
                <g className="whl-tender" style={{ transformOrigin: '20px 38px' }}>
                  <circle cx="20" cy="38" r="5" fill="#222" stroke="#444" strokeWidth="0.8" />
                  <circle cx="20" cy="38" r="3.5" fill="none" stroke="#555" strokeWidth="0.6" />
                  <line x1="20" y1="33" x2="20" y2="43" stroke="#555" strokeWidth="0.5" />
                  <line x1="15" y1="38" x2="25" y2="38" stroke="#555" strokeWidth="0.5" />
                  <circle cx="20" cy="38" r="1.5" fill="url(#brassGoldSeries)" />
                </g>
                <g className="whl-tender" style={{ transformOrigin: '48px 38px' }}>
                  <circle cx="48" cy="38" r="5" fill="#222" stroke="#444" strokeWidth="0.8" />
                  <circle cx="48" cy="38" r="3.5" fill="none" stroke="#555" strokeWidth="0.6" />
                  <line x1="48" y1="33" x2="48" y2="43" stroke="#555" strokeWidth="0.5" />
                  <line x1="43" y1="38" x2="53" y2="38" stroke="#555" strokeWidth="0.5" />
                  <circle cx="48" cy="38" r="1.5" fill="url(#brassGoldSeries)" />
                </g>

                {/* === COUPLING LINK === */}
                <rect x="63" y="28" width="8" height="2" rx="0.5" fill="#222" stroke="#444" strokeWidth="0.4" />
                <circle cx="67" cy="29" r="1" fill="#444" />

                {/* === STEAM LOCOMOTIVE ENGINE === */}

                {/* Cab Firebox Window Glow Effect */}
                <rect x="76" y="8" width="28" height="28" rx="1.5" fill="url(#steelDarkSeries)" stroke="#111" strokeWidth="0.8" />
                {/* Glow from within */}
                <rect x="80" y="12" width="10" height="10" rx="0.8" fill="url(#fireboxGlowSeries)" />
                <rect x="92" y="12" width="9" height="10" rx="0.8" fill="url(#fireboxGlowSeries)" />
                {/* Cabin silhouette of driver */}
                <path d="M83,22 Q86,16 88,18 Q89,20 86,22 Z" fill="#111" opacity="0.85" />
                {/* Gold Handrails on cabin */}
                <line x1="73" y1="12" x2="73" y2="34" stroke="url(#brassGoldSeries)" strokeWidth="0.6" />
                <line x1="105" y1="12" x2="105" y2="34" stroke="url(#brassGoldSeries)" strokeWidth="0.6" />
                {/* Cab Roof */}
                <path d="M72,8 L108,8 Q108,5 106,5 L74,5 Q72,5 72,8 Z" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.5" />

                {/* Boiler Body */}
                <rect x="104" y="12" width="76" height="24" rx="1" fill="url(#steelDarkSeries)" stroke="#111" strokeWidth="0.8" />
                {/* Boiler front dome cap (Smokebox) */}
                <path d="M180,12 L185,14 Q187,24 185,34 L180,36 Z" fill="#17181c" stroke="#111" strokeWidth="0.5" />

                {/* Shiny Brass/Gold Boiler Rings */}
                <rect x="122" y="11.5" width="2" height="25" fill="url(#brassGoldSeries)" />
                <rect x="142" y="11.5" width="2" height="25" fill="url(#brassGoldSeries)" />
                <rect x="162" y="11.5" width="2" height="25" fill="url(#brassGoldSeries)" />

                {/* Sand Dome & Steam Dome (Gold/Brass) */}
                <path d="M130,12 Q130,5 135,5 Q140,5 140,12 Z" fill="url(#brassGoldSeries)" stroke="#977200" strokeWidth="0.5" />
                <path d="M152,12 Q152,6 156,6 Q160,6 160,12 Z" fill="url(#brassGoldSeries)" stroke="#977200" strokeWidth="0.5" />

                {/* Chimney / Smokestack with Gold Collar */}
                <rect x="171" y="2" width="8" height="10" fill="url(#steelDarkSeries)" stroke="#111" strokeWidth="0.5" />
                <rect x="169" y="0" width="12" height="2.5" rx="0.5" fill="url(#brassGoldSeries)" stroke="#977200" strokeWidth="0.4" />

                {/* Headlight (Volumetric Gold Lantern) */}
                <rect x="184" y="16" width="6" height="7" rx="0.5" fill="url(#brassGoldSeries)" stroke="#977200" strokeWidth="0.5" />
                <circle cx="187" cy="19.5" r="2" fill="#fff" stroke="#ffdd6b" strokeWidth="0.6" />

                {/* Cow Catcher (Grid-Style Pilot at Front) */}
                <polygon points="184,36 198,36 192,44 184,44" fill="#3c3d42" stroke="#111" strokeWidth="0.5" />
                <line x1="187" y1="36" x2="187" y2="44" stroke="url(#brassGoldSeries)" strokeWidth="0.8" />
                <line x1="191" y1="36" x2="190" y2="44" stroke="url(#brassGoldSeries)" strokeWidth="0.8" />
                <line x1="195" y1="36" x2="193" y2="44" stroke="url(#brassGoldSeries)" strokeWidth="0.8" />

                {/* === GIANT DRIVE WHEELS (r = 9, center y = 34) === */}

                {/* Wheel 1 */}
                <g className="whl-large" style={{ transformOrigin: '110px 34px' }}>
                  <circle cx="110" cy="34" r="9" fill="#1b1c20" stroke="url(#steelLightSeries)" strokeWidth="1.5" />
                  {/* Heavy Steel Counterweight wedge */}
                  <path d="M101,34 A9,9 0 0,1 119,34 Z" fill="url(#steelDarkSeries)" opacity="0.85" />
                  {/* Spokes */}
                  <line x1="110" y1="25" x2="110" y2="43" stroke="#888" strokeWidth="0.5" />
                  <line x1="101" y1="34" x2="119" y2="34" stroke="#888" strokeWidth="0.5" />
                  <line x1="103.6" y1="27.6" x2="116.4" y2="40.4" stroke="#888" strokeWidth="0.5" />
                  <line x1="116.4" y1="27.6" x2="103.6" y2="40.4" stroke="#888" strokeWidth="0.5" />
                  {/* Brass Hub */}
                  <circle cx="110" cy="34" r="2.2" fill="url(#brassGoldSeries)" stroke="#222" strokeWidth="0.4" />
                  {/* Crank Pin */}
                  <circle cx="114.5" cy="34" r="1" fill="#fff" stroke="#111" strokeWidth="0.3" />
                </g>

                {/* Wheel 2 */}
                <g className="whl-large" style={{ transformOrigin: '135px 34px' }}>
                  <circle cx="135" cy="34" r="9" fill="#1b1c20" stroke="url(#steelLightSeries)" strokeWidth="1.5" />
                  <path d="M126,34 A9,9 0 0,1 144,34 Z" fill="url(#steelDarkSeries)" opacity="0.85" />
                  <line x1="135" y1="25" x2="135" y2="43" stroke="#888" strokeWidth="0.5" />
                  <line x1="126" y1="34" x2="144" y2="34" stroke="#888" strokeWidth="0.5" />
                  <line x1="128.6" y1="27.6" x2="141.4" y2="40.4" stroke="#888" strokeWidth="0.5" />
                  <line x1="141.4" y1="27.6" x2="128.6" y2="40.4" stroke="#888" strokeWidth="0.5" />
                  <circle cx="135" cy="34" r="2.2" fill="url(#brassGoldSeries)" stroke="#222" strokeWidth="0.4" />
                  <circle cx="139.5" cy="34" r="1" fill="#fff" stroke="#111" strokeWidth="0.3" />
                </g>

                {/* Wheel 3 */}
                <g className="whl-large" style={{ transformOrigin: '160px 34px' }}>
                  <circle cx="160" cy="34" r="9" fill="#1b1c20" stroke="url(#steelLightSeries)" strokeWidth="1.5" />
                  <path d="M151,34 A9,9 0 0,1 169,34 Z" fill="url(#steelDarkSeries)" opacity="0.85" />
                  <line x1="160" y1="25" x2="160" y2="43" stroke="#888" strokeWidth="0.5" />
                  <line x1="151" y1="34" x2="169" y2="34" stroke="#888" strokeWidth="0.5" />
                  <line x1="153.6" y1="27.6" x2="166.4" y2="40.4" stroke="#888" strokeWidth="0.5" />
                  <line x1="166.4" y1="27.6" x2="153.6" y2="40.4" stroke="#888" strokeWidth="0.5" />
                  <circle cx="160" cy="34" r="2.2" fill="url(#brassGoldSeries)" stroke="#222" strokeWidth="0.4" />
                  <circle cx="164.5" cy="34" r="1" fill="#fff" stroke="#111" strokeWidth="0.3" />
                </g>

                {/* === MECHANICAL LINKAGES (Pistons & Crankshafts) === */}

                {/* Sliding Crosshead Joint (slides horizontally in cylinder) */}
                <g className="piston-crosshead">
                  {/* Crosshead block slider */}
                  <rect x="180" y="32" width="6" height="4" rx="0.5" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.4" />
                  {/* Piston shaft sliding into chamber */}
                  <line x1="186" y1="34" x2="198" y2="34" stroke="url(#steelLightSeries)" strokeWidth="1.5" />
                </g>

                {/* Steam Cylinder Piston Chamber (Static) */}
                <rect x="194" y="31.5" width="16" height="5" rx="0.8" fill="url(#steelDarkSeries)" stroke="#111" strokeWidth="0.6" />
                <rect x="193" y="31" width="1.5" height="6" fill="url(#brassGoldSeries)" />

                {/* Side Coupling Rod (Stays perfectly horizontal, translates circularly to link wheels) */}
                <g className="side-rod">
                  <rect x="110" y="33" width="50" height="2" rx="0.5" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.5" />
                  {/* Joint caps on wheels */}
                  <circle cx="110" cy="34" r="1.8" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.4" />
                  <circle cx="135" cy="34" r="1.8" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.4" />
                  <circle cx="160" cy="34" r="1.8" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.4" />
                </g>

                {/* Main Connecting Rod (Pivot-attaches to Wheel 2's crank and crosshead at x=183, y=34) */}
                <g className="main-rod">
                  {/* Rod drawn from center of wheel 2 crank pin (x=139.5, y=34) to crosshead (x=183, y=34) */}
                  <line x1="139.5" y1="34" x2="183" y2="34" stroke="url(#steelLightSeries)" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="139.5" cy="34" r="1.6" fill="url(#steelLightSeries)" stroke="#333" strokeWidth="0.4" />
                </g>

              </svg>
            </div>
          </div>
          <div className="h-[1px] bg-[#c9bfa8]" />
        </div>
      )}

      <div className="container mx-auto px-4 pb-16 flex-1">
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

        <div className="space-y-8">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5">
            <Music size={18} className="text-studio-yellow" />
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Packs in this series ({packs.length})</h2>
          </div>

          <div className="min-h-[500px]">
            <BrowseLibrary initialPacks={packs} isIndiaJourney={isIndiaJourney} />
          </div>
        </div>

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
