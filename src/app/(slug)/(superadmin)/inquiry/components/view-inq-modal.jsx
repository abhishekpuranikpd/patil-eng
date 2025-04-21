'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export default function ViewInquiryModal({ inquiry }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p><strong>Customer:</strong> {inquiry.customer.name}</p>
          <p><strong>Contact:</strong> {inquiry.customer.contact}</p>
          <p><strong>Source:</strong> {inquiry.source}</p>
          <p><strong>Status:</strong> {inquiry.status}</p>
          <p><strong>Message:</strong><br />{inquiry.message}</p>
          <p><strong>Created At:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
