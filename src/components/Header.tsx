import { Heart, ShoppingCart, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="bg-primary text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">RASSS</div>
            <span className="text-sm opacity-90">Health & Beauty</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-dark">
              <Globe className="w-5 h-5" />
            </Button>
            <Button className="bg-white text-primary hover:bg-gray-100">Login & Register</Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-dark">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-dark">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search Beauty, Personal Care, Supplements..."
              className="w-full bg-white/20 text-white placeholder:text-white/60 border-0"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
