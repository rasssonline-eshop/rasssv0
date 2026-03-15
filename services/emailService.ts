/**
 * Email Service for Multi-Vendor Marketplace
 * Handles all email notifications for seller registration, approval, and rejection
 * 
 * Uses Nodemailer with Gmail for sending emails
 */

import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private readonly fromEmail = process.env.EMAIL_FROM || 'noreply@marketplace.com';
  private readonly adminEmail = process.env.ADMIN_EMAIL || 'admin@marketplace.com';
  private readonly appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  private initializeTransporter() {
    // Check if email credentials are configured
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('✓ Email service initialized with SMTP');
    } else {
      console.warn('⚠ Email credentials not configured. Emails will be logged to console only.');
    }
  }

  /**
   * Send email
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        console.log(`✓ Email sent to ${options.to}: ${options.subject}`);
      } catch (error) {
        console.error('✗ Failed to send email:', error);
        // Log to console as fallback
        this.logEmailToConsole(options);
      }
    } else {
      // Development mode - log to console
      this.logEmailToConsole(options);
    }
  }

  /**
   * Log email to console (development fallback)
   */
  private logEmailToConsole(options: EmailOptions): void {
    console.log('=== EMAIL NOTIFICATION (Console Mode) ===');
    console.log('From:', this.fromEmail);
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('HTML Body:', options.html);
    if (options.text) {
      console.log('Text Body:', options.text);
    }
    console.log('=========================================\n');
  }

  /**
   * Send OTP verification email
   * Requirements: 0.2
   */
  async sendOTPEmail(email: string, otp: string): Promise<void> {
    const subject = 'Email Verification - Your OTP Code';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering! Please use the following OTP code to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h1 style="color: #3b82f6; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>Important:</strong></p>
        <ul style="line-height: 1.8;">
          <li>This OTP will expire in <strong>10 minutes</strong></li>
          <li>You have <strong>3 attempts</strong> to enter the correct code</li>
          <li>Do not share this code with anyone</li>
        </ul>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      Email Verification
      
      Thank you for registering! Please use the following OTP code to verify your email address:
      
      ${otp}
      
      Important:
      - This OTP will expire in 10 minutes
      - You have 3 attempts to enter the correct code
      - Do not share this code with anyone
      
      If you didn't request this code, please ignore this email.
    `;

    await this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Send confirmation email to seller after registration
   * Requirements: 1.4, 10.1
   */
  async sendSellerRegistrationConfirmation(email: string, name: string): Promise<void> {
    const subject = 'Seller Registration Received - Pending Approval';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Marketplace, ${name}!</h2>
        <p>Thank you for registering as a seller on our platform.</p>
        <p>Your seller account has been created and is currently <strong>pending approval</strong> from our admin team.</p>
        <p>You will receive another email once your account has been reviewed. This typically takes 1-2 business days.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      Welcome to Our Marketplace, ${name}!
      
      Thank you for registering as a seller on our platform.
      
      Your seller account has been created and is currently pending approval from our admin team.
      
      You will receive another email once your account has been reviewed. This typically takes 1-2 business days.
      
      If you have any questions, please don't hesitate to contact our support team.
    `;

    await this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Send approval notification to seller
   * Requirements: 2.3, 10.2
   */
  async sendSellerApprovalNotification(email: string, name: string): Promise<void> {
    const subject = 'Congratulations! Your Seller Account Has Been Approved';
    const dashboardUrl = `${this.appUrl}/seller/dashboard`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Congratulations, ${name}!</h2>
        <p>Great news! Your seller account has been <strong>approved</strong>.</p>
        <p>You can now start listing and selling your products on our marketplace.</p>
        <div style="margin: 30px 0;">
          <a href="${dashboardUrl}" 
             style="background-color: #22c55e; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Your Seller Dashboard
          </a>
        </div>
        <h3 style="color: #333;">Getting Started:</h3>
        <ol style="line-height: 1.8;">
          <li>Log in to your account</li>
          <li>Navigate to the Seller Dashboard</li>
          <li>Upload your first product with images and details</li>
          <li>Start selling!</li>
        </ol>
        <p>If you need any assistance, our support team is here to help.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      Congratulations, ${name}!
      
      Great news! Your seller account has been approved.
      
      You can now start listing and selling your products on our marketplace.
      
      Access your Seller Dashboard: ${dashboardUrl}
      
      Getting Started:
      1. Log in to your account
      2. Navigate to the Seller Dashboard
      3. Upload your first product with images and details
      4. Start selling!
      
      If you need any assistance, our support team is here to help.
    `;

    await this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Send rejection notification to seller
   * Requirements: 2.4, 10.3
   */
  async sendSellerRejectionNotification(
    email: string, 
    name: string, 
    reason?: string
  ): Promise<void> {
    const subject = 'Seller Account Application Update';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${name},</h2>
        <p>Thank you for your interest in becoming a seller on our marketplace.</p>
        <p>After careful review, we regret to inform you that we are unable to approve your seller account at this time.</p>
        ${reason ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Reason:</strong>
            <p style="margin: 10px 0 0 0;">${reason}</p>
          </div>
        ` : ''}
        <p>If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
        <p>We appreciate your understanding.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      Hello ${name},
      
      Thank you for your interest in becoming a seller on our marketplace.
      
      After careful review, we regret to inform you that we are unable to approve your seller account at this time.
      
      ${reason ? `Reason: ${reason}\n\n` : ''}
      If you believe this decision was made in error or if you have additional information to provide, please contact our support team.
      
      We appreciate your understanding.
    `;

    await this.sendEmail({ to: email, subject, html, text });
  }

  /**
   * Notify admin of new seller registration
   * Requirements: 1.5
   */
  async notifyAdminOfNewSeller(sellerEmail: string, sellerName: string): Promise<void> {
    const subject = 'New Seller Registration - Pending Approval';
    const adminDashboardUrl = `${this.appUrl}/admin/sellers`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Seller Registration</h2>
        <p>A new seller has registered and is awaiting approval.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${sellerName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${sellerEmail}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Pending</p>
        </div>
        <div style="margin: 30px 0;">
          <a href="${adminDashboardUrl}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Review Seller Application
          </a>
        </div>
        <p>Please review the seller's information and approve or reject their application.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      New Seller Registration
      
      A new seller has registered and is awaiting approval.
      
      Name: ${sellerName}
      Email: ${sellerEmail}
      Status: Pending
      
      Review the application: ${adminDashboardUrl}
      
      Please review the seller's information and approve or reject their application.
    `;

    await this.sendEmail({ to: this.adminEmail, subject, html, text });
  }
}

// Export singleton instance
export const emailService = new EmailService();
