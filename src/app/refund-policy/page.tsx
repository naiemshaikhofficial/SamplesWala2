import React from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, XCircle, CheckCircle2, MessageSquare, AlertCircle, Scale } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Refund & Cancellation Policy | Samples Wala',
  description: 'Statutory return and refund rules for digital sound downloads under Indian and international consumer protection codes.',
  path: '/refund-policy'
})

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      <div className="container mx-auto px-4 py-20 max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-studio-yellow/10 border-2 border-studio-yellow text-studio-yellow rotate-[-1deg] shadow-[2px_2px_0px_black] w-fit">
              <RefreshCw size={12} className="text-studio-yellow animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow font-mono">Consumer Rights</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Refund & <br /><span className="text-studio-yellow">Returns.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-b-4 border-black pb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Digital Goods Return Policy</p>
              <div className="h-1.5 w-1.5 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Exclusion under E-Commerce Regulations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
            {/* Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FF5C00] bg-zinc-950">
                <AlertCircle className="text-[#FF5C00] mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Important Clause</h3>
                <p className="text-[9px] font-bold text-white/40 uppercase leading-relaxed tracking-widest italic">
                  "Because audio samples and presets are downloadable digital files, they cannot be 'returned' once accessed. Therefore, all digital downloads and pre-orders are strictly non-refundable."
                </p>
              </div>

              <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FFE600] bg-zinc-950">
                <Scale className="text-[#FFE600] mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#FFE600] mb-2 italic">Legal Exemption</h3>
                <p className="text-[9px] font-bold text-white/40 uppercase leading-relaxed tracking-widest">
                  Under global consumer protection directives, digital goods are exempt from standard cooling-off refund periods upon immediate download or pre-order security.
                </p>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-8 space-y-12">
              
              {/* Digital Goods Framework */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Digital Goods Framework</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    All items sold on Samples Wala are premium, high-fidelity digital downloads. When you make a purchase, access to the audio packages is immediately unlocked and credited to your profile. Since the delivery of digital media is instantaneous:
                  </p>
                  <p className="text-[10px] font-bold text-[#FF3131] uppercase tracking-widest leading-relaxed pl-4 border-l-4 border-[#FF3131]">
                    By purchasing our sound libraries or placing pre-orders, you give your explicit consent to immediate contract performance, and you acknowledge that you <span className="underline decoration-[#FF3131] underline-offset-4 decoration-2">entirely forfeit your statutory right of withdrawal, refund, or cancellation</span>.
                  </p>
                </div>
              </section>

              {/* Statutory Exclusions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Statutory Legal Exclusions</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    This policy aligns perfectly with global consumer protection acts and e-commerce rules:
                  </p>

                  <div className="space-y-4 pl-4 border-l-4 border-studio-yellow/20">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white">1. Indian Consumer Protection Act, 2019 (E-Commerce Rules, 2020)</h4>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mt-1">
                        Digital goods, software downloads, and immediate licensing contracts are legally classified as "Non-Returnable Products" due to their digital nature, which cannot be restored to original factory-sealed status once transferred.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide text-white">2. EU Directive on Consumer Rights (2011/83/EU)</h4>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mt-1">
                        Article 16(m) explicitly excludes the supply of digital content from the standard 14-day cool-off return period if the performance has begun with the consumer’s prior express consent and acknowledgment that they lose their right of withdrawal.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Exceptions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Pre-Orders & Allowed Exceptions</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    We want to maintain a highly positive relationship with our music producer community. While all downloads are final, we will issue refunds or credits under these specific circumstances:
                  </p>

                  <ul className="space-y-4">
                    <li className="comic-panel p-4 border-4 border-black shadow-[4px_4px_0px_#00FF94] bg-zinc-950 flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-[#00FF94] mt-1 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">Production Cancellations (Pre-orders Only)</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 leading-relaxed">
                          For pre-order sample packs, all payments are 100% non-refundable and final once placed. However, in the extremely rare event that the specific sound library release is officially cancelled by SamplesWala, a full 100% refund will be issued automatically to your original payment method.
                        </p>
                      </div>
                    </li>
                    <li className="comic-panel p-4 border-4 border-black shadow-[4px_4px_0px_#00FF94] bg-zinc-950 flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-[#00FF94] mt-1 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">Corrupted File Archives</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 leading-relaxed">
                          If a downloaded zip archive is corrupted, sound samples fail to play, or presets do not load in compatible DAWs, contact support. We will deliver a clean replacement link or replace files immediately. If we cannot resolve the technical defect within 5 business days, a full refund will be processed.
                        </p>
                      </div>
                    </li>
                    <li className="comic-panel p-4 border-4 border-black shadow-[4px_4px_0px_#00FF94] bg-zinc-950 flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-[#00FF94] mt-1 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-wide">Accidental Double Payments</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 leading-relaxed">
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
                  <span className="text-xs font-black text-[#FF3131] font-mono border-2 border-[#FF3131] px-2 py-0.5 rounded-sm">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic text-[#FF3131] comic-text">Strictly Disallowed Claims</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    We absolutely cannot issue refunds or credits under the following scenarios:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50 mt-1 flex-shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                        "Subjective Dissatisfaction" (e.g. "I don't like the sounds" or "The loop style didn't fit my project"). Please listen to the high-quality demo previews available for each kit before purchase.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50 mt-1 flex-shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                        "Software Incompatibility" (e.g. purchasing presets for a synthesizer you do not own, or wav files for unsupported samplers). It is your responsibility to read the compatibility requirements.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-white/30">
                      <XCircle size={14} className="text-red-500/50 mt-1 flex-shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                        "Accidental purchases" or "Change of mind" where the file downloads have already been initiated or completed.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Subscriptions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Subscription Cancelation</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    If you hold an active membership subscription with Samples Wala, you may cancel your subscription at any point via your Account Settings dashboard. Upon cancellation:
                  </p>
                  <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FFE600] bg-black/40 text-[9px] font-bold uppercase tracking-widest text-white/40 space-y-2">
                    <p className="text-white">• Your access will remain active until the end of your paid billing month.</p>
                    <p className="text-white">• No partial-month refunds or credit pro-rations are available.</p>
                    <p className="text-white">• Future automatic renewals will be permanently halted.</p>
                  </div>
                </div>
              </section>

              {/* Contact box */}
              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <MessageSquare className="text-studio-yellow animate-pulse" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Have a transaction dispute?</h4>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
                      Do not open instant chargebacks or payment disputes. Reach out to contact@sampleswala.com first, and our support team will resolve it within 24-48 business hours.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Call to action box */}
          <div className="comic-panel p-8 border-4 border-black shadow-[8px_8px_0px_black] bg-[#FF5C00] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left -rotate-1">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Still have questions?</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest italic mt-1">Our billing team is here to assist with integrity.</p>
            </div>
            <Link href="/contact" className="px-10 py-4 bg-black text-white font-black border-4 border-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black shadow-[4px_4px_0px_black] transition-all whitespace-nowrap active:translate-x-1 active:translate-y-1 active:shadow-none">
              Contact Billing Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
