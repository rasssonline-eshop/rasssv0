import { Card } from "@/components/ui/card"
import { useI18n } from "@/components/I18nProvider"

const brands = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: i,
    name: `Brand ${i + 1}`,
  }))

export default function BrandShowcase() {
  const { t } = useI18n()
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">{t("brands.shopBy")}</h2>
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-8">
          <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className="bg-white text-gray-700 aspect-square flex items-center justify-center cursor-pointer hover:shadow-md transition-transform hover:-translate-y-0.5 rounded-md ring-1 ring-white/20"
              >
                <span className="text-sm font-medium opacity-80">{brand.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
