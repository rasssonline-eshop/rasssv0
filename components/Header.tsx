"use client"

import { Heart, ShoppingCart, Globe, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useCart } from "@/components/CartProvider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLocation, cities } from "@/components/LocationProvider"
import { useI18n } from "@/components/I18nProvider"

export default function Header() {
  const ref = useRef<HTMLElement | null>(null)
  const { count, setOpen } = useCart()
  const { city, setCity } = useLocation()
  const [query, setQuery] = useState("")
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    const update = () => {
      const h = ref.current?.offsetHeight ?? 0
      document.documentElement.style.setProperty("--header-height", `${h}px`)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <header
      ref={ref}
      className="bg-[#2c6ba4] text-white sticky top-0 z-50 shadow-sm backdrop-blur-sm"
    >
      <div className="px-4 py-2">
        <div className="flex items-center gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2">

            <Image
              src="/Rasss-logo1.png"
              alt="Rasss"
              width={96}
              height={26}
              className="opacity-95"
            />
          </div>

          {/* Deliver Location */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 ml-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-1.5">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-white/90">{t("deliverTo")}</span>
                <span className="font-medium">{city}</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{lang === 'ur' ? 'ڈیلیوری مقام منتخب کریں' : 'Select delivery location'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder={lang === 'ur' ? 'شہر تلاش کریں' : 'Search city'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-white"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cities
                    .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
                    .map((c) => (
                      <button
                        key={c}
                        onClick={() => setCity(c)}
                        className={`px-3 py-2 rounded-md border text-sm ${c === city ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-gray-50'}`}
                      >
                        {c}
                      </button>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search Bar */}
          <div className="flex-1">
            <Input
              placeholder={t("search.placeholder")}
              className="w-full h-9 bg-white/10 text-white placeholder:text-white/60 border border-white/20 rounded-xl backdrop-blur-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">

            {/* Language (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 sm:hidden rounded-xl transition-all"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            >
              <Globe className="w-4 h-4" />
            </Button>

            {/* Language (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'EN | اردو' : 'اردو | EN'}
            </Button>

            {/* User (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 sm:hidden rounded-xl transition-all"
            >
              <User className="w-4 h-4" />
            </Button>

            {/* User (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all"
            >
              <User className="w-4 h-4" />
              {t("login")}
            </Button>

            {/* Wishlist */}
            <Button aria-label="Wishlist"
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all"
            >
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button aria-label="Open cart"
              size="sm"
              className="relative bg-white text-[#2c6ba4] font-medium hover:bg-white/90 px-3 py-1.5 rounded-xl transition-all shadow-md"
              onClick={() => setOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1 shadow-md">
                  {count}
                </span>
              )}
            </Button>

          </div>
        </div>
      </div>
    </header>
  )
}
