'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

export type Currency = 'INR' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (cur: Currency) => void
  symbol: string
  formatPrice: (inrAmount: number, usdAmount?: number | null) => string
  getAmount: (inrAmount: number, usdAmount?: number | null) => number
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure`
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('INR')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Check if user already has a saved currency cookie (from user preference or middleware)
    const savedCookie = getCookie('currency') as Currency | null
    if (savedCookie === 'INR' || savedCookie === 'USD') {
      setCurrencyState(savedCookie)
      setIsLoading(false)
      return
    }

    // 2. Fetch country detection from Cloudflare / Edge API
    let isMounted = true
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return
        if (data?.currency === 'USD' || data?.currency === 'INR') {
          setCurrencyState(data.currency)
          setCookie('currency', data.currency)
        }
      })
      .catch(() => {
        // 3. Fallback: timezone/locale if fetch fails or offline
        try {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
          const isIndianTimeZone = timeZone === 'Asia/Kolkata' || timeZone === 'Asia/Calcutta'
          const isIndianLocale = navigator.languages?.some(l => l.includes('-IN') || l.startsWith('hi'))

          if (isIndianTimeZone || isIndianLocale) {
            setCurrencyState('INR')
          } else {
            setCurrencyState('USD')
          }
        } catch {
          setCurrencyState('INR')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur)
    setCookie('currency', cur)
  }

  const symbol = currency === 'INR' ? '₹' : '$'

  const getAmount = (inrAmount: number, usdAmount?: number | null): number => {
    if (currency === 'INR') {
      return Number(inrAmount)
    } else {
      if (usdAmount !== undefined && usdAmount !== null) {
        return Number(usdAmount)
      }
      if (Number(inrAmount) === 0) {
        return 0
      }
      // Fallback conversion rate if price_usd is missing
      const converted = Math.round((Number(inrAmount) / 80) * 100) / 100
      return converted > 0 ? converted : 9.99
    }
  }

  const formatPrice = (inrAmount: number, usdAmount?: number | null): string => {
    const amt = getAmount(inrAmount, usdAmount)
    if (amt === 0 || Number(inrAmount) === 0) {
      return 'FREE'
    }
    if (currency === 'INR') {
      return `₹${Math.round(amt)}`
    } else {
      return `$${amt.toFixed(2)}`
    }
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      symbol,
      formatPrice,
      getAmount,
      isLoading
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
