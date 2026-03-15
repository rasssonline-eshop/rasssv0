"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type ProductWithOwner = {
    id: string
    name: string
    slug: string
    price: number
    oldPrice?: number
    image?: string
    category: string
    brand?: string
    stock: number
    status: string
    owner: {
        id: string
        name: string | null
        email: string
        role: string
    }
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductWithOwner[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [categories, setCategories] = useState<string[]>([])

    // Fetch products with owner information
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/admin/products')
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                    
                    // Extract unique categories
                    const uniqueCategories = Array.from(new Set(data.map((p: ProductWithOwner) => p.category)))
                    setCategories(uniqueCategories as string[])
                }
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [products, searchQuery, selectedCategory])

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`/api/admin/products/${id}`, {
                    method: 'DELETE'
                })
                if (res.ok) {
                    setProducts(products.filter(p => p.id !== id))
                }
            } catch (error) {
                console.error("Failed to delete product", error)
            }
        }
    }

    if (loading) {
        return <div className="p-8">Loading products...</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No products found</p>
                            <Link href="/admin/products/new">
                                <Button>Add Your First Product</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {product.image && (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-md object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        {product.brand && (
                                                            <p className="text-sm text-gray-500">{product.brand}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant="secondary">{product.category}</Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.owner.name || 'Unknown'}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {product.owner.role === 'admin' ? 'Admin' : 'Seller'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-semibold">Rs {product.price.toLocaleString()}</p>
                                                    {product.oldPrice && (
                                                        <p className="text-sm text-gray-500 line-through">
                                                            Rs {product.oldPrice.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`
                          ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}
                        `}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                                    {product.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/product/${product.slug || product.id}`} target="_blank">
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
