'use client'

let cashfreePromise: Promise<any> | null = null

/**
 * Dynamically loads the official Cashfree Web JS SDK v3
 * https://sdk.cashfree.com/js/v3/cashfree.js
 */
export function loadCashfreeSDK(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null)

  if ((window as any).Cashfree) {
    return Promise.resolve((window as any).Cashfree)
  }

  if (!cashfreePromise) {
    cashfreePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.async = true
      script.onload = () => {
        if ((window as any).Cashfree) {
          resolve((window as any).Cashfree)
        } else {
          reject(new Error('Cashfree SDK failed to initialize'))
        }
      }
      script.onerror = () => {
        cashfreePromise = null
        reject(new Error('Failed to load Cashfree checkout script'))
      }
      document.head.appendChild(script)
    })
  }

  return cashfreePromise
}
