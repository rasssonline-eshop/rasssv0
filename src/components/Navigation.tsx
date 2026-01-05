import { ChevronDown, Zap, Globe, Heart, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/I18nProvider"
import { useAdmin } from "@/components/AdminProvider"

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
  const { store } = useAdmin()

  // Use store categories if available, otherwise fallback to defaults (only names)
  const categoryNames = store.categories.length > 0
    ? store.categories.map(c => c.name)
    : defaultCategories

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
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-[calc(var(--header-height,56px)-6px)] z-40 shadow-sm">
      <div className="px-4">
        <div className="container hidden sm:flex items-center gap-4 sm:gap-6 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                {t("nav.shopByCategory")}
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-[80vh] overflow-y-auto p-2 animate-in slide-in-from-top-2 duration-200">
              {categoryNames.map((cat) => (
                <DropdownMenuItem key={cat} asChild className="rounded-lg transition-colors duration-200">
                  <Link href={`/category/${encodeURIComponent(cat)}`} className="w-full cursor-pointer py-2.5 px-3">
                    {labelFor(cat)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/flash-sales" className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-primary ${pathname === '/flash-sales' ? 'text-primary' : 'text-gray-600'}`}>
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>{t("nav.flashSales")}</span>
          </Link>

          <Link href="/global" className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-primary ${pathname === '/global' ? 'text-primary' : 'text-gray-600'}`}>
            <Globe className="w-4 h-4" />
            <span>{t("nav.global")}</span>
          </Link>

          <Link href="/healthcare-center" className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-primary ${pathname === '/healthcare-center' ? 'text-primary' : 'text-gray-600'}`}>
            <Heart className="w-4 h-4 text-red-500" />
            <span>{t("nav.healthcareCenter")}</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-primary hover:bg-transparent transition-colors duration-300">
                <span>SERVICES</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 animate-in slide-in-from-top-2 duration-200">
              <DropdownMenuItem asChild className="rounded-lg transition-colors duration-200">
                <Link href="/e-services" className="w-full cursor-pointer py-2.5 px-3">
                  {t("nav.eServices")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg transition-colors duration-200">
                <Link href="/login?tab=register&role=seller" className="w-full flex items-center gap-2 cursor-pointer py-2.5 px-3">
                  <Store className="w-4 h-4 text-purple-600" />
                  <span>{t("nav.sellWithRass")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="container py-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
            {categoryNames.map((cat) => {
              const href = `/category/${encodeURIComponent(cat)}`
              const active = pathname?.startsWith(href)
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium border snap-start transition-all duration-300 hover:scale-105 active:scale-95 ${active
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
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
