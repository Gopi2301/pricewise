import React from 'react'
import '../../../public/assets/icons/user.svg'
import { connectToDB } from '@/lib/mongoose'
type Props={
    params:{id:string}
}
const ProductDetails =  async({params:{id}}:Props) => {
  return (
    <div>
      {id}
    </div>
  )
}

export default ProductDetails
