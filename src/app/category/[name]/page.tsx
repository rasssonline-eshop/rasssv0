"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ShoppingCart, RefreshCw } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { formatPKR } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useCart } from "@/components/CartProvider"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/I18nProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

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
  const { t, lang } = useI18n()

  const [apiProducts, setApiProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [refreshKey, setRefreshKey] = React.useState(0)

  const brands = ["Uriage", "Vichy", "Avene", "Bioderma", "Cerave"]
  const rngBase = seededRng(strHash(name))

  const fetchProducts = React.useCallback(async () => {
    setLoading(true)
    try {
      // Add timestamp to prevent caching
      const url = `/api/products?category=${encodeURIComponent(name)}&limit=100&t=${Date.now()}`
      console.log('Fetching products for category:', name)
      console.log('API URL:', url)
      
      const res = await fetch(url, {
        cache: 'no-store'
      })
      
      console.log('API Response status:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('Products received:', data.length)
        console.log('Products:', data)
        setApiProducts(data)
      } else {
        console.error('API error:', res.status, await res.text())
      }
    } catch (e) {
      console.error("Failed to fetch products", e)
    } finally {
      setLoading(false)
    }
  }, [name])

  React.useEffect(() => {
    fetchProducts()
  }, [name, refreshKey, fetchProducts])

  // Auto-refresh every 30 seconds to show new products
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Map API products to view model
  const products = apiProducts.map((p, i) => ({
    id: p.id || String(i),
    name: p.name,
    slug: p.slug || `${name.toLowerCase().replace(/\s+/g, '-')}-product-${i + 1}`,
    price: p.price,
    rating: String(p.rating ?? 4.2),
    brand: p.brand || 'Rasss',
    oldPrice: p.oldPrice || p.price * 1.3,
    image: p.image,
  }))

  const [sort, setSort] = React.useState<'relevance' | 'priceAsc' | 'priceDesc' | 'ratingDesc'>('relevance')
  const [minPrice, setMinPrice] = React.useState<number | ''>('')
  const [maxPrice, setMaxPrice] = React.useState<number | ''>('')
  const [selectedBrand, setSelectedBrand] = React.useState<string>('All')

  const filtered = products.filter((p) => {
    const minPriceNum = minPrice === '' ? 0 : minPrice
    const maxPriceNum = maxPrice === '' ? Infinity : maxPrice
    return p.price >= minPriceNum && p.price <= maxPriceNum && (selectedBrand === 'All' || p.brand === selectedBrand)
  })
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'priceAsc':
        return a.price - b.price
      case 'priceDesc':
        return b.price - a.price
      case 'ratingDesc':
        return parseFloat(b.rating) - parseFloat(a.rating)
      default:
        return (typeof a.id === 'number' ? a.id : 0) - (typeof b.id === 'number' ? b.id : 0)
    }
  })

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        <p className="text-gray-600 mb-4">{t("category.showing")} {sorted.length} {t("common.products")}</p>
        <div className="flex flex-wrap items-center gap-3 mb-8 rounded-lg border bg-white p-3">
          <label className="text-sm text-gray-600">{t("sort.sort")}</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-9 rounded-md border px-3 text-sm bg-white">
            <option value="relevance">{t("sort.relevance")}</option>
            <option value="priceAsc">{t("sort.priceAsc")}</option>
            <option value="priceDesc">{t("sort.priceDesc")}</option>
            <option value="ratingDesc">{t("sort.rating")}</option>
          </select>
          <label className="ml-4 text-sm text-gray-600">{t("filter.brand")}</label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="h-9 rounded-md border px-3 text-sm bg-white">
            <option>All</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <label className="ml-4 text-sm text-gray-600">{t("filter.price")}</label>
          <Input 
            type="number" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} 
            placeholder="Min"
            className="w-24 bg-white" 
          />
          <span className="text-sm text-gray-500">{t("filter.to")}</span>
          <Input 
            type="number" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} 
            placeholder="Max"
            className="w-24 bg-white" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <Card className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image || categoryImages[name] || categoryImages["Skin Care"]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {comingSoonCategories.has(name) && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary">{t("badge.comingSoon")}</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                    {name}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.name}</h3>
                    <Badge>{t("badge.save")} {Math.max(5, Math.round(100 - (product.price / product.oldPrice) * 100))}%</Badge>
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
                          image: product.image || categoryImages[name] || categoryImages["Skin Care"],
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
    <Footer />
    </>
  )
}
