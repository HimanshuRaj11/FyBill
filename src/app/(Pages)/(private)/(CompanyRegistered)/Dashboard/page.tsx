"use client"
import Dashboard from '@/Components/Main/Dashboard'
import axios from 'axios'
const base_url = process.env.NEXT_PUBLIC_BASE_URL

export default function page() {

    return (
        <div className=''>
            <Dashboard />
        </div>
    )
}
