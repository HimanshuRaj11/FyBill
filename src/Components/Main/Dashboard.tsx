"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Download, Plus, X, ChevronDown, Filter, Search, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { IoIosCloseCircle } from 'react-icons/io'
import BillingComponent from './CreateBill'
import InvoiceDisplay from './Invoice'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
    const [ShowInvoice, setShowInvoice] = useState(false)
    const [CreateBill, setCreateBill] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [searchQuery, setSearchQuery] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Simulate loading data
    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Modal Overlays */}
            <AnimatePresence>
                {CreateBill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="z-50 fixed inset-0 backdrop-blur-md bg-black/30 flex justify-center items-center p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setCreateBill(false)}
                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                            <BillingComponent setCreateBill={setCreateBill} ShowInvoice={ShowInvoice} setShowInvoice={setShowInvoice} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {ShowInvoice && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="z-50 fixed inset-0 backdrop-blur-md bg-black/30 flex justify-center items-center p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowInvoice(false)}
                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                            <InvoiceDisplay />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your business.</p>
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
                    <Button
                        variant="outline"
                        className="!rounded-lg whitespace-nowrap flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button
                        onClick={() => setCreateBill(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white !rounded-lg whitespace-nowrap flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Invoice
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4 overflow-x-auto pb-1">
                    {['overview', 'invoices', 'customers', 'reports'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Search and Filter */}
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
                                    <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
                                        <option>Last 7 days</option>
                                        <option>Last 30 days</option>
                                        <option>Last 90 days</option>
                                        <option>Custom range</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
                                        <option>All</option>
                                        <option>Paid</option>
                                        <option>Pending</option>
                                        <option>Overdue</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="outline" size="sm" className="mr-2">Reset</Button>
                                    <Button size="sm">Apply</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$124,563.00</div>
                        <div className="flex items-center mt-1">
                            <span className="bg-green-100 text-green-800 border-green-800 border-2 rounded-2xl px-2 hover:bg-green-100">+12.5%</span>
                            <span className="text-xs text-gray-500 ml-2">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$38,000.00</div>
                        <div className="flex items-center mt-1">
                            <span className="bg-green-100 border-green-800 border-2 rounded-2xl px-2 text-green-800 hover:bg-green-100">+5.3%</span>
                            <span className="text-xs text-gray-500 ml-2">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,543</div>
                        <div className="flex items-center mt-1">
                            <span className="border-green-800 border-2 rounded-2xl px-2 bg-green-100 text-green-800 hover:bg-green-100">+7.1%</span>
                            <span className="text-xs text-gray-500 ml-2">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <div className="flex items-center mt-1">
                            <span className="bg-amber-100 border-amber-800 border-2 rounded-2xl px-2 text-amber-800 hover:bg-amber-100">$12,350.00</span>
                            <span className="text-xs text-gray-500 ml-2">total amount</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue for the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div id="revenue-chart" className="h-80 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">Chart will be rendered here</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Subscription Distribution</CardTitle>
                        <CardDescription>Active subscriptions by plan type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div id="subscription-chart" className="h-80 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">Chart will be rendered here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">INV-{1000 + item}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Customer {item}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(Math.random() * 1000).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item % 3 === 0 ? 'bg-green-100 text-green-800' :
                                                item % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {item % 3 === 0 ? 'Paid' : item % 3 === 1 ? 'Pending' : 'Overdue'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-{String(item).padStart(2, '0')}-{String(item * 5).padStart(2, '0')}</td>
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

