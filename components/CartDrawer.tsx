"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "./CartProvider"
import { formatPKR } from "@/lib/utils"
import { useIsMobile } from "@/components/ui/use-mobile"
import Link from "next/link"

export default function CartDrawer() {
  const { isOpen, setOpen, items, subtotal, removeItem, updateQty, clear } = useCart()
  const isMobile = useIsMobile()
  return (
    <Drawer open={isOpen} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Cart</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          {items.length === 0 ? (
            <div className="text-sm text-gray-600 py-8">Your cart is empty</div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border rounded-md p-2 bg-white">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm line-clamp-2">{item.name}</div>
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
            </div>
          )}
        </div>
        <DrawerFooter>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="font-semibold">{formatPKR(subtotal)}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="flex-1" onClick={() => setOpen(false)}>Continue Shopping</Button>
            <Button variant="outline" onClick={clear}>Clear</Button>
          </div>
          <Link href="/checkout" onClick={() => setOpen(false)} className="w-full">
            <Button className="w-full">Go to Checkout</Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
