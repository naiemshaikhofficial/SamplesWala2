import { Permanent_Marker, Luckiest_Guy, Kalam } from 'next/font/google'
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
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Samples Wala | Premium Indian Sample Packs & Loops",
  description: "Samples Wala (also known as Sample Wala) provides high-quality sounds for Indian music producers. Professional royalty-free samples, loops, and curated collections for Bollywood, Hip-Hop, and Electronic music.",
});


import { CartProvider } from "@/context/CartContext";
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
        
        {/* PWA Manifest & iOS Mobile Optimization */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Samples Wala" />
        <link rel="apple-touch-icon" href="/Logo.png" />

        {/* DNS Preconnects & Prefetching for Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Music&display=swap" rel="stylesheet" />

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

        {/* Geographic Targeting (Local SEO) */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="Mumbai, India" />
        <meta name="geo.position" content="19.0760;72.8777" />
        <meta name="ICBM" content="19.0760, 72.8777" />

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
      <body className={`${permanentMarker.variable} ${luckiestGuy.variable} ${kalam.variable} antialiased min-h-screen flex flex-col text-white`}>
        <CartProvider>
          <ArtistStatusProvider>
            <BackgroundMural />
            <ContentProtection />
            <ServiceWorkerRegistration />
            <CartSidebar />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Analytics />
            <SpeedInsights />
          </ArtistStatusProvider>
        </CartProvider>

      </body>
    </html>
  );
}
