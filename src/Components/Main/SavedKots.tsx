"use client"
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import InvoiceKOTSkeleton from '../Skeleton/InvoiceKOTSkeleton';

// Define types for clarity
interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

interface Tax {
    taxName: string;
    percentage: number;
}

interface Kot {
    invoiceMongoId: string;
    invoiceId: string;
    companyId: string;
    branchId: string;
    clientName: string;
    clientPhone?: string;
    companyName?: string;
    companyAddress?: string;
    branchName?: string;
    issueDate: string;
    products: Product[];
    subTotal: number;
    appliedTaxes?: Tax[];
    totalTaxAmount: number;
    grandTotal: number;
    createdBy: string;
    BillType: string;
    paymentMode: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    currency: string;
    InvoiceStatus: string;
}



export default function SavedKOTs({ InvoiceId }: any) {

    const [KOTs, setKOTs] = useState<Kot[]>([])
    const [Invoice, setSetInvoice] = useState<any>()

    const FetchSavedKOTs = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/kot/${InvoiceId}`)
            const { data: { invoice } } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/${InvoiceId}`, { withCredentials: true });
            if (data.success) {
                setKOTs(data.SavedKOTs)
            }
            if (invoice) {
                setSetInvoice(invoice)
            }

        } catch (error) {

        }

    }, [InvoiceId])

    useEffect(() => {
        FetchSavedKOTs()
    }, [FetchSavedKOTs])
    if (!Invoice || Invoice.length === 0) {
        return (
            <InvoiceKOTSkeleton />
        )
    }
    return (
        <div className="p-4 space-y-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Generated Invoice</h2>
            {
                Invoice && (
                    <div
                        className="p-4 border dark:border-gray-700 rounded-xl shadow-md dark:shadow-gray-900/50 bg-white dark:bg-gray-800"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Invoice #{Invoice.invoiceId}
                            </h3>
                            <span className="px-2 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                                {Invoice.InvoiceStatus}
                            </span>
                        </div>

                        {/* Client / Company Info */}
                        <div className="mb-3">
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {Invoice.clientName}{" "}
                                {Invoice.clientPhone && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({Invoice.clientPhone})
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{Invoice.companyName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{Invoice.branchName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(Invoice.issueDate).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Products Table */}
                        <div className="overflow-x-auto mb-3">
                            <table className="w-full text-sm border dark:border-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-900">
                                    <tr>
                                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">Product</th>
                                        <th className="p-2 text-right text-gray-700 dark:text-gray-300">Rate</th>
                                        <th className="p-2 text-right text-gray-700 dark:text-gray-300">Qty</th>
                                        <th className="p-2 text-right text-gray-700 dark:text-gray-300">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Invoice.products.map((p: any, idx: any) => (
                                        <tr key={idx} className="border-t dark:border-gray-700">
                                            <td className="p-2 text-gray-800 dark:text-gray-200">{p.name}</td>
                                            <td className="p-2 text-right text-gray-800 dark:text-gray-200">{p.rate}</td>
                                            <td className="p-2 text-right text-gray-800 dark:text-gray-200">{p.quantity}</td>
                                            <td className="p-2 text-right text-gray-800 dark:text-gray-200">{p.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="text-right space-y-1 text-gray-800 dark:text-gray-200">
                            <p>Subtotal: {Invoice.subTotal} {Invoice.currency}</p>
                            <p>Tax: {Invoice.totalTaxAmount} {Invoice.currency}</p>
                            <p className="font-bold">
                                Grand Total: {Invoice.grandTotal} {Invoice.currency}
                            </p>
                        </div>

                        {/* Notes + Payment */}
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            <p>Bill Type: {Invoice.BillType}</p>
                            <p>Payment: {Invoice.paymentMode}</p>
                            {Invoice.notes && <p className="italic">Notes: {Invoice.notes}</p>}
                        </div>
                        {/* Created By */}
                        {Invoice.createdBy && (
                            <div className="mt-4 p-3 border-t dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Created By</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{Invoice.createdBy.name}</span>{" "}
                                    <span className="text-gray-500 dark:text-gray-400">({Invoice.createdBy.role})</span>
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">Email: {Invoice.createdBy.email}</p>
                                <p className="text-gray-700 dark:text-gray-300">Phone: {Invoice.createdBy.phone}</p>
                            </div>
                        )}
                    </div>
                )
            }

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">KOTs Printed</h2>
            {KOTs?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No KOTs saved yet.</p>
            ) : (
                <div className="space-y-6">
                    {KOTs?.map((kot: any) => (
                        <div
                            key={kot._id}
                            className="p-4 border dark:border-gray-700 rounded-xl shadow-md dark:shadow-gray-900/50 bg-white dark:bg-gray-800"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2 mb-3">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    Invoice #{kot.invoiceId}
                                </h3>
                                <span className="px-2 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                                    {kot.InvoiceStatus}
                                </span>
                            </div>

                            {/* Client / Company Info */}
                            <div className="mb-3">
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {kot.clientName}{" "}
                                    {kot.clientPhone && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            ({kot.clientPhone})
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{kot.companyName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{kot.branchName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(kot.issueDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Products Table */}
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-sm border dark:border-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-900">
                                        <tr>
                                            <th className="p-2 text-left text-gray-700 dark:text-gray-300">Product</th>
                                            <th className="p-2 text-right text-gray-700 dark:text-gray-300">Rate</th>
                                            <th className="p-2 text-right text-gray-700 dark:text-gray-300">Qty</th>
                                            <th className="p-2 text-right text-gray-700 dark:text-gray-300">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kot.products.map((p: any, idx: any) => (
                                            <tr key={idx} className="border-t dark:border-gray-700">
                                                <td className="p-2 text-gray-800 dark:text-gray-200">{p.name}</td>
                                                <td className="p-2 text-right text-gray-800 dark:text-gray-200">{p.rate}</td>
                                                <td className="p-2 text-right text-gray-800 dark:text-gray-200">{p.quantity}</td>
                                                <td className="p-2 text-right text-gray-800 dark:text-gray-200">{p.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="text-right space-y-1 text-gray-800 dark:text-gray-200">
                                <p>Subtotal: {kot.subTotal} {kot.currency}</p>
                                <p>Tax: {kot.totalTaxAmount} {kot.currency}</p>
                                <p className="font-bold">
                                    Grand Total: {kot.grandTotal} {kot.currency}
                                </p>
                            </div>

                            {/* Notes + Payment */}
                            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                <p>Bill Type: {kot.BillType}</p>
                                <p>Payment: {kot.paymentMode}</p>
                                {kot.notes && <p className="italic">Notes: {kot.notes}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}