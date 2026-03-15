"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ImageUpload from "./ImageUpload"
import SingleImageUpload from "./SingleImageUpload"
import { Plus, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductVariant {
  id?: string
  name: string
  sku?: string
  price?: number
  stock: number
  attributes: Record<string, string>
  image?: string
  isDefault: boolean
}

interface Product {
  id?: string
  name: string
  description?: string
  price: number
  oldPrice?: number
  costPrice?: number
  category: string
  brand?: string
  sku?: string
  stock: number
  lowStockThreshold?: number
  image?: string
  images: string[]
  status: string
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  variants?: ProductVariant[]
}

interface ProductFormProps {
  product?: Product
  onSubmit: (data: Product) => Promise<void>
  onCancel: () => void
}

const categories = [
  "Fragrances",
  "Makeup",
  "Baby Care & Diapers",
  "Vitamins",
  "Skin Care",
  "Baby Accessories",
  "Hair Care",
  "Personal Care",
  "Infant Milk Powder",
  "Cereals",
  "Health Care",
]

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    oldPrice: undefined,
    costPrice: undefined,
    category: "",
    brand: "",
    sku: "",
    stock: 0,
    lowStockThreshold: 10,
    images: [],
    status: "active",
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    variants: [],
    ...product,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showVariants, setShowVariants] = useState(false)
  const [newAttribute, setNewAttribute] = useState({ key: "", value: "" })

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative"
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required"
    }

    if (formData.oldPrice && formData.oldPrice <= formData.price) {
      newErrors.oldPrice = "Old price must be greater than current price"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSubmitting(true)

    try {
      // Set primary image from images array
      const submitData = {
        ...formData,
        image: formData.images[0],
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Variant Management Functions
  const addVariant = () => {
    const newVariant: ProductVariant = {
      name: "",
      sku: "",
      price: undefined,
      stock: 0,
      attributes: {},
      image: "",
      isDefault: (formData.variants?.length || 0) === 0,
    }
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant]
    }))
    setShowVariants(true)
  }

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index)
    }))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      )
    }))
  }

  const addAttributeToVariant = (variantIndex: number, key: string, value: string) => {
    if (!key || !value) return
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map((v, i) => 
        i === variantIndex 
          ? { ...v, attributes: { ...v.attributes, [key]: value } }
          : v
      )
    }))
  }

  const removeAttributeFromVariant = (variantIndex: number, key: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map((v, i) => {
        if (i === variantIndex) {
          const newAttributes = { ...v.attributes }
          delete newAttributes[key]
          return { ...v, attributes: newAttributes }
        }
        return v
      })
    }))
  }

  const setDefaultVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map((v, i) => ({
        ...v,
        isDefault: i === index
      }))
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter product name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter product description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              placeholder="Enter brand name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="Enter SKU"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (PKR) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.price ? "border-red-500" : ""}`}
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="oldPrice">Old Price (PKR)</Label>
            <Input
              id="oldPrice"
              type="number"
              step="0.01"
              value={formData.oldPrice || ""}
              onChange={(e) => handleChange("oldPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0.00"
              className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.oldPrice ? "border-red-500" : ""}`}
            />
            {errors.oldPrice && <p className="text-sm text-red-600 mt-1">{errors.oldPrice}</p>}
          </div>

          <div>
            <Label htmlFor="costPrice">Cost Price (PKR)</Label>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice || ""}
              onChange={(e) => handleChange("costPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0.00"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
              placeholder="0"
              className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.stock ? "border-red-500" : ""}`}
            />
            {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
          </div>

          <div>
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => handleChange("lowStockThreshold", parseInt(e.target.value) || 10)}
              placeholder="10"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Images *</h3>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => handleChange("images", images)}
          maxImages={5}
        />
        {errors.images && <p className="text-sm text-red-600 mt-1">{errors.images}</p>}
      </div>

      {/* Product Variants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Product Variants (Optional)</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </Button>
        </div>

        {formData.variants && formData.variants.length > 0 && (
          <div className="space-y-4">
            {formData.variants.map((variant, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Variant {index + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={variant.isDefault ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDefaultVariant(index)}
                      >
                        {variant.isDefault ? "Default" : "Set as Default"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Variant Name *</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        placeholder="e.g., Large - Red"
                      />
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input
                        value={variant.sku || ""}
                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                        placeholder="Variant SKU"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Price (PKR) - Optional</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price || ""}
                        onChange={(e) => updateVariant(index, "price", e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="Leave empty to use product price"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">If empty, uses product price</p>
                    </div>
                    <div>
                      <Label>Stock *</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Attributes */}
                  <div>
                    <Label>Attributes</Label>
                    <div className="space-y-2 mt-2">
                      {Object.entries(variant.attributes).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{key}:</span>
                          <span className="text-sm text-gray-600">{value}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttributeFromVariant(index, key)}
                            className="ml-auto h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Attribute (e.g., Size)"
                          value={newAttribute.key}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, key: e.target.value }))}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value (e.g., Large)"
                          value={newAttribute.value}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newAttribute.key && newAttribute.value) {
                              addAttributeToVariant(index, newAttribute.key, newAttribute.value)
                              setNewAttribute({ key: "", value: "" })
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Variant Image */}
                  <div>
                    <Label>Variant Image (Optional)</Label>
                    <SingleImageUpload
                      image={variant.image}
                      onImageChange={(imageUrl) => updateVariant(index, "image", imageUrl)}
                      label="Upload"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {(!formData.variants || formData.variants.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500 mb-3">No variants added yet</p>
            <p className="text-xs text-gray-400 mb-4">Add variants if your product comes in different sizes, colors, or other options</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Variant
            </Button>
          </div>
        )}
      </div>

      {/* SEO (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">SEO (Optional)</h3>

        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => handleChange("metaTitle", e.target.value)}
            placeholder="Enter meta title"
          />
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => handleChange("metaDescription", e.target.value)}
            placeholder="Enter meta description"
            rows={3}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : product?.id ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
