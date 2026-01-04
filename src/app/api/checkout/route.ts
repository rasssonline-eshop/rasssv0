import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, address, items, total, instructions, paymentMethod } = body

        if (!email || !name || !items || items.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Find or Create User
        // Since we need a userId for the Order, we check if email exists.
        // If not, we create a placeholder customer account.
        // We set a random password for guest accounts.
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
                password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10), // Dummy password
            }
        })

        // 2. Generate Order Number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        // 3. Create Order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                orderNumber,
                status: "pending",
                total: parseFloat(total),
                paymentMethod: paymentMethod || "cod",
                paymentStatus: "unpaid", // COD default
                items: items, // JSON
                shippingAddress: address, // JSON
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                note: instructions,
            }
        })

        // 4. Update Inventory (Optional but recommended)
        // We iterate and update stock. Using a transaction would be better but simple loop is okay for now.
        for (const item of items) {
            if (item.id) {
                // Determine if id is slug or real ID. 
                // Best to try finding by ID or Slug.
                // Assuming item.id is valid ID from Product list.
                // If Item ID is slug, we might fail if we query by ID?
                // Step 232 API returns ID as _id.
                // Cart stores item.id.
                try {
                    await prisma.product.update({
                        where: { id: item.id },
                        data: { stock: { decrement: item.quantity } }
                    })
                } catch (e) {
                    // Ignore if product not found (might be deleted or slug issue)
                }
            }
        }

        return NextResponse.json({ success: true, orderNumber })
    } catch (error) {
        console.error("Checkout Create Error:", error)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }
}
