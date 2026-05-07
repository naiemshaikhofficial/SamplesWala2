import React from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, XCircle, CheckCircle2, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Refund & Cancellation | Samples Wala',
  description: 'Simple refund and cancellation rules for our digital sound packs.',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-studio-yellow/10 border border-studio-yellow/20">
              <RefreshCw size={12} className="text-studio-yellow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow font-mono">Refund Rules</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">Refund & <br /><span className="text-white/20">Returns.</span></h1>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest pt-4 italic">No complicated words. Just the facts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/5 pt-16">
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-studio-yellow mb-4 italic">Important</h3>
                <p className="text-[10px] font-bold text-white/60 uppercase leading-relaxed tracking-widest italic">
                  "Once you download a digital file, we cannot take it back. This is why we have specific rules for refunds."
                </p>
              </div>
            </div>
            
            <div className="md:col-span-8 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">How it works</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    All our products are digital downloads. This means as soon as you buy, you get the files immediately. Because of this, we generally do not give refunds once the download is finished.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">When we give a refund</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We want you to be happy. We will give a refund if:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-studio-neon mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">File is Broken</p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 italic">If the sounds don't play or the zip file is corrupted and we cannot fix it for you.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-studio-neon mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">Double Payment</p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 italic">If you accidentally paid for the same pack twice.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">No Refunds for</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We cannot give refunds for these reasons:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest italic">"I didn't like the sounds" (Please listen to the demo before buying).</span>
                    </li>
                    <li className="flex items-center gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest italic">"I bought it by mistake" but you already downloaded the files.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Cancellation</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    If you have a subscription, you can cancel it anytime from your account settings. You will still have access until your current month ends.
                  </p>
                </div>
              </section>

              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <MessageSquare className="text-studio-yellow" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic">Got a problem?</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Email support@sampleswala.com. We usually reply within 24-48 hours.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="p-8 border border-white/10 bg-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">Still have questions?</p>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">We are here to help you make better music.</p>
            </div>
            <Link href="/browse" className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-studio-yellow transition-all">
              Go to Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
