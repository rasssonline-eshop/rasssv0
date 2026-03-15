"use client"

import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OTPVerification } from "@/components/auth/OTPVerification"
import { useI18n } from "@/components/I18nProvider"
import { toast } from "sonner"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useI18n()
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")
    const [loading, setLoading] = useState(false)
    const [showOTPVerification, setShowOTPVerification] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState("")

    // Login state
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Register state
    const [registerName, setRegisterName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
    const [registerRole, setRegisterRole] = useState<"customer" | "seller">("customer")

    // Handle URL parameters
    useEffect(() => {
        if (!searchParams) return
        
        const tab = searchParams.get("tab")
        const role = searchParams.get("role")
        const message = searchParams.get("message")

        if (tab === "register") {
            setActiveTab("register")
        }
        if (role === "seller") {
            setRegisterRole("seller")
        }
        if (message === "seller-registered") {
            toast.success("Seller registration successful! Please login to continue. Your account is pending admin approval.")
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email: loginEmail,
                password: loginPassword,
                redirect: false,
            })

            if (result?.error) {
                // Check if error is due to unverified email
                if (result.error.includes('EMAIL_NOT_VERIFIED')) {
                    toast.error("Please verify your email before logging in", {
                        action: {
                            label: "Resend OTP",
                            onClick: async () => {
                                try {
                                    const response = await fetch('/api/auth/resend-otp', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email: loginEmail }),
                                    })
                                    const data = await response.json()
                                    if (response.ok) {
                                        toast.success("OTP sent to your email")
                                    } else {
                                        toast.error(data.message || "Failed to send OTP")
                                    }
                                } catch (error) {
                                    toast.error("Failed to send OTP")
                                }
                            }
                        }
                    })
                } else {
                    toast.error("Invalid email or password")
                }
                setLoading(false)
                return
            }

            toast.success("Login successful!")
            
            // Fetch the session to get user role
            const sessionResponse = await fetch('/api/auth/session')
            const sessionData = await sessionResponse.json()
            
            // Redirect based on role
            if (sessionData?.user?.role === 'admin') {
                window.location.href = "/admin"
            } else if (sessionData?.user?.role === 'seller') {
                window.location.href = "/seller"
            } else {
                window.location.href = "/"
            }
        } catch (error) {
            toast.error("Login failed")
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate password match
        if (registerPassword !== registerConfirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        
        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: registerName,
                    email: registerEmail,
                    password: registerPassword,
                    role: registerRole,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Registration failed")
                return
            }

            // Show OTP verification screen
            setRegisteredEmail(registerEmail)
            setShowOTPVerification(true)
            toast.success("Registration successful! Please verify your email.")
        } catch (error) {
            toast.error("Registration failed")
        } finally {
            setLoading(false)
        }
    }

    const handleOTPVerified = () => {
        toast.success("Email verified! You can now login.")
        setShowOTPVerification(false)
        setActiveTab("login")
        setLoginEmail(registeredEmail)
        setRegisteredEmail("")
    }

    const handleBackToRegistration = () => {
        setShowOTPVerification(false)
        setRegisteredEmail("")
    }

    if (showOTPVerification) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <OTPVerification
                    email={registeredEmail}
                    onVerified={handleOTPVerified}
                    onBack={handleBackToRegistration}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome to Rasss</CardTitle>
                    <CardDescription className="text-center">
                        Login or create an account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="register-name">Full Name</Label>
                                    <Input
                                        id="register-name"
                                        type="text"
                                        placeholder="Full Name"
                                        value={registerName}
                                        onChange={(e) => setRegisterName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Password</Label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <p className="text-xs text-gray-500">Minimum 6 characters</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                                    <Input
                                        id="register-confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={registerConfirmPassword}
                                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Type</Label>
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="customer"
                                                checked={true}
                                                readOnly
                                            />
                                            <span>Customer</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => router.push('/seller/register')}
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <input
                                                type="radio"
                                                readOnly
                                                className="pointer-events-none"
                                            />
                                            <span>Seller</span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">Want to sell? Click Seller to register as a seller</p>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
