import React from 'react'
import CreateQuotation from './components/new-quotation'
import { getCurrentUser } from '@/app/lib/session'
import { db } from '@/app/lib/db'

const quotationsPage = async() => {
    const session = await getCurrentUser()
    const inquiries = await db.inquiry.findMany({
        where : {status : "PENDING"},include : {customer :true}
    })
  return (
    <div><CreateQuotation session={session} customerId={inquiries.customerId}/></div>
  )
}

export default quotationsPage