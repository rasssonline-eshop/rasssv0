import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, images, ...rest } = body

        // Ensure slug is unique
        let slug = rest.slug
        let count = 0
        while (await prisma.product.findUnique({ where: { slug } })) {
            count++
            slug = `${rest.slug}-${count}`
        }

        const product = await prisma.product.create({
            data: {
                ...rest,
                slug,
                image: rest.image || (images && images.length > 0 ? images[0] : null),
                images: images || [],
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Create Product Error:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}
