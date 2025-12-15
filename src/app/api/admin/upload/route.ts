import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

const uploadsDir = path.join(process.cwd(), "public", "uploads")

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token") || ""
  const required = process.env.ADMIN_TOKEN
  if (required && token !== required) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const form = await req.formData()
  const file = form.get("file") as File | null
  if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 })
  const type = file.type || ""
  if (!/^image\/(png|jpeg|jpg|webp|gif)$/i.test(type)) return NextResponse.json({ error: "invalid_type" }, { status: 400 })

  try {
    const safeName = (file.name || "image").replace(/[^a-z0-9\-_.]/gi, "_")
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
    const blob = await put(key, file, { access: "public" })
    return NextResponse.json({ url: blob.url })
  } catch {
    try {
      const buff = Buffer.from(await file.arrayBuffer())
      const ext = type.split("/")[1].toLowerCase().replace("jpeg", "jpg")
      const safeName = (file.name || "image").replace(/[^a-z0-9\-_.]/gi, "_")
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}.${ext}`
      fs.mkdirSync(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, name)
      fs.writeFileSync(filePath, buff)
      const url = `/uploads/${name}`
      return NextResponse.json({ url })
    } catch {
      return NextResponse.json({ error: "upload_failed" }, { status: 500 })
    }
  }
}
