'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  cover_url: string
  slug: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  subtotal: number
  discount: number
  total: number
  itemCount: number
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isSidebarOpen, setSidebarOpen] = useState(false)

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

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('sampleswala_lite_cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    if (!items.find(i => i.id === item.id)) {
      setItems([...items, item])
    }
    setSidebarOpen(true) // Open sidebar every time addItem is called
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const discount = items.length >= 3 ? Math.round(subtotal * 0.1) : 0
  const total = subtotal - discount
  const itemCount = items.length

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      subtotal,
      discount,
      total, 
      itemCount, 
      isSidebarOpen, 
      setSidebarOpen 
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
