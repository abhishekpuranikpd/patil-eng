import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { customerId, source, message } = body

    if (!customerId || !source || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    const inquiry = await db.inquiry.create({
      data: {
        customerId,
        source,
        message,
        status: 'PENDING', // default
      },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
