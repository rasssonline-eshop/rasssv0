"use client"

import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    User,
    Menu,
    LogOut,
    AlertCircle,
    CheckCircle,
    Clock,
    Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const navigation = [
    { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
    { name: "Products", href: "/seller/products", icon: Package },
    { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
    { name: "Payment Settings", href: "/seller/payment-settings", icon: Wallet },
    { name: "Profile", href: "/seller/profile", icon: User },
]

export default function SellerLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, status } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const user = session?.user as any
    const isAuthenticated = status === "authenticated"
    const isLoading = status === "loading"

    // Allow public access to registration page
    const isRegistrationPage = pathname === "/seller/register"

    // Role-based route protection (skip for registration page)
    useEffect(() => {
        if (isRegistrationPage) return // Don't protect registration page
        if (status === "loading") return

        if (!isAuthenticated) {
            router.push("/login?redirect=/seller")
            return
        }

        if (user?.role !== "seller") {
            router.push("/")
            return
        }
    }, [isAuthenticated, user, router, status, isRegistrationPage])

    if (isLoading && !isRegistrationPage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render layout for registration page - it has its own layout
    if (isRegistrationPage) {
        return <>{children}</>
    }

    // Don't render if not authenticated or not a seller
    if (!isAuthenticated || user?.role !== "seller") {
        return null
    }

    // Seller status messages
    const getStatusAlert = () => {
        if (user.sellerStatus === "pending") {
            return (
                <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Account Pending Approval</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                        Your seller account is currently under review. You will receive an email once your account has been approved.
                        In the meantime, you can explore the dashboard but cannot manage products.
                    </AlertDescription>
                </Alert>
            )
        }

        if (user.sellerStatus === "rejected") {
            return (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Account Not Approved</AlertTitle>
                    <AlertDescription className="text-red-700">
                        Unfortunately, your seller account application was not approved.
                        {user.rejectionReason && (
                            <span className="block mt-2">
                                <strong>Reason:</strong> {user.rejectionReason}
                            </span>
                        )}
                        Please contact support if you have any questions.
                    </AlertDescription>
                </Alert>
            )
        }

        if (user.sellerStatus === "approved") {
            return (
                <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Account Approved</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Welcome! Your seller account is active. You can now manage your products and view orders.
                    </AlertDescription>
                </Alert>
            )
        }

        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-primary">Seller Dashboard</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                            const isDisabled = user.sellerStatus !== "approved" && item.href !== "/seller"
                            
                            return (
                                <Link
                                    key={item.name}
                                    href={isDisabled ? "#" : item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-colors
                    ${isActive && !isDisabled
                                            ? 'bg-primary text-white'
                                            : isDisabled
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }
                  `}
                                    onClick={(e) => {
                                        if (isDisabled) {
                                            e.preventDefault()
                                        } else {
                                            setSidebarOpen(false)
                                        }
                                    }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User info and logout */}
                    <div className="p-4 border-t border-gray-200 space-y-2">
                        <div className="px-4 py-2">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Switch to Buying
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden mr-4"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {navigation.find(item => pathname === item.href || pathname?.startsWith(item.href + "/"))?.name || "Seller Dashboard"}
                        </h2>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {/* Show status alert on dashboard page only */}
                    {pathname === "/seller" && getStatusAlert()}
                    {children}
                </main>
            </div>
        </div>
    )
}
