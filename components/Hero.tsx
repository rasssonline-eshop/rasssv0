"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useI18n } from "@/components/I18nProvider"
import { useAdmin } from "@/components/AdminProvider"
import { useLocation } from "@/components/LocationProvider"
import Image from "next/image"
import { buildImageKitUrl } from "@/lib/utils"

const baseSlides = [
  { id: 1, titleKey: "hero.slide1.title", subtitleKey: "hero.slide1.subtitle", image: buildImageKitUrl("Home/assets/Banner/banner1.jpg") },
  { id: 2, titleKey: "hero.slide2.title", subtitleKey: "hero.slide2.subtitle", image: buildImageKitUrl("Home/assets/Banner/banner1.jpg") },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const { t, lang } = useI18n()
  const { city } = useLocation()
  const { store } = useAdmin()
  const base = store.slides.length ? store.slides.map(s => ({ id: s.id, titleKey: s.title, subtitleKey: s.subtitle, image: s.image })) : baseSlides
  const initialSlides = base.map((s) => ({
    id: s.id,
    title: t(s.titleKey),
    subtitle: s.subtitleKey === "hero.slide3.subtitle"
      ? (lang === 'ur' ? `صرف ${city} میں دستیاب` : `Available in ${city}`)
      : t(s.subtitleKey),
    image: s.image,
  }))
  const fallbackImages = [
    "https://picsum.photos/seed/beauty/2400/1200",
    "https://picsum.photos/seed/wellness/3200/1800",
  ]
  const [slides, setSlides] = useState(initialSlides)
  useEffect(() => {
    let active = true
    initialSlides.forEach((s, i) => {
      const img = new window.Image()
      img.src = s.image
      img.onload = () => {}
      img.onerror = () => {
        if (!active) return
        const rel = s.image.replace(/^https?:\/\/ik\.imagekit\.io\/[^/]+\//i, '')
        const altRel = rel.startsWith('Home/') ? rel.replace(/^Home\//, '') : `Home/${rel}`
        const altAbs = buildImageKitUrl(altRel)
        const test = new window.Image()
        test.src = altAbs
        test.onload = () => {
          if (!active) return
          setSlides(prev => {
            const next = [...prev]
            next[i] = { ...prev[i], image: altAbs }
            return next
          })
        }
        test.onerror = () => {
          if (!active) return
          setSlides(prev => {
            const next = [...prev]
            next[i] = { ...prev[i], image: fallbackImages[i % fallbackImages.length] }
            return next
          })
        }
      }
    })
    return () => { active = false }
  }, [initialSlides[0]?.image, initialSlides[1]?.image])

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <section className="bg-gray-50">
      <div className="relative w-full max-w-[2400px] mx-auto overflow-hidden aspect-[2/1]">
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width:768px) 100vw, (max-width:1536px) 100vw, 2400px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/30 to-accent/50" />
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
                className={`h-2 rounded-full transition-all ${idx === current ? "bg-white w-8" : "bg-white/60 w-2 hover:bg-white/80"}`}
              />
            ))}
          </div>
      </div>
    </section>
  )
}
