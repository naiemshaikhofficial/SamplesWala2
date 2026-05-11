import React from 'react'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, Plus, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'FAQ | Samples Wala',
  description: 'Frequently asked questions about Indian sample packs, licenses, and downloads.',
}

const faqData = [
  {
    category: "Downloads & Access",
    questions: [
      {
        q: "How do I download my packs after purchase?",
        a: "Immediately after payment, your packs will appear in your 'Library'. You can download them as ZIP files anytime. We also send a confirmation email with a link to your secure vault."
      },
      {
        q: "The download link is not working, what do I do?",
        a: "Try refreshing the page or logging out and back in. If the signal is still lost, contact our support team and we will generate a fresh secure link for you manually."
      }
    ]
  },
  {
    category: "License & Commercial Use",
    questions: [
      {
        q: "Can I use these sounds in commercial projects?",
        a: "Yes! All our packs come with a 100% Royalty-Free license. You can use them in songs you release on Spotify, YouTube, or even for client projects without ever paying us royalties."
      },
      {
        q: "Can I resell the sounds as my own?",
        a: "No. You are licensed to use the sounds in your music production, but you cannot resell the raw samples or repackage them as your own sample pack."
      }
    ]
  },
  {
    category: "Technical & Compatibility",
    questions: [
      {
        q: "Which DAWs are these sounds compatible with?",
        a: "Our samples are high-quality 24-bit WAV files. They work in EVERY major DAW, including FL Studio, Ableton Live, Logic Pro, Cubase, GarageBand, and more."
      },
      {
        q: "Are the loops key and BPM labeled?",
        a: "Absolutely. Every melodic loop is labeled with its Key (e.g., Cm) and BPM (e.g., 90bpm) so you can drag and drop them into your project perfectly."
      }
    ]
  },
  {
    category: "Account & Subscriptions",
    questions: [
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel anytime from your 'Account Settings'. You will keep access to all premium features until the end of your current billing cycle."
      },
      {
        q: "Can I share my account with a friend?",
        a: "No. Each account is for a single producer. Sharing accounts is against our terms and may lead to a permanent block of the account to protect our musicians' work."
      }
    ]
  }
]

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(group => 
      group.questions.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    )
  };

  return (
    <div className="min-h-screen bg-black selection:bg-studio-yellow selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Studio
        </Link>

        <div className="space-y-16">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-studio-yellow/10 border border-studio-yellow/20">
              <HelpCircle size={12} className="text-studio-yellow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-yellow font-mono">Support Center</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              Common <br /><span className="text-white/20">Questions.</span>
            </h1>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest pt-4 italic">Everything you need to know about Samples Wala.</p>
          </div>

          <div className="space-y-20 border-t border-white/5 pt-16">
            {faqData.map((group, idx) => (
              <section key={idx} className="space-y-8">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-studio-yellow italic border-l-2 border-studio-yellow pl-4">
                  {group.category}
                </h2>
                
                <div className="grid gap-4">
                  {group.questions.map((faq, fIdx) => (
                    <div 
                      key={fIdx} 
                      className="p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-white/10 transition-colors group"
                    >
                      <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-studio-yellow transition-colors flex items-start gap-3">
                        <Plus size={14} className="mt-1 flex-shrink-0 text-studio-yellow opacity-40" />
                        {faq.q}
                      </h3>
                      <p className="mt-4 text-xs font-medium text-white/40 leading-relaxed pl-6">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="bg-studio-yellow p-12 text-black text-center space-y-6 rounded-sm">
            <div className="flex justify-center">
              <div className="p-4 bg-black rounded-full">
                <MessageSquare size={32} className="text-studio-yellow" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Still have questions?</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 max-w-md mx-auto">
                Our support team is active 24/7. We usually reply within a few hours.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/contact" className="px-10 py-5 bg-black text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform inline-block">
                Message Us Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
