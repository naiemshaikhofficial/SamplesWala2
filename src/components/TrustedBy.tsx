'use client';
import Image from 'next/image';

const labels = [
  { name: 'Sony Music', logo: '/logos/sony.png', scale: 'scale-[1.1]' },
  { name: 'T-Series', logo: '/logos/tseries.png', scale: 'scale-[0.85]' },
  { name: 'Zee Music', logo: '/logos/zee.png', scale: 'scale-[1.35]' },
  { name: 'Desi Music Factory', logo: '/logos/desi.png', scale: 'scale-[1.1]' },
  { name: 'Tips', logo: '/logos/tips.png', scale: 'scale-[1.1]' },
  { name: 'Saregama', logo: '/logos/saregama.png', scale: 'scale-[1.2]' },
  { name: 'White Hill', logo: '/logos/hill.png', scale: 'scale-[1.0]' },
  { name: 'Speed Records', logo: '/logos/speed.png', scale: 'scale-[1.3]' },
  { name: 'Aditya Music', logo: '/logos/aditya.png', scale: 'scale-[1.1]' },
  { name: 'Ommsom Entertainment', logo: '/logos/odia-removebg-preview.png', scale: 'scale-[0.9]' },
  { name: 'Desi Melodies', logo: '/logos/desi_melodies.png', scale: 'scale-[1.1]' },
  { name: 'Warner Music India', logo: '/logos/warner.png', scale: 'scale-[1.2]' },
  { name: 'Ultra Media', logo: '/logos/ultra.png', scale: 'scale-[1.1]' },
  { name: 'Times Music', logo: '/logos/times.png', scale: 'scale-[1.2]' },
  { name: 'Universal Music Group', logo: '/logos/universal.png', scale: 'scale-[1.8] invert' },
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
          Trusted by producers at: Sony Music, T-Series, Zee Music, Desi Music Factory, Tips, Saregama, White Hill, Speed Records, Aditya Music, Ommsom Entertainment, Desi Melodies, Warner Music India, Ultra Media, Times Music, Universal Music Group.
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Hardware-accelerated pure CSS marquee for a 100% smooth, non-glitchy loop */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes trusted-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.3333%, 0, 0); }
          }
          .trusted-marquee-inner {
            display: flex;
            width: max-content;
            animation: trusted-marquee 40s linear infinite;
            will-change: transform;
          }
          .trusted-marquee-inner:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="trusted-marquee-inner py-4 items-center">
          {/* Use 3 sets for a perfect 33.333% loop with zero empty gaps on any screen width */}
          {[...labels, ...labels, ...labels].map((label, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-32 md:w-44 h-16 md:h-20 relative group/logo px-6 md:px-12 flex-shrink-0"
            >
              <div className="relative w-full h-full transition-transform duration-500 group-hover/logo:scale-125">
                <Image
                  src={label.logo}
                  alt={label.name}
                  fill
                  sizes="(max-width: 768px) 128px, 176px"
                  className={`object-contain ${label.scale || ''}`}
                  priority={index < 10} // Preload the first set of logos to prevent layout jumps
                />
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
