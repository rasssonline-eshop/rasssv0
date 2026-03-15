import { prisma } from '@/lib/prisma';
import { deleteProductImages } from '@/lib/imageUpload';

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  image?: string;
  images?: string[];
  category: string;
  brand?: string;
  sku?: string;
  stock: number;
  lowStockThreshold?: number;
  status?: string;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  rating?: number;
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  oldPrice?: number;
  costPrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  brand?: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  status?: string;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  rating?: number;
}

export interface ProductFilters {
  status?: string;
  category?: string;
  ownerId?: string;
}

export class ProductService {
  /**
   * Check if a user can modify a product
   * Returns true if user is admin or product owner
   */
  async canModifyProduct(productId: string, userId: string, userRole: string): Promise<boolean> {
    // Admins can modify any product
    if (userRole === 'admin') {
      return true;
    }

    // Check if user is the product owner
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { ownerId: true }
    });

    if (!product) {
      return false;
    }

    return product.ownerId === userId;
  }

  /**
   * Create a new product with ownership tracking
   * Records the creating user's ID as the product owner
   */
  async createProduct(data: CreateProductData, ownerId: string) {
    const product = await prisma.product.create({
      data: {
        ...data,
        ownerId,
        images: data.images || [],
        status: data.status || 'active'
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return product;
  }

  /**
   * Get all products owned by a specific user
   * Used for seller product lists
   */
  async getProductsByOwner(ownerId: string) {
    const products = await prisma.product.findMany({
      where: { ownerId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products;
  }

  /**
   * Update a product with ownership verification
   * Allows admin override - admins can modify any product
   */
  async updateProduct(productId: string, data: UpdateProductData, userId: string, userRole: string) {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user can modify product (admin or owner)
    const canModify = await this.canModifyProduct(productId, userId, userRole);
    if (!canModify) {
      throw new Error('You do not have permission to modify this product');
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return updatedProduct;
  }

  /**
   * Delete a product with ownership verification
   * Allows admin override - admins can delete any product
   * Requirement 9.5: Removes all associated images from storage
   */
  async deleteProduct(productId: string, userId: string, userRole: string) {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user can modify product (admin or owner)
    const canModify = await this.canModifyProduct(productId, userId, userRole);
    if (!canModify) {
      throw new Error('You do not have permission to delete this product');
    }

    // Collect all image URLs for cleanup
    const imageUrls: string[] = [];
    if (product.image) {
      imageUrls.push(product.image);
    }
    if (product.images && product.images.length > 0) {
      imageUrls.push(...product.images);
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id: productId }
    });

    // Clean up associated images (Requirement 9.5)
    if (imageUrls.length > 0) {
      const cleanupResult = await deleteProductImages(imageUrls);
      if (!cleanupResult.success) {
        // Log error but don't fail the deletion
        // Product is already deleted from database
        console.error('Image cleanup failed:', cleanupResult.error);
      }
    }

    return { success: true, message: 'Product deleted successfully' };
  }

  /**
   * Get all products with optional filtering
   * Used for admin dashboard to see all products
   */
  async getAllProducts(filters?: ProductFilters) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products;
  }

  /**
   * Get active products for customer catalog
   * Only returns products with status 'active'
   */
  async getActiveProducts(filters?: Omit<ProductFilters, 'status'>) {
    const where: any = {
      status: 'active'
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products;
  }
}

// Export singleton instance
export const productService = new ProductService();
