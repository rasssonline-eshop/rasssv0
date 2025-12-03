"use client"

import { Card } from "@/components/ui/card"

const brands = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: i,
    name: `Brand ${i + 1}`,
  }))

export default function BrandShowcase() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Shop by Brands</h2>
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8">
          <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className="bg-white/20 aspect-square flex items-center justify-center cursor-pointer hover:shadow-lg transition"
              >
                <span className="text-sm font-medium text-white">{brand.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
