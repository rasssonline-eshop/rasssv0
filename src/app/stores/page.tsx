"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Store, Package, Star, Search } from "lucide-react"

interface Seller {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  sellerStatus: string
  createdAt: string
  _count?: {
    products: number
  }
}

export default function StoresPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchSellers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSellers(sellers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = sellers.filter(
        (seller) =>
          seller.name.toLowerCase().includes(query) ||
          seller.email.toLowerCase().includes(query)
      )
      setFilteredSellers(filtered)
    }
  }, [searchQuery, sellers])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stores")
      if (!response.ok) throw new Error("Failed to fetch sellers")
      
      const data = await response.json()
      setSellers(data.sellers || [])
      setFilteredSellers(data.sellers || [])
    } catch (error) {
      console.error("Error fetching sellers:", error)
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
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <Navigation />
      
      <div className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Seller Stores</h1>
          <p className="text-gray-600 mb-6">
            Discover products from verified sellers on Rasss
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search stores by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Results Count */}
        {filteredSellers.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredSellers.length} {filteredSellers.length === 1 ? "store" : "stores"}
            </p>
          </div>
        )}

        {/* Stores Grid */}
        {filteredSellers.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No stores found" : "No stores available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Check back later for new seller stores"}
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery("")} variant="outline">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSellers.map((seller) => (
              <Link key={seller.id} href={`/store/${seller.id}`}>
                <Card className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40 h-full flex flex-col">
                  {/* Store Header with Avatar */}
                  <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
                      {seller.image ? (
                        <Image
                          src={seller.image}
                          alt={seller.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Store className="w-10 h-10 text-primary" />
                      )}
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-center mb-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                        {seller.name}
                      </h3>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Verified Seller
                      </Badge>
                    </div>

                    {/* Store Stats */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{seller._count?.products || 0} Products</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>4.5 Rating</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Store className="w-4 h-4" />
                        <span>Since {new Date(seller.createdAt).getFullYear()}</span>
                      </div>
                    </div>

                    {/* Visit Store Button */}
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      size="sm"
                    >
                      Visit Store
                    </Button>
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
