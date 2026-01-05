"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

// ImageKit upload endpoint
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload"

interface UploadedImage {
    url: string
    fileId: string
    name: string
}

interface ImageKitUploaderProps {
    /** Folder path in ImageKit (e.g., "/products") */
    folder?: string
    /** Callback when images are uploaded */
    onUpload: (urls: string[]) => void
    /** Currently uploaded image URLs */
    images?: string[]
    /** Callback when an image is removed */
    onRemove?: (index: number) => void
    /** Maximum file size in MB (default: 5MB) */
    maxSizeMB?: number
    /** Allowed MIME types */
    allowedTypes?: string[]
    /** Enable multiple file upload */
    multiple?: boolean
    /** Custom class name for the container */
    className?: string
}

interface UploadProgress {
    fileName: string
    progress: number
    status: "uploading" | "success" | "error"
    error?: string
}

export function ImageKitUploader({
    folder = "/products",
    onUpload,
    images = [],
    onRemove,
    maxSizeMB = 5,
    allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
    multiple = true,
    className = "",
}: ImageKitUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Get auth parameters from our secure endpoint
    const getAuthParams = async () => {
        const res = await fetch("/api/imagekit/auth", {
            credentials: "include", // Ensure cookies are sent for session
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            if (res.status === 401) {
                throw new Error("Admin login required to upload images")
            }
            throw new Error(errorData.error || "Failed to get upload authorization")
        }
        return res.json()
    }

    // Upload single file directly to ImageKit
    const uploadFile = async (
        file: File,
        authParams: { token: string; expire: number; signature: string }
    ): Promise<UploadedImage> => {
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY

        if (!publicKey) {
            throw new Error("ImageKit public key not configured")
        }

        // Create form data for ImageKit
        const formData = new FormData()
        formData.append("file", file)
        formData.append("fileName", file.name)
        formData.append("folder", folder)
        formData.append("publicKey", publicKey)
        formData.append("signature", authParams.signature)
        formData.append("expire", authParams.expire.toString())
        formData.append("token", authParams.token)

        // Upload directly to ImageKit (bypasses Vercel completely)
        const response = await fetch(IMAGEKIT_UPLOAD_URL, {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "Upload failed")
        }

        const result = await response.json()
        return {
            url: result.url,
            fileId: result.fileId,
            name: result.name,
        }
    }

    // Validate file before upload
    const validateFile = (file: File): string | null => {
        if (!allowedTypes.includes(file.type)) {
            return `Invalid file type. Allowed: ${allowedTypes.map(t => t.split("/")[1]).join(", ")}`
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File too large. Maximum size: ${maxSizeMB}MB`
        }
        return null
    }

    // Handle file selection
    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)
        setUploading(true)

        // Initialize progress tracking
        setUploadProgress(
            fileArray.map((file) => ({
                fileName: file.name,
                progress: 0,
                status: "uploading" as const,
            }))
        )

        try {
            // Get auth params once for all uploads
            const authParams = await getAuthParams()

            const uploadedUrls: string[] = []

            for (let i = 0; i < fileArray.length; i++) {
                const file = fileArray[i]

                // Validate
                const validationError = validateFile(file)
                if (validationError) {
                    setUploadProgress((prev) =>
                        prev.map((p, idx) =>
                            idx === i ? { ...p, status: "error", error: validationError } : p
                        )
                    )
                    continue
                }

                try {
                    // Update progress to show uploading
                    setUploadProgress((prev) =>
                        prev.map((p, idx) =>
                            idx === i ? { ...p, progress: 50 } : p
                        )
                    )

                    // Upload to ImageKit directly
                    const result = await uploadFile(file, authParams)
                    uploadedUrls.push(result.url)

                    // Mark as complete
                    setUploadProgress((prev) =>
                        prev.map((p, idx) =>
                            idx === i ? { ...p, progress: 100, status: "success" } : p
                        )
                    )
                } catch (error: any) {
                    setUploadProgress((prev) =>
                        prev.map((p, idx) =>
                            idx === i
                                ? { ...p, status: "error", error: error.message || "Upload failed" }
                                : p
                        )
                    )
                }
            }

            // Notify parent of successful uploads
            if (uploadedUrls.length > 0) {
                onUpload(uploadedUrls)
            }

            // Clear progress after delay
            setTimeout(() => {
                setUploadProgress([])
            }, 3000)
        } catch (error: any) {
            console.error("Upload error:", error)
            setUploadProgress((prev) =>
                prev.map((p) => ({
                    ...p,
                    status: "error",
                    error: error.message || "Failed to get authorization",
                }))
            )
        } finally {
            setUploading(false)
            if (inputRef.current) {
                inputRef.current.value = ""
            }
        }
    }, [folder, maxSizeMB, allowedTypes, onUpload])

    // Drag and drop handlers
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Uploaded images grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <Image
                                src={image}
                                alt={`Uploaded ${index + 1}`}
                                width={200}
                                height={200}
                                className="rounded-lg object-cover w-full h-40"
                            />
                            {onRemove && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center
          cursor-pointer transition-colors
          ${dragActive
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 hover:border-primary hover:bg-primary/5"
                    }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
                onClick={() => inputRef.current?.click()}
            >
                {uploading ? (
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                ) : (
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-600 text-center">
                    {uploading
                        ? "Uploading..."
                        : dragActive
                            ? "Drop images here"
                            : "Drag & drop or click to upload"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WebP, GIF up to {maxSizeMB}MB
                </span>
                <input
                    ref={inputRef}
                    type="file"
                    accept={allowedTypes.join(",")}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {/* Upload progress */}
            {uploadProgress.length > 0 && (
                <div className="space-y-2">
                    {uploadProgress.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                            {item.status === "uploading" && (
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            )}
                            {item.status === "success" && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            {item.status === "error" && (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.fileName}</p>
                                {item.status === "uploading" && (
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-primary h-1.5 rounded-full transition-all"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                )}
                                {item.status === "error" && item.error && (
                                    <p className="text-xs text-red-600">{item.error}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
