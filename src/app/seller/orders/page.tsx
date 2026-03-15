"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Package, DollarSign, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface OrderItem {
    productId: string
    name: string
    quantity: number
    price: number
    sellerId: string
}

interface Order {
    id: string
    orderNumber: string
    status: string
    total: number
    paymentMethod: string
    paymentStatus: string
    items: OrderItem[]
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: any
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

export default function SellerOrdersPage() {
    const { data: session } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [payouts, setPayouts] = useState<Payout[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch orders
                const ordersRes = await fetch("/api/seller/orders")
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json()
                    setOrders(ordersData)
                }

                // Fetch payouts
                const payoutsRes = await fetch("/api/seller/payouts")
                if (payoutsRes.ok) {
                    const payoutsData = await payoutsRes.json()
                    setPayouts(payoutsData)
                }
            } catch (error) {
                console.error("Failed to fetch data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [orders, searchQuery])

    // Calculate stats
    const stats = useMemo(() => {
        const totalOrders = orders.length
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length
        const shippedOrders = orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length
        
        const totalRevenue = orders.reduce((sum, order) => {
            const sellerItems = order.items.filter(item => item.sellerId === session?.user?.id)
            return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
        }, 0)

        const pendingPayouts = payouts
            .filter(p => p.status === 'pending' || p.status === 'processing')
            .reduce((sum, p) => sum + p.payoutAmount, 0)

        const completedPayouts = payouts
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.payoutAmount, 0)

        return {
            totalOrders,
            pendingOrders,
            shippedOrders,
            totalRevenue,
            pendingPayouts,
            completedPayouts
        }
    }, [orders, payouts, session])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600 mt-1">Manage your orders and track payouts</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending to Ship</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">Rs {stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Received Payouts</p>
                                <p className="text-2xl font-bold text-purple-600">Rs {stats.completedPayouts.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payouts Alert */}
            {stats.pendingPayouts > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 text-lg">Payout Pending</h3>
                                <p className="text-blue-700 mt-1">
                                    You have <span className="font-bold">Rs {stats.pendingPayouts.toLocaleString()}</span> pending payout from admin.
                                </p>
                                <p className="text-sm text-blue-600 mt-2">
                                    Admin will send the payment to your configured payment account after processing.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recently Completed Payouts Alert */}
            {payouts.filter(p => p.status === 'completed' && p.paidAt && 
                new Date(p.paidAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length > 0 && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 text-lg">Payment Received!</h3>
                                {payouts
                                    .filter(p => p.status === 'completed' && p.paidAt && 
                                        new Date(p.paidAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
                                    .slice(0, 3)
                                    .map(payout => (
                                        <div key={payout.id} className="mt-2">
                                            <p className="text-green-700">
                                                <span className="font-bold">Rs {payout.payoutAmount.toLocaleString()}</span> was sent to your {payout.paymentMethod} account
                                            </p>
                                            <p className="text-sm text-green-600">
                                                Paid on {new Date(payout.paidAt!).toLocaleDateString()} • 
                                                Revenue: Rs {payout.totalRevenue.toLocaleString()} - 
                                                Commission: Rs {payout.commissionAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by order number or customer name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {filteredOrders.length} Order{filteredOrders.length !== 1 ? 's' : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order #</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => {
                                        const sellerItems = order.items.filter(item => item.sellerId === session?.user?.id)
                                        const sellerRevenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                                        const isPaid = order.paymentStatus === 'paid'

                                        return (
                                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <span className="font-medium">#{order.orderNumber}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium">{order.customerName}</p>
                                                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm">{new Date(order.placedAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm">{sellerItems.length} item{sellerItems.length !== 1 ? 's' : ''}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-semibold">Rs {sellerRevenue.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={`${isPaid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {isPaid ? 'Paid' : 'COD'}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={`${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/seller/orders/${order.id}`}>
                                                            <Button size="sm">View Details</Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payouts History */}
            {payouts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payout History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {payouts.map((payout) => (
                                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                                                {new Date(payout.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Revenue</p>
                                                <p className="font-semibold">Rs {payout.totalRevenue.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Commission</p>
                                                <p className="font-semibold text-red-600">- Rs {payout.commissionAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">You Received</p>
                                                <p className="font-semibold text-green-600">Rs {payout.payoutAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {payout.paidAt && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Paid on {new Date(payout.paidAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
