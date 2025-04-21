import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, contact, address } = body

    if (!name || !contact || !address) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    const customer = await db.customer.create({
      data: {
        name,
        contact,
        address
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
