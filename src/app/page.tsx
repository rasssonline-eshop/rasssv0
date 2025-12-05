"use client"

import Header from "@/components/Header"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import BrandShowcase from "@/components/BrandShowcase"
import CategoriesGrid from "@/components/CategoriesGrid"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <Navigation />
      <Hero />

      
      <BrandShowcase />
      <section className="my-8">
        <div className="relative w-full overflow-hidden h-[40vh] md:h-[50vh] lg:h-[60vh]">
          <Image
            src="https://picsum.photos/seed/skincare-banner/1600/900"
            alt="Skin Care Deals"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 1600px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 gap-3">
            <h2 className="text-3xl md:text-5xl font-bold">Skin Care Deals</h2>
            <p className="text-base md:text-xl">Made for Pakistan · Lahore delivery</p>
            <a href="/category/Skin Care" className="inline-flex">
              <button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm md:text-base">Shop Skin Care</button>
            </a>
          </div>
        </div>
      </section>
      <CategoriesGrid />
      <section className="my-8">
        <div className="relative w-full overflow-hidden h-[40vh] md:h-[50vh] lg:h-[60vh]">
          <Image
            src="https://picsum.photos/seed/babycare-banner/1600/900"
            alt="Browse Categories"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 1600px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 gap-3">
            <h2 className="text-3xl md:text-5xl font-bold">Browse Categories</h2>
            <p className="text-base md:text-xl">Find what you need, fast</p>
            <a href="#categories" className="inline-flex">
              <button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm md:text-base">View Categories</button>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
