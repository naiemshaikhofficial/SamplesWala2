import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, User, Tag } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: "Blog | Music Production Tips & Indian Sample Pack News",
  description: "Explore the Samples Wala blog for professional music production tips, Bollywood beat making guides, and the latest news on Indian sample packs and VSTs.",
  path: '/blog'
})

const blogPosts = [
  {
    slug: "top-5-indian-percussion-sample-packs-2026",
    title: "TOP 5 INDIAN PERCUSSION SAMPLE PACKS FOR 2026",
    excerpt: "Discover the most authentic Dholak, Tabla, and South Indian percussion loops used by industry professionals in Bollywood and Hip-Hop.",
    date: "May 12, 2026",
    author: "Samples Wala Team",
    category: "Guides",
    image: "/graffiti-bg.png"
  },
  {
    slug: "how-to-make-bollywood-drill-the-ultimate-guide",
    title: "HOW TO MAKE BOLLYWOOD DRILL: THE ULTIMATE GUIDE",
    excerpt: "The fusion of UK Drill and Indian melodies is taking over. Master the art of sliding 808s and complex Tabla rhythms.",
    date: "May 13, 2026",
    author: "Samples Wala Team",
    category: "Tutorials",
    image: "/mural-bg.png"
  },
  {
    slug: "how-to-produce-bollywood-style-beats-complete-guide",
    title: "HOW TO PRODUCE BOLLYWOOD STYLE BEATS: A COMPLETE GUIDE",
    excerpt: "Learn the secret arrangements, instrument layering, and percussion techniques to create chart-topping Bollywood hits.",
    date: "May 10, 2026",
    author: "Pro Producer",
    category: "Tutorials",
    image: "/about-hero.png"
  },
  {
    slug: "the-future-of-indian-hip-hop-production",
    title: "THE FUTURE OF INDIAN HIP-HOP PRODUCTION",
    excerpt: "Exploring how local sounds and urban graffiti aesthetics are shaping the new wave of Indian independent music.",
    date: "May 08, 2026",
    author: "Artist Spotlight",
    category: "Industry",
    image: "/mural-bg.png"
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter graffiti-text text-white">
            PRO <span className="text-studio-neon italic">BLOG.</span>
          </h1>
          <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
            INDUSTRY SECRETS :: PRODUCTION GUIDES :: SOUND DESIGN INSIGHTS
          </p>
          <div className="h-1 bg-studio-neon w-32 mx-auto shadow-[0_0_20px_#00ff9f]" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group block bg-studio-charcoal/50 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,255,148,0.4)] transition-all overflow-hidden"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black text-studio-neon text-[8px] font-black uppercase tracking-widest border border-studio-neon/20 backdrop-blur-md">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                </div>
                
                <h2 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-studio-neon transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-[11px] text-white/40 font-bold uppercase leading-relaxed tracking-wider line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="pt-4 flex items-center gap-2 text-studio-neon text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                  READ FULL STORY <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-32 p-12 bg-black border-4 border-studio-neon/20 shadow-[0_0_50px_rgba(0,255,148,0.1)] text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-studio-neon/5 blur-[100px] -z-10" />
           <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
             NEVER MISS A <span className="text-studio-neon">BEAT.</span>
           </h2>
           <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Get production tips and free samples delivered to your inbox.</p>
           <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="flex-grow bg-studio-charcoal border-2 border-black h-14 px-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-studio-neon transition-all"
              />
              <button className="h-14 px-10 bg-studio-neon text-black font-black uppercase tracking-widest text-[11px] border-2 border-black shadow-[4px_4px_0px_black] hover:bg-white hover:-translate-y-1 transition-all">
                SUBSCRIBE
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
