"use client"
import CreateBillPage from '@/Components/Main/CreateBill'
import Dashboard from '@/Components/Main/Dashboard'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { IoIosCloseCircle } from 'react-icons/io'
import { IoCreate } from 'react-icons/io5'

export default function page() {

    const [Billing, setBilling] = useState(false)

    return (
        <div className=''>
            <Dashboard />

        </div>
    )
}
