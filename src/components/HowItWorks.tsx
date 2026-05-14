'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Lightbulb, Laptop, Mic2, Gift } from 'lucide-react'

const steps = [
  {
    id: '01',
    title: 'THE BRAINSTORM',
    description: 'Every pack starts with a vision. We research the current sound of the industry—from Bollywood hits to independent Hip Hop—to identify exactly what producers need next.',
    icon: <Lightbulb className="w-6 h-6" />,
    image: '/how-it-works/brainstorming.png',
    color: 'bg-studio-yellow',
    textColor: 'text-black'
  },
  {
    id: '02',
    title: 'DIGITAL PRODUCTION',
    description: 'Our world-class producers head to the DAW. We craft unique soundscapes using elite VSTs and custom signal chains to ensure every loop has that professional "hit" energy.',
    icon: <Laptop className="w-6 h-6" />,
    image: '/how-it-works/daw.png',
    color: 'bg-studio-pink',
    textColor: 'text-white'
  },
  {
    id: '03',
    title: 'LIVE SESSIONS',
    description: 'When digital isn\'t enough, we go live. We record professional musicians playing authentic Indian instruments in high-end studio environments for maximum realism and character.',
    icon: <Mic2 className="w-6 h-6" />,
    image: '/how-it-works/recording.png',
    color: 'bg-studio-blue',
    textColor: 'text-white'
  },
  {
    id: '04',
    title: 'FINAL POLISH',
    description: 'The finished product. Every sample is meticulously labeled by BPM and Key, 100% royalty-free, and ready to be dropped straight into your next masterpiece.',
    icon: <Gift className="w-6 h-6" />,
    image: '/how-it-works/final.png',
    color: 'bg-studio-neon',
    textColor: 'text-black'
  }
]

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Background Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[20rem] font-black uppercase tracking-tighter comic-text leading-none rotate-[-5deg]">PROCESS</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Side: Images (Pinned) */}
            <div className="relative aspect-square md:aspect-video lg:aspect-square w-full">
              {steps.map((step, index) => {
                const range = [index * 0.25, (index + 1) * 0.25]
                // Sharp opacity logic: Only visible in its own 25% quadrant
                const start = index * 0.25
                const end = (index + 1) * 0.25
                const opacity = useTransform(
                  smoothProgress, 
                  [start, start + 0.05, end - 0.05, end], 
                  [0, 1, 1, index === steps.length - 1 ? 1 : 0]
                )
                const scale = useTransform(smoothProgress, [start, start + 0.1, end], [0.9, 1, 1])
                const rotate = useTransform(smoothProgress, [start, end], [2, 0])

                return (
                  <motion.div
                    key={step.id}
                    style={{ opacity, scale, rotate, zIndex: index + 10 }}
                    className="absolute inset-0"
                  >
                    <div className={`absolute inset-0 ${step.color} translate-x-4 translate-y-4 -z-10 border-4 border-black shadow-[20px_20px_0px_rgba(0,0,0,0.5)]`} />
                    <div className="relative h-full w-full border-4 border-black overflow-hidden group bg-studio-charcoal">
                      <Image 
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      
                      {/* Step Badge */}
                      <div className={`absolute top-6 left-6 ${step.color} ${step.textColor} px-6 py-2 font-black text-2xl border-4 border-black shadow-[4px_4px_0px_black]`}>
                        {step.id}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Right Side: Text Content (Linked to Scroll) */}
            <div className="space-y-12 relative h-[400px] lg:h-[500px] flex flex-col justify-center">
              <div className="absolute -top-40 left-0 space-y-4">
                 <div className="inline-block px-4 py-1 bg-studio-pink text-white font-black uppercase text-[10px] tracking-[0.3em] jagged-border">
                    TRANSPARENT PROCESS
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter comic-text text-white leading-[0.8]">
                    HOW SAMPLES<br />ARE MADE
                  </h2>
              </div>

              <div className="relative h-full w-full">
                {steps.map((step, index) => {
                  const start = index * 0.25
                  const end = (index + 1) * 0.25
                  const opacity = useTransform(
                    smoothProgress, 
                    [start, start + 0.05, end - 0.05, end], 
                    [0, 1, 1, index === steps.length - 1 ? 1 : 0]
                  )
                  const y = useTransform(smoothProgress, [start, start + 0.1], [20, 0])

                  return (
                    <motion.div
                      key={step.id}
                      style={{ opacity, y, pointerEvents: index === 0 ? 'auto' : 'none' }}
                      className="absolute inset-0 flex flex-col justify-center space-y-6"
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} ${step.textColor} border-4 border-black shadow-[6px_6px_0px_black] mb-4`}>
                        {step.icon}
                      </div>
                      <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-xl text-white/60 font-medium leading-relaxed uppercase tracking-wide max-w-lg">
                        {step.description}
                      </p>
                      <div className="h-1 w-24 bg-studio-neon border border-black" />
                    </motion.div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Progress Indicator (Vertical Line) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 h-48 w-1 bg-white/10 overflow-hidden hidden md:block">
          <motion.div 
            style={{ scaleY: scrollYProgress }}
            className="w-full h-full bg-studio-pink origin-top"
          />
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-studio-pink/5 blur-[150px] -z-10 rounded-full animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-studio-blue/5 blur-[150px] -z-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  )
}
