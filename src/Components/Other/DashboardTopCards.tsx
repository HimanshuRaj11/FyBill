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
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-amber-100 border-amber-800 border-2 rounded-2xl px-2 text-amber-800 hover:bg-amber-100 w-fit">
                            {company?.currency.symbol} {filteredRevenue}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Taxes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-red-100 border-red-800 border-2 rounded-2xl px-2 text-red-800 hover:bg-red-100 w-fit">
                            {company?.currency.symbol} {filteredTaxes}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Actual Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-green-100 border-green-800 border-2 rounded-2xl px-2 text-green-800 hover:bg-green-100 w-fit">
                            {company?.currency.symbol} {filteredActualRevenue}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredInvoiceCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown by Payment Mode Card */}
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
                                    {company?.currency.symbol} {getRevenueByPaymentMode(mode)}
                                </div>
                                <div className="text-xs text-gray-500">
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