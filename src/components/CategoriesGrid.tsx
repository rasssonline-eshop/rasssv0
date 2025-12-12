import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { useAdmin } from "@/components/AdminProvider"

const categories = [
  {
    name: "Fragrances",
    subcategories: ["For Her", "For Him"],
    image: "/fragrances.jpg",
  },
  {
    name: "Makeup",
    subcategories: ["Lipstick", "Eye Makeup", "Face Makeup"],
    image: "/makeup-products.png",
  },
  {
    name: "Baby Care & Diapers",
    subcategories: ["Regular Diapers", "Baby Wipes"],
    image: "/baby-care.jpg",
  },
  {
    name: "Vitamins",
    subcategories: ["Hair Vitamins", "Multivitamins"],
    image: "/assorted-vitamins.png",
  },
  {
    name: "Skin Care",
    subcategories: ["Moisturizers", "Cleansers"],
    image: "/skincare.jpg",
  },
  {
    name: "Baby Accessories",
    subcategories: ["Strollers", "Car Seats"],
    image: "/baby-accessories.jpg",
  },
  {
    name: "Hair Care",
    subcategories: ["Shampoo", "Conditioner"],
    image: "/hair-care.jpg",
  },
  {
    name: "Personal Care",
    subcategories: ["Deodorants", "Soaps"],
    image: "/personal-care.jpg",
  },
  {
    name: "Infant Milk Powder",
    subcategories: ["Stage 1", "Stage 2", "Stage 3", "LF", "Premature"],
    image: "/placeholder.svg",
  },
  { name: "Cereals", subcategories: ["Infant", "Adult"], image: "/placeholder.svg" },
  { name: "Balm", subcategories: ["Pain Relief", "Cooling"], image: "/placeholder.svg" },
  { name: "Heat spray (Pain killer)", subcategories: ["Spray"], image: "/placeholder.svg" },
  { name: "Heat lotion (Pain Killer)", subcategories: ["Lotion"], image: "/placeholder.svg" },
  { name: "Heat cream (Pain Killer)", subcategories: ["Cream"], image: "/placeholder.svg" },
  { name: "Hair removing spray", subcategories: ["Body", "Face"], image: "/placeholder.svg" },
  { name: "Acne cream", subcategories: ["Treatment"], image: "/placeholder.svg", comingSoon: true },
  { name: "Acne scar cream", subcategories: ["Treatment"], image: "/placeholder.svg", comingSoon: true },
  { name: "Acne serum", subcategories: ["Serum"], image: "/placeholder.svg", comingSoon: true },
  { name: "Acne face wash", subcategories: ["Cleanser"], image: "/placeholder.svg", comingSoon: true },
  { name: "Acne soap", subcategories: ["Soap"], image: "/placeholder.svg", comingSoon: true },
  { name: "Skin beauty cream", subcategories: ["Cream"], image: "/placeholder.svg", comingSoon: true },
  { name: "Skin moisturizer lotion", subcategories: ["Lotion"], image: "/placeholder.svg", comingSoon: true },
  { name: "Moisturizer soap", subcategories: ["Soap"], image: "/placeholder.svg", comingSoon: true },
  { name: "Whitening serum", subcategories: ["Serum"], image: "/placeholder.svg", comingSoon: true },
  { name: "Whitening cream", subcategories: ["Cream"], image: "/placeholder.svg", comingSoon: true },
  { name: "Whitening face wash", subcategories: ["Cleanser"], image: "/placeholder.svg", comingSoon: true },
  { name: "Whitening soap", subcategories: ["Soap"], image: "/placeholder.svg", comingSoon: true },
  { name: "Sun block lotion spf 60", subcategories: ["SPF 60"], image: "/placeholder.svg", comingSoon: true },
  { name: "Sun block lotion spf 100", subcategories: ["SPF 100"], image: "/placeholder.svg", comingSoon: true },
  { name: "Scabies lotion", subcategories: ["Lotion"], image: "/placeholder.svg", comingSoon: true },
  { name: "Scabies soap", subcategories: ["Soap"], image: "/placeholder.svg", comingSoon: true },
  { name: "Charcoal face wash", subcategories: ["Cleanser"], image: "/placeholder.svg", comingSoon: true },
  { name: "Facial products", subcategories: ["Kits"], image: "/placeholder.svg", comingSoon: true },
  { name: "Hair serum", subcategories: ["Serum"], image: "/placeholder.svg", comingSoon: true },
  { name: "Hair oil", subcategories: ["Oil"], image: "/placeholder.svg", comingSoon: true },
  { name: "Hair shampoo", subcategories: ["Shampoo"], image: "/placeholder.svg", comingSoon: true },
  { name: "Hair shampoo plus conditioner", subcategories: ["2-in-1"], image: "/placeholder.svg", comingSoon: true },
  { name: "Slimming Tea", subcategories: ["Tea"], image: "/placeholder.svg", comingSoon: true },
]

export default function CategoriesGrid() {
  const { store } = useAdmin()
  const imageMap: Record<string, string> = {
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
  const adminCats = store.categories.length ? store.categories.map(c => ({ name: c.name, subcategories: c.subcategories || [], image: c.image, comingSoon: c.comingSoon })) : categories
  const sorted = [...adminCats].sort((a, b) => Number(!!a.comingSoon) - Number(!!b.comingSoon))
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((category) => (
            <Link key={category.name} to={`/category/${category.name}`}>
              <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40 cursor-pointer h-full">
                <img
                  src={(store.categories.find(x => x.name === category.name)?.image) || imageMap[category.name] || category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                {category.comingSoon && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                )}
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
