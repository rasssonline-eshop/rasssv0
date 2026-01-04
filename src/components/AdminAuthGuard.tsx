"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            router.push("/admin/auth-secure-2024")
            return
        }

        if ((session.user as any)?.role !== "admin") {
            router.push("/admin/auth-secure-2024")
        }
    }, [session, status, router])

    if (status === "loading") {
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
