"use client"

import * as React from "react"

type UserRole = "customer" | "seller"
type SellerStatus = "pending" | "approved" | "rejected"

type User = {
    id: string
    phone: string
    role: UserRole
    name: string
    email?: string
    sellerStatus?: SellerStatus
    rejectionReason?: string
}

type AuthContextValue = {
    user: User | null
    isAuthenticated: boolean
    login: (user: User) => void
    logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function useAuth() {
    const ctx = React.useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)

    React.useEffect(() => {
        try {
            const saved = localStorage.getItem("auth_user")
            if (saved) {
                setUser(JSON.parse(saved))
            }
        } catch { }
    }, [])

    const login = React.useCallback((userData: User) => {
        setUser(userData)
        try {
            localStorage.setItem("auth_user", JSON.stringify(userData))
        } catch { }
    }, [])

    const logout = React.useCallback(() => {
        setUser(null)
        try {
            localStorage.removeItem("auth_user")
        } catch { }
    }, [])

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
