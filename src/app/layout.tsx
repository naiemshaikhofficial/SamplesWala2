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
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ContentProtection } from "@/components/ContentProtection";

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
        <ContentProtection />
        <ServiceWorkerRegistration />
        <CartProvider>
          <CartSidebar />
          <LayoutWrapper user={user}>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
