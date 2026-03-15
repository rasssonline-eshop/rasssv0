"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { SellerApprovalList } from "@/components/admin/SellerApprovalList"

export default function AdminSellersPage() {
  return (
    <div className="space-y-6">
      {/* Header with Analytics Link */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
          <p className="mt-2 text-gray-600">
            Manage seller applications, approvals, and account status
          </p>
        </div>
        <Link href="/admin/sellers/analytics">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </Button>
        </Link>
      </div>

      {/* Seller Approval List */}
      <SellerApprovalList />
    </div>
  )
}
