"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { useI18n } from "@/components/I18nProvider"
import { User, Package, Heart, MapPin, LogOut } from "lucide-react"

export default function CustomerProfilePage() {
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuth()
    const { t } = useI18n()

    if (!isAuthenticated || user?.role !== "customer") {
        router.push("/login")
        return null
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{t("profile.myProfile")}</CardTitle>
                        <CardDescription>Manage your account and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.phone}</p>
                                {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 text-primary" />
                                <CardTitle className="text-lg">{t("profile.orders")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">View your order history</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6 text-primary" />
                                <CardTitle className="text-lg">{t("profile.wishlist")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Manage your wishlist</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-primary" />
                                <CardTitle className="text-lg">{t("profile.addresses")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Manage delivery addresses</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Button onClick={handleLogout} variant="destructive" className="w-full">
                            <LogOut className="w-4 h-4 mr-2" />
                            {t("auth.logout")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
