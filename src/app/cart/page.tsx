"use client"

import { useCart } from "@/components/CartProvider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatPKR } from "@/lib/utils"
import Link from "next/link"

export default function CartPage() {
  const { items, subtotal, removeItem, updateQty, clear } = useCart()
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-sm text-gray-600">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border rounded-md p-3 bg-white">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-600">{formatPKR(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateQty(item.id, item.quantity - 1)}>-</Button>
                  <div className="w-8 text-center text-sm">{item.quantity}</div>
                  <Button variant="outline" size="sm" onClick={() => updateQty(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
              </div>
            ))}
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
  )
}
