import { Facebook, Instagram, Linkedin, Twitter, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#2c6ba4] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Rasss Online</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  All Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Flash Sales
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Guest Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Returns & Exchange
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Rasss Medical</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Our Company
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Follow Rasss</h4>
            <div className="flex gap-3 mb-6">
              <Button
                size="icon"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 gap-2">
                <Smartphone className="w-4 h-4" />
                App Store
              </Button>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 gap-2">
                <Smartphone className="w-4 h-4" />
                Play Store
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <h5 className="font-bold text-white mb-3">Quick Links</h5>
              <div className="grid grid-cols-2 gap-2">
                <a href="#" className="hover:text-white">
                  Fragrances
                </a>
                <a href="#" className="hover:text-white">
                  Makeup
                </a>
                <a href="#" className="hover:text-white">
                  Baby Care
                </a>
                <a href="#" className="hover:text-white">
                  Vitamins
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-200">
          <p>&copy; 2025 Rasss Pakistan · Lahore</p>
        </div>
      </div>
    </footer>
  )
}
