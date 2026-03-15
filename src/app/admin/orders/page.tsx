"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye } from "lucide-react"
import Link from "next/link"

interface Order {
    id: string
    orderNumber: string
    status: string
    total: number
    paymentMethod: string
    paymentStatus: string
    customerName: string
    customerEmail: string
    placedAt: string
    transactionId?: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Fetch orders from database
    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/admin/orders")
                if (res.ok) {
                    const data = await res.json()
                    setOrders(data)
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === "all" || order.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [orders, searchQuery, statusFilter])

    // Calculate stats for online payments
    const stats = useMemo(() => {
        const onlineOrders = orders.filter((o: any) => o.paymentMethod && o.paymentMethod !== 'cod')
        const paidOnlineOrders = onlineOrders.filter((o: any) => o.paymentStatus === 'paid')
        const pendingOrders = onlineOrders.filter((o: any) => o.paymentStatus !== 'paid')
        const totalRevenue = paidOnlineOrders.reduce((sum, o) => sum + o.total, 0)
        
        return {
            totalOnlinePayments: paidOnlineOrders.length,
            pendingVerification: pendingOrders.length,
            totalRevenue
        }
    }, [orders])

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        // Update order status in database
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            
            if (res.ok) {
                // Update local state
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            }
        } catch (error) {
            console.error("Failed to update order status:", error)
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        }
        return variants[status] || 'bg-gray-100 text-gray-800'
    }

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
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">Manage customer orders</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Online Payments Received</p>
                                <p className="text-2xl font-bold text-green-600">{stats.totalOnlinePayments}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Verification</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue (Online)</p>
                                <p className="text-2xl font-bold text-blue-600">Rs {stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by order ID or customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
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
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => {
                                        const orderData = order as any
                                        const isOnlinePayment = orderData.paymentMethod && orderData.paymentMethod !== 'cod'
                                        const isPaid = orderData.paymentStatus === 'paid'
                                        
                                        return (
                                            <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isOnlinePayment && isPaid ? 'bg-green-50' : ''}`}>
                                                <td className="py-4 px-4">
                                                    <span className="font-medium">#{order.id}</span>
                                                    {isOnlinePayment && isPaid && (
                                                        <Badge className="ml-2 bg-green-600 text-white text-xs">PAID</Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium">{orderData.customerName || 'N/A'}</p>
                                                        <p className="text-sm text-gray-500">{orderData.customerEmail || ''}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p>{new Date(order.placedAt).toLocaleDateString()}</p>
                                                    <p className="text-sm text-gray-500">{new Date(order.placedAt).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <Badge className={`${isOnlinePayment ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {orderData.paymentMethod === 'cod' ? 'COD' : 'Online'}
                                                        </Badge>
                                                        {orderData.transactionId && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                TXN: {orderData.transactionId}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-semibold">Rs {order.total.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
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
        </div>
    )
}
