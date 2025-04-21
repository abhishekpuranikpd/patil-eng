'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Textarea } from '@/components/ui/textarea'

export default function CreateInquiry({customers}) {
  const router = useRouter()

  const [form, setForm] = useState({
    customerId: '',
    source: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to create inquiry')
      alert('Inquiry created successfully!')
      router.push('/inquiry')
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
          <CardTitle className="text-2xl text-center text-[#243460]">Create Inquiry</CardTitle>
          <CardDescription className="text-center">Link inquiry to a customer and select source</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="customerId">Customer</Label>
              <Select onValueChange={(val) => setForm({ ...form, customerId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} - {c.contact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Select onValueChange={(val) => setForm({ ...form, source: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inquiry source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                name="message"
                placeholder="Write details or notes here..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-blue-700" disabled={loading}>
              {loading ? 'Saving...' : 'Submit Inquiry'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
