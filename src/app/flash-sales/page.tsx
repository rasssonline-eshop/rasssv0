"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Timer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatPKR } from "@/lib/utils"
import { useCart } from "@/components/CartProvider"

function seededRng(seed: number) {
  let a = seed || 1
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), a | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const deals = Array(12)
  .fill(null)
  .map((_, i) => {
    const rng = seededRng(i + 1)
    const price = Math.floor(rng() * 180) + 20
    const oldPrice = Math.floor(rng() * 200) + 70
    const rating = (3 + rng() * 2).toFixed(1)
    return {
      id: i,
      name: `Flash Deal ${i + 1}`,
      slug: `flash-deal-${i + 1}`,
      price,
      oldPrice,
      rating,
      image: [
        "https://picsum.photos/seed/deal-1/600/400",
        "https://picsum.photos/seed/deal-2/600/400",
        "https://picsum.photos/seed/deal-3/600/400",
        "https://picsum.photos/seed/deal-4/600/400",
      ][i % 4],
    }
  })

export default function FlashSalesPage() {
  const { addItem } = useCart()
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Flash Sales</h1>
        <div className="flex items-center gap-2 text-sm">
          <Timer className="w-4 h-4" />
          <span>Ends soon in Lahore</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((d) => (
          <Link key={d.id} href={`/product/${d.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
              <div className="relative w-full h-48">
                <Image src={d.image} alt={d.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">Flash Deal</div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>Save {Math.max(5, Math.round(100 - (d.price / d.oldPrice) * 100))}%</Badge>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">{d.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{d.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-lg text-primary">{formatPKR(d.price)}</span>
                    <span className="text-gray-500 line-through text-sm">{formatPKR(d.oldPrice)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground"
                    onClick={(e) => {
                      e.preventDefault()
                      addItem({ id: d.slug, slug: d.slug, name: d.name, price: d.price, image: d.image }, 1)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
