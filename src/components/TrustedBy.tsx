import Image from 'next/image';

const labels = [
  { name: 'Sony Music', logo: '/logos/sony.png' },
  { name: 'T-Series', logo: '/logos/tseries.png' },
  { name: 'Desi Music Factory', logo: '/logos/desi.png' },
  { name: 'Tips', logo: '/logos/tips.png' },
  { name: 'Saregama', logo: '/logos/saregama.png' },
];

export default function TrustedBy() {
  return (
    <section className="py-20 bg-black border-y border-white/5 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-12 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">
            Trusted by Producers at
          </h2>
        </div>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="flex space-x-12 md:space-x-24 animate-marquee whitespace-nowrap py-4 items-center">
          {/* Double the labels for seamless loop */}
          {[...labels, ...labels, ...labels].map((label, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center transition-all duration-500 w-24 md:w-40 h-10 md:h-14 relative group/logo"
            >
              <Image
                src={label.logo}
                alt={label.name}
                fill
                className="object-contain grayscale opacity-30 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-500"
              />
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
