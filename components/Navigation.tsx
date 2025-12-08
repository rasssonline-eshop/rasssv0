"use client"

import { ChevronDown, Zap, Globe, Heart } from "lucide-react"
import Link from "next/link"
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

          {/* CATEGORY DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  relative
                  text-sm font-medium
                  text-foreground
                  pb-3
                  pr-1
                  group
                "
              >
                <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">
                  Shop by Category
                </span>
                <ChevronDown className="w-4 h-4 inline-block ml-1" />

                <span
                  className="
                    absolute bottom-0 right-0
                    h-[3px] w-full bg-blue-400 rounded-full
                    translate-y-3 opacity-0
                    transition-all duration-300 ease-out
                    group-hover:translate-y-0 group-hover:opacity-100
                  "
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat}>{cat}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* E-SERVICES DROPDOWN — MOVED TO LEFT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  relative
                  text-sm font-medium
                  text-foreground
                  pb-3
                  pr-1
                  group
                "
              >
                <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">
                  E-Services
                </span>
                <ChevronDown className="w-4 h-4 inline-block ml-1" />

                <span
                  className="
                    absolute bottom-0 right-0
                    h-[3px] w-full bg-blue-400 rounded-full
                    translate-y-3 opacity-0
                    transition-all duration-300 ease-out
                    group-hover:translate-y-0 group-hover:opacity-100
                  "
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/healthcare-center">Health Center</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/e-services/consult-a-gp">Consult a GP</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* FLASH SALES */}
          <Link href="/flash-sales" className="relative group text-sm font-medium pb-3 pr-1 flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">
              Flash Sales
            </span>

            <span
              className="
                absolute bottom-0 right-0
                h-[3px] w-full bg-blue-400 rounded-full
                translate-y-3 opacity-0 transition-all duration-300 ease-out
                group-hover:translate-y-0 group-hover:opacity-100
              "
            />
          </Link>

          {/* GLOBAL */}
          <Link href="/global" className="relative group text-sm font-medium pb-3 pr-1 flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">
              Global
            </span>

            <span
              className="
                absolute bottom-0 right-0
                h-[3px] w-full bg-blue-400 rounded-full
                translate-y-3 opacity-0 transition-all duration-300 ease-out
                group-hover:translate-y-0 group-hover:opacity-100
              "
            />
          </Link>

          {/* HEALTHCARE CENTER */}
          <Link href="/healthcare-center" className="relative group text-sm font-medium pb-3 pr-1 flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">
              Healthcare Center
            </span>

            <span
              className="
                absolute bottom-0 right-0
                h-[3px] w-full bg-blue-400 rounded-full
                translate-y-3 opacity-0 transition-all duration-300 ease-out
                group-hover:translate-y-0 group-hover:opacity-100
              "
            />
          </Link>

        </div>
      </div>
    </nav>
  )
}
