import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    const { pathname } = request.nextUrl

    // Protect admin routes - require admin role
    if (pathname.startsWith('/admin')) {
        if (!token) {
            // Not logged in - redirect to login
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }

        if (token.role !== 'admin') {
            // Logged in but not admin - redirect to home with error
            const homeUrl = new URL('/', request.url)
            homeUrl.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(homeUrl)
        }
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
