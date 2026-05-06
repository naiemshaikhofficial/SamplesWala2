import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Sampleswala',
  description: 'Legal terms and conditions for using Sampleswala sounds and platform.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-12">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="space-y-12">
        <div className="space-y-4 border-b border-white/5 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Terms of Service</h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Last Updated: May 2026</p>
        </div>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-studio-yellow italic">1. License Grant</h2>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            Upon purchase, Sampleswala grants you a non-exclusive, perpetual, worldwide license to use the sounds in your musical productions. This includes commercial releases, film scores, and live performances.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-studio-neon italic">2. Restrictions</h2>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            You may not re-sell, lease, sublicense, or distribute the individual sounds or packs in their raw format or as part of a competitive sample library or sound bank. The sounds must be incorporated into a larger work of music.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-studio-yellow italic">3. Refunds</h2>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            Due to the digital nature of our products, all sales are final. Refunds are only issued in exceptional cases where a technical defect prevents the product from being used, and our support team is unable to resolve the issue.
          </p>
        </section>

        <section className="space-y-6 pt-8 border-t border-white/5">
           <p className="text-[10px] text-white/20 font-bold uppercase text-center tracking-[0.3em]">
             SAMPLESWALA :: SOUNDS_WITHOUT_LIMITS
           </p>
        </section>
      </div>
    </div>
  )
}
