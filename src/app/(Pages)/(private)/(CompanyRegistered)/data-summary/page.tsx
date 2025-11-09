'use client'
import axios from 'axios'
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/Components/ui/button';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import DownloadExcel from '@/Components/Other/DownloadExcel';
import PreLoader from '@/Components/Other/PreLoader';

interface IProduct {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

export default function Page() {
    const { Company } = useSelector((state: any) => state.Company)
    const { User } = useSelector((state: any) => state.User)

    const [ProductsDataSummary, setProductsDataSummary] = useState<IProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedBranch, setSelectedBranch] = useState("All");

    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const [dateRange, setDateRange] = useState('Today')

    const [startDate, setStartDate] = useState(moment().startOf('day').toDate())
    const [endDate, setEndDate] = useState(moment().endOf('day').toDate())

    // Search state
    const [searchTerm, setSearchTerm] = useState('')

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

    const getProductData = useCallback(async () => {
        try {
            try {
                setLoading(true)
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dataSummary/productSell`, { selectedBranch, startDate, endDate })
                setProductsDataSummary(data.FinalList)
                setFilteredProducts(data.FinalList) // Initialize filtered products
                setError(null)
            } catch (err) {
                setError('Failed to fetch product data')
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        } catch (error) {
            return error
        }
    }, [startDate, endDate, selectedBranch])

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(ProductsDataSummary)
        } else {
            const filtered = ProductsDataSummary.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
    }, [searchTerm, ProductsDataSummary])

    useEffect(() => {
        getProductData()
    }, [getProductData])

    const totalQuantity = filteredProducts.reduce((sum, product) => sum + product.quantity, 0)
    const totalAmount = filteredProducts.reduce((sum, product) => sum + product.amount, 0)

    // Clear search
    const clearSearch = () => {
        setSearchTerm('')
    }

    const handleExcelDownload = () => {

    }

    if (error) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md w-full mx-4">
                    <div className="text-red-500 text-center mb-4">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Error Loading Data</h3>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <button
                        onClick={getProductData}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return <PreLoader />
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className=" ">
                <div className="py-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Sales Summary</h1>
                            <p className="text-gray-600 mt-1">Overview of your product performance</p>
                        </div>
                        <button
                            onClick={getProductData}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Refresh</span>
                        </button>
                    </div>
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
                                    onClick={() => setSelectedBranch(branch?._id)}
                                    key={branch._id}
                                    className={`flex justify-center items-center p-2 rounded-lg cursor-pointer hover:shadow-md transition-colors ${selectedBranch === branch?._id
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
                                        onChange={() => setSelectedBranch(branch?._id)}
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
            <div className="flex justify-between flex-col sm:flex-row gap-3 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                        >
                            <X className="h-4 w-4 text-gray-400" />
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
                <h1 className="text-xl font-extrabold text-gray-800 mb-4">
                    {dateRange} Sales Data
                    {searchTerm && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                            - Showing results for - {searchTerm}
                        </span>
                    )}
                </h1>
            </div>
            <DownloadExcel data={ProductsDataSummary} fileName={`ProductsSummary`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {searchTerm ? 'Filtered Products' : 'Total Products'}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">{filteredProducts.length}</p>
                                {searchTerm && ProductsDataSummary.length !== filteredProducts.length && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        of {ProductsDataSummary.length} total
                                    </p>
                                )}
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {searchTerm ? 'Filtered Quantity' : 'Total Quantity'}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {searchTerm ? 'Filtered Amount' : 'Total Amount'}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">{Company?.currency?.symbol}{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        {searchTerm ? (
                            <>
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4">
                                    We couldn{"`"}t find any products matching {searchTerm}.
                                </p>
                                <button
                                    onClick={clearSearch}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Show all products
                                </button>
                            </>
                        ) : (
                            <>
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                                <p className="text-gray-600">There are no products to display at the moment.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((product, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                                        {product.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 capitalize">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {product.quantity.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {filteredProducts.map((product, index) => (
                                <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                            {product.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 capitalize">{product.name}</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Rate</p>
                                            <p className="text-sm font-medium text-gray-900">{Company?.currency?.symbol}{product.rate.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Quantity</p>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.quantity.toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                                            <p className="text-sm font-semibold text-green-600">{Company?.currency?.symbol}{product.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}