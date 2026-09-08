import React from 'react'
import Link from 'next/link'
import { Mail, ShieldQuestion, LifeBuoy, Ticket, ArrowRight, ExternalLink } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { FaqJsonLd } from '@/components/JsonLd'

export const metadata = generatePageMetadata({
  title: 'Help Center | Samples Wala Support & Ticket Desk',
  description: 'Get support for your music production queries, sample downloads, licensing questions, and account settings at Samples Wala.',
  path: '/help'
})

const HELP_FAQS = [
  {
    question: 'How do I access my downloads after purchase?',
    answer: 'After purchase, items are instantly added to your "Library". You can access them anytime by signing in to your account.'
  },
  {
    question: 'Are the samples royalty-free?',
    answer: 'Yes, all collections on Samples Wala are 100% royalty-free for both personal and commercial music production.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'Due to the digital nature of our products, all sales are final. However, if you face technical issues or corrupted files, contact our support team.'
  },
  {
    question: 'Are the WAV files compatible with all DAWs?',
    answer: 'Our 24-bit WAV samples work seamlessly in every modern DAW including FL Studio, Ableton Live, Logic Pro, Cubase, Studio One, and Reaper.'
  }
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-6 md:px-8 py-20 min-h-[80vh]">
      <FaqJsonLd faqs={HELP_FAQS} />

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-studio-yellow shadow-[0_0_15px_rgba(255,200,0,0.5)]" />
            <h1 className="text-4xl font-black uppercase tracking-tighter">Help Center</h1>
          </div>
          <p className="text-white/40 font-bold uppercase text-xs tracking-widest">
            Support & Resources for the modern producer
          </p>
        </div>

        {/* Featured Support Ticket Desk Banner */}
        <div className="p-8 md:p-10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-studio-blue/40 rounded-sm relative overflow-hidden shadow-[0_0_30px_rgba(0,116,228,0.15)]">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-studio-blue pointer-events-none">
            <Ticket size={160} />
          </div>
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio-blue/15 border border-studio-blue/30 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-studio-blue animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-studio-blue font-mono">
                Official Support Desk
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Have an issue with downloads, payments, or audio files?
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-bold uppercase tracking-wider">
              Open a tracked support ticket directly. Receive a unique ticket code (SW-TK-XXXXX) to track resolution progress live.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/support"
                className="studio-button inline-flex items-center gap-2 text-xs"
              >
                <span>Open Support Ticket</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/support?tab=track"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-sm border border-white/10 transition-colors inline-flex items-center gap-2"
              >
                <span>Track Existing Ticket</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General Contact */}
          <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-sm hover:border-studio-yellow transition-all">
            <div className="flex items-start justify-between mb-8">
              <Mail className="text-studio-yellow group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">General Inquiry</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Contact Us</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-6">
              For business inquiries, partnerships, or general questions about Samples Wala.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-1.5 text-[11px] font-black text-studio-yellow uppercase tracking-widest hover:underline"
            >
              <span>Visit Contact Page</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Direct Support Email */}
          <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-sm hover:border-studio-neon transition-all">
            <div className="flex items-start justify-between mb-8">
              <LifeBuoy className="text-studio-neon group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Email Support</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Email Desk</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-6">
              Prefer direct email? Send your transaction ID or question to our support inbox.
            </p>
            <a 
              href="mailto:support@sampleswala.com" 
              className="inline-block text-[11px] font-black text-studio-neon uppercase tracking-widest hover:underline"
            >
              support@sampleswala.com
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-16 border-t border-white/5 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldQuestion className="text-white/20" size={20} />
              <h2 className="text-sm font-black uppercase tracking-widest">Common Questions</h2>
            </div>
            <Link
              href="/faq"
              className="text-[10px] font-black uppercase tracking-widest text-studio-yellow hover:underline"
            >
              View All FAQs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {HELP_FAQS.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70">{faq.question}</h4>
                <p className="text-[10px] font-medium text-white/40 uppercase leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-10 bg-studio-yellow text-black rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-black uppercase tracking-tighter text-2xl leading-none">Need faster help?</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Reach out to us on Instagram DMs</p>
          </div>
          <a 
            href="https://instagram.com/sampleswala" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
          >
            Open Instagram
          </a>
        </div>
      </div>
    </div>
  )
}
