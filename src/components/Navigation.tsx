import { ChevronDown, Zap, Globe, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useLocation } from "react-router-dom"
import { useI18n } from "@/components/I18nProvider"

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
  const location = useLocation()
  const pathname = location.pathname
  const { t } = useI18n()
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
    <nav className="bg-white border-b border-gray-200 sticky top-[calc(var(--header-height,56px)-6px)] z-40 shadow-sm">
      <div className="px-4">
        <div className="container flex items-center gap-4 sm:gap-6 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                {t("nav.shopByCategory")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat}>{cat}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/flash-sales" className={`flex items-center gap-1 text-sm ${pathname === '/flash-sales' ? 'text-blue-600' : ''}`}>
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>{t("nav.flashSales")}</span>
          </Link>

          <Link to="/global" className={`flex items-center gap-1 text-sm ${pathname === '/global' ? 'text-blue-600' : ''}`}>
            <Globe className="w-4 h-4" />
            <span>{t("nav.global")}</span>
          </Link>

          <Link to="/healthcare-center" className={`flex items-center gap-1 text-sm ${pathname === '/healthcare-center' ? 'text-blue-600' : ''}`}>
            <Heart className="w-4 h-4 text-red-500" />
            <span>{t("nav.healthcareCenter")}</span>
          </Link>

          <div className="ml-auto hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-600">{t("nav.eServices")}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="container pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
            {categories.map((cat) => {
              const href = `/category/${encodeURIComponent(cat)}`
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={cat}
                  to={href}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm border ${active ? 'bg-primary text-white border-primary hover:bg-primary/90' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {labelFor(cat)}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
