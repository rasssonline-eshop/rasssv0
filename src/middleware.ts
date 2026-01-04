import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    const { pathname } = request.nextUrl

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Allow access to secret admin login page
        if (pathname === '/admin/auth-secure-2024') {
            // If already logged in as admin, redirect to dashboard
            if (token?.role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return NextResponse.next()
        }

        // For all other admin routes, check if user is admin
        if (!token) {
            console.log('[Middleware] No token found, redirecting to login')
            return NextResponse.redirect(new URL('/admin/auth-secure-2024', request.url))
        }

        if (token.role !== 'admin') {
            console.log('[Middleware] User role is not admin:', token.role)
            return NextResponse.redirect(new URL('/admin/auth-secure-2024', request.url))
        }

        console.log('[Middleware] Admin access granted')
    }

    // Protect customer/seller profile routes
    if (pathname.startsWith('/profile')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*']
}
