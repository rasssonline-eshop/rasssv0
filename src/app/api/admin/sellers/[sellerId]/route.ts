import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 401 }
      )
    }

    const { sellerId } = await params

    // Fetch seller information
    const seller = await prisma.user.findUnique({
      where: {
        id: sellerId,
        role: "seller",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        sellerStatus: true,
        createdAt: true,
        updatedAt: true,
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
