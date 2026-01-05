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
            // 1. Get base store (mock/json data for other fields like brands/slides)
            let data: Store = { categories: [] }
            try {
                const res = await fetch("/api/admin/store")
                if (res.ok) {
                    data = await res.json()
                }
            } catch (e) {
                console.error("Admin store fetch error (using empty defaults)", e)
            }

            // 2. Override categories from Real DB (Prisma)
            // This ensures seeded categories appear instead of the single mock "Skin Care"
            try {
                const catRes = await fetch("/api/categories")
                if (catRes.ok) {
                    const dbCats = await catRes.json()
                    if (Array.isArray(dbCats) && dbCats.length > 0) {
                        data.categories = dbCats.map((c: any) => ({
                            name: c.name,
                            image: c.image, // Ensure image is passed if it exists
                            comingSoon: c.comingSoon,
                            subcategories: c.subcategories || []
                        }))
                    }
                }
            } catch (e) {
                console.error("Failed to fetch live categories from DB", e)
            }

            // 3. Update State
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
