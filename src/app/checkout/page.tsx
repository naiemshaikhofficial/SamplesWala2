'use client'
import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Tag, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { validateCoupon } from './actions'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/Header'

// --- ANIMATED COUNTER HOOK ---
function useAnimatedCounter(targetValue: number) {
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
        ref.current.textContent = `₹${currentValue.toFixed(2)}`;
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
  }, [targetValue]);

  return ref;
}

// --- MUSICAL NOTES BACKGROUND ---
const MusicalNotesBackground = () => {
  const musicalNotes = ['♪', '♫', '♬', '♪', '♫', '♬', '♪', '♫', '♬', '♪'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
      {musicalNotes.map((note, index) => (
        <span 
          key={index} 
          className="absolute text-studio-yellow/20 animate-float-note"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 2 + 1}rem`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        >
          {note}
        </span>
      ))}
    </div>
  );
};

export default function CheckoutPage() {
  const { items, removeItem, total, clearCart, itemCount, setSidebarOpen } = useCart()
  
  // Close sidebar immediately when checkout page loads
  useEffect(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [user, setUser] = useState<any>(null)
  const [upsellPacks, setUpsellPacks] = useState<any[]>([])
  const [billingDetails, setBillingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 1. Load from localStorage
    const savedDetails = localStorage.getItem('billing_details')
    if (savedDetails) {
      setBillingDetails(JSON.parse(savedDetails))
    }

    supabase.auth.getUser().then(({ data }) => {
      const currentUser = data.user
      setUser(currentUser)
      
      // 2. If localStorage was empty, use DB metadata
      if (!savedDetails && currentUser?.user_metadata) {
        const meta = currentUser.user_metadata
        const dbDetails = {
          fullName: meta.full_name || '',
          phone: meta.phone || '',
          address: meta.address || '',
          city: meta.city || '',
          state: meta.state || '',
          zip: meta.zip || ''
        }
        setBillingDetails(dbDetails)
        localStorage.setItem('billing_details', JSON.stringify(dbDetails))
      }
    })
    
    // Fetch upsell packs
    fetch('/api/packs/featured')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((p: any) => !items.some(item => item.id === p.id)).slice(0, 2)
        setUpsellPacks(filtered)
      })
  }, [items])

  const handleBillingChange = (field: string, value: string) => {
    const updated = { ...billingDetails, [field]: value }
    setBillingDetails(updated)
    localStorage.setItem('billing_details', JSON.stringify(updated))
  }

  const handleApplyCoupon = async () => {
    if (!coupon) return
    setLoading(true)
    const result = await validateCoupon(coupon)
    if (result.success) {
      setDiscount(result.discount || 0)
      setCouponError('')
    } else {
      setCouponError(result.message || 'Invalid coupon')
      setDiscount(0)
    }
    setLoading(false)
  }

  const discountedTotal = total - (total * discount / 100)
  
  const subtotalRef = useAnimatedCounter(total)
  const totalRef = useAnimatedCounter(discountedTotal)

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
    setLoading(true)
    const sdkLoaded = await loadRazorpay()
    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          packIds: items.map(i => i.id),
          discountPercent: discount
        }),
      })
      const order = await res.json()

      if (order.error) throw new Error(order.error)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Sampleswala",
        description: `Checkout ${itemCount} items`,
        order_id: order.id,
        handler: async function (response: any) {
          setPaymentStatus('processing')
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              packIds: items.map(i => i.id),
              userId: user.id,
              billingDetails: billingDetails
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
                zip: billingDetails.zip
              }
            })

            setPaymentStatus('success')
            clearCart()
            setTimeout(() => {
              router.push('/library')
            }, 3000)
          } else {
            alert('Verification failed')
            setPaymentStatus('idle')
          }
        },
        theme: { color: "#FFC800" }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-20 h-20 bg-studio-neon/20 rounded-full flex items-center justify-center text-studio-neon animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Payment Successful!</h1>
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Your sounds are being added to your library...</p>
        <Link href="/library" className="px-8 py-4 bg-[#FFC800] text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all">
          Go to Library
        </Link>
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
      
      <div className="container mx-auto px-4 py-20 relative z-10">
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
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-sm group hover:border-white/10 transition-all">
              <div className="w-20 h-20 relative rounded-sm overflow-hidden flex-shrink-0">
                <Image src={item.cover_url || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="font-black uppercase tracking-tight text-lg">{item.name}</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Premium Sample Pack</p>
              </div>
              <div className="text-right space-y-2">
                <p className="font-black text-xl">₹{item.price}</p>
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
          <div className="pt-12 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="h-6 w-1 bg-studio-yellow shadow-[0_0_15px_#FFC800]" />
                <h2 className="text-xl font-black uppercase tracking-tight italic">Billing Details</h2>
              </div>
              <span className="text-[8px] font-bold text-studio-neon uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={10} /> Auto-Saved
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="NAME" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                  value={billingDetails.fullName}
                  onChange={(e) => handleBillingChange('fullName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="PHONE" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                  value={billingDetails.phone}
                  onChange={(e) => handleBillingChange('phone', e.target.value)}
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Address</label>
                <input 
                  type="text" 
                  placeholder="STREET ADDRESS" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                  value={billingDetails.address}
                  onChange={(e) => handleBillingChange('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">City</label>
                <input 
                  type="text" 
                  placeholder="CITY" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                  value={billingDetails.city}
                  onChange={(e) => handleBillingChange('city', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">State</label>
                  <input 
                    type="text" 
                    placeholder="STATE" 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                    value={billingDetails.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Pincode</label>
                  <input 
                    type="text" 
                    placeholder="ZIP" 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                    value={billingDetails.zip}
                    onChange={(e) => handleBillingChange('zip', e.target.value)}
                  />
                </div>
              </div>
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
                <span ref={subtotalRef}>₹{total}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-studio-neon">
                  <span>Discount ({discount}%)</span>
                  <span>- ₹{(total * discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Total Amount</span>
                <span ref={totalRef} className="text-3xl font-black text-studio-yellow italic">₹{discountedTotal.toFixed(2)}</span>
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

            {/* Legal Agreement */}
            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                disabled={loading || paymentStatus === 'processing'}
                className="w-full h-14 bg-[#FFC800] text-black font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-[0_0_40px_rgba(255,200,0,0.1)]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>COMPLETE PURCHASE</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

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
          <div className="flex flex-col items-center gap-4 py-4 grayscale opacity-30">
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-white/40">Secure Payments via Razorpay</p>
            <div className="flex gap-4 items-center">
               <div className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-xs">UPI</div>
               <div className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-xs">VISA</div>
               <div className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-xs">CARD</div>
               <div className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-xs">NET</div>
            </div>
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
                      <Image src={pack.cover_url || '/placeholder.jpg'} alt={pack.name} fill className="object-cover" />
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
