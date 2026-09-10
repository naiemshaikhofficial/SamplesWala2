'use client'
import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Tag, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Zap, PartyPopper, Clock, Copy, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { validateCoupon } from './actions'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/Header'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import 'react-phone-number-input/style.css'
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input'
import { useCurrency } from '@/context/CurrencyContext'
import { PaymentAccepted } from '@/components/ui/PaymentAccepted'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { loadCashfreeSDK } from '@/lib/cashfreeClient'
import { validateBillingDetails } from '@/lib/checkoutValidation'
import { DeliveryCarAnimation } from '@/components/DeliveryCarAnimation'
import { ThankYouClient } from '@/app/thank-you/ThankYouClient'
import { getSecureDownloadUrl } from '@/app/packs/actions'

// Custom Country Select using react-select to provide a searchable dropdown for the phone country flag selector
const CustomCountrySelect = ({ value, onChange, options, iconComponent: Icon }: any) => {
  const selectOptions = React.useMemo(() => {
    return options.map((opt: any) => {
      let dialCode = ''
      if (opt.value) {
        try {
          dialCode = ` (+${getCountryCallingCode(opt.value)})`
        } catch (e) {}
      }
      return {
        value: opt.value,
        label: `${opt.label}${dialCode}`
      }
    })
  }, [options])

  const selectedValue = selectOptions.find((o: any) => o.value === value)

  return (
    <Select
      options={selectOptions}
      value={selectedValue}
      onChange={(opt: any) => onChange(opt ? opt.value : undefined)}
      isSearchable
      onMenuOpen={() => { document.body.style.overflow = 'hidden' }}
      onMenuClose={() => { document.body.style.overflow = '' }}
      placeholder=""
      className="phone-country-react-select"
      classNamePrefix="phone-country-select"
      formatOptionLabel={(option: any, { context }: any) => {
        if (context === 'value') {
          return (
            <div className="flex items-center justify-center pt-0.5">
              {option.value && <Icon country={option.value} />}
            </div>
          )
        }
        return (
          <div className="flex items-center gap-2">
            {option.value && <Icon country={option.value} />}
            <span className="text-[11px] font-bold text-white/90">{option.label}</span>
          </div>
        )
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          width: '55px',
          minWidth: '55px',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          minHeight: 'auto',
          height: '24px',
        }),
        valueContainer: (base) => ({
          ...base,
          padding: 0,
          margin: 0,
          justifyContent: 'center',
        }),
        indicatorsContainer: (base) => ({
          ...base,
          padding: 0,
          margin: 0,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: '2px',
          color: 'rgba(255, 255, 255, 0.4)',
          '&:hover': {
            color: 'rgba(255, 255, 255, 0.8)',
          }
        }),
        indicatorSeparator: () => ({
          display: 'none'
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: '#0d0d0d',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          zIndex: 60,
          width: '240px',
        }),
        menuList: (base) => ({
          ...base,
          maxHeight: '180px',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
          },
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          color: state.isFocused ? '#FFE600' : 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          padding: '8px 12px',
          '&:active': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }),
        input: (base) => ({
          ...base,
          color: '#fff',
          margin: 0,
          padding: 0,
        }),
        singleValue: (base) => ({
          ...base,
          margin: 0,
          padding: 0,
        })
      }}
    />
  )
}


const CheckoutConveyor = dynamic(() => import('@/components/CheckoutConveyor').then(mod => mod.CheckoutConveyor), {
  ssr: false,
  loading: () => (
    <div className="h-28 bg-[#121212] animate-pulse border-2 border-black rounded-sm" />
  )
})

// --- ANIMATED COUNTER HOOK ---
function useAnimatedCounter(targetValue: number, prefix: string = '₹') {
  const ref = React.useRef<HTMLElement>(null);
  const prevValueRef = React.useRef(targetValue);
  const animationFrameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const startValue = prevValueRef.current;
    const duration = 400;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValue + (targetValue - startValue) * progress;

      if (ref.current) {
        ref.current.textContent = `${prefix}${currentValue.toFixed(2)}`;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, prefix]);

  return ref;
}

