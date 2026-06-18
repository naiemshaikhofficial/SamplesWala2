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
      `}</style>
    </div>
  );
};

export default function CheckoutPage() {
  const countryOptions = React.useMemo(() => countryList().getData(), [])
  const { items, removeItem, total, clearCart, itemCount, setSidebarOpen } = useCart()
  const { currency, symbol, formatPrice } = useCurrency()
  const hasPreorder = items.some(item => item.type === 'pack' && item.is_downloadable === false)

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
  const [newsletterOptIn, setNewsletterOptIn] = useState(true)
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
          createOrder: async function(data: any, actions: any) {
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
          onApprove: async function(data: any, actions: any) {
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
          onError: function(err: any) {
            console.error('[PAYPAL_BUTTON_ERROR]', err)
            setError('An error occurred during the PayPal transaction.')
            setLoading(false)
          },
          onCancel: function() {
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MusicalNotesBackground />

      <div className="container mx-auto px-4 pt-20 pb-32 lg:pb-20 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="h-1 bg-studio-yellow w-24 mb-6 shadow-[0_0_20px_#FFC800]" />
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            SECURE <span className="text-studio-yellow">CHECKOUT</span>
          </h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mt-4">
            Premium Assets / Digital Delivery
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {itemsWithPrices.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-sm group hover:border-white/10 transition-all">
                <div className="w-20 h-20 relative rounded-sm overflow-hidden flex-shrink-0">
                  <Image src={item.cover_url || '/placeholder.jpg'} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black uppercase tracking-tight text-lg">{item.name}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    {item.type === 'preset' ? 'Producer Preset' : 'Premium Sample Pack'}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-black text-xl">{item.displayPrice}</p>
                  <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <Link href="/browse" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white pt-4">
              <ArrowRight size={14} className="rotate-180" />
              Continue Shopping
            </Link>

            {/* Billing Address Section */}
            <div id="billing-details-section" className="pt-12 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-1 bg-studio-yellow shadow-[0_0_15px_#FFC800]" />
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Billing Details</h2>
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${Object.keys(formErrors).length > 0 ? 'text-red-500' : 'text-studio-neon'}`}>
                  {Object.keys(formErrors).length > 0 ? <ShieldCheck size={10} className="rotate-180" /> : <CheckCircle2 size={10} />}
                  {Object.keys(formErrors).length > 0 ? 'Action Required' : 'Auto-Saved'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="NAME"
                    className={`w-full h-12 bg-white/5 border rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all ${formErrors.fullName ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                    value={billingDetails.fullName}
                    onChange={(e) => handleBillingChange('fullName', e.target.value)}
                  />
                  {formErrors.fullName && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                  <div className="phone-input-container">
                    <PhoneInput
                      international
                      defaultCountry={currency === 'USD' ? undefined : 'IN'}
                      placeholder="PHONE"
                      value={billingDetails.phone}
                      onChange={(val) => handleBillingChange('phone', val || '')}
                      className={`w-full h-12 bg-white/5 border rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus-within:border-studio-yellow outline-none transition-all ${formErrors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                    />
                  </div>
                  {formErrors.phone && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.phone}</p>}
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Address</label>
                  <input
                    type="text"
                    placeholder="STREET ADDRESS"
                    className={`w-full h-12 bg-white/5 border rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all ${formErrors.address ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                    value={billingDetails.address}
                    onChange={(e) => handleBillingChange('address', e.target.value)}
                  />
                  {formErrors.address && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.address}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">City</label>
                  <input
                    type="text"
                    placeholder="CITY"
                    className={`w-full h-12 bg-white/5 border rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all ${formErrors.city ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                    value={billingDetails.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                  />
                  {formErrors.city && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.city}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">State</label>
                    <input
                      type="text"
                      placeholder="STATE"
                      className={`w-full h-12 bg-white/5 border rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all ${formErrors.state ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                      value={billingDetails.state}
                      onChange={(e) => handleBillingChange('state', e.target.value)}
                    />
                    {formErrors.state && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.state}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="ZIP"
                      className={`w-full h-12 bg-white/5 border rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all ${formErrors.zip ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                      value={billingDetails.zip}
                      onChange={(e) => handleBillingChange('zip', e.target.value)}
                    />
                    {formErrors.zip && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.zip}</p>}
                  </div>
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Country</label>
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
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: state.isFocused ? '#FFC800' : (formErrors.country ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
                        borderRadius: '0.125rem',
                        height: '3rem',
                        fontSize: '10px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: state.isFocused ? '#FFC800' : 'rgba(255, 255, 255, 0.2)',
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#000',
                        border: '1px border rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.125rem',
                        zIndex: 50
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? 'rgba(255, 200, 0, 0.1)' : 'transparent',
                        color: state.isFocused ? '#FFC800' : 'rgba(255, 255, 255, 0.6)',
                        fontSize: '10px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        '&:active': {
                          backgroundColor: '#FFC800',
                          color: '#000'
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
                        color: 'rgba(255, 255, 255, 0.2)'
                      })
                    }}
                  />
                  {formErrors.country && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">{formErrors.country}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 px-1 opacity-40 hover:opacity-80 transition-opacity duration-200">
                <input
                  id="checkout-newsletter"
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={(e) => setNewsletterOptIn(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-transparent border border-white/20 text-white/40 accent-white/40 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                />
                <label htmlFor="checkout-newsletter" className="text-[9px] font-medium text-white/50 lowercase tracking-wider leading-relaxed cursor-pointer select-none first-letter:uppercase">
                  Email me with news and offers
                </label>
              </div>

              <div className="p-4 bg-studio-yellow/5 border border-studio-yellow/10 rounded-sm">
                <p className="text-[9px] font-medium text-studio-yellow uppercase tracking-widest leading-relaxed">
                  Note: This information is used for billing and tax compliance purposes. All samples remain digital and will be added to your account instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-sm space-y-8">
              <h2 className="text-xl font-black uppercase tracking-tight italic">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Subtotal ({itemCount} items)</span>
                  <span ref={subtotalRef}>{currency === 'USD' ? `$${activeSubtotal.toFixed(2)}` : `₹${total}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-studio-neon">
                    <span>Discount ({discount}%)</span>
                    <span>-{currency === 'USD' ? `$${activeCouponDiscount.toFixed(2)}` : `₹${activeCouponDiscount}`}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Total Amount</span>
                  <span ref={totalRef} className="text-3xl font-black text-studio-yellow italic">{currency === 'USD' ? `$${activeTotal.toFixed(2)}` : `₹${total - activeCouponDiscount}`}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                    <input
                      type="text"
                      placeholder="COUPON CODE"
                      className="w-full h-10 bg-black border border-white/10 rounded-sm pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={loading}
                    className="px-4 bg-white/10 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest rounded-sm disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest">{couponError}</p>}
                {discount > 0 && <p className="text-[8px] font-bold text-studio-neon uppercase tracking-widest">Coupon Applied Successfully!</p>}
              </div>

              {/* Pre-order warning notice */}
              {hasPreorder && (
                <div className="p-5 rounded-sm border-2 border-[#FFC800] bg-black/60 shadow-[4px_4px_0px_#FF0080] text-left space-y-3 mt-4">
                  <div className="flex items-center gap-2.5 text-[#FFC800]">
                    <div className="p-1 bg-[#FFC800] text-black border-2 border-black rounded-xs -rotate-6">
                      <Clock size={14} className="animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">Pre-order Notice</span>
                  </div>
                  <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest leading-relaxed">
                    Some items in your cart are <span className="text-[#FFC800]">pre-orders</span>. Our sample packs are mostly <span className="text-[#FFC800]">live-recorded</span> or highly <span className="text-[#FF0080]">time-consuming</span> to produce, <span className="text-studio-neon">but we are trying hard to make it available as soon as possible!</span>
                  </p>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                    🚀 Before pre-ordering, note it might take <span className="text-white underline decoration-[#FFC800]">1-2 months to deliver</span>. Once available, we will notify you via our social media & email.
                  </p>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest leading-relaxed pt-1 border-t border-white/10">
                    📧 Personally email us at{' '}
                    <a href="mailto:contact@sampleswala.com" className="text-[#FFC800] hover:text-white underline font-black transition-colors lowercase">
                      contact@sampleswala.com
                    </a>{' '}
                    for availability questions.
                  </p>
                </div>
              )}

              {/* Legal Agreement */}
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
                      {error}
                    </p>
                  </div>
                )}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-md border-t border-white/10 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 lg:z-auto">
                  <div className="max-w-md mx-auto lg:max-w-none">
                    {currency === 'USD' && activeTotal > 0 ? (
                      <div>
                        {!paypalLoaded && (
                          <div className="w-full h-14 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-xs font-black uppercase tracking-widest text-white/40">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
                        className="w-full h-14 bg-[#FFC800] text-black font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-[0_0_40px_rgba(255,200,0,0.1)]"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>{activeTotal === 0 ? 'GET FOR FREE' : `COMPLETE PAYMENT — ${formatPrice(currency === 'USD' ? activeTotal : total - activeCouponDiscount, currency === 'USD' ? activeTotal : null)}`}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] leading-relaxed text-center px-4">
                  By purchasing, you agree to our <Link href="/terms" className="text-white/40 hover:text-studio-yellow underline">Terms</Link>, <Link href="/refund-policy" className="text-white/40 hover:text-studio-yellow underline">Refund</Link>, <Link href="/privacy" className="text-white/40 hover:text-studio-yellow underline">Privacy</Link> & <Link href="/terms" className="text-white/40 hover:text-studio-yellow underline">EULA</Link>.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 opacity-40">
                <ShieldCheck size={14} className="text-studio-neon" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">128-bit SSL Secure Transaction</span>
              </div>
            </div>

            {/* Trust Badges Section */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-4 w-1 bg-studio-neon shadow-[0_0_10px_#00FF94]" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">Why Samples Wala?</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4 items-start">
                  <Zap size={14} className="text-studio-yellow mt-1" />
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-tight">Instant Delivery</h4>
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest mt-1">Get your sounds immediately after payment</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <ShieldCheck size={14} className="text-studio-neon mt-1" />
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-tight">Lifetime Access</h4>
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest mt-1">Download your purchases anytime from your vault</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-[7px] font-black uppercase tracking-[0.3em] text-white/35">We Accept National &amp; International Payments</p>
              <PaymentAccepted variant="compact" />
            </div>

            {/* Upsell Section */}
            {upsellPacks.length > 0 && (
              <div className="p-6 bg-studio-yellow/5 border border-studio-yellow/10 rounded-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-1 bg-studio-yellow shadow-[0_0_10px_#FFC800]" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-studio-yellow italic">Frequently Bought Together</h3>
                </div>

                <div className="space-y-4">
                  {upsellPacks.map((pack) => (
                    <div key={pack.id} className="flex gap-4 items-center group">
                      <div className="w-12 h-12 relative rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                        <Image src={pack.cover_url || '/placeholder.jpg'} alt={pack.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-[9px] font-black uppercase tracking-tight line-clamp-1">{pack.name}</h4>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">₹{pack.price_inr}</p>
                      </div>
                      <Link
                        href={`/packs/${pack.slug}`}
                        className="p-2 border border-white/10 hover:border-studio-yellow hover:text-studio-yellow transition-all rounded-sm"
                      >
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Section */}
            <Link href="/contact" className="mt-4 p-6 border border-white/5 rounded-sm flex items-center justify-between group hover:border-studio-yellow/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-studio-yellow group-hover:bg-studio-yellow group-hover:text-black transition-all">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Need Help?</h4>
                  <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-1">Contact Support Team</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-white/10 group-hover:text-studio-yellow group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
