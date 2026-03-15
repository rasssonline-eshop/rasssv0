"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateImageFormat, validateImageSize, uploadProductImages } from "@/lib/imageUpload"

interface SingleImageUploadProps {
  image?: string
  onImageChange: (image: string) => void
  label?: string
}

export default function SingleImageUpload({ image, onImageChange, label = "Upload Image" }: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploading(true)

    try {
      // Validate format
      const formatValidation = validateImageFormat(file)
      if (!formatValidation.valid) {
        alert(formatValidation.error)
        setUploading(false)
        return
      }

      // Validate size
      const sizeValidation = validateImageSize(file)
      if (!sizeValidation.valid) {
        alert(sizeValidation.error)
        setUploading(false)
        return
      }

      // Upload image using utility function
      const uploadResult = await uploadProductImages([file])

      if (!uploadResult.success) {
        alert(uploadResult.error || 'Failed to upload image')
        return
      }

      // Set the uploaded image URL
      if (uploadResult.urls && uploadResult.urls.length > 0) {
        onImageChange(uploadResult.urls[0])
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    onImageChange('')
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      {image ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
          <Image
            src={image}
            alt="Variant image"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
              <span className="text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Optional: Upload a specific image for this variant (Max 5MB)
      </p>
    </div>
  )
}
