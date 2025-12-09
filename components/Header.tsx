"use client"

import { Heart, ShoppingCart, Globe, User, MapPin, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef } from "react"
import { useCart } from "@/components/CartProvider"

export default function Header() {
  const ref = useRef<HTMLElement | null>(null)
  const { count, setOpen } = useCart()

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

          {/* Logo + Express Badge */}
          <div className="flex items-center gap-2">

            <Image
              src="/Rasss-logo1.png"
              alt="Rasss"
              width={96}
              height={26}
              className="opacity-95"
            />

            <Badge
              variant="secondary"
              className="hidden md:inline-flex bg-white/10 text-white border-white/20 backdrop-blur-sm"
            >
              <Timer className="w-3 h-3" /> 2h Express Lahore
            </Badge>
          </div>

          {/* Deliver Location */}
          <div className="hidden lg:flex items-center gap-2 ml-4 text-sm">
            <MapPin className="w-4 h-4 text-white" />
            <span>Deliver to</span>
            <span className="font-medium">Lahore</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1">
            <Input
              placeholder="Search for products, brands and more"
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
            >
              <Globe className="w-4 h-4" />
            </Button>

            {/* Language (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all"
            >
              <Globe className="w-4 h-4" />
              EN | اردو
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
              Login
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all"
            >
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
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
