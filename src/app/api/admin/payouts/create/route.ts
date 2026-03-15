import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/admin/payouts/create
 * Create a new payout for a seller
 */
export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    try {
      const { sellerId, commissionRate, paymentMethod, note } = await req.json()

      // Validate inputs
      if (!sellerId || !commissionRate || !paymentMethod) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields',
            message: 'Seller ID, commission rate, and payment method are required'
          },
          { status: 400 }
        )
      }

      // Get all paid orders (excluding COD)
      const orders = await prisma.order.findMany({
        where: {
          paymentStatus: 'paid',
          paymentMethod: { not: 'cod' }
        }
      })

      // Filter orders containing this seller's products
      const sellerOrders = orders.filter(order => {
        const items = order.items as any[]
        return items.some(item => item.sellerId === sellerId)
      })

      // Get already paid-out order IDs for this seller
      const existingPayouts = await prisma.payout.findMany({
        where: { sellerId },
        select: { orderIds: true }
      })
      const paidOrderIds = new Set(existingPayouts.flatMap(p => p.orderIds))

      // Filter out orders that have already been paid
      const unpaidOrders = sellerOrders.filter(order => !paidOrderIds.has(order.id))

      if (unpaidOrders.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No unpaid orders',
            message: 'This seller has no pending orders to pay out'
          },
          { status: 400 }
        )
      }

      // Calculate total revenue from unpaid orders
      const totalRevenue = unpaidOrders.reduce((sum, order) => {
        const items = order.items as any[]
        const sellerItems = items.filter(item => item.sellerId === sellerId)
        const sellerRevenue = sellerItems.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity), 0
        )
        return sum + sellerRevenue
      }, 0)

      // Calculate commission and payout amounts
      const commissionAmount = (totalRevenue * commissionRate) / 100
      const payoutAmount = totalRevenue - commissionAmount

      // Get seller payment details
      const seller = await prisma.user.findUnique({
        where: { id: sellerId },
        select: {
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

      if (!seller) {
        return NextResponse.json(
          {
            success: false,
            error: 'Seller not found',
            message: 'The specified seller does not exist'
          },
          { status: 404 }
        )
      }

      // Verify seller has payment details for selected method
      if (paymentMethod === 'jazzcash' && !seller.jazzCashNumber) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment method not available',
            message: 'Seller has not added JazzCash details'
          },
          { status: 400 }
        )
      }

      if (paymentMethod === 'easypaisa' && !seller.easyPaisaNumber) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment method not available',
            message: 'Seller has not added EasyPaisa details'
          },
          { status: 400 }
        )
      }

      if (paymentMethod === 'bank_transfer' && !seller.bankAccountNumber) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment method not available',
            message: 'Seller has not added bank account details'
          },
          { status: 400 }
        )
      }

      // Create payout record
      const payout = await prisma.payout.create({
        data: {
          sellerId,
          orderIds: unpaidOrders.map(o => o.id),
          totalRevenue,
          commissionRate,
          commissionAmount,
          payoutAmount,
          status: 'pending',
          paymentMethod,
          paymentDetails: {
            jazzCashNumber: seller.jazzCashNumber,
            easyPaisaNumber: seller.easyPaisaNumber,
            bankName: seller.bankName,
            bankAccountTitle: seller.bankAccountTitle,
            bankAccountNumber: seller.bankAccountNumber,
            bankIBAN: seller.bankIBAN,
          },
          note: note || null,
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Payout initiated successfully',
        payout: {
          id: payout.id,
          sellerId: payout.sellerId,
          sellerName: seller.name,
          totalRevenue: payout.totalRevenue,
          commissionAmount: payout.commissionAmount,
          payoutAmount: payout.payoutAmount,
          paymentMethod: payout.paymentMethod,
          status: payout.status,
          orderCount: unpaidOrders.length,
        }
      })
    } catch (error: any) {
      console.error('Create payout error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create payout',
          message: error.message
        },
        { status: 500 }
      )
    }
  })
}