// --- MUSICAL NOTES BACKGROUND ---
const MusicalNotesBackground = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const notes = React.useMemo(() => {
    if (!mounted) return [];
    const musicalNotes = ['♪', '♫', '♬', '♪', '♫', '♬', '♪', '♫', '♬', '♪'];
    return musicalNotes.map((note) => ({
      note,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 2 + 1}rem`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 10}s`
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
      {notes.map((data, index) => (
        <span
          key={index}
          className="absolute text-studio-yellow/20 animate-float-note"
          style={{
            left: data.left,
            top: data.top,
            fontSize: data.fontSize,
            animationDelay: data.animationDelay,
            animationDuration: data.animationDuration
          }}
        >
          {data.note}
        </span>
      ))}
    </div>
  );
};

// --- BRANDED CONFETTI & COMIC EFFECT ---
const ConfettiEffect = () => {
  const [pieces, setPieces] = React.useState<{ id: number; left: string; top: string; size: string; color: string; delay: string; tx: string; ty: string; rot: string }[]>([]);

  React.useEffect(() => {
    const colors = ['#FFE600', '#FF0080', '#00BFFF', '#FF5C00', '#BF00FF'];
    const newPieces = Array.from({ length: 120 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 320 + 160; // shoot outward
      const tx = `${Math.cos(angle) * velocity}px`;
      const ty = `${Math.sin(angle) * velocity + 450}px`; // fall down under gravity
      const size = `${Math.random() * 8 + 6}px`;
      return {
        id: i,
        left: '50%',
        top: '40%',
        size,
        color: colors[i % colors.length],
        delay: `${Math.random() * 0.15}s`,
        tx,
        ty,
        rot: `${Math.random() * 720}deg`
      };
    });
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-confetti-burst"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
            '--tx': p.tx,
            '--ty': p.ty,
            '--rot': p.rot
          } as any}
        />
      ))}
      <style>{`
        @keyframes confettiBurst {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(calc(-50% + var(--tx) * 0.4), calc(-50% + var(--ty) * 0.2)) scale(1.3) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.4) rotate(var(--rot));
            opacity: 0;
          }
        }
        .animate-confetti-burst {
          animation: confettiBurst 2.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }
        @keyframes comicPop {
          0% { transform: scale(0) rotate(-15deg); }
          70% { transform: scale(1.15) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-comic-pop {
          animation: comicPop 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        @keyframes shineSweep {
          0% { transform: translateX(-200%) skewX(-25deg); }
          100% { transform: translateX(300%) skewX(-25deg); }
        }
        .animate-shine-sweep {
          animation: shineSweep 3.5s infinite ease-in-out;
        }
        @keyframes wiggleFast {
          0%, 100% { transform: rotate(-10deg) scale(1); }
          50% { transform: rotate(10deg) scale(1.25); }
        }
        .animate-wiggle-fast {
          animation: wiggleFast 0.4s ease-in-out infinite;
        }
        @keyframes neoGlow {
          0%, 100% {
            box-shadow: 4px 4px 0px #000, 0 0 0px rgba(255, 230, 0, 0);
          }
          50% {
            box-shadow: 4px 4px 0px #000, 0 0 16px rgba(255, 230, 0, 0.75);
          }
        }
        .animate-neo-glow:not(:hover):not(:active) {
          animation: neoGlow 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default function CheckoutPage() {
  const countryOptions = React.useMemo(() => countryList().getData(), [])
  const { items, removeItem, total, clearCart, itemCount, setSidebarOpen } = useCart()
  const { currency, symbol, formatPrice } = useCurrency()
  const hasPreorder = items.some(item => item.type === 'pack' && item.is_downloadable === false)

  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar immediately when checkout page loads
  useEffect(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0) // coupon discount percent
  const [applicableItems, setApplicableItems] = useState<string[] | null>(null)
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [isOrderComplete, setIsOrderComplete] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string
    isFree: boolean
    items: any[]
  } | null>(null)
  const [dispatchStage, setDispatchStage] = useState<'idle' | 'dispatching' | 'delivered'>('idle')
  const [dispatchProgress, setDispatchProgress] = useState(15)

  // Active telemetry progress during payment verification
  useEffect(() => {
    if (paymentStatus === 'processing' && dispatchStage === 'idle') {
      const interval = setInterval(() => {
        setDispatchProgress(prev => {
          if (prev >= 80) return prev
          return prev + Math.floor(Math.random() * 8) + 4
        })
      }, 350)
      return () => clearInterval(interval)
    }
  }, [paymentStatus, dispatchStage])

  // Smooth Dispatch Progress Surge (Rushes to 100% on order confirmation then delivers)
  useEffect(() => {
    if (dispatchStage !== 'dispatching') return

    let current = Math.max(80, dispatchProgress)
    setDispatchProgress(current)

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 8
      if (current >= 100) {
        current = 100
        setDispatchProgress(100)
        clearInterval(interval)
        setTimeout(() => {
          setDispatchStage('delivered')
        }, 400)
      } else {
        setDispatchProgress(current)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [dispatchStage])

  // Unified Seamless Order Success Handler (Zero page reload)
  const handleOrderSuccess = (targetOrderId: string, isFree: boolean = false, orderItems: any[] = items) => {
    try {
      sessionStorage.removeItem('pending_cf_checkout')
    } catch (e) {}
    clearCart()
    setCompletedOrder({
      orderId: targetOrderId,
      isFree,
      items: orderItems && orderItems.length > 0 ? orderItems : items
    })
    setIsOrderComplete(true)
    setDispatchStage('dispatching')
    setPaymentStatus('idle')
    setLoading(false)

    // Update browser URL seamlessly without page reload
    if (typeof window !== 'undefined') {
      const url = `/thank-you?order_id=${encodeURIComponent(targetOrderId)}${isFree ? '&free=true' : ''}`
      window.history.pushState({ orderId: targetOrderId }, '', url)
    }
  }

  // Interactive Unbox & Auto-download State
  const [isParcelOpened, setIsParcelOpened] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [copiedOrderId, setCopiedOrderId] = useState(false)

  const handleUnboxAndDownload = async () => {
    if (isParcelOpened && !downloadError) return
    setIsParcelOpened(true)
    setIsDownloading(true)
    setDownloadError(null)

    try {
      let targetId = completedOrder?.items?.[0]?.item_id || completedOrder?.items?.[0]?.id || items?.[0]?.id
      let targetType: 'pack' | 'preset' = completedOrder?.items?.[0]?.item_type || items?.[0]?.type || 'pack'

      if (!targetId) {
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: vaultRec } = await supabase
              .from('user_vault')
              .select('id, item_id, item_type')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()
            if (vaultRec) {
              targetId = vaultRec.item_id
              targetType = vaultRec.item_type || 'pack'
            }
          }
        } catch (err) {
          console.warn('Vault query fallback warning:', err)
        }
      }

      if (!targetId) {
        targetId = 'a9bb41c1-3c8d-4617-91e9-c5a6f83c47b8'
        targetType = 'pack'
      }

      const secureUrl = await getSecureDownloadUrl(targetId, targetType)
      if (secureUrl) {
        const link = document.createElement('a')
        link.href = secureUrl
        link.setAttribute('download', '')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setDownloadSuccess(true)
      } else {
        throw new Error('Could not generate secure download link')
      }
    } catch (e: any) {
      console.error('Failed to auto-download unboxed parcel:', e)
      setDownloadError(e?.message || 'Download failed')
    } finally {
      setTimeout(() => setIsDownloading(false), 3000)
    }
  }

  const [isVerifyingRedirect, setIsVerifyingRedirect] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      return !!urlParams.get('cf_order_id')
    }
    return false
  })
  const [user, setUser] = useState<any>(null)
  const [upsellPacks, setUpsellPacks] = useState<any[]>([])
  const [billingDetails, setBillingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  })

  // Automatic verification if returning from mobile UPI app or redirect
  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    const cfOrderId = urlParams.get('cf_order_id')
    if (cfOrderId) {
      setIsVerifyingRedirect(true)
      setPaymentStatus('processing')
      setLoading(true)

      const saved = sessionStorage.getItem('pending_cf_checkout')
      let parsed: any = null
      if (saved) {
        try {
          parsed = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse pending checkout state:', e)
        }
      }

      fetch('/api/cashfree/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: cfOrderId,
          items: parsed?.items || items.map(i => ({ id: i.id, type: i.type })),
          userId: parsed?.userId || user?.id,
          billingDetails: parsed?.billingDetails || billingDetails,
          couponCode: parsed?.couponCode || (discount > 0 ? coupon : undefined)
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const targetOrderId = data.orderId || cfOrderId
            handleOrderSuccess(targetOrderId, false, parsed?.items || items)
            return
          } else {
            setError(data.error || 'Verification failed')
            setPaymentStatus('idle')
            setIsVerifyingRedirect(false)
          }
        })
        .catch(() => {
          setError('Failed to verify redirected transaction')
          setPaymentStatus('idle')
          setIsVerifyingRedirect(false)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user])

  // Preload secure payment SDK on mount when currency is INR
  useEffect(() => {
    if (currency === 'INR') {
      loadCashfreeSDK().catch(err => {
        console.warn('Preloading payment gateway:', err)
      })
    }
  }, [currency])
  const currentCountryCode = React.useMemo(() => {
    const opt = countryOptions.find(o => o.label.toLowerCase() === billingDetails.country.toLowerCase())
    return opt?.value
  }, [billingDetails.country, countryOptions])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const billingDetailsRef = React.useRef(billingDetails)
  const couponRef = React.useRef(coupon)
  const discountRef = React.useRef(discount)
  const newsletterOptInRef = React.useRef(newsletterOptIn)

  useEffect(() => {
    billingDetailsRef.current = billingDetails
  }, [billingDetails])

  useEffect(() => {
    couponRef.current = coupon
  }, [coupon])

  useEffect(() => {
    discountRef.current = discount
  }, [discount])

  useEffect(() => {
    newsletterOptInRef.current = newsletterOptIn
  }, [newsletterOptIn])

  // 1. Setup client-side dynamic pricing calculations
  const itemsWithPrices = items.map(item => {
    const priceUsd = item.price_usd ? Number(item.price_usd) :
      (item.type === 'preset'
        ? (item.price === 0 ? 0 : Math.round((item.price / 80) * 100) / 100 || 2.99)
        : Math.round(item.price / 80))
    return {
      ...item,
      displayPrice: currency === 'USD' ? `$${priceUsd.toFixed(2)}` : `₹${item.price}`,
      numericPrice: currency === 'USD' ? priceUsd : item.price
    }
  })

  const hasFreeItem = itemsWithPrices.some(item => item.numericPrice === 0)
  const paidItems = itemsWithPrices.filter(item => item.numericPrice > 0)
  const rawSubtotalUsd = itemsWithPrices.reduce((sum, item) => sum + item.numericPrice, 0)
  const bundleDiscountUsd = (!hasFreeItem && paidItems.length >= 3) ? Number((rawSubtotalUsd * 0.1).toFixed(2)) : 0
  const activeSubtotal = currency === 'USD' ? Number((rawSubtotalUsd - bundleDiscountUsd).toFixed(2)) : total

  let activeCouponDiscount = 0
  if (!hasFreeItem && discount > 0) {
    if (currency === 'USD') {
      if (applicableItems && applicableItems.length > 0) {
        const applicableTotal = itemsWithPrices.reduce((sum, item) => {
          if (applicableItems.includes(item.id)) {
            return sum + item.numericPrice
          }
          return sum
        }, 0)
        activeCouponDiscount = Number((applicableTotal * discount / 100).toFixed(2))
      } else {
        activeCouponDiscount = Number((activeSubtotal * discount / 100).toFixed(2))
      }
    } else {
      if (applicableItems && applicableItems.length > 0) {
        const applicableTotal = items.reduce((sum, item) => {
          if (applicableItems.includes(item.id)) {
            return sum + item.price
          }
          return sum
        }, 0)
        activeCouponDiscount = Math.round(applicableTotal * discount / 100)
      } else {
        activeCouponDiscount = Math.round(total * discount / 100)
      }
    }
  }

  const activeTotal = Math.max(0, currency === 'USD'
    ? Number((activeSubtotal - activeCouponDiscount).toFixed(2))
    : (total - activeCouponDiscount)
  )

  // Counter animation refs
  const subtotalRef = useAnimatedCounter(currency === 'USD' ? activeSubtotal : total, symbol)
  const totalRef = useAnimatedCounter(activeTotal, symbol)

  const [paypalLoaded, setPaypalLoaded] = useState(false)

  // 2. Load PayPal SDK helper
  const loadPayPal = (clientId: string) => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).paypal) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Effect to load PayPal SDK
  useEffect(() => {
    if (currency === 'USD' && activeTotal > 0) {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      if (!clientId) {
        setError('PayPal Client ID is not configured.')
        return
      }

      loadPayPal(clientId).then((success) => {
        if (success) {
          setPaypalLoaded(true)
        } else {
          setError('Failed to load PayPal SDK')
        }
      })
    }
  }, [currency, activeTotal])

  // Effect to render/re-render PayPal buttons (Only when loading status, currency, total eligibility, or user shifts)
  useEffect(() => {
    if (paypalLoaded && currency === 'USD' && activeTotal > 0 && document.getElementById('paypal-button-container')) {
      const container = document.getElementById('paypal-button-container')
      if (container) {
        container.innerHTML = ''
      }

      try {
        (window as any).paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay'
          },
          onClick: function (data: any, actions: any) {
            if (!user) {
              router.push('/auth?next=/checkout')
              return actions.reject()
            }
            if (!validateForm(billingDetailsRef.current)) {
              return actions.reject()
            }
            return actions.resolve()
          },
          createOrder: async function (data: any, actions: any) {
            setError('')
            setLoading(true)

            if (!validateForm(billingDetailsRef.current)) {
              setLoading(false)
              throw new Error('Please fill in all required billing details before proceeding with payment.')
            }

            try {
              const res = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: items.map(i => ({ id: i.id, type: i.type })),
                  couponCode: discountRef.current > 0 ? couponRef.current : undefined,
                  billingDetails: {
                    ...billingDetailsRef.current,
                    countryCode: currentCountryCode
                  }
                })
              })
              const order = await res.json()
              if (!res.ok || order.error) {
                if (order.fieldErrors) {
                  setFormErrors(order.fieldErrors)
                  scrollToFirstError(order.fieldErrors)
                }
                throw new Error(order.error || 'PayPal order creation failed')
              }
              return order.id
            } catch (err: any) {
              setError(err.message || 'PayPal order creation failed')
              setLoading(false)
              throw err
            }
          },
          onApprove: async function (data: any, actions: any) {
            setPaymentStatus('processing')
            setLoading(true)

            try {
              const verifyRes = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderID,
                  billingDetails: billingDetailsRef.current
                })
              })
              const verifyData = await verifyRes.json()

              if (verifyData.success) {
                await supabase.auth.updateUser({
                  data: {
                    full_name: billingDetailsRef.current.fullName,
                    phone: billingDetailsRef.current.phone,
                    address: billingDetailsRef.current.address,
                    city: billingDetailsRef.current.city,
                    state: billingDetailsRef.current.state,
                    zip: billingDetailsRef.current.zip,
                    country: billingDetailsRef.current.country
                  }
                })

                try {
                  await supabase
                    .from('user_accounts')
                    .update({ newsletter: newsletterOptInRef.current })
                    .eq('user_id', user.id)
                } catch (e) {
                  console.error('Failed to update newsletter status:', e)
                }

                const targetOrderId = verifyData.orderId || data.orderID
                handleOrderSuccess(targetOrderId, false, items)
                return
              } else {
                setError(verifyData.error || 'Verification failed')
                setPaymentStatus('idle')
                setLoading(false)
              }
            } catch (err) {
              setError('Payment verification error')
              setPaymentStatus('idle')
              setLoading(false)
            }
          },
          onError: function (err: any) {
            console.error('[PAYPAL_BUTTON_ERROR]', err)
            setError('An error occurred during the PayPal transaction.')
            setLoading(false)
          },
          onCancel: function () {
            setLoading(false)
          }
        }).render('#paypal-button-container')
      } catch (e) {
        console.error('Failed to render PayPal buttons:', e)
      }
    }
  }, [paypalLoaded, currency, activeTotal, user])

  useEffect(() => {
    const ensureE164 = (phone: any) => {
      if (!phone || phone === '0' || phone === 0) return ''
      let str = String(phone).trim()
      if (str.startsWith('+')) return str

      const digits = str.replace(/\D/g, '')
      if (!digits) return ''

      // 10 digits -> India (+91)
      if (digits.length === 10) return `+91${digits}`

      // 12 digits starting with 91 -> India (+91)
      if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`

      // 11 digits starting with 0 -> Likely UK (+44) or similar local format
      // Prepending +44 for UK mobile (07...) or just stripping 0 and adding + for safety
      if (str.startsWith('0') && digits.length === 11) {
        if (str.startsWith('07')) return `+44${digits.slice(1)}` // UK Mobile
        return `+${digits}` // Fallback for other 11-digit numbers
      }

      // If it's a long number without + but doesn't start with 0, assume it's E.164 without +
      if (digits.length > 10 && !str.startsWith('0')) return `+${digits}`

      return str
    }

    const loadData = async () => {
      // 1. Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return
      setUser(currentUser)

      // 2. Try fetching from user_accounts table
      const { data: account } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (account && account.address_line1) {
        const dbDetails = {
          fullName: account.full_name || '',
          phone: ensureE164(account.phone_number || ''),
          address: account.address_line1 || '',
          city: account.city || '',
          state: account.state || '',
          zip: account.postal_code || '',
          country: account.country || 'India'
        }
        setBillingDetails(dbDetails)
        localStorage.setItem('billing_details', JSON.stringify(dbDetails))
        return
      }

      // 3. Fallback to localStorage
      const savedDetails = localStorage.getItem('billing_details')
      if (savedDetails) {
        const parsed = JSON.parse(savedDetails)
        setBillingDetails({
          ...parsed,
          phone: ensureE164(parsed.phone),
          country: parsed.country || 'India'
        })
        return
      }

      // 4. Fallback to Auth Metadata
      if (currentUser.user_metadata) {
        const meta = currentUser.user_metadata
        const clean = (val: any) => (val === '0' || val === 0) ? '' : (val || '')

        const metaDetails = {
          fullName: clean(meta.full_name),
          phone: ensureE164(clean(meta.phone)),
          address: clean(meta.address),
          city: clean(meta.city),
          state: clean(meta.state),
          zip: clean(meta.zip),
          country: clean(meta.country) || 'India'
        }
        setBillingDetails(metaDetails)
        localStorage.setItem('billing_details', JSON.stringify(metaDetails))
      }
    }

    loadData()
  }, []) // Run only once on mount

  useEffect(() => {
    // Fetch upsell packs separately and only if items change
    if (items.length > 0) {
      fetch('/api/packs/featured')
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter((p: any) => !items.some(item => item.id === p.id)).slice(0, 2)
          setUpsellPacks(filtered)
        })
        .catch(err => console.error("Failed to fetch upsells", err))
    }
  }, [items])

  const handleBillingChange = (field: string, value: string) => {
    setBillingDetails(prev => {
      if (field === 'country') {
        if (prev.country.toLowerCase() === value.toLowerCase()) return prev
      } else {
        if (prev[field as keyof typeof prev] === value) return prev
      }
      const updated = { ...prev, [field]: value }
      localStorage.setItem('billing_details', JSON.stringify(updated))
      return updated
    })

    // Clear error for this field as user types
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const scrollToFirstError = (errors: Record<string, string>) => {
    const errorKeys = Object.keys(errors)
    if (errorKeys.length === 0) return

    const priority = ['fullName', 'phone', 'address', 'city', 'state', 'zip', 'country']
    const firstField = priority.find(f => errors[f]) || errorKeys[0]

    setTimeout(() => {
      const element = document.getElementById(`billing-input-${firstField}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      } else {
        const billingSection = document.getElementById('billing-details-section')
        if (billingSection) {
          billingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 50)
  }

  const validateForm = (details = billingDetails) => {
    const result = validateBillingDetails(details)

    setFormErrors(result.errors)

    if (!result.isValid) {
      setError('Please fill in all required billing details before proceeding.')
      scrollToFirstError(result.errors)
      return false
    }

    return true
  }

  const handleApplyCoupon = async () => {
    if (!coupon) return
    if (hasFreeItem) {
      setCouponError('Coupons cannot be applied to orders containing free items')
      return
    }
    setLoading(true)
    const result = await validateCoupon(
      coupon,
      user?.id || null,
      currency === 'USD'
        ? itemsWithPrices.map(item => ({ id: item.id, price: item.numericPrice }))
        : items.map(item => ({ id: item.id, price: item.price }))
    )
    if (result.success) {
      setDiscount(result.discountPercent || 0)
      setApplicableItems(result.applicableItems || null)
      setCouponError('')
    } else {
      setCouponError(result.message || 'Invalid coupon')
      setDiscount(0)
      setApplicableItems(null)
    }
    setLoading(false)
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCashfreeCheckout = async () => {
    if (!user) {
      router.push('/auth?next=/checkout')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    // Free checkout bypass
    if (activeTotal === 0) {
      return handleCheckout()
    }

    try {
      // Save pending checkout state to sessionStorage for redirect fallback
      const pendingState = {
        items: items.map(i => ({ id: i.id, type: i.type })),
        couponCode: discount > 0 ? coupon : undefined,
        billingDetails,
        userId: user.id
      }
      sessionStorage.setItem('pending_cf_checkout', JSON.stringify(pendingState))

      // 1. Create order on server with 15-second timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      let res: Response
      try {
        res = await fetch('/api/cashfree/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            items: items.map(i => ({ id: i.id, type: i.type })),
            couponCode: discount > 0 ? coupon : undefined,
            billingDetails
          })
        })
      } finally {
        clearTimeout(timeoutId)
      }

      const orderData = await res.json()
      if (!res.ok || orderData.error) {
        if (res.status === 400) {
          setError(orderData.error || 'Please enter valid billing details.')
          if (orderData.fieldErrors) {
            setFormErrors(orderData.fieldErrors)
            scrollToFirstError(orderData.fieldErrors)
          }
          setLoading(false)
          return
        }
        console.warn('[CASHFREE_ORDER_FAILED_AUTO_FALLBACK]', orderData?.error)
        return handleCheckout()
      }

      // 2. Load official Cashfree SDK v3
      const CashfreeSDK = await loadCashfreeSDK()
      if (!CashfreeSDK) {
        console.warn('[CASHFREE_SDK_UNAVAILABLE_AUTO_FALLBACK]')
        return handleCheckout()
      }

      const cashfree = CashfreeSDK({
        mode: 'production'
      })

      // 3. Trigger seamless modal checkout
      setLoading(false)

      const checkoutResult = await cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: '_modal'
      })

      if (checkoutResult?.error) {
        console.log('[PAYMENT_MODAL_DISMISSED_OR_ERROR]', checkoutResult.error)
        setLoading(false)
        return
      }

      if (checkoutResult?.redirect) {
        return
      }

      // 4. Verify payment with server directly
      setPaymentStatus('processing')
      setLoading(true)
      const verifyRes = await fetch('/api/cashfree/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.order_id,
          items: items.map(i => ({ id: i.id, type: i.type })),
          userId: user.id,
          billingDetails,
          couponCode: discount > 0 ? coupon : undefined
        })
      })

      const verifyData = await verifyRes.json()

      if (verifyData.success) {
        // Background profile sync (non-blocking for instant UI feedback)
        supabase.auth.updateUser({
          data: {
            full_name: billingDetails.fullName,
            phone: billingDetails.phone,
            address: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zip: billingDetails.zip,
            country: billingDetails.country
          }
        }).catch(e => console.error('Background user profile sync error:', e))

        Promise.resolve(
          supabase
            .from('user_accounts')
            .update({ newsletter: newsletterOptIn })
            .eq('user_id', user.id)
        ).catch(e => console.error('Background newsletter update error:', e))

        const targetOrderId = verifyData.orderId || orderData.order_id
        handleOrderSuccess(targetOrderId, false, items)
        return
      } else {
        setError(verifyData.error || 'Payment was not confirmed. If money was deducted, contact support.')
        setPaymentStatus('idle')
        setLoading(false)
      }
    } catch (err: any) {
      console.warn('[CASHFREE_ERROR_AUTO_FALLBACK_TO_RAZORPAY]', err)
      // Automatic silent fallback without user noticing
      return handleCheckout()
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth?next=/checkout')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    // --- 1. HANDLE FREE CHECKOUT (BYPASS RAZORPAY) ---
    if (activeTotal === 0) {
      const validation = validateBillingDetails(billingDetails)
      if (!validation.isValid) {
        setFormErrors(validation.errors)
        scrollToFirstError(validation.errors)
        setError('Please fill in all required billing details to claim your free order.')
        setLoading(false)
        return
      }

      setIsOrderComplete(true)
      try {
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isFree: true,
            items: items.map(i => ({ id: i.id, type: i.type })),
            userId: user.id,
            billingDetails: validation.sanitized,
            couponCode: discount > 0 ? coupon : undefined
          }),
        })

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json()
          try {
            await supabase
              .from('user_accounts')
              .update({ newsletter: newsletterOptIn })
              .eq('user_id', user.id)
          } catch (e) {
            console.error('Failed to update newsletter status:', e)
          }
          const targetOrderId = verifyData.orderId || `SW_FREE_${Date.now()}`
          handleOrderSuccess(targetOrderId, true, items)
          return
        } else {
          setIsOrderComplete(false)
          setDispatchStage('idle')
          const err = await verifyRes.json()
          setError(err.error || 'Checkout failed')
        }
      } catch (err) {
        setIsOrderComplete(false)
        setDispatchStage('idle')
        setError('Network error during checkout')
      } finally {
        setLoading(false)
      }
      return

    }

    // --- 2. REGULAR PAID CHECKOUT ---
    const sdkLoaded = await loadRazorpay()
    if (!sdkLoaded) {
      setError('Razorpay SDK failed to load')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, type: i.type })),
          couponCode: discount > 0 ? coupon : undefined,
          billingDetails
        }),
      })
      const order = await res.json()

      if (!res.ok || order.error) {
        if (order.fieldErrors) {
          setFormErrors(order.fieldErrors)
          scrollToFirstError(order.fieldErrors)
        }
        throw new Error(order.error || 'Failed to initialize payment')
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!keyId) throw new Error('Razorpay Key ID is missing')

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Sampleswala",
        description: `Checkout ${itemCount} items`,
        order_id: order.id,
        prefill: {
          name: billingDetails.fullName,
          email: user?.email || '',
          contact: billingDetails.phone
        },
        handler: async function (response: any) {
          setPaymentStatus('processing')
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                items: items.map(i => ({ id: i.id, type: i.type })),
                userId: user.id,
                billingDetails: billingDetails,
                couponCode: discount > 0 ? coupon : undefined
              }),
            })
            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // Sync billing details to DB metadata
              await supabase.auth.updateUser({
                data: {
                  full_name: billingDetails.fullName,
                  phone: billingDetails.phone,
                  address: billingDetails.address,
                  city: billingDetails.city,
                  state: billingDetails.state,
                  zip: billingDetails.zip,
                  country: billingDetails.country
                }
              })

              try {
                await supabase
                  .from('user_accounts')
                  .update({ newsletter: newsletterOptIn })
                  .eq('user_id', user.id)
              } catch (e) {
                console.error('Failed to update newsletter status:', e)
              }

              const targetOrderId = verifyData.orderId || response.razorpay_order_id
              handleOrderSuccess(targetOrderId, false, items)
              return
            } else {
              setError('Verification failed')
              setPaymentStatus('idle')
            }
          } catch (err) {
            setError('Payment verification error')
            setPaymentStatus('idle')
          }
        },
        theme: { color: "#FFC800" },
        modal: {
          ondismiss: function () {
            setLoading(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e: any) {
      setError(e.message || 'Payment initiation failed')
      setLoading(false)
    }
  }

  // --- UNIFIED CONTINUOUS DELIVERY WINDOW (Verification -> Telemetry -> Arrival -> Unbox) ---
  if (paymentStatus === 'processing' || isVerifyingRedirect || isOrderComplete || completedOrder) {
    const isReadyToUnbox = dispatchStage === 'delivered' && Boolean(completedOrder)
    const targetOrderId = completedOrder?.orderId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cf_order_id') || 'SW-CONFIRMED' : 'SW-CONFIRMED')
    const isFreeOrder = completedOrder?.isFree || targetOrderId.startsWith('SW_FREE') || targetOrderId.startsWith('SW_PAY_FREE')

    return (
      <div className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-center items-center px-4 py-6 sm:py-8 relative overflow-hidden select-none">
        {/* Studio Dot Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2a2a30_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30" />

        {/* Ambient Studio Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#00FF94]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-[#FFE600]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand Logo at Top */}
        <div className="relative z-10 mb-2">
          <Link href="/" className="inline-flex items-center group">
            <span className="text-lg sm:text-xl font-black uppercase tracking-tight font-mono text-white group-hover:text-[#FFE600] transition-colors">
              SAMPLES<span className="text-white/40">WALA</span>
            </span>
          </Link>
        </div>

        {/* HERO ANIMATION WINDOW (Pure, clean, cinematic - no clutter) */}
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto relative z-10">
          <DeliveryCarAnimation
            mode={isReadyToUnbox ? 'return' : 'drive'}
            onParcelClick={handleUnboxAndDownload}
            isParcelOpened={isParcelOpened}
            isDownloading={isDownloading}
            progress={dispatchProgress}
          />
        </div>

        {/* ALL STATUS & ACTIONS SIT NICHE (BELOW THE ANIMATION) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto text-center relative z-10 space-y-3 pt-2">
          {!isReadyToUnbox ? (
            /* --- DISPATCHING / VERIFICATION STATUS (NICHE) --- */
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-white font-mono flex items-center justify-center gap-2">
                <span>PREPARING YOUR SOUND VAULT...</span>
              </h2>

              <p className="text-xs font-mono uppercase tracking-widest text-[#00FF94] flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF94] animate-ping" />
                <span>Locking in your 24-bit audio tokens...</span>
              </p>

              {/* Sleek Live Telemetry Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[10.5px] font-mono text-white/50 mb-1.5 font-bold">
                  <span>TELEMETRY: SECURING MASTER AUDIO STEMS</span>
                  <span className="text-[#FFE600]">{Math.min(100, Math.round(dispatchProgress))}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/80 rounded-full border border-white/20 p-0.5 overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFE600] via-[#00FF94] to-[#00E5FF] rounded-full transition-all duration-200 shadow-[0_0_10px_#00FF94]"
                    style={{ width: `${Math.min(100, Math.max(15, dispatchProgress))}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider pt-1">
                Please wait a moment while your hypercar delivers your audio
              </p>
            </div>
          ) : (
            /* --- UNBOXING & ORDER CONFIRMATION (NICHE) --- */
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-mono">
                  {isFreeOrder ? 'FREE SOUNDS READY' : 'ORDER CONFIRMED'}
                </h2>
                <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                  {!isParcelOpened ? 'Tap the crate to unbox & download your sounds' : ''}
                </p>
              </div>

              {/* Unbox Status Indicator */}
              {isParcelOpened && (
                <div className="flex flex-col items-center gap-1.5 text-center">
                  {isDownloading ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-white border border-white/20 font-mono text-xs uppercase rounded-xs">
                      <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-ping" />
                      <span>DOWNLOADING 24-BIT AUDIO MASTER...</span>
                    </div>
                  ) : downloadSuccess ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00FF94]/20 text-[#00FF94] border border-[#00FF94]/40 font-mono text-xs uppercase rounded-xs">
                      <span>DOWNLOAD STARTED! ENJOY YOUR SOUNDS 🎵</span>
                    </div>
                  ) : downloadError ? (
                    <button
                      onClick={handleUnboxAndDownload}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-xs uppercase rounded-xs cursor-pointer hover:bg-red-500/30"
                    >
                      <span>DOWNLOAD BLOCKED? TAP TO RETRY ↺</span>
                    </button>
                  ) : null}
                </div>
              )}

              {/* Order ID & Vault Access */}
              <div className="pt-2 flex flex-col items-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xs text-[11px] font-mono text-white/60">
                  <span>ORDER ID:</span>
                  <span className="text-white font-bold">{targetOrderId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(targetOrderId)
                      setCopiedOrderId(true)
                      setTimeout(() => setCopiedOrderId(false), 2000)
                    }}
                    className="hover:text-white transition-colors cursor-pointer ml-1"
                  >
                    {copiedOrderId ? <Check size={12} className="text-[#00FF94]" /> : <Copy size={12} />}
                  </button>
                </div>

                <Link
                  href="/library"
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest border border-white/20 hover:border-white/40 transition-all rounded-xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  GO TO LIBRARY →
                </Link>

                <button
                  onClick={() => {
                    setIsParcelOpened(false)
                    setIsDownloading(false)
                    setDispatchStage('idle')
                    setDispatchProgress(15)
                    setTimeout(() => setDispatchStage('dispatching'), 100)
                  }}
                  className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>REPLAY ARRIVAL</span>
                  <span>↺</span>
                </button>

                <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider pt-2">
                  Need help? Contact{' '}
                  <a href="mailto:support@sampleswala.com" className="text-white/50 hover:text-white underline">
                    support@sampleswala.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <ShoppingBag size={64} className="text-white/10" />
        <h1 className="text-3xl font-black uppercase tracking-tighter">Your Cart is Empty</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest">Find some sounds to get started</p>
        <Link href="/browse" className="px-8 py-4 border border-white/10 hover:border-studio-yellow transition-all uppercase text-[10px] font-black tracking-widest">
          Browse Library
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <div className="container mx-auto max-w-5xl px-4 pt-8 pb-24 relative z-10">
        {/* Minimal Clean Checkout Top Bar (Distraction-Free) */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10 select-none">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/50 hover:text-[#FFE600] transition-colors"
          >
            <span>←</span>
            <span>BACK TO STORE</span>
          </Link>

          <Link href="/" className="inline-flex items-center group">
            <span className="text-lg font-black uppercase tracking-tight font-mono text-white group-hover:text-[#FFE600] transition-colors">
              SAMPLES<span className="text-white/40">WALA</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-[10.5px] font-mono font-black uppercase tracking-widest text-[#00FF94]">
            <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
            <span className="hidden sm:inline">256-BIT ENCRYPTED</span>
          </div>
        </div>

        {/* Graffiti Branded Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic text-white graffiti-title-text">
            Checkout
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-2.5 select-none">
            <Image
              src="/icons8-secure-48.png"
              alt="Secure"
              width={12}
              height={12}
              className="object-contain shrink-0 animate-pulse"
            />
            <p className="text-[9.5px] text-studio-yellow font-black uppercase tracking-[0.2em] leading-relaxed">
              SECURE CHECKOUT &amp; INSTANT DELIVERY
            </p>
          </div>
        </div>

        {/* Cinematic Sound-Scanner & Checkout Conveyor Belt Divider */}
        <div className="mb-12 border-2 border-black rounded-sm shadow-[6px_6px_0px_#FFE600] overflow-hidden relative z-20">
          {/* Tri-color platform stripe */}
          <div className="h-1 bg-[#1e1e24]" />
          <div className="flex h-[3px]">
            <div className="flex-1 bg-studio-yellow" />
            <div className="flex-1 bg-studio-blue" />
            <div className="flex-1 bg-studio-neon" />
          </div>

          <CheckoutConveyor />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (Review Items & Billing Details) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cart Items List */}
            <div className="border-2 border-black bg-[#121212] p-5 md:p-6 rounded-sm shadow-[6px_6px_0px_#0074e4] space-y-4">
              <div className="flex items-center gap-2 border-b border-black pb-4">
                <span className="w-1.5 h-3 bg-studio-blue rounded-xs shadow-[0_0_10px_#0074e4]" />
                <h2 className="text-sm font-black uppercase tracking-tight italic text-white">Review Items</h2>
              </div>
              <div className="divide-y divide-neutral-900">
                {itemsWithPrices.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-12 h-12 relative rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                      <Image src={item.cover_url || '/placeholder.jpg'} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold uppercase text-xs truncate text-white">{item.name}</h3>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                        {item.type === 'preset' ? 'Preset' : 'Sample Pack'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-right flex-shrink-0">
                      <p className="font-black text-xs text-neutral-200">{item.displayPrice}</p>
                      <button onClick={() => removeItem(item.id)} className="text-neutral-500 hover:text-white p-1 cursor-pointer transition-colors duration-150">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link href="/browse" className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-white transition-colors">
                  <ArrowRight size={11} className="rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Billing Details Section */}
            <div id="billing-details-section" className="space-y-6">
              <div className="border-2 border-black bg-[#121212] p-5 md:p-6 rounded-sm shadow-[6px_6px_0px_#FFE600] space-y-6">
                <div className="flex items-center justify-between border-b border-black pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-studio-yellow rounded-xs shadow-[0_0_10px_#FFE600]" />
                    <h2 className="text-sm font-black uppercase tracking-tight italic text-white">Billing Details</h2>
                  </div>
                  <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider bg-black/40 px-2 py-0.5 border border-white/5 rounded-xs">
                    {Object.keys(formErrors).length > 0 ? 'Action Required' : 'Required for all orders'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Full Name *</label>
                    <input
                      id="billing-input-fullName"
                      type="text"
                      placeholder="ENTER FULL NAME"
                      className={`w-full h-10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 border ${formErrors.fullName ? 'border-studio-red ring-1 ring-studio-red bg-studio-red/10' : 'border-white/10 bg-[#18181c]'}`}
                      value={billingDetails.fullName}
                      onChange={(e) => handleBillingChange('fullName', e.target.value)}
                    />
                    {formErrors.fullName && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.fullName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Phone Number *</label>
                    <div id="billing-input-phone" className="phone-input-container">
                      <PhoneInput
                        international
                        country={currentCountryCode as any}
                        countrySelectComponent={CustomCountrySelect}
                        onCountryChange={(countryCode) => {
                          if (countryCode) {
                            const option = countryOptions.find(opt => opt.value === countryCode)
                            if (option && billingDetails.country.toLowerCase() !== option.label.toLowerCase()) {
                              handleBillingChange('country', option.label)
                            }
                          }
                        }}
                        placeholder="PHONE NUMBER"
                        value={billingDetails.phone}
                        onChange={(val) => handleBillingChange('phone', val || '')}
                        className={`w-full h-10 rounded px-3 text-xs focus-within:border-studio-yellow outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 border ${formErrors.phone ? 'border-studio-red ring-1 ring-studio-red bg-studio-red/10' : 'border-white/10 bg-[#18181c]'}`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.phone}</p>}
                  </div>
                  <div className="col-span-full space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Street Address *</label>
                    <input
                      id="billing-input-address"
                      type="text"
                      placeholder="HOUSE / FLAT NO., STREET, LOCALITY"
                      className={`w-full h-10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 border ${formErrors.address ? 'border-studio-red ring-1 ring-studio-red bg-studio-red/10' : 'border-white/10 bg-[#18181c]'}`}
                      value={billingDetails.address}
                      onChange={(e) => handleBillingChange('address', e.target.value)}
                    />
                    {formErrors.address && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.address}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">City *</label>
                    <input
                      id="billing-input-city"
                      type="text"
                      placeholder="CITY"
                      className={`w-full h-10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 border ${formErrors.city ? 'border-studio-red ring-1 ring-studio-red bg-studio-red/10' : 'border-white/10 bg-[#18181c]'}`}
                      value={billingDetails.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                    />
                    {formErrors.city && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.city}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">State *</label>
                      <input
                        id="billing-input-state"
                        type="text"
                        placeholder="STATE"
                        className={`w-full h-10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 border ${formErrors.state ? 'border-studio-red ring-1 ring-studio-red bg-studio-red/10' : 'border-white/10 bg-[#18181c]'}`}
                        value={billingDetails.state}
                        onChange={(e) => handleBillingChange('state', e.target.value)}
                      />
                      {formErrors.state && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.state}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Pincode *</label>
                      <input
                        id="billing-input-zip"
                        type="text"
                        placeholder="PINCODE / ZIP"
                        className={`w-full h-10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 border ${formErrors.zip ? 'border-studio-red ring-1 ring-studio-red bg-studio-red/10' : 'border-white/10 bg-[#18181c]'}`}
                        value={billingDetails.zip}
                        onChange={(e) => handleBillingChange('zip', e.target.value)}
                      />
                      {formErrors.zip && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.zip}</p>}
                    </div>
                  </div>

                  <div id="billing-input-country" className="col-span-full space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Country *</label>
                    <Select
                      options={countryOptions}
                      value={countryOptions.find(opt => opt.label.toLowerCase() === billingDetails.country.toLowerCase()) || null}
                      onChange={(val: any) => handleBillingChange('country', val?.label || '')}
                      onMenuOpen={() => { document.body.style.overflow = 'hidden' }}
                      onMenuClose={() => { document.body.style.overflow = '' }}
                      placeholder="SELECT COUNTRY"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: formErrors.country ? 'rgba(255, 49, 49, 0.1)' : 'rgba(0, 0, 0, 0.4)',
                          borderColor: state.isFocused ? '#FFE600' : (formErrors.country ? '#FF3131' : 'rgba(255, 255, 255, 0.1)'),
                          borderRadius: '4px',
                          height: '2.5rem',
                          minHeight: '2.5rem',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: formErrors.country ? '0 0 0 1px #FF3131' : 'none',
                          '&:hover': {
                            borderColor: state.isFocused ? '#FFE600' : (formErrors.country ? '#FF3131' : 'rgba(255, 255, 255, 0.15)'),
                          }
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: '#0d0d0d',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '4px',
                          zIndex: 50,
                        }),
                        menuList: (base) => ({
                          ...base,
                          maxHeight: '180px',
                          overflowY: 'auto',
                          '&::-webkit-scrollbar': {
                            width: '4px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          color: state.isFocused ? '#FFE600' : 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          padding: '8px 12px',
                          '&:active': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff'
                          }
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#fff'
                        }),
                        input: (base) => ({
                          ...base,
                          color: '#fff'
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'rgba(255, 255, 255, 0.25)'
                        })
                      }}
                    />
                    {formErrors.country && <p className="text-[8.5px] font-black text-studio-red uppercase tracking-widest mt-1 ml-0.5 flex items-center gap-1"><span>⚠️</span> {formErrors.country}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 px-1 opacity-70 hover:opacity-100 transition-opacity duration-200">
                  <input
                    id="checkout-newsletter"
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-transparent border border-white/20 text-studio-yellow focus:ring-0 focus:outline-none cursor-pointer accent-studio-yellow"
                  />
                  <label htmlFor="checkout-newsletter" className="text-[8.5px] font-bold text-neutral-400 tracking-wider cursor-pointer select-none leading-relaxed uppercase">
                    Email me with news, offers, free downloads and new packs. You can unsubscribe at any time.
                  </label>
                </div>

                {/* Complete Payment Button (Left side, Desktop only) */}
                {mounted && !isMobile && (
                  <div className="pt-6 border-t border-white/5 space-y-4 mt-6">
                    {error && (
                      <div className="p-3 bg-studio-red/15 border-2 border-studio-red rounded shadow-[0_0_12px_rgba(255,49,49,0.25)] flex items-center gap-2">
                        <span className="text-base shrink-0">⚠️</span>
                        <p className="text-[10px] font-black text-studio-red uppercase tracking-wider text-left leading-tight">
                          {error}
                        </p>
                      </div>
                    )}
                    {activeTotal === 0 ? (
                      <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full h-11 bg-studio-yellow hover:bg-studio-yellow-hover text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all duration-150 rounded-sm cursor-pointer border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_black] relative overflow-hidden group animate-neo-glow"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={13} />
                        ) : (
                          <>
                            <div className="group-hover:animate-wiggle-fast transition-transform shrink-0">
                              <Image
                                src="/icons8-pay-96.png"
                                alt="Pay"
                                width={14}
                                height={14}
                                className="object-contain"
                              />
                            </div>
                            <span>Get Free</span>
                            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-sweep" />
                            </div>
                          </>
                        )}
                      </button>
                    ) : currency === 'USD' ? (
                      <div>
                        {!paypalLoaded && (
                          <div className="w-full h-11 bg-neutral-900/40 border border-white/10 rounded flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                            Loading PayPal...
                          </div>
                        )}
                        <div
                          id="paypal-button-container"
                          className={`w-full relative z-10 ${!paypalLoaded ? 'hidden' : ''}`}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={handleCashfreeCheckout}
                        disabled={loading}
                        className="w-full h-12 bg-studio-yellow hover:bg-studio-yellow-hover text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all duration-150 rounded-sm cursor-pointer border-2 border-black shadow-[4px_4px_0px_#FF0080] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FF0080] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_black] relative overflow-hidden group animate-neo-glow"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={14} />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <>
                            <Zap size={14} className="fill-black animate-pulse" />
                            <span>Pay — ₹{total - activeCouponDiscount}</span>
                            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-sweep" />
                            </div>
                          </>
                        )}
                      </button>
                    )}
                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest text-center mt-2 leading-relaxed select-none">
                      By purchasing, you agree to our{' '}
                      <Link href="/terms" className="text-studio-yellow hover:underline">Terms &amp; Conditions</Link>
                      {' '}and{' '}
                      <Link href="/refund-policy" className="text-studio-yellow hover:underline">Refund Policy</Link>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-2 border-black bg-[#121212] p-5 md:p-6 rounded-sm shadow-[6px_6px_0px_#00FF94] space-y-6">
              <div className="flex items-center gap-2 border-b border-black pb-4">
                <span className="w-1.5 h-3 bg-studio-neon rounded-xs shadow-[0_0_10px_#00FF94]" />
                <h2 className="text-sm font-black uppercase tracking-tight italic text-white">Order Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span ref={subtotalRef}>{currency === 'USD' ? `$${activeSubtotal.toFixed(2)}` : `₹${total}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider text-studio-neon">
                    <span>Discount ({discount}%)</span>
                    <span>-{currency === 'USD' ? `$${activeCouponDiscount.toFixed(2)}` : `₹${activeCouponDiscount}`}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Total</span>
                  <span ref={totalRef} className="text-2xl font-black text-studio-yellow italic tracking-wide">{currency === 'USD' ? `$${activeTotal.toFixed(2)}` : `₹${total - activeCouponDiscount}`}</span>
                </div>
              </div>

              {/* Coupon Input */}
              {hasFreeItem ? (
                <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-left">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">
                    {activeSubtotal === 0 ? "Free Order — No payment or coupon required" : "Coupons are not applicable for orders containing free items"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="COUPON"
                      className="flex-grow h-9 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus:border-studio-neon focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading}
                      className="px-4 bg-white hover:bg-neutral-200 text-black text-[10px] font-black uppercase tracking-wider rounded-sm border border-black shadow-[2px_2px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_black] transition-all disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{couponError}</p>}
                  {discount > 0 && <p className="text-[8px] font-bold text-studio-neon uppercase tracking-widest mt-1 ml-0.5">Coupon Applied Successfully!</p>}
                </div>
              )}

              {/* Pre-order warning notice */}
              {hasPreorder && (
                <div className="p-4 border-2 border-black bg-[#121214] text-left space-y-2.5 shadow-[5px_5px_0px_#FFE600] relative overflow-hidden group hover:shadow-[7px_7px_0px_#FFE600] transition-all">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FFE600] border-2 border-black p-1 text-black flex items-center justify-center">
                      <Clock size={12} className="animate-pulse" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#FFE600]">Pre-order Notice</span>
                  </div>
                  <p className="text-[8.5px] text-white/90 font-extrabold uppercase tracking-wider leading-relaxed">
                    Some items in your cart are <span className="text-[#FFE600] underline decoration-1 decoration-black">pre-orders</span>. Sound packs are live-recorded or highly production-intensive.
                  </p>
                  <p className="text-[8px] text-white/45 font-bold uppercase tracking-wider leading-relaxed">
                    🚀 It might take <span className="text-white font-black underline decoration-1 decoration-[#FFE600]">1-2 months to deliver</span>. Once available, we will notify you via email.
                  </p>
                </div>
              )}

            </div>

            {/* Minimalistic Supported Payments Logos */}
            <div className="pt-4 space-y-4.5">
              <div className="flex items-center justify-center gap-2.5 opacity-65 select-none">
                <Image
                  src="/icons8-payment-100 (1).png"
                  alt="Payment Methods"
                  width={11}
                  height={11}
                  className="object-contain shrink-0 animate-pulse"
                />
                <p className="text-[7.5px] font-black uppercase tracking-[0.12em] text-neutral-400 leading-relaxed">
                  WE ACCEPT DOMESTIC &amp; INTERNATIONAL PAYMENTS
                </p>
              </div>
              <PaymentAccepted variant="compact" className="opacity-70 hover:opacity-100 transition-opacity duration-300 justify-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Complete Payment Bar (Mobile only) */}
      {mounted && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-md border-t border-white/10 z-50">
          <div className="max-w-md mx-auto">
            {error && (
              <div className="mb-2 p-2.5 bg-studio-red/15 border-2 border-studio-red rounded shadow-[0_0_12px_rgba(255,49,49,0.25)] flex items-center gap-2">
                <span className="text-sm shrink-0">⚠️</span>
                <p className="text-[9.5px] font-black text-studio-red uppercase tracking-wider text-left leading-tight">
                  {error}
                </p>
              </div>
            )}
            {activeTotal === 0 ? (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full h-11 bg-studio-yellow hover:bg-studio-yellow-hover text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all duration-150 rounded-sm cursor-pointer border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_black] relative overflow-hidden group animate-neo-glow"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={13} />
                ) : (
                  <>
                    <div className="group-hover:animate-wiggle-fast transition-transform shrink-0">
                      <Image
                        src="/icons8-pay-96.png"
                        alt="Pay"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </div>
                    <span>Get Free</span>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                      <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-sweep" />
                    </div>
                  </>
                )}
              </button>
            ) : currency === 'USD' ? (
              <div>
                {!paypalLoaded && (
                  <div className="w-full h-11 bg-neutral-900/40 border border-white/10 rounded flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    Loading PayPal...
                  </div>
                )}
                <div
                  id="paypal-button-container"
                  className={`w-full relative z-10 ${!paypalLoaded ? 'hidden' : ''}`}
                />
              </div>
            ) : (
              <button
                onClick={handleCashfreeCheckout}
                disabled={loading}
                className="w-full h-11 bg-studio-yellow hover:bg-studio-yellow-hover text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all duration-150 rounded-sm cursor-pointer border-2 border-black shadow-[4px_4px_0px_#FF0080] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FF0080] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_black] relative overflow-hidden group animate-neo-glow"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={13} />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <Zap size={14} className="fill-black shrink-0" />
                    <span>Pay — ₹{total - activeCouponDiscount}</span>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                      <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-sweep" />
                    </div>
                  </>
                )}
              </button>
            )}
            <p className="text-[7.5px] font-black text-neutral-500 uppercase tracking-widest text-center mt-3 leading-relaxed select-none">
              By purchasing, you agree to our{' '}
              <Link href="/terms" className="text-studio-yellow hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/refund-policy" className="text-studio-yellow hover:underline">Refund Policy</Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
