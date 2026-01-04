import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        return NextResponse.json({
            hasSession: !!session,
            session: session,
            user: session?.user,
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            hasSession: false
        }, { status: 500 })
    }
}
