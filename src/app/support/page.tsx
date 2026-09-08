import React from 'react'
import Link from 'next/link'
import { LifeBuoy, ShieldCheck, Zap, Headphones, ArrowLeft, Instagram, Mail } from 'lucide-react'
import { SupportConveyor } from '@/components/support/SupportConveyor'
import { SupportDeskClient } from '@/components/support/SupportDeskClient'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata = generatePageMetadata({
  title: 'Support Desk & Tickets | Samples Wala Help Center',
  description:
    'Need help with sample pack downloads, payment receipts, DAW compatibility in FL Studio or Ableton, or commercial licensing? Open a support ticket on Samples Wala.',
  path: '/support',
})

export default function SupportDeskPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Help Center', url: '/help' },
    { name: 'Support Desk', url: '/support' },
  ]

  return (
    <div className="min-h-screen bg-black text-white selection:bg-studio-yellow selection:text-black">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="container mx-auto px-4 md:px-8 py-16 max-w-5xl space-y-10">
        {/* Back Link */}
        <Link
          href="/help"
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Help Center
        </Link>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-white/5 pb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-studio-blue shadow-[0_0_15px_rgba(0,116,228,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-blue font-mono">
              Support & Diagnostics Desk
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic text-white">
            Producer <span className="text-white/30">Support.</span>
          </h1>

          <p className="text-xs text-white/40 font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
            Need urgent help with your downloads, payments, license verification, or DAW compatibility? Your tickets and live responses are tracked right here in real time.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center gap-3">
              <Zap size={18} className="text-studio-yellow flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Average Turnaround</p>
                <p className="text-xs font-black uppercase text-white">&lt; 4 Hours</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center gap-3">
              <ShieldCheck size={18} className="text-studio-neon flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Vault Guarantee</p>
                <p className="text-xs font-black uppercase text-white">Lifetime Access</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center gap-3">
              <Headphones size={18} className="text-studio-blue flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Audio Engineers</p>
                <p className="text-xs font-black uppercase text-white">Direct Producer Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Audio Clinic & Diagnostics Conveyor Animation Banner */}
        <div className="border-2 border-white/10 rounded-sm shadow-[6px_6px_0px_#0074e4] overflow-hidden relative z-20 bg-zinc-950">
          {/* Tri-color platform stripe */}
          <div className="h-1 bg-[#1e1e24]" />
          <div className="flex h-[3px]">
            <div className="flex-1 bg-studio-neon" />
            <div className="flex-1 bg-studio-blue" />
            <div className="flex-1 bg-studio-yellow" />
          </div>

          <SupportConveyor />
        </div>

        {/* Main Client Support Desk with In-Situ Tickets & Form */}
        <SupportDeskClient />

        {/* Bottom Help & Direct Channels Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-studio-neon">
              <Instagram size={18} />
              <h4 className="text-xs font-black uppercase tracking-widest text-white">Need Urgent Studio Assistance?</h4>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-mono uppercase">
              Send us a direct message on Instagram @sampleswala with your Order ID for rapid priority routing.
            </p>
            <a
              href="https://instagram.com/sampleswala"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-studio-neon hover:underline"
            >
              <span>DM on Instagram</span>
              <span>→</span>
            </a>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-studio-yellow">
              <Mail size={18} />
              <h4 className="text-xs font-black uppercase tracking-widest text-white">Looking for Direct Email?</h4>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-mono uppercase">
              You can also email us directly at support@sampleswala.com. All messages automatically sync with your account.
            </p>
            <a
              href="mailto:support@sampleswala.com"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-studio-yellow hover:underline"
            >
              <span>Email support@sampleswala.com</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
