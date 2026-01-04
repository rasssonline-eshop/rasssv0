"use client"

import * as React from "react"
import { useCart } from "@/components/CartProvider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPKR } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address1, setAddress1] = React.useState("")
  const [address2, setAddress2] = React.useState("")
  const [city, setCity] = React.useState("Lahore")
  const [area, setArea] = React.useState("")
  const [postal, setPostal] = React.useState("")
  const [instructions, setInstructions] = React.useState("")
  const [payment, setPayment] = React.useState<"COD" | "Card">("COD")
  const [placed, setPlaced] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

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
          paymentMethod: payment
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
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-gray-600">Cash on Delivery preselected for Lahore</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          className="space-y-4 lg:col-span-2 bg-white rounded-md border p-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white" required />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white" required placeholder="For order confirmation" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Address Line 1</label>
            <Input value={address1} onChange={(e) => setAddress1(e.target.value)} className="bg-white" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Address Line 2 (Optional)</label>
            <Input value={address2} onChange={(e) => setAddress2(e.target.value)} className="bg-white" />
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
              <label className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer bg-blue-50 border-blue-200">
                <input type="radio" name="payment" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                <span className="font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer opacity-60 cursor-not-allowed">
                <input type="radio" name="payment" disabled />
                <span>Online Payment (Coming Soon)</span>
              </label>
            </div>
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
                items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="60px" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm line-clamp-2">{item.name}</div>
                      <div className="text-xs text-gray-600">Qty {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium">{formatPKR(item.price * item.quantity)}</div>
                  </div>
                ))
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
  )
}
