import { NextRequest, NextResponse } from "next/server"
import { otpService } from "@/services/otpService"
import { emailService } from "@/services/emailService"
import { prisma } from "@/lib/prisma"

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(email)

  if (!limit || now > limit.resetAt) {
    // Reset or create new limit (max 3 requests per 15 minutes)
    rateLimitMap.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }

  if (limit.count >= 3) {
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    // Check rate limit
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again in 15 minutes." },
        { status: 429 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: "Email already verified" },
        { status: 400 }
      )
    }

    // Generate and send OTP
    const otp = await otpService.generateOTP(email)
    await emailService.sendOTPEmail(email, otp)

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    )
  }
}
