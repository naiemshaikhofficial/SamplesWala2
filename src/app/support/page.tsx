import React from 'react'
import { LifeBuoy, ShieldCheck, Zap, Headphones, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { SupportDeskClient } from '@/components/support/SupportDeskClient'

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

      <div className="container mx-auto px-4 md:px-8 py-16 max-w-5xl space-y-12">
        {/* Back Link */}
        <Link
          href="/help"
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Help Center
        </Link>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-white/5 pb-10">
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
            Need urgent help with your downloads, payments, license verification, or DAW compatibility? Submit a ticket below or track an existing request in real time.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
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

        {/* Main Client Support Desk */}
        <SupportDeskClient />

        {/* Bottom Help Note */}
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Looking for quick answers?</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">
              Check our Frequently Asked Questions for instant licensing and download answers.
            </p>
          </div>
          <Link
            href="/faq"
            className="px-6 py-3 bg-white/10 hover:bg-studio-yellow hover:text-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all whitespace-nowrap"
          >
            Visit FAQ Page
          </Link>
        </div>
      </div>
    </div>
  )
}
