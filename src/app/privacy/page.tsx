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
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-studio-neon/10 border border-studio-neon/20">
              <Shield size={12} className="text-studio-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-neon font-mono">Data Sovereignty</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              Privacy <br /><span className="text-white/20">Policy.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-b border-white/5 pb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Global Data Standards & Compliance</p>
              <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compliant with DPDPA 2023, GDPR & CCPA</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
            {/* Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                <Lock className="text-studio-neon mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Our Commitment</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest">
                  Your privacy is absolute. We do not sell your personal data, nor do we share it with advertising networks. We only process data required to manage your sound pack licenses and protect our platform.
                </p>
              </div>

              <div className="p-6 bg-studio-neon/5 border border-studio-neon/10 rounded-sm">
                <ShieldAlert className="text-studio-neon mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-studio-neon mb-2 italic">Anti-Piracy Audit</h3>
                <p className="text-[10px] font-bold text-studio-neon/70 uppercase leading-relaxed tracking-widest">
                  We process telemetry, IP logs, and browser finger-prints specifically to protect intellectual property rights and detect unauthorized license sharing.
                </p>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-8 space-y-12">
              
              {/* Section 01: What We Collect & Process */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Information We Collect & Why</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Under the <strong>Digital Personal Data Protection (DPDP) Act, 2023 (India)</strong> and the <strong>GDPR (Europe)</strong>, we are a "Data Fiduciary" or "Data Controller." We only collect personal information that is absolutely necessary for providing services:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-1.5">
                        <Eye size={12} className="text-studio-neon" />
                        Account & Licensing
                      </p>
                      <p className="text-[10px] font-bold text-white/30 uppercase leading-tight leading-relaxed">
                        Your Name, Email Address, and account passwords to secure your license codes, manage sound library downloads, and verify digital sound EULAs.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-1.5">
                        <FileSpreadsheet size={12} className="text-studio-neon" />
                        Billing Details
                      </p>
                      <p className="text-[10px] font-bold text-white/30 uppercase leading-tight leading-relaxed">
                        Transaction details, billing address, and phone numbers. Note: All card processing is fully outsourced to secure third parties (Razorpay & PayPal). We do not store card raw data.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 02: Explicit Anti-Piracy and Licensing Tracking */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic text-studio-neon">Licensing Auditing & Anti-Piracy Tracking</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    To protect the copyrighted sound libraries hosted on our platform, verify compliance with our EULA, and prevent commercial reselling or group buys, Samples Wala operates advanced background anti-piracy telemetry.
                  </p>
                  <p>
                    <strong>What we log for licensing and security checks:</strong>
                  </p>
                  <ul className="space-y-3 list-none text-[11px] font-bold uppercase tracking-widest text-white/40 border-l border-studio-neon/20 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-studio-neon">•</span>
                      <span>The IP addresses used to log in and download packages.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-studio-neon">•</span>
                      <span>The web browser agent, system details, and hardware/device fingerprints.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-studio-neon">•</span>
                      <span>The frequency of downloads, size of data pulled, and simultaneous connection origins.</span>
                    </li>
                  </ul>
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
                    Legal Basis: This processing is necessary for the performance of our contract (EULA Verification) and for protecting our legitimate business rights against copyright infringement under global IP laws.
                  </p>
                </div>
              </section>

              {/* Section 03: Secure Razorpay & PayPal Transactions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Outsourced Secure Payment Processing</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    All online payments are integrated using industry-leading, PCI-DSS compliant third-party payment gateways:
                  </p>
                  <ul className="space-y-2 list-none text-[11px] font-bold uppercase tracking-widest text-white/40 pl-2">
                    <li className="flex items-center gap-2">
                      <span className="text-studio-neon font-black">1.</span>
                      <span><strong>Razorpay:</strong> Handles secure transactions via UPI, Indian Netbanking, and Credit/Debit Cards.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-studio-neon font-black">2.</span>
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
                  <span className="text-xs font-black text-studio-neon font-mono">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Your Data Rights (GDPR & Indian DPDP Act)</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Regardless of your geographic location, we respect your right to control your digital identity. Under global privacy codes (including DPDPA 2023, GDPR, and CCPA), you hold the following rights:
                  </p>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/40">
                    <p className="text-white"><strong className="text-studio-neon">Right to Access:</strong> Request a complete copy of all personal records we store associated with your profile.</p>
                    <p className="text-white"><strong className="text-studio-neon">Right to Rectification:</strong> Request correction of inaccurate profile data, emails, or name details.</p>
                    <p className="text-white"><strong className="text-studio-neon">Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your account files.</p>
                    <p className="text-white"><strong className="text-studio-neon">Right to Withdraw Consent:</strong> Revoke previously granted permissions for marketing emails.</p>
                  </div>
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                    CRITICAL WARNING: If you invoke your "Right to Erasure" and request deletion of your account records, all license codes, transaction history, and sound library download access links will be instantly destroyed. This action is irreversible, and we cannot recover licenses for you in the future.
                  </p>
                </div>
              </section>

              {/* Section 05: WIPO & International Data Transfers */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">International Data Transfers</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Since Samples Wala distributes high-fidelity sound libraries worldwide, your data may be securely transferred, stored, and processed in cloud data centers located outside your home state/country (such as AWS servers or global content delivery networks). We implement standard contractual clauses (SCCs) to ensure that your data is stored under robust cryptographic encryption and security baselines.
                  </p>
                </div>
              </section>

              {/* Global Standards Seal */}
              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <Globe className="text-studio-neon" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Privacy Sovereignty Verified</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      We protect your personal space so you can focus entirely on making modern music.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Contact Box */}
          <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="h-12 w-12 bg-white/5 flex items-center justify-center rounded-full flex-shrink-0">
                <EyeOff size={20} className="text-white/40" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Zero Ad Tracking</p>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">We don't use cookies to feed advertising networks.</p>
              </div>
            </div>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-studio-neon hover:underline whitespace-nowrap">
              Contact Privacy Officer
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
