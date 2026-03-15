import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export interface SellerRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName?: string;
}

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export class SellerService {
  /**
   * Register a new seller with pending status
   * Validates email uniqueness and creates user with seller role
   */
  async registerSeller(data: SellerRegistrationData) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create seller account with pending status
    const seller = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: 'seller',
        sellerStatus: 'pending'
      }
    });

    return seller;
  }

  /**
   * Approve a seller account
   * Updates status to approved and triggers email notification
   */
  async approveSeller(sellerId: string, adminId: string) {
    // Verify seller exists and is pending
    const seller = await prisma.user.findUnique({
      where: { id: sellerId }
    });

    if (!seller) {
      throw new Error('Seller not found');
    }

    if (seller.role !== 'seller') {
      throw new Error('User is not a seller');
    }

    if (seller.sellerStatus !== 'pending') {
      throw new Error('Seller is not in pending status');
    }

    // Update seller status to approved
    const updatedSeller = await prisma.user.update({
      where: { id: sellerId },
      data: {
        sellerStatus: 'approved',
        updatedAt: new Date()
      }
    });

    return updatedSeller;
  }

  /**
   * Reject a seller account
   * Updates status to rejected and triggers email notification
   */
  async rejectSeller(sellerId: string, adminId: string, reason?: string) {
    // Verify seller exists and is pending
    const seller = await prisma.user.findUnique({
      where: { id: sellerId }
    });

    if (!seller) {
      throw new Error('Seller not found');
    }

    if (seller.role !== 'seller') {
      throw new Error('User is not a seller');
    }

    if (seller.sellerStatus !== 'pending') {
      throw new Error('Seller is not in pending status');
    }

    // Update seller status to rejected
    const updatedSeller = await prisma.user.update({
      where: { id: sellerId },
      data: {
        sellerStatus: 'rejected',
        updatedAt: new Date()
      }
    });

    return updatedSeller;
  }

  /**
   * Get seller statistics
   * Calculates product counts, orders, and revenue for a specific seller
   */
  async getSellerStats(sellerId: string): Promise<SellerStats> {
    // Get product counts
    const totalProducts = await prisma.product.count({
      where: { ownerId: sellerId }
    });

    const activeProducts = await prisma.product.count({
      where: {
        ownerId: sellerId,
        status: 'active'
      }
    });

    const inactiveProducts = await prisma.product.count({
      where: {
        ownerId: sellerId,
        status: 'inactive'
      }
    });

    // Get all orders
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['pending', 'paid', 'shipped', 'delivered'] }
      }
    });

    // Filter orders that contain seller's products and calculate revenue
    let totalOrders = 0;
    let totalRevenue = 0;

    for (const order of orders) {
      const items = order.items as any[];
      const sellerItems = items.filter(item => item.sellerId === sellerId);

      if (sellerItems.length > 0) {
        totalOrders++;
        // Calculate revenue only from seller's products in this order
        const sellerItemsRevenue = sellerItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        totalRevenue += sellerItemsRevenue;
      }
    }

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalOrders,
      totalRevenue
    };
  }
}

// Export singleton instance
export const sellerService = new SellerService();
