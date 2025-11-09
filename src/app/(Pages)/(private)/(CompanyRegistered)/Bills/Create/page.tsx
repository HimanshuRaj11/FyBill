'use client'
import BillingComponent from '@/Components/Main/CreateBill'
import PrintInvoiceFormate from '@/Components/Main/PrintInvoiceFormate';
import HeldInvoices from '@/Components/Other/HeldInvoices';
import PreLoader from '@/Components/Other/PreLoader';

import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/Components/ui/dialog';
import axios from 'axios';
import { Receipt } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

export default function Page() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [HoldInvoices, setHoldInvoices] = useState<any>(null);
    const [HoldInvoiceUpdate, setHoldInvoiceUpdate] = useState<any>(null)
    const [invoice, setInvoice] = useState<any>(null);
    const [showInvoice, setShowInvoice] = useState(false);

    const fetchProducts = async () => {
        setLoading(true)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
        const data = res.data;
        setProducts(data.products);

        setLoading(false)
    }

    useEffect(() => {
        fetchProducts();
    }, []);


    const FetchHoldInvoices = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/fetchHoldInvoices`)
            if (data.success) {
                setHoldInvoices(data.invoices);
            }
        } catch (error) {
            return
        }
    }
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrintDocument = (event: React.MouseEvent) => {
        event.preventDefault();
        if (invoiceRef.current) {
            const printContents = invoiceRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
        setShowInvoice(false);
    };

    useEffect(() => {
        FetchHoldInvoices()
    }, [])


    if (loading) {
        return <PreLoader />
    }
    return (
        <div className=''>
            {
                products?.length === 0 ? (
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
                    <>
                        <BillingComponent HoldInvoiceUpdate={HoldInvoiceUpdate} setHoldInvoices={setHoldInvoices} />
                    </>
                )
            }
            {
                HoldInvoices?.length > 0 && (
                    <HeldInvoices setShowInvoice={setShowInvoice} setInvoice={setInvoice} HoldInvoices={HoldInvoices} setHoldInvoiceUpdate={setHoldInvoiceUpdate} />
                )
            }
            {showInvoice && invoice && (
                <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                    <DialogContent className="max-w-4xl w-full">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Receipt className="h-6 w-6" />
                            Invoice #{invoice.invoiceNumber}
                        </DialogTitle>
                        <div ref={invoiceRef} className="max-h-[70vh] overflow-auto p-4 border rounded-lg">
                            <PrintInvoiceFormate invoice={invoice} />
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handlePrintDocument}
                                className="cursor-pointer px-8"
                                size="lg"
                            >
                                Print Invoice
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
