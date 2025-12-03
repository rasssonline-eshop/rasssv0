"use client"

import { ChevronDown, Zap, Globe, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent text-foreground">
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

          <div className="flex items-center gap-1 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Flash Sales</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Healthcare Center</span>
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-gray-600">E-Services</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </nav>
  )
}
