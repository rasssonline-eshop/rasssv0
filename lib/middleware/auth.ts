import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export interface AuthContext {
  user: {
    id: string
    email: string
    name?: string | null
    role: string
    sellerStatus?: string | null
  }
}

/**
 * Middleware to require authentication
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    )
  }

  const context: AuthContext = {
    user: {
      id: (session.user as any).id,
      email: session.user.email!,
      name: session.user.name,
      role: (session.user as any).role || "customer",
      sellerStatus: (session.user as any).sellerStatus,
    },
  }

  return handler(req, context)
}

/**
 * Middleware to require specific role(s)
 * Returns 403 if user doesn't have required role
 */
export async function requireRole(
  req: NextRequest,
  roles: string | string[],
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    )
  }

  const userRole = (session.user as any).role || "customer"
  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 }
    )
  }

  const context: AuthContext = {
    user: {
      id: (session.user as any).id,
      email: session.user.email!,
      name: session.user.name,
      role: userRole,
      sellerStatus: (session.user as any).sellerStatus,
    },
  }

  return handler(req, context)
}

/**
 * Middleware to require approved seller status
 * Returns 403 if seller is not approved
 */
export async function requireApprovedSeller(
  req: NextRequest,
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    )
  }

  const userRole = (session.user as any).role || "customer"
  const sellerStatus = (session.user as any).sellerStatus

  if (userRole !== "seller") {
    return NextResponse.json(
      { error: "Forbidden - Seller role required" },
      { status: 403 }
    )
  }

  if (sellerStatus === "pending") {
    return NextResponse.json(
      { error: "Seller account pending approval" },
      { status: 403 }
    )
  }

  if (sellerStatus === "rejected") {
    return NextResponse.json(
      { error: "Seller account not approved" },
      { status: 403 }
    )
  }

  if (sellerStatus !== "approved") {
    return NextResponse.json(
      { error: "Seller account not approved" },
      { status: 403 }
    )
  }

  const context: AuthContext = {
    user: {
      id: (session.user as any).id,
      email: session.user.email!,
      name: session.user.name,
      role: userRole,
      sellerStatus: sellerStatus,
    },
  }

  return handler(req, context)
}

/**
 * Middleware to require admin role
 * Returns 403 if user is not an admin
 */
export async function requireAdmin(
  req: NextRequest,
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireRole(req, "admin", handler)
}
