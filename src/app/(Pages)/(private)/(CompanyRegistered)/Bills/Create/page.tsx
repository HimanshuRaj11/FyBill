'use client'
import BillingComponent from '@/Components/Main/CreateBill'
import WebLoader from '@/Components/Other/loader';
import { Button } from '@/Components/ui/button'
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function page() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchProducts = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
        const data = res.data;
        setProducts(data.products);
    }
    useEffect(() => {
        setLoading(true);
        fetchProducts();
        setLoading(false);
    }, []);

    if (loading) {
        return <WebLoader />
    }

    return (
        <div className=''>
            {
                products.length === 0 ? (
                    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold text-gray-900">No Products Found</h2>
                                <p className="text-gray-600">Get started by adding your first product</p>
                            </div>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                                <Link href="/Products/add" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New Product
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <BillingComponent />
                )
            }
        </div>
    )
}
