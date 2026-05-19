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
    <div className="fixed inset-0 z-[200] flex justify-end">
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
              <div className="bg-studio-red text-white px-2 py-0.5 border-2 border-black text-[10px] font-black rotate-3">
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
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-studio-blue/5 rounded-full blur-2xl group-hover/bundle:bg-studio-blue/10 transition-all duration-700" />
                  
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/60 mb-2.5">
                    GET <span className="text-studio-blue">10% OFF</span> 
                    <span className="ml-2 text-[8px] text-white/20 italic tracking-widest font-bold uppercase"> — ADD {3 - items.length} MORE</span>
                  </p>

                  <div className="relative h-6 bg-white/5 border-2 border-black overflow-hidden rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    {/* Liquid Fill - Seamless Water Body */}
                    <div 
                      className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(items.length / 3) * 100}%`,
                        background: 'linear-gradient(180deg, #00E0FF 0%, #0077B6 100%)'
                      }}
                    >
                      {/* Rounded Liquid Front (Seamless Bulb - Background Layer) */}
                      <div 
                        className="absolute right-[-12px] top-0 h-full w-10 rounded-full animate-wave-push"
                        style={{ background: 'linear-gradient(180deg, #00E0FF 0%, #0077B6 100%)' }}
                      />

                      {/* Flowing Bubbles (Randomized & Pre-Started Flow) */}
                      <div className="absolute inset-0 overflow-visible z-10">
                        {/* Main Bubbles with negative delays to start mid-flow */}
                        <div className="w-2 h-2 bg-white border border-white/20 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.5s', animationDuration: '3.2s', top: '15%' }} />
                        <div className="w-1.5 h-1.5 bg-white border border-white/10 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.2s', animationDuration: '4.5s', top: '55%' }} />
                        <div className="w-1 h-1 bg-white border border-white/20 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-2.1s', animationDuration: '3.8s', top: '75%' }} />
                        <div className="w-2.2 h-2.2 bg-white border border-white/10 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.8s', animationDuration: '5.2s', top: '25%' }} />
                        <div className="w-1.2 h-1.2 bg-white border border-white/10 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-3.4s', animationDuration: '4.1s', top: '65%' }} />
                        <div className="w-1.8 h-1.8 bg-white border border-white/20 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.8s', animationDuration: '3.5s', top: '40%' }} />
                        <div className="w-0.8 h-0.8 bg-white border border-white/30 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-2.5s', animationDuration: '4.8s', top: '85%' }} />
                        <div className="w-1.5 h-1.5 bg-white border border-white/10 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.2s', animationDuration: '3.9s', top: '10%' }} />
                        <div className="w-2 h-2 bg-white border border-white/20 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.1s', animationDuration: '4.3s', top: '50%' }} />
                        <div className="w-1.4 h-1.4 bg-white border border-white/10 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-2.8s', animationDuration: '5.5s', top: '30%' }} />

                        {/* Extra Buddy Bubbles with negative delays */}
                        <div className="w-0.6 h-0.6 bg-white/80 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.4s', animationDuration: '2.5s', top: '20%' }} />
                        <div className="w-0.5 h-0.5 bg-white/60 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.1s', animationDuration: '3.1s', top: '45%' }} />
                        <div className="w-0.7 h-0.7 bg-white/90 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.7s', animationDuration: '2.8s', top: '70%' }} />
                        <div className="w-0.4 h-0.4 bg-white/70 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.9s', animationDuration: '3.4s', top: '12%' }} />
                        <div className="w-0.6 h-0.6 bg-white/80 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-2.2s', animationDuration: '2.9s', top: '62%' }} />
                        <div className="w-0.5 h-0.5 bg-white/60 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.3s', animationDuration: '3.2s', top: '38%' }} />
                        <div className="w-0.7 h-0.7 bg-white/90 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.4s', animationDuration: '2.6s', top: '82%' }} />
                        <div className="w-0.4 h-0.4 bg-white/70 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-0.1s', animationDuration: '3.0s', top: '28%' }} />
                        <div className="w-0.6 h-0.6 bg-white/80 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-1.9s', animationDuration: '2.7s', top: '52%' }} />
                        <div className="w-0.5 h-0.5 bg-white/60 rounded-full animate-bubble-flow absolute" style={{ animationDelay: '-2.6s', animationDuration: '3.3s', top: '18%' }} />
                      </div>

                      {/* Liquid Glow Highlight (Very Top) */}
                      <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-r from-transparent to-white/20 blur-sm pointer-events-none z-20" />
                    </div>

                    {/* Pipe Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
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
                    <Image src={item.cover_url || '/placeholder.jpg'} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-grow min-w-0 py-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-bold uppercase tracking-tight text-sm truncate text-white/90">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black bg-white/10 text-white/40 px-1.5 py-0.5 border border-white/5 uppercase tracking-widest">
                          {item.type}
                        </span>
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
              className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-studio-red hover:text-white transition-all border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none group"
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
