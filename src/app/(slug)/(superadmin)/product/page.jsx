import React from 'react'
import CreateProductPage from './components/createproduct'
import { db } from '@/app/lib/db'

const ProductPage =async () => {

    const products = await db.product.findMany({})
  return (
    <div><CreateProductPage data={products}/></div>
  )
}

export default ProductPage