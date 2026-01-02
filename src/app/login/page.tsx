"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { useI18n } from "@/components/I18nProvider"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const { t } = useI18n()
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [activeTab, setActiveTab] = useState<"customer" | "seller">("customer")

    const handleSendOtp = () => {
        // Mock OTP send
        if (phone.length >= 10) {
            setOtpSent(true)
        }
    }

    const handleVerify = () => {
        // Mock OTP verification
        if (otp === "1234") {
            const userData = {
                id: Math.random().toString(36).substr(2, 9),
                phone,
                role: activeTab,
                name: activeTab === "customer" ? "Customer User" : "Seller User",
                email: `${activeTab}@example.com`,
                ...(activeTab === "seller" && { sellerStatus: "pending" as const }),
            }

            login(userData)

            if (activeTab === "customer") {
                router.push("/profile/customer")
            } else {
                router.push("/profile/seller")
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome to Rasss</CardTitle>
                    <CardDescription className="text-center">Login to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "customer" | "seller")}>
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="customer">{t("auth.customerLogin")}</TabsTrigger>
                            <TabsTrigger value="seller">{t("auth.sellerLogin")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="customer" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-phone">{t("auth.phoneNumber")}</Label>
                                <Input
                                    id="customer-phone"
                                    type="tel"
                                    placeholder="+92 300 1234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={otpSent}
                                />
                            </div>

                            {otpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="customer-otp">{t("auth.enterOtp")}</Label>
                                    <Input
                                        id="customer-otp"
                                        type="text"
                                        placeholder="1234"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={4}
                                    />
                                    <p className="text-xs text-muted-foreground">Demo OTP: 1234</p>
                                </div>
                            )}

                            {!otpSent ? (
                                <Button onClick={handleSendOtp} className="w-full" disabled={phone.length < 10}>
                                    {t("auth.sendOtp")}
                                </Button>
                            ) : (
                                <Button onClick={handleVerify} className="w-full" disabled={otp.length !== 4}>
                                    {t("auth.verify")}
                                </Button>
                            )}
                        </TabsContent>

                        <TabsContent value="seller" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="seller-phone">{t("auth.phoneNumber")}</Label>
                                <Input
                                    id="seller-phone"
                                    type="tel"
                                    placeholder="+92 300 1234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={otpSent}
                                />
                            </div>

                            {otpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="seller-otp">{t("auth.enterOtp")}</Label>
                                    <Input
                                        id="seller-otp"
                                        type="text"
                                        placeholder="1234"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={4}
                                    />
                                    <p className="text-xs text-muted-foreground">Demo OTP: 1234</p>
                                </div>
                            )}

                            {!otpSent ? (
                                <Button onClick={handleSendOtp} className="w-full" disabled={phone.length < 10}>
                                    {t("auth.sendOtp")}
                                </Button>
                            ) : (
                                <Button onClick={handleVerify} className="w-full" disabled={otp.length !== 4}>
                                    {t("auth.verify")}
                                </Button>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
