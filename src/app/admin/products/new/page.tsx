"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/components/AdminProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageKitUploader } from "@/src/components/ImageKitUploader"

export default function NewProductPage() {
    const router = useRouter()
    const { addProduct, store } = useAdmin()

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        sku: "",
        brand: "",
        description: "",
        price: "",
        oldPrice: "",
        costPrice: "",
        category: "",
        stock: "",
        lowStockThreshold: "10",
        status: "active",
        metaTitle: "",
        metaDescription: "",
        isFeatured: false,
    })

    const [images, setImages] = useState<string[]>([])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate slug from name
            ...(name === 'name' && !formData.slug ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {})
        }))
    }

    // Handle uploaded images from ImageKitUploader
    const handleUpload = (urls: string[]) => {
        setImages(prev => [...prev, ...urls])
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const product = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            slug: formData.slug,
            price: parseFloat(formData.price),
            oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
            image: images[0] || undefined,
            images,
            brand: formData.brand || undefined,
            category: formData.category,
            description: formData.description,
            sku: formData.sku,
            stock: parseInt(formData.stock) || 0,
            lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
            status: formData.status as 'active' | 'inactive',
            costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
            metaTitle: formData.metaTitle || undefined,
            metaDescription: formData.metaDescription || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFeatured: formData.isFeatured,
        }

        addProduct(product as any)
        router.push('/admin/products')
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Premium Face Cream"
                                />
                            </div>
                            <div>
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="premium-face-cream"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    placeholder="PROD-001"
                                />
                            </div>
                            <div>
                                <Label htmlFor="brand">Brand</Label>
                                <Input
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Nivea"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Detailed product description..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="price">Selling Price (Rs) *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="999"
                                />
                            </div>
                            <div>
                                <Label htmlFor="oldPrice">Compare at Price (Rs)</Label>
                                <Input
                                    id="oldPrice"
                                    name="oldPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.oldPrice}
                                    onChange={handleInputChange}
                                    placeholder="1299"
                                />
                            </div>
                            <div>
                                <Label htmlFor="costPrice">Cost Price (Rs)</Label>
                                <Input
                                    id="costPrice"
                                    name="costPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.costPrice}
                                    onChange={handleInputChange}
                                    placeholder="500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Images - Direct upload to ImageKit CDN */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageKitUploader
                            folder="/products"
                            images={images}
                            onUpload={handleUpload}
                            onRemove={removeImage}
                            maxSizeMB={5}
                            multiple
                        />
                    </CardContent>
                </Card>

                {/* Category & Inventory */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select category</option>
                                    {store.categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="isFeatured">Featured Product</Label>
                            </div>
                            <div>
                                <Label htmlFor="stock">Stock Quantity *</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                                <Input
                                    id="lowStockThreshold"
                                    name="lowStockThreshold"
                                    type="number"
                                    value={formData.lowStockThreshold}
                                    onChange={handleInputChange}
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card>
                    <CardHeader>
                        <CardTitle>SEO (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                                id="metaTitle"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleInputChange}
                                placeholder="Product name - Brand | Rasss"
                            />
                        </div>
                        <div>
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                                id="metaDescription"
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Brief description for search engines..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button type="submit" size="lg">
                        Create Product
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline" size="lg">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div >
    )
}
