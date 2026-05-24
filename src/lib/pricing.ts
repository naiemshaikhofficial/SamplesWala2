export interface PackPriceDetails {
  priceInr: number;
  priceUsd: number;
  isExpired: boolean;
  isPreorderActive: boolean;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
}

export function getPackPriceDetails(pack: {
  price_inr: any;
  price_usd?: any;
  created_at: string;
  full_pack_download_url?: string | null;
}): PackPriceDetails {
  const basePriceInr = Number(pack.price_inr);
  const basePriceUsd = Number(pack.price_usd || 10);
  
  const isPreorder = !pack.full_pack_download_url;
  if (!isPreorder || !pack.created_at) {
    return {
      priceInr: basePriceInr,
      priceUsd: basePriceUsd,
      isExpired: false,
      isPreorderActive: false,
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
    };
  }

  // Parse DB date safely
  const parseDbDate = (dateStr: string) => {
    const str = String(dateStr).trim();
    const direct = new Date(str);
    if (!isNaN(direct.getTime())) return direct.getTime();
    
    let formatted = str.replace(' ', 'T');
    if (formatted.match(/[+-]\d{2}$/)) {
      formatted = formatted + ':00';
    } else if (!formatted.includes('Z') && !formatted.includes('+') && !formatted.includes('-')) {
      formatted = formatted + 'Z';
    }
    
    const secondTry = new Date(formatted);
    if (!isNaN(secondTry.getTime())) return secondTry.getTime();
    
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      return Date.UTC(
        parseInt(match[1], 10),
        parseInt(match[2], 10) - 1,
        parseInt(match[3], 10),
        parseInt(match[4], 10),
        parseInt(match[5], 10),
        parseInt(match[6], 10)
      );
    }
    return 0;
  };

  const launchDate = parseDbDate(pack.created_at);
  if (launchDate === 0) {
    return {
      priceInr: basePriceInr,
      priceUsd: basePriceUsd,
      isExpired: false,
      isPreorderActive: false,
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
    };
  }

  const expiryDate = launchDate + 10 * 24 * 60 * 60 * 1000; // 10 days
  const now = Date.now();
  const difference = expiryDate - now;

  if (difference <= 0) {
    return {
      priceInr: 1999, // Automatic post-promo INR price
      priceUsd: 39.99, // Automatic post-promo USD price
      isExpired: true,
      isPreorderActive: false,
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
    };
  }

  return {
    priceInr: basePriceInr,
    priceUsd: basePriceUsd,
    isExpired: false,
    isPreorderActive: true,
    daysLeft: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
    hoursLeft: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
    minutesLeft: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
    secondsLeft: Math.max(0, Math.floor((difference / 1000) % 60)),
  };
}
