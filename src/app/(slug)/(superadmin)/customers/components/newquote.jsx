'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function CreateQuotationForm({ customerId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    subject: 'QUOTATION FOR KSB MAKE PUMPS',
    contactPerson: '',
    fluidHandled: '',
    temperature: '',
    specificGravity: '',
    viscosity: '',
    capacity: '',
    totalHead: '',
    npsha: '',
    pumpType: '',
    bearingBracket: '',
    npshr: '',
    speedRpm: '',
    efficiency: '',
    powerAbsorbed: '',
    minFlow: '',
    maxFlow: '',
    shutoffHead: '',
    maxBkw: '',
    impellerType: '',
    impellerDia: '',
    impellerDiaRange: '',
    suctionNozzleSize: '',
    dischargeNozzleSize: '',
    pipeSizes: '',
    flangeStandardSuc: '',
    flangeStandardDis: '',
    casingMaterial: '',
    shaftMaterial: '',
    impellerMaterial: '',
    sleeveMaterial: '',
    sealMake: '',
    sealSize: '',
    sealTypeCode: '',
    motorMake: '',
    motorRatingFrame: '',
    pumpPrice: '',
    baseFramePrice: '',
    couplingPrice: '',
    motorPrice: '',
    quantity: '',
    taxes: 'GST WILL BE EXTRA',
    paymentTerms: '30% ADVANCE BALANCE AGAINST PROFORMA INVOICE',
    deliveryTerms: 'F.O.R. SPINE ROAD',
    deliveryPeriod: 'TWO WEEKS FROM THE DATE OF RECEIPT OF YOUR P.O.',
    transportation: "TO YOUR A/C",
    notes: `PLEASE NOTE QUOTED PUMPS ARE CENTRIFUGAL HORIZONTAL BACKPULL OUT END SUCTION PUMPS.\n\nPLEASE NOTE MOTOR NOT IN OUR SCOPE OF SUPPLY.\n\nSCOPE OF SUPPLY:\n1) PUMP\n2) BASEFRAME\n3) COUPLING & GUARD\n4) FOUNDATION BOLTS\n5) MOTOR\n\nPERFORMANCE TESTING & THIRD PARTY WITNESS WILL NOT BE POSSIBLE.\n\nWARRANTY / GUARANTEE NOT APPLICABLE OUTSIDE INDIAN BORDER.\n\nSCOPE LIMITED TO ONLY SUPPLY PORTION. SITE ERECTION COMMISSIONING NOT INCLUDED IN OUR OFFER.\n\nPLEASE SEND US YOUR TECHNICAL CONFIRMATION.`,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, customerId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Quotation creation failed')
      alert('Quotation created successfully')
      router.push('/quotations') // or refresh current list
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Create Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full">
              <Label>Subject</Label>
              <Input name="subject" value={form.subject} onChange={handleChange} required />
            </div>

            <div className="col-span-full">
              <Label>Contact Person</Label>
              <Input name="contactPerson" value={form.contactPerson} onChange={handleChange} />
            </div>

            {/* Operating Data */}
            <div className="col-span-full font-semibold mt-4">Operating Data</div>
            {['fluidHandled', 'temperature', 'specificGravity', 'viscosity', 'capacity', 'totalHead', 'npsha'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* Pump Section */}
            <div className="col-span-full font-semibold mt-4">Pump Details</div>
            {['pumpType', 'bearingBracket', 'npshr', 'speedRpm', 'efficiency', 'powerAbsorbed', 'minFlow', 'maxFlow', 'shutoffHead', 'maxBkw'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* Impeller */}
            <div className="col-span-full font-semibold mt-4">Impeller Details</div>
            {['impellerType', 'impellerDia', 'impellerDiaRange', 'suctionNozzleSize', 'dischargeNozzleSize', 'pipeSizes', 'flangeStandardSuc', 'flangeStandardDis'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* MOC */}
            <div className="col-span-full font-semibold mt-4">Material of Construction</div>
            {['casingMaterial', 'shaftMaterial', 'impellerMaterial', 'sleeveMaterial'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* Shaft Seal */}
            <div className="col-span-full font-semibold mt-4">Shaft Sealing Detail</div>
            {['sealMake', 'sealSize', 'sealTypeCode'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* Motor */}
            <div className="col-span-full font-semibold mt-4">Motor Data</div>
            {['motorMake', 'motorRatingFrame'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* Pricing */}
            <div className="col-span-full font-semibold mt-4">Pricing</div>
            {['pumpPrice', 'baseFramePrice', 'couplingPrice', 'motorPrice', 'quantity'].map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input type="number" name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            {/* Terms */}
            <div className="col-span-full font-semibold mt-4">Terms & Notes</div>
            {['taxes', 'paymentTerms', 'deliveryTerms', 'deliveryPeriod', 'transportation'].map((field) => (
              <div key={field} className="col-span-full">
                <Label>{field}</Label>
                <Input name={field} value={form[field]} onChange={handleChange} />
              </div>
            ))}

            <div className="col-span-full">
              <Label>Notes</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} rows={6} />
            </div>

            <div className="col-span-full">
              <Button type="submit" disabled={loading} className="w-full bg-primary">
                {loading ? 'Saving...' : 'Create Quotation'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
