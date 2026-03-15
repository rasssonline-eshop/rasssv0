import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as any
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      )
    }

    const { sellerId } = await params

    // Check if seller exists
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      include: {
        products: true,
        orders: true
      }
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      )
    }

    if (seller.role !== "seller") {
      return NextResponse.json(
        { error: "User is not a seller" },
        { status: 400 }
      )
    }

    // Delete all seller's products first
    await prisma.product.deleteMany({
      where: { ownerId: sellerId }
    })

    // Delete the seller account
    await prisma.user.delete({
      where: { id: sellerId }
    })

    return NextResponse.json({
      success: true,
      message: "Seller and all their products deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting seller:", error)
    return NextResponse.json(
      { error: "Failed to delete seller" },
      { status: 500 }
    )
  }
}
