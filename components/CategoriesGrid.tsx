"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  {
    name: "Infant Milk Powder",
    subcategories: ["Stage 1", "Stage 2", "Stage 3", "LF", "Premature"],
  },
  {
    name: "Cereals",
    subcategories: ["Infant", "Adult"],
  },
  {
    name: "Balm",
    subcategories: ["Pain Relief", "Cooling"],
  },
  {
    name: "Heat spray (Pain killer)",
    subcategories: ["Spray"],
  },
  {
    name: "Heat lotion (Pain Killer)",
    subcategories: ["Lotion"],
  },
  {
    name: "Heat cream (Pain Killer)",
    subcategories: ["Cream"],
  },
  {
    name: "Hair removing spray",
    subcategories: ["Body", "Face"],
  },
  { name: "Acne cream", subcategories: ["Treatment"], comingSoon: true },
  { name: "Acne scar cream", subcategories: ["Treatment"], comingSoon: true },
  { name: "Acne serum", subcategories: ["Serum"], comingSoon: true },
  { name: "Acne face wash", subcategories: ["Cleanser"], comingSoon: true },
  { name: "Acne soap", subcategories: ["Soap"], comingSoon: true },
  { name: "Skin beauty cream", subcategories: ["Cream"], comingSoon: true },
  { name: "Skin moisturizer lotion", subcategories: ["Lotion"], comingSoon: true },
  { name: "Moisturizer soap", subcategories: ["Soap"], comingSoon: true },
  { name: "Whitening serum", subcategories: ["Serum"], comingSoon: true },
  { name: "Whitening cream", subcategories: ["Cream"], comingSoon: true },
  { name: "Whitening face wash", subcategories: ["Cleanser"], comingSoon: true },
  { name: "Whitening soap", subcategories: ["Soap"], comingSoon: true },
  { name: "Sun block lotion spf 60", subcategories: ["SPF 60"], comingSoon: true },
  { name: "Sun block lotion spf 100", subcategories: ["SPF 100"], comingSoon: true },
  { name: "Scabies lotion", subcategories: ["Lotion"], comingSoon: true },
  { name: "Scabies soap", subcategories: ["Soap"], comingSoon: true },
  { name: "Charcoal face wash", subcategories: ["Cleanser"], comingSoon: true },
  { name: "Facial products", subcategories: ["Kits"], comingSoon: true },
  { name: "Hair serum", subcategories: ["Serum"], comingSoon: true },
  { name: "Hair oil", subcategories: ["Oil"], comingSoon: true },
  { name: "Hair shampoo", subcategories: ["Shampoo"], comingSoon: true },
  { name: "Hair shampoo plus conditioner", subcategories: ["2-in-1"], comingSoon: true },
  { name: "Slimming Tea", subcategories: ["Tea"], comingSoon: true },
]

const categoryImages: Record<string, string> = {
  Fragrances: "/fragrances.jpg",
  Makeup: "/makeup-products.png",
  "Baby Care & Diapers": "/baby-care.jpg",
  Vitamins: "/assorted-vitamins.png",
  "Skin Care": "/skincare.jpg",
  "Baby Accessories": "/baby-accessories.jpg",
  "Hair Care": "/hair-care.jpg",
  "Personal Care": "/personal-care.jpg",
  "Infant Milk Powder": "/baby-care.jpg",
  Cereals: "/personal-care.jpg",
  Balm: "/personal-care.jpg",
  "Heat spray (Pain killer)": "/personal-care.jpg",
  "Heat lotion (Pain Killer)": "/personal-care.jpg",
  "Heat cream (Pain Killer)": "/personal-care.jpg",
  "Hair removing spray": "/hair-care.jpg",
  // Coming soon categories mapped to relevant local images
  "Acne cream": "/skincare.jpg",
  "Acne scar cream": "/skincare.jpg",
  "Acne serum": "/skincare.jpg",
  "Acne face wash": "/skincare.jpg",
  "Acne soap": "/skincare.jpg",
  "Skin beauty cream": "/skincare.jpg",
  "Skin moisturizer lotion": "/skincare.jpg",
  "Moisturizer soap": "/skincare.jpg",
  "Whitening serum": "/skincare.jpg",
  "Whitening cream": "/skincare.jpg",
  "Whitening face wash": "/skincare.jpg",
  "Whitening soap": "/skincare.jpg",
  "Sun block lotion spf 60": "/skincare.jpg",
  "Sun block lotion spf 100": "/skincare.jpg",
  "Scabies lotion": "/personal-care.jpg",
  "Scabies soap": "/personal-care.jpg",
  "Charcoal face wash": "/skincare.jpg",
  "Facial products": "/skincare.jpg",
  "Hair serum": "/hair-care.jpg",
  "Hair oil": "/hair-care.jpg",
  "Hair shampoo": "/hair-care.jpg",
  "Hair shampoo plus conditioner": "/hair-care.jpg",
  "Slimming Tea": "/personal-care.jpg",
}

export default function CategoriesGrid() {
  const sorted = [...categories].sort((a, b) => Number(!!a.comingSoon) - Number(!!b.comingSoon))
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((category) => (
            <Link key={category.name} href={`/category/${category.name}`}>
              <Card className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40 cursor-pointer h-full">
                <div className="relative w-full h-48">
                  <Image
                    src={categoryImages[category.name] || categoryImages["Skin Care"]}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {category.comingSoon && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  )}
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
