"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, ShieldCheck, Thermometer, CreditCard, Truck, CheckCircle } from "lucide-react"
import { formatPKR } from "@/lib/utils"
import { useCart } from "@/components/CartProvider"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"

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
    image: "https://images.unsplash.com/photo-1585386959984-a41552231617?auto=format&fit=crop&w=800&q=60",
  },
}

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

function getProduct(slug: string): Product {
  if (sampleCatalog[slug]) return sampleCatalog[slug]
  const rng = seededRng(strHash(slug))
  const price = Math.floor(rng() * 180) + 20
  return {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    brand: "Rasss",
    price,
    oldPrice: undefined,
    rating: 4.3,
    tags: ["Skin Care"],
    image: "https://picsum.photos/seed/product-1/800/800",
  }
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()!
  const product = getProduct(params.slug)
  const comingSoonPrefixes = new Set([
    'acne-cream',
    'acne-scar-cream',
    'acne-serum',
    'acne-face-wash',
    'acne-soap',
    'skin-beauty-cream',
    'skin-moisturizer-lotion',
    'moisturizer-soap',
    'whitening-serum',
    'whitening-cream',
    'whitening-face-wash',
    'whitening-soap',
    'sun-block-lotion-spf-60',
    'sun-block-lotion-spf-100',
    'scabies-lotion',
    'scabies-soap',
    'charcoal-face-wash',
    'facial-products',
    'hair-serum',
    'hair-oil',
    'hair-shampoo',
    'hair-shampoo-plus-conditioner',
    'slimming-tea',
  ])
  const prefix = product.slug.replace(/-product-.*$/, '')
  const isComingSoon = comingSoonPrefixes.has(prefix)
  const images = [
    product.image,
    "https://picsum.photos/seed/product-2/800/800",
    "https://picsum.photos/seed/product-3/800/800",
    "https://picsum.photos/seed/product-4/800/800",
    "https://picsum.photos/seed/product-5/800/800",
  ]
  const [active, setActive] = React.useState(0)
  const { addItem, setOpen } = useCart()

  return (
    <div className="container py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${(product.tags?.[0] || 'Skin Care')}`}>{product.tags?.[0] || 'Skin Care'}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="relative w-full aspect-square bg-white">
            <Image
              src={images[active]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {isComingSoon && (
              <div className="absolute top-3 right-3">
                <Image
                  src="https://img.freepik.com/free-vector/coming-soon-neon-sign_23-2147857976.jpg"
                  alt="Coming Soon"
                  width={64}
                  height={64}
                  className="rounded-md border border-gray-200 shadow object-cover"
                />
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                <Image src={src} alt={product.name} fill className="object-cover" sizes="100px" />
              </button>
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
            <span className="text-3xl font-bold text-primary">{formatPKR(product.price)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-white p-3 flex items-center gap-2 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
              <Truck className="w-4 h-4 text-primary" /> Same-day delivery in Lahore
            </div>
          <div className="rounded-lg border bg-white p-3 flex items-center gap-2 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
              <CreditCard className="w-4 h-4 text-primary" /> Cash on Delivery available
            </div>
          <div className="rounded-lg border bg-white p-3 flex items-center gap-2 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
              <CheckCircle className="w-4 h-4 text-primary" /> In Stock
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <details className="p-4">
              <summary className="cursor-pointer font-medium">Highlights</summary>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {(product.tags || ["Skin Care"]).map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> {t}
                  </div>
                ))}
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Genuine brands</div>
                <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-primary" /> Temperature Controlled</div>
              </div>
            </details>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full h-12 bg-primary text-primary-foreground"
            onClick={() => {
              addItem({ id: product.slug, slug: product.slug, name: product.name, price: product.price, image: product.image }, 1)
              setOpen(true)
            }}
          >
            Add To Cart
          </Button>
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
            <div className="rounded-lg border bg-white p-3 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Cash on Delivery (Lahore)
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <Link key={i} href={`/product/sample-related-${i}`} className="block">
              <div className="rounded-lg border bg-white overflow-hidden hover:shadow-md transition-transform hover:-translate-y-0.5">
                <div className="relative w-full aspect-square">
                  <Image src={`https://picsum.photos/seed/related-${i}/600/600`} alt="Related" fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                </div>
                <div className="p-3 text-sm">Related Item {i}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
