'use client'
import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Tag, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { validateCoupon } from './actions'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const { items, removeItem, total, clearCart, itemCount } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

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
      router.push('/auth')
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
              userId: user.id
            }),
          })
          const verifyData = await verifyRes.json()

          if (verifyData.success) {
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
        <Link href="/library" className="px-8 py-4 bg-studio-yellow text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all">
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-10 w-1 bg-studio-yellow shadow-[0_0_20px_#FFC800]" />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Checkout / <span className="text-white/20">Cart</span></h1>
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
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-studio-yellow shadow-[0_0_15px_#FFC800]" />
              <h2 className="text-xl font-black uppercase tracking-tight italic">Billing Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="NAME" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                  defaultValue={user?.user_metadata?.full_name || ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="PHONE" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Address</label>
                <input 
                  type="text" 
                  placeholder="STREET ADDRESS" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">City</label>
                <input 
                  type="text" 
                  placeholder="CITY" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">State</label>
                  <input 
                    type="text" 
                    placeholder="STATE" 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Pincode</label>
                  <input 
                    type="text" 
                    placeholder="ZIP" 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-black uppercase tracking-widest focus:border-studio-yellow outline-none transition-all"
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
                <span>₹{total}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-studio-neon">
                  <span>Discount ({discount}%)</span>
                  <span>- ₹{(total * discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Total Amount</span>
                <span className="text-3xl font-black text-studio-yellow italic">₹{discountedTotal.toFixed(2)}</span>
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

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              disabled={loading || paymentStatus === 'processing'}
              className="w-full h-14 bg-studio-yellow text-black font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-[0_0_40px_rgba(255,200,0,0.1)]"
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

            <div className="flex items-center justify-center gap-3 pt-2 opacity-20">
               <ShieldCheck size={14} />
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Checkout by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
