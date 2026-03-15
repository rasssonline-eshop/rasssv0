import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "seller") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        // Get all orders that contain this seller's products
        const allOrders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" }
        })

        // Filter orders that have items from this seller
        const sellerOrders = allOrders.filter(order => {
            const items = order.items as any[]
            return items.some(item => item.sellerId === session.user.id)
        })

        return NextResponse.json(sellerOrders)
    } catch (error) {
        console.error("Seller Orders API Error:", error)
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}
