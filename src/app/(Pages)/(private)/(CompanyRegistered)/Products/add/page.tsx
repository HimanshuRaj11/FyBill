'use client'
import AddProduct from '@/Components/Main/AddProduct'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/Components/ui/button'
import { FiArrowLeft } from 'react-icons/fi'
export default function page() {
    const router = useRouter()

    return (
        <div>
            <div className="max-w-2xl mx-auto p-6">
                <Button
                    onClick={() => router.push('/Products')}
                    className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center"
                >
                    <FiArrowLeft className="w-5 h-5 mr-2" />
                    Back

                </Button>
            </div>
            <AddProduct />
        </div>
    )
}
