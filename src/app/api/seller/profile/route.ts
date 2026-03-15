import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/seller/profile
 * Get current seller's profile
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as any
    if (user.role !== "seller") {
      return NextResponse.json(
        { error: "Forbidden: Seller access required" },
        { status: 403 }
      )
    }

    // Fetch seller profile
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        sellerStatus: true,
        createdAt: true,
        updatedAt: true,
        jazzCashNumber: true,
        easyPaisaNumber: true,
        bankName: true,
        bankAccountTitle: true,
        bankAccountNumber: true,
        bankIBAN: true,
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Get Profile Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/seller/profile
 * Update current seller's profile
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as any
    if (user.role !== "seller") {
      return NextResponse.json(
        { error: "Forbidden: Seller access required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, phone, image } = body

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      )
    }

    // Validate phone if provided
    if (phone && typeof phone !== "string") {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }

    // Validate image if provided
    if (image && typeof image !== "string") {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      )
    }

    // Update profile
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        image: image || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        sellerStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })
  } catch (error) {
    console.error("Update Profile Error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
