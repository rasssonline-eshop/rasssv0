"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, Eye, ExternalLink } from "lucide-react"
import { SellerDetailsModal } from "./SellerDetailsModal"

type Seller = {
  id: string
  name: string | null
  email: string
  phone: string | null
  sellerStatus: string | null
  createdAt: string
}

type SellerApprovalListProps = {
  onApprove?: (sellerId: string) => Promise<void>
  onReject?: (sellerId: string, reason?: string) => Promise<void>
}

export function SellerApprovalList({ onApprove, onReject }: SellerApprovalListProps) {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSellers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch("/api/admin/sellers")
      
      if (!response.ok) {
        throw new Error("Failed to fetch sellers")
      }

      const data = await response.json()
      setSellers(data.sellers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sellers")
      console.error("Error fetching sellers:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  const handleApprove = async (sellerId: string) => {
    try {
      if (onApprove) {
        await onApprove(sellerId)
      } else {
        const response = await fetch(`/api/admin/sellers/${sellerId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "approved" }),
        })

        if (!response.ok) {
          throw new Error("Failed to approve seller")
        }
      }

      // Refresh the list
      await fetchSellers()
    } catch (err) {
      console.error("Error approving seller:", err)
      alert("Failed to approve seller")
    }
  }

  const handleReject = async (sellerId: string, reason?: string) => {
    try {
      if (onReject) {
        await onReject(sellerId, reason)
      } else {
        const response = await fetch(`/api/admin/sellers/${sellerId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected", reason }),
        })

        if (!response.ok) {
          throw new Error("Failed to reject seller")
        }
      }

      // Refresh the list
      await fetchSellers()
      setIsModalOpen(false)
      setSelectedSeller(null)
    } catch (err) {
      console.error("Error rejecting seller:", err)
      alert("Failed to reject seller")
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
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

  const filteredSellers = sellers.filter(
    (s) => filter === "all" || s.sellerStatus === filter
  )

  const openDetailsModal = (seller: Seller) => {
    setSelectedSeller(seller)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seller Management</CardTitle>
          <CardDescription>Loading sellers...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seller Management</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchSellers}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Seller Management</CardTitle>
          <CardDescription>Manage seller applications and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Sellers</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No sellers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">
                          {seller.name || "N/A"}
                        </TableCell>
                        <TableCell>{seller.email}</TableCell>
                        <TableCell>{seller.phone || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(seller.sellerStatus)}</TableCell>
                        <TableCell>
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/store/${seller.id}`} target="_blank">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Store
                              </Button>
                            </Link>
                            <Link href={`/admin/sellers/${seller.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </Link>
                            {seller.sellerStatus === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(seller.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedSeller && (
        <SellerDetailsModal
          seller={selectedSeller}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedSeller(null)
          }}
          onApprove={() => handleApprove(selectedSeller.id)}
          onReject={(reason) => handleReject(selectedSeller.id, reason)}
        />
      )}
    </>
  )
}
