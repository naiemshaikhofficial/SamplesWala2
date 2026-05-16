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


import { createClient } from "@/lib/supabase/server";
import { CartProvider } from "@/context/CartContext";
import { HeaderCartIcon } from "@/components/HeaderCartIcon";
import { Instagram, Youtube, Twitter } from "lucide-react";
import { BackgroundMural } from "@/components/BackgroundMural";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ContentProtection } from "@/components/ContentProtection";
import { CartSidebar } from "@/components/CartSidebar";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { getUser } from "@/lib/supabase/server";

import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: { user } } = await getUser();

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
        <link rel="icon" href="/Favicon.ico" sizes="any" />
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
          <BackgroundMural />
          <ContentProtection />
          <ServiceWorkerRegistration />
          <CartSidebar initialUser={user} />
          <LayoutWrapper user={user}>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
