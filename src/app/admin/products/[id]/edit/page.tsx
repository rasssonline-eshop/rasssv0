"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAdmin } from "@/components/AdminProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageKitUploader } from "@/src/components/ImageKitUploader"

export default function EditProductPage() {
    const router = useRouter()
    const { id } = useParams()
    const { updateProduct, store } = useAdmin()
    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        sku: "",
        brand: "",
        description: "",
        price: "" as string | number,
        oldPrice: "" as string | number,
        costPrice: "" as string | number,
        category: "",
        stock: "" as string | number,
        lowStockThreshold: "10" as string | number,
        status: "active",
        metaTitle: "",
        metaDescription: "",
        isFeatured: false,
    })

    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/admin/products/${id}`)
                if (res.ok) {
                    const product = await res.json()
                    setFormData({
                        name: product.name || "",
                        slug: product.slug || "",
                        sku: product.sku || "",
                        brand: product.brand || "",
                        description: product.description || "",
                        price: product.price || "",
                        oldPrice: product.oldPrice || "",
                        costPrice: product.costPrice || "",
                        category: product.category || "",
                        stock: product.stock || 0,
                        lowStockThreshold: product.lowStockThreshold || 10,
                        status: product.status || "active",
                        metaTitle: product.metaTitle || "",
                        metaDescription: product.metaDescription || "",
                        isFeatured: product.isFeatured || false,
                    })
                    setImages(product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []))
                }
            } catch (error) {
                console.error("Failed to fetch product", error)
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchProduct()
        }
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle uploaded images from ImageKitUploader
    const handleUpload = (urls: string[]) => {
        setImages(prev => [...prev, ...urls])
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const product = {
            name: formData.name,
            slug: formData.slug,
            price: parseFloat(formData.price.toString()),
            oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice.toString()) : undefined,
            image: images[0] || undefined,
            images,
            brand: formData.brand || undefined,
            category: formData.category,
            description: formData.description,
            sku: formData.sku,
            stock: parseInt(formData.stock.toString()) || 0,
            lowStockThreshold: parseInt(formData.lowStockThreshold.toString()) || 10,
            status: formData.status as 'active' | 'inactive',
            costPrice: formData.costPrice ? parseFloat(formData.costPrice.toString()) : undefined,
            metaTitle: formData.metaTitle || undefined,
            metaDescription: formData.metaDescription || undefined,
            isFeatured: formData.isFeatured,
        }

        await updateProduct(id as string, product)
        router.push('/admin/products')
    }

    if (loading) return <div className="p-8">Loading product...</div>

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-600 mt-1">Update product details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                                />
                            </div>
                            <div>
                                <Label htmlFor="brand">Brand</Label>
                                <Input
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
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
                            />
                        </div>
                    </CardContent>
                </Card>

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

                <div className="flex items-center gap-4">
                    <Button type="submit" size="lg">
                        Update Product
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline" size="lg">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
