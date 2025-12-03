"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, CalendarDays, Video } from "lucide-react"

export default function ConsultGPPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">Consult a GP</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Phone className="w-4 h-4" /> Call Support
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{t:"Book an appointment", i: CalendarDays}, {t:"Video consultation", i: Video}, {t:"Follow-up & prescriptions", i: CalendarDays}].map((item, idx) => (
          <Card key={idx} className="p-6 flex items-start gap-3">
            <item.i className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">{item.t}</div>
              <div className="text-sm text-gray-600">Simple, secure and convenient.</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button className="bg-primary text-primary-foreground">Start Consultation</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  )
}
