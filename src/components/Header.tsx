import { Heart, ShoppingCart, Globe, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="bg-[#2c6ba4] text-white sticky top-0 z-50 shadow-sm">
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold tracking-tight">Rasss</div>
            <span className="text-xs sm:text-sm opacity-90">Health & Beauty</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
              <Globe className="w-4 h-4" />
              EN | اردو
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
              <User className="w-4 h-4" />
              Login
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="sm" className="bg-white text-[#2c6ba4] hover:bg-gray-100">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Input
            placeholder="Search for products, brands and more"
            className="w-full h-10 bg-white/10 text-white placeholder:text-white/60 border border-white/20"
          />
        </div>
      </div>
    </header>
  )
}
