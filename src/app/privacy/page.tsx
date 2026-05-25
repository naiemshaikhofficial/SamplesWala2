import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, EyeOff, Globe, Eye, FileSpreadsheet, ShieldAlert } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Privacy Policy | Samples Wala',
  description: 'Easy to understand privacy policy, compliant with the Indian DPDP Act 2023, GDPR, CCPA, and global data protection laws.',
  path: '/privacy'
})

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-studio-neon/10 border-2 border-studio-neon text-studio-neon rotate-[-1deg] shadow-[2px_2px_0px_black] w-fit">
              <Shield size={12} className="text-studio-neon animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-neon font-mono">Data Sovereignty</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Privacy <br /><span className="text-studio-neon">Policy.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-b-4 border-black pb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Global Data Standards & Compliance</p>
              <div className="h-1.5 w-1.5 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compliant with DPDPA 2023, GDPR & CCPA</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
            {/* Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#00FF94] bg-zinc-950">
                <Lock className="text-[#00FF94] mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Our Commitment</h3>
                <p className="text-[9px] font-bold text-white/30 uppercase leading-relaxed tracking-widest">
                  Your privacy is absolute. We do not sell your personal data, nor do we share it with advertising networks. We only process data required to manage your sound pack licenses and protect our platform.
                </p>
              </div>

              <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FF3131] bg-red-950/20">
                <ShieldAlert className="text-[#FF3131] mb-4 animate-pulse" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#FF3131] mb-2 italic">Anti-Piracy Audit</h3>
                <p className="text-[9px] font-bold text-[#FF3131]/75 uppercase leading-relaxed tracking-widest">
                  We process telemetry, IP logs, and browser finger-prints specifically to protect intellectual property rights and detect unauthorized license sharing.
                </p>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-8 space-y-12">
              
              {/* Section 01: What We Collect & Process */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Information We Collect & Why</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    Under the <strong>Digital Personal Data Protection (DPDP) Act, 2023 (India)</strong> and the <strong>GDPR (Europe)</strong>, we are a "Data Fiduciary" or "Data Controller." We only collect personal information that is absolutely necessary for providing services:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div className="comic-panel p-4 border-4 border-black shadow-[4px_4px_0px_#00FF94] bg-zinc-950 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-1.5">
                        <Eye size={12} className="text-[#00FF94]" />
                        Account & Licensing
                      </p>
                      <p className="text-[9px] font-bold text-white/30 uppercase leading-relaxed">
                        Your Name, Email Address, and account passwords to secure your license codes, manage sound library downloads, and verify digital sound EULAs.
                      </p>
                    </div>
                    <div className="comic-panel p-4 border-4 border-black shadow-[4px_4px_0px_#00FF94] bg-zinc-950 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-1.5">
                        <FileSpreadsheet size={12} className="text-[#00FF94]" />
                        Billing Details
                      </p>
                      <p className="text-[9px] font-bold text-white/30 uppercase leading-relaxed">
                        Transaction details, billing address, and phone numbers. Note: All card processing is fully outsourced to secure third parties (Razorpay & PayPal). We do not store card raw data.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 02: Explicit Anti-Piracy and Licensing Tracking */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-[#FF3131] font-mono border-2 border-[#FF3131] px-2 py-0.5 rounded-sm">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic text-[#FF3131] comic-text">Licensing Auditing & Anti-Piracy Tracking</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    To protect the copyrighted sound libraries hosted on our platform, verify compliance with our EULA, and prevent commercial reselling or group buys, Samples Wala operates advanced background anti-piracy telemetry.
                  </p>
                  <p>
                    <strong>What we log for licensing and security checks:</strong>
                  </p>
                  <ul className="space-y-3 list-none text-[9px] font-bold uppercase tracking-widest text-[#FF3131]/75 border-l-4 border-[#FF3131] pl-4">
                    <li className="flex items-start gap-2">
                      <span>• The IP addresses used to log in and download packages.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>• The web browser agent, system details, and hardware/device fingerprints.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>• The frequency of downloads, size of data pulled, and simultaneous connection origins.</span>
                    </li>
                  </ul>
                  <p className="text-[10px] font-bold text-[#FF3131] uppercase tracking-widest leading-relaxed">
                    Legal Basis: This processing is necessary for the performance of our contract (EULA Verification) and for protecting our legitimate business rights against copyright infringement under global IP laws.
                  </p>
                </div>
              </section>

              {/* Section 03: Secure Razorpay & PayPal Transactions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Outsourced Secure Payment Processing</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    All online payments are integrated using industry-leading, PCI-DSS compliant third-party payment gateways:
                  </p>
                  <ul className="space-y-2 list-none text-[9px] font-bold uppercase tracking-widest text-white/40 pl-2">
                    <li className="flex items-center gap-2">
                      <span className="text-studio-yellow font-black">1.</span>
                      <span><strong>Razorpay:</strong> Handles secure transactions via UPI, Indian Netbanking, and Credit/Debit Cards.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-studio-yellow font-black">2.</span>
                      <span><strong>PayPal:</strong> Processes secure international credit cards and digital wallets.</span>
                    </li>
                  </ul>
                  <p>
                    These payment processors act as independent data controllers. Samples Wala <strong>never stores</strong>, intercepts, or retains card CVVs, PINs, or secondary multi-factor authentication tokens.
                  </p>
                </div>
              </section>

              {/* Section 04: Your Legal Privacy Rights */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">Your Data Rights (GDPR & Indian DPDP Act)</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    Regardless of your geographic location, we respect your right to control your digital identity. Under global privacy codes (including DPDPA 2023, GDPR, and CCPA), you hold the following rights:
                  </p>
                  <div className="comic-panel p-6 border-4 border-black shadow-[6px_6px_0px_#FFE600] bg-zinc-950 space-y-4 text-[9px] font-bold uppercase tracking-widest text-white/40">
                    <p className="text-white"><strong className="text-[#FFE600] font-black">Right to Access:</strong> Request a complete copy of all personal records we store associated with your profile.</p>
                    <p className="text-white"><strong className="text-[#FFE600] font-black">Right to Rectification:</strong> Request correction of inaccurate profile data, emails, or name details.</p>
                    <p className="text-white"><strong className="text-[#FFE600] font-black">Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your account files.</p>
                    <p className="text-white"><strong className="text-[#FFE600] font-black">Right to Withdraw Consent:</strong> Revoke previously granted permissions for marketing emails.</p>
                  </div>
                  <p className="text-[9px] font-bold text-[#FF3131] uppercase tracking-widest leading-relaxed pt-2 border-t border-white/5 animate-pulse">
                    CRITICAL WARNING: If you invoke your "Right to Erasure" and request deletion of your account records, all license codes, transaction history, and sound library download access links will be instantly destroyed. This action is irreversible, and we cannot recover licenses for you in the future.
                  </p>
                </div>
              </section>

              {/* Section 05: WIPO & International Data Transfers */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono border-2 border-studio-yellow px-2 py-0.5 rounded-sm">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic comic-text">International Data Transfers</h2>
                </div>
                <div className="space-y-4 text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  <p>
                    Since Samples Wala distributes high-fidelity sound libraries worldwide, your data may be securely transferred, stored, and processed in cloud data centers located outside your home state/country (such as AWS servers or global content delivery networks). We implement standard contractual clauses (SCCs) to ensure that your data is stored under robust cryptographic encryption and security baselines.
                  </p>
                </div>
              </section>

              {/* Global Standards Seal */}
              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <Globe className="text-[#00FF94] animate-pulse" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Privacy Sovereignty Verified</h4>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      We protect your personal space so you can focus entirely on making modern music.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Contact Box */}
          <div className="comic-panel p-8 border-4 border-black shadow-[8px_8px_0px_black] bg-[#00FF94] text-black flex flex-col md:flex-row items-center justify-between gap-6 -rotate-1">
            <div className="flex items-center gap-4 text-left">
              <div className="h-12 w-12 bg-black border-2 border-black flex items-center justify-center rounded-sm flex-shrink-0">
                <EyeOff size={20} className="text-[#00FF94]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Zero Ad Tracking</p>
                <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">We don't use cookies to feed advertising networks.</p>
              </div>
            </div>
            <Link href="/contact" className="px-8 py-4 bg-black text-white font-black border-4 border-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black shadow-[4px_4px_0px_black] transition-all whitespace-nowrap active:translate-x-1 active:translate-y-1 active:shadow-none">
              Contact Privacy Officer
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
