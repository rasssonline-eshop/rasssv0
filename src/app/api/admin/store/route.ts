import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put, list } from "@vercel/blob"
import { MongoClient, Collection } from "mongodb"

export const runtime = "nodejs"

const dataDir = path.join(process.cwd(), ".data")
const dataFile = path.join(dataDir, "admin-store.json")
const mongoUri = process.env.MONGODB_URI || ""
const mongoDb = process.env.MONGODB_DB || "rasss"
let mongoClient: MongoClient | null = null
type AdminStoreDoc = {
  _id: string
  data?: any
  updatedAt?: Date
}
async function getMongoCollection(): Promise<Collection<AdminStoreDoc> | null> {
  if (!mongoUri) return null
  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
  }
  return mongoClient.db(mongoDb).collection<AdminStoreDoc>("admin_store")
}
const defaultStore = {
  categories: [],
  productsByCategory: {},
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
  accountant: { name: "Demo Accountant", email: "accounting@example.com", phone: "+92-300-0000000", notes: "Monthly audit on 28th", lastAuditDate: new Date().toISOString().slice(0, 10) },
  suppliers: [
    { id: "sup1", name: "Supplier One", email: "supplier1@example.com", phone: "+92-300-1111111" },
  ],
  purchaseOrders: [
    { id: "po1", supplierId: "sup1", items: [{ productId: "Skin Care:Demo Cream", name: "Demo Cream", qty: 20, unitCost: 600 }], total: 12000, status: "ordered", createdAt: new Date().toISOString(), note: "Initial order" },
  ],
  invoices: [
    { id: "inv1", orderId: "o1", amount: 2998, status: "unpaid", issuedAt: new Date().toISOString() },
  ],
}

function ensureDir() {
  try { fs.mkdirSync(dataDir, { recursive: true }) } catch { }
}

export async function GET() {
  try {
    const col = await getMongoCollection()
    if (col) {
      const doc = await col.findOne({ _id: "store" })
      if (doc && doc.data) return NextResponse.json(doc.data)
      if (doc) return NextResponse.json(doc)
    }
  } catch { }
  try {
    const { blobs } = await list({ prefix: "admin/store.json" })
    const b = blobs.find(x => x.pathname === "admin/store.json") || blobs[0]
    if (b) {
      const r = await fetch((b as any).downloadUrl || b.url)
      if (r.ok) { const json = await r.json(); return NextResponse.json(json) }
    }
  } catch { }
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
    try {
      const col = await getMongoCollection()
      if (col) {
        await col.updateOne({ _id: "store" }, { $set: { data: body, updatedAt: new Date() } }, { upsert: true })
        return NextResponse.json({ ok: true })
      }
    } catch { }
    try {
      await put("admin/store.json", JSON.stringify(body), { access: "public", contentType: "application/json", addRandomSuffix: false })
      return NextResponse.json({ ok: true })
    } catch { }
    try {
      ensureDir()
      fs.writeFileSync(dataFile, JSON.stringify(body, null, 2), "utf8")
      return NextResponse.json({ ok: true })
    } catch {
      return NextResponse.json({ error: "bad_request" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
}
