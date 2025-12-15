"use client"

import { Card } from "@/components/ui/card"
import { useI18n } from "@/components/I18nProvider"
import Image from "next/image"
import { useAdmin } from "@/components/AdminProvider"

const brands = [
  { id: 1, name: 'Uriage', logo: 'https://picsum.photos/seed/brand-1/200/200' },
  { id: 2, name: 'La Roche-Posay', logo: 'https://picsum.photos/seed/brand-2/200/200' },
  { id: 3, name: 'Vichy', logo: 'https://picsum.photos/seed/brand-3/200/200' },
  { id: 4, name: 'Avene', logo: 'https://picsum.photos/seed/brand-4/200/200' },
  { id: 5, name: 'Bioderma', logo: 'https://picsum.photos/seed/brand-5/200/200' },
  { id: 6, name: 'Cerave', logo: 'https://picsum.photos/seed/brand-6/200/200' },
  { id: 7, name: 'Eucerin', logo: 'https://picsum.photos/seed/brand-7/200/200' },
  { id: 8, name: 'Nuxe', logo: 'https://picsum.photos/seed/brand-8/200/200' },
  { id: 9, name: 'The Ordinary', logo: 'https://picsum.photos/seed/brand-9/200/200' },
  { id: 10, name: 'L’Oreal', logo: 'https://picsum.photos/seed/brand-10/200/200' },
]

export default function BrandShowcase() {
  const { t } = useI18n()
  const { store } = useAdmin()
  return (
    <section id="brands" className="py-12 bg-white">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">{t("brands.shopBy")}</h2>
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-8">
          <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
            {(store.brands.length ? store.brands : brands).map((brand) => (
              <Card
                key={brand.id}
                className="bg-white/10 aspect-square relative overflow-hidden cursor-pointer transition-transform hover:-translate-y-0.5 hover:scale-105 rounded-md ring-1 ring-white/20 hover:ring-primary/30"
              >
                <Image src={brand.logo} alt={brand.name} fill className="object-cover" sizes="100px" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
