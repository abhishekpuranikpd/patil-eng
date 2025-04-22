import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { inquiryId, salesUserId, amount, notes } = body

    if (!inquiryId || !salesUserId || !amount) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const quotation = await db.quotation.create({
      data: {
        inquiryId,
        salesUserId,
        amount: parseFloat(amount),
        notes,
        status: 'PENDING', // default status
      },
    })

    return NextResponse.json(quotation, { status: 201 })
  } catch (error) {
    console.error('Quotation creation error:', error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
