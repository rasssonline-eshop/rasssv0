"use client"

import { Heart, ShoppingCart, Globe, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/Rasss-logo1.png" alt="Rasss" width={120} height={32} />
            <span className="text-xs">Health & Beauty</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-4 text-sm">
            <MapPin className="w-4 h-4 text-white" />
            <span>Deliver to</span>
            <span className="font-medium">Riyadh</span>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search for products, brands and more"
              className="w-full bg-white/10 text-white placeholder:text-white/60 border border-white/20"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
              <Globe className="w-4 h-4" />
              EN
            </Button>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
              <User className="w-4 h-4" />
              Login
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Heart className="w-5 h-5" />
            </Button>
            <Button className="bg-primary text-primary-foreground">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
