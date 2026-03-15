import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/payouts/settings
 * Get commission settings
 */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    try {
      let settings = await prisma.commissionSettings.findFirst()
      
      if (!settings) {
        // Create default settings if none exist
        settings = await prisma.commissionSettings.create({
          data: { defaultRate: 10 }
        })
      }

      return NextResponse.json({
        success: true,
        defaultRate: settings.defaultRate
      })
    } catch (error: any) {
      console.error('Get commission settings error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve commission settings',
          message: error.message
        },
        { status: 500 }
      )
    }
  })
}

/**
 * PATCH /api/admin/payouts/settings
 * Update commission settings
 */
export async function PATCH(req: NextRequest) {
  return requireAdmin(req, async () => {
    try {
      const { defaultRate } = await req.json()

      // Validate rate
      if (typeof defaultRate !== 'number' || defaultRate < 0 || defaultRate > 100) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid commission rate',
            message: 'Commission rate must be between 0 and 100'
          },
          { status: 400 }
        )
      }

      // Get existing settings or create new
      const existingSettings = await prisma.commissionSettings.findFirst()

      let settings
      if (existingSettings) {
        settings = await prisma.commissionSettings.update({
          where: { id: existingSettings.id },
          data: { defaultRate }
        })
      } else {
        settings = await prisma.commissionSettings.create({
          data: { defaultRate }
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Commission rate updated successfully',
        defaultRate: settings.defaultRate
      })
    } catch (error: any) {
      console.error('Update commission settings error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update commission settings',
          message: error.message
        },
        { status: 500 }
      )
    }
  })
}
