import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

const dataDir = path.join(process.cwd(), ".data")
const dataFile = path.join(dataDir, "admin-store.json")
const defaultStore = {
  categories: [
    { name: "Skin Care", image: "https://picsum.photos/seed/skincare/600/600", subcategories: ["Moisturizers", "Sunscreens", "Serums"] },
  ],
  productsByCategory: {
    "Skin Care": [
      {
        id: "Skin Care:Demo Cream",
        name: "Demo Cream",
        slug: "demo-cream",
        price: 1499,
        oldPrice: 1999,
        image: "https://picsum.photos/seed/demo-cream/800/800",
        rating: 4.5,
        brand: "Rasss",
        category: "Skin Care",
      },
    ],
  },
  slides: [
    { id: "Welcome", title: "Welcome to Rasss", subtitle: "Quality skincare products", image: "https://picsum.photos/seed/slide-welcome/1200/600" },
  ],
  brands: [
    { id: "Rasss", name: "Rasss", logo: "https://picsum.photos/seed/brand-rasss/200/200" },
  ],
  inventory: [
    { id: "m1", productId: "Skin Care:Demo Cream", productName: "Demo Cream", type: "in", qty: 50, unit: "pcs", note: "Initial stock", date: new Date().toISOString() },
  ],
  orders: [
    { id: "o1", status: "pending", items: [{ productId: "Skin Care:Demo Cream", name: "Demo Cream", qty: 2, price: 1499 }], total: 2998, placedAt: new Date().toISOString(), note: "Demo order" },
  ],
  ledger: [
    { id: "l1", type: "income", amount: 2998, note: "Demo sale", date: new Date().toISOString() },
    { id: "l2", type: "expense", amount: 500, note: "Packaging", date: new Date().toISOString() },
  ],
  accountant: { name: "Demo Accountant", email: "accounting@example.com", phone: "+92-300-0000000", notes: "Monthly audit on 28th", lastAuditDate: new Date().toISOString().slice(0,10) },
}

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
