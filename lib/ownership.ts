import { prisma } from "@/lib/prisma"

/**
 * Verify if a user owns a specific product
 * @param productId - The ID of the product to check
 * @param userId - The ID of the user to verify ownership for
 * @returns true if the user owns the product, false otherwise
 */
export async function verifyProductOwnership(
  productId: string,
  userId: string
): Promise<boolean> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { ownerId: true },
    })

    if (!product) {
      return false
    }

    return product.ownerId === userId
  } catch (error) {
    console.error("Error verifying product ownership:", error)
    return false
  }
}

/**
 * Check if a user can modify a product
 * Admins can modify any product, sellers can only modify their own products
 * @param productId - The ID of the product to check
 * @param userId - The ID of the user attempting to modify
 * @param userRole - The role of the user (admin, seller, customer)
 * @returns true if the user can modify the product, false otherwise
 */
export async function canModifyProduct(
  productId: string,
  userId: string,
  userRole: string
): Promise<boolean> {
  // Admins can modify any product
  if (userRole === "admin") {
    return true
  }

  // Non-admins must own the product
  return verifyProductOwnership(productId, userId)
}
