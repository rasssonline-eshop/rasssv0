"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductForm from "@/components/seller/ProductForm"

interface ProductData {
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

export default function NewProductPage() {
  const router = useRouter()

  const handleSubmit = async (data: ProductData) => {
    try {
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create product")
      }

      // Show success message
      alert("Product created successfully!")

      // Redirect to products list
      router.push("/seller/products")
    } catch (error) {
      console.error("Error creating product:", error)
      alert(error instanceof Error ? error.message : "Failed to create product")
      throw error
    }
  }

  const handleCancel = () => {
    router.push("/seller/products")
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-gray-600">
            Create a new product listing for your store
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
