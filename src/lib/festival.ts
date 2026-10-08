/**
 * Samplistic Festival Sale Engine
 * -----------------------------------------------------------
 * Active Window: October 8, 2026 00:00:00 IST -> October 20, 2026 23:59:59 IST
 * Offer: 20% Discount across all major sample packs & products (INR & USD)
 * Auto-Reversion: Everything automatically reverts to regular pricing,
 * standard theme, and removes the festival banner after October 20, 2026.
 */

export const FESTIVAL_NAME = 'Samplistic Festival'
export const FESTIVAL_DISCOUNT_PERCENT = 20
export const FESTIVAL_START_ISO = '2026-10-08T00:00:00+05:30'
export const FESTIVAL_END_ISO = '2026-10-20T23:59:59+05:30'

/**
 * Checks whether the Samplistic Festival is currently active.
 * Uses exact IST (UTC+05:30) timestamps for zero-timezone ambiguity.
 */
export function isSamplisticFestivalActive(currentTimeMs: number = Date.now()): boolean {
  const start = new Date(FESTIVAL_START_ISO).getTime()
  const end = new Date(FESTIVAL_END_ISO).getTime()
  return currentTimeMs >= start && currentTimeMs <= end
}

/**
 * Calculates 20% festival discounted price for INR.
 * Free products (0) remain 0 (FREE).
 */
export function getFestivalPriceInr(
  originalPriceInr: number, 
  percent: number = FESTIVAL_DISCOUNT_PERCENT,
  checkActive: boolean = true
): number {
  const price = Number(originalPriceInr || 0)
  if (price <= 0) return 0
  if (checkActive && !isSamplisticFestivalActive()) return price
  return Math.round(price * (1 - percent / 100))
}

/**
 * Calculates 20% festival discounted price for USD.
 * Free products (0) remain 0 (FREE).
 */
export function getFestivalPriceUsd(
  originalPriceUsd: number, 
  percent: number = FESTIVAL_DISCOUNT_PERCENT,
  checkActive: boolean = true
): number {
  const price = Number(originalPriceUsd || 0)
  if (price <= 0) return 0
  if (checkActive && !isSamplisticFestivalActive()) return price
  return Math.round(price * (1 - percent / 100) * 100) / 100
}

/**
 * Computes live countdown time remaining until October 20, 2026 23:59:59 IST.
 */
export function getFestivalRemainingTime() {
  const targetTime = new Date(FESTIVAL_END_ISO).getTime()
  const now = Date.now()
  const diff = targetTime - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isEnded: false
  }
}
