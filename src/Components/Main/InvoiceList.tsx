import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux';

export default function InvoiceList({ filteredInvoices, searchQuery, Company }: { filteredInvoices: any[], searchQuery: string, Company: any }) {
    const { User } = useSelector((state: any) => state.User);
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.n</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            {
                                Company?.branch?.length > 0 && (
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                )
                            }
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode of Payment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            {
                                (User?.role == "Owner" || User?.role == "admin") &&

                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Saved KOT</th>
                            }
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                        {filteredInvoices?.length > 0 ? (
                            filteredInvoices.map((invoice: any, i) => (
                                <tr key={invoice._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                        <Link href={`/Invoice/${invoice._id}`} className='text-blue-500'>
                                            {i + 1}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                        <Link href={`/Invoice/${invoice._id}`} className='text-blue-500'>
                                            #{invoice.invoiceId}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {invoice.clientName}</td>
                                    {
                                        Company?.branch?.length > 0 && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice?.branchId?.branchName}</td>
                                        )
                                    }
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.currency}{invoice.grandTotal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{invoice.paymentMode} </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(invoice.createdAt).format('MMM DD, YYYY')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/Invoice/${invoice._id}`} className='text-blue-500'>View</Link>
                                    </td>
                                    {
                                        (User?.role == "Owner" || User?.role == "admin") &&
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link href={`/Invoice/saved-KOT/${invoice._id}`} className='text-blue-500'>
                                                {invoice?.kotCount} kot saved
                                            </Link>
                                        </td>
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={Company?.branch?.length > 0 ? 7 : 6} className="px-6 py-8 text-center text-sm text-gray-500">
                                    {searchQuery ?
                                        `No invoices found matching "${searchQuery}"` :
                                        'No invoices found'
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
