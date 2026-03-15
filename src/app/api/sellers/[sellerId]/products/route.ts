import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    const { sellerId } = await params

    // Verify seller exists and is approved
    const seller = await prisma.user.findUnique({
      where: {
        id: sellerId,
        role: "seller",
        sellerStatus: "approved",
      },
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      )
    }

    // Fetch seller's products (only active ones for public view)
    const products = await prisma.product.findMany({
      where: {
        ownerId: sellerId,
        status: "active",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
