"use client"

import { Heart, ShoppingCart, Globe, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useEffect, useRef } from "react"
import { useCart } from "@/components/CartProvider"

export default function Header() {
  const ref = useRef<HTMLElement | null>(null)
  const { count, setOpen } = useCart()
  useEffect(() => {
    const update = () => {
      const h = ref.current?.offsetHeight ?? 0
      document.documentElement.style.setProperty('--header-height', `${h}px`)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return (
    <header ref={ref} className="bg-[#2c6ba4] text-white sticky top-0 z-50 shadow-sm">
      <div className="container py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/Rasss-logo1.png" alt="Rasss" width={96} height={26} className="opacity-95 drop-shadow-[0_0_16px_rgba(0,0,0,0.65)]" />
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-4 text-sm">
            <MapPin className="w-4 h-4 text-white" />
            <span>Deliver to</span>
            <span className="font-medium">Lahore</span>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search for products, brands and more"
              className="w-full h-10 bg-white/10 text-white placeholder:text-white/60 border border-white/20"
            />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 sm:hidden">
              <Globe className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hidden sm:flex">
              <Globe className="w-4 h-4" />
              EN | اردو
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 sm:hidden">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hidden sm:flex">
              <User className="w-4 h-4" />
              Login
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="sm" className="relative bg-primary text-primary-foreground" onClick={() => setOpen(true)}>
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">{count}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
