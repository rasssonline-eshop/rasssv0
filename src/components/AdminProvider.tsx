"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

interface Category {
    name: string
    image?: string
    comingSoon?: boolean
    subcategories?: string[]
}

interface Store {
    categories: Category[]
    productsByCategory?: Record<string, any[]>
    slides?: any[]
    [key: string]: any
}

interface AdminContextType {
    store: Store
    loading: boolean
    refreshStore: () => Promise<void>
    addProduct: (product: any) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export default function AdminProvider({ children }: { children: ReactNode }) {
    const [store, setStore] = useState<Store>({ categories: [] })
    const [loading, setLoading] = useState(true)

    const fetchStore = async () => {
        try {
            // 1. Get base store (mock/json data for other fields like brands/slides/settings)
            let data: Store = { categories: [], productsByCategory: {} }
            try {
                const res = await fetch("/api/admin/store")
                if (res.ok) {
                    const mockData = await res.json()
                    // Use mock data as base, but we will overwrite critical parts
                    data = { ...data, ...mockData }
                }
            } catch (e) {
                console.error("Admin store fetch error (using empty defaults)", e)
            }

            // 2. Override categories from Real DB (Prisma)
            try {
                const catRes = await fetch("/api/categories")
                if (catRes.ok) {
                    const dbCats = await catRes.json()
                    if (Array.isArray(dbCats) && dbCats.length > 0) {
                        data.categories = dbCats.map((c: any) => ({
                            name: c.name,
                            image: c.image,
                            comingSoon: c.comingSoon,
                            subcategories: c.subcategories || []
                        }))
                    }
                }
            } catch (e) {
                console.error("Failed to fetch live categories from DB", e)
            }

            // 3. Override Products from Real DB (Prisma)
            try {
                // Fetch a large number of products to populate the dashboard view
                const prodRes = await fetch("/api/products?limit=2000")
                if (prodRes.ok) {
                    const products = await prodRes.json()
                    if (Array.isArray(products)) {
                        const grouped: Record<string, any[]> = {}
                        products.forEach((p: any) => {
                            if (p.category) {
                                if (!grouped[p.category]) grouped[p.category] = []
                                grouped[p.category].push(p)
                            }
                        })
                        // Overwrite the mock products with Real DB products
                        data.productsByCategory = grouped
                    }
                }
            } catch (e) {
                console.error("Failed to sync products from DB", e)
            }

            setStore(data)
        } catch (error) {
            console.error("Failed to fetch store data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStore()
    }, [])

    const refreshStore = async () => {
        await fetchStore()
    }

    const addProduct = async (product: any) => {
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            })
            if (res.ok) {
                toast.success("Product created successfully")
                await refreshStore()
            } else {
                const err = await res.json()
                toast.error(err.error || "Failed to create product")
                console.error(err)
            }
        } catch (e) {
            console.error(e)
            toast.error("Error creating product")
        }
    }

    return (
        <AdminContext.Provider value={{ store, loading, refreshStore, addProduct }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin() {
    const context = useContext(AdminContext)
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
}
