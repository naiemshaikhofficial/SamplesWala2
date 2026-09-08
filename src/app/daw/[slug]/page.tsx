import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPacks, getPresets } from '@/app/browse/actions'
import { BrowseLibrary } from '@/components/BrowseLibrary'
import { PresetCard } from '@/components/PresetCard'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbData } from '@/lib/seo/structuredData'
import { CheckCircle2, FolderCheck, Cpu, HardDrive, Sparkles, ChevronRight, HelpCircle } from 'lucide-react'

// Infinite static edge cache (purged on demand via webhooks)
export const revalidate = false

interface DawConfig {
  slug: string
  name: string
  headline: string
  tagline: string
  description: string
  vstFolderWindows: string
  vstFolderMac: string
  browserShortcut: string
  dragInstructions: string
  keywords: string[]
  faqs: Array<{ question: string; answer: string }>
}

const DAW_CONFIGS: Record<string, DawConfig> = {
  'fl-studio': {
    slug: 'fl-studio',
    name: 'FL Studio',
    headline: 'FL Studio Indian Sample Packs, Drum Kits & Vocal Presets (2026)',
    tagline: '100% Royalty-Free 24-Bit WAV Loops, Dholak & Tabla Grooves, and Mixing Chains for FL Studio',
    description:
      'Download top-tier Indian sample packs, Bollywood drum kits, and vocal presets built specifically for FL Studio 20, 21, and 26. Drag-and-drop into the FL Studio Browser, Channel Rack, and Edison.',
    vstFolderWindows: 'C:\\Users\\<User>\\Documents\\Image-Line\\FL Studio\\Settings\\Presets',
    vstFolderMac: '~/Documents/Image-Line/FL Studio/Settings/Presets',
    browserShortcut: 'Press Alt + F8 to open Browser',
    dragInstructions:
      'Drag your unzipped SamplesWala folder directly into the FL Studio browser sidebar on the left. You can also drag 24-bit WAV loops directly onto the Playlist or Channel Rack.',
    keywords: [
      'FL Studio indian sample pack',
      'FL Studio sample packs free download',
      'FL Studio drum kits',
      'FL Studio vocal presets',
      'FL Studio tabla loops',
      'FL Studio dholak kit',
      'bollywood sample pack FL Studio',
      'desi loops FL Studio',
    ],
    faqs: [
      {
        question: 'Are SamplesWala packs 100% compatible with FL Studio 20, 21, and 26?',
        answer:
          'Yes! All our loops, one-shots, and stems are exported in pristine 24-bit/44.1kHz WAV format, which works natively across all versions of FL Studio on both Windows and macOS.',
      },
      {
        question: 'How do I add SamplesWala sound packs into the FL Studio Browser?',
        answer:
          'In FL Studio, go to Options > File Settings. Under "Browser extra search folders", click a blank folder row and select your unzipped SamplesWala library. It will appear immediately in your left sidebar browser.',
      },
      {
        question: 'Do the loops stretch automatically to my project tempo in FL Studio?',
        answer:
          'Yes. Every loop filename contains exact BPM and Musical Key tags. You can set the loop audio clip to "Stretch" or "Auto" mode in FL Studio to match any project tempo flawlessly.',
      },
      {
        question: 'Are FL Studio mixing presets included in SamplesWala?',
        answer:
          'Yes, we provide dedicated vocal chains, master bus presets, and mixer track states (.fst) crafted for Bollywood vocals, Punjabi drill bass, and Indian percussion.',
      },
    ],
  },
  'ableton-live': {
    slug: 'ableton-live',
    name: 'Ableton Live',
    headline: 'Ableton Live Indian Sample Packs, Drum Racks & Loops',
    tagline: 'Pristine 24-Bit WAV Indian Percussion, Sitar Melodies, and Drum Racks for Ableton Live 11 & 12',
    description:
      'High-definition Indian loop packs and one-shots mapped for Ableton Live. Drop stems directly into Simpler, Sampler, Drum Racks, or Session and Arrangement views.',
    vstFolderWindows: 'C:\\Users\\<User>\\Documents\\Ableton\\User Library\\Presets',
    vstFolderMac: '~/Music/Ableton/User Library/Presets',
    browserShortcut: 'Press Ctrl + Alt + B (Windows) / Cmd + Option + B (Mac) to open Browser',
    dragInstructions:
      'Under the "Places" section in Ableton\'s browser, click "Add Folder" and select your SamplesWala folder. Drag one-shots directly into Drum Racks or Simpler for instant playback.',
    keywords: [
      'Ableton Live indian sample pack',
      'Ableton sample packs download',
      'Ableton Live drum rack presets',
      'Ableton bollywood samples',
      'Ableton tabla loops',
      'Ableton Live 11 samples',
      'Ableton Live 12 loops',
    ],
    faqs: [
      {
        question: 'How do I use SamplesWala loops with Ableton Live warping?',
        answer:
          'All SamplesWala files are tagged with original BPM. Drag the loop into Session or Arrangement view, ensure Warp is enabled with "Complex Pro" mode for pitch-perfect tempo synchronization.',
      },
      {
        question: 'Can I drop SamplesWala drum one-shots into Ableton Drum Racks?',
        answer:
          'Absolutely. Drag any kick, snare, tabla bols, or dholak hit directly onto a pad inside an Ableton Drum Rack to create custom playable kits.',
      },
      {
        question: 'Does SamplesWala support both Windows and Mac Ableton installations?',
        answer:
          'Yes. 24-bit WAV is universal and works natively on both Windows 10/11 and macOS (Apple Silicon M1/M2/M3/M4 & Intel).',
      },
      {
        question: 'Are these loops 100% royalty-free for commercial releases made in Ableton?',
        answer:
          'Yes, every pack purchased on SamplesWala includes a lifetime commercial license with zero additional royalties or clearance fees required.',
      },
    ],
  },
  'logic-pro': {
    slug: 'logic-pro',
    name: 'Logic Pro',
    headline: 'Logic Pro Indian Sample Packs, Apple Loops & Vocal Chains',
    tagline: '24-Bit Studio WAV Loops & Stems Compatible with Logic Pro X & Quick Sampler',
    description:
      'Download royalty-free Indian percussion, Tabla grooves, and Bollywood vocal stems crafted for Apple Logic Pro on macOS.',
    vstFolderWindows: 'N/A (macOS Exclusive)',
    vstFolderMac: '~/Music/Audio Music Apps/User Loops/',
    browserShortcut: 'Press "O" in Logic Pro to toggle the Loop Browser',
    dragInstructions:
      'Drag your SamplesWala pack folder directly into the Logic Pro Project Audio browser or onto an empty audio track. You can also drag one-shots directly into Quick Sampler.',
    keywords: [
      'Logic Pro indian sample pack',
      'Logic Pro X bollywood loops',
      'Logic Pro tabla samples',
      'Apple loops indian percussion',
      'Logic Pro vocal presets',
      'Logic Pro dholak loops',
    ],
    faqs: [
      {
        question: 'How do I import SamplesWala packs into Logic Pro?',
        answer:
          'Drag the unzipped folder into Logic Pro\'s Tracks area, or open the Loop Browser (key "O") and drag the folder into the loops section to automatically index all files.',
      },
      {
        question: 'Can I use Quick Sampler with SamplesWala sounds in Logic Pro?',
        answer:
          'Yes! Drag any one-shot into the Quick Sampler track header to instantly map it across your MIDI keyboard with automatic pitch detection.',
      },
      {
        question: 'Do SamplesWala files work natively with Apple Silicon M-Series chips?',
        answer:
          'Yes. All WAV files run natively at zero CPU latency across M1, M2, M3, and M4 Apple Mac computers.',
      },
    ],
  },
  'cubase': {
    slug: 'cubase',
    name: 'Steinberg Cubase',
    headline: 'Cubase Sample Packs, Drum Kits & Groove Agent Kits',
    tagline: 'Pro 24-Bit WAV Indian Beats, Dholak Loops & Instrument Stems for Cubase 12, 13 & 14',
    description:
      'High-fidelity Indian music production kits for Steinberg Cubase. Load stems into MediaBay, Sampler Track, or Groove Agent seamlessly.',
    vstFolderWindows: 'C:\\Users\\<User>\\Documents\\Steinberg\\Content',
    vstFolderMac: '~/Library/Application Support/Steinberg/Content',
    browserShortcut: 'Press F5 to open Cubase MediaBay',
    dragInstructions:
      'In MediaBay (F5), navigate to your unzipped SamplesWala directory and click "Favorites" to pin it. Drag loops into the Project window or onto Sampler Tracks.',
    keywords: [
      'Cubase indian sample pack',
      'Cubase sample packs download',
      'Cubase tabla loops',
      'Steinberg Cubase drum kit',
      'Groove Agent indian percussion',
      'Cubase bollywood samples',
    ],
    faqs: [
      {
        question: 'How do I use SamplesWala loops in Cubase with Musical Mode?',
        answer:
          'In Cubase\'s Pool window (Ctrl/Cmd + P), check the "Musical Mode" box for your imported SamplesWala audio clips to lock them to your project tempo instantly.',
      },
      {
        question: 'Can I load these samples into Steinberg Groove Agent?',
        answer:
          'Yes, simply drag any WAV one-shots from MediaBay or your desktop directly onto the Groove Agent drum pads.',
      },
    ],
  },
  'studio-one': {
    slug: 'studio-one',
    name: 'PreSonus Studio One',
    headline: 'Studio One Sample Packs, Sound Sets & Loop Kits',
    tagline: 'Royalty-Free Indian Percussion, Melodies & Stems for Studio One 6 & 7',
    description:
      'Pristine 24-bit audio loops and one-shots compatible with PreSonus Studio One. Drag directly into Impact XT, Sample One XT, or the Arrangement view.',
    vstFolderWindows: 'C:\\Users\\<User>\\Documents\\Studio One\\Sound Sets',
    vstFolderMac: '~/Documents/Studio One/Sound Sets',
    browserShortcut: 'Press F8 to open the Studio One Browser tab',
    dragInstructions:
      'Click the "Files" tab in Studio One\'s right-side browser (F8), right-click your SamplesWala folder and select "Set as Root". Drag files onto tracks or into Impact XT.',
    keywords: [
      'Studio One indian sample pack',
      'PreSonus Studio One samples',
      'Studio One loop kits',
      'Impact XT indian drum kit',
      'Studio One tabla loops',
    ],
    faqs: [
      {
        question: 'How do I map SamplesWala one-shots into Impact XT?',
        answer:
          'Open Impact XT, select a drum bank, and drag up to 16 WAV samples from the Studio One file browser directly onto the pads.',
      },
      {
        question: 'Do SamplesWala loops follow tempo changes in Studio One?',
        answer:
          'Yes! Studio One automatically detects the embedded tempo metadata in our WAV headers and stretches loops cleanly when "Timestretch" is selected in the Inspector.',
      },
    ],
  },
  'reaper': {
    slug: 'reaper',
    name: 'Cockos Reaper',
    headline: 'Reaper Sample Packs, Drum Kits & FX Chain Presets',
    tagline: 'Ultra-Lightweight, High-Quality 24-Bit WAV Indian Loops for Cockos Reaper',
    description:
      'Download royalty-free Indian loops, Tabla hits, and vocal stems formatted for fast, lightweight workflow in Cockos Reaper.',
    vstFolderWindows: 'C:\\Users\\<User>\\AppData\\Roaming\\REAPER\\Data',
    vstFolderMac: '~/Library/Application Support/REAPER/Data',
    browserShortcut: 'Press Ctrl + Alt + X (Windows) / Cmd + Option + X (Mac) for Media Explorer',
    dragInstructions:
      'Open Media Explorer, locate your SamplesWala folder, right-click and choose "Add to shortcut list". Enable "Tempo Match On" to audition loops in real time at your project tempo.',
    keywords: [
      'Reaper indian sample pack',
      'Cockos Reaper sample packs',
      'Reaper drum kits',
      'Reaper tabla loops',
      'Reaper vocal presets',
    ],
    faqs: [
      {
        question: 'How do I audition SamplesWala loops in Reaper at project tempo?',
        answer:
          'In Reaper\'s Media Explorer, set the tempo match dropdown to "Tempo match on". Any SamplesWala loop you click will play in perfect sync with your active timeline.',
      },
      {
        question: 'Can I use ReaSamplOmatic5000 with SamplesWala one-shots?',
        answer:
          'Yes, drag any WAV sample directly into ReaSamplOmatic5000 to trigger Indian percussion or vocal one-shots via MIDI.',
      },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(DAW_CONFIGS).map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const daw = DAW_CONFIGS[slug]
  if (!daw) return notFound()

  return generatePageMetadata({
    title: `${daw.headline} | Samples Wala`,
    description: daw.description,
    keywords: daw.keywords,
    path: `/daw/${daw.slug}`,
  })
}

export default async function DawPage({ params }: PageProps) {
  const { slug } = await params
  const daw = DAW_CONFIGS[slug]
  if (!daw) return notFound()

  const [allPacks, allPresets] = await Promise.all([getPacks(12), getPresets()])

  // Filter presets compatible with this DAW (or fallback to top presets)
  const dawPresets = allPresets
    .filter((p: any) => !p.daws || p.daws.length === 0 || p.daws.includes(daw.name))
    .slice(0, 6)

  const breadcrumbData = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'DAW Compatibility', item: 'https://sampleswala.com/browse' },
    { name: daw.name, item: `https://sampleswala.com/daw/${daw.slug}` },
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: daw.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: daw.headline,
    description: daw.description,
    url: `https://sampleswala.com/daw/${daw.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Samples Wala',
      url: 'https://sampleswala.com',
    },
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-studio-pink selection:text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 border-b border-white/10 overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="container mx-auto px-4 relative z-10 max-w-6xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-studio-pink/40 bg-studio-pink/10 text-studio-pink text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> 100% Native {daw.name} Compatibility
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-tight">
            {daw.name} <span className="text-studio-pink">Sound Packs.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed">
            {daw.tagline}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="#packs"
              className="px-8 py-3.5 bg-studio-yellow text-black font-black uppercase text-xs tracking-widest rounded-sm border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all"
            >
              Explore {daw.name} Packs
            </Link>
            <Link
              href="/browse"
              className="px-8 py-3.5 bg-white/10 text-white font-black uppercase text-xs tracking-widest rounded-sm border-2 border-white/20 hover:bg-white/20 transition-all"
            >
              Browse Entire Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Step-by-Step Installation Guide */}
      <section className="py-20 border-b border-white/10 bg-white/[0.01]">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">
              How to Install in <span className="text-studio-yellow">{daw.name}</span>
            </h2>
            <p className="text-xs md:text-sm text-white/50 font-bold uppercase tracking-widest">
              Zero complicated installers — pure drag & drop workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] space-y-4">
              <div className="w-10 h-10 rounded-full bg-studio-pink/20 border border-studio-pink flex items-center justify-center font-black text-studio-pink">
                1
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Instant ZIP Download</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Download your pack instantly. Right-click and extract the ZIP folder to your preferred audio samples directory.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] space-y-4">
              <div className="w-10 h-10 rounded-full bg-studio-yellow/20 border border-studio-yellow flex items-center justify-center font-black text-studio-yellow">
                2
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Open {daw.name} Browser</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {daw.browserShortcut}. Drag the unzipped pack folder straight into the browser panel to pin it forever.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] space-y-4">
              <div className="w-10 h-10 rounded-full bg-studio-neon/20 border border-studio-neon flex items-center justify-center font-black text-studio-neon">
                3
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Drag & Drop into Project</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {daw.dragInstructions}
              </p>
            </div>
          </div>

          {/* Path Details */}
          <div className="p-6 rounded-lg border border-white/10 bg-white/[0.03] space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-studio-yellow" /> Recommended System Directories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-black/60 rounded border border-white/5 space-y-1">
                <span className="text-white/40 block font-sans font-bold">Windows Location:</span>
                <span className="text-studio-neon select-all break-all">{daw.vstFolderWindows}</span>
              </div>
              <div className="p-3 bg-black/60 rounded border border-white/5 space-y-1">
                <span className="text-white/40 block font-sans font-bold">macOS Location:</span>
                <span className="text-studio-pink select-all break-all">{daw.vstFolderMac}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Sound Packs for this DAW */}
      <section id="packs" className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-7xl space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic">
                Compatible <span className="text-studio-pink">Sound Packs</span>
              </h2>
              <p className="text-xs md:text-sm text-white/50 font-bold uppercase tracking-widest mt-2">
                24-Bit WAV loops & stems tested in {daw.name}
              </p>
            </div>
            <Link
              href="/browse"
              className="text-xs font-black uppercase tracking-widest text-studio-pink hover:underline flex items-center gap-1"
            >
              View all packs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <BrowseLibrary initialPacks={allPacks} />
        </div>
      </section>

      {/* Presets section if available */}
      {dawPresets.length > 0 && (
        <section className="py-20 border-b border-white/10 bg-white/[0.01]">
          <div className="container mx-auto px-4 max-w-7xl space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic">
                {daw.name} <span className="text-studio-yellow">Presets & Mixing Chains</span>
              </h2>
              <p className="text-xs md:text-sm text-white/50 font-bold uppercase tracking-widest mt-2">
                Instant vocal chains and master presets designed for {daw.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dawPresets.map((preset: any, idx: number) => (
                <PresetCard key={preset.id || idx} preset={preset} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-studio-pink" /> Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-white/50 font-bold uppercase tracking-widest">
              Everything you need to know about using SamplesWala in {daw.name}
            </p>
          </div>

          <div className="space-y-4">
            {daw.faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <summary className="font-bold text-base md:text-lg flex justify-between items-center select-none">
                  <span>{faq.question}</span>
                  <span className="text-studio-pink font-black group-open:rotate-90 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-sm text-white/70 mt-4 leading-relaxed pt-3 border-t border-white/5">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
