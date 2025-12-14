"use client"

import * as React from "react"

export type AdminCategory = {
  name: string
  subcategories?: string[]
  image?: string
  comingSoon?: boolean
}

export type AdminProduct = {
  id: string
  name: string
  slug?: string
  price: number
  oldPrice?: number
  image?: string
  rating?: number
  brand?: string
  category: string
}

export type AdminSlide = { id: string, title: string, subtitle: string, image: string }
export type AdminBrand = { id: string, name: string, logo: string }

export type InventoryMovement = { id: string, productId: string, productName: string, type: 'in' | 'out', qty: number, unit?: string, note?: string, date: string }
export type OrderItem = { productId: string, name: string, qty: number, price: number }
export type Order = { id: string, status: 'pending' | 'paid' | 'shipped' | 'cancelled', items: OrderItem[], total: number, placedAt: string, note?: string }
export type LedgerEntry = { id: string, type: 'income' | 'expense', amount: number, note?: string, date: string }
export type Accountant = { name: string, email?: string, phone?: string, notes?: string, lastAuditDate?: string }

type AdminStore = {
  categories: AdminCategory[]
  productsByCategory: Record<string, AdminProduct[]>
  slides: AdminSlide[]
  brands: AdminBrand[]
  inventory: InventoryMovement[]
  orders: Order[]
  ledger: LedgerEntry[]
  accountant?: Accountant
}

type AdminContextValue = {
  store: AdminStore
  setStore: (s: AdminStore) => void
  addCategory: (c: AdminCategory) => void
  updateCategory: (name: string, patch: Partial<AdminCategory>) => void
  removeCategory: (name: string) => void
  addProduct: (p: AdminProduct) => void
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void
  removeProduct: (id: string) => void
  upsertSlide: (slide: AdminSlide) => void
  removeSlide: (id: string) => void
  upsertBrand: (b: AdminBrand) => void
  removeBrand: (id: string) => void
  importJson: (json: AdminStore) => void
  exportJson: () => string
  addMovement: (m: InventoryMovement) => void
  removeMovement: (id: string) => void
  upsertOrder: (o: Order) => void
  removeOrder: (id: string) => void
  addLedger: (e: LedgerEntry) => void
  removeLedger: (id: string) => void
  setAccountant: (a: Accountant) => void
}

const defaultStore: AdminStore = {
  categories: [],
  productsByCategory: {},
  slides: [],
  brands: [],
  inventory: [],
  orders: [],
  ledger: [],
  accountant: undefined,
}

const AdminContext = React.createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const ctx = React.useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}

function load(): AdminStore {
  try {
    const raw = localStorage.getItem("adminStore")
    if (raw) return JSON.parse(raw)
  } catch {}
  return defaultStore
}

function save(s: AdminStore) {
  try { localStorage.setItem("adminStore", JSON.stringify(s)) } catch {}
}

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [store, setStoreState] = React.useState<AdminStore>(defaultStore)
  React.useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/store', { method: 'GET', headers: { accept: 'application/json' }, cache: 'no-store' })
        if (res.ok) { const json = await res.json(); setStoreState(json); save(json); return }
      } catch {}
      setStoreState(load())
    })()
  }, [])
  const setStore = React.useCallback((s: AdminStore) => {
    setStoreState(s)
    save(s)
    try {
      const token = localStorage.getItem('adminPin') || ''
      fetch('/api/admin/store', { method: 'POST', headers: { 'content-type': 'application/json', 'x-admin-token': token }, body: JSON.stringify(s) })
    } catch {}
  }, [])

  const addCategory = (c: AdminCategory) => {
    const s = { ...store, categories: [...store.categories.filter(x => x.name !== c.name), c] }
    setStore(s)
  }
  const updateCategory = (name: string, patch: Partial<AdminCategory>) => {
    const s = { ...store, categories: store.categories.map(c => c.name === name ? { ...c, ...patch } : c) }
    setStore(s)
  }
  const removeCategory = (name: string) => {
    const { [name]: _, ...rest } = store.productsByCategory
    const s = { ...store, categories: store.categories.filter(c => c.name !== name), productsByCategory: rest }
    setStore(s)
  }

  const addProduct = (p: AdminProduct) => {
    const list = store.productsByCategory[p.category] || []
    const s = { ...store, productsByCategory: { ...store.productsByCategory, [p.category]: [...list.filter(x => x.id !== p.id), p] } }
    setStore(s)
  }
  const updateProduct = (id: string, patch: Partial<AdminProduct>) => {
    const category = patch.category || Object.keys(store.productsByCategory).find(k => (store.productsByCategory[k] || []).some(x => x.id === id))
    if (!category) return
    const list = store.productsByCategory[category] || []
    const s = { ...store, productsByCategory: { ...store.productsByCategory, [category]: list.map(x => x.id === id ? { ...x, ...patch } : x) } }
    setStore(s)
  }
  const removeProduct = (id: string) => {
    const byCat: Record<string, AdminProduct[]> = {}
    for (const [k, v] of Object.entries(store.productsByCategory)) byCat[k] = v.filter(x => x.id !== id)
    const s = { ...store, productsByCategory: byCat }
    setStore(s)
  }

  const upsertSlide = (slide: AdminSlide) => {
    const s = { ...store, slides: [...store.slides.filter(x => x.id !== slide.id), slide] }
    setStore(s)
  }
  const removeSlide = (id: string) => {
    const s = { ...store, slides: store.slides.filter(x => x.id !== id) }
    setStore(s)
  }

  const upsertBrand = (b: AdminBrand) => {
    const s = { ...store, brands: [...store.brands.filter(x => x.id !== b.id), b] }
    setStore(s)
  }
  const removeBrand = (id: string) => {
    const s = { ...store, brands: store.brands.filter(x => x.id !== id) }
    setStore(s)
  }

  const addMovement = (m: InventoryMovement) => {
    const s = { ...store, inventory: [...store.inventory, m] }
    setStore(s)
  }
  const removeMovement = (id: string) => {
    const s = { ...store, inventory: store.inventory.filter(x => x.id !== id) }
    setStore(s)
  }
  const upsertOrder = (o: Order) => {
    const s = { ...store, orders: [...store.orders.filter(x => x.id !== o.id), o] }
    setStore(s)
  }
  const removeOrder = (id: string) => {
    const s = { ...store, orders: store.orders.filter(x => x.id !== id) }
    setStore(s)
  }
  const addLedger = (e: LedgerEntry) => {
    const s = { ...store, ledger: [...store.ledger, e] }
    setStore(s)
  }
  const removeLedger = (id: string) => {
    const s = { ...store, ledger: store.ledger.filter(x => x.id !== id) }
    setStore(s)
  }
  const setAccountant = (a: Accountant) => {
    const s = { ...store, accountant: a }
    setStore(s)
  }

  const importJson = (json: AdminStore) => setStore(json)
  const exportJson = () => JSON.stringify(store, null, 2)

  const value: AdminContextValue = {
    store,
    setStore,
    addCategory,
    updateCategory,
    removeCategory,
    addProduct,
    updateProduct,
    removeProduct,
    upsertSlide,
    removeSlide,
    upsertBrand,
    removeBrand,
    importJson,
    exportJson,
    addMovement,
    removeMovement,
    upsertOrder,
    removeOrder,
    addLedger,
    removeLedger,
    setAccountant,
  }
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
