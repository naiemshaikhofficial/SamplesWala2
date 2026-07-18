import React from 'react'
import { Mail, MessageCircle, ShieldQuestion, LifeBuoy } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Help Center | Samples Wala Support',
  description: 'Get support for your music production queries, sample downloads, licensing questions, and account settings at Samples Wala.',
  path: '/help'
})

export default function HelpPage() {
  return (
    <div className="container mx-auto px-8 py-20 min-h-[80vh]">
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
            <a 
              href="mailto:contact@sampleswala.com" 
              className="inline-block text-[11px] font-black text-studio-yellow uppercase tracking-widest hover:underline"
            >
              contact@sampleswala.com
            </a>
          </div>

          {/* Support Inquiry */}
          <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-sm hover:border-studio-neon transition-all">
            <div className="flex items-start justify-between mb-8">
              <LifeBuoy className="text-studio-neon group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Technical Support</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Get Support</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-6">
              Issues with downloads, payments, or account access? Our team is here to help.
            </p>
            <a 
              href="mailto:support@sampleswala.com" 
              className="inline-block text-[11px] font-black text-studio-neon uppercase tracking-widest hover:underline"
            >
              support@sampleswala.com
            </a>
          </div>
        </div>

        {/* FAQ Section Placeholder */}
        <div className="pt-16 border-t border-white/5 space-y-10">
          <div className="flex items-center gap-3">
            <ShieldQuestion className="text-white/20" size={20} />
            <h2 className="text-sm font-black uppercase tracking-widest">Common Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">How do I access my downloads?</h4>
              <p className="text-[10px] font-medium text-white/30 uppercase leading-relaxed">
                After purchase, items are instantly added to your "Library". You can access them anytime by signing in to your account.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Are the samples royalty-free?</h4>
              <p className="text-[10px] font-medium text-white/30 uppercase leading-relaxed">
                Yes, all collections on Samples Wala are 100% royalty-free for both personal and commercial music production.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Can I get a refund?</h4>
              <p className="text-[10px] font-medium text-white/30 uppercase leading-relaxed">
                Due to the digital nature of our products, all sales are final. However, if you face technical issues, contact support.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">DAW Compatibility?</h4>
              <p className="text-[10px] font-medium text-white/30 uppercase leading-relaxed">
                Our WAV samples work in every modern DAW including FL Studio, Ableton Live, Logic Pro, Cubase, and more.
              </p>
            </div>
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
            className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
          >
            Open Instagram
          </a>
        </div>
      </div>
    </div>
  )
}
