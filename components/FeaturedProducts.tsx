"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/CartProvider"
import { toast } from "sonner"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    image?: string
    category: string
    status: string
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { addItem } = useCart()

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const res = await fetch("/api/products?featured=true&limit=8")
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                }
            } catch (error) {
                console.error("Failed to fetch featured products")
            } finally {
                setLoading(false)
            }
        }
        fetchFeatured()
    }, [])

    if (loading) return null
    if (products.length === 0) return null

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
                    <Link href="/category/all" className="text-primary hover:underline font-medium">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                            <Link href={`/product/${product.slug || product.id}`} className="block flex-1">
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Badge className="bg-white text-gray-900 hover:bg-white">Hot</Badge>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-bold text-xl">Rs {product.price.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Link>

                            <CardFooter className="p-4 pt-0 mt-auto">
                                <Button
                                    className="w-full gap-2"
                                    onClick={(e) => {
                                        e.preventDefault() // Prevent navigation if button is clicked (though it's outside link, being safe)
                                        addItem({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.image,
                                            slug: product.slug
                                        })
                                        toast.success("Added to cart")
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
