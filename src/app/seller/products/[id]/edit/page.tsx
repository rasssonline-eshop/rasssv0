"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductForm from "@/components/seller/ProductForm"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  oldPrice?: number
  costPrice?: number
  category: string
  brand?: string
  sku?: string
  stock: number
  lowStockThreshold?: number
  image?: string
  images: string[]
  status: string
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/seller/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      const foundProduct = data.products.find((p: Product) => p.id === productId)

      if (!foundProduct) {
        throw new Error("Product not found")
      }

      setProduct(foundProduct)
    } catch (err) {
      console.error("Error fetching product:", err)
      setError(err instanceof Error ? err.message : "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: Product) => {
    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product")
      }

      // Show success message
      alert("Product updated successfully!")

      // Redirect to products list
      router.push("/seller/products")
    } catch (error) {
      console.error("Error updating product:", error)
      alert(error instanceof Error ? error.message : "Failed to update product")
      throw error
    }
  }

  const handleCancel = () => {
    router.push("/seller/products")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || "Product not found"}</p>
          <button
            onClick={() => router.push("/seller/products")}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Back to products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-gray-600">
            Update your product information
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
