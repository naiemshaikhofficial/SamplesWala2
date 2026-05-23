import React from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, XCircle, CheckCircle2, MessageSquare, AlertCircle, FileText, Scale } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Refund & Cancellation Policy | Samples Wala',
  description: 'Statutory return and refund rules for digital sound downloads under Indian and international consumer protection codes.',
  path: '/refund-policy'
})

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-studio-yellow/10 border border-studio-yellow/20">
              <RefreshCw size={12} className="text-studio-yellow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow font-mono">Consumer Rights</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              Refund & <br /><span className="text-white/20">Returns.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-b border-white/5 pb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Digital Goods Return Policy</p>
              <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Exclusion under E-Commerce Regulations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
            {/* Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                <AlertCircle className="text-studio-yellow mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Important Clause</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed tracking-widest italic">
                  "Because audio samples and presets are downloadable digital files, they cannot be 'returned' once accessed. Therefore, all digital downloads are strictly non-refundable."
                </p>
              </div>

              <div className="p-6 bg-studio-yellow/5 border border-studio-yellow/10 rounded-sm">
                <Scale className="text-studio-yellow mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-studio-yellow mb-2 italic">Legal Exemption</h3>
                <p className="text-[10px] font-bold text-studio-yellow/70 uppercase leading-relaxed tracking-widest">
                  Under global consumer protection directives, digital goods are exempt from standard cooling-off refund periods upon immediate download.
                </p>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-8 space-y-12">
              
              {/* How it works */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Digital Goods Framework</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    All items sold on Samples Wala are premium, high-fidelity digital downloads. When you make a purchase, access to the audio packages is immediately unlocked and credited to your profile. Since the delivery of digital media is instantaneous:
                  </p>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    By purchasing our sound libraries, you give your explicit consent to immediate contract performance, and you acknowledge that you **entirely forfeit your statutory right of withdrawal, refund, or cancellation**.
                  </p>
                </div>
              </section>

              {/* Statutory Exclusions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Statutory Legal Exclusions</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    This policy aligns perfectly with global consumer protection acts and e-commerce rules:
                  </p>

                  <div className="space-y-4 pl-4 border-l-2 border-studio-yellow/20">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white">1. Indian Consumer Protection Act, 2019 (E-Commerce Rules, 2020)</h4>
                      <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mt-1">
                        Digital goods, software downloads, and immediate licensing contracts are legally classified as "Non-Returnable Products" due to their digital nature, which cannot be restored to original factory-sealed status once transferred.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white">2. EU Directive on Consumer Rights (2011/83/EU)</h4>
                      <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mt-1">
                        Article 16(m) explicitly excludes the supply of digital content from the standard 14-day cool-off return period if the performance has begun with the consumer’s prior express consent and acknowledgment that they lose their right of withdrawal.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Exceptions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Allowed Exceptions (Refund Eligibility)</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We want to maintain a highly positive relationship with our music producer community. While all downloads are final, we will issue refunds or credits under these specific circumstances:
                  </p>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-studio-neon mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">Corrupted File Archives</p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 leading-relaxed">
                          If a downloaded zip archive is corrupted, sound samples fail to play, or presets do not load in compatible DAWs, contact support. We will deliver a clean replacement link or replace files immediately. If we cannot resolve the technical defect within 5 business days, a full refund will be processed.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-studio-neon mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">Accidental Double Payments</p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 leading-relaxed">
                          If you are billed twice for the same package in a single session due to a gateway lag or checkout loop, we will issue a full refund for the duplicate transaction, provided you report the issue within 14 days of purchase.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Prohibited refund requests */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Strictly Disallowed Claims</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We absolutely cannot issue refunds or credits under the following scenarios:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50 mt-1 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        "Subjective Dissatisfaction" (e.g. "I don't like the sounds" or "The loop style didn't fit my project"). Please listen to the high-quality demo previews available for each kit before purchase.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50 mt-1 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        "Software Incompatibility" (e.g. purchasing presets for a synthesizer you do not own, or wav files for unsupported samplers). It is your responsibility to read the compatibility requirements.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50 mt-1 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        "Accidental purchases" where the user has already downloaded the files from their portal library.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Subscriptions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Subscription Cancelation</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    If you hold an active membership subscription with Samples Wala, you may cancel your subscription at any point via your Account Settings dashboard. Upon cancellation:
                  </p>
                  <div className="p-4 bg-white/5 rounded-sm border border-white/5 text-[11px] font-bold uppercase tracking-widest text-white/40 space-y-2">
                    <p>• Your access will remain active until the end of your paid billing month.</p>
                    <p>• No partial-month refunds or credit pro-rations are available.</p>
                    <p>• Future automatic renewals will be permanently halted.</p>
                  </div>
                </div>
              </section>

              {/* Contact box */}
              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <MessageSquare className="text-studio-yellow" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Have a transaction dispute?</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">
                      Do not open instant chargebacks or payment disputes. Reach out to billing@sampleswala.com first, and our support team will resolve it within 24-48 business hours.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Call to action box */}
          <div className="p-8 border border-white/10 bg-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">Still have questions?</p>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic mt-1">Our billing team is here to assist with integrity.</p>
            </div>
            <Link href="/contact" className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-studio-yellow transition-all whitespace-nowrap">
              Contact Billing Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
