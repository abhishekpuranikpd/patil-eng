'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function CreateCustomerPage({salesPersonsdata}) {
  const router = useRouter()
  const [mode, setMode] = useState('manual') // manual or excel
  const [form, setForm] = useState({
    clientId: '',
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    contactPerson: '',
    mobile: '',
    phone: '',
    email: '',
    active: true,
    clientNameType: '',
    salesPersonId: '',
    trainer: '',
  })
  const [salesPersons, setSalesPersons] = useState(salesPersonsdata)
  const [loading, setLoading] = useState(false)

 

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmitManual = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to create customer')
      alert('Customer created successfully!')
      router.push('/customers')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      const res = await fetch('/api/customers/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to upload customers')
      alert('Customers imported successfully!')
      router.push('/customers')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-6 py-8">
      <Card className="w-full max-w-4xl shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[#243460]">Create Customer</CardTitle>
          <CardDescription className="text-center">Choose manual entry or bulk upload via Excel</CardDescription>
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              onClick={() => setMode('manual')}
            >
              ➕ Manual Entry
            </Button>
            <Button
              variant={mode === 'excel' ? 'default' : 'outline'}
              onClick={() => setMode('excel')}
            >
              📄 Upload Excel
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {mode === 'manual' ? (
            <form onSubmit={handleSubmitManual} className="space-y-4">
              {/* Manual Form Start */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Client ID</Label>
                  <Input name="clientId" value={form.clientId} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input name="name" value={form.name} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea name="address" value={form.address} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label>City</Label>
                  <Input name="city" value={form.city} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>State</Label>
                  <Input name="state" value={form.state} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input name="country" value={form.country} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Pin Code</Label>
                  <Input name="pincode" value={form.pincode} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input name="contactPerson" value={form.contactPerson} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input name="mobile" value={form.mobile} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input name="phone" value={form.phone} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" value={form.email} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Client Name Type</Label>
                  <Input name="clientNameType" value={form.clientNameType} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Trainer</Label>
                  <Input name="trainer" value={form.trainer} onChange={handleFormChange} />
                </div>
                <div>
                  <Label>Sales Person</Label>
                  <Select onValueChange={(val) => setForm({ ...form, salesPersonId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sales Person" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesPersons.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id}>
                          {sp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-blue-700" disabled={loading}>
                {loading ? 'Saving...' : 'Create Customer'}
              </Button>
            </form>
          ) : (
            // Excel Upload Section
            <div className="flex flex-col items-center space-y-4">
              <Label htmlFor="upload" className="text-lg">Upload Excel File (.xlsx)</Label>
              <Input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
              <p className="text-sm text-muted-foreground">Excel should match the correct format (Client Name, Mobile, etc)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
