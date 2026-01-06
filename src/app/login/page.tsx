"use client"

import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/components/I18nProvider"
import { toast } from "sonner"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useI18n()
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")
    const [loading, setLoading] = useState(false)

    // Login state
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Register state
    const [registerName, setRegisterName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerRole, setRegisterRole] = useState<"customer" | "seller">("customer")

    // Handle URL parameters
    useEffect(() => {
        const tab = searchParams.get("tab")
        const role = searchParams.get("role")

        if (tab === "register") {
            setActiveTab("register")
        }
        if (role === "seller") {
            setRegisterRole("seller")
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
                toast.error("Invalid email or password")
            } else {
                // Check user role and redirect accordingly
                const response = await fetch('/api/auth/session')
                const session = await response.json()

                if (session?.user?.role === 'admin') {
                    toast.info("Redirecting to admin panel...")
                    router.push("/admin")
                } else if (session?.user?.role === 'seller') {
                    toast.success("Login successful!")
                    router.push("/profile/seller")
                } else {
                    toast.success("Login successful!")
                    router.push("/")
                }
                router.refresh()
            }
        } catch (error) {
            toast.error("Login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
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

            toast.success("Registration successful! Please login.")
            setActiveTab("login")
            setLoginEmail(registerEmail)
        } catch (error) {
            toast.error("Registration failed")
        } finally {
            setLoading(false)
        }
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
                                        placeholder="John Doe"
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
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <input
                                                type="radio"
                                                disabled
                                            />
                                            <span>Seller</span>
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                                        </div>
                                    </div>
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
