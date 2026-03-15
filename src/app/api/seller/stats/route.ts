import { NextRequest, NextResponse } from "next/server";
import { requireApprovedSeller } from "@/lib/middleware/auth";
import { sellerService } from "@/services/sellerService";

/**
 * GET /api/seller/stats
 * Get seller statistics including product counts, order counts, and revenue
 * Requires approved seller authentication
 */
export async function GET(req: NextRequest) {
  return requireApprovedSeller(req, async (req, context) => {
    try {
      const sellerId = context.user.id;

      // Get seller statistics
      const stats = await sellerService.getSellerStats(sellerId);

      return NextResponse.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch seller statistics"
        },
        { status: 500 }
      );
    }
  });
}
