"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPKR } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  oldPrice?: number
  stock: number
  status: string
  image?: string
  category: string
  brand?: string
  sku?: string
  createdAt: string
  updatedAt: string
}

interface ProductListProps {
  products: Product[]
  onEdit: (productId: string) => void
  onDelete: (productId: string) => void
  loading?: boolean
}

export default function ProductList({ products, onEdit, onDelete, loading }: ProductListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No products yet</p>
        <p className="text-gray-400 text-sm mt-2">Create your first product to get started</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.sku && (
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-700">{product.category}</p>
                {product.brand && (
                  <p className="text-xs text-gray-500">{product.brand}</p>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{formatPKR(product.price)}</p>
                  {product.oldPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPKR(product.oldPrice)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-900'}`}>
                  {product.stock}
                </p>
              </TableCell>
              <TableCell>
                <Badge
                  variant={product.status === 'active' ? 'default' : 'secondary'}
                  className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {product.status === 'active' ? (
                    <><Eye className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><EyeOff className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
