import React from 'react'
import { db } from '@/app/lib/db'
import CreateInquiry from '../components/new-inq'

const page =async () => {
        const customersdata = await db.customer.findMany({})
    
  return (
    <div><CreateInquiry customers={customersdata}/></div>
  )
}

export default page