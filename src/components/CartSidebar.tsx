'use client'
import React, { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function CartSidebar({ initialUser }: { initialUser?: any }) {
  const { items, removeItem, total, itemCount, isSidebarOpen, setSidebarOpen } = useCart()
  const [user, setUser] = useState<any>(initialUser)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Only fetch if we don't have an initial user (safety fallback)
    if (!initialUser) {
      const checkUser = async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
      }
      checkUser()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, initialUser])

  if (!isSidebarOpen) return null

  const handleCheckout = () => {
    setSidebarOpen(false)
    if (!user) {
      router.push('/auth?next=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-black border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-studio-yellow" size={20} />
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Your Cart <span className="text-white/20">({itemCount})</span></h2>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-16 h-16 relative rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                  <Image src={item.cover_url || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-black uppercase tracking-tight text-sm truncate">{item.name}</h3>
                  <p className="text-[10px] font-black text-studio-yellow italic">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-white/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-4 bg-white/[0.02]">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Amount</span>
              <span className="text-2xl font-black text-studio-yellow italic">₹{total}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full h-14 bg-studio-yellow text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white transition-all rounded-sm shadow-[0_0_30px_rgba(255,200,0,0.1)]"
            >
              <span>Go to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="w-full py-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
