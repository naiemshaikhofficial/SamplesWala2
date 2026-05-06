'use client'
import React, { useEffect } from 'react'
import { clientCache } from '@/lib/clientCache'

export function LocalDataCache({ data, cacheKey }: { data: any, cacheKey: string }) {
  useEffect(() => {
    if (data) {
      clientCache.set(cacheKey, data)
    }
  }, [data, cacheKey])

  return null
}
