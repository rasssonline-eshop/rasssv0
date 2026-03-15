
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, DollarSign, TrendingUp, Wallet, CheckCircle, Clock } from "lucide-react"
import { formatPKR } from "@/lib/utils"
import Link from "next/link"

interface SellerStats {
    totalProducts: number
    activeProducts: number
    inactiveProducts: number
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
}

interface Order {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    sellerRevenue: number
    items: any[]
    customerName: string
    placedAt: string
}

interface Payout {
    id: string
    totalRevenue: number
    commissionAmount: number
    payoutAmount: number
    status: string
    paymentMethod: string
    paidAt: string | null
    createdAt: string
}

export default function SellerDashboardPage() {
    const { data: session } = useSession()
    const user = session?.user as any
    const [stats, setStats] = useState<SellerStats | null>(null)
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [payouts, setPayouts] = useState<Payout[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user?.sellerStatus === "approved") {
            fetchDashboardData()
        } else {
            setLoading(false)
        }
    }, [user])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch stats
            const statsRes = await fetch("/api/seller/stats")
            if (!statsRes.ok) {
                throw new Error("Failed to fetch statistics")
            }
            const statsData = await statsRes.json()
            setStats(statsData.stats)

            // Fetch recent orders
            const ordersRes = await fetch("/api/seller/orders")
            if (!ordersRes.ok) {
                throw new Error("Failed to fetch orders")
            }
            const ordersData = await ordersRes.json()
            
            // Calculate seller revenue for each order
            const ordersWithRevenue = Array.isArray(ordersData) 
                ? ordersData.map((order: any) => {
                    const items = order.items as any[]
                    const sellerItems = items.filter(item => item.sellerId === user?.id)
                    const sellerRevenue = sellerItems.reduce((sum, item) => 
                        sum + (item.price * item.quantity), 0
                    )
                    return { ...order, sellerRevenue }
                  })
                : []
            
            // Get only the 5 most recent orders
            setRecentOrders(ordersWithRevenue.slice(0, 5))

            // Fetch payouts
            const payoutsRes = await fetch("/api/seller/payouts")
            if (payoutsRes.ok) {
                const payoutsData = await payoutsRes.json()
                setPayouts(payoutsData)
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err)
            setError(err instanceof Error ? err.message : "Failed to load dashboard data")
        } finally {
            setLoading(false)
        }
    }

    // Calculate payout stats
    const pendingPayouts = payouts
        .filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((sum, p) => sum + p.payoutAmount, 0)

    const completedPayouts = payouts
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.payoutAmount, 0)

    const recentCompletedPayouts = payouts.filter(p => 
        p.status === 'completed' && 
        p.paidAt && 
        new Date(p.paidAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    )

    // Show welcome message for non-approved sellers
    if (user?.sellerStatus !== "approved") {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                    <p className="mt-2 text-gray-600">
                        {user?.sellerStatus === "pending" 
                            ? "Your account is pending approval. Once approved, you'll be able to manage products and view orders here."
                            : "Your account status prevents access to seller features. Please contact support for assistance."}
                    </p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Welcome back, {user?.name}! Here's an overview of your seller account.
                </p>
            </div>

            {/* Payment Received Alert */}
            {recentCompletedPayouts.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 text-lg">Payment Received!</h3>
                                {recentCompletedPayouts.slice(0, 2).map(payout => (
                                    <div key={payout.id} className="mt-2">
                                        <p className="text-green-700">
                                            <span className="font-bold">{formatPKR(payout.payoutAmount)}</span> was sent to your {payout.paymentMethod} account
                                        </p>
                                        <p className="text-sm text-green-600">
                                            Paid on {new Date(payout.paidAt!).toLocaleDateString()} • 
                                            Revenue: {formatPKR(payout.totalRevenue)} - Commission: {formatPKR(payout.commissionAmount)}
                                        </p>
                                    </div>
                                ))}
                                <Link href="/seller/orders" className="text-sm text-green-700 hover:text-green-800 underline mt-2 inline-block">
                                    View all payouts →
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pending Payout Alert */}
            {pendingPayouts > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 text-lg">Payout Pending</h3>
                                <p className="text-blue-700 mt-1">
                                    You have <span className="font-bold">{formatPKR(pendingPayouts)}</span> pending payout from admin.
                                </p>
                                <p className="text-sm text-blue-600 mt-2">
                                    Admin will send the payment to your configured payment account after processing.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.activeProducts || 0} active, {stats?.inactiveProducts || 0} inactive
                        </p>
                    </CardContent>
                </Card>

                {/* Total Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Orders containing your products
                        </p>
                    </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPKR(stats?.totalRevenue || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From your products
                        </p>
                    </CardContent>
                </Card>

                {/* Received Payouts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Received Payouts</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPKR(completedPayouts)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {pendingPayouts > 0 ? `${formatPKR(pendingPayouts)} pending` : 'All paid'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                                Your latest orders containing your products
                            </CardDescription>
                        </div>
                        <Link href="/seller/orders">
                            <span className="text-sm text-primary hover:underline">View all →</span>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No orders yet</p>
                            <p className="text-sm mt-2">Orders containing your products will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-gray-900">
                                                Order #{order.orderNumber}
                                            </p>
                                            <Badge className={`${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.status}
                                            </Badge>
                                            {order.paymentStatus === 'paid' && (
                                                <Badge className="bg-green-100 text-green-800">
                                                    Paid
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.customerName} • {order.items.length} item(s)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(order.placedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatPKR(order.sellerRevenue)}
                                        </p>
                                        <p className="text-xs text-gray-500">Your revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payout Summary */}
            {payouts.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Payouts</CardTitle>
                                <CardDescription>
                                    Your latest payout transactions
                                </CardDescription>
                            </div>
                            <Link href="/seller/orders">
                                <span className="text-sm text-primary hover:underline">View all →</span>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {payouts.slice(0, 3).map((payout) => (
                                <div
                                    key={payout.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${
                                                payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {payout.status}
                                            </Badge>
                                            <span className="text-sm text-gray-600">
                                                {payout.paidAt 
                                                    ? new Date(payout.paidAt).toLocaleDateString()
                                                    : new Date(payout.createdAt).toLocaleDateString()
                                                }
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            Revenue: {formatPKR(payout.totalRevenue)} - Commission: {formatPKR(payout.commissionAmount)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">{formatPKR(payout.payoutAmount)}</p>
                                        <p className="text-xs text-gray-500">{payout.paymentMethod}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analytics Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Summary</CardTitle>
                    <CardDescription>
                        Quick insights into your seller performance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium">Product Performance</p>
                            <p className="text-2xl font-bold text-blue-900 mt-2">
                                {stats?.activeProducts || 0}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">Active listings</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Order Fulfillment</p>
                            <p className="text-2xl font-bold text-green-900 mt-2">
                                {stats?.totalOrders || 0}
                            </p>
                            <p className="text-xs text-green-600 mt-1">Orders received</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600 font-medium">Revenue Growth</p>
                            <p className="text-2xl font-bold text-purple-900 mt-2">
                                {formatPKR(stats?.totalRevenue || 0)}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">Total earnings</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
