import { Permanent_Marker, Luckiest_Guy, Kalam, Noto_Music } from 'next/font/google'
import type { Metadata } from "next";
import "./globals.css";

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-permanent-marker',
})

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-luckiest-guy',
})

const kalam = Kalam({
  weight: ['300', '400', '700'],
  subsets: ['devanagari', 'latin'],
  variable: '--font-kalam',
})

const notoMusic = Noto_Music({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-noto-music',
})
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Samples Wala | Premium Indian & Global Sample Packs, Loops & Presets",
  description: "Samples Wala provides high-quality Indian and global sounds for music producers worldwide. Professional royalty-free sample packs, loops, and curated presets for Bollywood, Hip-Hop, Electronic, and more.",
});


import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";
import { HeaderCartIcon } from "@/components/HeaderCartIcon";
import { Instagram, Youtube, Twitter } from "lucide-react";
import { BackgroundMural } from "@/components/BackgroundMural";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ContentProtection } from "@/components/ContentProtection";
import { CartSidebar } from "@/components/CartSidebar";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ArtistStatusProvider } from "@/components/ArtistStatusProvider";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import "lenis/dist/lenis.css";
import { LenisProvider } from "@/components/LenisProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🟢 CPU OPTIMIZATION: All user session checks and artist status checking
  // are now lazy-loaded client-side inside their respective components.
  // This removes all server-side database/auth lookups from the layout,
  // allowing the root shell to be statically pre-rendered (SSG).

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Samples Wala",
    "url": "https://sampleswala.com",
    "logo": "https://sampleswala.com/Logo.png",
    "description": "Premium royalty-free Indian sample packs, loops, and sound kits. Trusted by music producers at major labels like T-Series, Sony Music, Zee Music, and tips. Reviewed by leading artists including Abhi Bright, Sohan Beatz, and python.",
    "sameAs": [
      "https://instagram.com/sampleswala",
      "https://youtube.com/@sampleswala",
      "https://twitter.com/sampleswala"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@sampleswala.com"
    }
  };

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
        <link rel="icon" href="/Favicon.ico?v=5" sizes="any" />
        <link rel="icon" href="/icon.png?v=5" type="image/png" sizes="192x192" />
        
        {/* Mobile Viewport & Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />


        {/* All Google fonts are self-hosted via next/font/google at build time for optimal performance */}

        {/* Supabase Connection Preconnection */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
          </>
        )}

        {/* Payment Gateways & Media CDNs Preconnection */}
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Crawler Directives */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 day" />

        {/* Music-Specific Meta Categorization */}
        <meta name="subject" content="Music Production, Indian Sample Packs, Loops, Bollywood Beats" />
        <meta name="topic" content="Music Production and Beat Making" />
        <meta name="summary" content="Samples Wala - Premium Indian sample packs, loops, software presets, and audio libraries. 100% royalty-free for music producers." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSearchLd) }}
        />
        <Script 
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body className={`${permanentMarker.variable} ${luckiestGuy.variable} ${kalam.variable} ${notoMusic.variable} antialiased min-h-screen flex flex-col text-white`}>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <ArtistStatusProvider>
                <BackgroundMural />
                <ContentProtection />
                <ServiceWorkerRegistration />
                <CartSidebar />
                <LenisProvider>
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </LenisProvider>
                <Analytics />
                <SpeedInsights />
              </ArtistStatusProvider>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
