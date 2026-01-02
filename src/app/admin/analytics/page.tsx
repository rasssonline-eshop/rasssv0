"use client"

import { useMemo } from "react"
import { useAdmin } from "@/components/AdminProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
    const { store } = useAdmin()

    const analytics = useMemo(() => {
        const allProducts = Object.values(store.productsByCategory).flat()

        // Calculate total revenue
        const totalRevenue = store.orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, order) => sum + order.total, 0)

        // Calculate average order value
        const completedOrders = store.orders.filter(o => o.status !== 'cancelled')
        const avgOrderValue = completedOrders.length > 0
            ? totalRevenue / completedOrders.length
            : 0

        // Get best selling products
        const productSales: Record<string, number> = {}
        store.orders.forEach(order => {
            order.items.forEach(item => {
                productSales[item.productId] = (productSales[item.productId] || 0) + item.qty
            })
        })

        const bestSellers = Object.entries(productSales)
            .map(([productId, qty]) => {
                const product = allProducts.find(p => p.id === productId)
                return product ? { product, qty } : null
            })
            .filter(Boolean)
            .sort((a, b) => (b?.qty || 0) - (a?.qty || 0))
            .slice(0, 5)

        // Category-wise sales
        const categorySales: Record<string, number> = {}
        store.orders.forEach(order => {
            order.items.forEach(item => {
                const product = allProducts.find(p => p.id === item.productId)
                if (product) {
                    categorySales[product.category] = (categorySales[product.category] || 0) + (item.qty * item.price)
                }
            })
        })

        const topCategories = Object.entries(categorySales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)

        return {
            totalRevenue,
            totalOrders: store.orders.length,
            totalProducts: allProducts.length,
            avgOrderValue,
            bestSellers,
            topCategories,
        }
    }, [store])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">Track your business performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                        <DollarSign className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs {analytics.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                        <p className="text-xs text-gray-500 mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs {Math.round(analytics.avgOrderValue).toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">Per order</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                        <Package className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                        <p className="text-xs text-gray-500 mt-1">In catalog</p>
                    </CardContent>
                </Card>
            </div>

            {/* Best Sellers */}
            <Card>
                <CardHeader>
                    <CardTitle>Best Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.bestSellers.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No sales data yet</p>
                    ) : (
                        <div className="space-y-4">
                            {analytics.bestSellers.map((item, index) => (
                                <div key={item?.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{item?.product.name}</p>
                                            <p className="text-sm text-gray-600">{item?.product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{item?.qty} sold</p>
                                        <p className="text-sm text-gray-600">
                                            Rs {((item?.qty || 0) * (item?.product.price || 0)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Categories by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.topCategories.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No sales data yet</p>
                    ) : (
                        <div className="space-y-4">
                            {analytics.topCategories.map(([category, revenue]) => (
                                <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium">{category}</p>
                                    <p className="font-semibold text-green-600">Rs {revenue.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
