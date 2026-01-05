import { Heart, ShoppingCart, Globe, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/components/I18nProvider"
import React from "react"

export default function Header() {
  const { lang, setLang, t } = useI18n()
  return (
    <header className="bg-gradient-to-r from-[#1e4b7a] to-[#2c6ba4] text-white sticky top-0 z-50 shadow-lg">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 group">
            <img src="/Rasss-logo1.png" alt="Rasss" className="h-7 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-sm font-medium opacity-90">{lang === 'ur' ? 'ہیلتھ اینڈ بیوٹی' : 'Health & Beauty'}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full px-4"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'EN | اردو' : 'اردو | EN'}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full px-4">
              <User className="w-4 h-4" />
              {t('login')}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="sm" className="bg-white text-[#2c6ba4] hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-4 font-medium">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Cart
            </Button>
          </div>
        </div>
        <div className="mt-4 hidden sm:block">
          <Input
            placeholder={t('search.placeholder')}
            className="w-full h-11 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/60 border border-white/20 rounded-full px-5 transition-all duration-300 focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>
    </header>
  )
}
