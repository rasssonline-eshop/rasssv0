import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/src/lib/prisma"
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
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    return null
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log('[NextAuth JWT] Called with user:', !!user)
            if (user) {
                console.log('[NextAuth JWT] Setting role:', (user as any).role)
                token.role = (user as any).role
                token.id = user.id
            }
            console.log('[NextAuth JWT] Returning token with role:', token.role)
            return token
        },
        async session({ session, token }) {
            console.log('[NextAuth Session] Called with token role:', token.role)
            if (session.user) {
                (session.user as any).role = token.role
                    (session.user as any).id = token.id
            }
            console.log('[NextAuth Session] Returning session with user role:', (session.user as any)?.role)
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
