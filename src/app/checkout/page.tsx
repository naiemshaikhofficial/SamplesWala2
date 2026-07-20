'use client'
import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Tag, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Zap, PartyPopper, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { validateCoupon } from './actions'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/Header'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useCurrency } from '@/context/CurrencyContext'
import { PaymentAccepted } from '@/components/ui/PaymentAccepted'
import dynamic from 'next/dynamic'

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

  const rawSubtotalUsd = itemsWithPrices.reduce((sum, item) => sum + item.numericPrice, 0)
  const bundleDiscountUsd = items.length >= 3 ? Number((rawSubtotalUsd * 0.1).toFixed(2)) : 0
  const activeSubtotal = currency === 'USD' ? Number((rawSubtotalUsd - bundleDiscountUsd).toFixed(2)) : total

  let activeCouponDiscount = 0
  if (discount > 0) {
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
    if (currency === 'USD' && activeTotal > 0 && user) {
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
  }, [currency, activeTotal, user])

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
          createOrder: async function (data: any, actions: any) {
            setError('')
            setLoading(true)

            if (!validateForm()) {
              setLoading(false)
              const billingSection = document.getElementById('billing-details-section')
              if (billingSection) {
                billingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              throw new Error('Please fill in all billing details.')
            }

            try {
              const res = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: items.map(i => ({ id: i.id, type: i.type })),
                  couponCode: discountRef.current > 0 ? couponRef.current : undefined
                })
              })
              const order = await res.json()
              if (order.error) {
                throw new Error(order.error)
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

                setPaymentStatus('success')
                clearCart()
                router.push('/library')
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
    const updated = { ...billingDetails, [field]: value }
    setBillingDetails(updated)
    localStorage.setItem('billing_details', JSON.stringify(updated))

    // Clear error for this field as user types
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!billingDetails.fullName.trim()) errors.fullName = 'FULL NAME IS REQUIRED'

    if (!billingDetails.phone) {
      errors.phone = 'PHONE NUMBER IS REQUIRED'
    } else if (billingDetails.phone.length < 5) {
      errors.phone = 'ENTER A VALID PHONE NUMBER'
    }

    if (!billingDetails.address.trim()) errors.address = 'STREET ADDRESS IS REQUIRED'
    if (!billingDetails.city.trim()) errors.city = 'CITY IS REQUIRED'
    if (!billingDetails.state.trim()) errors.state = 'STATE IS REQUIRED'

    const cleanZip = billingDetails.zip.trim()
    if (!cleanZip) {
      errors.zip = 'POSTAL CODE IS REQUIRED'
    } else if (billingDetails.country === 'India' && !/^\d{6}$/.test(cleanZip)) {
      errors.zip = 'ENTER A VALID 6-DIGIT PINCODE'
    }

    if (!billingDetails.country) errors.country = 'COUNTRY IS REQUIRED'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApplyCoupon = async () => {
    if (!coupon) return
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

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth?next=/checkout')
      return
    }

    if (!validateForm()) {
      const billingSection = document.getElementById('billing-details-section')
      if (billingSection) {
        billingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    setLoading(true)     // --- 1. HANDLE FREE CHECKOUT (BYPASS RAZORPAY) ---
    if (activeTotal === 0) {
      try {
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isFree: true,
            items: items.map(i => ({ id: i.id, type: i.type })),
            userId: user.id,
            billingDetails: billingDetails,
            couponCode: discount > 0 ? coupon : undefined
          }),
        })

        if (verifyRes.ok) {
          try {
            await supabase
              .from('user_accounts')
              .update({ newsletter: newsletterOptIn })
              .eq('user_id', user.id)
          } catch (e) {
            console.error('Failed to update newsletter status:', e)
          }
          clearCart()
          router.push('/library?success=true')
        } else {
          const err = await verifyRes.json()
          setError(err.error || 'Checkout failed')
        }
      } catch (err) {
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
          couponCode: discount > 0 ? coupon : undefined
        }),
      })
      const order = await res.json()

      if (order.error) throw new Error(order.error)

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

              setPaymentStatus('success')
              clearCart()
              router.push('/library')
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

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4 relative z-10">
        <ConfettiEffect />

        <div className="relative mb-4 flex items-center justify-center">
          {/* Animated Glow Backdrops */}
          <div className="absolute w-32 h-32 bg-[#FFC800]/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute w-24 h-24 bg-[#FF0080]/10 rounded-full blur-xl animate-pulse delay-75" />

          {/* Left Popper */}
          <div className="absolute -left-12 top-2 text-[#FF0080] animate-bounce-slow -rotate-12">
            <PartyPopper size={36} className="drop-shadow-[0_0_15px_#FF0080]" />
          </div>

          {/* Right Popper */}
          <div className="absolute -right-12 top-2 text-[#00BFFF] animate-bounce-slow rotate-12 [animation-delay:0.5s]">
            <PartyPopper size={36} className="drop-shadow-[0_0_15px_#00BFFF]" />
          </div>

          {/* Center Branded Comic Badge */}
          <div className="relative w-24 h-24 bg-black border-4 border-[#FFC800] flex items-center justify-center text-[#FFC800] shadow-[8px_8px_0px_#FF0080] animate-comic-pop rounded-md">
            <PartyPopper size={48} className="animate-wiggle" />

            {/* Comic Floating 🎉 bubble */}
            <div className="absolute -top-3 -right-3 bg-[#FF5C00] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs border border-white rotate-12 shadow-sm animate-bounce">
              BOOM!
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Payment Successful!
          </h1>
          <p className="text-white/80 font-black uppercase tracking-widest text-xs max-w-md mx-auto">
            Your sounds are being added to your library...
          </p>
        </div>

        <div className="max-w-md w-full p-8 bg-black/95 backdrop-blur-xl border border-white/10 rounded-sm space-y-4 my-4 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio-yellow/10 border border-studio-yellow/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-studio-yellow animate-pulse" />
            <span className="text-[9px] font-black text-studio-yellow uppercase tracking-widest">INVOICE & ORDER EMAIL SENT</span>
          </div>

          <p className="text-xs text-white font-bold uppercase tracking-wider leading-relaxed">
            An order confirmation and tax invoice have been sent to your email. Please check your inbox (and spam folder) to verify the details.
          </p>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider leading-relaxed">
              ℹ️ You can also find your Invoice and License details inside your{' '}
              <Link href="/library" className="text-[#FFC800] hover:text-white transition-colors underline font-black">
                Vault / Library
              </Link>{' '}
              at any time.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link href="/library" className="px-10 py-4 bg-[#FFC800] text-black font-black uppercase text-xs tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,200,0,0.2)]">
            Go to Library
          </Link>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-2">
            Need help? Contact support at{' '}
            <a href="mailto:support@sampleswala.com" className="text-[#FFC800] hover:text-white transition-colors underline">
              support@sampleswala.com
            </a>
          </p>
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
      <div className="container mx-auto max-w-5xl px-4 pt-16 pb-24 relative z-10">
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
                    {Object.keys(formErrors).length > 0 ? 'Action Required' : 'Auto-Saved'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="NAME"
                      className={`w-full h-10 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 ${formErrors.fullName ? 'border-studio-red bg-studio-red/5' : ''}`}
                      value={billingDetails.fullName}
                      onChange={(e) => handleBillingChange('fullName', e.target.value)}
                    />
                    {formErrors.fullName && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.fullName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Phone Number</label>
                    <div className="phone-input-container">
                      <PhoneInput
                        international
                        defaultCountry={currency === 'USD' ? undefined : 'IN'}
                        placeholder="PHONE"
                        value={billingDetails.phone}
                        onChange={(val) => handleBillingChange('phone', val || '')}
                        className={`w-full h-10 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus-within:border-studio-yellow outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 ${formErrors.phone ? 'border-studio-red bg-studio-red/5' : ''}`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.phone}</p>}
                  </div>
                  <div className="col-span-full space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Address</label>
                    <input
                      type="text"
                      placeholder="STREET ADDRESS"
                      className={`w-full h-10 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 ${formErrors.address ? 'border-studio-red bg-studio-red/5' : ''}`}
                      value={billingDetails.address}
                      onChange={(e) => handleBillingChange('address', e.target.value)}
                    />
                    {formErrors.address && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.address}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">City</label>
                    <input
                      type="text"
                      placeholder="CITY"
                      className={`w-full h-10 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 ${formErrors.city ? 'border-studio-red bg-studio-red/5' : ''}`}
                      value={billingDetails.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                    />
                    {formErrors.city && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.city}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">State</label>
                      <input
                        type="text"
                        placeholder="STATE"
                        className={`w-full h-10 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 ${formErrors.state ? 'border-studio-red bg-studio-red/5' : ''}`}
                        value={billingDetails.state}
                        onChange={(e) => handleBillingChange('state', e.target.value)}
                      />
                      {formErrors.state && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.state}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Pincode</label>
                      <input
                        type="text"
                        placeholder="ZIP"
                        className={`w-full h-10 bg-[#18181c] border border-white/10 rounded px-3 text-xs focus:border-studio-yellow focus:ring-0 outline-none transition-all duration-150 uppercase tracking-wider text-white placeholder-neutral-700 ${formErrors.zip ? 'border-studio-red bg-studio-red/5' : ''}`}
                        value={billingDetails.zip}
                        onChange={(e) => handleBillingChange('zip', e.target.value)}
                      />
                      {formErrors.zip && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.zip}</p>}
                    </div>
                  </div>

                  <div className="col-span-full space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/55 block ml-0.5">Country</label>
                    <Select
                      options={countryOptions}
                      value={countryOptions.find(opt => opt.label === billingDetails.country)}
                      onChange={(val: any) => handleBillingChange('country', val?.label || '')}
                      placeholder="SELECT COUNTRY"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          borderColor: state.isFocused ? '#FFE600' : (formErrors.country ? '#FF3131' : 'rgba(255, 255, 255, 0.1)'),
                          borderRadius: '4px',
                          height: '2.5rem',
                          minHeight: '2.5rem',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: state.isFocused ? '#FFE600' : 'rgba(255, 255, 255, 0.15)',
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
                    {formErrors.country && <p className="text-[8px] font-bold text-studio-red uppercase tracking-widest mt-1 ml-0.5">{formErrors.country}</p>}
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
                      <div className="p-3 bg-studio-red/10 border border-studio-red/20 rounded">
                        <p className="text-[9px] font-bold text-studio-red uppercase tracking-wider text-center">
                          {error}
                        </p>
                      </div>
                    )}
                    {currency === 'USD' && activeTotal > 0 ? (
                      <div>
                        {!paypalLoaded && (
                          <div className="w-full h-11 bg-neutral-900/40 border border-white/10 rounded flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                            Loading PayPal...
                          </div>
                        )}
                        <div
                          id="paypal-button-container"
                          className={`w-full mt-2 relative z-10 ${!paypalLoaded ? 'hidden' : ''}`}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={handleCheckout}
                        disabled={loading || paymentStatus === 'processing'}
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
                            <span>{activeTotal === 0 ? 'Get Free' : 'Complete Payment'}</span>
                            {/* Glassmorphism shine sweep animation */}
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
              <div className="mb-2 p-2 bg-studio-red/10 border border-studio-red/20 rounded">
                <p className="text-[9px] font-bold text-studio-red uppercase tracking-wider text-center">
                  {error}
                </p>
              </div>
            )}
            {currency === 'USD' && activeTotal > 0 ? (
              <div>
                {!paypalLoaded && (
                  <div className="w-full h-11 bg-neutral-900/40 border border-white/10 rounded flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    Loading PayPal...
                  </div>
                )}
                <div
                  id="paypal-button-container"
                  className={`w-full mt-2 relative z-10 ${!paypalLoaded ? 'hidden' : ''}`}
                />
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading || paymentStatus === 'processing'}
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
                    <span>{activeTotal === 0 ? 'Get Free' : `Complete Payment — ${currency === 'USD' ? `$${activeTotal.toFixed(2)}` : `₹${total - activeCouponDiscount}`}`}</span>
                    {/* Glassmorphism shine sweep animation */}
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
