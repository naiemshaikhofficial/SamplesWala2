import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, User, Share2, Facebook, Twitter, Instagram } from 'lucide-react'
import { generatePageMetadata, generateSmartKeywords } from '@/lib/seo/metadata'
import { generateBlogStructuredData, generateBreadcrumbData } from '@/lib/seo/structuredData'

// Mock database of blog posts
const blogPosts: Record<string, any> = {
  "top-5-indian-percussion-sample-packs-2026": {
    title: "TOP 5 INDIAN PERCUSSION SAMPLE PACKS FOR 2026",
    description: "Discover the most authentic Dholak, Tabla, and South Indian percussion loops used by industry professionals in Bollywood and Hip-Hop.",
    date: "May 12, 2026",
    author: "Samples Wala Team",
    category: "Guides",
    image: "/graffiti-bg.png",
    content: `
      <p>The landscape of Indian music production has evolved rapidly. In 2026, authenticity is no longer a luxury—it's a requirement. Whether you're producing a chart-topping Bollywood track or an underground Hip-Hop anthem, the quality of your percussion can make or break your sound.</p>
      
      <h2>1. THE SOUTH - Definitive South Indian Collection</h2>
      <p>This is currently our most requested pack. It captures the raw energy of South Indian street percussion with unprecedented clarity. From heavy Thavil hits to intricate Parai rhythms, this pack is essential for anyone looking to add that "Kutthu" vibe to their music.</p>
      
      <h2>2. BOLLYWOOD ESSENTIALS - Vol. 1</h2>
      <p>Classic Bollywood sounds re-imagined for modern DAWs. This pack includes professionally recorded Dholak and Tabla loops that have been processed to sit perfectly in a modern mix without losing their organic soul.</p>
      
      <h2>3. URBAN INDIAN PERCUSSION - Hip-Hop Edition</h2>
      <p>Traditional sounds meeting urban grit. We've taken classical Indian instruments and processed them through analog gear to give them the punch needed for modern Trap and Boom Bap productions.</p>
      
      <h2>4. THE MYSTIC SITAR - Melodic & Rhythmic Loops</h2>
      <p>While primarily a melodic instrument, the rhythmic sitar strokes included in this pack provide a unique texture that works surprisingly well in Electronic and Lo-Fi music.</p>
      
      <h2>5. TEMPLE SOUNDS - Cinematic Indian Percussion</h2>
      <p>Huge, resonant sounds recorded in acoustic spaces that capture the grandeur of Indian temple festivals. Perfect for cinematic scores and high-energy dance tracks.</p>

      <blockquote>
        "The key to a great track is using sounds that have a story. Our 2026 collection is built on those stories."
      </blockquote>

      <p>Explore these packs today in our <a href="/browse" class="text-studio-neon underline">Browse section</a> and take your production to the next level.</p>
    `
  },
  "how-to-make-bollywood-drill-the-ultimate-guide": {
    title: "HOW TO MAKE BOLLYWOOD DRILL: THE ULTIMATE GUIDE",
    description: "Learn how to fuse UK/NY Drill with traditional Indian melodies and percussion. The definitive guide to Bollywood Drill.",
    date: "May 13, 2026",
    author: "Samples Wala Team",
    category: "Tutorials",
    image: "/mural-bg.png",
    content: `
      <p>The sound of "Drill" has gone global, but nothing sounds quite like its Indian counterpart. Bollywood Drill is a genre-defying fusion that combines the aggressive energy of UK/NY Drill with the rich, melodic heritage of India.</p>
      
      <h2>1. The Rhythmic Foundation: Beyond the Hi-Hats</h2>
      <p>In standard Drill, the hi-hats provide the bounce. In Bollywood Drill, we replace or layer those hats with <b>Tabla Takis</b> or <b>Dholak Chantis</b>. This adds a "swing" that is uniquely Indian.</p>
      
      <h2>2. The Melodic Hook: Sitar & Sarangi</h2>
      <p>Forget the dark piano loops for a second. Try using a minor-scale <b>Sitar</b> loop or a haunting <b>Sarangi</b> melody. When these traditional sounds are chopped and pitched down, they create an atmosphere that is both gritty and sophisticated.</p>
      
      <h2>3. The 808s: Sliding with Purpose</h2>
      <p>The 808s in Drill are iconic. For the Bollywood version, ensure your 808 slides complement the melodic scale of your Indian instrument. Using a "Phrygian Dominant" scale often works best for that Middle-Eastern/Indian cinematic feel.</p>
      
      <blockquote>
        "The secret is in the contrast—the hardness of the Drill beat vs. the soul of the Indian melody."
      </blockquote>

      <p>Ready to start? Check out our <a href="/browse?q=drill" class="text-studio-neon underline">Drill-ready Indian samples</a> and start cooking!</p>
    `
  },
  "how-to-produce-bollywood-style-beats-complete-guide": {
    title: "HOW TO PRODUCE BOLLYWOOD STYLE BEATS: A COMPLETE GUIDE",
    description: "Learn the secret arrangements, instrument layering, and percussion techniques to create chart-topping Bollywood hits.",
    date: "May 10, 2026",
    author: "Pro Producer",
    category: "Tutorials",
    image: "/about-hero.png",
    content: `
      <p>Bollywood music is a unique blend of traditional Indian folk, classical elements, and global pop trends. To produce a "Bollywood Style" beat, you need to understand more than just the notes—you need to understand the vibe.</p>
      
      <h2>Step 1: The Foundation - Rhythmic Complexity</h2>
      <p>Unlike Western pop which often relies on a steady 4/4 beat, Bollywood often thrives on "syncopation". Layering a standard kick-snare pattern with a Dholak or Tabla loop is the first step to getting that signature sound.</p>
      
      <h2>Step 2: Melodic Fusion</h2>
      <p>Combining Western synthesizers with traditional Indian instruments like the Sitar, Flute (Bansuri), or Sarangi creates the "East meets West" aesthetic that defines the modern era of the industry.</p>
      
      <h2>Step 3: Mastering the High-End</h2>
      <p>Indian percussion is rich in high-frequency transients. Proper EQ-ing is crucial. Don't be afraid to boost the highs on your Manjira or Ghungroo loops to make them cut through the dense arrangement.</p>

      <p>For more advanced tools, check out our <a href="/browse?category=Melodic" class="text-studio-neon underline">Melodic Loops collection</a>.</p>
    `
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) return {}

  const keywords = generateSmartKeywords(post.title, post.category)

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    image: post.image,
    path: `/blog/${slug}`,
    keywords
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  const breadcrumbs = generateBreadcrumbData([
    { name: 'Home', item: 'https://sampleswala.com' },
    { name: 'Blog', item: 'https://sampleswala.com/blog' },
    { name: post.title, item: `https://sampleswala.com/blog/${slug}` }
  ])

  const blogSchema = generateBlogStructuredData(post, slug)

  return (
    <article className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-studio-neon transition-colors mb-12"
        >
          <ArrowLeft size={14} /> BACK TO BLOG
        </Link>

        {/* Hero Section */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
             <span className="px-3 py-1 bg-studio-neon text-black text-[8px] font-black uppercase tracking-widest border-2 border-black">
                {post.category}
             </span>
             <div className="h-[2px] bg-white/10 flex-grow" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] md:leading-[0.9] text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-y border-white/5 py-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-studio-charcoal border-2 border-black rounded-full flex items-center justify-center">
                   <User size={18} className="text-studio-neon" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">{post.author}</p>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Lead Contributor</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Calendar size={12} className="text-studio-neon" /> {post.date}
                </p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Clock size={12} /> 6 MIN READ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
               <button className="p-2 md:p-3 bg-studio-charcoal border-2 border-black hover:bg-studio-neon hover:text-black transition-all">
                  <Share2 size={14} className="md:w-4 md:h-4" />
               </button>
               <button className="p-2 md:p-3 bg-studio-charcoal border-2 border-black hover:text-[#1877F2] transition-all">
                  <Facebook size={14} className="md:w-4 md:h-4" />
               </button>
               <button className="p-2 md:p-3 bg-studio-charcoal border-2 border-black hover:text-[#1DA1F2] transition-all">
                  <Twitter size={14} className="md:w-4 md:h-4" />
               </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-video relative border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] md:shadow-[15px_15px_0px_rgba(0,0,0,1)] mb-16 overflow-hidden">
           <Image 
             src={post.image} 
             alt={post.title} 
             fill 
             priority
             className="object-cover"
           />
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-studio max-w-none">
           <div 
             className="text-white/60 text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed space-y-8 blog-content"
             dangerouslySetInnerHTML={{ __html: post.content }}
           />
        </div>

        {/* Footer CTA */}
        <div className="mt-24 p-8 md:p-12 bg-studio-neon text-black border-4 border-black shadow-[10px_10px_0px_black] relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Image src="/Logo.png" alt="" width={400} height={100} className="grayscale brightness-0" />
           </div>
           <div className="relative z-10 space-y-6">
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                READY TO MAKE <br /> A HIT RECORD?
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] max-w-md">
                Get the exact same sounds mentioned in this article and start producing industry-standard tracks today.
              </p>
              <Link 
                href="/browse" 
                className="inline-flex items-center gap-4 px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] border-2 border-black hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.2)]"
              >
                BROWSE PACKS <ArrowLeft size={16} className="rotate-180" />
              </Link>
           </div>
        </div>
      </div>
    </article>
  )
}
