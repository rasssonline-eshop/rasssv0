"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdmin } from "@/components/AdminProvider"
import { AdminAuthGuard } from "@/src/components/AdminAuthGuard"
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react"
import { useMemo } from "react"

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <DashboardContent />
    </AdminAuthGuard>
  )
}

function DashboardContent() {
  const { store } = useAdmin()

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!store || !store.productsByCategory || !store.orders) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        lowStockProducts: 0
      }
    }

    const allProducts = Object.values(store.productsByCategory).flat()
    const totalProducts = allProducts.length
    const totalOrders = store.orders.length
    const totalRevenue = store.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0)
    const lowStockProducts = allProducts.filter(p => (p as any).stock < 10).length

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts
    }
  }, [store])

  const recentOrders = useMemo(() => {
    if (!store || !store.orders) return []
    return [...store.orders]
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
      .slice(0, 5)
  }, [store.orders])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock Alert</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lowStockProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Products below threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.placedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs {order.total.toLocaleString()}</p>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium">Add New Product</p>
            </a>
            <a
              href="/admin/categories"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium">Manage Categories</p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-medium">View All Orders</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
