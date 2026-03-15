"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Store, 
  Package, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  ExternalLink,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { formatPKR } from "@/lib/utils"

interface Seller {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  sellerStatus: string
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  status: string
  image?: string
  category: string
}

interface SellerStats {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalRevenue: number
}

export default function AdminSellerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const sellerId = params?.sellerId as string

  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sellerId) {
      fetchSellerDetails()
    }
  }, [sellerId])

  const fetchSellerDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch seller info
      const sellerRes = await fetch(`/api/admin/sellers/${sellerId}`)
      if (!sellerRes.ok) throw new Error("Failed to fetch seller")
      const sellerData = await sellerRes.json()
      setSeller(sellerData.seller)

      // Fetch seller's products
      const productsRes = await fetch(`/api/admin/sellers/${sellerId}/products`)
      if (!productsRes.ok) throw new Error("Failed to fetch products")
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])

      // Fetch seller stats
      const statsRes = await fetch(`/api/admin/sellers/${sellerId}/stats`)
      if (!statsRes.ok) throw new Error("Failed to fetch stats")
      const statsData = await statsRes.json()
      setStats(statsData.stats)
    } catch (err) {
      console.error("Error fetching seller details:", err)
      setError(err instanceof Error ? err.message : "Failed to load seller details")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus} this seller?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      // Refresh seller details
      await fetchSellerDetails()
      toast.success(`Seller ${newStatus} successfully`)
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update seller status")
    }
  }

  const handleDeleteStore = async () => {
    const confirmMessage = `Are you sure you want to DELETE this seller store?\n\nThis will permanently delete:\n- The seller account\n- All ${products.length} products\n- All associated data\n\nThis action CANNOT be undone!`
    
    if (!confirm(confirmMessage)) {
      return
    }

    // Double confirmation for safety
    const doubleConfirm = prompt(
      `Type "DELETE" to confirm deletion of ${seller?.name}'s store:`
    )

    if (doubleConfirm !== "DELETE") {
      toast.error("Deletion cancelled - confirmation text did not match")
      return
    }

    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete store")
      }

      toast.success("Seller store deleted successfully")
      
      // Redirect to sellers list after a short delay
      setTimeout(() => {
        router.push("/admin/sellers")
      }, 1500)
    } catch (err) {
      console.error("Error deleting store:", err)
      toast.error(err instanceof Error ? err.message : "Failed to delete store")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error || "Seller not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sellers
        </Button>
        <div className="flex gap-2">
          {/* View Store Button */}
          <Link href={`/store/${sellerId}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View Store
            </Button>
          </Link>

          {/* Status Change Buttons */}
          {seller.sellerStatus === "pending" && (
            <>
              <Button
                onClick={() => handleStatusChange("approved")}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Seller
              </Button>
              <Button
                onClick={() => handleStatusChange("rejected")}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Seller
              </Button>
            </>
          )}
          {seller.sellerStatus === "rejected" && (
            <Button
              onClick={() => handleStatusChange("approved")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Seller
            </Button>
          )}

          {/* Delete Store Button */}
          <Button
            onClick={handleDeleteStore}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Store
          </Button>
        </div>
      </div>

      {/* Seller Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {seller.image ? (
                  <Image
                    src={seller.image}
                    alt={seller.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Store className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{seller.name}</CardTitle>
                <CardDescription>{seller.email}</CardDescription>
              </div>
            </div>
            {getStatusBadge(seller.sellerStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{seller.email}</p>
                </div>
              </div>
              {seller.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{seller.phone}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Registered</p>
                  <p className="font-medium">
                    {new Date(seller.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Store className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Seller ID</p>
                  <p className="font-medium font-mono text-sm">{seller.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Products</CardTitle>
              <XCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.inactiveProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPKR(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>All products listed by this seller</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No products yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPKR(product.price)}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                    <Badge
                      variant={product.status === 'active' ? 'default' : 'secondary'}
                      className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {product.status}
                    </Badge>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
