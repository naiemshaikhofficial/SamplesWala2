'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { trackCartSnapshot } from '@/lib/telemetryClient'

export interface CartItem {
  id: string
  name: string
  price: number
  price_usd?: number
  cover_url: string
  slug: string
  type: 'pack' | 'preset'
  is_downloadable?: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem, openSidebar?: boolean) => void
  buyNow: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  subtotal: number
  discount: number
  total: number
  itemCount: number
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  ownedIds: string[]
  isAdmin: boolean
  isItemOwned: (id: string, slug?: string) => boolean
  markAsOwned: (ids: string | string[]) => void
  syncOwnedIds: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Global in-flight ownership sync promise for concurrent request deduplication
let inFlightOwnershipSyncPromise: Promise<void> | null = null

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  // Synchronously initialize owned IDs from localStorage for 0ms delay
  const [ownedIds, setOwnedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sampleswala_owned_ids')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) return parsed
        }
      } catch (e) {}
    }
    return []
  })

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('sampleswala_is_admin') === 'true'
      } catch (e) {}
    }
    return false
  })

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sampleswala_lite_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
  }, [])

  // Save cart to localStorage and update telemetry only when changed
  const lastCartJsonRef = useRef<string | null>(null)
  useEffect(() => {
    const serialized = JSON.stringify(items)
    localStorage.setItem('sampleswala_lite_cart', serialized)
    
    // Only dispatch telemetry snapshot if items actually changed after hydration
    if (lastCartJsonRef.current !== null && lastCartJsonRef.current !== serialized) {
      try {
        trackCartSnapshot(items)
      } catch {}
    }
    lastCartJsonRef.current = serialized
  }, [items])

  // Prefetch checkout page on mount for instant zero-latency navigation
  useEffect(() => {
    try {
      router.prefetch('/checkout')
    } catch (e) {}
  }, [router])

  // Sync owned IDs and admin status from server with intelligent caching and in-flight deduplication
  const syncOwnedIds = useCallback(async (force = false) => {
    // Return existing in-flight request if one is already pending
    if (inFlightOwnershipSyncPromise) {
      return inFlightOwnershipSyncPromise
    }

    try {
      if (typeof window !== 'undefined') {
        const hasAuthCookie = document.cookie.includes('-auth-token')
        const savedUserId = localStorage.getItem('sampleswala_owned_user_id')

        // Fast bypass for unauthenticated guests - 0 network calls
        if (!hasAuthCookie && !savedUserId) {
          setOwnedIds([])
          setIsAdmin(false)
          return
        }

        // Cache freshness check (5-minute TTL) to eliminate repeated page-load hits
        if (!force) {
          const lastSync = sessionStorage.getItem('sampleswala_owned_last_sync')
          if (lastSync && Date.now() - Number(lastSync) < 5 * 60 * 1000) {
            return
          }
        }
      }

      const syncPromise = (async () => {
        try {
          const res = await fetch('/api/auth/ownership/all', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
          if (res.ok) {
            const data = await res.json()
            const incomingOwned: string[] = Array.isArray(data.ownedIds) ? data.ownedIds : []
            const incomingIsAdmin: boolean = !!data.isAdmin
            const currentUserId = data.userId || null

            // Overwrite strictly with current server truth (do NOT merge previous users)
            setOwnedIds(incomingOwned)
            setIsAdmin(incomingIsAdmin)

            if (typeof window !== 'undefined') {
              sessionStorage.setItem('sampleswala_owned_last_sync', String(Date.now()))
              if (currentUserId && (incomingOwned.length > 0 || incomingIsAdmin)) {
                localStorage.setItem('sampleswala_owned_ids', JSON.stringify(incomingOwned))
                localStorage.setItem('sampleswala_is_admin', String(incomingIsAdmin))
                localStorage.setItem('sampleswala_owned_user_id', currentUserId)
              } else {
                // Guest or non-owning user: clear stale ownership flags
                localStorage.removeItem('sampleswala_owned_ids')
                localStorage.removeItem('sampleswala_is_admin')
                localStorage.removeItem('sampleswala_owned_user_id')
              }
            }
          }
        } catch (e) {
          console.warn('Background ownership sync error:', e)
        } finally {
          inFlightOwnershipSyncPromise = null
        }
      })()

      inFlightOwnershipSyncPromise = syncPromise
      await syncPromise
    } catch (e) {
      console.warn('Background ownership sync error:', e)
    }
  }, [])

  useEffect(() => {
    syncOwnedIds()
  }, [syncOwnedIds])

  // Handle immediate clean reset on logout event and fresh sync on login or vault update
  useEffect(() => {
    const handleLogout = () => {
      inFlightOwnershipSyncPromise = null
      setOwnedIds([])
      setIsAdmin(false)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('sampleswala_owned_last_sync')
        localStorage.removeItem('sampleswala_owned_ids')
        localStorage.removeItem('sampleswala_is_admin')
        localStorage.removeItem('sampleswala_owned_user_id')
      }
    }

    const handleFreshSync = () => {
      syncOwnedIds(true)
    }

    window.addEventListener('sw:auth-logout', handleLogout)
    window.addEventListener('sw:auth-login', handleFreshSync)
    window.addEventListener('sw:vault-updated', handleFreshSync)
    return () => {
      window.removeEventListener('sw:auth-logout', handleLogout)
      window.removeEventListener('sw:auth-login', handleFreshSync)
      window.removeEventListener('sw:vault-updated', handleFreshSync)
    }
  }, [syncOwnedIds])

  // Check if an item is already owned (either by ID or slug)
  const isItemOwned = useCallback((id: string, slug?: string): boolean => {
    if (!id) return false
    if (isAdmin) return true
    if (ownedIds.includes(id) || (slug && ownedIds.includes(slug))) return true
    return false
  }, [ownedIds, isAdmin])

  // Mark items as owned and clean up from cart
  const markAsOwned = useCallback((ids: string | string[]) => {
    const list = Array.isArray(ids) ? ids : [ids]
    setOwnedIds(prev => {
      const combined = Array.from(new Set([...prev, ...list]))
      if (typeof window !== 'undefined') {
        localStorage.setItem('sampleswala_owned_ids', JSON.stringify(combined))
      }
      return combined
    })
    // Remove any newly owned items from active cart to prevent duplicate purchase
    setItems(prev => prev.filter(item => !list.includes(item.id) && !list.includes(item.slug)))
  }, [])

  // Add item with optional sidebar opening (defaults to true for explicit 'Add to Cart')
  const addItem = useCallback((item: CartItem, openSidebar: boolean = true) => {
    // Prevent duplicate purchases if user already owns this item
    if (isItemOwned(item.id, item.slug)) {
      console.info(`[Cart] Item ${item.name} (${item.id}) is already owned. Skipping duplicate purchase.`)
      return
    }

    setItems(prev => {
      if (!prev.find(i => i.id === item.id)) {
        return [...prev, item]
      }
      return prev
    })

    if (openSidebar) {
      setSidebarOpen(true)
    }
  }, [isItemOwned])

  // Buy Now: Silently adds to cart without opening drawer and navigates instantly to checkout
  const buyNow = useCallback((item: CartItem) => {
    setSidebarOpen(false)
    addItem(item, false)
    router.push('/checkout')
  }, [addItem, router])

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const hasFreeItem = items.some(item => !item.price || item.price === 0)
  const paidItems = items.filter(item => item.price > 0)
  const paidSubtotal = paidItems.reduce((acc, item) => acc + item.price, 0)
  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const discount = paidItems.length >= 3 ? Math.round(paidSubtotal * 0.1) : 0
  const total = subtotal - discount
  const itemCount = items.length

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      buyNow,
      removeItem, 
      clearCart, 
      subtotal,
      discount,
      total, 
      itemCount, 
      isSidebarOpen, 
      setSidebarOpen,
      ownedIds,
      isAdmin,
      isItemOwned,
      markAsOwned,
      syncOwnedIds
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
