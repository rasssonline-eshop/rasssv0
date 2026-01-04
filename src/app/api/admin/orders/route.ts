import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" }
        })

        // Map to Admin Order shape if necessary or just return raw
        // AdminProvider expects specific fields. 
        // Prisma Order has: id, status, total, placedAt, items, note, customerName, etc.
        // AdminProvider Order Type expects: id, status, items, total, placedAt, note.
        // It matches.

        return NextResponse.json(orders)
    } catch (error) {
        console.error("Admin Orders API Error:", error)
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}
