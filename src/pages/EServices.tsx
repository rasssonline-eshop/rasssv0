"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Store, Calendar, Globe } from "lucide-react"
import { useI18n } from "@/components/I18nProvider"

export default function EServices() {
    const { t } = useI18n()

    const services = [
        {
            title: "Online Consultation",
            description: "Connect with certified doctors for quick and secure medical advice.",
            icon: Globe,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            action: "Start Consultation"
        },
        {
            title: "Book a Checkup",
            description: "Schedule appointment with top specialists at our partner clinics.",
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-50",
            action: "Book Now"
        },
        {
            title: "Sell with Rass",
            description: "Join our marketplace. Dropshipping and Halal terms available.",
            icon: Store,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            action: "Register as Seller",
            isNew: true
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t("nav.eServices")}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="flex flex-col p-6 hover:shadow-lg transition-all border-gray-200">
                            <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-6`}>
                                <service.icon className={`w-6 h-6 ${service.color}`} />
                            </div>

                            <div className="flex-1 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                    {service.isNew && <Badge variant="secondary" className="bg-purple-100 text-purple-700">New</Badge>}
                                </div>
                                <p className="text-gray-600">
                                    {service.description}
                                </p>
                            </div>

                            <Button className="w-full justify-between group" variant="outline">
                                <span>{service.action}</span>
                                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
