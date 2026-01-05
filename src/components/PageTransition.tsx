"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isAnimating, setIsAnimating] = useState(false)

    // Reset animation on route change
    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 500)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div
            key={pathname}
            className="animate-fade-in-up"
        >
            {children}
        </div>
    )
}
