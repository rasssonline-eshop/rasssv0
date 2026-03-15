"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, User, MapPin, CreditCard, FileText } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
    id: string
    orderNumber: string
    status: string
    total: number
    paymentMethod: string
    paymentStatus: string
    transactionId?: string
    items: any[]
    shippingAddress: any
    customerName: string
    customerEmail: string
    customerPhone: string
    note?: string
    placedAt: string
    createdAt: string
}

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`/api/admin/orders/${params.orderId}`)
                if (res.ok) {
                    const data = await res.json()
                    setOrder(data)
                }
            } catch (error) {
                console.error("Failed to fetch order:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [params.orderId])

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
                    <Link href="/admin/orders">
                        <Button className="mt-4">Back to Orders</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const isOnlinePayment = order.paymentMethod !== 'cod'
    const isPaid = order.paymentStatus === 'paid'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
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
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {order.status.toUpperCase()}
                </Badge>
            </div>

            {/* Payment Confirmation Alert */}
            {isOnlinePayment && isPaid && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 text-lg">Payment Received</h3>
                                <p className="text-green-700 mt-1">
                                    Customer has paid <span className="font-bold">Rs {order.total.toLocaleString()}</span> via online payment.
                                </p>
                                {order.transactionId && (
                                    <p className="text-green-700 mt-2">
                                        <span className="font-medium">Transaction ID:</span> {order.transactionId}
                                    </p>
                                )}
                                <p className="text-sm text-green-600 mt-3">
                                    ℹ️ This payment has been received in your configured payment account. You can now process this order and distribute payouts to sellers.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item: any, index: number) => (
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
                                    <p className="text-lg font-bold">Total</p>
                                    <p className="text-2xl font-bold text-primary">Rs {order.total.toLocaleString()}</p>
                                </div>
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

                    {/* Order Notes */}
                    {order.note && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Delivery Instructions
                                </CardTitle>
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
                                    <Badge className={`mt-1 ${isOnlinePayment ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
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
                                    <p className="text-sm text-gray-600">Amount</p>
                                    <p className="text-xl font-bold text-primary mt-1">Rs {order.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {isOnlinePayment && isPaid && (
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-3">Next Steps</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>✓ Payment received in your account</p>
                                    <p>• Process and ship the order</p>
                                    <p>• Distribute payouts to sellers</p>
                                </div>
                                <Link href="/admin/payouts">
                                    <Button className="w-full mt-4">
                                        Go to Payouts
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
