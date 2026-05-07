import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, EyeOff, Globe } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Samples Wala',
  description: 'Easy to understand privacy policy. We protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-yellow transition-colors mb-16 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-studio-neon/10 border border-studio-neon/20">
              <Shield size={12} className="text-studio-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-neon font-mono">Your Privacy</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">Privacy <br /><span className="text-white/20">Policy.</span></h1>
            <div className="flex items-center gap-6 pt-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Simple & Clear</p>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Date: May 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/5 pt-16">
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-studio-neon italic">Our Promise</h3>
              <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-widest">
                We value your trust. We don't sell your data, and we only collect what we need to run the website.
              </p>
            </div>
            
            <div className="md:col-span-8 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">01</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">What we collect</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We only ask for simple info to help you use your account:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Basic Info</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase leading-tight">Your Name and Email to save your purchases.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Security</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase leading-tight">Your IP address to prevent hackers from stealing your account.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">02</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Safe Payments</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We use **Razorpay** for all payments. This means Samples Wala **never** sees or saves your Credit Card, Debit Card, or UPI details. It is all handled by Razorpay's secure system.
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-studio-neon/5 border border-studio-neon/10 rounded-sm">
                    <Lock size={16} className="text-studio-neon flex-shrink-0" />
                    <p className="text-[10px] font-bold text-studio-neon uppercase tracking-widest italic">100% Secure Payment Gateways</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">03</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Cookies</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We use small "cookies" only to keep you logged in and to remember what is in your cart. We do not use them to follow you around the internet or show you ads.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-yellow font-mono">04</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Your Rights</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    You have the right to access, correct, or request the deletion of your personal data at any time. Just email us and we will process your request.
                  </p>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                    Note: If we delete your account data, you will lose access to your past purchases and library.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-studio-neon font-mono">05</span>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Third Parties</h2>
                </div>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed font-medium">
                  <p>
                    We only share your information with trusted service providers like **Razorpay** and **PayPal** to process payments and provide support. We never sell or rent your personal data to anyone.
                  </p>
                </div>
              </section>

              <section className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <Globe className="text-white/20" size={24} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/40 italic">Global Standards</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">We follow global rules to keep your internet life private.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/5 flex items-center justify-center rounded-full">
                <EyeOff size={20} className="text-white/40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">We don't share your info with anyone.</p>
            </div>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-studio-neon hover:underline">
              Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
