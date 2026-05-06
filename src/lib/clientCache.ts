'use client'

const CACHE_PREFIX = 'sampleswala_v1_'
const DEFAULT_EXPIRY = 1000 * 60 * 60 * 24 // 24 Hours

export const clientCache = {
  set: (key: string, data: any, ttl = DEFAULT_EXPIRY) => {
    if (typeof window === 'undefined') return
    const item = {
      data,
      expiry: Date.now() + ttl,
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item))
  },

  get: (key: string) => {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null

    try {
      const item = JSON.parse(raw)
      if (Date.now() > item.expiry) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }
      return item.data
    } catch (e) {
      return null
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CACHE_PREFIX + key)
  }
}
