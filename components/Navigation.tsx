"use client"

import { ChevronDown, Zap, Globe, Heart } from "lucide-react"
import Link from "next/link"
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
    <nav className="bg-white border-b border-gray-200 sticky top-[calc(var(--header-height)-6px)] z-40 shadow-sm">
      <div className="px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 sm:gap-6 py-2 flex-nowrap">
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

          <Link href="/flash-sales" className="flex items-center gap-1 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Flash Sales</span>
          </Link>

          <Link href="/global" className="flex items-center gap-1 text-sm">
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </Link>

          <Link href="/healthcare-center" className="flex items-center gap-1 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Healthcare Center</span>
          </Link>

          <div className="ml-auto hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent text-foreground">
                  E-Services
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/healthcare-center">Health Center</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/e-services/consult-a-gp">Consult a GP</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
