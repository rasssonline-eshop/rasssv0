"use client"

import Header from "@/components/Header"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import BrandShowcase from "@/components/BrandShowcase"
import CategoriesGrid from "@/components/CategoriesGrid"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <Navigation />
      <Hero />
      <BrandShowcase />
      <CategoriesGrid />
      <Footer />
    </main>
  )
}
