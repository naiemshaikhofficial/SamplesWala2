import React from 'react';
import { Mail, MessageSquare, Instagram, Clock } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import ContactForm from './ContactForm';

export const metadata = generatePageMetadata({
  title: 'Contact Us | SamplesWala',
  description: 'Have a question? We are here to help you make better music. Contact SamplesWala for support, collaborations, or inquiries.',
  path: '/contact'
});

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 border-b-4 border-black bg-zinc-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-studio-yellow/10 border-2 border-studio-yellow text-studio-yellow rotate-[-1deg] shadow-[2px_2px_0px_black]">
            <Mail size={12} className="text-studio-yellow animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-widest">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic comic-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            CONTACT <span className="text-studio-yellow">US.</span>
          </h1>
          <p className="max-w-xl mx-auto text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-[0.25em] leading-relaxed">
            Have a question? We're here to help you make better music.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Info (5 Cols) */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter comic-text">Reach Out Directly</h2>
                
                <div className="grid gap-6">
                  {/* Email Card */}
                  <a 
                    href="mailto:contact@sampleswala.com" 
                    className="comic-panel p-6 flex items-start gap-6 group hover:-translate-y-1 hover:shadow-[12px_12px_0px_#FFE600] border-4 border-black transition-all cursor-pointer"
                  >
                    <div className="p-4 bg-[#FFE600] text-black border-2 border-black -rotate-3 group-hover:rotate-3 transition-transform flex-shrink-0">
                      <Mail size={24} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Email Us</h4>
                      <p className="text-lg font-black text-white group-hover:text-[#FFE600] transition-colors truncate">contact@sampleswala.com</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Direct support & business inquiries</p>
                    </div>
                  </a>

                  {/* Instagram Card */}
                  <a 
                    href="https://instagram.com/sampleswala" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="comic-panel p-6 flex items-start gap-6 group hover:-translate-y-1 hover:shadow-[12px_12px_0px_#E1306C] border-4 border-black transition-all cursor-pointer"
                  >
                    <div className="p-4 bg-[#E1306C] text-white border-2 border-black rotate-3 group-hover:-rotate-3 transition-transform flex-shrink-0">
                      <Instagram size={24} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Instagram DMs</h4>
                      <p className="text-lg font-black text-white group-hover:text-[#E1306C] transition-colors truncate">@sampleswala</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Drop a DM for quick availability updates & leaks</p>
                    </div>
                  </a>

                  {/* Support Card */}
                  <div className="comic-panel p-6 flex items-start gap-6 group hover:-translate-y-1 hover:shadow-[12px_12px_0px_#00FF94] border-4 border-black transition-all">
                    <div className="p-4 bg-[#00FF94] text-black border-2 border-black -rotate-2 group-hover:rotate-2 transition-transform flex-shrink-0">
                      <MessageSquare size={24} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Response Time</h4>
                      <p className="text-lg font-black text-white group-hover:text-[#00FF94] transition-colors">Available 24/7</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">We typically reply within 2-4 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (7 Cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Footer Aesthetic */}
      <section className="py-24 bg-zinc-950 border-t-4 border-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest italic comic-text">Based in India, <span className="text-studio-yellow">Global Sound.</span></h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">SamplesWala HQ • Mumbai • 100% Quality</p>
          </div>
        </div>
      </section>
    </div>
  );
}
