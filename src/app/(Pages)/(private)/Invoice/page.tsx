"use client"
// import InvoiceDisplay from '@/Components/Main/Invoice'
import React, { useEffect, useState } from 'react'
import { InvoiceButton } from '@/Components/ui/invoice-button'
import axios from 'axios'
import moment from 'moment';
import Link from 'next/link';

export default function pages() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/fetch`)
            if (data.success) {
                setInvoices(data.invoices);
            }
            setIsLoading(false);
        }
        fetchInvoices();
    }, [])
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className='p-4 '>
            <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                    <h1 className='text-4xl font-bold'>Overview</h1>
                    <InvoiceButton companyId="123" className="px-6" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 mt-4">
                    <div className="flex flex-col items-center justify-center h-24 rounded-lg bg-white shadow-sm dark:bg-gray-800 p-4 transition-all hover:shadow-md">
                        <p className="text-gray-500 text-sm">Total Income</p>
                        <h2 className="text-2xl font-bold mt-1">$4,997</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center h-24 rounded-lg bg-white shadow-sm dark:bg-gray-800 p-4 transition-all hover:shadow-md">
                        <p className="text-gray-500 text-sm">Pending Bills</p>
                        <h2 className="text-2xl font-bold mt-1">3</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center h-24 rounded-lg bg-white shadow-sm dark:bg-gray-800 p-4 transition-all hover:shadow-md">
                        <p className="text-gray-500 text-sm">Total Expenses</p>
                        <h2 className="text-2xl font-bold mt-1">$1,234</h2>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Search invoices..."
                        className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-4">Invoice Id</th>
                            <th scope="col" className="px-6 py-4">Client Name</th>
                            <th scope="col" className="px-6 py-4">Date</th>
                            <th scope="col" className="px-6 py-4">Total Price</th>
                            <th scope="col" className="px-6 py-4">Payment Mode</th>
                            <th scope="col" className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoices.map((invoice) => (
                                <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {invoice.invoiceId}
                                    </th>
                                    <td className="px-6 py-4">{invoice.clientName}</td>
                                    <td className="px-6 py-4">{moment(invoice.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className="px-6 py-4 font-medium">${invoice.grandTotal}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {invoice.paymentMode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/Invoice/${invoice.invoiceId}`} className="text-blue-600 hover:text-blue-800 font-medium">View</Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
