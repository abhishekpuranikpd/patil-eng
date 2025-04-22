'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'


import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CreateQuotation({session , inquiries}) {
  const router = useRouter()


  const [form, setForm] = useState({
    inquiryId: '',
    amount: '',
    notes: '',
  })

 
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salesUserId: session?.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to create quotation')
      alert('Quotation created successfully!')
      router.push('/quotations')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[#243460]">Create Quotation</CardTitle>
          <CardDescription className="text-center">Link a quotation to an inquiry and enter the quote details</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="inquiryId">Inquiry</Label>
              <Select onValueChange={(val) => setForm({ ...form, inquiryId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Inquiry" />
                </SelectTrigger>
                <SelectContent>
                  {inquiries.map((inq) => (
                    <SelectItem key={inq.id} value={inq.id} className="truncate">
                      {inq.customer.name} ({inq.source})
                      ({inq.customer.contact})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                name="amount"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                name="notes"
                placeholder="Additional notes or follow-up context"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-blue-700" disabled={loading}>
              {loading ? 'Saving...' : 'Create Quotation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
