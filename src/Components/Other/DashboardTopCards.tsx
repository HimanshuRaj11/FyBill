'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useSelector } from 'react-redux'
import DashboardCardsSkeleton from '../Skeleton/DashboardCardsSkeleton'

const paymentModes = [
    "cash", "upi", "netBanking", "card"
]

export default function DashboardTopCards({ Invoice, loading }: { Invoice: any, loading: boolean }) {
    const { Company } = useSelector((state: any) => state.Company)
    const company = Company
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string | null>(null)

    // Calculate totals for all invoices
    const totalRevenue = (Invoice.reduce((acc: number, invoice: any) => acc + invoice.grandTotal, 0)).toFixed(2)
    const totalTaxes = Invoice.reduce((acc: number, invoice: any) => acc + invoice.totalTaxAmount, 0).toFixed(2)
    const ActualRevenue = (totalRevenue - totalTaxes).toFixed(2)
    const totalInvoice = Invoice.length

    // Calculate revenue by payment mode
    const getRevenueByPaymentMode = (mode: string) => {
        return Invoice.filter((invoice: any) => invoice.paymentMode?.toLowerCase() === mode.toLowerCase())
            .reduce((acc: number, invoice: any) => acc + invoice.grandTotal, 0)
            .toFixed(2)
    }

    const getTaxesByPaymentMode = (mode: string) => {
        return Invoice.filter((invoice: any) => invoice.paymentMode?.toLowerCase() === mode.toLowerCase())
            .reduce((acc: number, invoice: any) => acc + invoice.totalTaxAmount, 0)
            .toFixed(2)
    }

    const getInvoiceCountByPaymentMode = (mode: string) => {
        return Invoice.filter((invoice: any) => invoice.paymentMode?.toLowerCase() === mode.toLowerCase()).length
    }

    const filteredRevenue = selectedPaymentMode ? getRevenueByPaymentMode(selectedPaymentMode) : totalRevenue
    const filteredTaxes = selectedPaymentMode ? getTaxesByPaymentMode(selectedPaymentMode) : totalTaxes
    const filteredActualRevenue = (parseFloat(filteredRevenue) - parseFloat(filteredTaxes)).toFixed(2)
    const filteredInvoiceCount = selectedPaymentMode ? getInvoiceCountByPaymentMode(selectedPaymentMode) : totalInvoice

    if (loading) {
        return <DashboardCardsSkeleton />
    }

    return (
        <>
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                {/* Total Revenue Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-amber-100 dark:bg-amber-900/30 border-amber-800 dark:border-amber-600 border-2 rounded-2xl px-2 text-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 w-fit transition-colors">
                            {company?.currency.symbol} {filteredRevenue}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Taxes Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Taxes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-red-100 dark:bg-red-900/30 border-red-800 dark:border-red-600 border-2 rounded-2xl px-2 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 w-fit transition-colors">
                            {company?.currency.symbol} {filteredTaxes}
                        </div>
                    </CardContent>
                </Card>

                {/* Actual Revenue Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Actual Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-green-100 dark:bg-green-900/30 border-green-800 dark:border-green-600 border-2 rounded-2xl px-2 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 w-fit transition-colors">
                            {company?.currency.symbol} {filteredActualRevenue}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Invoices Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Invoices
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {filteredInvoiceCount}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown by Payment Mode Card */}
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
                                    {company?.currency.symbol} {getRevenueByPaymentMode(mode)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {getInvoiceCountByPaymentMode(mode)} invoice{getInvoiceCountByPaymentMode(mode) !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}