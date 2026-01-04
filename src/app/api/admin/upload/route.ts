import { NextRequest, NextResponse } from "next/server"
import ImageKit from "imagekit"

export const runtime = "nodejs"

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

export async function POST(req: NextRequest) {
  // 1. Authentication Check
  const token = req.headers.get("x-admin-token") || ""
  const required = process.env.ADMIN_TOKEN
  if (required && token !== required) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    // 2. Parse Form Data
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "no_file" }, { status: 400 })
    }

    // 3. Validation
    const type = file.type || ""
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/i.test(type)) {
      return NextResponse.json({ error: "invalid_type" }, { status: 400 })
    }

    // 4. Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // 5. Upload to ImageKit
    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name || "image.jpg",
      folder: "/products", // Optional: organize in folders
    })

    // 6. Return the URL
    return NextResponse.json({ url: result.url })

  } catch (error: any) {
    console.error("Upload Error:", error)
    return NextResponse.json(
      { error: "upload_failed", details: error.message },
      { status: 500 }
    )
  }
}
