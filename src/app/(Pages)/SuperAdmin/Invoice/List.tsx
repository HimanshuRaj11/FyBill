import { AlertCircle, Search, X } from 'lucide-react'
import React from 'react'
import { I_Invoice } from './ApiCalls'
import Link from 'next/link'
import moment from 'moment'

export default function List({ searchQuery, handleSearchChange, clearSearch, loading, error, displayedInvoices, selectedInvoices, handleSelectAll, handleSelectInvoice, Company, InvoiceLoading }: any) {
    return (
        <div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                    <Search className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">Search Invoices</h2>
                </div>
            </div>
            {/* Search Input */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-sm">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by invoice number, customer name, amount..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                    {loading && (
                        <div className="absolute inset-y-0 right-12 flex items-center pr-4">
                            <svg
                                className="animate-spin h-5 w-5 text-blue-500 dark:text-blue-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                    )}
                </div>

                {/* Search Status */}
                {searchQuery.trim() && !loading && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {displayedInvoices.length > 0
                            ? `Found ${displayedInvoices.length} invoice${displayedInvoices.length !== 1 ? 's' : ''}`
                            : `No invoices found for "${searchQuery}"`}
                    </p>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
            </div>

            {/* Scrollable Table Container */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedInvoices.length === displayedInvoices.length && displayedInvoices.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
                                    />
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">S.N</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice Track Id</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                {Company?.branch?.length > 0 && (
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</th>
                                )}
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {InvoiceLoading || loading ? (
                                <tr>
                                    <td colSpan={Company?.branch?.length > 0 ? 10 : 9} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400 mb-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading invoices...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedInvoices.length > 0 ? (
                                displayedInvoices.map((invoice: I_Invoice, i: number) => (
                                    <tr key={invoice._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedInvoices.includes(invoice._id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedInvoices.includes(invoice._id)}
                                                onChange={() => handleSelectInvoice(invoice._id)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {i + 1} {
                                                invoice.important && <span title="Important Invoice" className="ml-1 text-yellow-500 dark:text-yellow-400">★</span>
                                            }
                                            {
                                                invoice.delete && <span title="Deleted Invoice" className="ml-1 text-red-500 dark:text-red-400">
                                                    🗑
                                                </span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline'>
                                                #{invoice.invoiceId}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:underline'>
                                                #{invoice.invoiceIdTrack}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{invoice.clientName}</td>
                                        {Company?.branch?.length > 0 && (
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{invoice?.branchName || '-'}</td>
                                        )}
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{invoice.currency}{invoice.grandTotal.toFixed(2)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                {invoice.paymentMode}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{moment(invoice.createdAt).format('MMM DD, YYYY')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline'>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={Company?.branch?.length > 0 ? 10 : 9} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <svg className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-sm font-medium">No invoices found</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
