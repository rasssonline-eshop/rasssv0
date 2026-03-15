import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/middleware/auth"

// GET Single Product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        // Try finding by slug if ID fails
        if (!product) {
            const bySlug = await prisma.product.findUnique({
                where: { slug: id },
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                }
            })
            if (bySlug) return NextResponse.json(bySlug)

            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}

// UPDATE Product (Admin can update any product)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return requireAdmin(request, async (req, context) => {
        try {
            const { id } = await params
            const body = await request.json()
            const { id: bodyId, ...data } = body

            const product = await prisma.product.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            })

            return NextResponse.json(product)
        } catch (error) {
            console.error("Update Product Error:", error)
            return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
        }
    })
}

// DELETE Product (Admin can delete any product)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return requireAdmin(request, async (req, context) => {
        try {
            const { id } = await params
            await prisma.product.delete({
                where: { id }
            })

            return NextResponse.json({ success: true })
        } catch (error) {
            console.error("Delete Product Error:", error)
            return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
        }
    })
}
