"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatPKR } from "@/lib/utils"
import { Wallet, DollarSign, TrendingUp, Eye, Send, Loader2, Search } from "lucide-react"

interface SellerPayout {
  sellerId: string
  sellerName: string
  sellerEmail: string
  totalRevenue: number
  pendingOrders: number
  lastPayoutDate: string | null
  paymentDetails: {
    jazzCashNumber?: string
    easyPaisaNumber?: string
    bankName?: string
    bankAccountTitle?: string
    bankAccountNumber?: string
    bankIBAN?: string
  }
}

interface PayoutHistory {
  id: string
  sellerName: string
  totalRevenue: number
  commissionRate: number
  commissionAmount: number
  payoutAmount: number
  status: string
  paymentMethod: string
  paidAt: string | null
  createdAt: string
}

export default function AdminPayoutsPage() {
  const [sellers, setSellers] = useState<SellerPayout[]>([])
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [commissionRate, setCommissionRate] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Payout dialog state
  const [payoutDialog, setPayoutDialog] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<SellerPayout | null>(null)
  const [payoutMethod, setPayoutMethod] = useState("")
  const [payoutNote, setPayoutNote] = useState("")
  const [processingPayout, setProcessingPayout] = useState(false)

  // View details dialog
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [viewingSeller, setViewingSeller] = useState<SellerPayout | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch sellers with pending payouts
      const sellersRes = await fetch("/api/admin/payouts/sellers")
      if (sellersRes.ok) {
        const data = await sellersRes.json()
        setSellers(data.sellers || [])
      }

      // Fetch payout history
      const historyRes = await fetch("/api/admin/payouts/history")
      if (historyRes.ok) {
        const data = await historyRes.json()
        setPayoutHistory(data.payouts || [])
      }

      // Fetch commission settings
      const settingsRes = await fetch("/api/admin/payouts/settings")
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setCommissionRate(data.defaultRate || 10)
      }
    } catch (error) {
      console.error("Failed to fetch payout data:", error)
      toast.error("Failed to load payout data")
    } finally {
      setLoading(false)
    }
  }

  const handleInitiatePayout = (seller: SellerPayout) => {
    setSelectedSeller(seller)
    setPayoutDialog(true)
    setPayoutMethod("")
    setPayoutNote("")
  }

  const handleProcessPayout = async () => {
    if (!selectedSeller || !payoutMethod) {
      toast.error("Please select a payment method")
      return
    }

    setProcessingPayout(true)
    try {
      const res = await fetch("/api/admin/payouts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: selectedSeller.sellerId,
          commissionRate,
          paymentMethod: payoutMethod,
          note: payoutNote,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Payout initiated successfully")
        setPayoutDialog(false)
        fetchData() // Refresh data
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to initiate payout")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setProcessingPayout(false)
    }
  }

  const handleViewDetails = (seller: SellerPayout) => {
    setViewingSeller(seller)
    setDetailsDialog(true)
  }

  const calculatePayout = (revenue: number) => {
    const commission = (revenue * commissionRate) / 100
    const payout = revenue - commission
    return { commission, payout }
  }

  const filteredSellers = sellers.filter(seller =>
    seller.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalPendingRevenue = sellers.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalCommission = (totalPendingRevenue * commissionRate) / 100
  const totalPayouts = totalPendingRevenue - totalCommission

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Payouts</h1>
        <p className="text-gray-600 mt-2">
          Manage seller payments and commission deductions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalPendingRevenue)}</div>
            <p className="text-xs text-muted-foreground">Pending payouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalCommission)}</div>
            <p className="text-xs text-muted-foreground">{commissionRate}% rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seller Payouts</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalPayouts)}</div>
            <p className="text-xs text-muted-foreground">To be paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">With pending payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Settings</CardTitle>
          <CardDescription>Set the default commission rate for all sellers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <Button
              onClick={async () => {
                try {
                  const res = await fetch("/api/admin/payouts/settings", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ defaultRate: commissionRate }),
                  })
                  if (res.ok) {
                    toast.success("Commission rate updated")
                  } else {
                    toast.error("Failed to update commission rate")
                  }
                } catch (error) {
                  toast.error("An error occurred")
                }
              }}
              className="mt-6"
            >
              Save Rate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sellers with Pending Payouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Payouts</CardTitle>
              <CardDescription>Sellers with unpaid revenue</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSellers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No pending payouts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSellers.map((seller) => {
                const { commission, payout } = calculatePayout(seller.totalRevenue)
                return (
                  <div
                    key={seller.sellerId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">{seller.sellerName}</p>
                          <p className="text-sm text-gray-600">{seller.sellerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">
                          Revenue: <span className="font-semibold text-gray-900">{formatPKR(seller.totalRevenue)}</span>
                        </span>
                        <span className="text-gray-600">
                          Commission: <span className="font-semibold text-red-600">{formatPKR(commission)}</span>
                        </span>
                        <span className="text-gray-600">
                          Payout: <span className="font-semibold text-green-600">{formatPKR(payout)}</span>
                        </span>
                        <span className="text-gray-600">
                          Orders: <span className="font-semibold">{seller.pendingOrders}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(seller)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleInitiatePayout(seller)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Initiate Payout
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Payouts to Complete */}
      {payoutHistory.filter(p => p.status === 'pending' || p.status === 'processing').length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Payouts Awaiting Completion</CardTitle>
            <CardDescription className="text-orange-700">
              Mark these payouts as completed after sending money to sellers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payoutHistory
                .filter(p => p.status === 'pending' || p.status === 'processing')
                .map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 bg-white border border-orange-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">{payout.sellerName}</p>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(payout.createdAt).toLocaleDateString()} • {payout.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">
                          Revenue: <span className="font-semibold">{formatPKR(payout.totalRevenue)}</span>
                        </span>
                        <span className="text-gray-600">
                          Commission: <span className="font-semibold text-red-600">{formatPKR(payout.commissionAmount)}</span>
                        </span>
                        <span className="text-gray-600">
                          Payout: <span className="font-semibold text-green-600">{formatPKR(payout.payoutAmount)}</span>
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={async () => {
                        const transactionId = prompt("Enter transaction ID (optional):")
                        if (transactionId !== null) {
                          try {
                            const res = await fetch(`/api/admin/payouts/${payout.id}/complete`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ transactionId })
                            })
                            if (res.ok) {
                              toast.success("Payout marked as completed")
                              fetchData()
                            } else {
                              toast.error("Failed to complete payout")
                            }
                          } catch (error) {
                            toast.error("An error occurred")
                          }
                        }
                      }}
                    >
                      Mark as Paid
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Payouts</CardTitle>
          <CardDescription>Recent completed payout transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payoutHistory.filter(p => p.status === 'completed').length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No completed payouts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payoutHistory
                .filter(p => p.status === 'completed')
                .slice(0, 10)
                .map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{payout.sellerName}</p>
                      <p className="text-sm text-gray-600">
                        Paid: {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : 'N/A'} • {payout.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatPKR(payout.payoutAmount)}</p>
                      <Badge className="bg-green-100 text-green-800">
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Dialog */}
      <Dialog open={payoutDialog} onOpenChange={setPayoutDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Initiate Payout</DialogTitle>
            <DialogDescription>
              Process payment to {selectedSeller?.sellerName}
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <div className="space-y-4">
              {/* Payout Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-semibold">{formatPKR(selectedSeller.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission ({commissionRate}%):</span>
                  <span className="font-semibold text-red-600">
                    -{formatPKR(calculatePayout(selectedSeller.totalRevenue).commission)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Payout Amount:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatPKR(calculatePayout(selectedSeller.totalRevenue).payout)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedSeller.paymentDetails.jazzCashNumber && (
                    <Button
                      variant={payoutMethod === "jazzcash" ? "default" : "outline"}
                      onClick={() => setPayoutMethod("jazzcash")}
                      className="h-auto py-3 flex-col"
                    >
                      <span className="font-semibold">JazzCash</span>
                      <span className="text-xs">{selectedSeller.paymentDetails.jazzCashNumber}</span>
                    </Button>
                  )}
                  {selectedSeller.paymentDetails.easyPaisaNumber && (
                    <Button
                      variant={payoutMethod === "easypaisa" ? "default" : "outline"}
                      onClick={() => setPayoutMethod("easypaisa")}
                      className="h-auto py-3 flex-col"
                    >
                      <span className="font-semibold">EasyPaisa</span>
                      <span className="text-xs">{selectedSeller.paymentDetails.easyPaisaNumber}</span>
                    </Button>
                  )}
                  {selectedSeller.paymentDetails.bankAccountNumber && (
                    <Button
                      variant={payoutMethod === "bank_transfer" ? "default" : "outline"}
                      onClick={() => setPayoutMethod("bank_transfer")}
                      className="h-auto py-3 flex-col"
                    >
                      <span className="font-semibold">Bank Transfer</span>
                      <span className="text-xs">{selectedSeller.paymentDetails.bankName}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  placeholder="Add a note about this payout..."
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayout} disabled={processingPayout || !payoutMethod}>
              {processingPayout ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Initiate Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              {viewingSeller?.sellerName}'s payment information
            </DialogDescription>
          </DialogHeader>

          {viewingSeller && (
            <div className="space-y-4">
              {viewingSeller.paymentDetails.jazzCashNumber && (
                <div>
                  <Label className="text-gray-600">JazzCash</Label>
                  <p className="font-mono text-lg">{viewingSeller.paymentDetails.jazzCashNumber}</p>
                </div>
              )}
              {viewingSeller.paymentDetails.easyPaisaNumber && (
                <div>
                  <Label className="text-gray-600">EasyPaisa</Label>
                  <p className="font-mono text-lg">{viewingSeller.paymentDetails.easyPaisaNumber}</p>
                </div>
              )}
              {viewingSeller.paymentDetails.bankAccountNumber && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-600">Bank Name</Label>
                    <p className="font-semibold">{viewingSeller.paymentDetails.bankName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Account Title</Label>
                    <p className="font-semibold">{viewingSeller.paymentDetails.bankAccountTitle}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Account Number</Label>
                    <p className="font-mono text-lg">{viewingSeller.paymentDetails.bankAccountNumber}</p>
                  </div>
                  {viewingSeller.paymentDetails.bankIBAN && (
                    <div>
                      <Label className="text-gray-600">IBAN</Label>
                      <p className="font-mono text-sm">{viewingSeller.paymentDetails.bankIBAN}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
