import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role } = await req.json()

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (existing) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // SECURITY: Always create as 'user' role - never allow admin registration
        // Admin accounts must be created manually in the database
        // Seller registration is coming soon
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "user", // Always user, never admin
            }
        })

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        )
    }
}
