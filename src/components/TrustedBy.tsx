'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const labels = [
  { name: 'Sony Music', logo: '/logos/sony.png', scale: 'scale-110' },
  { name: 'T-Series', logo: '/logos/tseries.png', scale: 'scale-90' },
  { name: 'Zee Music', logo: '/logos/zee.png', scale: 'scale-150' },
  { name: 'Desi Music Factory', logo: '/logos/desi.png', scale: 'scale-110' },
  { name: 'Tips', logo: '/logos/tips.png', scale: 'scale-125' },
  { name: 'Saregama', logo: '/logos/saregama.png', scale: 'scale-110' },
  { name: 'White Hill', logo: '/logos/hill.png', scale: 'scale-110' },
  { name: 'Speed Records', logo: '/logos/speed.png', scale: 'scale-110' },
  { name: 'Aditya Music', logo: '/logos/aditya.png', scale: 'scale-110' },
  { name: 'Ommsom Entertainment', logo: '/logos/odia-removebg-preview.png', scale: 'scale-110' },

];

export default function TrustedBy() {
  return (
    <div className="py-8 overflow-hidden relative bg-white border-y-4 border-black shadow-[0_0_50px_rgba(255,255,255,0.1)]">
      <div className="container mx-auto px-4 mb-4 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-center text-black text-[10px] md:text-xs font-black uppercase tracking-[0.6em]">
            TRUSTED BY PRODUCERS AT
          </h2>
          <div className="h-1 w-12 bg-black" />
        </div>
        <div className="sr-only">
          Trusted by producers at: Sony Music, T-Series, Zee Music, Desi Music Factory, Tips, Saregama, White Hill, Speed Records, Aditya Music, Ommsom Entertainment.
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Using Framer Motion for a much smoother, non-glitchy loop */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            ease: "linear", 
            repeat: Infinity 
          }}
          style={{ willChange: 'transform' }}
          className="flex whitespace-nowrap py-4 items-center"
        >
          {/* Use 2 sets for perfect -50% loop */}
          {[...labels, ...labels].map((label, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-32 md:w-44 h-16 md:h-20 relative group/logo px-6 md:px-12"
            >
              <div className="relative w-full h-full transition-transform duration-500 group-hover/logo:scale-125">
                <Image
                  src={label.logo}
                  alt={label.name}
                  fill
                  sizes="(max-width: 768px) 128px, 176px"
                  className={`object-contain ${label.scale || ''}`}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gradient overlays for smooth fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
