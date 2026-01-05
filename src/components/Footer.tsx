import { Facebook, Instagram, Linkedin, Twitter, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/I18nProvider"

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="bg-gradient-to-b from-[#1e4b7a] to-[#15324f] text-white">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-white/50 rounded-full"></span>
              {t("footer.rasssOnline")}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {t("footer.home")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {t("footer.allCategories")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {t("footer.flashSales")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-white/50 rounded-full"></span>
              {t("footer.guestServices")}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {t("footer.deliveryInfo")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {t("footer.returnsExchange")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  {t("footer.contactUs")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-white/50 rounded-full"></span>
              Rasss Medical
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                  Our Company
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-white/50 rounded-full"></span>
              Follow Rasss
            </h4>
            <div className="flex gap-3 mb-8">
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-gray-900 bg-transparent transition-all duration-300 hover:scale-110 rounded-full"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-gray-900 bg-transparent transition-all duration-300 hover:scale-110 rounded-full"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-gray-900 bg-transparent transition-all duration-300 hover:scale-110 rounded-full"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-gray-900 bg-transparent transition-all duration-300 hover:scale-110 rounded-full"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 gap-2 rounded-full px-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Smartphone className="w-4 h-4" />
                App Store
              </Button>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 gap-2 rounded-full px-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Smartphone className="w-4 h-4" />
                Play Store
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/60">
            <div>
              <h5 className="font-bold text-white mb-4">{t("footer.quickLinks")}</h5>
              <div className="grid grid-cols-2 gap-3">
                <a href="#" className="hover:text-white transition-colors duration-300">
                  {t("footer.fragrances")}
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  {t("footer.makeup")}
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  {t("footer.babyCare")}
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  {t("footer.vitamins")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/50">
          <p>&copy; 2025 Rasss Pakistan · Lahore</p>
        </div>
      </div>
    </footer>
  )
}
