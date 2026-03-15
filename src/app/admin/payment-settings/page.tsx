"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Wallet, Building2, Smartphone } from "lucide-react"

export default function AdminPaymentSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [paymentType, setPaymentType] = useState<"jazzcash" | "easypaisa" | "bank" | "">("")

  const [formData, setFormData] = useState({
    jazzCashNumber: "",
    easyPaisaNumber: "",
    bankName: "",
    bankAccountTitle: "",
    bankAccountNumber: "",
    bankIBAN: "",
  })

  useEffect(() => {
    fetchPaymentDetails()
  }, [])

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch("/api/admin/payment-settings")
      if (res.ok) {
        const data = await res.json()
        setFormData({
          jazzCashNumber: data.jazzCashNumber || "",
          easyPaisaNumber: data.easyPaisaNumber || "",
          bankName: data.bankName || "",
          bankAccountTitle: data.bankAccountTitle || "",
          bankAccountNumber: data.bankAccountNumber || "",
          bankIBAN: data.bankIBAN || "",
        })

        // Determine which payment method is set
        if (data.jazzCashNumber) {
          setPaymentType("jazzcash")
        } else if (data.easyPaisaNumber) {
          setPaymentType("easypaisa")
        } else if (data.bankAccountNumber) {
          setPaymentType("bank")
        }
      }
    } catch (error) {
      console.error("Failed to fetch payment details:", error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentType) {
      toast.error("Please select a payment method")
      return
    }

    // Validate based on selected payment type
    if (paymentType === "jazzcash" && !formData.jazzCashNumber) {
      toast.error("Please enter your JazzCash number")
      return
    }

    if (paymentType === "easypaisa" && !formData.easyPaisaNumber) {
      toast.error("Please enter your EasyPaisa number")
      return
    }

    if (paymentType === "bank") {
      if (!formData.bankName || !formData.bankAccountTitle || !formData.bankAccountNumber) {
        toast.error("Please fill in all required bank details")
        return
      }
    }

    setLoading(true)

    try {
      // Clear other payment methods based on selection
      const dataToSend = {
        jazzCashNumber: paymentType === "jazzcash" ? formData.jazzCashNumber : "",
        easyPaisaNumber: paymentType === "easypaisa" ? formData.easyPaisaNumber : "",
        bankName: paymentType === "bank" ? formData.bankName : "",
        bankAccountTitle: paymentType === "bank" ? formData.bankAccountTitle : "",
        bankAccountNumber: paymentType === "bank" ? formData.bankAccountNumber : "",
        bankIBAN: paymentType === "bank" ? formData.bankIBAN : "",
      }

      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      if (res.ok) {
        toast.success("Payment settings updated successfully")
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to update payment settings")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Payment Settings</h1>
        <p className="text-gray-600">
          Configure where customers should send online payments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
            <CardDescription>
              Choose where customers will send online payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentType("jazzcash")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentType === "jazzcash"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Smartphone className="w-8 h-8 text-primary" />
                  <span className="font-semibold">JazzCash</span>
                  <span className="text-xs text-gray-500">Mobile Wallet</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("easypaisa")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentType === "easypaisa"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Smartphone className="w-8 h-8 text-primary" />
                  <span className="font-semibold">EasyPaisa</span>
                  <span className="text-xs text-gray-500">Mobile Wallet</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("bank")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentType === "bank"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Building2 className="w-8 h-8 text-primary" />
                  <span className="font-semibold">Bank Account</span>
                  <span className="text-xs text-gray-500">Direct Transfer</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* JazzCash Details */}
        {paymentType === "jazzcash" && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <CardTitle>JazzCash Details</CardTitle>
              </div>
              <CardDescription>
                Customers will send payments to this JazzCash number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jazzCashNumber">JazzCash Number *</Label>
                <Input
                  id="jazzCashNumber"
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  value={formData.jazzCashNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, jazzCashNumber: e.target.value })
                  }
                  maxLength={11}
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter your 11-digit JazzCash mobile number
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* EasyPaisa Details */}
        {paymentType === "easypaisa" && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <CardTitle>EasyPaisa Details</CardTitle>
              </div>
              <CardDescription>
                Customers will send payments to this EasyPaisa number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="easyPaisaNumber">EasyPaisa Number *</Label>
                <Input
                  id="easyPaisaNumber"
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  value={formData.easyPaisaNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, easyPaisaNumber: e.target.value })
                  }
                  maxLength={11}
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter your 11-digit EasyPaisa mobile number
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bank Account Details */}
        {paymentType === "bank" && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>Bank Account Details</CardTitle>
              </div>
              <CardDescription>
                Customers will send payments to this bank account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="e.g., HBL, UBL, Meezan Bank"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountTitle">Account Title *</Label>
                <Input
                  id="bankAccountTitle"
                  type="text"
                  placeholder="Account holder name"
                  value={formData.bankAccountTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountTitle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
                <Input
                  id="bankAccountNumber"
                  type="text"
                  placeholder="Enter your bank account number"
                  value={formData.bankAccountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankIBAN">IBAN (Optional)</Label>
                <Input
                  id="bankIBAN"
                  type="text"
                  placeholder="PK36XXXXXXXXXXXXXXXXXXXX"
                  value={formData.bankIBAN}
                  onChange={(e) =>
                    setFormData({ ...formData, bankIBAN: e.target.value })
                  }
                  maxLength={24}
                />
                <p className="text-xs text-gray-500">
                  24-character IBAN starting with PK
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Save Payment Settings
              </>
            )}
          </Button>
        </div>
      </form>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 text-blue-900">
            💡 Important Information
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Customers will see these details when they choose "Pay Online"</li>
            <li>• All online payments will be sent to this account</li>
            <li>• You can manually distribute payments to sellers from the Payouts page</li>
            <li>• Only one payment method can be active at a time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
