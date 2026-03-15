"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Store, Upload, User, Mail, Phone, Calendar, CheckCircle, Clock, XCircle, ExternalLink, Wallet, Building2, Smartphone } from "lucide-react"
import { toast } from "sonner"

interface SellerProfile {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  sellerStatus: string
  createdAt: string
  jazzCashNumber?: string
  easyPaisaNumber?: string
  bankName?: string
  bankAccountTitle?: string
  bankAccountNumber?: string
  bankIBAN?: string
}

export default function SellerProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const user = session?.user as any

  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seller/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")
      
      const data = await response.json()
      setProfile(data.profile)
      
      // Set form values
      setName(data.profile.name || "")
      setPhone(data.profile.phone || "")
      setLogoPreview(data.profile.image || null)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setLogoFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Store name is required")
      return
    }

    setSaving(true)

    try {
      let imageUrl = profile?.image

      // Upload logo if changed
      if (logoFile) {
        setUploading(true)
        const reader = new FileReader()
        
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(logoFile)
        })
        
        setUploading(false)
      }

      // Update profile
      const response = await fetch("/api/seller/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          image: imageUrl
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      
      // Update session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.profile.name,
          image: data.profile.image
        }
      })

      toast.success("Profile updated successfully")
      setLogoFile(null)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified Seller
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Failed to load profile</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your store information and branding
          </p>
        </div>
        <Link href={`/store/${profile.id}`} target="_blank">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            View Store
          </Button>
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Store Logo */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 ring-4 ring-gray-100">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Store className="w-12 h-12 text-white" />
              )}
            </div>

            {/* Store Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                {getStatusBadge(profile.sellerStatus)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Card */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Your payment method for receiving payouts
              </CardDescription>
            </div>
            <Link href="/seller/payment-settings">
              <Button variant="outline" size="sm">
                Edit Payment Details
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {profile.jazzCashNumber || profile.easyPaisaNumber || profile.bankAccountNumber ? (
            <div className="space-y-4">
              {/* JazzCash */}
              {profile.jazzCashNumber && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">JazzCash</h3>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Mobile Wallet</p>
                    <p className="text-lg font-mono font-semibold text-gray-900 mt-2">
                      {profile.jazzCashNumber}
                    </p>
                  </div>
                </div>
              )}

              {/* EasyPaisa */}
              {profile.easyPaisaNumber && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">EasyPaisa</h3>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Mobile Wallet</p>
                    <p className="text-lg font-mono font-semibold text-gray-900 mt-2">
                      {profile.easyPaisaNumber}
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Account */}
              {profile.bankAccountNumber && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">Bank Account</h3>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Direct Bank Transfer</p>
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="font-semibold text-gray-900">{profile.bankName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Title</p>
                          <p className="font-semibold text-gray-900">{profile.bankAccountTitle}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="text-lg font-mono font-semibold text-gray-900">
                          {profile.bankAccountNumber}
                        </p>
                      </div>
                      {profile.bankIBAN && (
                        <div>
                          <p className="text-xs text-gray-500">IBAN</p>
                          <p className="text-sm font-mono font-semibold text-gray-900">
                            {profile.bankIBAN}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Payment Method Added</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add your payment details to receive payouts from your sales
              </p>
              <Link href="/seller/payment-settings">
                <Button className="gap-2">
                  <Wallet className="w-4 h-4" />
                  Add Payment Method
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Edit Store Information</CardTitle>
          <CardDescription>Update your store name, logo, and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Logo Upload */}
            <div className="space-y-3">
              <Label htmlFor="logo" className="text-sm font-medium text-gray-900">
                Store Logo
              </Label>
              <div className="flex items-start gap-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-100">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Store logo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Store className="w-16 h-16 text-white" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("logo")?.click()}
                    disabled={uploading}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Change Logo"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Recommended: Square image, at least 200x200px. Max size: 5MB
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, WebP, GIF
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6"></div>

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                Store Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your store name"
                required
                className="bg-white"
              />
              <p className="text-xs text-gray-500">
                This name will be displayed on your store page and in search results
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                Contact Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="bg-white"
              />
              <p className="text-xs text-gray-500">
                Customers can use this number to contact you directly
              </p>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500">
                Email address cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={saving || uploading}
                className="bg-primary hover:bg-primary/90"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setName(profile.name || "")
                  setPhone(profile.phone || "")
                  setLogoPreview(profile.image || null)
                  setLogoFile(null)
                  toast.info("Changes discarded")
                }}
                disabled={saving || uploading}
              >
                Discard Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

