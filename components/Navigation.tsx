"use client"

import { ChevronDown, Zap, Globe, Heart, Store } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/I18nProvider"
import { useEffect, useState } from "react"

const defaultCategories = [
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
  const pathname = usePathname()
  const { t } = useI18n()
  const [categoryNames, setCategoryNames] = useState<string[]>(defaultCategories)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setCategoryNames(data.map((c: any) => c.name))
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  const labelFor = (cat: string) => {
    switch (cat) {
      case "Fragrances": return t("cat.fragrances")
      case "Makeup": return t("cat.makeup")
      case "Baby Care & Diapers": return t("cat.babyCareDiapers")
      case "Vitamins": return t("cat.vitamins")
      case "Skin Care": return t("cat.skinCare")
      case "Baby Accessories": return t("cat.babyAccessories")
      case "Hair Care": return t("cat.hairCare")
      case "Personal Care": return t("cat.personalCare")
      default: return cat
    }
  }
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[calc(var(--header-height)-6px)] z-[100] shadow-sm">
      <div className="px-4 overflow-x-auto sm:overflow-visible no-scrollbar">
        <div className="hidden sm:flex items-center gap-4 sm:gap-6 py-2 flex-nowrap">
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
                <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">{t("nav.shopByCategory")}</span>
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

            <DropdownMenuContent align="start" className="w-48 max-h-[80vh] overflow-y-auto">
              {categoryNames.map((cat) => (
                <DropdownMenuItem key={cat} asChild>
                  <Link href={`/category/${encodeURIComponent(cat)}`} className="w-full cursor-pointer">
                    {cat}
                  </Link>
                </DropdownMenuItem>
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
                <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">{t("nav.eServices")}</span>
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
            {/* E-SERVICES DROPDOWN CONTENT */}
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/healthcare-center" className="w-full cursor-pointer">{t("nav.healthcareCenter")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/e-services/consult-a-gp" className="w-full cursor-pointer">Consult a GP</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/e-services" className="flex items-center gap-2 w-full cursor-pointer">
                  <Store className="w-4 h-4 text-purple-600" />
                  <span>{t("nav.sellWithRass")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* FLASH SALES */}
          <Link href="/flash-sales" className={`relative group text-sm font-medium pb-3 pr-1 flex items-center gap-1 ${pathname === '/flash-sales' ? 'text-blue-600' : ''}`}>
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">{t("nav.flashSales")}</span>
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
          <Link href="/global" className={`relative group text-sm font-medium pb-3 pr-1 flex items-center gap-1 ${pathname === '/global' ? 'text-blue-600' : ''}`}>
            <Globe className="w-4 h-4" />
            <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">{t("nav.global")}</span>
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
          <Link href="/healthcare-center" className={`relative group text-sm font-medium pb-3 pr-1 flex items-center gap-1 ${pathname === '/healthcare-center' ? 'text-blue-600' : ''}`}>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(0,123,255,0.25)]">{t("nav.healthcareCenter")}</span>
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

        {/* Mobile Category List */}
        <div className="sm:hidden py-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-2 px-1">
            {categoryNames.map((cat) => (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${pathname?.includes(encodeURIComponent(cat))
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
                  }`}
              >
                {labelFor(cat)}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </nav >
  )
}
