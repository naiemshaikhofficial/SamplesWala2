import Image from 'next/image';

const labels = [
  { name: 'Sony Music', logo: '/logos/sony.png' },
  { name: 'T-Series', logo: '/logos/tseries.png' },
  { name: 'Desi Music Factory', logo: '/logos/desi.png' },
  { name: 'Tips', logo: '/logos/tips.png' },
  { name: 'Saregama', logo: '/logos/saregama.png' },
  { name: 'White Hill', logo: '/logos/hill.png' },
];

export default function TrustedBy() {
  return (
    <div className="py-12 overflow-hidden relative bg-white border-y-4 border-black shadow-[0_0_50px_rgba(255,255,255,0.1)]">
      <div className="container mx-auto px-4 mb-8 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-center text-black text-[10px] md:text-xs font-black uppercase tracking-[0.6em]">
            TRUSTED BY PRODUCERS AT
          </h2>
          <div className="h-1 w-12 bg-black" />
        </div>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="flex space-x-16 md:space-x-32 animate-marquee whitespace-nowrap py-4 items-center">
          {/* Double the labels for seamless loop */}
          {[...labels, ...labels, ...labels].map((label, index) => (
            <div
              key={index}
              className="flex items-center justify-center transition-all duration-500 w-32 md:w-48 h-10 md:h-14 relative group/logo"
            >
              <Image
                src={label.logo}
                alt={label.name}
                fill
                className="object-contain transition-all duration-500"
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
}
