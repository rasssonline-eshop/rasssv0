import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, image, comingSoon } = body

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        const slug = name.toLowerCase().replace(/\s+/g, "-")

        const category = await prisma.category.upsert({
            where: { name },
            update: {
                image,
                comingSoon,
                // Do not update slug automatically to avoid breaking links if checking by name
            },
            create: {
                name,
                slug,
                image,
                comingSoon: comingSoon || false
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("Create Category Error:", error)
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }
}
