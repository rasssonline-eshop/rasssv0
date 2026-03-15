import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, address, items, total, instructions, paymentMethod, transactionId } = body

        if (!email || !name || !items || items.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Find or Create User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                phone: phone || undefined,
                name: name || undefined,
            },
            create: {
                email,
                name,
                phone,
                role: "customer",
                password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10),
            }
        })

        // 2. Enrich items with sellerId by fetching product details
        const enrichedItems = await Promise.all(
            items.map(async (item: any) => {
                try {
                    // Cart items use slug as id, so we need to look up by slug
                    const product = await prisma.product.findUnique({
                        where: { slug: item.slug || item.id },
                        select: { id: true, ownerId: true }
                    })
                    
                    return {
                        productId: product?.id || item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        sellerId: product?.ownerId || null
                    }
                } catch (e) {
                    console.error(`Failed to fetch product for item ${item.id}:`, e)
                    return {
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        sellerId: null
                    }
                }
            })
        )

        // 3. Generate Order Number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        // 4. Determine payment status based on payment method
        const paymentStatus = paymentMethod === "online" ? "paid" : "unpaid"

        // 5. Create Order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                orderNumber,
                status: "pending",
                total: parseFloat(total),
                paymentMethod: paymentMethod || "cod",
                paymentStatus,
                transactionId: transactionId || undefined,
                items: enrichedItems,
                shippingAddress: address,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                note: instructions,
            }
        })

        // 6. Update Inventory
        for (const item of items) {
            if (item.slug || item.id) {
                try {
                    await prisma.product.update({
                        where: { slug: item.slug || item.id },
                        data: { stock: { decrement: item.quantity } }
                    })
                } catch (e) {
                    console.error(`Failed to update inventory for ${item.slug || item.id}:`, e)
                    // Ignore if product not found
                }
            }
        }

        return NextResponse.json({ success: true, orderNumber })
    } catch (error) {
        console.error("Checkout Create Error:", error)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }
}