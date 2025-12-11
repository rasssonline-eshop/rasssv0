"use client"

import Link from "next/link"
import { Home, Grid2X2, Globe, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/components/CartProvider"
import { useI18n } from "@/components/I18nProvider"

export default function MobileNav() {
  const { count } = useCart()
  const { t } = useI18n()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white border-t border-gray-200">
      <div className="grid grid-cols-5 text-xs">
        <Link href="/" className="flex flex-col items-center justify-center py-2 gap-1">
          <Home className="w-5 h-5" />
          <span>{t("mobile.home")}</span>
        </Link>
        <a href="#categories" className="flex flex-col items-center justify-center py-2 gap-1">
          <Grid2X2 className="w-5 h-5" />
          <span>{t("mobile.categories")}</span>
        </a>
        <Link href="/global" className="flex flex-col items-center justify-center py-2 gap-1">
          <Globe className="w-5 h-5" />
          <span>{t("mobile.brands")}</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center justify-center py-2 gap-1 relative">
          <ShoppingCart className="w-5 h-5" />
          {count > 0 && <span className="absolute top-1 right-6 bg-red-500 text-white text-[10px] rounded-full px-1">{count}</span>}
          <span>{t("mobile.cart")}</span>
        </Link>
        <Link href="/e-services/consult-a-gp" className="flex flex-col items-center justify-center py-2 gap-1">
          <User className="w-5 h-5" />
          <span>{t("mobile.account")}</span>
        </Link>
      </div>
    </nav>
  )
}
