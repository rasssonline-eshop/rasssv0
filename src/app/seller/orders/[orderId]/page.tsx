"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface OrderItem {
    productId: string
    name: string
    quantity: number
    price: number
    sellerId: string
}

interface OrderDetails {
    id: string
    orderNumber: string
    status: string
    total: number
    paymentMethod: string
    paymentStatus: string
    transactionId?: string
    items: OrderItem[]
    shippingAddress: any
    customerName: string
    customerEmail: string
    customerPhone: string
    note?: string
    placedAt: string
}

export default function SellerOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`/api/seller/orders/${params.orderId}`)
                if (res.ok) {
                    const data = await res.json()
                    setOrder(data)
                } else {
                    toast.error("Order not found")
                    router.push("/seller/orders")
                }
            } catch (error) {
                console.error("Failed to fetch order:", error)
                toast.error("Failed to load order")
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [params.orderId, router])

    const handleMarkAsShipped = async () => {
        if (!order) return

        setUpdating(true)
        try {
            const res = await fetch(`/api/seller/orders/${order.id}/ship`, {
                method: "POST"
            })

            if (res.ok) {
                toast.success("Order marked as shipped!")
                setOrder({ ...order, status: "shipped" })
            } else {
                const error = await res.json()
                toast.error(error.message || "Failed to update order")
            }
        } catch (error) {
            console.error("Failed to mark as shipped:", error)
            toast.error("Something went wrong")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Order not found</p>
                    <Link href="/seller/orders">
                        <Button className="mt-4">Back to Orders</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const sellerItems = order.items.filter(item => item.sellerId === session?.user?.id)
    const sellerRevenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const isPaid = order.paymentStatus === 'paid'
    const canShip = order.status === 'pending' || order.status === 'paid'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                        <p className="text-gray-600 mt-1">
                            Placed on {new Date(order.placedAt).toLocaleDateString()} at {new Date(order.placedAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <Badge className={`${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {order.status.toUpperCase()}
                </Badge>
            </div>

            {/* Payment Status Alert */}
            {isPaid && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl text-white">✓</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 text-lg">Payment Received by Admin</h3>
                                <p className="text-green-700 mt-1">
                                    Customer has paid <span className="font-bold">Rs {sellerRevenue.toLocaleString()}</span> for your products.
                                </p>
                                <p className="text-sm text-green-600 mt-2">
                                    Admin will send your payout after deducting commission once you ship the order.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ship Order Button */}
            {canShip && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-900">Ready to Ship?</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Mark this order as shipped once you've dispatched the products.
                                </p>
                            </div>
                            <Button 
                                onClick={handleMarkAsShipped}
                                disabled={updating}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Truck className="w-4 h-4 mr-2" />
                                {updating ? "Updating..." : "Mark as Shipped"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Your Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Your Items in This Order
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sellerItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Rs {item.price.toLocaleString()} each</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between pt-4 border-t-2">
                                    <p className="text-lg font-bold">Your Revenue</p>
                                    <p className="text-2xl font-bold text-primary">Rs {sellerRevenue.toLocaleString()}</p>
                                </div>
                                {isPaid && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> Admin will deduct commission and send your payout after you ship this order.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-gray-600">{order.shippingAddress?.line1}</p>
                                {order.shippingAddress?.line2 && (
                                    <p className="text-gray-600">{order.shippingAddress.line2}</p>
                                )}
                                <p className="text-gray-600">
                                    {order.shippingAddress?.area && `${order.shippingAddress.area}, `}
                                    {order.shippingAddress?.city}
                                    {order.shippingAddress?.postal && ` - ${order.shippingAddress.postal}`}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Instructions */}
                    {order.note && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Instructions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{order.note}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium">{order.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{order.customerEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium">{order.customerPhone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <Badge className={`mt-1 ${isPaid ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Status</p>
                                    <Badge className={`mt-1 ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </Badge>
                                </div>
                                {order.transactionId && (
                                    <div>
                                        <p className="text-sm text-gray-600">Transaction ID</p>
                                        <p className="font-mono text-sm mt-1 bg-gray-100 p-2 rounded">{order.transactionId}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Your Revenue</p>
                                    <p className="text-xl font-bold text-primary mt-1">Rs {sellerRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium">Order Placed</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.placedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {order.status === 'shipped' || order.status === 'delivered' ? (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium">Shipped</p>
                                            <p className="text-sm text-gray-600">Order dispatched</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-gray-400">Awaiting Shipment</p>
                                        </div>
                                    </div>
                                )}
                                {order.status === 'delivered' ? (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium">Delivered</p>
                                            <p className="text-sm text-gray-600">Order completed</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-gray-400">Pending Delivery</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
