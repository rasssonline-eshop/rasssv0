"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/components/I18nProvider"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Seller = {
    id: string
    name: string
    phone: string
    email: string
    status: "pending" | "approved" | "rejected"
    appliedDate: string
    rejectionReason?: string
}

export default function AdminSellersPage() {
    const router = useRouter()
    const { t } = useI18n()
    const [sellers, setSellers] = useState<Seller[]>([])
    const [rejectionReason, setRejectionReason] = useState("")
    const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

    useEffect(() => {
        // Load sellers from localStorage
        try {
            const saved = localStorage.getItem("sellers")
            if (saved) {
                setSellers(JSON.parse(saved))
            } else {
                // Initialize with some demo sellers
                const demoSellers: Seller[] = [
                    {
                        id: "1",
                        name: "Ahmed Khan",
                        phone: "+92 300 1234567",
                        email: "ahmed@example.com",
                        status: "pending",
                        appliedDate: new Date().toISOString(),
                    },
                    {
                        id: "2",
                        name: "Fatima Ali",
                        phone: "+92 301 7654321",
                        email: "fatima@example.com",
                        status: "approved",
                        appliedDate: new Date(Date.now() - 86400000).toISOString(),
                    },
                ]
                setSellers(demoSellers)
                localStorage.setItem("sellers", JSON.stringify(demoSellers))
            }
        } catch { }
    }, [])

    const saveSellers = (updatedSellers: Seller[]) => {
        setSellers(updatedSellers)
        try {
            localStorage.setItem("sellers", JSON.stringify(updatedSellers))
        } catch { }
    }

    const approveSeller = (id: string) => {
        const updated = sellers.map((s) =>
            s.id === id ? { ...s, status: "approved" as const, rejectionReason: undefined } : s
        )
        saveSellers(updated)

        // Update user session if they're logged in
        try {
            const authUser = localStorage.getItem("auth_user")
            if (authUser) {
                const user = JSON.parse(authUser)
                if (user.id === id) {
                    user.sellerStatus = "approved"
                    delete user.rejectionReason
                    localStorage.setItem("auth_user", JSON.stringify(user))
                }
            }
        } catch { }
    }

    const rejectSeller = (id: string, reason: string) => {
        const updated = sellers.map((s) =>
            s.id === id ? { ...s, status: "rejected" as const, rejectionReason: reason } : s
        )
        saveSellers(updated)

        // Update user session if they're logged in
        try {
            const authUser = localStorage.getItem("auth_user")
            if (authUser) {
                const user = JSON.parse(authUser)
                if (user.id === id) {
                    user.sellerStatus = "rejected"
                    user.rejectionReason = reason
                    localStorage.setItem("auth_user", JSON.stringify(user))
                }
            }
        } catch { }

        setSelectedSeller(null)
        setRejectionReason("")
    }

    const getStatusBadge = (status: Seller["status"]) => {
        switch (status) {
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />{t("seller.pending")}</Badge>
            case "approved":
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{t("seller.approved")}</Badge>
            case "rejected":
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t("seller.rejected")}</Badge>
        }
    }

    const filteredSellers = sellers.filter((s) => filter === "all" || s.status === filter)

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{t("admin.sellers")}</CardTitle>
                        <CardDescription>Manage seller applications and approvals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="all">{t("admin.allSellers")}</TabsTrigger>
                                <TabsTrigger value="pending">{t("admin.pendingSellers")}</TabsTrigger>
                                <TabsTrigger value="approved">{t("admin.approvedSellers")}</TabsTrigger>
                                <TabsTrigger value="rejected">{t("admin.rejectedSellers")}</TabsTrigger>
                            </TabsList>

                            <TabsContent value={filter} className="mt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Applied Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSellers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                    No sellers found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredSellers.map((seller) => (
                                                <TableRow key={seller.id}>
                                                    <TableCell className="font-medium">{seller.name}</TableCell>
                                                    <TableCell>{seller.phone}</TableCell>
                                                    <TableCell>{seller.email}</TableCell>
                                                    <TableCell>{getStatusBadge(seller.status)}</TableCell>
                                                    <TableCell>{new Date(seller.appliedDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {seller.status === "pending" && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => approveSeller(seller.id)}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        {t("admin.approve")}
                                                                    </Button>
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => setSelectedSeller(seller.id)}
                                                                            >
                                                                                {t("admin.reject")}
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Reject Seller</DialogTitle>
                                                                                <DialogDescription>
                                                                                    Please provide a reason for rejection
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                            <div className="space-y-4">
                                                                                <div>
                                                                                    <Label htmlFor="reason">Reason</Label>
                                                                                    <Input
                                                                                        id="reason"
                                                                                        value={rejectionReason}
                                                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                                                        placeholder="Enter rejection reason"
                                                                                    />
                                                                                </div>
                                                                                <Button
                                                                                    onClick={() => selectedSeller && rejectSeller(selectedSeller, rejectionReason)}
                                                                                    disabled={!rejectionReason}
                                                                                    className="w-full"
                                                                                >
                                                                                    Confirm Rejection
                                                                                </Button>
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </>
                                                            )}
                                                            {seller.status === "rejected" && seller.rejectionReason && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    Reason: {seller.rejectionReason}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
