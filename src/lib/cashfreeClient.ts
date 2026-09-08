'use client'

let cashfreePromise: Promise<any> | null = null

/**
 * Dynamically and resiliently loads the official Cashfree Web SDK v3
 * URL: https://sdk.cashfree.com/js/v3/cashfree.js
 */
export function loadCashfreeSDK(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null)

  // 1. Immediate check if already loaded
  if (typeof (window as any).Cashfree === 'function') {
    return Promise.resolve((window as any).Cashfree)
  }

  if (cashfreePromise) {
    return cashfreePromise
  }

  cashfreePromise = new Promise((resolve, reject) => {
    let timeoutId: any = null
    let intervalId: any = null

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }

    // Poller to detect window.Cashfree even if load event was missed
    intervalId = setInterval(() => {
      if (typeof (window as any).Cashfree === 'function') {
        cleanup()
        resolve((window as any).Cashfree)
      }
    }, 50)

    // Strict 8-second safety timeout so it never hangs indefinitely
    timeoutId = setTimeout(() => {
      cleanup()
      cashfreePromise = null
      if (typeof (window as any).Cashfree === 'function') {
        resolve((window as any).Cashfree)
      } else {
        reject(new Error('Payment gateway took too long to load. Please retry.'))
      }
    }, 8000)

    // Check if script element already exists in document
    let script = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]') as HTMLScriptElement | null

    if (!script) {
      script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.async = true
      // NOTE: Do NOT use crossOrigin='anonymous' as sdk.cashfree.com S3/CloudFront lacks CORS headers
      script.onload = () => {
        if (typeof (window as any).Cashfree === 'function') {
          cleanup()
          resolve((window as any).Cashfree)
        }
      }
      script.onerror = (e) => {
        cleanup()
        cashfreePromise = null
        console.error('[PAYMENT_SDK_LOAD_ERROR]', e)
        reject(new Error('Unable to connect to payment gateway. Please check your internet or ad-blocker.'))
      }
      document.head.appendChild(script)
    }
  })

  return cashfreePromise
}
