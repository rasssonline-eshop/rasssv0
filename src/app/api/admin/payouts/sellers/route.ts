import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/payouts/sellers
 * Get all sellers with pending payouts
 */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    try {
      // Get all approved sellers
      const sellers = await prisma.user.findMany({
        where: {
          role: 'seller',
          sellerStatus: 'approved'
        },
        select: {
          id: true,
          name: true,
          email: true,
          jazzCashNumber: true,
          easyPaisaNumber: true,
          bankName: true,
          bankAccountTitle: true,
          bankAccountNumber: true,
          bankIBAN: true,
        }
      })

      // Get all paid orders
      const orders = await prisma.order.findMany({
        where: {
          paymentStatus: 'paid',
          paymentMethod: { not: 'cod' } // Only online payments
        }
      })

      // Get all completed payouts
      const payouts = await prisma.payout.findMany({
        where: {
          status: { in: ['completed', 'processing'] }
        }
      })

      // Calculate pending revenue for each seller
      const sellerPayouts = await Promise.all(
        sellers.map(async (seller) => {
          // Get orders containing this seller's products
          const sellerOrders = orders.filter(order => {
            const items = order.items as any[]
            return items.some(item => item.sellerId === seller.id)
          })

          // Get order IDs that have been paid out
          const paidOutOrderIds = new Set(
            payouts.flatMap(p => p.orderIds)
          )

          // Filter out orders that have been paid
          const pendingOrders = sellerOrders.filter(
            order => !paidOutOrderIds.has(order.id)
          )

          // Calculate total revenue from pending orders
          const totalRevenue = pendingOrders.reduce((sum, order) => {
            const items = order.items as any[]
            const sellerItems = items.filter(item => item.sellerId === seller.id)
            const sellerRevenue = sellerItems.reduce((itemSum, item) => 
              itemSum + (item.price * item.quantity), 0
            )
            return sum + sellerRevenue
          }, 0)

          // Get last payout date
          const lastPayout = await prisma.payout.findFirst({
            where: { sellerId: seller.id },
            orderBy: { paidAt: 'desc' }
          })

          return {
            sellerId: seller.id,
            sellerName: seller.name || 'Unknown',
            sellerEmail: seller.email,
            totalRevenue,
            pendingOrders: pendingOrders.length,
            lastPayoutDate: lastPayout?.paidAt?.toISOString() || null,
            paymentDetails: {
              jazzCashNumber: seller.jazzCashNumber,
              easyPaisaNumber: seller.easyPaisaNumber,
              bankName: seller.bankName,
              bankAccountTitle: seller.bankAccountTitle,
              bankAccountNumber: seller.bankAccountNumber,
              bankIBAN: seller.bankIBAN,
            }
          }
        })
      )

      // Filter sellers with pending revenue
      const sellersWithPendingPayouts = sellerPayouts.filter(s => s.totalRevenue > 0)

      return NextResponse.json({
        success: true,
        sellers: sellersWithPendingPayouts
      })
    } catch (error: any) {
      console.error('Get sellers for payout error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve sellers',
          message: error.message
        },
        { status: 500 }
      )
    }
  })
}
