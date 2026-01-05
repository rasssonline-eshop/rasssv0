"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const slides = [
  {
    id: 1,
    title: "+5,000 Vitamins",
    subtitle: "Fastest International Shipping",
    image: "/vitamins-supplements.jpg",
  },
  {
    id: 2,
    title: "Beauty Essentials",
    subtitle: "Premium Quality Products",
    image: "/makeup-beauty-products.jpg",
  },
  {
    id: 3,
    title: "Healthcare",
    subtitle: "Complete Wellness Solution",
    image: "/health-care-products.jpg",
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-black rounded-2xl overflow-hidden h-[500px] shadow-2xl group">
          {/* Background Images with Fade Transition */}
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-105"
              />
            </div>
          ))}

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-12">
            <Button
              size="icon"
              variant="outline"
              onClick={prev}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md hidden md:flex rounded-full h-12 w-12"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="text-center md:text-left text-white max-w-2xl mx-auto md:mx-0 animate-fade-in-up md:pl-12">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium mb-4 backdrop-blur-sm">
                Rasss Exclusive
              </span>
              <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight text-balance">
                {slides[current].title}
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 font-light max-w-lg leading-relaxed">
                {slides[current].subtitle}
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Learn More
                </Button>
              </div>
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={next}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md hidden md:flex rounded-full h-12 w-12"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
