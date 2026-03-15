import { NextRequest, NextResponse } from 'next/server';
import { requireApprovedSeller } from '@/lib/middleware/auth';
import { productService } from '@/services/productService';
import { validateImageUrls } from '@/lib/imageUpload';

/**
 * POST /api/seller/products
 * Create a new product as an approved seller
 * Requirements: 3.2, 3.3, 9.1, 9.2, 9.3, 9.4
 */
export async function POST(req: NextRequest) {
  return requireApprovedSeller(req, async (req, context) => {
    try {
      const body = await req.json();
      const {
        name,
        description,
        price,
        oldPrice,
        costPrice,
        category,
        brand,
        sku,
        stock,
        lowStockThreshold,
        image,
        images,
        status,
        isFeatured,
        metaTitle,
        metaDescription,
        variants
      } = body;

      // Validation
      if (!name || !price || !category || stock === undefined) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields',
            message: 'Name, price, category, and stock are required'
          },
          { status: 400 }
        );
      }

      // Validate price
      if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid price',
            message: 'Price must be a positive number'
          },
          { status: 400 }
        );
      }

      // Validate stock
      if (typeof stock !== 'number' || stock < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid stock',
            message: 'Stock must be a non-negative number'
          },
          { status: 400 }
        );
      }

      // Validate images - at least one image required (Requirement 9.1)
      if (!image && (!images || images.length === 0)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Image required',
            message: 'At least one product image is required'
          },
          { status: 400 }
        );
      }

      // Validate image URLs using utility function (Requirement 9.3)
      const allImages = [...(images || []), image].filter(Boolean) as string[];
      const imageValidation = validateImageUrls(allImages);
      
      if (!imageValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid image format',
            message: imageValidation.errors.join(', ')
          },
          { status: 400 }
        );
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Ensure slug is unique
      let uniqueSlug = slug;
      let count = 0;
      const { prisma } = await import('@/lib/prisma');
      while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
        count++;
        uniqueSlug = `${slug}-${count}`;
      }

      // Create product with seller as owner
      const product = await prisma.product.create({
        data: {
          name,
          slug: uniqueSlug,
          description,
          price,
          oldPrice,
          costPrice,
          category,
          brand,
          sku,
          stock,
          lowStockThreshold,
          image: image || (images && images.length > 0 ? images[0] : undefined),
          images: images || [],
          status: status || 'active',
          isFeatured: isFeatured || false,
          metaTitle,
          metaDescription,
          ownerId: context.user.id,
          variants: variants && variants.length > 0 ? {
            create: variants.map((v: any) => ({
              name: v.name,
              sku: v.sku,
              price: v.price,
              stock: v.stock,
              attributes: v.attributes || {},
              image: v.image,
              isDefault: v.isDefault || false
            }))
          } : undefined
        },
        include: {
          variants: true
        }
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Product created successfully',
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            status: product.status
          }
        },
        { status: 201 }
      );

    } catch (error: any) {
      console.error('Product creation error:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Product creation failed',
          message: error.message || 'An error occurred while creating the product'
        },
        { status: 500 }
      );
    }
  });
}


/**
 * GET /api/seller/products
 * Get all products owned by the authenticated seller
 * Requirements: 3.4
 */
export async function GET(req: NextRequest) {
  return requireApprovedSeller(req, async (req, context) => {
    try {
      // Get products owned by this seller
      const { prisma } = await import('@/lib/prisma');
      const products = await prisma.product.findMany({
        where: { ownerId: context.user.id },
        include: { variants: true },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json(
        {
          success: true,
          products: products.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            oldPrice: product.oldPrice,
            stock: product.stock,
            status: product.status,
            image: product.image,
            images: product.images,
            category: product.category,
            brand: product.brand,
            sku: product.sku,
            isFeatured: product.isFeatured,
            variants: product.variants,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          }))
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error('Get seller products error:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve products',
          message: error.message || 'An error occurred while retrieving products'
        },
        { status: 500 }
      );
    }
  });
}
