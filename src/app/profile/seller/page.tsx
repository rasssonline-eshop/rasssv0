"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/AuthProvider"
import { useI18n } from "@/components/I18nProvider"
import { Store, Package, AlertCircle, CheckCircle, XCircle, LogOut } from "lucide-react"
import Link from "next/link"

export default function SellerProfilePage() {
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuth()
    const { t } = useI18n()

    if (!isAuthenticated || user?.role !== "seller") {
        router.push("/login")
        return null
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const getStatusBadge = () => {
        switch (user.sellerStatus) {
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />{t("seller.pending")}</Badge>
            case "approved":
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{t("seller.approved")}</Badge>
            case "rejected":
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t("seller.rejected")}</Badge>
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{t("seller.dashboard")}</CardTitle>
                                <CardDescription>Manage your seller account</CardDescription>
                            </div>
                            {getStatusBadge()}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                            {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                        </div>
                    </CardContent>
                </Card>

                {user.sellerStatus === "pending" && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {t("seller.waitingApproval")}
                        </AlertDescription>
                    </Alert>
                )}

                {user.sellerStatus === "rejected" && user.rejectionReason && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>{t("seller.rejectionReason")}:</strong> {user.rejectionReason}
                        </AlertDescription>
                    </Alert>
                )}

                {user.sellerStatus === "approved" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Store className="w-6 h-6 text-primary" />
                                    <CardTitle className="text-lg">{t("seller.sellOurProducts")}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Browse and sell products from our catalog
                                </p>
                                <Button className="w-full">Get Started</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow opacity-60 cursor-not-allowed">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Package className="w-6 h-6 text-muted-foreground" />
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{t("seller.sellYourProducts")}</CardTitle>
                                        <Badge variant="secondary" className="mt-1">{t("badge.comingSoon")}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    List and sell your own products (coming soon)
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card>
                    <CardContent className="pt-6 space-y-3">
                        <Link href="/admin/sellers">
                            <Button variant="outline" className="w-full">
                                View Admin Dashboard (Test)
                            </Button>
                        </Link>
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
