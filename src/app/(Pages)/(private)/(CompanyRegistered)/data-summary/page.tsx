'use client'
import axios from 'axios'
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/Components/ui/button';
import { ChevronDown, Filter, Search, X, RefreshCw, Package, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import DownloadExcel from '@/Components/Other/DownloadExcel';
import PreLoader from '@/Components/Other/PreLoader';
import InvoiceDateFilter from '@/Components/Other/InvoiceDateFilter';
import { useGlobalContext } from '@/context/contextProvider';
import { formatDateRange } from '@/lib/formatDateRange';
import ProductSkeleton from './skeleton';

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
    // Search state
    const [searchTerm, setSearchTerm] = useState('')

    const {
        selectedBranch,
        setSelectedBranch,
        startDate,
        endDate,
    } = useGlobalContext();
    const dateRangeString = formatDateRange(startDate, endDate)


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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 max-w-md w-full mx-4">
                    <div className="text-red-500 dark:text-red-400 text-center mb-4">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">Error Loading Data</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
                    <button
                        onClick={getProductData}
                        className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Sales Summary</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your product performance</p>
                        </div>
                        <button
                            onClick={getProductData}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Branch Selection */}
                {User?.role === "Owner" && (
                    <div className="flex flex-row justify-start mb-6 gap-2 flex-wrap">
                        <div
                            onClick={() => setSelectedBranch("All")}
                            className={`flex justify-center items-center px-4 py-2 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 ${selectedBranch === "All"
                                ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md"
                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                                    className={`flex justify-center items-center px-4 py-2 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 ${selectedBranch === branch?._id
                                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md"
                                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                )}

                {/* Search and Filter */}
                <div className="flex justify-between flex-col  gap-3 mb-6">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </button>
                        )}
                    </div>

                    <InvoiceDateFilter />
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {dateRangeString} Sales Data
                        {searchTerm && (
                            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                                - Showing results for {"'"}{searchTerm}{"'"}
                            </span>
                        )}
                    </h2>
                </div>

                <div className="mb-4">
                    <DownloadExcel data={ProductsDataSummary} fileName={`ProductsSummary`} />
                </div>
                {
                    loading ? (
                        <ProductSkeleton />
                    ) : (
                        <div className="">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {searchTerm ? 'Filtered Products' : 'Total Products'}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{filteredProducts.length}</p>
                                            {searchTerm && ProductsDataSummary.length !== filteredProducts.length && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    of {ProductsDataSummary.length} total
                                                </p>
                                            )}
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                                            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {searchTerm ? 'Filtered Quantity' : 'Total Quantity'}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalQuantity.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                                            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {searchTerm ? 'Filtered Amount' : 'Total Amount'}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{Company?.currency?.symbol}{totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
                                            <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {filteredProducts.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                                    {searchTerm ? (
                                        <>
                                            <Search className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                We couldn{"'"}t find any products matching {"'"}{searchTerm}{"'"}.
                                            </p>
                                            <button
                                                onClick={clearSearch}
                                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                            >
                                                Show all products
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Products Found</h3>
                                            <p className="text-gray-600 dark:text-gray-400">There are no products to display at the moment.</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Details</h2>
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Name</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredProducts.map((product, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 shadow-md">
                                                                    {product.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{product.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                                {product.quantity.toLocaleString()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredProducts.map((product, index) => (
                                            <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                                <div className="flex items-center mb-4">
                                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md">
                                                        {product.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{product.name}</h3>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rate</p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{Company?.currency?.symbol}{product.rate.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                            {product.quantity.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount</p>
                                                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">{Company?.currency?.symbol}{product.amount.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

            </div>
        </div>
    )
}