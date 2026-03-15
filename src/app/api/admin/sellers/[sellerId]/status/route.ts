import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/middleware/auth"
import { sellerService } from "@/services/sellerService"
import { emailService } from "@/services/emailService"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    sellerId: string
  }>
}

/**
 * PATCH /api/admin/sellers/[sellerId]/status
 * Updates seller status (approve or reject)
 * Requires admin authentication
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return requireAdmin(req, async (req, context) => {
    try {
      const { sellerId } = await params
      const body = await req.json()
      const { status, reason } = body

      // Validate status
      if (!status || !["approved", "rejected"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be 'approved' or 'rejected'" },
          { status: 400 }
        )
      }

      // Get seller details for email notification
      const seller = await prisma.user.findUnique({
        where: { id: sellerId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          sellerStatus: true
        }
      })

      if (!seller) {
        return NextResponse.json(
          { error: "Seller not found" },
          { status: 404 }
        )
      }

      if (seller.role !== "seller") {
        return NextResponse.json(
          { error: "User is not a seller" },
          { status: 400 }
        )
      }

      // Update seller status using service
      let updatedSeller
      if (status === "approved") {
        updatedSeller = await sellerService.approveSeller(sellerId, context.user.id)
        
        // Send approval notification
        await emailService.sendSellerApprovalNotification(
          seller.email,
          seller.name || "Seller"
        )
      } else {
        updatedSeller = await sellerService.rejectSeller(
          sellerId,
          context.user.id,
          reason
        )
        
        // Send rejection notification
        await emailService.sendSellerRejectionNotification(
          seller.email,
          seller.name || "Seller",
          reason
        )
      }

      return NextResponse.json({
        success: true,
        message: `Seller ${status} successfully`,
        seller: {
          id: updatedSeller.id,
          name: updatedSeller.name,
          email: updatedSeller.email,
          sellerStatus: updatedSeller.sellerStatus
        }
      })
    } catch (error: any) {
      console.error("Update Seller Status Error:", error)
      
      // Handle specific error messages from service
      if (error.message === "Seller not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
      
      if (
        error.message === "User is not a seller" ||
        error.message === "Seller is not in pending status"
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: "Failed to update seller status" },
        { status: 500 }
      )
    }
  })
}
