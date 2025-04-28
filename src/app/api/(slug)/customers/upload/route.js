import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
  }

  try {
    // Read the file as arrayBuffer and then parse it
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse the Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Convert the sheet to JSON, skip the first row as it seems like an extra header row
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 }) // Use header: 1 to skip the first row

    // Log the raw rows for debugging
    console.log('Parsed Rows:', rows)

    // If there's an extra header row, you can manually adjust the column names like this
    const cleanedRows = rows.slice(1).map((row) => ({
      clientId: (row[0] || '').toString().trim(), // Adjust column indices accordingly
      name: (row[1] || '').toString().trim(),
      address: (row[2] || '').toString().replace(/\n/g, ' ').trim(),
      city: (row[3] || '').toString().trim(),
      state: (row[4] || '').toString().trim(),
      country: (row[5] || '').toString().trim(),
      pincode: (row[6] || '').toString().trim(),
      contactPerson: (row[7] || '').toString().trim(),
      mobile: (row[8] || '').toString().replace(/\s/g, '').trim(),
      phone: (row[9] || '').toString().replace(/\s/g, '').trim(),
      email: (row[10] || '').toString().trim(),
      active: (row[11]?.toString().trim().toUpperCase() === 'Y') ? true : false,
      clientNameType: (row[12] || '').toString().trim(),
      trainer: (row[13] || '').toString().trim(),
    }))

    // Log the cleaned rows
    console.log('Cleaned Customer Data:', cleanedRows)

    // Filter valid customers ONLY (where name is not empty)
    const validCustomers = cleanedRows.filter((customer) => {
      return customer.name && customer.name.length > 0
    })

    // Log valid customers
    console.log('Valid Customers:', validCustomers)

    if (validCustomers.length === 0) {
      return NextResponse.json({ message: 'No valid customers found with proper name.' }, { status: 400 })
    }

    // Insert valid customers into the database
    await db.customer.createMany({
      data: validCustomers,
    })

    return NextResponse.json({ message: `${validCustomers.length} customers uploaded successfully!` }, { status: 201 })

  } catch (error) {
    // Log any errors for debugging
    console.error('Excel Upload Error:', error)
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 })
  }
}
