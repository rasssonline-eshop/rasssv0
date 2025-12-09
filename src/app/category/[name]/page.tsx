"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { formatPKR } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useCart } from "@/components/CartProvider"
import { Badge } from "@/components/ui/badge"

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

const comingSoonCategories = new Set([
  "Acne cream",
  "Acne scar cream",
  "Acne serum",
  "Acne face wash",
  "Acne soap",
  "Skin beauty cream",
  "Skin moisturizer lotion",
  "Moisturizer soap",
  "Whitening serum",
  "Whitening cream",
  "Whitening face wash",
  "Whitening soap",
  "Sun block lotion spf 60",
  "Sun block lotion spf 100",
  "Scabies lotion",
  "Scabies soap",
  "Charcoal face wash",
  "Facial products",
  "Hair serum",
  "Hair oil",
  "Hair shampoo",
  "Hair shampoo plus conditioner",
  "Slimming Tea",
])

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

export default function CategoryPage() {
  const params = useParams<{ name: string }>()!
  const nameRaw = params.name
  const name = (() => {
    try { return decodeURIComponent(nameRaw) } catch { return nameRaw }
  })()
  const { addItem } = useCart()

  const brands = ["Uriage", "Vichy", "Avene", "Bioderma", "Cerave"]
  const rngBase = seededRng(strHash(name))
  const products = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i,
      name: `${name} Product ${i + 1}`,
      slug: `${name.toLowerCase().replace(/\s+/g, '-')}-product-${i + 1}`,
      price: Math.floor((rngBase() + i * 0.01) * 180) + 20,
      rating: (3 + ((rngBase() + i * 0.03) % 1) * 2).toFixed(1),
      brand: brands[i % brands.length],
      oldPrice: Math.floor((rngBase() + i * 0.02) * 200) + 70,
    }))

  const [sort, setSort] = React.useState<'relevance' | 'priceAsc' | 'priceDesc' | 'ratingDesc'>('relevance')
  const [minPrice, setMinPrice] = React.useState(0)
  const [maxPrice, setMaxPrice] = React.useState(1000)
  const [selectedBrand, setSelectedBrand] = React.useState<string>('All')

  const filtered = products.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice && (selectedBrand === 'All' || p.brand === selectedBrand)
  )
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'priceAsc':
        return a.price - b.price
      case 'priceDesc':
        return b.price - a.price
      case 'ratingDesc':
        return parseFloat(b.rating) - parseFloat(a.rating)
      default:
        return a.id - b.id
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-4">Showing {sorted.length} products</p>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <label className="text-sm text-gray-600">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-9 rounded-md border px-3 text-sm bg-white">
            <option value="relevance">Relevance</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="ratingDesc">Rating</option>
          </select>
          <label className="ml-4 text-sm text-gray-600">Brand</label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="h-9 rounded-md border px-3 text-sm bg-white">
            <option>All</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <label className="ml-4 text-sm text-gray-600">Price</label>
          <Input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-24 bg-white" />
          <span className="text-sm text-gray-500">to</span>
          <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-24 bg-white" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <Card className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={categoryImages[name] || categoryImages["Skin Care"]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {comingSoonCategories.has(name) && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                    {name}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.name}</h3>
                    <Badge>Save {Math.max(5, Math.round(100 - (product.price / product.oldPrice) * 100))}%</Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-primary">{formatPKR(product.price)}</span>
                      <span className="text-gray-500 line-through text-sm">{formatPKR(product.oldPrice)}</span>
                    </div>
                    <Button size="icon" className="bg-primary hover:bg-primary/90"
                      onClick={(e) => {
                        e.preventDefault()
                        addItem({
                          id: product.slug,
                          slug: product.slug,
                          name: product.name,
                          price: product.price,
                          image: categoryImages[name] || categoryImages["Skin Care"],
                        }, 1)
                      }}
                    >
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
