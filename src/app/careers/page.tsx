import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Music, DollarSign, Globe, ShieldCheck, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Careers | Join Samples Wala - Sell Your Sounds',
  description: 'Join the Samples Wala family. Sell your high-quality Indian sample packs, loops, and presets to a global audience of music producers.',
  path: '/careers'
})

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pb-20">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-studio-neon/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-studio-pink/10 blur-[120px] rounded-full" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 md:pt-32 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-studio-neon text-black px-4 py-1 font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_white] mb-8 -rotate-1">
            <Zap size={14} fill="black" />
            Artist Opportunity
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            WANT TO SELL YOUR <span className="text-studio-neon">OWN SAMPLES?</span>
          </h1>
          
          <div className="bg-white text-black inline-block px-6 py-3 font-black text-2xl md:text-4xl uppercase italic shadow-[10px_10px_0px_#00FF94] mb-10 -rotate-2">
            EARN UP TO 70% REVENUE!
          </div>
          
          <p className="text-xl md:text-2xl font-bold text-white/60 uppercase tracking-tight leading-tight max-w-2xl mb-12">
            JOIN THE FASTEST GROWING INDIAN SAMPLE LIBRARY AND REACH PRODUCERS GLOBALLY. WE ARE ALWAYS LOOKING FOR HIGH-QUALITY SOUND DESIGNERS.
          </p>

          <div className="flex flex-wrap gap-6">
            <a 
              href="mailto:Careers@sampleswala.com"
              className="px-8 py-5 bg-studio-neon text-black font-black uppercase text-xl italic border-4 border-black shadow-[8px_8px_0px_white] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-4"
            >
              Careers@sampleswala.com
              <Mail size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Us? Grid */}
      <section className="container mx-auto px-4 mt-32 md:mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <DollarSign size={40} className="text-studio-neon" />,
              title: "70% REVENUE SHARE",
              desc: "Earn up to 70% on every single sale of your sound packs. Transparent reporting and fast payouts guaranteed."
            },
            {
              icon: <Globe size={40} className="text-studio-pink" />,
              title: "GLOBAL DISTRIBUTION",
              desc: "Your sounds will be heard by music producers from Bollywood to Hollywood. We handle the marketing, you handle the heat."
            },
            {
              icon: <ShieldCheck size={40} className="text-studio-blue" />,
              title: "ARTIST PROTECTION",
              desc: "We use advanced security and tokenized downloads to ensure your hard work is protected against piracy."
            }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-studio-charcoal/50 border-4 border-black shadow-[10px_10px_0px_rgba(255,255,255,0.05)] relative group hover:bg-studio-charcoal transition-colors">
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Music size={40} />
              </div>
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4 leading-none">{item.title}</h3>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="container mx-auto px-4 mt-32 md:mt-48 relative z-10">
        <div className="bg-studio-neon p-8 md:p-16 border-8 border-black shadow-[20px_20px_0px_white] relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12">
             <Zap size={400} fill="black" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter leading-none mb-12">
              HOW TO <span className="underline decoration-8 underline-offset-8">APPLY?</span>
            </h2>
            
            <div className="space-y-8 text-black font-bold uppercase tracking-tight">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl flex-shrink-0">1</div>
                <div>
                  <h4 className="text-xl font-black">PREPARE YOUR PACK</h4>
                  <p className="text-sm opacity-70 leading-relaxed">
                    UPLOAD YOUR SAMPLES TO <span className="bg-black text-white px-1">GOOGLE DRIVE</span> OR <span className="bg-black text-white px-1">DROPBOX</span>. 
                    MAKE SURE THE LINK ACCESS IS SET TO <span className="underline decoration-2">"EVERYONE WITH THE LINK"</span> SO OUR TEAM CAN REVIEW IT.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl flex-shrink-0">2</div>
                <div>
                  <h4 className="text-xl font-black">100% ORIGINAL WORK</h4>
                  <p className="text-sm opacity-70 leading-relaxed">
                    EVERY SOUND IN YOUR PACK MUST BE CREATED BY YOU FROM SCRATCH. WE HAVE A ZERO-TOLERANCE POLICY FOR PLAGIARISM OR RE-USED SAMPLES.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl flex-shrink-0">3</div>
                <div>
                  <h4 className="text-xl font-black">SUBMIT VIA EMAIL</h4>
                  <p className="text-sm opacity-70 leading-relaxed">
                    SEND THE LINK TO <span className="bg-black text-white px-2">Careers@sampleswala.com</span>. 
                    OUR TEAM WILL REVIEW YOUR WORK AND CONTACT YOU WITHIN <span className="bg-white text-black px-1 shadow-[2px_2px_0px_black]">24-48 HOURS</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex items-center gap-4 group">
               <div className="h-0.5 flex-grow bg-black/20" />
               <Link href="/browse" className="text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-2 transition-transform">
                 OR BROWSE EXISTING PACKS <ArrowRight size={14} />
               </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
