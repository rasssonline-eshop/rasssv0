"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, ShieldCheck, Thermometer, Truck, CheckCircle, ShoppingCart } from "lucide-react"
import { formatPKR } from "@/lib/utils"
import { useCart } from "@/components/CartProvider"
import { useLocation } from "@/components/LocationProvider"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useI18n } from "@/components/I18nProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

type ProductVariant = {
  id: string
  name: string
  sku?: string
  price?: number
  stock: number
  attributes: Record<string, string>
  image?: string
  isDefault: boolean
}

type Product = {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  oldPrice?: number
  rating?: number
  tags?: string[]
  image: string
  images?: string[]
  category?: string
  description?: string
  stock?: number
  variants?: ProductVariant[]
  owner?: {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }
}

const sampleCatalog: Record<string, Product> = {
  "uriage-depiderm-intensive-care-30ml": {
    id: "sample-1",
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
          id: found.id || slug,
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
    id: slug,
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
  
  // All hooks must be called before any conditional returns
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [active, setActive] = React.useState(0)
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(null)
  const { addItem, setOpen } = useCart()
  const { city } = useLocation()
  const { t } = useI18n()

  // Set default variant when product loads
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0]
      setSelectedVariant(defaultVariant)
    }
  }, [product, selectedVariant])

  // Update main image when variant with image is selected
  React.useEffect(() => {
    if (selectedVariant?.image && product) {
      // Find if variant image exists in images array
      const variantImageIndex = images.findIndex(img => img === selectedVariant.image)
      if (variantImageIndex !== -1) {
        setActive(variantImageIndex)
      } else {
        // If variant image not in array, temporarily show it as active image
        // This will be handled in the images array construction below
        setActive(0)
      }
    }
  }, [selectedVariant])

  React.useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        } else {
          // Fallback to local storage or sample data
          setProduct(getProduct(slug))
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        setProduct(getProduct(slug))
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center">Product not found</div>
      </div>
    )
  }

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
  
  // Build images array - if variant has image, show it first
  let images = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.image,
        "https://picsum.photos/seed/product-2/800/800",
        "https://picsum.photos/seed/product-3/800/800",
        "https://picsum.photos/seed/product-4/800/800",
        "https://picsum.photos/seed/product-5/800/800",
      ]
  
  // If selected variant has an image, add it to the beginning of images array
  if (selectedVariant?.image) {
    images = [selectedVariant.image, ...images.filter(img => img !== selectedVariant.image)]
  }
  
  const sameDay = city.toLowerCase() === 'lahore'
  const hasOwner = product.owner && product.owner.id

  return (
    <>
      <Header />
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

            {hasOwner && product.owner && (
              <Link href={`/store/${product.owner.id}`}>
                <div className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                  {product.owner.image ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-100">
                      <Image 
                        src={product.owner.image} 
                        alt={product.owner.name || 'Store'} 
                        width={56} 
                        height={56}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0 ring-2 ring-gray-100">
                      {(product.owner.name || 'S')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 font-medium mb-0.5">
                      {product.owner.role === 'seller' ? 'Sold by' : 'By'}
                    </div>
                    <div className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                      {product.owner.name || 'Store'}
                    </div>
                    <div className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
                      Visit Store 
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  {product.owner.role === 'seller' && (
                    <Badge className="bg-green-100 text-green-800 border-0 shrink-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </Link>
            )}
          </div>

          {/* Product Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900">Select Variant</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id
                  const isOutOfStock = variant.stock === 0
                  
                  return (
                    <button
                      key={variant.id}
                      onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                      disabled={isOutOfStock}
                      className={`
                        p-3 rounded-lg border-2 text-left transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-primary/50'
                        }
                        ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {variant.image && (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
                            <Image
                              src={variant.image}
                              alt={variant.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{variant.name}</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <span key={key} className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          {variant.price && (
                            <div className="font-bold text-primary">{formatPKR(variant.price)}</div>
                          )}
                          <div className={`text-xs ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                            {isOutOfStock ? 'Out of Stock' : `${variant.stock} in stock`}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
            <span className="text-4xl font-extrabold text-primary tracking-tight">
              {formatPKR(selectedVariant?.price || product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through mb-1">
                {formatPKR(product.oldPrice)}
              </span>
            )}
            {selectedVariant && (
              <span className="text-sm text-gray-600 mb-2">
                ({selectedVariant.name})
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-semibold gap-2"
              onClick={() => {
                const variantToAdd = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants.find(v => v.isDefault) || product.variants[0] : null)
                const priceToUse = variantToAdd?.price || product.price
                const imageToUse = variantToAdd?.image || images[active]
                
                addItem({ 
                  id: product.slug, 
                  slug: product.slug, 
                  name: product.name, 
                  price: priceToUse, 
                  image: imageToUse,
                  variantId: variantToAdd?.id,
                  variantName: variantToAdd?.name
                }, 1);
                setOpen(true);
              }}
              disabled={selectedVariant ? selectedVariant.stock === 0 : (product.stock === 0)}
            >
              <ShoppingCart className="w-5 h-5" />
              {selectedVariant && selectedVariant.stock === 0 ? 'Out of Stock' : t("button.addToCart")}
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
    <Footer />
    </>
  )
}
