"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        if (status === "loading") {
            return
        }

        // Give session a moment to fully load
        const timer = setTimeout(() => {
            if (!session) {
                console.log('[AdminAuthGuard] No session, redirecting to login')
                router.push("/admin/auth-secure-2024")
                return
            }

            const userRole = (session.user as any)?.role
            console.log('[AdminAuthGuard] User role:', userRole)

            if (userRole !== "admin") {
                console.log('[AdminAuthGuard] Not admin, redirecting to login')
                router.push("/admin/auth-secure-2024")
            } else {
                console.log('[AdminAuthGuard] Admin access granted')
                setIsChecking(false)
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [session, status, router])

    if (status === "loading" || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!session || (session.user as any)?.role !== "admin") {
        return null
    }

    return <>{children}</>
}
