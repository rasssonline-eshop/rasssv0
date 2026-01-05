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
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">Browse</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Explore our curated collection of health and beauty products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sorted.map((category) => (
            <Link key={category.name} to={`/category/${category.name}`}>
              <Card className="group relative overflow-hidden border-2 border-transparent hover:border-teal-400/50 rounded-2xl shadow-md hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer h-full bg-gradient-to-br from-white to-gray-50">
                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={(store.categories.find(x => x.name === category.name)?.image) || imageMap[category.name] || category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  {category.comingSoon && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="secondary" className="bg-teal-500 text-white border-0 shadow-sm">
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                  {/* Category Icon Accent */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-teal-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <span className="text-white text-sm font-bold">{category.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="p-4 bg-white border-t-2 border-teal-400/30">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{category.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.subcategories.slice(0, 2).map((sub) => (
                      <span key={sub} className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {sub}
                      </span>
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
