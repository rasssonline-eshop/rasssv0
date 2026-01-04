"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('[Admin Login] Form submitted')
        setLoading(true)

        try {
            console.log('[Admin Login] Calling signIn with:', { email, callbackUrl: '/admin' })
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // Handle redirect manually
            })

            console.log('[Admin Login] signIn result:', result)

            if (result?.error) {
                console.error('[Admin Login] Login error:', result.error)
                toast.error("Invalid credentials: " + result.error)
                setLoading(false)
            } else if (result?.ok) {
                console.log('[Admin Login] Login successful, redirecting...')
                toast.success("Login successful!")
                // Force hard redirect
                window.location.href = "/admin"
            } else {
                console.error('[Admin Login] Unexpected result:', result)
                toast.error("Login failed - unexpected result")
                setLoading(false)
            }
        } catch (error: any) {
            console.error('[Admin Login] Exception:', error)
            toast.error("Login failed: " + error.message)
            setLoading(false)
        }
    }

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
