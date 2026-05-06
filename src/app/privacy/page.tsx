import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Sampleswala',
  description: 'How Sampleswala handles and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-12">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="space-y-12">
        <div className="space-y-4 border-b border-white/5 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Privacy Policy</h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Effective Date: May 2026</p>
        </div>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-studio-neon italic">1. Data Collection</h2>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            We collect only essential information required to provide our services: your name, email address for account access and delivery, and payment information processed securely via Razorpay.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-studio-yellow italic">2. Use of Data</h2>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            Your email is used to send download links, receipts, and optional product updates. We do not sell your personal data to third parties. Your data is used exclusively to manage your sound library vault.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-studio-neon italic">3. Security</h2>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            We use industry-standard encryption and secure infrastructure (Supabase & Cloudflare) to protect your account. All payments are handled by Razorpay; we never store your credit card or banking details on our servers.
          </p>
        </section>

        <section className="space-y-6 pt-8 border-t border-white/5">
           <p className="text-[10px] text-white/20 font-bold uppercase text-center tracking-[0.3em]">
             SAMPLESWALA :: DATA_INTEGRITY_ASSURED
           </p>
        </section>
      </div>
    </div>
  )
}
