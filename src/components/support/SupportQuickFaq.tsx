'use client'

import React, { useState } from 'react'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  CreditCard,
  Music,
  ShieldCheck,
  ExternalLink,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

const FAQS = [
  {
    id: 'vault_sync',
    icon: CreditCard,
    question: 'Payment completed but pack not showing in My Library?',
    answer:
      'Bank debits and webhooks normally settle within 30 to 90 seconds. Try clicking "Refresh Library" in your Library page or re-authenticating with the same email you entered during checkout. If still not visible after 5 minutes, submit a ticket with your Order/Payment ID and our team will attach it to your vault instantly.',
    actionLabel: 'Go to My Library',
    actionHref: '/library',
  },
  {
    id: 'corrupt_zip',
    icon: Download,
    question: 'Download stopped midway or ZIP says "Archive Corrupt"?',
    answer:
      'Large sound packs (1GB - 5GB) can fail on unstable mobile networks. We recommend downloading over a stable Wi-Fi connection using Chrome or a dedicated download manager. If your download link has expired, your lifetime vault access always allows you to generate a fresh link anytime from your Library.',
    actionLabel: 'Open Library Vault',
    actionHref: '/library',
  },
  {
    id: 'daw_import',
    icon: Music,
    question: 'Are samples compatible with FL Studio, Ableton, Logic, and Cubase?',
    answer:
      'Yes! All SamplesWala audio assets are exported as uncompressed 24-bit 44.1kHz / 48kHz WAV files. They work natively via drag-and-drop into any DAW or hardware sampler (MPC, Octatrack, Roland SP-404). Serum & Vital presets require modern synthesizer versions.',
    actionLabel: 'View DAW Guide',
    actionHref: '/faq',
  },
  {
    id: 'royalty_license',
    icon: ShieldCheck,
    question: 'Can I release beats on Spotify, YouTube, and commercial labels?',
    answer:
      'Every pack purchased on SamplesWala includes a 100% Royalty-Free Commercial Master Clearance. You keep 100% of your streaming royalties, beat sales, and synchronization earnings without paying secondary fees. You can view your license receipt directly from your order confirmation.',
    actionLabel: 'Check License Terms',
    actionHref: '/terms',
  },
]

export function SupportQuickFaq() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Zap size={18} className="text-studio-yellow" />
            <span>Instant Self-Service Diagnostics</span>
          </h3>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-0.5">
            Resolve 90% of common sound pack questions instantly without waiting for a ticket
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map((faq) => {
          const isOpen = openFaq === faq.id
          const Icon = faq.icon

          return (
            <div
              key={faq.id}
              className={`studio-panel rounded-sm transition-all border ${
                isOpen
                  ? 'border-studio-blue/40 bg-zinc-950/90'
                  : 'border-white/5 bg-zinc-950/40 hover:border-white/20'
              }`}
            >
              <div
                onClick={() => toggle(faq.id)}
                className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-studio-blue mt-0.5">
                    <Icon size={14} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white/90 leading-snug">
                    {faq.question}
                  </h4>
                </div>
                <div className="text-white/40 pt-0.5">
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3 animate-fadeIn">
                  <p className="text-[11px] text-white/60 leading-relaxed font-mono uppercase">
                    {faq.answer}
                  </p>
                  <Link
                    href={faq.actionHref}
                    className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-studio-yellow hover:underline"
                  >
                    <span>{faq.actionLabel}</span>
                    <ExternalLink size={10} />
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
