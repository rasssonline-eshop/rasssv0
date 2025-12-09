"use client"

import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  const rawName = typeof name === 'string' ? name : String(name ?? '')
  const baseName = (() => {
    try { return decodeURIComponent(rawName) } catch { return rawName }
  })()
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
      <div className="container">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-6">Showing {products.length} products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isComingSoon && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
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
