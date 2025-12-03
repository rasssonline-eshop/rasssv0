"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const slides = [
  {
    id: 1,
    title: "Beauty & Wellness",
    subtitle: "Exclusive deals across health, beauty and baby care",
  },
  {
    id: 2,
    title: "Great Prices",
    subtitle: "Exclusive online deals every day",
  },
  {
    id: 3,
    title: "Same-Day Delivery",
    subtitle: "Available in major cities",
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-gradient-to-r from-primary to-accent rounded-lg overflow-hidden h-80">
          <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
            <Button size="icon" variant="ghost" onClick={prev} className="bg-white/70 hover:bg-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="text-center text-primary-foreground">
              <h2 className="text-4xl font-bold mb-2">{slides[current].title}</h2>
              <p className="text-lg">{slides[current].subtitle}</p>
            </div>

            <Button size="icon" variant="ghost" onClick={next} className="bg-white/70 hover:bg-white">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition ${idx === current ? "bg-white w-6" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
