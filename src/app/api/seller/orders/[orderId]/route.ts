import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.role !== "seller") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        const { orderId } = await params

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        // Verify this seller has items in this order
        const items = order.items as any[]
        const hasSellerItems = items.some(item => item.sellerId === session.user.id)

        if (!hasSellerItems) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Seller Order Detail API Error:", error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
}
