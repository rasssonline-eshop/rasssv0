"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image?: string
  quantity: number
  variantId?: string
  variantName?: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (v: boolean) => void
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setOpen] = React.useState(false)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Get user-specific cart key
  const getCartKey = React.useCallback(() => {
    if (session?.user?.id) {
      return `cart_${session.user.id}`
    }
    return 'cart_guest'
  }, [session?.user?.id])

  // Load cart from localStorage when session is ready
  React.useEffect(() => {
    if (status === 'loading') return
    
    try {
      const cartKey = getCartKey()
      const raw = localStorage.getItem(cartKey)
      if (raw) {
        setItems(JSON.parse(raw))
      } else {
        setItems([])
      }
      setIsInitialized(true)
    } catch {
      setItems([])
      setIsInitialized(true)
    }
  }, [status, getCartKey])

  // Save cart to localStorage whenever items change (only after initialization)
  React.useEffect(() => {
    if (!isInitialized) return
    
    try {
      const cartKey = getCartKey()
      localStorage.setItem(cartKey, JSON.stringify(items))
    } catch {}
  }, [items, getCartKey, isInitialized])

  // Clear cart when user logs out or switches accounts
  React.useEffect(() => {
    if (status === 'unauthenticated' && isInitialized) {
      // User logged out - switch to guest cart
      try {
        const guestCart = localStorage.getItem('cart_guest')
        if (guestCart) {
          setItems(JSON.parse(guestCart))
        } else {
          setItems([])
        }
      } catch {
        setItems([])
      }
    }
  }, [status, isInitialized])

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      // For items with variants, use a composite key (id + variantId)
      const itemKey = item.variantId ? `${item.id}_${item.variantId}` : item.id
      const existing = prev.find((p) => {
        const pKey = p.variantId ? `${p.id}_${p.variantId}` : p.id
        return pKey === itemKey
      })
      
      if (existing) {
        return prev.map((p) => {
          const pKey = p.variantId ? `${p.id}_${p.variantId}` : p.id
          return pKey === itemKey ? { ...p, quantity: p.quantity + qty } : p
        })
      }
      return [...prev, { ...item, quantity: qty }]
    })
    setOpen(true)
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => {
      const pKey = p.variantId ? `${p.id}_${p.variantId}` : p.id
      return pKey !== id
    }))
  }, [])

  const updateQty = React.useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => {
      const pKey = p.variantId ? `${p.id}_${p.variantId}` : p.id
      return pKey === id ? { ...p, quantity: Math.max(1, qty) } : p
    }))
  }, [])

  const clear = React.useCallback(() => {
    setItems([])
  }, [])

  const count = items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, subtotal, isOpen, setOpen, addItem, removeItem, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  )
}
