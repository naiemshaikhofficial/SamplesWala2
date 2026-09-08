'use client'

let cashfreePromise: Promise<any> | null = null

/**
 * Dynamically loads the official Web Payment Gateway SDK v3
 * URL: https://sdk.cashfree.com/js/v3/cashfree.js
 */
export function loadCashfreeSDK(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null)

  if ((window as any).Cashfree) {
    return Promise.resolve((window as any).Cashfree)
  }

  if (cashfreePromise) {
    return cashfreePromise
  }

  cashfreePromise = new Promise((resolve, reject) => {
    // Check if script element already exists in document
    const existing = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')
    if (existing) {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree)
        return
      }
      existing.addEventListener('load', () => {
        if ((window as any).Cashfree) {
          resolve((window as any).Cashfree)
        } else {
          reject(new Error('Payment gateway service failed to initialize.'))
        }
      })
      existing.addEventListener('error', () => {
        cashfreePromise = null
        reject(new Error('Failed to load secure payment service. Please retry.'))
      })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree)
      } else {
        cashfreePromise = null
        reject(new Error('Payment gateway service failed to initialize.'))
      }
    }

    script.onerror = (e) => {
      cashfreePromise = null
      console.error('[PAYMENT_SDK_LOAD_ERROR]', e)
      reject(new Error('Unable to connect to payment gateway. Please check your internet connection or ad-blocker.'))
    }

    document.head.appendChild(script)
  })

  return cashfreePromise
}
