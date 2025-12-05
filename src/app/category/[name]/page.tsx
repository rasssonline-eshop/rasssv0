"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { formatPKR } from "@/lib/utils"

const categoryImages: Record<string, string> = {
  Fragrances: "https://picsum.photos/seed/fragrances/600/600",
  Makeup: "https://picsum.photos/seed/makeup/600/600",
  "Baby Care & Diapers": "https://picsum.photos/seed/baby-diapers/600/600",
  Vitamins: "https://picsum.photos/seed/vitamins/600/600",
  "Skin Care": "https://picsum.photos/seed/skincare/600/600",
  "Baby Accessories": "https://picsum.photos/seed/baby-accessories/600/600",
  "Hair Care": "https://picsum.photos/seed/haircare/600/600",
  "Personal Care": "https://picsum.photos/seed/personal-care/600/600",
}

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
      <div className="container">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-8">Showing {products.length} products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={categoryImages[name] || categoryImages["Skin Care"]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">{formatPKR(product.price)}</span>
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
