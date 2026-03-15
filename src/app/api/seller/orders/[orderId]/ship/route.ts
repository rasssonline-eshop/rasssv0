import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(
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

        // Check if order can be shipped
        if (order.status !== 'pending' && order.status !== 'paid') {
            return NextResponse.json({ 
                error: "Cannot ship order", 
                message: "Order is already shipped or cancelled" 
            }, { status: 400 })
        }

        // Update order status to shipped
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'shipped' }
        })

        return NextResponse.json({ 
            success: true, 
            message: "Order marked as shipped",
            order: updatedOrder
        })
    } catch (error) {
        console.error("Ship Order API Error:", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
