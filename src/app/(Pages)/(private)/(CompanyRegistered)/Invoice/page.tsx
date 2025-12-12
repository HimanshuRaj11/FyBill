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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 rounded-lg">
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Search Modal */}
                {searchOn && (
                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                        onClick={(e) => {
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
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                Invoice Overview
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                Here's your Invoices of your business.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                className="!rounded-lg whitespace-nowrap flex items-center gap-2 shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </Button>
                        </div>
                    </div>

                    {/* Branch Selection */}
                    {User?.role === "Owner" && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Select Branch
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <div
                                    onClick={() => setSelectedBranch("All")}
                                    className={`flex justify-center items-center px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${selectedBranch === "All"
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-md scale-105"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-102 border border-gray-200 dark:border-gray-700"
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
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-md scale-105"
                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-102 border border-gray-200 dark:border-gray-700"
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
                                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search invoices by number, customer..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onClick={() => setSearchOn(true)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all shadow-sm hover:shadow-md placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Filter Button */}
                                <InvoiceDateFilter />
                            </div>

                            {/* Invoice Data Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                                            {dateRangeString} Invoice Data
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Export your invoice data to Excel
                                        </p>
                                    </div>
                                    <DownloadExcel data={filteredInvoices} fileName="Invoices" />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Revenue by Payment Mode Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200 mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Total Revenue by Payment Mode
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {paymentModes.map((mode) => (
                                <div
                                    key={mode}
                                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105"
                                >
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 capitalize">
                                        {mode === 'netBanking' ? 'Net Banking' : mode}
                                    </div>
                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {Company?.currency.symbol} {getRevenueByPaymentMode(mode)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {getInvoiceCountByPaymentMode(mode)} invoice{getInvoiceCountByPaymentMode(mode) !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice List Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardContent>
                        {searchQuery && (
                            <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Showing {filteredInvoices.length} result(s) for {searchQuery}
                                    {filteredInvoices.length !== Invoice.length && (
                                        <span className="ml-2 text-gray-500 dark:text-gray-400">
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
        </div>
    )
}