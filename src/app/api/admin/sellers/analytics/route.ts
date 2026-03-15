import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 401 }
      )
    }

    // Get seller counts by status
    const [totalSellers, pendingSellers, approvedSellers, rejectedSellers] = await Promise.all([
      prisma.user.count({ where: { role: "seller" } }),
      prisma.user.count({ where: { role: "seller", sellerStatus: "pending" } }),
      prisma.user.count({ where: { role: "seller", sellerStatus: "approved" } }),
      prisma.user.count({ where: { role: "seller", sellerStatus: "rejected" } }),
    ])

    // Get total products from sellers
    const sellers = await prisma.user.findMany({
      where: { role: "seller", sellerStatus: "approved" },
      select: { id: true },
    })
    const sellerIds = sellers.map(s => s.id)

    const totalProducts = await prisma.product.count({
      where: { ownerId: { in: sellerIds } },
    })

    // Calculate average products per seller
    const averageProductsPerSeller = approvedSellers > 0 
      ? totalProducts / approvedSellers 
      : 0

    // Get top sellers by product count
    const sellersWithProducts = await prisma.user.findMany({
      where: {
        role: "seller",
        sellerStatus: "approved",
      },
      select: {
        id: true,
        name: true,
        email: true,
        products: {
          select: {
            id: true,
            price: true,
          },
        },
      },
      take: 10,
    })

    // Calculate revenue for each seller (simplified - actual revenue would come from orders)
    const topSellers = sellersWithProducts
      .map(seller => ({
        id: seller.id,
        name: seller.name || "Unknown",
        email: seller.email,
        productCount: seller.products.length,
        revenue: seller.products.reduce((sum, p) => sum + p.price, 0), // Simplified calculation
      }))
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5)

    const totalRevenue = topSellers.reduce((sum, s) => sum + s.revenue, 0)

    const analytics = {
      totalSellers,
      pendingSellers,
      approvedSellers,
      rejectedSellers,
      totalProducts,
      totalRevenue,
      averageProductsPerSeller,
      topSellers,
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error fetching seller analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
