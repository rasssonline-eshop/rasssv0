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

        // Get all payouts for this seller
        const payouts = await prisma.payout.findMany({
            where: { sellerId: session.user.id },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(payouts)
    } catch (error) {
        console.error("Seller Payouts API Error:", error)
        return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 })
    }
}
