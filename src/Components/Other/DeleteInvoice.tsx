'use client'
import { useGlobalContext } from '@/context/contextProvider';
import moment from 'moment'
import Link from 'next/link'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { formatDateRange } from '@/lib/formatDateRange'
import { FetchInvoicesList } from '@/app/Redux/Slice/Invoice.slice';
import axios from 'axios';
import InvoiceDateFilter from './InvoiceDateFilter';
const base_url = process.env.NEXT_PUBLIC_BASE_URL


export default function DeleteInvoice() {
    const dispatch = useDispatch();
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company)
    const { Invoices, loading } = useSelector((state: any) => state.Invoices)

    const {
        selectedBranch,
        setSelectedBranch,
        startDate,
        endDate,
    } = useGlobalContext();

    const dateRangeString = formatDateRange(startDate, endDate)
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedTotal = useMemo(() => {
        return selectedInvoices.reduce((total, invoiceId) => {
            const invoice = Invoices?.find((inv: any) => inv._id === invoiceId);
            return total + (invoice?.grandTotal || 0);
        }, 0);
    }, [selectedInvoices, Invoices]);

    const Total = useMemo(() => {
        return Invoices?.reduce((total: any, invoice: any) => {
            return total + (invoice?.grandTotal || 0);
        }, 0);
    }, [Invoices]);

    const remainingTotal = useMemo(() => {
        return Total - selectedTotal;
    }, [Total, selectedTotal]);

    const handleSelectInvoice = (invoiceId: string) => {
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    };

    const handleSelectAll = () => {
        if (selectedInvoices.length === Invoices?.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(Invoices?.map((inv: any) => inv._id) || []);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedInvoices.length === 0) {
            alert('Please select invoices to delete');
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${selectedInvoices.length} invoice(s)?`
        );

        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const { data } = await axios.post(`${base_url}/api/v1/Invoice/delete/bulk`, { data: { invoiceIds: selectedInvoices } }, { withCredentials: true });
            if (data.success) {

                dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any);
                setSelectedInvoices([]);
                alert('Invoices deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting invoices:', error);
            alert('Failed to delete invoices. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const currency = Invoices?.[0]?.currency || '';

    const FilterInvoice = useCallback(async () => {
        try {
            dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any)
        } catch (error) {
            return error
        }
    }, [startDate, endDate, selectedBranch])

    useEffect(() => {
        FilterInvoice()
    }, [FilterInvoice, Invoices])

    return (
        <div className="h-screen flex flex-col">
            <div className="flex justify-between">
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

                                {Company?.branch?.length > 0 &&
                                    Company.branch.map((branch: any) => (
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

            {/* Compact Summary Cards */}
            <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600 mb-0.5">Total Invoices</p>
                        <p className="text-xl font-bold text-blue-700">{Invoices?.length || 0}</p>
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
                        <p className="text-xl font-bold text-orange-700">
                            {currency}{remainingTotal?.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Delete Button */}
                {selectedInvoices.length > 0 && (
                    <div className="mt-3 flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                        <span className="text-sm text-red-700 font-medium">
                            {selectedInvoices.length} invoice(s) selected for deletion
                        </span>
                        <button
                            onClick={handleDeleteSelected}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            {isDeleting ? 'Deleting...' : `Delete Selected`}
                        </button>
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
                                        checked={selectedInvoices.length === Invoices?.length && Invoices?.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.n</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
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
                            {Invoices?.length > 0 ? (
                                Invoices.map((invoice: any, i: number) => (
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
                                            {i + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/Invoice/${invoice._id}`} className='text-blue-600 hover:text-blue-800 hover:underline'>
                                                #{invoice.invoiceId}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{invoice.clientName}</td>
                                        {Company?.branch?.length > 0 && (
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{invoice?.branchId?.branchName}</td>
                                        )}
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.currency}{invoice.grandTotal}</td>
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
                                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
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