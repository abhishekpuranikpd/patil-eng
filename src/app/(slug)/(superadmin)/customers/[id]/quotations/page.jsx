import React from 'react'
import CreateQuotationForm from '../../components/newquote'

const QuotationsPage = async ({params}) => {
    const customerId = params.id
  return (
    <div><CreateQuotationForm customerId={customerId}/></div>
  )
}

export default QuotationsPage