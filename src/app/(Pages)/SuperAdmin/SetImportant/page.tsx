'use client'
import { useGlobalContext } from '@/context/contextProvider';
import moment from 'moment'
import Link from 'next/link'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { formatDateRange } from '@/lib/formatDateRange'
import { FetchInvoicesList } from '@/app/Redux/Slice/Invoice.slice';
import axios from 'axios';
import InvoiceDateFilter from '@/Components/Other/InvoiceDateFilter';
import { Search, X, AlertCircle } from 'lucide-react';

const base_url = process.env.NEXT_PUBLIC_BASE_URL

interface Invoice {
    _id: string;
    invoiceId: string;
    invoiceIdTrack: string;
    clientName: string;
    branchName: string;
    currency: string;
    grandTotal: number;
    paymentMode: string;
    createdAt: string;
    kotCount?: number;
    important?: boolean;
    delete?: boolean;
}

export default function Page() {
    const dispatch = useDispatch();
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company)
    const { Invoices, loading: InvoiceLoading } = useSelector((state: any) => state.Invoices)

    const [searchResults, setSearchResults] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        selectedBranch,
        setSelectedBranch,
        startDate,
        endDate,
    } = useGlobalContext();

    const dateRangeString = formatDateRange(startDate, endDate)
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Determine which invoices to display
    const displayedInvoices = useMemo(() => {
        return searchQuery.trim() ? searchResults : (Invoices || []);
    }, [searchQuery, searchResults, Invoices]);

    // Calculate totals based on displayed invoices
    const selectedTotal = useMemo(() => {
        return selectedInvoices.reduce((total, invoiceId) => {
            const invoice = displayedInvoices.find((inv: Invoice) => inv._id === invoiceId);
            return total + (invoice?.grandTotal || 0);
        }, 0);
    }, [selectedInvoices, displayedInvoices]);

    const Total = useMemo(() => {
        return displayedInvoices.reduce((total: number, invoice: Invoice) => {
            return total + (invoice?.grandTotal || 0);
        }, 0);
    }, [displayedInvoices]);

    const remainingTotal = useMemo(() => {
        return Total - selectedTotal;
    }, [Total, selectedTotal]);

    const currency = displayedInvoices?.[0]?.currency || '';

    // Fetch invoices when filters change
    const FilterInvoice = useCallback(async () => {
        try {
            dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setError('Failed to load invoices');
        }
    }, [dispatch, selectedBranch, startDate, endDate]);

    // Only fetch on mount and filter changes
    useEffect(() => {
        FilterInvoice();
    }, [FilterInvoice]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchInvoices(searchQuery.trim());
            } else {
                setSearchResults([]);
                setError(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchInvoices = async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `${base_url}/api/v1/Invoice/search`,
                { query },
                { withCredentials: true }
            );

            setSearchResults(data.invoices || []);
        } catch (error: any) {
            console.error('Error fetching invoices:', error);
            setError(error.response?.data?.message || 'Failed to search invoices');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setError(null);
        setSelectedInvoices([]);
    };

    const handleSelectInvoice = (invoiceId: string) => {
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    };

    const handleSelectAll = () => {
        if (selectedInvoices.length === displayedInvoices.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(displayedInvoices.map((inv: Invoice) => inv._id));
        }
    };

    const handleSetImportantSelected = async () => {
        if (selectedInvoices.length === 0) {
            alert('Please select invoices to mark as important');
            return;
        }

        const confirmAction = window.confirm(
            `Are you sure you want to mark ${selectedInvoices.length} invoice(s) as important?`
        );

        if (!confirmAction) return;

        setIsProcessing(true);
        try {
            const { data } = await axios.post(
                `${base_url}/api/v1/Invoice/setImportant`,
                { data: { invoiceIds: selectedInvoices } },
                { withCredentials: true }
            );

            if (data.success) {
                await FilterInvoice();
                setSelectedInvoices([]);
                alert('Invoices marked as important successfully');

                // If search was active, refresh search results
                if (searchQuery.trim()) {
                    await fetchInvoices(searchQuery.trim());
                }
            }
        } catch (error: any) {
            console.error('Error marking invoices as important:', error);
            alert(error.response?.data?.message || 'Failed to mark invoices as important');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="">
                    {User?.role === "Owner" && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                <div
                                    onClick={() => setSelectedBranch("All")}
                                    className={`flex justify-center items-center px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${selectedBranch === "All"
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105"
                                        : "bg-white text-gray-700 hover:shadow-md hover:scale-102 border border-gray-200"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="branch"
                                        id="branch-all"
                                        className="hidden"
                                        checked={selectedBranch === "All"}
                                        onChange={() => setSelectedBranch("All")}
                                    />
                                    <label
                                        htmlFor="branch-all"
                                        className="text-sm font-semibold min-w-[80px] text-center cursor-pointer"
                                    >
                                        All Branches
                                    </label>
                                </div>

                                {Company?.branch?.map((branch: any) => (
                                    <div
                                        onClick={() => setSelectedBranch(branch?.branchName)}
                                        key={branch._id}
                                        className={`flex justify-center items-center px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${selectedBranch === branch?.branchName
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105"
                                            : "bg-white text-gray-700 hover:shadow-md hover:scale-102 border border-gray-200"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="branch"
                                            id={`branch-${branch._id}`}
                                            className="hidden"
                                            checked={selectedBranch === branch?.branchName}
                                            onChange={() => setSelectedBranch(branch?.branchName)}
                                        />
                                        <label
                                            htmlFor={`branch-${branch._id}`}
                                            className="text-sm font-semibold cursor-pointer whitespace-nowrap"
                                        >
                                            {branch?.branchName}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {dateRangeString} Invoice Data
                </h2>
                <InvoiceDateFilter />
            </div>

            {/* Summary Cards */}
            <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600 mb-0.5">Total Invoices</p>
                        <p className="text-xl font-bold text-blue-700">{displayedInvoices.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg border border-indigo-200">
                        <p className="text-xs text-gray-600 mb-0.5">Total Amount</p>
                        <p className="text-xl font-bold text-indigo-700">
                            {currency}{Total?.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-600 mb-0.5">Selected</p>
                        <p className="text-xl font-bold text-green-700">{selectedInvoices.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <p className="text-xs text-gray-600 mb-0.5">Selected Total</p>
                        <p className="text-xl font-bold text-purple-700">
                            {currency}{selectedTotal?.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                        <p className="text-xs text-gray-600 mb-0.5">Remaining</p>
                        <p className="text-xl font-bold text-green-700">
                            {currency}{remainingTotal?.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                {selectedInvoices.length > 0 && (
                    <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <span className="text-sm text-blue-700 font-medium">
                            {selectedInvoices.length} invoice(s) selected
                        </span>
                        <button
                            onClick={handleSetImportantSelected}
                            disabled={isProcessing}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            {isProcessing ? 'Processing...' : `Mark as Important`}
                        </button>
                    </div>
                )}
            </div>

            {/* Search Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                    <Search className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">Search Invoices</h2>
                </div>
            </div>

            {/* Search Input */}
            <div className="mb-6 bg-white p-4 rounded-b-lg shadow-sm">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by invoice number, customer name, amount..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

                {/* Search Status */}
                {searchQuery.trim() && !loading && (
                    <p className="mt-2 text-sm text-gray-600">
                        {displayedInvoices.length > 0
                            ? `Found ${displayedInvoices.length} invoice${displayedInvoices.length !== 1 ? 's' : ''}`
                            : `No invoices found for "${searchQuery}"`}
                    </p>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
            </div>

            {/* Scrollable Table Container */}
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedInvoices.length === displayedInvoices.length && displayedInvoices.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.N</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Track Id</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                {Company?.branch?.length > 0 && (
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                )}
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {InvoiceLoading || loading ? (
                                <tr>
                                    <td colSpan={Company?.branch?.length > 0 ? 9 : 8} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="animate-spin h-8 w-8 text-blue-500 mb-2"
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
                                            <p className="text-sm text-gray-500">Loading invoices...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedInvoices.length > 0 ? (
                                displayedInvoices.map((invoice: Invoice, i: number) => (
                                    <tr key={invoice._id} className={`hover:bg-gray-50 transition-colors ${selectedInvoices.includes(invoice._id) ? 'bg-blue-50' : ''}`}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedInvoices.includes(invoice._id)}
                                                onChange={() => handleSelectInvoice(invoice._id)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {i + 1} {
                                                invoice.important && <span title="Important Invoice" className="ml-1 text-yellow-500">★</span>
                                            }
                                            {
                                                invoice.delete && <span title="Important Invoice" className="ml-1 text-red-500">
                                                    🗑
                                                </span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-blue-600 hover:text-blue-800 hover:underline'>
                                                #{invoice.invoiceId}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-green-600 hover:text-green-800 hover:underline'>
                                                #{invoice.invoiceIdTrack}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{invoice.clientName}</td>
                                        {Company?.branch?.length > 0 && (
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{invoice?.branchName || '-'}</td>
                                        )}
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.currency}{invoice.grandTotal.toFixed(2)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {invoice.paymentMode}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{moment(invoice.createdAt).format('MMM DD, YYYY')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-blue-600 hover:text-blue-800 font-medium hover:underline'>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={Company?.branch?.length > 0 ? 9 : 8} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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