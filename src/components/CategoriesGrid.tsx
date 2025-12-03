import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

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
]

export default function CategoriesGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} to={`/category/${category.name}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
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
