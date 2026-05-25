import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Scale, FileText, AlertTriangle, ShieldAlert, Gavel, FileCheck, Lock } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Terms & Conditions & EULA | Samples Wala',
  description: 'Comprehensive legal terms, End-User License Agreement (EULA), and anti-piracy framework under Indian and International law.',
  path: '/terms'
})

export default function TermsPage() {
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
              <Scale size={12} className="text-studio-yellow animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">Legal Agreement</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Terms & <br /><span className="text-studio-yellow">Conditions.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-b-4 border-black pb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Official EULA & Anti-Piracy Framework</p>
              <div className="h-1.5 w-1.5 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Updated: May 2026</p>
              <div className="h-1.5 w-1.5 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-[#FF3131] uppercase tracking-widest animate-pulse">Strict Anti-Piracy Notice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
            {/* Sidebar basics */}
            <div className="md:col-span-4 space-y-6">
              <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FFE600] bg-zinc-950">
                <FileText className="text-[#FFE600] mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">The Foundation</h3>
                <p className="text-[9px] font-bold text-white/40 uppercase leading-relaxed tracking-widest">
                  By accessing Samples Wala, purchasing sound kits, or downloading content, you enter a legally binding contract. If you do not agree to these terms, you are prohibited from using the platform.
                </p>
              </div>

              <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FF3131] bg-red-950/20">
                <ShieldAlert className="text-[#FF3131] mb-4 animate-pulse" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#FF3131] mb-2 italic">Piracy Warning</h3>
                <p className="text-[9px] font-bold text-[#FF3131]/75 uppercase leading-relaxed tracking-widest">
                  Unauthorized sharing, reselling, or cracked distribution of our premium samples will result in severe civil liabilities, criminal prosecution under Indian & international laws, and immediate account forfeiture.
                </p>
              </div>
            </div>
            
            {/* Main content sections */}
            <div className="md:col-span-8 space-y-12">
              
              {/* Section 01: License and EULA */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">End-User License Agreement (EULA)</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    All sound libraries, loops, presets, samples, one-shots, and audio kits purchased or downloaded from Samples Wala are licensed, not sold, to you. Upon a valid purchase, you receive a <strong className="text-white">non-exclusive, non-transferable, worldwide, perpetual royalty-free license</strong> to integrate our sounds into your commercial and non-commercial musical recordings.
                  </p>
                  
                  <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#00FF94] bg-zinc-950 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white italic flex items-center gap-2">
                      <FileCheck size={14} className="text-[#00FF94]" />
                      What You Are Permitted To Do:
                    </h4>
                    <ul className="space-y-3 list-none text-[9px] font-bold uppercase tracking-widest text-white/40">
                      <li className="flex items-start gap-2">
                        <span className="text-[#00FF94]">•</span>
                        <span>Use the sounds in your own musical compositions, songs, beats, and audio-visual projects.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00FF94]">•</span>
                        <span>Release songs containing our samples on digital platforms like Spotify, Apple Music, YouTube, and SoundCloud.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00FF94]">•</span>
                        <span>Sell beat licenses to independent or major artists containing our loops/one-shots.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00FF94]">•</span>
                        <span>Keep 100% of the royalties, publishing rights, and sync fees generated from your new musical compositions.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 02: Anti-Piracy, Stealing & Abuse (Extremely Detailed Legal Section) */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-[#FF3131] font-mono border-2 border-[#FF3131] px-2 py-0.5 rounded-sm">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic text-[#FF3131] comic-text">Strict Restrictions & Piracy Consequences</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    We protect our intellectual property aggressively. Under no circumstances are you permitted to resell, repackage, distribute, or pirate our sound content. The license granted is strictly for a <strong className="text-white">single, individual creator</strong>.
                  </p>

                  <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FF3131] bg-red-950/10 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#FF3131] flex items-center gap-2">
                      <AlertTriangle size={14} className="text-[#FF3131] animate-pulse" />
                      Strictly Prohibited Actions:
                    </h4>
                    <ul className="space-y-3 list-none text-[9px] font-bold uppercase tracking-widest text-[#FF3131]/70">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF3131] font-black">•</span>
                        <span><strong>NO RESELLING OR LEASING:</strong> You cannot resell, lease, sublicense, or distribute raw samples, loops, or presets in their original form or as part of any other sample library.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF3131] font-black">•</span>
                        <span><strong>NO SHARED DRIVES OR P2P:</strong> You are strictly forbidden from uploading our content to Google Drive, Mega, Dropbox, Torrent trackers, or sharing files in Telegram channels, Discord servers, or Facebook groups.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF3131] font-black">•</span>
                        <span><strong>NO DERIVATIVE SOUNDBANKS:</strong> You cannot use our samples to create new soundbanks, sample packs, multi-sample instruments, or loops for commercial sale or public distribution.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF3131] font-black">•</span>
                        <span><strong>NO CREDENTIAL SHARING:</strong> Sharing your account login, allowing others to download from your library, or executing "group buys" is a violation of the EULA and will result in immediate termination.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 italic comic-text">
                      <Gavel size={16} className="text-[#FFE600]" />
                      Applicable Legal Actions and Penalties
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed font-bold uppercase tracking-wider">
                      If you engage in piracy, digital theft, bypass security blocks, or distribute our sample packs without authorization, you will be liable to the fullest extent under the following laws:
                    </p>

                    <div className="space-y-6 pl-4 border-l-4 border-studio-red/40 mt-4">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wide text-white">Under Indian Law:</h4>
                        <ul className="space-y-3 list-none text-[9px] font-bold uppercase tracking-widest text-white/40 mt-2">
                          <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#FFE600] font-mono">1.</span>
                            <span><strong>The Copyright Act, 1957 (Sections 51 & 63):</strong> Copyright infringement of sound recordings is a <strong className="text-white">cognizable and non-bailable criminal offense</strong>. Section 63 prescribes a mandatory minimum imprisonment of <strong className="text-[#FF3131]">6 months, extending up to 3 years</strong>, along with a fine between <strong className="text-[#FF3131]">₹50,000 and ₹2,00,000</strong>.</span>
                          </li>
                          <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#FFE600] font-mono">2.</span>
                            <span><strong>Copyright Act, 1957 (Section 64):</strong> Gives police officers of the rank of Sub-Inspector or above the power to <strong className="text-white">seize all infringing copies, computer systems, and storage devices</strong> without a warrant.</span>
                          </li>
                          <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#FFE600] font-mono">3.</span>
                            <span><strong>Information Technology Act, 2000 (Section 43 & 66):</strong> Hacking, scraping, or downloading paid sample packs using automated scripts or site vulnerabilities carries a penalty of <strong className="text-white">imprisonment up to 3 years</strong> or a **fine up to ₹5,00,000**, as it constitutes unauthorized access to a computer system.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <h4 className="text-xs font-black uppercase tracking-wide text-white">Under International Law:</h4>
                        <ul className="space-y-3 list-none text-[9px] font-bold uppercase tracking-widest text-white/40 mt-2">
                          <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#FFE600] font-mono">1.</span>
                            <span><strong>US Copyright Act (Title 17, US Code):</strong> Section 504 authorizes civil statutory damages of <strong className="text-white">up to $150,000 per sample pack</strong> for willful copyright infringement, in addition to our legal attorney fees. Section 506 and 18 U.S.C. § 2319 outline federal criminal charges for commercial copyright distribution.</span>
                          </li>
                          <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#FFE600] font-mono">2.</span>
                            <span><strong>The Berne Convention:</strong> An international treaty signed by 180+ countries (including India, the USA, UK, Canada, the European Union, and Japan), which ensures that copyright protection is automatically valid and legally enforceable across all member nations globally.</span>
                          </li>
                          <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#FFE600] font-mono">3.</span>
                            <span><strong>DMCA (Section 1201):</strong> Bypassing security firewalls, anti-right-click protection, or digital rights management (DRM) to steal content is illegal under international law.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 03: Account Security, Scraping & Automated Access */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Account Security & Automated Abuse</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    Your user account is restricted to your own personal usage. You are fully responsible for maintaining the confidentiality of your login credentials.
                  </p>
                  <p>
                    <strong>Security Tracking:</strong> To prevent account sharing, bulk automated scraping, or bot-based asset theft, our systems track login patterns, active IP sessions, and user agent signatures. If our system detects multi-location simultaneous logins, bulk downloads in short durations, or script usage:
                  </p>
                  <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FF3131] bg-black/40 space-y-3 text-[9px] font-bold uppercase tracking-widest text-white/40">
                    <p className="text-white font-black"><strong className="text-[#FF3131]">•</strong> Your account will be immediately and permanently locked.</p>
                    <p className="text-white font-black"><strong className="text-[#FF3131]">•</strong> All downloaded licenses will be revoked instantly.</p>
                    <p className="text-white font-black"><strong className="text-[#FF3131]">•</strong> No refunds or credits will be provided under any circumstances.</p>
                    <p className="text-[#FF3131] animate-pulse font-black"><strong className="text-[#FF3131]">•</strong> We will submit your IP addresses, transaction history, and registration logs to the relevant Cyber Crime Department for investigation.</p>
                  </div>
                </div>
              </section>

              {/* Section 04: Secure Payments & Razorpay */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Billing & Transactions</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    All credit, debit, net-banking, and UPI transactions on Samples Wala are securely processed via <strong>Razorpay</strong> and international payment gateways (such as PayPal).
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                    <Lock className="text-studio-yellow flex-shrink-0" size={18} />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                      We do not capture, record, or store any sensitive payment card details or credentials on our servers. All financial data transfers occur on encrypted PCI-DSS compliant networks.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 05: Intellectual Property Ownership */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Intellectual Property Ownership</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    The Samples Wala brand, domain, logo, website design, UI artwork, marketing media, code assets, and raw sound recordings are the exclusive intellectual property of Samples Wala. No copyright, ownership, or brand representation rights are transferred to you at any point; you are solely granted a limited-use audio production license in accordance with our EULA.
                  </p>
                </div>
              </section>

              {/* Section 06: Indemnification */}
              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="text-studio-neon animate-pulse" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Royalty-Free Guarantee</h4>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      We guarantee that all our sound packs are 100% original and legally cleared. You will never face copyright royalty claims from our end.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Contact action box */}
          <div className="comic-panel p-12 text-black text-center space-y-4 border-4 border-black shadow-[10px_10px_0px_black] bg-[#FFE600] -rotate-1">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter comic-text">Have any legal questions?</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 max-w-lg mx-auto leading-relaxed">
              If you require a custom corporate license, need clarification on the EULA, or want to report an active piracy case, please reach out to our legal department.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="px-8 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black border-4 border-black transition-all inline-block shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                Contact Legal Dept
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
