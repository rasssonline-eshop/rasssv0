"use client"

import * as React from "react"

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image?: string
  quantity: number
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
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setOpen] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p))
      }
      return [...prev, { ...item, quantity: qty }]
    })
    setOpen(true)
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateQty = React.useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)))
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
