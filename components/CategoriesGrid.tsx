"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"

const categories = [
  {
    name: "Fragrances",
    subcategories: ["For Her", "For Him"],
  },
  {
    name: "Makeup",
    subcategories: ["Lipstick", "Eye Makeup", "Face Makeup"],
  },
  {
    name: "Baby Care & Diapers",
    subcategories: ["Regular Diapers", "Baby Wipes"],
  },
  {
    name: "Vitamins",
    subcategories: ["Hair Vitamins", "Multivitamins"],
  },
  {
    name: "Skin Care",
    subcategories: ["Moisturizers", "Cleansers"],
  },
  {
    name: "Baby Accessories",
    subcategories: ["Strollers", "Car Seats"],
  },
  {
    name: "Hair Care",
    subcategories: ["Shampoo", "Conditioner"],
  },
  {
    name: "Personal Care",
    subcategories: ["Deodorants", "Soaps"],
  },
]

export default function CategoriesGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/category/${category.name}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <div className="space-y-1">
                    {category.subcategories.slice(0, 2).map((sub) => (
                      <p key={sub} className="text-sm text-gray-600">
                        {sub}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
