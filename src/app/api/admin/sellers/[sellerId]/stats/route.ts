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

    // Get product counts
    const [totalProducts, activeProducts, inactiveProducts] = await Promise.all([
      prisma.product.count({ where: { ownerId: sellerId } }),
      prisma.product.count({ where: { ownerId: sellerId, status: "active" } }),
      prisma.product.count({ where: { ownerId: sellerId, status: "inactive" } }),
    ])

    // Calculate total revenue (simplified - sum of product prices)
    const products = await prisma.product.findMany({
      where: { ownerId: sellerId },
      select: { price: true },
    })
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0)

    const stats = {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalRevenue,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching seller stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
