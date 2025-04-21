import React from 'react'
import CreateInquiry from './components/new-inq'
import { db } from '@/app/lib/db'
import InquiryTable from './components/all-inq'

const page =async () => {
        const inqdata = await db.inquiry.findMany({
            include : {customer :true}
        })
    
  return (
    <div><InquiryTable data={inqdata}/></div>
  )
}

export default page