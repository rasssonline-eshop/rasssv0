import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/admin/payouts/[payoutId]/complete
 * Mark a payout as completed after sending money to seller
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ payoutId: string }> }
) {
  return requireAdmin(req, async () => {
    try {
      const { payoutId } = await params
      const { transactionId, note } = await req.json()

      // Find the payout
      const payout = await prisma.payout.findUnique({
        where: { id: payoutId }
      })

      if (!payout) {
        return NextResponse.json(
          { error: 'Payout not found' },
          { status: 404 }
        )
      }

      // Check if already completed
      if (payout.status === 'completed') {
        return NextResponse.json(
          { error: 'Payout already completed' },
          { status: 400 }
        )
      }

      // Update payout to completed
      const updatedPayout = await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: 'completed',
          transactionId: transactionId || undefined,
          note: note || payout.note,
          paidAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Payout marked as completed',
        payout: updatedPayout
      })
    } catch (error: any) {
      console.error('Complete payout error:', error)
      return NextResponse.json(
        { error: 'Failed to complete payout', message: error.message },
        { status: 500 }
      )
    }
  })
}
