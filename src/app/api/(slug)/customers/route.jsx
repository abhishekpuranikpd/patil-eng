import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()

    const {
      clientId,
      name,
      address,
      city,
      state,
      country,
      pincode,
      contactPerson,
      mobile,
      phone,
      email,
      active = true, // default to true if not provided
      clientNameType,
      salesPersonId,
      trainer,
    } = body

    // Basic required field validation
    if (!name || !address) {
      return NextResponse.json({ message: 'Name and Address are required' }, { status: 400 })
    }

    const customer = await db.customer.create({
      data: {
        clientId,
        name,
        address,
        city,
        state,
        country,
        pincode,
        contactPerson,
        mobile,
        phone,
        email,
        active,
        clientNameType,
        trainer,
        // salesPersonId must be either valid ObjectId string or null
        salesPersonId: salesPersonId || null,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
