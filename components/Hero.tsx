"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    title: "Beauty & Wellness",
    subtitle: "Made for Pakistan · Lahore delivery",
    image: "https://picsum.photos/seed/beauty/1200/600",
  },
  {
    id: 2,
    title: "Great Prices",
    subtitle: "Exclusive online deals every day",
    image: "https://picsum.photos/seed/skincare/1200/600",
  },
  {
    id: 3,
    title: "Same-Day Delivery",
    subtitle: "Available in Lahore",
    image: "https://picsum.photos/seed/wellness/1200/600",
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  return (
    <section className="bg-gray-50">
      <div className="relative w-full overflow-hidden h-[48vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-accent/60" />
          <div className="absolute inset-0 flex items-center justify-between px-6 md:px-8 z-10">
            <Button size="icon" variant="ghost" onClick={prev} className="bg-white/70 hover:bg-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="text-center text-white">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{slides[current].title}</h2>
              <p className="text-base md:text-xl lg:text-2xl">{slides[current].subtitle}</p>
            </div>

            <Button size="icon" variant="ghost" onClick={next} className="bg-white/70 hover:bg-white">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition ${idx === current ? "bg-white w-8" : "bg-white/60 w-2"}`}
              />
            ))}
          </div>
      </div>
    </section>
  )
}
