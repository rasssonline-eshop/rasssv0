"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, ShieldCheck, Thermometer, CreditCard, Truck, CheckCircle, ShoppingCart } from "lucide-react"
import { formatPKR } from "@/lib/utils"
import { useCart } from "@/components/CartProvider"
import { useLocation } from "@/components/LocationProvider"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useI18n } from "@/components/I18nProvider"

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
  try {
    const raw = localStorage.getItem('adminStore')
    if (raw) {
      const store = JSON.parse(raw)
      for (const list of Object.values(store.productsByCategory || {})) {
        const found = (list as any[]).find(p => p.slug === slug)
        if (found) return {
          slug: found.slug || slug,
          name: found.name,
          brand: found.brand || 'Rasss',
          price: found.price,
          oldPrice: found.oldPrice,
          rating: found.rating || 4.3,
          tags: ['Skin Care'],
          image: found.image || "https://picsum.photos/seed/product-1/800/800",
        }
      }
    }
  } catch { }
  if (sampleCatalog[slug]) return sampleCatalog[slug]
  const rng = seededRng(strHash(slug))
  const price = Math.floor(rng() * 180) + 20
  const prefix = slug.replace(/-product-.*$/, '')
  const prefixImageMap: Record<string, string> = {
    'fragrances': '/fragrances.jpg',
    'makeup': '/makeup-products.png',
    'baby-care-&-diapers': '/baby-care.jpg',
    'vitamins': '/assorted-vitamins.png',
    'skin-care': '/skincare.jpg',
    'baby-accessories': '/baby-accessories.jpg',
    'hair-care': '/hair-care.jpg',
    'personal-care': '/personal-care.jpg',
    'infant-milk-powder': '/baby-care.jpg',
    'cereals': '/personal-care.jpg',
    'balm': '/personal-care.jpg',
    'heat-spray-(pain-killer)': '/personal-care.jpg',
    'heat-lotion-(pain-killer)': '/personal-care.jpg',
    'heat-cream-(pain-killer)': '/personal-care.jpg',
    'hair-removing-spray': '/hair-care.jpg',
    'acne-cream': '/skincare.jpg',
    'acne-scar-cream': '/skincare.jpg',
    'acne-serum': '/skincare.jpg',
    'acne-face-wash': '/skincare.jpg',
    'acne-soap': '/skincare.jpg',
    'skin-beauty-cream': '/skincare.jpg',
    'skin-moisturizer-lotion': '/skincare.jpg',
    'moisturizer-soap': '/skincare.jpg',
    'whitening-serum': '/skincare.jpg',
    'whitening-cream': '/skincare.jpg',
    'whitening-face-wash': '/skincare.jpg',
    'whitening-soap': '/skincare.jpg',
    'sun-block-lotion-spf-60': '/skincare.jpg',
    'sun-block-lotion-spf-100': '/skincare.jpg',
    'scabies-lotion': '/personal-care.jpg',
    'scabies-soap': '/personal-care.jpg',
    'charcoal-face-wash': '/skincare.jpg',
    'facial-products': '/skincare.jpg',
    'hair-serum': '/hair-care.jpg',
    'hair-oil': '/hair-care.jpg',
    'hair-shampoo': '/hair-care.jpg',
    'hair-shampoo-plus-conditioner': '/hair-care.jpg',
    'slimming-tea': '/personal-care.jpg',
  }
  return {
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    brand: "Rasss",
    price,
    oldPrice: undefined,
    rating: 4.3,
    tags: ["Skin Care"],
    image: prefixImageMap[prefix] || "https://picsum.photos/seed/product-1/800/800",
  }
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()!
  const slugRaw = params.slug
  const slug = (() => {
    try { return decodeURIComponent(slugRaw) } catch { return slugRaw }
  })()
  const product = getProduct(slug)
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
  const { city } = useLocation()
  const sameDay = city.toLowerCase() === 'lahore'
  const { t } = useI18n()

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 animate-fade-in-up">
      <Breadcrumb className="mb-8">
        <BreadcrumbList className="text-muted-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-primary transition-colors">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${(product.tags?.[0] || 'Skin Care')}`} className="hover:text-primary transition-colors">
              {product.tags?.[0] || 'Skin Care'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Product Images - Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative group overflow-hidden">
            <div className="relative w-full aspect-square bg-white flex items-center justify-center">
              <Image
                src={images[active]}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {isComingSoon && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">Coming Soon</Badge>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === active
                  ? 'border-primary ring-2 ring-primary/20 scale-95 shadow-md'
                  : 'border-transparent bg-gray-50 hover:border-primary/50'
                  }`}
              >
                <Image src={src} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details - Right Column */}
        <div className="lg:col-span-5 space-y-8 sticky top-24 self-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(product.tags || []).map((t) => (
                <Badge key={t} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 transition-colors px-3 py-1">
                  {t}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 tracking-tight text-balance">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md text-yellow-700 border border-yellow-100">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-yellow-600/70">(99 reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Brand:</span>
                <span className="font-semibold text-gray-900">{product.brand}</span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
            <span className="text-4xl font-extrabold text-primary tracking-tight">
              {formatPKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through mb-1">
                {formatPKR(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-semibold gap-2"
              onClick={() => {
                addItem({ id: product.slug, slug: product.slug, name: product.name, price: product.price, image: images[active] }, 1);
                setOpen(true);
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              {t("button.addToCart")}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 flex gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors rounded-xl font-medium"
              onClick={() => {
                const whatsappNumber = '923001234567'; // Fallback logic simplified for visual edit
                window.open(`https://wa.me/${whatsappNumber}?text=Hi, I need help with ${encodeURIComponent(product.name)}`, '_blank')
              }}
            >
              <Phone className="w-4 h-4" /> Chat with Pharmacist
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: CheckCircle, label: t("product.genuineBrands"), desc: "100% Authentic" },
              { icon: Thermometer, label: t("product.temperatureControlled"), desc: "ISO Certified Storage" },
              { icon: Truck, label: "Fast Delivery", desc: sameDay ? `Same-day in ${city}` : "2-4 Days Nationwide" },
              { icon: ShieldCheck, label: "Secure Payment", desc: "COD & Bank Transfer" }
            ].map((feature, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100/50 hover:bg-white hover:shadow-md transition-all duration-300 group">
                <feature.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{feature.label}</h4>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <details className="group">
              <summary className="cursor-pointer p-4 font-medium flex items-center justify-between hover:bg-gray-50 transition-colors">
                <span>{t("product.highlights")}</span>
                <span className="group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-600 leading-relaxed">
                <p className="mb-4">Premium quality product sourced directly from verified distributors. Stored under controlled temperatures to ensure maximum efficacy.</p>
                <ul className="space-y-2">
                  {(product.tags || ["Skin Care"]).map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="mt-24 border-t border-gray-100 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
          <Link href="/category/all" className="text-primary hover:text-primary/80 font-medium text-sm">View More</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} href={`/product/sample-related-${i}`} className="group block">
              <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/related-${i}/600/600`}
                    alt="Related"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Coming Soon</p>
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">Related Item {i}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
