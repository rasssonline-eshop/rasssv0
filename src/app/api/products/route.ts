import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const isFeatured = searchParams.get("featured") === "true"
        const category = searchParams.get("category")
        const limit = parseInt(searchParams.get("limit") || "10")

        const where: any = { status: "active" }

        if (isFeatured) {
            where.isFeatured = true
        }

        if (category) {
            where.category = category
        }

        const search = searchParams.get("search")
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } }
            ]
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error("Products API Error:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}
