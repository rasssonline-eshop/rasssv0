import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export class OTPService {
  /**
   * Generate a 6-digit OTP code
   */
  private generateOTPCode(): string {
    return crypto.randomInt(100000, 999999).toString()
  }

  /**
   * Generate and store OTP for a user
   * Returns the generated OTP code
   */
  async generateOTP(email: string): Promise<string> {
    const otp = this.generateOTPCode()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry,
        otpAttempts: 0, // Reset attempts on new OTP generation
      },
    })

    return otp
  }

  /**
   * Verify OTP code for a user
   * Returns true if valid, false otherwise
   * Increments attempt counter on failure
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { otp: true, otpExpiry: true, otpAttempts: true },
    })

    if (!user || !user.otp || !user.otpExpiry) {
      return { success: false, message: "No OTP found. Please request a new one." }
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiry) {
      return { success: false, message: "OTP has expired. Please request a new one." }
    }

    // Check attempt limit
    if (user.otpAttempts >= 3) {
      return { success: false, message: "Maximum attempts exceeded. Please request a new OTP." }
    }

    // Verify OTP
    if (user.otp !== otp) {
      // Increment attempt counter
      await prisma.user.update({
        where: { email },
        data: { otpAttempts: user.otpAttempts + 1 },
      })
      return { success: false, message: `Invalid OTP. ${2 - user.otpAttempts} attempts remaining.` }
    }

    // OTP is valid - mark email as verified and clear OTP data
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
      },
    })

    return { success: true, message: "Email verified successfully!" }
  }

  /**
   * Resend OTP - invalidates previous OTP and generates new one
   */
  async resendOTP(email: string): Promise<string> {
    // Invalidate previous OTP and generate new one
    return await this.generateOTP(email)
  }

  /**
   * Invalidate OTP for a user
   */
  async invalidateOTP(email: string): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
      },
    })
  }

  /**
   * Check remaining attempts for a user
   */
  async checkAttempts(email: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { otpAttempts: true },
    })

    return user?.otpAttempts ?? 0
  }
}

export const otpService = new OTPService()
