'use client'
import React, { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { X, ShoppingBag, Trash2, ArrowRight, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function CartSidebar({ initialUser }: { initialUser?: any }) {
  const { items, removeItem, subtotal, discount, total, itemCount, isSidebarOpen, setSidebarOpen } = useCart()
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

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

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
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Clean Comic Style */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border-l-4 border-black h-full flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-300">
        
        {/* Header - Cleaned Up */}
        <div className="p-8 border-b-2 border-white/5 flex items-center justify-between relative z-10 bg-black">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-studio-yellow border-2 border-black -rotate-2">
              <ShoppingBag className="text-black" size={20} />
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black uppercase tracking-tight italic text-white">
                YOUR <span className="text-studio-pink">CART</span>
              </h2>
              <div className="bg-studio-neon text-black px-2 py-0.5 border-2 border-black text-[10px] font-black rotate-3">
                {itemCount}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - More breathing room */}
        <div className="flex-grow overflow-y-auto p-8 space-y-10 relative z-10">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 border-2 border-white/10 flex items-center justify-center rotate-12 opacity-10">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Bundle Builder Progress - Slim Version */}
              {items.length < 3 ? (
                <div className="bg-studio-charcoal/50 p-3 border-2 border-black border-dashed relative overflow-hidden group/bundle">
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-studio-yellow/5 rounded-full blur-2xl group-hover/bundle:bg-studio-yellow/10 transition-all duration-700" />
                  
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/60 mb-2.5">
                    GET <span className="text-studio-yellow">10% OFF</span> 
                    <span className="ml-2 text-[8px] text-white/20 italic tracking-widest font-bold uppercase"> — ADD {3 - items.length} MORE</span>
                  </p>

                  <div className="relative h-3 bg-white/5 border-2 border-black overflow-hidden">
                    {/* Liquid Fill */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-studio-yellow transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,200,0,0.5)]"
                      style={{ width: `${(items.length / 3) * 100}%` }}
                    >
                      {/* Flowing Water Effect Animation */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer" />
                    </div>

                    {/* Dividers (Pipe joints) */}
                    <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                      <div className="w-[2px] h-full bg-black/40" />
                      <div className="w-[2px] h-full bg-black/40" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="bg-studio-pink p-4 border-4 border-black shadow-[6px_6px_0px_black] -rotate-1 animate-in zoom-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="bg-black text-studio-yellow p-1 border-2 border-black rotate-12">
                        <Zap size={16} fill="currentColor" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-tighter text-white italic">
                        BUNDLE UNLOCKED: <span className="underline decoration-studio-yellow decoration-2 underline-offset-4">10% DISCOUNT</span> APPLIED!
                      </p>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-studio-yellow border-2 border-black rotate-45 animate-ping" />
                </div>
              )}

              <div className="space-y-8">
                {items.map((item) => (
                <div key={item.id} className="flex gap-6 group animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="w-20 h-20 relative border-2 border-black flex-shrink-0 bg-studio-charcoal group-hover:-translate-y-1 transition-all">
                    <Image src={item.cover_url || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow min-w-0 py-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-bold uppercase tracking-tight text-sm truncate text-white/90">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black bg-white/10 text-white/40 px-1.5 py-0.5 border border-white/5">PACK</span>
                        <p className="text-xs font-black text-studio-yellow italic tracking-widest">₹{item.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-red-500 transition-colors w-fit"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* Footer - Solid & Defined */}
        {items.length > 0 && (
          <div className="p-8 border-t-2 border-white/5 space-y-6 bg-black relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-studio-neon">
                  <span>Bundle Discount (10%)</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic block">Total Amount</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-studio-yellow italic">₹{total}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-studio-neon transition-all border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none group"
            >
              <span className="italic">PROCEED TO CHECKOUT</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="w-full text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-colors"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
