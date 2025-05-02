import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Parse as array of objects
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    const cleanProducts = rows
      .map((row) => ({
        title: (row['Title'] || '').toString().trim(),
      }))
      .filter((p) => p.title.length > 0) // remove empty rows

    if (cleanProducts.length === 0) {
      return NextResponse.json({ error: 'No valid products found in file.' }, { status: 400 })
    }

    // Get latest "no" value
    const lastProduct = await db.product.findFirst({
      orderBy: { no: 'desc' },
    })

    let currentNo = lastProduct?.no || 0

    const productsToInsert = cleanProducts.map((product) => ({
      title: product.title,
      no: ++currentNo,
    }))

    await db.product.createMany({
      data: productsToInsert,
      skipDuplicates: true,
    })

    return NextResponse.json({ message: `${productsToInsert.length} products uploaded successfully.` }, { status: 201 })
  } catch (error) {
    console.error('Product upload error:', error)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}
