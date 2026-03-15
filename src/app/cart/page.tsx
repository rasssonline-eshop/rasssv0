"use client"

import { useCart } from "@/components/CartProvider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatPKR } from "@/lib/utils"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, subtotal, removeItem, updateQty, clear } = useCart()
  const router = useRouter()
  
  return (
    <>
      <Header />
      <div className="container py-8 min-h-screen">
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
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>
      {items.length === 0 ? (
        <div className="text-sm text-gray-600">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const itemKey = item.variantId ? `${item.id}_${item.variantId}` : item.id
              return (
              <div key={itemKey} className="flex items-center gap-3 border rounded-md p-3 bg-white">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name}</div>
                  {item.variantName && (
                    <div className="text-xs text-gray-500 mt-0.5">{item.variantName}</div>
                  )}
                  <div className="text-xs text-gray-600">{formatPKR(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateQty(itemKey, item.quantity - 1)}>-</Button>
                  <div className="w-8 text-center text-sm">{item.quantity}</div>
                  <Button variant="outline" size="sm" onClick={() => updateQty(itemKey, item.quantity + 1)}>+</Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(itemKey)}>Remove</Button>
              </div>
            )})}
            <Button variant="outline" onClick={clear}>Clear Cart</Button>
          </div>
          <div className="rounded-md border bg-white p-4 space-y-3 h-fit">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="font-semibold">{formatPKR(subtotal)}</div>
            </div>
            <Link href="/checkout" className="w-full">
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  )
}
