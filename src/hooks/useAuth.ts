"use client"

import { useSession } from "next-auth/react"

/**
 * Custom auth hook that wraps NextAuth's useSession
 * Provides convenient access to auth state and role checks
 */
export function useAuth() {
    const { data: session, status } = useSession()

    return {
        // Auth state
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",

        // User data
        user: session?.user,
        role: (session?.user as any)?.role as string | undefined,

        // Role checks
        isAdmin: (session?.user as any)?.role === "admin",
        isUser: (session?.user as any)?.role === "user" || (session?.user as any)?.role === "customer",
        isSeller: (session?.user as any)?.role === "seller",

        // Session object for advanced use
        session,
        status,
    }
}
