"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Download, ChevronDown, Filter, Search, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import DashboardTopCards from '../Other/DashboardTopCards'
import { BarChartComponent } from '../Other/BarChart'
import { PieChartComponent } from '../Other/PaiChart'

export default function Dashboard() {
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company)
    const [isLoading, setIsLoading] = useState(false)

    const [Invoice, setInvoice] = useState([])
    const [selectedBranch, setSelectedBranch] = useState("All");

    const [searchQuery, setSearchQuery] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)


    const [dateRange, setDateRange] = useState('Today')

    const [startDate, setStartDate] = useState(moment().startOf('day').toDate())
    const [endDate, setEndDate] = useState(moment().endOf('day').toDate())


    const HandleDateRange = (dateRange: string) => {
        setIsFilterOpen(false)
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
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/filter`, { selectedBranch, startDate, endDate })
        setInvoice(data.invoices)
    }, [startDate, endDate, selectedBranch])





    const FetchInvoice: () => Promise<void> = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/fetch?sort=-createdAt`)
            setInvoice(data.invoices)

            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setDateRange("Today");
        FetchInvoice()
    }, [])

    useEffect(() => {
        FilterInvoice()
    }, [dateRange, FilterInvoice])

    const handleRefresh = () => {
        FetchInvoice()
    }



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
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search invoices, customers..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
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
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                                        <h3 className="font-medium mb-3">Filter Options</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                                <select value={dateRange} onChange={(e) => { HandleDateRange(e.target.value) }} className="w-full border border-gray-300 rounded-md p-2 text-sm">
                                                    <option value="Today">Today</option>
                                                    <option value="Yesterday">Yesterday</option>
                                                    <option value="Last 7 days">Last 7 days</option>
                                                    <option value="Last 30 days">Last 30 days</option>
                                                    <option value="Last 90 days">Last 90 days</option>
                                                    <option value="Last 6 Months">Last 6 Months</option>
                                                    <option value="Last 1 Year">Last 1 Year</option>
                                                    {/*  <option value="Custom range">Custom range</option> */}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className=" p-2">
                            <h1 className="text-xl font-extrabold text-gray-800 mb-4">{dateRange} Invoice Data</h1>
                        </div>
                    </>
                )
            }



            {/* Stats Cards */}
            <DashboardTopCards Invoice={Invoice} />


            {/* Charts */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">


                <BarChartComponent Invoice={Invoice} dateRange={dateRange} />
                <PieChartComponent Invoice={Invoice} dateRange={dateRange} />

            </div> */}

            {/* Recent Activity */}
            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest transactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 ">
                                {Invoice?.map((invoice: any) => (
                                    <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                            <Link href={`/Invoice/${invoice.invoiceId}`} className='text-blue-500'>
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
                                            <Link href={`/Invoice/${invoice.invoiceId}`} className='text-blue-500'>View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

