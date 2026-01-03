"use client"

import { useState } from "react"
import { useAdmin } from "@/components/AdminProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Settings as SettingsIcon, Store, Truck, CreditCard, Mail, MessageCircle } from "lucide-react"

export default function SettingsPage() {
    const { store, setWhatsappNumber } = useAdmin()
    const [whatsapp, setWhatsapp] = useState(store.whatsappNumber || '')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setWhatsappNumber(whatsapp)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your store settings</p>
            </div>

            {/* WhatsApp Settings - Active */}
            <Card className="border-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-primary" />
                        <CardTitle>WhatsApp Chat Settings</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="whatsapp">Pharmacist WhatsApp Number</Label>
                        <p className="text-sm text-gray-500 mb-2">
                            Enter number with country code (e.g., 923001234567 for Pakistan)
                        </p>
                        <div className="flex gap-2">
                            <Input
                                id="whatsapp"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="923001234567"
                                className="flex-1"
                            />
                            <Button onClick={handleSave}>
                                {saved ? 'Saved!' : 'Save'}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            This number will be used for the "Chat with Pharmacist" button on product pages
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Store className="w-6 h-6 text-primary" />
                            <CardTitle>Store Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Configure store name, logo, contact information, and general settings
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Truck className="w-6 h-6 text-primary" />
                            <CardTitle>Shipping Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Manage shipping zones, rates, and delivery options
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-primary" />
                            <CardTitle>Payment Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Configure payment methods (COD, Card, Bank Transfer)
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Mail className="w-6 h-6 text-primary" />
                            <CardTitle>Email Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Set up order confirmations and shipping notifications
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                    </CardContent>
                </Card>
            </div>

            {/* Current Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Store Name</span>
                            <span className="font-medium">Rasss</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Currency</span>
                            <span className="font-medium">PKR (Rs)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Timezone</span>
                            <span className="font-medium">Asia/Karachi (PKT)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">WhatsApp Number</span>
                            <span className="font-medium">{store.whatsappNumber || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Default Payment Method</span>
                            <span className="font-medium">Cash on Delivery</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
