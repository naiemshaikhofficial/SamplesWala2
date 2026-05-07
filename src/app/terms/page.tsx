import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Scale, FileText, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions | Samples Wala',
  description: 'Simple and easy to understand terms for using Samples Wala sounds.',
}

export default function TermsPage() {
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
              <Scale size={12} className="text-studio-yellow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow font-mono">Our Rules</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">Terms & <br /><span className="text-white/20">Conditions.</span></h1>
            <div className="flex items-center gap-6 pt-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Easy to Read Version</p>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Updated: May 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/5 pt-16">
            <div className="md:col-span-4 space-y-4 text-left">
              <h3 className="text-xs font-black uppercase tracking-widest text-studio-yellow italic">The Basics</h3>
              <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest">
                By using Samples Wala, you agree to these rules. All original sound designs and branding are owned by Samples Wala.
              </p>
            </div>
            
            <div className="md:col-span-8 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Using Our Sounds</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    When you buy a pack, you get a "Non-exclusive, Non-transferable License." This means you can use the sounds in your songs forever without paying us again. 
                  </p>
                  <ul className="space-y-2 list-none text-[11px] font-bold uppercase tracking-widest text-white/40">
                    <li>• You can release your songs on Spotify, YouTube, etc.</li>
                    <li>• You can use them in Beats you sell to artists.</li>
                    <li>• You keep 100% of your royalties.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">What is Not Allowed</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We work hard on these sounds. To protect our work, there are a few things you cannot do:
                  </p>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <p className="text-xs font-bold text-white/80 uppercase tracking-wide leading-relaxed">
                        You cannot re-sell the raw sounds or give them to friends for free.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <p className="text-xs font-bold text-white/80 uppercase tracking-wide leading-relaxed">
                        You cannot upload our sounds to other websites as your own "Sample Pack."
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                      <p className="text-xs font-bold text-white/80 uppercase tracking-wide leading-relaxed">
                        You cannot sell your account or give it to someone else. Each account is for one person only.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Your Account</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Your account is for your personal use only. You are not allowed to share your login details, sell your account, or give it to someone else. If we find that many people are using the same account, we may block it to protect our sounds.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Payments</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    All payments are securely processed via **Razorpay**. We do not store your credit card or sensitive payment details on our servers.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    All content on this website, including sound samples, graphics, and text, is the property of Samples Wala and protected by copyright laws.
                  </p>
                </div>
              </section>

              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="text-studio-neon" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic">Simple Agreement</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">By buying our sounds, you agree to these simple terms.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="bg-studio-yellow p-12 text-black text-center space-y-4 rounded-sm">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Need help?</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 max-w-md mx-auto">
              If you don't understand something, just send us an email. We are here to help.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="px-8 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform inline-block">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
