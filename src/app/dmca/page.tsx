import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert, FileText, Mail, Gavel } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'DMCA Policy | Samples Wala',
  description: 'Digital Millennium Copyright Act compliance and copyright notice policy.',
  path: '/dmca'
})

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Studio
        </Link>

        <div className="space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <ShieldAlert size={12} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">Copyright Protection</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              DMCA <br /><span className="text-white/20">Notice.</span>
            </h1>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest pt-4 italic">Respecting Intellectual Property Rights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/5 pt-16">
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-sm">
                <Gavel className="text-red-500 mb-4" size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Legal Enforcement</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest italic">
                  We take copyright infringement seriously. Unauthorized distribution of Samples Wala content is prosecuted globally.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-8 space-y-12">
              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic">DMCA Compliance</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    Samples Wala respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic text-studio-yellow">Reporting Infringement</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    If you believe your copyrighted work is being infringed upon our platform, please provide our Copyright Agent with a written notice containing:
                  </p>
                  <ul className="space-y-3 list-none">
                    <li className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-studio-yellow mt-1.5 flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">A description of the copyrighted work claimed to have been infringed.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-studio-yellow mt-1.5 flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Identification of the material that is claimed to be infringing.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-studio-yellow mt-1.5 flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Your contact information (Email, Address, Phone).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-studio-yellow mt-1.5 flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">A statement of good faith belief that the use is not authorized.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight italic">Counter Notification</h2>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    If material you posted was removed by mistake, you may file a counter-notification. We will follow the legal process to restore the material if appropriate.
                  </p>
                </div>
              </section>

              <div className="pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                  <Mail className="text-studio-yellow" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic text-white">Copyright Agent</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">legal@sampleswala.com</p>
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
