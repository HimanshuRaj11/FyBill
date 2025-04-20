'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useSelector } from 'react-redux'


export default function DashboardTopCards({ Invoice }: { Invoice: any }) {
    const { Company } = useSelector((state: any) => state.Company)
    const company = Company
    const totalRevenue = Invoice.reduce((acc: number, invoice: any) => acc + invoice.grandTotal, 0)
    const totalTaxes = Invoice.reduce((acc: number, invoice: any) => acc + invoice.totalTaxAmount, 0).toFixed(2)
    const ActualRevenue = totalRevenue - totalTaxes
    const totalInvoice = Invoice.length
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold bg-amber-100 border-amber-800 border-2 rounded-2xl px-2 text-amber-800 hover:bg-amber-100 w-fit"> {company?.currency.symbol} {totalRevenue}</div>
                    {/* <div className="flex items-center mt-1">
                        <span className="bg-green-100 text-green-800 border-green-800 border-2 rounded-2xl px-2 hover:bg-green-100">+12.5%</span>
                        <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div> */}
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Taxes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold bg-red-100 border-red-800 border-2 rounded-2xl px-2 text-red-800 hover:bg-red-100 w-fit"> {company?.currency.symbol} {totalTaxes}</div>
                    {/* <div className="flex items-center mt-1">
                        <span className="bg-green-100 border-green-800 border-2 rounded-2xl px-2 text-green-800 hover:bg-green-100">+5.3%</span>
                        <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div> */}
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Actual Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold bg-green-100 border-green-800 border-2 rounded-2xl px-2 text-green-800 hover:bg-green-100 w-fit"> {company?.currency.symbol} {ActualRevenue}</div>
                    {/* <div className="flex items-center mt-1">
                        <span className="border-green-800 border-2 rounded-2xl px-2 bg-green-100 text-green-800 hover:bg-green-100">+7.1%</span>
                        <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div> */}
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold"> {totalInvoice}</div>
                    {/* <div className="flex items-center mt-1">
                        <span className="bg-amber-100 border-amber-800 border-2 rounded-2xl px-2 text-amber-800 hover:bg-amber-100">$12,350.00</span>
                        <span className="text-xs text-gray-500 ml-2">total amount</span>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    )
}
