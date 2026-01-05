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

import { Skeleton } from "@/components/ui/skeleton"

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

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-[300px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-5 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (products.length === 0) return null

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <span className="text-primary font-medium tracking-wider uppercase text-sm">Curated for you</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Featured Collection</h2>
                    </div>
                    <Link href="/category/all" className="group flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
                        View All
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Card key={product.id} className="group border-0 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-gray-200 transition-all duration-500 overflow-hidden bg-white h-full flex flex-col">
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                                        <span className="text-sm">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <Badge className="bg-white/90 text-gray-900 border-0 shadow-sm backdrop-blur-sm hover:bg-white">
                                        Featured
                                    </Badge>
                                </div>
                                {/* Quick Add Button Overlay */}
                                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                                    <Button
                                        className="w-full gap-2 shadow-lg bg-white text-gray-900 hover:bg-gray-50 border-0"
                                        onClick={() => {
                                            addItem({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.image,
                                                slug: product.slug
                                            })
                                            toast.success("Added to cart", {
                                                style: { background: '#10b981', color: 'white' }
                                            })
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Quick Add
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-5 flex-1 flex flex-col pt-6">
                                <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-2">{product.category}</p>
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 min-h-[3.5rem] group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <div className="mt-auto flex items-baseline gap-2">
                                    <span className="font-bold text-xl text-primary">Rs {product.price.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
