import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/emailService';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/seller/complete-registration
 * Complete seller registration after email verification
 * Requirements: 1.4, 1.5
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify that the user exists and email is verified
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, emailVerified: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email not verified' },
        { status: 400 }
      );
    }

    // Send confirmation email to seller (Requirement 1.4)
    await emailService.sendSellerRegistrationConfirmation(user.email, user.name || '');

    // Notify admin of new seller registration (Requirement 1.5)
    await emailService.notifyAdminOfNewSeller(user.email, user.name || '');

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to complete registration' },
      { status: 500 }
    );
  }
}
