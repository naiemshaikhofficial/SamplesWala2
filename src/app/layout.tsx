import type { Metadata } from "next";
import "./globals.css";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Samples Wala | Premium Indian Sample Packs & Loops",
  description: "Samples Wala (also known as Sample Wala) provides high-quality sounds for Indian music producers. Professional royalty-free samples, loops, and curated collections for Bollywood, Hip-Hop, and Electronic music.",
});


import { createClient } from "@/lib/supabase/server";
import { CartProvider } from "@/context/CartContext";
import { HeaderCartIcon } from "@/components/HeaderCartIcon";
import { CartSidebar } from "@/components/CartSidebar";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { Instagram, Youtube, Twitter } from "lucide-react";
import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const siteSearchLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://sampleswala.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sampleswala.com/browse?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/Favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSearchLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col step-grid text-white">
        <ServiceWorkerRegistration />
        <CartProvider>
          <CartSidebar />
          <Header user={user} />
        
        <main className="flex-grow pt-16">
          {children}
        </main>

        <footer className="bg-black border-t border-white/5 pt-12 md:pt-20 pb-10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 md:mb-20">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <Image 
                  src="/Logo.png" 
                  alt="Samples Wala Logo" 
                  width={180} 
                  height={45} 
                  className="h-9 w-auto grayscale opacity-50"
                />
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed max-w-sm">
                  Premium sound design for the modern producer. Industry standard sample packs, loops, and tools for Indian music production.
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-yellow">Navigation</h4>
                <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <li><Link href="/browse" className="hover:text-white transition-colors">Browse Packs</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/library" className="hover:text-white transition-colors">Your Library</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/auth" className="hover:text-white transition-colors">Account</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-neon">Socials</h4>
                <ul className="space-y-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <li>
                    <a href="https://instagram.com/sampleswala" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                      <Instagram size={14} />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://youtube.com/@sampleswala" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                      <Youtube size={14} />
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/sampleswala" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                      <Twitter size={14} />
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-20 text-[8px] font-black uppercase tracking-[0.4em] text-center md:text-left">
              <span>&copy; 2026 SAMPLES WALA :: DEFINITIVE_COLLECTION</span>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation</Link>
              </div>
            </div>
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  );
}
