import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import ContactForm from './ContactForm';

export const metadata = generatePageMetadata({
  title: 'Contact Us | SamplesWala',
  description: 'Have a question? We are here to help you make better music. Contact SamplesWala for support, collaborations, or inquiries.',
});

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 border-b border-white/5 step-grid">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-yellow/10 border border-studio-yellow/20">
            <Mail size={12} className="text-studio-yellow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">
            CONTACT <span className="text-studio-yellow">US.</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed">
            Have a question? We're here to help you make better music.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Reach Out Directly</h2>
                <div className="grid gap-6">
                  <div className="flex items-start gap-6 p-6 studio-panel rounded-sm group hover:border-studio-yellow/30 transition-all">
                    <div className="p-4 bg-studio-yellow/10 rounded-sm text-studio-yellow group-hover:bg-studio-yellow group-hover:text-black transition-colors">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Email Us</h4>
                      <p className="text-lg font-bold">contact@sampleswala.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 p-6 studio-panel rounded-sm group hover:border-studio-neon/30 transition-all">
                    <div className="p-4 bg-studio-neon/10 rounded-sm text-studio-neon group-hover:bg-studio-neon group-hover:text-black transition-colors">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Support</h4>
                      <p className="text-lg font-bold">Available 24/7 for you</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Help Text */}
              <div className="p-8 border-l-2 border-studio-yellow bg-white/5 space-y-4">
                <h3 className="font-black uppercase tracking-widest text-xs">Need Quick Help?</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Just send us a message and we'll get back to you as soon as possible.
                </p>
              </div>
            </div>

            {/* Contact Form (Client Component) */}
            <ContactForm />

          </div>
        </div>
      </section>

      {/* Footer Aesthetic */}
      <section className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest italic">Based in India, <span className="text-studio-yellow">Global Sound.</span></h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">SamplesWala HQ • Mumbai • 100% Quality</p>
          </div>
        </div>
      </section>
    </div>
  );
}
