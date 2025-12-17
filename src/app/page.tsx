"use client"

import Header from "@/components/Header"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import BrandShowcase from "@/components/BrandShowcase"
import CategoriesGrid from "@/components/CategoriesGrid"
import Footer from "@/components/Footer"
import Image from "next/image"
import { useState } from "react"
import { useI18n } from "@/components/I18nProvider"
import { buildImageKitUrl } from "@/lib/utils"

export default function Home() {
  const { t } = useI18n()
  const banner2Rel = "Home/assets/Banner/banner2.jpg"
  const altBanner2Rel = "assets/Banner/banner2.jpg"
  const [banner2Src, setBanner2Src] = useState(buildImageKitUrl(banner2Rel))
  const [banner2TriedAlt, setBanner2TriedAlt] = useState(false)
  const handleBanner2Error = () => {
    if (!banner2TriedAlt) {
      setBanner2Src(buildImageKitUrl(altBanner2Rel))
      setBanner2TriedAlt(true)
    } else {
      setBanner2Src("https://picsum.photos/seed/fallback-banner-2/1600/900")
    }
  }
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <Navigation />
      <Hero />

      
      <BrandShowcase />
      <section className="my-8">
        <div className="relative w-full max-w-[3200px] mx-auto overflow-hidden aspect-[16/9] md:rounded-xl md:shadow-lg">
          <Image
            src={banner2Src}
            alt="Skin Care Deals"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, (max-width:1536px) 100vw, 3200px"
            onError={handleBanner2Error}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 gap-3">
            <h2 className="text-3xl md:text-5xl font-bold">{t("home.browseCategories")}</h2>
            <p className="text-base md:text-xl">{t("home.findFast")}</p>
            <div className="flex gap-3">
              <a href="/category/Skin Care" className="inline-flex">
                <button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm md:text-base">{t("home.viewCategories")}</button>
              </a>
              <a href="/flash-sales" className="inline-flex">
                <button className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm md:text-base">{t("home.shopNow")}</button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <CategoriesGrid />
      <section className="my-8">
        <div className="relative w-full max-w-[3200px] mx-auto overflow-hidden aspect-[16/9] md:rounded-xl md:shadow-lg">
          <Image
            src={banner2Src}
            alt="Browse Categories"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, (max-width:1536px) 100vw, 3200px"
            onError={handleBanner2Error}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 gap-3">
            <h2 className="text-3xl md:text-5xl font-bold">{t("home.browseCategories")}</h2>
            <p className="text-base md:text-xl">{t("home.findFast")}</p>
            <div className="flex gap-3">
              <a href="#categories" className="inline-flex">
                <button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm md:text-base">{t("home.viewCategories")}</button>
              </a>
              <a href="/flash-sales" className="inline-flex">
                <button className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm md:text-base">{t("home.shopNow")}</button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
