import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Public endpoint - customers need to see admin payment details during checkout
export async function GET() {
    try {
        // Find the admin user
        const admin = await prisma.user.findFirst({
            where: { role: "admin" },
            select: {
                jazzCashNumber: true,
                easyPaisaNumber: true,
                bankName: true,
                bankAccountTitle: true,
                bankAccountNumber: true,
                bankIBAN: true,
            }
        })

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 })
        }

        // Determine which payment method is configured
        let paymentMethod = null
        let paymentDetails = null

        if (admin.jazzCashNumber) {
            paymentMethod = "jazzcash"
            paymentDetails = {
                number: admin.jazzCashNumber
            }
        } else if (admin.easyPaisaNumber) {
            paymentMethod = "easypaisa"
            paymentDetails = {
                number: admin.easyPaisaNumber
            }
        } else if (admin.bankAccountNumber) {
            paymentMethod = "bank"
            paymentDetails = {
                bankName: admin.bankName,
                accountTitle: admin.bankAccountTitle,
                accountNumber: admin.bankAccountNumber,
                iban: admin.bankIBAN
            }
        }

        return NextResponse.json({
            paymentMethod,
            paymentDetails,
            configured: paymentMethod !== null
        })
    } catch (error) {
        console.error("Error fetching admin payment details:", error)
        return NextResponse.json({ error: "Failed to fetch payment details" }, { status: 500 })
    }
}
