import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { title } = body

    // 🔒 Input validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string.' },
        { status: 400 }
      )
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be under 100 characters.' },
        { status: 400 }
      )
    }

    // 🧠 Get latest product no
    const lastProduct = await db.product.findFirst({
      orderBy: { no: 'desc' },
    })

    const nextNo = lastProduct ? lastProduct.no + 1 : 1

    // ✅ Create product
    const product = await db.product.create({
      data: {
        no: nextNo,
        title: title.trim(),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product API Error:', error)

    // Prisma duplicate entry or validation error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this number already exists.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong while creating the product.' },
      { status: 500 }
    )
  }
}
