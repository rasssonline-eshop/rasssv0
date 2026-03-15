import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params
        
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Admin Order Detail API Error:", error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params
        const body = await req.json()
        const { status } = body

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 })
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error("Admin Order Update API Error:", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
