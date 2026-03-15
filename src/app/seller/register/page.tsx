"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OTPVerification } from "@/components/auth/OTPVerification"
import { toast } from "sonner"
import Link from "next/link"

export default function SellerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || data.error || "Registration failed")
        return
      }

      // Show OTP verification screen
      setRegisteredEmail(formData.email)
      setShowOTPVerification(true)
      toast.success("Registration successful! Please verify your email.")

    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerified = async () => {
    try {
      // Complete registration (send confirmation emails)
      await fetch("/api/seller/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      })

      toast.success("Email verified! Redirecting to login...")
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login?message=seller-registered")
      }, 1500)
    } catch (error) {
      console.error("Complete registration error:", error)
      toast.error("Failed to complete registration")
    }
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
          <CardTitle className="text-2xl text-center">Become a Seller</CardTitle>
          <CardDescription className="text-center">
            Register to start selling your products on Rasss
          </CardDescription>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After registration, you'll need to verify your email. 
              Once verified, your account will be pending admin approval. 
              You'll receive an email once approved and can then start listing products.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={loading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={loading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={loading}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                disabled={loading}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="phone number"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={loading}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name (Optional)</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Your Business Name"
                value={formData.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register as Seller"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
