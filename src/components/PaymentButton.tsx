'use client'
import { useState } from 'react'
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PaymentButtonProps {
  packId: string
  packName: string
  price: number
  userId?: string
}

export function PaymentButton({ packId, packName, price, userId }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const router = useRouter()

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!userId) {
      router.push('/auth')
      return
    }

    setLoading(true)
    const res = await loadRazorpay()

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      setLoading(false)
      return
    }

    try {
      // 1. Create Order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      const orderData = await orderResponse.json()

      if (orderData.error) throw new Error(orderData.error)

      // 2. Open Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Samples Wala",
        description: `Purchase ${packName}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          setStatus('processing')
          // 3. Verify Payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              packId,
              userId,
              packName
            }),
          })
          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            setStatus('success')
            setTimeout(() => {
              router.refresh() // Refresh to show download button
            }, 2000)
          } else {
            alert('Payment verification failed.')
            setStatus('idle')
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#FFC800"
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full h-14 bg-studio-neon/20 border border-studio-neon/40 text-studio-neon font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-sm">
        <CheckCircle2 size={18} />
        <span>Added to Library</span>
      </div>
    )
  }

  return (
    <button 
      disabled={loading || status === 'processing'}
      onClick={handlePayment}
      className="w-full h-14 bg-[#FFC800] text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-[0_0_30px_rgba(255,200,0,0.1)]"
    >
      {loading || status === 'processing' ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <>
          <CreditCard size={18} />
          <span>BUY PACK — ₹{price}</span>
        </>
      )}
    </button>
  )
}
