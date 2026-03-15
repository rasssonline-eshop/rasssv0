import { NextRequest, NextResponse } from "next/server"
import { otpService } from "@/services/otpService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      )
    }

    // Verify OTP
    const result = await otpService.verifyOTP(email, otp)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP" },
      { status: 500 }
    )
  }
}
