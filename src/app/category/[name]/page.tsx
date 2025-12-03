"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { useParams } from "next/navigation"

export default function CategoryPage() {
  const params = useParams<{ name: string }>()!
  const name = params.name

  const products = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i,
      name: `${name} Product ${i + 1}`,
      slug: `${name.toLowerCase().replace(/\s+/g, '-')}-product-${i + 1}`,
      price: Math.floor(Math.random() * 200) + 20,
      rating: (Math.random() * 2 + 3).toFixed(1),
    }))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-8">Showing {products.length} products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">SAR {product.price}</span>
                    <Button size="icon" className="bg-primary hover:bg-primary/90">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
