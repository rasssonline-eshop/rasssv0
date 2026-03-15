import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log('[NextAuth] Missing credentials')
                        return null
                    }

                    console.log('[NextAuth] Attempting to find user:', credentials.email)
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    })

                    if (!user || !user.password) {
                        console.log('[NextAuth] User not found or no password')
                        return null
                    }

                    // Check if email is verified (Requirement 0.10)
                    if (!user.emailVerified) {
                        console.log('[NextAuth] Email not verified')
                        throw new Error('EMAIL_NOT_VERIFIED')
                    }

                    console.log('[NextAuth] Comparing passwords')
                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if (!isValid) {
                        console.log('[NextAuth] Invalid password')
                        return null
                    }

                    console.log('[NextAuth] Authentication successful for:', user.email)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        sellerStatus: user.sellerStatus,
                    }
                } catch (error) {
                    console.error('[NextAuth] Authorization error:', error)
                    if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
                        throw error
                    }
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            try {
                console.log('[NextAuth JWT] Called with user:', !!user)
                if (user) {
                    console.log('[NextAuth JWT] Setting role:', (user as any).role)
                    token.role = (user as any).role
                    token.id = user.id
                    token.sellerStatus = (user as any).sellerStatus
                }
                console.log('[NextAuth JWT] Returning token with role:', token.role, 'sellerStatus:', token.sellerStatus)
                return token
            } catch (error) {
                console.error('[NextAuth JWT] Error:', error)
                return token
            }
        },
        async session({ session, token }) {
            try {
                console.log('[NextAuth Session] Called with token role:', token.role, 'sellerStatus:', token.sellerStatus)

                if (session.user) {
                    return {
                        ...session,
                        user: {
                            ...session.user,
                            id: token.id as string,
                            role: token.role as string,
                            sellerStatus: token.sellerStatus as string | null
                        }
                    }
                }

                return session
            } catch (error) {
                console.error('[NextAuth Session] Error:', error)
                return session
            }
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}
