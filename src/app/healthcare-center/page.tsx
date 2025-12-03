"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Stethoscope, ShieldCheck } from "lucide-react"

export default function HealthcareCenterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">Healthcare Center</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Phone className="w-4 h-4" /> Call our Pharmacist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Consultation", "Medication Guidance", "Cold & Flu", "Skin & Hair", "Baby Care", "Wellness"].map((s) => (
          <Card key={s} className="p-6">
            <div className="font-semibold mb-2">{s}</div>
            <div className="text-sm text-gray-600">Trusted advice and curated products.</div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Genuine brands", "Temperature Controlled", "Secure Payment"].map((t) => (
          <Card key={t} className="p-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{t}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
