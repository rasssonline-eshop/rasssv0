import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

const dataDir = path.join(process.cwd(), ".data")
const dataFile = path.join(dataDir, "admin-store.json")
const defaultStore = { categories: [], productsByCategory: {}, slides: [], brands: [] }

function ensureDir() {
  try { fs.mkdirSync(dataDir, { recursive: true }) } catch {}
}

export async function GET() {
  try {
    ensureDir()
    if (!fs.existsSync(dataFile)) return NextResponse.json(defaultStore)
    const raw = fs.readFileSync(dataFile, "utf8")
    const json = JSON.parse(raw)
    return NextResponse.json(json)
  } catch {
    return NextResponse.json(defaultStore)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("x-admin-token") || ""
    const required = process.env.ADMIN_TOKEN
    if (required && token !== required) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const body = await req.json()
    ensureDir()
    fs.writeFileSync(dataFile, JSON.stringify(body, null, 2), "utf8")
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
}
