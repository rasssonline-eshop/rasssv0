"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Globe } from "lucide-react"

export default function GlobalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">Rasss Global</h1>
        </div>
        <p className="text-gray-600">International shipping, curated global brands and exclusive imports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Fast Shipping", "Authentic Products", "Easy Returns"].map((title, i) => (
          <Card key={i} className="p-6 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">Trusted service worldwide.</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Badge variant="secondary">Popular international categories</Badge>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Skin Care", "Vitamins", "Makeup", "Fragrances", "Hair Care", "Personal Care"].map((c) => (
            <Card key={c} className="p-4 text-center">{c}</Card>
          ))}
        </div>
      </div>
    </div>
  )
}
