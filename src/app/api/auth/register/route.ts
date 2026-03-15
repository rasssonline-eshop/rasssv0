import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { otpService } from "@/services/otpService"
import { emailService } from "@/services/emailService"
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

        // SECURITY: Always create as 'customer' role - never allow admin registration
        // Admin accounts must be created manually in the database
        // Email verification required before login (Requirement 0.5, 0.9)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "customer", // Always customer, never admin
            }
        })

        // Generate and send OTP for email verification (Requirement 0.2, 0.5)
        const otp = await otpService.generateOTP(user.email)
        await emailService.sendOTPEmail(user.email, otp)

        return NextResponse.json({
            success: true,
            message: 'Registration successful. Please verify your email with the OTP sent to your inbox.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            requiresVerification: true
        })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        )
    }
}
