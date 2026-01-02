"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, Store, Truck, CreditCard, Mail } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your store settings</p>
            </div>

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
