"use client"

import { Heart, ShoppingCart, Globe, User, MapPin, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef } from "react"

export default function Header() {
  const ref = useRef<HTMLElement | null>(null)
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
      <div className="px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/Rasss-logo1.png" alt="Rasss" width={96} height={26} className="brightness-75 contrast-110" />
            <Badge variant="secondary" className="hidden md:inline-flex bg-white/10 text-white border-white/20">
              <Timer className="w-3 h-3" /> 2h Express
            </Badge>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-4 text-sm">
            <MapPin className="w-4 h-4 text-white" />
            <span>Deliver to</span>
            <span className="font-medium">Riyadh</span>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search for products, brands and more"
              className="w-full h-8 bg-white/10 text-white placeholder:text-white/60 border border-white/20"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
              <Globe className="w-4 h-4" />
              EN
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
              <User className="w-4 h-4" />
              Login
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
