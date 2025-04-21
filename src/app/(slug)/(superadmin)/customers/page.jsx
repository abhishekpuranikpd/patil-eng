import React from 'react'
import { db } from '@/app/lib/db'
import CustomerTable from './components/all-customers'

const CustomersPage = async () => {
    const customersdata = await db.customer.findMany({})
  return (
    <div><CustomerTable data={customersdata}/></div>
  )
}

export default CustomersPage