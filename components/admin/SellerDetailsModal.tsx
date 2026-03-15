"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Seller = {
  id: string
  name: string | null
  email: string
  phone: string | null
  sellerStatus: string | null
  createdAt: string
}

type SellerDetailsModalProps = {
  seller: Seller
  open: boolean
  onClose: () => void
  onApprove: () => Promise<void>
  onReject: (reason?: string) => Promise<void>
}

export function SellerDetailsModal({
  seller,
  open,
  onClose,
  onApprove,
  onReject,
}: SellerDetailsModalProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleApprove = async () => {
    try {
      setIsApproving(true)
      await onApprove()
      onClose()
    } catch (err) {
      console.error("Error approving seller:", err)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    try {
      setIsRejecting(true)
      await onReject(rejectionReason)
      setRejectionReason("")
      setShowRejectForm(false)
      onClose()
    } catch (err) {
      console.error("Error rejecting seller:", err)
    } finally {
      setIsRejecting(false)
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Seller Details</DialogTitle>
          <DialogDescription>
            Review seller registration information and manage approval status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Name</Label>
            <p className="text-base">{seller.name || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
            <p className="text-base">{seller.email}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
            <p className="text-base">{seller.phone || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            <div>{getStatusBadge(seller.sellerStatus)}</div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Registration Date
            </Label>
            <p className="text-base">
              {new Date(seller.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {showRejectForm && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a reason for rejecting this seller application..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {seller.sellerStatus === "pending" && !showRejectForm && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(true)}
                className="w-full sm:w-auto"
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                {isApproving ? "Approving..." : "Approve Seller"}
              </Button>
            </>
          )}

          {showRejectForm && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectForm(false)
                  setRejectionReason("")
                }}
                disabled={isRejecting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason.trim()}
                className="w-full sm:w-auto"
              >
                {isRejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </>
          )}

          {seller.sellerStatus !== "pending" && (
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
