"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, ShieldCheck, Thermometer, CreditCard } from "lucide-react"

type Product = {
  slug: string
  name: string
  brand: string
  price: number
  oldPrice?: number
  rating?: number
  tags?: string[]
  image: string
}

const sampleCatalog: Record<string, Product> = {
  "uriage-depiderm-intensive-care-30ml": {
    slug: "uriage-depiderm-intensive-care-30ml",
    name: "URIAGE DEPIDERM INTENSIVE CARE Anti-dark Spot with 3% pure AHA & Vitamin C 30ML",
    brand: "Uriage",
    price: 104.65,
    oldPrice: 209.31,
    rating: 4.6,
    tags: ["Hyperpigmentation & Dark Spots", "Skin Brightening", "Skin Care"],
    image: "/placeholder.jpg",
  },
}

function getProduct(slug: string): Product {
  return (
    sampleCatalog[slug] || {
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      brand: "Rasss",
      price: Math.floor(Math.random() * 200) + 20,
      oldPrice: undefined,
      rating: 4.3,
      tags: ["Skin Care"],
      image: "/placeholder.jpg",
    }
  )
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()!
  const product = getProduct(params.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="relative w-full aspect-square bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md bg-gray-100 border border-gray-200"
                />
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(product.tags || []).map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold leading-snug">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Brand:</span>
            <span className="font-medium">{product.brand}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">{product.rating} (99 reviews)</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">SAR {product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-500 line-through">SAR {product.oldPrice}</span>
            )}
            {product.oldPrice && (
              <Badge>Online Exclusive · Save {Math.round(100 - (product.price / product.oldPrice) * 100)}%</Badge>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <details className="p-4">
              <summary className="cursor-pointer font-medium">Product Details</summary>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div>
                  <span className="text-gray-600">Brand:</span> {product.brand}
                </div>
                <div>
                  <span className="text-gray-600">Product Type:</span> Cream
                </div>
                <div>
                  <span className="text-gray-600">Concern:</span> Dark Spots, Acne
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-12 bg-primary text-primary-foreground">Add To Cart</Button>
          <Button variant="outline" className="w-full h-12 flex gap-2">
            <Phone className="w-4 h-4" /> Call our Pharmacist
          </Button>
          <div className="grid gap-3">
            <div className="rounded-lg border bg-white p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Genuine brands
            </div>
            <div className="rounded-lg border bg-white p-3 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> Temperature Controlled
            </div>
            <div className="rounded-lg border bg-white p-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Secure Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
