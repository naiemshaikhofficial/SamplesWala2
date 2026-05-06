import type { Metadata } from "next";
import "./globals.css";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Samples Wala | Premium Indian Sample Packs & Loops",
  description: "High-quality sounds for Indian music producers. Professional royalty-free samples, loops, and curated collections for Bollywood, Hip-Hop, and Electronic music.",
});

import { createClient } from "@/lib/supabase/server";
import { CartProvider } from "@/context/CartContext";
import { HeaderCartIcon } from "@/components/HeaderCartIcon";
import { CartSidebar } from "@/components/CartSidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { Instagram, Youtube, Twitter } from "lucide-react";
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
        <CartProvider>
          <CartSidebar />
          <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center px-8 justify-between">
          <Link href="/" className="flex items-center gap-3 group">
             <Image 
               src="/Logo.png" 
               alt="Samples Wala Logo" 
               width={200} 
               height={50} 
               priority
               className="h-10 w-auto transition-all group-hover:drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]"
             />
          </Link>
          <nav className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
            <Link href="/browse" className="hover:text-studio-yellow transition-colors">Browse</Link>
            <Link href="/library" className="hover:text-studio-yellow transition-colors">Library</Link>
            <HeaderCartIcon />
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/auth" className="px-4 py-2 border border-white/10 hover:border-studio-yellow transition-all">Sign In</Link>
            )}
          </nav>
        </header>
        
        <main className="flex-grow pt-16">
          {children}
        </main>

        <footer className="bg-black border-t border-white/5 pt-20 pb-10">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
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
                  <li><Link href="/library" className="hover:text-white transition-colors">Your Library</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
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

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-20 text-[8px] font-black uppercase tracking-[0.4em]">
              <span>&copy; 2026 SAMPLES WALA :: DEFINITIVE_COLLECTION</span>
              <div className="flex gap-8">
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  );
}
