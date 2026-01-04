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
            const res = await fetch("/api/admin/store")
            if (res.ok) {
                const data = await res.json()
                setStore(data)
            }
        } catch (error) {
            console.error("Failed to fetch store data:", error)
            // Quiet fail - keep default state
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
