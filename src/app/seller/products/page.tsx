"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductList from "@/components/seller/ProductList"
import DeleteProductDialog from "@/components/seller/DeleteProductDialog"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    oldPrice?: number
    stock: number
    status: string
    image?: string
    category: string
    brand?: string
    sku?: string
    createdAt: string
    updatedAt: string
}

export default function SellerProductsPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/seller/products")
            if (!response.ok) {
                throw new Error("Failed to fetch products")
            }

            const data = await response.json()
            setProducts(data.products || [])
        } catch (err) {
            console.error("Error fetching products:", err)
            setError(err instanceof Error ? err.message : "Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (productId: string) => {
        router.push(`/seller/products/${productId}/edit`)
    }

    const handleDelete = (productId: string) => {
        const product = products.find(p => p.id === productId)
        if (product) {
            setProductToDelete(product)
            setDeleteDialogOpen(true)
        }
    }

    const confirmDelete = async () => {
        if (!productToDelete) return

        try {
            setDeleting(true)

            const response = await fetch(`/api/seller/products/${productToDelete.id}`, {
                method: "DELETE",
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete product")
            }

            // Remove product from list
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id))

            // Show success message
            alert("Product deleted successfully!")

            // Close dialog
            setDeleteDialogOpen(false)
            setProductToDelete(null)
        } catch (error) {
            console.error("Error deleting product:", error)
            alert(error instanceof Error ? error.message : "Failed to delete product")
        } finally {
            setDeleting(false)
        }
    }

    const handleAddProduct = () => {
        router.push("/seller/products/new")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your product listings here.
                    </p>
                </div>
                <Button onClick={handleAddProduct}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />

            <DeleteProductDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                productName={productToDelete?.name || ""}
                deleting={deleting}
            />
        </div>
    )
}
