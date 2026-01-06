"use client"

import { useAuth } from "@/src/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Client-side admin route protection
 * Redirects non-admin users to home page
 * Note: Primary protection is via middleware, this is a fallback
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push("/login")
            } else if (!isAdmin) {
                router.push("/?error=unauthorized")
            }
        }
    }, [isAuthenticated, isLoading, isAdmin, router])

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Only render children if admin
    if (!isAuthenticated || !isAdmin) {
        return null
    }

    return <>{children}</>
}
