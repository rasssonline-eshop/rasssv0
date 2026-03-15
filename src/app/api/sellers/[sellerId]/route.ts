import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    const { sellerId } = await params

    // Fetch seller information
    const seller = await prisma.user.findUnique({
      where: {
        id: sellerId,
        role: "seller",
        sellerStatus: "approved", // Only show approved sellers
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        sellerStatus: true,
        createdAt: true,
      },
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ seller })
  } catch (error) {
    console.error("Error fetching seller:", error)
    return NextResponse.json(
      { error: "Failed to fetch seller" },
      { status: 500 }
    )
  }
}
