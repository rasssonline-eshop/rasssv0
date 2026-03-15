"use client"

import * as React from "react"
import { useCart } from "@/components/CartProvider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPKR } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminPaymentDetails {
  paymentMethod: "jazzcash" | "easypaisa" | "bank" | null
  paymentDetails: {
    number?: string
    bankName?: string
    accountTitle?: string
    accountNumber?: string
    iban?: string
  } | null
  configured: boolean
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address1, setAddress1] = React.useState("")
  const [address2, setAddress2] = React.useState("")
  const [city, setCity] = React.useState("Lahore")
  const [area, setArea] = React.useState("")
  const [postal, setPostal] = React.useState("")
  const [instructions, setInstructions] = React.useState("")
  const [payment, setPayment] = React.useState<"COD" | "Online">("COD")
  const [placed, setPlaced] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [adminPayment, setAdminPayment] = React.useState<AdminPaymentDetails | null>(null)
  const [loadingPayment, setLoadingPayment] = React.useState(false)
  const [transactionId, setTransactionId] = React.useState("")

  // Fetch admin payment details when component mounts
  React.useEffect(() => {
    async function fetchAdminPayment() {
      setLoadingPayment(true)
      try {
        const res = await fetch("/api/admin/payment-details")
        if (res.ok) {
          const data = await res.json()
          setAdminPayment(data)
        }
      } catch (error) {
        console.error("Failed to fetch admin payment details:", error)
      } finally {
        setLoadingPayment(false)
      }
    }
    fetchAdminPayment()
  }, [])

  const canPlace = name && email && phone && address1 && city && items.length > 0 && !loading

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canPlace) return

    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address: {
            line1: address1,
            line2: address2,
            city,
            area,
            postal
          },
          items,
          total: subtotal,
          instructions,
          paymentMethod: payment === "COD" ? "cod" : "online",
          transactionId: payment === "Online" ? transactionId : undefined
        })
      })

      if (res.ok) {
        const data = await res.json()
        setPlaced(true)
        clear()
      } else {
        console.error("Checkout failed")
        alert("Order failed. Please try again.")
      }
    } catch (err) {
      console.error("Checkout error", err)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container py-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Checkout</h1>
          <p className="text-sm text-gray-600 mt-2">Cash on Delivery preselected for Lahore</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          className="space-y-4 lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white rounded-xl border-gray-300 focus:border-primary focus:ring-primary" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white rounded-xl border-gray-300 focus:border-primary focus:ring-primary" required placeholder="For order confirmation" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white rounded-xl border-gray-300 focus:border-primary focus:ring-primary" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Address Line 1</label>
            <Input value={address1} onChange={(e) => setAddress1(e.target.value)} className="bg-white rounded-xl border-gray-300 focus:border-primary focus:ring-primary" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Address Line 2 (Optional)</label>
            <Input value={address2} onChange={(e) => setAddress2(e.target.value)} className="bg-white rounded-xl border-gray-300 focus:border-primary focus:ring-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="h-9 rounded-md border px-3 text-sm bg-white w-full">
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option>
                <option>Rawalpindi</option>
                <option>Faisalabad</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Area / Locality</label>
              <Input value={area} onChange={(e) => setArea(e.target.value)} className="bg-white" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Postal Code</label>
              <Input value={postal} onChange={(e) => setPostal(e.target.value)} className="bg-white" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Delivery Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-white"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Payment</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${payment === "COD" ? "bg-blue-50 border-blue-200" : ""}`}>
                <input type="radio" name="payment" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                <span className="font-medium">Cash on Delivery</span>
              </label>
              <label className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${payment === "Online" ? "bg-blue-50 border-blue-200" : ""} ${!adminPayment?.configured ? "opacity-60 cursor-not-allowed" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={payment === "Online"} 
                  onChange={() => setPayment("Online")}
                  disabled={!adminPayment?.configured}
                />
                <span className="font-medium">Pay Online</span>
              </label>
            </div>

            {/* Show payment instructions when Online is selected */}
            {payment === "Online" && adminPayment?.configured && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-sm mb-3">Payment Instructions</h3>
                
                {adminPayment.paymentMethod === "jazzcash" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      Please send payment to the following JazzCash account:
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">JazzCash Number:</span>
                        <span className="font-mono font-semibold">{adminPayment.paymentDetails?.number}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      After payment, please note your transaction ID and place the order. We will verify your payment and process your order.
                    </p>
                  </div>
                )}

                {adminPayment.paymentMethod === "easypaisa" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      Please send payment to the following EasyPaisa account:
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">EasyPaisa Number:</span>
                        <span className="font-mono font-semibold">{adminPayment.paymentDetails?.number}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      After payment, please note your transaction ID and place the order. We will verify your payment and process your order.
                    </p>
                  </div>
                )}

                {adminPayment.paymentMethod === "bank" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      Please transfer payment to the following bank account:
                    </p>
                    <div className="bg-white p-3 rounded border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bank Name:</span>
                        <span className="font-semibold">{adminPayment.paymentDetails?.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Title:</span>
                        <span className="font-semibold">{adminPayment.paymentDetails?.accountTitle}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Number:</span>
                        <span className="font-mono font-semibold">{adminPayment.paymentDetails?.accountNumber}</span>
                      </div>
                      {adminPayment.paymentDetails?.iban && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">IBAN:</span>
                          <span className="font-mono font-semibold">{adminPayment.paymentDetails?.iban}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      After payment, please note your transaction ID and place the order. We will verify your payment and process your order.
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <label className="text-sm text-gray-600">Transaction ID (Optional)</label>
                  <Input 
                    placeholder="Enter your transaction ID" 
                    className="bg-white mt-1"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {payment === "Online" && !adminPayment?.configured && !loadingPayment && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                Online payment is not available at the moment. Please use Cash on Delivery.
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!canPlace || loading} className="bg-primary text-primary-foreground min-w-[140px]">
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
            <Link href="/cart" className="text-sm text-gray-600">Back to Cart</Link>
          </div>

          {placed && (
            <div className="rounded-md border bg-green-50 text-green-700 p-4 text-sm mt-4">
              <p className="font-bold text-lg">Order Placed Successfully!</p>
              <p>Thank you, {name}. We have received your order.</p>
              <p>We will contact you at {phone} for confirmation.</p>
            </div>
          )}
        </form>

        <div className="space-y-3">
          <div className="rounded-md border bg-white p-4">
            <div className="font-semibold mb-2">Order Summary</div>
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-sm text-gray-600">No items</div>
              ) : (
                items.map((item) => {
                  const itemKey = item.variantId ? `${item.id}_${item.variantId}` : item.id
                  return (
                  <div key={itemKey} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="60px" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm line-clamp-2">{item.name}</div>
                      {item.variantName && (
                        <div className="text-xs text-gray-500">{item.variantName}</div>
                      )}
                      <div className="text-xs text-gray-600">Qty {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium">{formatPKR(item.price * item.quantity)}</div>
                  </div>
                )})
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="font-semibold">{formatPKR(subtotal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
