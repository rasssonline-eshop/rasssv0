import { NextRequest, NextResponse } from "next/server"
import ImageKit from "imagekit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const runtime = "nodejs"

// Initialize ImageKit only if credentials are provided
let imagekit: ImageKit | null = null;

try {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (publicKey && privateKey && urlEndpoint) {
        imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });
    }
} catch (error) {
    console.warn("ImageKit initialization skipped - credentials not configured");
}

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
        // Check if ImageKit is configured
        if (!imagekit) {
            return NextResponse.json(
                { error: "ImageKit not configured - please set environment variables" },
                { status: 503 }
            )
        }

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
