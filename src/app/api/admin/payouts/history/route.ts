import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/payouts/history
 * Get payout history
 */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    try {
      // Check if Payout model exists
      const payouts = await (prisma as any).payout?.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      }) || []

      // Join with seller data
      const payoutsWithSeller = await Promise.all(
        payouts.map(async (payout: any) => {
          const seller = await prisma.user.findUnique({
            where: { id: payout.sellerId },
            select: { name: true, email: true }
          })
          
          return {
            id: payout.id,
            sellerName: seller?.name || 'Unknown',
            sellerEmail: seller?.email || '',
            totalRevenue: payout.totalRevenue,
            commissionRate: payout.commissionRate,
            commissionAmount: payout.commissionAmount,
            payoutAmount: payout.payoutAmount,
            status: payout.status,
            paymentMethod: payout.paymentMethod || '',
            paidAt: payout.paidAt?.toISOString() || null,
            createdAt: payout.createdAt.toISOString(),
          }
        })
      )

      return NextResponse.json({
        success: true,
        payouts: payoutsWithSeller
      })
    } catch (error: any) {
      console.error('Get payout history error:', error)
      return NextResponse.json(
        {
          success: true,
          payouts: [] // Return empty array if model doesn't exist yet
        },
        { status: 200 }
      )
    }
  })
}
