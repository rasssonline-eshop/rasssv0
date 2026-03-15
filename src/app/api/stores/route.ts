import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/stores
 * Returns list of approved sellers (public endpoint)
 * No authentication required
 */
export async function GET(req: NextRequest) {
  try {
    // Get all approved sellers
    const sellers = await prisma.user.findMany({
      where: {
        role: "seller",
        sellerStatus: "approved"
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        sellerStatus: true,
        createdAt: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ sellers })
  } catch (error) {
    console.error("Get Stores Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    )
  }
}
