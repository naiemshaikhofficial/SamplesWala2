import { isSamplisticFestivalActive, getFestivalPriceInr, getFestivalPriceUsd, FESTIVAL_DISCOUNT_PERCENT } from './festival'

export interface PackPriceDetails {
  priceInr: number;
  priceUsd: number;
  originalPriceInr?: number;
  originalPriceUsd?: number;
  isFestivalDiscount?: boolean;
  festivalDiscountPercent?: number;
  isExpired: boolean;
  isPreorderActive: boolean;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
}

export { isSamplisticFestivalActive, getFestivalPriceInr, getFestivalPriceUsd, FESTIVAL_DISCOUNT_PERCENT }

export function getPackPriceDetails(pack: {
  price_inr: any;
  price_usd?: any;
  created_at: string;
  full_pack_download_url?: string | null;
  is_downloadable?: boolean;
}): PackPriceDetails {
  const basePriceInr = Number(pack.price_inr);
  const basePriceUsd = Number(pack.price_usd || 10);
  const festivalActive = isSamplisticFestivalActive();
  
  const isPreorder = pack.is_downloadable !== undefined
    ? !pack.is_downloadable
    : !pack.full_pack_download_url;

  const applyFestivalDiscount = (pInr: number, pUsd: number) => {
    if (pInr === 0) {
      return { inr: 0, usd: 0, isDiscounted: false };
    }
    if (festivalActive) {
      return {
        inr: getFestivalPriceInr(pInr, FESTIVAL_DISCOUNT_PERCENT),
        usd: getFestivalPriceUsd(pUsd, FESTIVAL_DISCOUNT_PERCENT),
        isDiscounted: true,
      };
    }
    return { inr: pInr, usd: pUsd, isDiscounted: false };
  };

  if (basePriceInr === 0 || !isPreorder || !pack.created_at) {
    const discounted = applyFestivalDiscount(basePriceInr, basePriceUsd);
    return {
      priceInr: discounted.inr,
      priceUsd: discounted.usd,
      originalPriceInr: basePriceInr,
      originalPriceUsd: basePriceUsd,
      isFestivalDiscount: discounted.isDiscounted,
      festivalDiscountPercent: discounted.isDiscounted ? FESTIVAL_DISCOUNT_PERCENT : 0,
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
    const discounted = applyFestivalDiscount(basePriceInr, basePriceUsd);
    return {
      priceInr: discounted.inr,
      priceUsd: discounted.usd,
      originalPriceInr: basePriceInr,
      originalPriceUsd: basePriceUsd,
      isFestivalDiscount: discounted.isDiscounted,
      festivalDiscountPercent: discounted.isDiscounted ? FESTIVAL_DISCOUNT_PERCENT : 0,
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
    const regularPostPromoInr = 1999;
    const regularPostPromoUsd = 39.99;
    const discounted = applyFestivalDiscount(regularPostPromoInr, regularPostPromoUsd);

    return {
      priceInr: discounted.inr, // Automatic post-promo INR price (with festival 20% off if active)
      priceUsd: discounted.usd, // Automatic post-promo USD price (with festival 20% off if active)
      originalPriceInr: regularPostPromoInr,
      originalPriceUsd: regularPostPromoUsd,
      isFestivalDiscount: discounted.isDiscounted,
      festivalDiscountPercent: discounted.isDiscounted ? FESTIVAL_DISCOUNT_PERCENT : 0,
      isExpired: true,
      isPreorderActive: false,
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
    };
  }

  const discounted = applyFestivalDiscount(basePriceInr, basePriceUsd);
  return {
    priceInr: discounted.inr,
    priceUsd: discounted.usd,
    originalPriceInr: basePriceInr,
    originalPriceUsd: basePriceUsd,
    isFestivalDiscount: discounted.isDiscounted,
    festivalDiscountPercent: discounted.isDiscounted ? FESTIVAL_DISCOUNT_PERCENT : 0,
    isExpired: false,
    isPreorderActive: true,
    daysLeft: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
    hoursLeft: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
    minutesLeft: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
    secondsLeft: Math.max(0, Math.floor((difference / 1000) % 60)),
  };
}

