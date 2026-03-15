import { NextRequest, NextResponse } from 'next/server';
import { sellerService } from '@/services/sellerService';
import { emailService } from '@/services/emailService';
import { otpService } from '@/services/otpService';

/**
 * POST /api/seller/register
 * Register a new seller account with OTP verification
 * Requirements: 0.5, 0.9, 1.1, 1.2, 1.3, 1.4, 1.5
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, businessName } = body;

    // Validation
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, password, and phone are required'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid password',
          message: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      );
    }

    // Register seller using SellerService (email not verified yet)
    const seller = await sellerService.registerSeller({
      name,
      email,
      password,
      phone,
      businessName
    });

    // Generate and send OTP for email verification (Requirement 0.2, 0.5)
    const otp = await otpService.generateOTP(seller.email);
    await emailService.sendOTPEmail(seller.email, otp);

    // Return success response with instruction to verify email
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please verify your email with the OTP sent to your inbox.',
        userId: seller.id,
        requiresVerification: true
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Seller registration error:', error);

    // Handle duplicate email error (Requirement 1.3)
    if (error.message === 'Email already registered') {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered',
          message: 'An account with this email already exists'
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: 'An error occurred during registration. Please try again.'
      },
      { status: 500 }
    );
  }
}
