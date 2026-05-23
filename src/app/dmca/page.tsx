import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert, FileText, Mail, Gavel, Scale, Globe, CheckSquare } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'DMCA & Copyright Policy | Samples Wala',
  description: 'Digital Millennium Copyright Act compliance, WIPO treaties, and Indian Copyright Rules 2013 Rule 75 notice and take-down policies.',
  path: '/dmca'
})

export default function DMCAPage() {
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
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <ShieldAlert size={12} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">Intellectual Property</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              DMCA & <br /><span className="text-white/20">Copyright.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4 border-b border-white/5 pb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Digital Rights & Take-Down Policy</p>
              <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compliant with US Title 17 & Indian Rule 75</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-4">
            {/* Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-sm">
                <Gavel className="text-red-500 mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Legal Enforcement</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest italic">
                  Samples Wala respects creative ownership. If you believe your copyrighted audio, loops, or graphics are being redistributed without authorization on our platform, submit a formal take-down notice immediately.
                </p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                <Globe className="text-studio-yellow mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Global Compliance</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest">
                  Our copyright processes adhere strictly to global treaties, including the World Intellectual Property Organization (WIPO) and the Berne Convention.
                </p>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-8 space-y-12">
              
              {/* Compliance standards */}
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic">Copyright Protection Standards</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Samples Wala respects the intellectual property rights of creators and expects its users to do the same. In compliance with international laws, we respond rapidly to valid claims of copyright infringement:
                  </p>
                  <ul className="space-y-3 list-none text-[11px] font-bold uppercase tracking-widest text-white/40 border-l border-white/10 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-studio-yellow">•</span>
                      <span><strong>United States Code Title 17, Section 512:</strong> Complies with DMCA notice-and-takedown guidelines.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-studio-yellow">•</span>
                      <span><strong>Indian Copyright Rules, 2013 (Rule 75):</strong> Complies with statutory requirements for Indian notice of infringement.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-studio-yellow">•</span>
                      <span><strong>WIPO Treaties:</strong> Complies with the WIPO Performances and Phonograms Treaty (WPPT) for digital sound recordings.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Reporting Process */}
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic text-studio-yellow">Submitting a Take-Down Notice</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    If you are a copyright owner or an authorized agent and believe that content hosted on our platform infringes your copyrights, you may submit a formal written notice to our designated Copyright Agent. 
                  </p>
                  <p>
                    To be legally valid, your notification must contain the following information:
                  </p>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white italic flex items-center gap-2">
                      <CheckSquare size={14} className="text-studio-yellow" />
                      Required elements in a formal notice:
                    </h4>
                    <ol className="space-y-3 list-none text-[11px] font-bold uppercase tracking-widest text-white/40 pl-2">
                      <li className="flex items-start gap-2">
                        <span className="text-studio-yellow font-mono">1.</span>
                        <span>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-studio-yellow font-mono">2.</span>
                        <span>Identification of the copyrighted work claimed to have been infringed (e.g. your original sound wave, loop link, or registrations).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-studio-yellow font-mono">3.</span>
                        <span>Identification of the material on Samples Wala that is claimed to be infringing, along with specific URLs so we can locate the exact files.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-studio-yellow font-mono">4.</span>
                        <span>Your contact information, including your legal name, physical address, telephone number, and email address.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-studio-yellow font-mono">5.</span>
                        <span>A statement that you have a "good faith belief" that the disputed use of the material is not authorized by the copyright owner, its agent, or the law.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-studio-yellow font-mono">6.</span>
                        <span>A statement under penalty of perjury (or as per Section 63/Copyright Rules under Indian Law) that the information in the notice is highly accurate, and that you are the copyright owner or authorized to act.</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Rule 75 Statutory details */}
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic">Rule 75 Information (For Indian Claims)</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Under <strong>Rule 75 of the Indian Copyright Rules, 2013</strong>, upon receipt of a valid written notice of infringement, Samples Wala will disable access to the alleged infringing material within 36 hours. 
                  </p>
                  <p>
                    As mandated by Indian law:
                  </p>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-sm text-[11px] font-bold uppercase tracking-widest text-white/40 space-y-2">
                    <p>• The access will be disabled for a statutory period of **twenty-one (21) days**.</p>
                    <p>• To keep the access disabled permanently, the claimant must produce an order from a competent Indian Court within those 21 days.</p>
                    <p>• If no court order is received within 21 days, we are legally required to restore access to the content.</p>
                  </div>
                </div>
              </section>

              {/* Counter-Notification */}
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic">Counter-Notification Process</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    If you believe your content was mistakenly disabled or removed as a result of an incorrect copyright strike, you may file a formal counter-notification. Under DMCA guidelines (17 U.S.C. § 512(g)), the counter-notice must be in writing, contain a signature, identify the material removed, and declare consent to federal court jurisdiction.
                  </p>
                  <p>
                    Upon receiving a valid counter-notice, we will forward it to the original complaining party. If the claimant does not file a lawsuit within 10-14 business days, we are legally entitled to restore the disabled material.
                  </p>
                </div>
              </section>

              {/* Designated Agent Box */}
              <div className="pt-12 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                  <div className="flex items-center gap-4">
                    <Mail className="text-studio-yellow flex-shrink-0" size={32} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Designated Copyright Agent</h4>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Samples Wala Legal & Grievance Department</p>
                      <p className="text-[10px] font-bold text-studio-yellow uppercase tracking-widest mt-1">legal@sampleswala.com</p>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                    Note: Email is the fastest method to submit copyright take-downs. Notices submitted via physical mail may experience processing delays.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
