"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, Search, X, } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { useDispatch, useSelector } from 'react-redux'

import "react-datepicker/dist/react-datepicker.css";
import { FetchInvoicesList } from '@/app/Redux/Slice/Invoice.slice'
import DownloadExcel from '@/Components/Other/DownloadExcel'
import InvoiceTableSkeleton from '@/Components/Skeleton/InvoiceTableSkeleton'
import InvoiceList from '@/Components/Main/InvoiceList'
import { useGlobalContext } from '@/context/contextProvider'
import InvoiceSearchTable from '@/Components/Other/InvoiceSearchTable'
import InvoiceDateFilter from '@/Components/Other/InvoiceDateFilter'
import { formatDateRange } from '@/lib/formatDateRange'
import { Button } from '@/Components/ui/button'


const paymentModes = [
    "cash", "upi", "netBanking", "card"
]

export default function Dashboard() {
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

    const [searchQuery, setSearchQuery] = useState('')
    const [searchOn, setSearchOn] = useState<boolean>(false)

    if (!Invoices) {
        dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any)
    }

    // Calculate revenue by payment mode
    const getRevenueByPaymentMode = (mode: string) => {
        return Invoices?.filter((invoice: any) => invoice.paymentMode?.toLowerCase() === mode.toLowerCase())
            .reduce((acc: number, invoice: any) => acc + invoice.grandTotal, 0)
            .toFixed(2)
    }

    const getInvoiceCountByPaymentMode = (mode: string) => {
        return Invoice.filter((invoice: any) => invoice.paymentMode?.toLowerCase() === mode.toLowerCase()).length
    }

    const Invoice = Invoices || []
    const FilterInvoice = useCallback(async () => {
        try {

            dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any)

        } catch (error) {
            return error
        }
    }, [startDate, endDate, selectedBranch])
    const filteredInvoices = useMemo(() => {
        if (!searchQuery.trim()) return Invoice;
        return Invoice.filter((invoice: any) =>
            invoice.invoiceId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.branchId?.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.paymentMode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.grandTotal?.toString().includes(searchQuery)
        );
    }, [Invoice, searchQuery]);

    useEffect(() => {
        FilterInvoice()
    }, [FilterInvoice])

    const handleRefresh = () => {
        FilterInvoice()
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const clearSearch = () => {
        setSearchQuery('');
    }
    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {searchOn && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                        // Close when clicking outside the modal
                        if (e.target === e.currentTarget) {
                            setSearchOn(false);
                        }
                    }}
                >
                    <div className="min-h-screen w-full px-4 py-8 flex items-start justify-center">
                        <div className="w-full max-w-7xl">
                            <InvoiceSearchTable setSearchOn={setSearchOn} />
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full mb-6">
                {/* Header Section with improved spacing and hierarchy */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Invoice Overview
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Here{`${"'"}`}s your Invoices of your business.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            className="!rounded-lg whitespace-nowrap flex items-center gap-2 shadow-sm"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                    </div>
                </div>

                {/* Branch Selection with improved design */}
                {User?.role === "Owner" && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Branch</h3>
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

                {/* Search and Filter Section */}
                {(User?.role === "Owner" || User?.role === "admin") && (
                    <>
                        <div className="flex flex-col md:flex-row gap-3 justify-between mb-6">
                            {/* Enhanced Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search invoices by number, customer..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onClick={() => setSearchOn(true)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md placeholder:text-gray-400"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Button */}
                            <InvoiceDateFilter />
                        </div>

                        {/* Invoice Data Section with card design */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                        {dateRangeString} Invoice Data
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Export your invoice data to Excel
                                    </p>
                                </div>
                                <DownloadExcel data={filteredInvoices} fileName="Invoices" />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Total Revenue by Payment Mode</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {paymentModes.map((mode) => (
                            <div key={mode} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="text-sm font-medium text-gray-600 mb-2 capitalize">
                                    {mode === 'netBanking' ? 'Net Banking' : mode}
                                </div>
                                <div className="text-xl font-bold text-blue-600 mb-2">
                                    {Company?.currency.symbol} {getRevenueByPaymentMode(mode)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {getInvoiceCountByPaymentMode(mode)} invoice{getInvoiceCountByPaymentMode(mode) !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent>
                    {searchQuery && (
                        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                Showing {filteredInvoices.length} result(s) for {searchQuery}
                                {filteredInvoices.length !== Invoice.length && (
                                    <span className="ml-2 text-gray-500">
                                        (filtered from {Invoice.length} total)
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                    {
                        loading ? (
                            <InvoiceTableSkeleton />
                        ) : (
                            <InvoiceList filteredInvoices={filteredInvoices} searchQuery={searchQuery} Company={Company} />
                        )
                    }

                </CardContent>
            </Card>
        </div>
    )
}

