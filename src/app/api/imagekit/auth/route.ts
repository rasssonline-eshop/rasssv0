import { NextRequest, NextResponse } from "next/server"
import ImageKit from "imagekit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"

export const runtime = "nodejs"

// Initialize ImageKit - private key stays server-side only
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

/**
 * ImageKit Authentication Endpoint
 * 
 * Returns authentication parameters for client-side direct upload.
 * NO file handling - only auth tokens.
 * 
 * Flow: Admin browser → this endpoint → receives {token, expire, signature}
 *       Admin browser → ImageKit (direct upload with auth params)
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Verify admin session
        const session = await getServerSession(authOptions)

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized - admin access required" },
                { status: 401 }
            )
        }

        // 2. Generate authentication parameters
        // These are time-limited and secure for client-side use
        const authParams = imagekit.getAuthenticationParameters()

        // 3. Return auth params only - no file data ever touches this route
        return NextResponse.json(authParams)

    } catch (error: any) {
        console.error("ImageKit Auth Error:", error)
        return NextResponse.json(
            { error: "Failed to generate auth parameters" },
            { status: 500 }
        )
    }
}
