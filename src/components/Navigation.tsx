import { ChevronDown, Zap, Globe, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

const categories = [
  "Fragrances",
  "Makeup",
  "Baby Care & Diapers",
  "Vitamins",
  "Skin Care",
  "Baby Accessories",
  "Hair Care",
  "Personal Care",
]

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[calc(var(--header-height,56px)-6px)] z-40 shadow-sm">
      <div className="px-4">
        <div className="container flex items-center gap-4 sm:gap-6 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Shop by Category
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat}>{cat}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/flash-sales" className="flex items-center gap-1 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Flash Sales</span>
          </Link>

          <Link to="/global" className="flex items-center gap-1 text-sm">
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </Link>

          <Link to="/healthcare-center" className="flex items-center gap-1 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Healthcare Center</span>
          </Link>

          <div className="ml-auto hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-600">E-Services</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="container pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                className="px-3 py-1.5 rounded-full border bg-white text-gray-700 hover:bg-gray-50 whitespace-nowrap text-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
