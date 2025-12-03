"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Timer } from "lucide-react"
import Link from "next/link"

const deals = Array(12)
  .fill(null)
  .map((_, i) => ({
    id: i,
    name: `Flash Deal ${i + 1}`,
    slug: `flash-deal-${i + 1}`,
    price: Math.floor(Math.random() * 200) + 20,
    oldPrice: Math.floor(Math.random() * 250) + 50,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }))

export default function FlashSalesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Flash Sales</h1>
        <div className="flex items-center gap-2 text-sm">
          <Timer className="w-4 h-4" />
          <span>Ends soon</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((d) => (
          <Link key={d.id} href={`/product/${d.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
              <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-4xl">⚡</span>
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
                    <span className="font-bold text-lg text-primary">SAR {d.price}</span>
                    <span className="text-gray-500 line-through text-sm">SAR {d.oldPrice}</span>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground">Add</Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
