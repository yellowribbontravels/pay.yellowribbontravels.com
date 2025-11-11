import PaymentForm from '@/components/PaymentForm'
import PaymentTable from '@/components/PaymentTable'
import React from 'react'
import { Divider } from '@heroui/divider'
const page = () => {
  return (
    <div
    className='flex flex-col items-center justify-center w-full gap-x-3'
    >
      <PaymentTable />
      <Divider className='mt-3 mb-3' />
      <PaymentForm />
    </div>
  )
}

export default page
