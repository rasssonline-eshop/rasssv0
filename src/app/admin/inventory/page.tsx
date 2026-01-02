"use client"

import { useState, useMemo } from "react"
import { useAdmin } from "@/components/AdminProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function InventoryPage() {
    const { store, addMovement } = useAdmin()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        productId: "",
        type: "in" as "in" | "out",
        qty: "",
        note: "",
    })

    const allProducts = useMemo(() => {
        if (!store || !store.productsByCategory) return []
        return Object.entries(store.productsByCategory).flatMap(([category, products]) =>
            products.map(p => ({ ...p, category }))
        )
    }, [store.productsByCategory])

    const lowStockProducts = useMemo(() => {
        return allProducts.filter(p => (p as any).stock < ((p as any).lowStockThreshold || 10))
    }, [allProducts])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const product = allProducts.find(p => p.id === formData.productId)
        if (!product) return

        const movement = {
            id: Math.random().toString(36).substr(2, 9),
            productId: formData.productId,
            productName: product.name,
            type: formData.type,
            qty: parseInt(formData.qty),
            note: formData.note || undefined,
            date: new Date().toISOString(),
        }

        addMovement(movement)
        setFormData({ productId: "", type: "in", qty: "", note: "" })
        setIsDialogOpen(false)
    }

    const recentMovements = useMemo(() => {
        if (!store || !store.inventory) return []
        return [...store.inventory]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
    }, [store.inventory])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 mt-1">Track stock levels and movements</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Stock Movement
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Stock Movement</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="productId">Product *</Label>
                                <select
                                    id="productId"
                                    value={formData.productId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select product</option>
                                    {allProducts.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} (Current: {(product as any).stock || 0})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="type">Type *</Label>
                                <select
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "in" | "out" }))}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="in">Stock In</option>
                                    <option value="out">Stock Out</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="qty">Quantity *</Label>
                                <Input
                                    id="qty"
                                    type="number"
                                    value={formData.qty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, qty: e.target.value }))}
                                    required
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="note">Note</Label>
                                <Input
                                    id="note"
                                    value={formData.note}
                                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                                    placeholder="Optional note..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">Add Movement</Button>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <CardTitle className="text-red-900">Low Stock Alert</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {lowStockProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.category}</p>
                                    </div>
                                    <Badge variant="destructive">
                                        {(product as any).stock || 0} left
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stock Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Stock Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Current Stock</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Low Stock Threshold</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts.map((product) => {
                                    const stock = (product as any).stock || 0
                                    const threshold = (product as any).lowStockThreshold || 10
                                    const isLow = stock < threshold

                                    return (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <p className="font-medium">{product.name}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant="secondary">{product.category}</Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={isLow ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                                                    {stock}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-gray-600">{threshold}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {isLow ? (
                                                    <Badge variant="destructive">Low Stock</Badge>
                                                ) : (
                                                    <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Movements */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Stock Movements</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentMovements.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No stock movements yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentMovements.map((movement) => (
                                <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {movement.type === 'in' ? (
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-red-600" />
                                        )}
                                        <div>
                                            <p className="font-medium">{movement.productName}</p>
                                            <p className="text-sm text-gray-600">
                                                {movement.type === 'in' ? 'Stock In' : 'Stock Out'}: {movement.qty} units
                                            </p>
                                            {movement.note && (
                                                <p className="text-xs text-gray-500 mt-1">{movement.note}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {new Date(movement.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(movement.date).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
