"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, Package, Star, Phone, Mail, ShoppingCart } from "lucide-react"
import { formatPKR } from "@/lib/utils"
import { useCart } from "@/components/CartProvider"

interface Seller {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  sellerStatus: string
  createdAt: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  oldPrice?: number
  image?: string
  images: string[]
  category: string
  brand?: string
  stock: number
  rating?: number
  status: string
}

export default function SellerStorePage() {
  const params = useParams()
  const sellerId = params?.sellerId as string
  const { addItem } = useCart()

  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sellerId) {
      fetchSellerStore()
    }
  }, [sellerId])

  const fetchSellerStore = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch seller info
      const sellerRes = await fetch(`/api/sellers/${sellerId}`)
      if (!sellerRes.ok) {
        throw new Error("Seller not found")
      }
      const sellerData = await sellerRes.json()
      setSeller(sellerData.seller)

      // Fetch seller's products
      const productsRes = await fetch(`/api/sellers/${sellerId}/products`)
      if (!productsRes.ok) {
        throw new Error("Failed to fetch products")
      }
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])
    } catch (err) {
      console.error("Error fetching seller store:", err)
      setError(err instanceof Error ? err.message : "Failed to load seller store")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <Navigation />
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !seller) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <Navigation />
        <div className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "This seller store does not exist"}</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  const activeProducts = products.filter(p => p.status === 'active')

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <Navigation />
      
      <div className="container py-8">
        {/* Seller Header */}
        <Card className="bg-white mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Seller Avatar */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 ring-4 ring-gray-100">
                {seller.image ? (
                  <Image
                    src={seller.image}
                    alt={seller.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Store className="w-12 h-12 text-white" />
                )}
              </div>

              {/* Seller Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{seller.name}</h1>
                  {seller.sellerStatus === 'approved' && (
                    <Badge className="bg-green-100 text-green-800 border-0">
                      Verified Seller
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{activeProducts.length} Products</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>4.5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span>Member since {new Date(seller.createdAt).getFullYear()}</span>
                  </div>
                </div>

                {/* Contact Info */}
                {(seller.phone || seller.email) && (
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                    {seller.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{seller.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{seller.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Products</h2>
          <p className="text-gray-600">Browse all products from {seller.name}</p>
        </div>

        {activeProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600">This seller hasn't listed any products yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {product.oldPrice && product.price < product.oldPrice && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-600">
                          Sale
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-600">{product.category}</span>
                      {product.brand && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{product.brand}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary">
                          {formatPKR(product.price)}
                        </p>
                        {product.oldPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPKR(product.oldPrice)}
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        size="icon" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.preventDefault()
                          addItem({
                            id: product.slug,
                            slug: product.slug,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                          }, 1)
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>

                    {product.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    )}

                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-green-600 border-green-600 mt-2 w-fit text-xs">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-600 mt-2 w-fit text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
