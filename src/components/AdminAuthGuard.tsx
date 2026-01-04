"use client"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    // Security disabled as per user request - allows direct access to admin dashboard
    return <>{children}</>
}
