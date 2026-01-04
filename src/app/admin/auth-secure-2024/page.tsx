"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Shield, Lock } from "lucide-react"

const ADMIN_SECRET = "RASSS_ADMIN_2024" // Change this to your secret passphrase

export default function AdminLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [passphrase, setPassphrase] = useState("")
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [failedAttempts, setFailedAttempts] = useState(0)

    const handlePassphraseSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (passphrase === ADMIN_SECRET) {
            setIsAuthorized(true)
            toast.success("Access granted")
            setPassphrase("") // Clear passphrase
        } else {
            const newAttempts = failedAttempts + 1
            setFailedAttempts(newAttempts)
            toast.error("Invalid passphrase")
            setPassphrase("")

            // Lock out after 3 failed attempts
            if (newAttempts >= 3) {
                toast.error("Too many failed attempts. Redirecting...")
                setTimeout(() => router.push("/"), 2000)
            }
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Invalid credentials")
                setLoading(false)
            } else {
                toast.success("Login successful!")
                // Redirect to admin - middleware will verify role
                router.push("/admin")
                router.refresh()
            }
        } catch (error) {
            toast.error("Login failed")
            setLoading(false)
        }
    }

    // Passphrase Gate
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900/20 to-gray-900 py-12 px-4">
                <Card className="w-full max-w-md border-red-500/30 shadow-2xl bg-gray-900/50 backdrop-blur">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Restricted Access</CardTitle>
                        <CardDescription className="text-gray-400">
                            Enter admin passphrase to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePassphraseSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="passphrase" className="text-gray-300">Secret Passphrase</Label>
                                <Input
                                    id="passphrase"
                                    type="password"
                                    placeholder="Enter secret passphrase"
                                    value={passphrase}
                                    onChange={(e) => setPassphrase(e.target.value)}
                                    required
                                    autoComplete="off"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    disabled={failedAttempts >= 3}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700"
                                disabled={failedAttempts >= 3}
                            >
                                {failedAttempts >= 3 ? "Access Locked" : "Verify Passphrase"}
                            </Button>
                            {failedAttempts > 0 && failedAttempts < 3 && (
                                <p className="text-xs text-red-400 text-center">
                                    {3 - failedAttempts} attempts remaining
                                </p>
                            )}
                            <p className="text-xs text-center text-gray-500 mt-4">
                                ⚠️ Unauthorized access is prohibited and monitored
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Admin Login Form (shown after passphrase verification)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 py-12 px-4">
            <Card className="w-full max-w-md border-primary/20 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <CardDescription>
                        Enter your admin credentials to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Admin Email</Label>
                            <Input
                                id="admin-email"
                                type="email"
                                placeholder="admin@rasss.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Password</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Login as Admin"}
                        </Button>
                        <p className="text-xs text-center text-gray-500 mt-4">
                            This page is for authorized administrators only
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
