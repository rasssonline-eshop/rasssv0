"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { formatPKR } from "@/lib/utils"
import * as React from "react"
import { useCart } from "@/components/CartProvider"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const { addItem } = useCart()

    const [products, setProducts] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`)
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                }
            } catch (e) {
                console.error("Failed to fetch search results", e)
            } finally {
                setLoading(false)
            }
        }
        if (query) {
            fetchProducts()
        } else {
            setLoading(false)
            setProducts([])
        }
    }, [query])

    if (loading) {
        return <div className="min-h-screen container py-8">Loading search results...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                <p className="text-gray-600 mb-8">Showing results for "{query}" ({products.length} found)</p>

                {products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No products found matching "{query}".
                        <div className="mt-4">
                            <Link href="/"><Button>Back to Home</Button></Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link key={product.id} href={`/product/${product.slug}`}>
                                <Card className="bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 active:scale-95 active:ring-primary/40 h-full flex flex-col">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width:768px) 100vw, 25vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        {product.oldPrice && product.price < product.oldPrice && (
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-red-600">Save {Math.round((1 - product.price / product.oldPrice) * 100)}%</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 mb-3">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-lg text-primary">{formatPKR(product.price)}</span>
                                                {product.oldPrice && <span className="text-gray-500 line-through text-sm">{formatPKR(product.oldPrice)}</span>}
                                            </div>
                                            <Button size="icon" className="bg-primary hover:bg-primary/90"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    addItem({
                                                        id: product.slug, // Use slug as ID for cart consistency
                                                        slug: product.slug,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: product.image,
                                                    }, 1)
                                                }}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
