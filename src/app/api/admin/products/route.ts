import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware/auth"

// GET all products with owner information (admin only)
export async function GET(req: NextRequest) {
    return requireAdmin(req, async (request, context) => {
        try {
            const products = await prisma.product.findMany({
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            })

            return NextResponse.json(products)
        } catch (error) {
            console.error("Get Products Error:", error)
            return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
        }
    })
}

// POST - Create product (admin only)
export async function POST(req: NextRequest) {
    return requireAdmin(req, async (request, context) => {
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

            // Admin creates product with themselves as owner
            const product = await prisma.product.create({
                data: {
                    ...rest,
                    slug,
                    image: rest.image || (images && images.length > 0 ? images[0] : null),
                    images: images || [],
                    ownerId: context.user.id
                }
            })

            return NextResponse.json(product)
        } catch (error) {
            console.error("Create Product Error:", error)
            return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
        }
    })
}
