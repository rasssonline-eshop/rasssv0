"use client"

import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"

export default function CategoryPage() {
  const { name } = useParams()
  function strHash(s: string) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
    return h >>> 0
  }

  function seededRng(seed: number) {
    let a = seed || 1
    return () => {
      a = (a + 0x6D2B79F5) >>> 0
      let t = Math.imul(a ^ (a >>> 15), a | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const baseName = typeof name === 'string' ? name : String(name ?? '')
  const rngBase = seededRng(strHash(baseName))
  const comingSoonCategories = new Set([
    'Acne cream',
    'Acne scar cream',
    'Acne serum',
    'Acne face wash',
    'Acne soap',
    'Skin beauty cream',
    'Skin moisturizer lotion',
    'Moisturizer soap',
    'Whitening serum',
    'Whitening cream',
    'Whitening face wash',
    'Whitening soap',
    'Sun block lotion spf 60',
    'Sun block lotion spf 100',
    'Scabies lotion',
    'Scabies soap',
    'Charcoal face wash',
    'Facial products',
    'Hair serum',
    'Hair oil',
    'Hair shampoo',
    'Hair shampoo plus conditioner',
    'Slimming Tea',
  ])
  const isComingSoon = comingSoonCategories.has(baseName)

  const products = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i,
      name: `${baseName} Product ${i + 1}`,
      price: Math.floor((rngBase() + i * 0.01) * 200) + 20,
      rating: (3 + ((rngBase() + i * 0.03) % 1) * 2).toFixed(1),
      image: `/placeholder.svg?height=300&width=300&query=${baseName}-product-${i}`,
    }))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-8">Showing {products.length} products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-transform hover:-translate-y-0.5">
              <div className="relative aspect-square overflow-hidden bg-gray-200">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
                {isComingSoon && (
                  <img
                    src="https://img.freepik.com/free-vector/coming-soon-neon-sign_23-2147857976.jpg"
                    alt="Coming Soon"
                    className="absolute top-3 right-3 w-16 h-16 object-cover rounded-md border border-white/40 shadow"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-primary">SAR {product.price}</span>
                  <Button size="icon" className="bg-primary hover:bg-primary-dark">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
