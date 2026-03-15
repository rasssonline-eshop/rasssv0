# Authentication and Authorization Middleware

This directory contains middleware functions for implementing role-based access control (RBAC) in API routes.

## Available Middleware

### `requireAuth`
Ensures the user is authenticated. Returns 401 if not authenticated.

```typescript
import { requireAuth } from "@/lib/middleware/auth"

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req, context) => {
    // context.user contains authenticated user info
    return NextResponse.json({ user: context.user })
  })
}
```

### `requireRole`
Ensures the user has a specific role or one of multiple roles. Returns 403 if role doesn't match.

```typescript
import { requireRole } from "@/lib/middleware/auth"

export async function GET(req: NextRequest) {
  return requireRole(req, "admin", async (req, context) => {
    // Only admins can access this
    return NextResponse.json({ message: "Admin only" })
  })
}

// Multiple roles
export async function POST(req: NextRequest) {
  return requireRole(req, ["admin", "seller"], async (req, context) => {
    // Admins and sellers can access this
    return NextResponse.json({ message: "Admin or seller" })
  })
}
```

### `requireApprovedSeller`
Ensures the user is a seller with "approved" status. Returns 403 if not approved.

```typescript
import { requireApprovedSeller } from "@/lib/middleware/auth"

export async function POST(req: NextRequest) {
  return requireApprovedSeller(req, async (req, context) => {
    // Only approved sellers can access this
    const body = await req.json()
    // Create product logic here
    return NextResponse.json({ success: true })
  })
}
```

### `requireAdmin`
Shorthand for `requireRole(req, "admin", handler)`. Ensures the user is an admin.

```typescript
import { requireAdmin } from "@/lib/middleware/auth"

export async function DELETE(req: NextRequest) {
  return requireAdmin(req, async (req, context) => {
    // Only admins can access this
    return NextResponse.json({ message: "Admin only" })
  })
}
```

## Ownership Verification Utilities

Located in `lib/ownership.ts`, these utilities help verify product ownership.

### `verifyProductOwnership`
Checks if a user owns a specific product.

```typescript
import { verifyProductOwnership } from "@/lib/ownership"

const isOwner = await verifyProductOwnership(productId, userId)
if (!isOwner) {
  return NextResponse.json(
    { error: "You can only modify your own products" },
    { status: 403 }
  )
}
```

### `canModifyProduct`
Checks if a user can modify a product (admins can modify any product, sellers only their own).

```typescript
import { canModifyProduct } from "@/lib/ownership"
import { requireAuth } from "@/lib/middleware/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(req, async (req, context) => {
    const canModify = await canModifyProduct(
      params.id,
      context.user.id,
      context.user.role
    )
    
    if (!canModify) {
      return NextResponse.json(
        { error: "You can only modify your own products" },
        { status: 403 }
      )
    }
    
    // Update product logic here
    return NextResponse.json({ success: true })
  })
}
```

## AuthContext Interface

All middleware functions provide an `AuthContext` object to the handler:

```typescript
interface AuthContext {
  user: {
    id: string
    email: string
    name?: string | null
    role: string
    sellerStatus?: string | null
  }
}
```

## Error Responses

- **401 Unauthorized**: User is not authenticated
- **403 Forbidden**: User lacks required permissions or role
- **403 Seller account pending approval**: Seller status is "pending"
- **403 Seller account not approved**: Seller status is "rejected" or not "approved"
