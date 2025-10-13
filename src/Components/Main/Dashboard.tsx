"use client"
import React, { useCallback, useEffect, useState, useMemo, useContext } from 'react'
import { Button } from '../ui/button'
import { Download, ChevronDown, Filter, Search, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import DashboardTopCards from '../Other/DashboardTopCards'
import { BarChartComponent } from '../Other/BarChart'
import { PieChartComponent } from '../Other/PaiChart'
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";
import DownloadExcel from '../Other/DownloadExcel'
import { FetchInvoicesList } from '@/app/Redux/Slice/Invoice.slice'
import { useGlobalContext } from '@/context/contextProvider'
import { start } from 'node:repl'
import { ChartLineLinear } from '../Other/LineChart'
import InvoiceTableSkeleton from '../Skeleton/InvoiceTableSkeleton'

export default function Dashboard() {
    const dispatch = useDispatch();
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company)
    const { Invoices, loading } = useSelector((state: any) => state.Invoices)
    const [isLoading, setIsLoading] = useState(false)
    const {
        selectedBranch,
        setSelectedBranch,
        dateRange,
        setDateRange,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
    } = useGlobalContext();

    const Invoice = Invoices || []
    const [searchQuery, setSearchQuery] = useState('')

    const [isFilterOpen, setIsFilterOpen] = useState(false)

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

    const HandleDateRange = (dateRange: string) => {
        setDateRange(dateRange);
        if (dateRange == "Today") {
            setStartDate(moment().startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Yesterday") {
            setStartDate(moment().subtract(1, 'day').startOf('day').toDate())
            setEndDate(moment().subtract(1, 'day').endOf('day').toDate())
        }
        if (dateRange == "Last 7 days") {
            setStartDate(moment().subtract(7, 'days').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 30 days") {
            setStartDate(moment().subtract(30, 'days').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 90 days") {
            setStartDate(moment().subtract(90, 'days').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 6 Months") {
            setStartDate(moment().subtract(6, 'months').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 1 Year") {
            setStartDate(moment().subtract(1, 'year').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Custom range") {
            setStartDate(moment().subtract(1, 'year').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
    }

    const FilterInvoice = useCallback(async () => {
        try {
            setIsLoading(true)
            dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }, [startDate, endDate, selectedBranch])

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

    const [DaysDiff, setDaysDiff] = useState(0)
    const TimeDifference = () => {
        // Difference in milliseconds
        const diffMs = endDate.getTime() - startDate.getTime();

        // Convert to seconds, minutes, hours, or days
        const diffSeconds = diffMs / 1000;
        const diffMinutes = diffMs / (1000 * 60);
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        setDaysDiff(diffDays)
        console.log(diffDays);

    }
    useEffect(() => {
        if (startDate && endDate) {
            TimeDifference()
        }
    }, [startDate, endDate])



    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back! {`Here's what's `}happening with your business.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        className="!rounded-lg whitespace-nowrap flex items-center gap-2"
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {
                User?.role === "Owner" && (
                    <div className="flex flex-row justify-start mb-2.5 gap-2 flex-wrap">
                        <div
                            onClick={() => setSelectedBranch("All")}
                            className={`flex justify-center items-center p-2 rounded-lg cursor-pointer hover:shadow-md transition-colors ${selectedBranch === "All"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-900"
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
                                className="text-md font-semibold min-w-20 text-center cursor-pointer"
                            >
                                All
                            </label>
                        </div>

                        {Company?.branch?.length > 0 &&
                            Company.branch.map((branch: any) => (
                                <div
                                    onClick={() => setSelectedBranch(branch?.branchName)}
                                    key={branch._id}
                                    className={`flex justify-center items-center p-2 rounded-lg cursor-pointer hover:shadow-md transition-colors ${selectedBranch === branch?.branchName
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-900"
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
                                        className="text-md font-semibold cursor-pointer"
                                    >
                                        {branch?.branchName}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                )
            }

            {/* Search and Filter */}
            {
                (User?.role == "Owner" || User?.role == "admin") && (
                    <>
                        <div className="flex justify-between flex-col sm:flex-row gap-3 mb-6">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        <span className="text-lg">&times;</span>
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="!rounded-lg whitespace-nowrap flex items-center gap-2"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filter
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </Button>
                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                                        <h3 className="font-medium mb-4 text-gray-800">Filter Options</h3>
                                        <div className="space-y-4">
                                            {/* Date Range Selector */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                                <select
                                                    value={dateRange}
                                                    onChange={(e) => { HandleDateRange(e.target.value) }}
                                                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                >
                                                    <option value="Today">Today</option>
                                                    <option value="Yesterday">Yesterday</option>
                                                    <option value="Last 7 days">Last 7 days</option>
                                                    <option value="Last 30 days">Last 30 days</option>
                                                    <option value="Last 90 days">Last 90 days</option>
                                                    <option value="Last 6 Months">Last 6 Months</option>
                                                    <option value="Last 1 Year">Last 1 Year</option>
                                                    <option value="Custom">Custom Range</option>
                                                </select>
                                            </div>

                                            {/* Custom Date Range Section */}
                                            {dateRange === 'Custom' && (
                                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range</h4>

                                                    {/* Date Range Inputs */}
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {/* Start Date */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                                            <div className="relative">
                                                                <DatePicker
                                                                    selected={startDate}
                                                                    onChange={(date: any) => setStartDate(date)}
                                                                    selectsStart
                                                                    startDate={startDate}
                                                                    endDate={endDate}
                                                                    maxDate={new Date()}
                                                                    placeholderText="Select start date"
                                                                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                                                    dateFormat="MM/dd/yyyy"
                                                                    showPopperArrow={false}
                                                                    popperClassName="custom-datepicker-popper"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* End Date */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                                            <div className="relative">
                                                                <DatePicker
                                                                    selected={endDate}
                                                                    onChange={(date: any) => setEndDate(date)}
                                                                    selectsEnd
                                                                    startDate={startDate}
                                                                    endDate={endDate}
                                                                    minDate={startDate}
                                                                    maxDate={new Date()}
                                                                    placeholderText="Select end date"
                                                                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                                                    dateFormat="MM/dd/yyyy"
                                                                    showPopperArrow={false}
                                                                    popperClassName="custom-datepicker-popper"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Clear Dates Button */}
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <button
                                                            onClick={() => {
                                                                const today = new Date();
                                                                setStartDate(today);
                                                                setEndDate(today);
                                                            }}
                                                            className="text-xs text-red-600 hover:text-red-700 focus:outline-none focus:underline transition-colors"
                                                        >
                                                            Clear dates
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                        <div className=" p-2">
                            <h1 className="text-xl font-extrabold text-gray-800 mb-4">{dateRange} Invoice Data</h1>
                            <DownloadExcel data={filteredInvoices} fileName={'Invoices'} />
                        </div>
                    </>
                )
            }

            {/* Stats Cards */}
            <DashboardTopCards Invoice={Invoice} loading={loading} />

            {/* Charts */}

            {/* <div className="">

                {
                    DaysDiff == 7 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                            <BarChartComponent Invoice={Invoice} dateRange={dateRange} DaysDiff={DaysDiff} />
                           // <PieChartComponent Invoice={Invoice} dateRange={dateRange} />
                        </div>
                    )
                }
                {
                    DaysDiff == 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                            <ChartLineLinear Invoice={Invoice} dateRange={dateRange} DaysDiff={DaysDiff} />
                           // <PieChartComponent Invoice={Invoice} dateRange={dateRange} />
                        </div>
                    )
                }
            </div> */}


            {/* Recent Activity */}
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

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
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
                                            filteredInvoices.map((invoice: any) => (
                                                <tr key={invoice._id} className="hover:bg-gray-50">
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
                        )
                    }
                </CardContent>
            </Card>
        </div>
    )
}