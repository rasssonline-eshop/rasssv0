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
  Fragrances: "https://picsum.photos/seed/fragrances/600/400",
  Makeup: "https://picsum.photos/seed/makeup/600/400",
  "Baby Care & Diapers": "https://picsum.photos/seed/baby-diapers/600/400",
  Vitamins: "https://picsum.photos/seed/vitamins/600/400",
  "Skin Care": "https://picsum.photos/seed/skincare/600/400",
  "Baby Accessories": "https://picsum.photos/seed/baby-accessories/600/400",
  "Hair Care": "https://picsum.photos/seed/haircare/600/400",
  "Personal Care": "https://picsum.photos/seed/personal-care/600/400",
  "Infant Milk Powder": "https://picsum.photos/seed/infant-milk/600/400",
  Cereals: "https://picsum.photos/seed/cereals/600/400",
  Balm: "https://picsum.photos/seed/balm/600/400",
  "Heat spray (Pain killer)": "https://picsum.photos/seed/heat-spray/600/400",
  "Heat lotion (Pain Killer)": "https://picsum.photos/seed/heat-lotion/600/400",
  "Heat cream (Pain Killer)": "https://picsum.photos/seed/heat-cream/600/400",
  "Hair removing spray": "https://picsum.photos/seed/hair-removing/600/400",
}

export default function CategoriesGrid() {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/category/${category.name}`}>
              <Card className="overflow-hidden hover:shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer h-full">
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
                    <div className="absolute top-3 right-3 flex items-center justify-center">
                      <Image
                        src={"https://img.freepik.com/free-vector/coming-soon-neon-sign_23-2147857976.jpg"}
                        alt="Coming Soon"
                        width={64}
                        height={64}
                        className="rounded-md border border-white/40 shadow object-cover"
                        priority
                      />
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
