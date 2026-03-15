import { NextRequest, NextResponse } from 'next/server'
import { requireApprovedSeller } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/seller/payment-settings
 * Get seller's payment settings
 */
export async function GET(req: NextRequest) {
  return requireApprovedSeller(req, async (req, context) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        select: {
          jazzCashNumber: true,
          easyPaisaNumber: true,
          bankName: true,
          bankAccountTitle: true,
          bankAccountNumber: true,
          bankIBAN: true,
        }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(user, { status: 200 })
    } catch (error: any) {
      console.error('Get payment settings error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve payment settings',
          message: error.message
        },
        { status: 500 }
      )
    }
  })
}

/**
 * PATCH /api/seller/payment-settings
 * Update seller's payment settings
 */
export async function PATCH(req: NextRequest) {
  return requireApprovedSeller(req, async (req, context) => {
    try {
      const body = await req.json()
      const {
        jazzCashNumber,
        easyPaisaNumber,
        bankName,
        bankAccountTitle,
        bankAccountNumber,
        bankIBAN,
      } = body

      // Validate phone numbers if provided
      if (jazzCashNumber && !/^03\d{9}$/.test(jazzCashNumber)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid JazzCash number',
            message: 'JazzCash number must be 11 digits starting with 03'
          },
          { status: 400 }
        )
      }

      if (easyPaisaNumber && !/^03\d{9}$/.test(easyPaisaNumber)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid EasyPaisa number',
            message: 'EasyPaisa number must be 11 digits starting with 03'
          },
          { status: 400 }
        )
      }

      // Validate IBAN if provided
      if (bankIBAN && !/^PK\d{2}[A-Z0-9]{4}\d{16}$/.test(bankIBAN.toUpperCase())) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid IBAN',
            message: 'IBAN must be 24 characters starting with PK'
          },
          { status: 400 }
        )
      }

      // Update user payment settings
      const updatedUser = await prisma.user.update({
        where: { id: context.user.id },
        data: {
          jazzCashNumber: jazzCashNumber || null,
          easyPaisaNumber: easyPaisaNumber || null,
          bankName: bankName || null,
          bankAccountTitle: bankAccountTitle || null,
          bankAccountNumber: bankAccountNumber || null,
          bankIBAN: bankIBAN ? bankIBAN.toUpperCase() : null,
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

      return NextResponse.json(
        {
          success: true,
          message: 'Payment settings updated successfully',
          user: updatedUser
        },
        { status: 200 }
      )
    } catch (error: any) {
      console.error('Update payment settings error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update payment settings',
          message: error.message
        },
        { status: 500 }
      )
    }
  })
}
