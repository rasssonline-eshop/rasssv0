import { NextRequest, NextResponse } from 'next/server';
import { requireApprovedSeller } from '@/lib/middleware/auth';
import { productService } from '@/services/productService';
import { validateImageUrls } from '@/lib/imageUpload';

/**
 * PATCH /api/seller/products/[id]
 * Update a product owned by the authenticated seller
 * Requirements: 3.5, 4.2
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireApprovedSeller(req, async (req, context) => {
    try {
      const { id: productId } = await params;
      const body = await req.json();

      // Validate productId
      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid product ID',
            message: 'Product ID is required'
          },
          { status: 400 }
        );
      }

      // Extract update fields
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

      // Validate price if provided
      if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid price',
            message: 'Price must be a positive number'
          },
          { status: 400 }
        );
      }

      // Validate stock if provided
      if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid stock',
            message: 'Stock must be a non-negative number'
          },
          { status: 400 }
        );
      }

      // Validate image formats if images are provided
      if (images && Array.isArray(images)) {
        const imageValidation = validateImageUrls(images);
        
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
      }

      // Validate single image if provided
      if (image && typeof image === 'string') {
        const imageValidation = validateImageUrls([image]);
        
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
      }

      // Build update data object
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (oldPrice !== undefined) updateData.oldPrice = oldPrice;
      if (costPrice !== undefined) updateData.costPrice = costPrice;
      if (category !== undefined) updateData.category = category;
      if (brand !== undefined) updateData.brand = brand;
      if (sku !== undefined) updateData.sku = sku;
      if (stock !== undefined) updateData.stock = stock;
      if (lowStockThreshold !== undefined) updateData.lowStockThreshold = lowStockThreshold;
      if (image !== undefined) updateData.image = image;
      if (images !== undefined) updateData.images = images;
      if (status !== undefined) updateData.status = status;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
      if (metaDescription !== undefined) updateData.metaDescription = metaDescription;

      // Update slug if name changed
      if (name) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Ensure slug is unique
        let uniqueSlug = slug;
        let count = 0;
        const { prisma } = await import('@/lib/prisma');
        
        // Check if slug is different from current product's slug
        const currentProduct = await prisma.product.findUnique({
          where: { id: productId },
          select: { slug: true, ownerId: true }
        });

        // Verify ownership
        if (!currentProduct) {
          return NextResponse.json(
            {
              success: false,
              error: 'Product not found',
              message: 'The requested product does not exist'
            },
            { status: 404 }
          );
        }

        if (currentProduct.ownerId !== context.user.id && context.user.role !== 'admin') {
          return NextResponse.json(
            {
              success: false,
              error: 'Permission denied',
              message: 'You can only modify your own products'
            },
            { status: 403 }
          );
        }
        
        if (currentProduct && currentProduct.slug !== slug) {
          while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
            count++;
            uniqueSlug = `${slug}-${count}`;
          }
          updateData.slug = uniqueSlug;
        }
      }

      // Handle variants update
      const { prisma } = await import('@/lib/prisma');
      
      // Verify ownership if we haven't already
      if (!name) {
        const currentProduct = await prisma.product.findUnique({
          where: { id: productId },
          select: { ownerId: true }
        });

        if (!currentProduct) {
          return NextResponse.json(
            {
              success: false,
              error: 'Product not found',
              message: 'The requested product does not exist'
            },
            { status: 404 }
          );
        }

        if (currentProduct.ownerId !== context.user.id && context.user.role !== 'admin') {
          return NextResponse.json(
            {
              success: false,
              error: 'Permission denied',
              message: 'You can only modify your own products'
            },
            { status: 403 }
          );
        }
      }

      // Update product
      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: { variants: true }
      });

      // Handle variants separately if provided
      if (variants !== undefined) {
        // Delete existing variants
        await prisma.productVariant.deleteMany({
          where: { productId }
        });

        // Create new variants
        if (variants && variants.length > 0) {
          await prisma.productVariant.createMany({
            data: variants.map((v: any) => ({
              productId,
              name: v.name,
              sku: v.sku,
              price: v.price,
              stock: v.stock,
              attributes: v.attributes || {},
              image: v.image,
              isDefault: v.isDefault || false
            }))
          });
        }
      }

      // Fetch updated product with variants
      const updatedProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true }
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Product updated successfully',
          product: {
            id: updatedProduct!.id,
            slug: updatedProduct!.slug,
            name: updatedProduct!.name,
            price: updatedProduct!.price,
            status: updatedProduct!.status,
            variants: updatedProduct!.variants
          }
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error('Product update error:', error);

      // Handle specific errors
      if (error.message === 'Product not found') {
        return NextResponse.json(
          {
            success: false,
            error: 'Product not found',
            message: 'The requested product does not exist'
          },
          { status: 404 }
        );
      }

      if (error.message === 'You do not have permission to modify this product') {
        return NextResponse.json(
          {
            success: false,
            error: 'Permission denied',
            message: 'You can only modify your own products'
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Product update failed',
          message: error.message || 'An error occurred while updating the product'
        },
        { status: 500 }
      );
    }
  });
}


/**
 * DELETE /api/seller/products/[id]
 * Delete a product owned by the authenticated seller
 * Requirements: 3.6, 4.3, 9.5
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireApprovedSeller(req, async (_req, context) => {
    try {
      const { id: productId } = await params;

      // Validate productId
      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid product ID',
            message: 'Product ID is required'
          },
          { status: 400 }
        );
      }

      // Delete product with ownership verification
      // ProductService handles image cleanup automatically (Requirement 9.5)
      await productService.deleteProduct(
        productId,
        context.user.id,
        context.user.role
      );

      return NextResponse.json(
        {
          success: true,
          message: 'Product deleted successfully'
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error('Product deletion error:', error);

      // Handle specific errors
      if (error.message === 'Product not found') {
        return NextResponse.json(
          {
            success: false,
            error: 'Product not found',
            message: 'The requested product does not exist'
          },
          { status: 404 }
        );
      }

      if (error.message === 'You do not have permission to delete this product') {
        return NextResponse.json(
          {
            success: false,
            error: 'Permission denied',
            message: 'You can only delete your own products'
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Product deletion failed',
          message: error.message || 'An error occurred while deleting the product'
        },
        { status: 500 }
      );
    }
  });
}
