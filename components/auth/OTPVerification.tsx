"use client"

import { useState, useEffect } from "react"
import { OTPInput } from "./OTPInput"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ArrowLeft, Mail, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"

interface OTPVerificationProps {
  email: string
  onVerified: () => void
  onBack?: () => void
}

export function OTPVerification({ email, onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Enable resend after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanResend(true)
    }, 60000)

    return () => clearTimeout(timer)
  }, [])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Invalid OTP")
        setOtp("") // Clear OTP on error
        return
      }

      toast.success("Email verified successfully!")
      onVerified()
    } catch (error) {
      console.error("Verify OTP error:", error)
      toast.error("Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to resend OTP")
        return
      }

      toast.success("New OTP sent to your email")
      setOtp("")
      setTimeLeft(600) // Reset timer
      setCanResend(false)
      setResendCooldown(60) // 60 second cooldown

      // Re-enable resend after 60 seconds
      setTimeout(() => {
        setCanResend(true)
      }, 60000)
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error("Failed to resend OTP")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary to-accent p-8 text-white text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
            <Mail className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-white/90 text-sm">
          We've sent a 6-digit code to
        </p>
        <p className="font-semibold mt-1">{email}</p>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* OTP Input */}
        <div className="space-y-4">
          <OTPInput value={otp} onChange={setOtp} disabled={loading || timeLeft === 0} />

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {timeLeft > 0 ? (
              <>
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-gray-600">
                  Code expires in <strong className="text-primary">{formatTime(timeLeft)}</strong>
                </span>
              </>
            ) : (
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <Clock className="w-4 h-4" />
                <span>OTP has expired. Please request a new one.</span>
              </div>
            )}
          </div>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6 || timeLeft === 0}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-medium py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        {/* Resend Section */}
        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Resend available in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending || !canResend}
              className="text-sm text-primary hover:text-primary/80 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </button>
        )}

        {/* Help Text */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-gray-600">
          <p className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>You have 3 attempts to enter the correct code</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Check your spam folder if you don't see the email</span>
          </p>
        </div>
      </div>
    </div>
  )
}
