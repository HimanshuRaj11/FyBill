'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import InvoiceTableSkeleton from '../Skeleton/InvoiceTableSkeleton';
import Link from 'next/link';
import moment from 'moment';
import { Search, X } from 'lucide-react';
import axios from 'axios';

const base_url = process.env.NEXT_PUBLIC_BASE_URL


interface Invoice {
    _id: string;
    invoiceId: string;
    clientName: string;
    branchId?: {
        branchName: string;
    };
    currency: string;
    grandTotal: number;
    paymentMode: string;
    createdAt: string;
    kotCount?: number;
}

interface InvoiceSearchTableProps {
    onClose?: () => void;
}

export default function InvoiceSearchTable({ setSearchOn }: { setSearchOn: any }) {
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch invoices when debounced query changes

    const fetchInvoices = async (query: string) => {


        if (debouncedQuery.length === 0) {
            setInvoices([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${base_url}/api/v1/Invoice/search`, { query }, { withCredentials: true });

            setInvoices(data.invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };



    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        fetchInvoices(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setInvoices([]);
    };



    return (
        <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header with Close Button */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Search className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">Search Invoices</h2>
                </div>

                <button
                    onClick={() => setSearchOn(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors duration-200"
                    aria-label="Close"
                >
                    <X className="h-6 w-6" />
                </button>

            </div>

            <div className="p-6">
                {/* Search Input */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by invoice number, customer name, amount..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoFocus
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                        {loading && (
                            <div className="absolute inset-y-0 right-12 flex items-center pr-4">
                                <svg
                                    className="animate-spin h-5 w-5 text-blue-500"
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

                    {/* Search hint */}
                    {searchQuery.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                            Start typing to search invoices...
                        </p>
                    )}

                    {/* Results count */}
                    {searchQuery.length > 0 && !loading && (
                        <p className="mt-2 text-sm text-gray-600">
                            {invoices.length > 0
                                ? `Found ${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`
                                : `No invoices found for "${searchQuery}"`}
                        </p>
                    )}
                </div>

                {/* Table or Loading State */}
                {loading ? (
                    <InvoiceTableSkeleton />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Invoice
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Customer
                                    </th>
                                    {Company?.branch?.length > 0 && (
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Branch
                                        </th>
                                    )}
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Payment Mode
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                    {(User?.role === 'Owner' || User?.role === 'admin') && (
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Saved KOT
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <tr
                                            key={invoice._id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={`/Invoice/${invoice._id}`}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    #{invoice.invoiceId}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {invoice.clientName}
                                            </td>
                                            {Company?.branch?.length > 0 && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {invoice?.branchId?.branchName || '-'}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                {invoice.currency}
                                                {invoice.grandTotal.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {invoice.paymentMode}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {moment(invoice.createdAt).format('MMM DD, YYYY')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/Invoice/${invoice._id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                            {(User?.role === 'Owner' || User?.role === 'admin') && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {invoice?.kotCount && invoice.kotCount > 0 ? (
                                                        <Link
                                                            href={`/Invoice/saved-KOT/${invoice._id}`}
                                                            className="text-green-600 hover:text-green-800 font-medium hover:underline"
                                                        >
                                                            {invoice.kotCount} KOT{invoice.kotCount !== 1 ? 's' : ''}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400">No KOT</span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={
                                                7 +
                                                (Company?.branch?.length > 0 ? 1 : 0) +
                                                (User?.role === 'Owner' || User?.role === 'admin' ? 1 : 0)
                                            }
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Search className="h-12 w-12 text-gray-300 mb-3" />
                                                <p className="text-sm font-medium">
                                                    {searchQuery
                                                        ? `No invoices found matching "${searchQuery}"`
                                                        : 'Start searching to find invoices'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Try searching by invoice number, customer name, or amount
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}