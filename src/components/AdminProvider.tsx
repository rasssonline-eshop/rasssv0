"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface Category {
    name: string
}

interface Store {
    categories: Category[]
}

interface AdminContextType {
    store: Store
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export default function AdminProvider({ children }: { children: ReactNode }) {
    const [store] = useState<Store>({ categories: [] })
    return (
        <AdminContext.Provider value={{ store }}>
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
