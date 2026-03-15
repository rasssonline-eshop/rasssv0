import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware/auth"

/**
 * GET /api/admin/sellers
 * Returns list of all sellers with their status
 * Requires admin authentication
 */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async (req, context) => {
    try {
      // Get all users with seller role
      const sellers = await prisma.user.findMany({
        where: {
          role: "seller"
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          sellerStatus: true,
          createdAt: true,
          updatedAt: true,
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
      console.error("Get Sellers Error:", error)
      return NextResponse.json(
        { error: "Failed to fetch sellers" },
        { status: 500 }
      )
    }
  })
}
