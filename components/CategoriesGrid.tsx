"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

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

const categoryImages: Record<string, string> = {
  Fragrances: "https://picsum.photos/seed/fragrances/600/400",
  Makeup: "https://picsum.photos/seed/makeup/600/400",
  "Baby Care & Diapers": "https://picsum.photos/seed/baby-diapers/600/400",
  Vitamins: "https://picsum.photos/seed/vitamins/600/400",
  "Skin Care": "https://picsum.photos/seed/skincare/600/400",
  "Baby Accessories": "https://picsum.photos/seed/baby-accessories/600/400",
  "Hair Care": "https://picsum.photos/seed/haircare/600/400",
  "Personal Care": "https://picsum.photos/seed/personal-care/600/400",
}

export default function CategoriesGrid() {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/category/${category.name}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                <div className="relative w-full h-48">
                  <Image
                    src={categoryImages[category.name] || categoryImages["Skin Care"]}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                    {category.name}
                  </div>
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
