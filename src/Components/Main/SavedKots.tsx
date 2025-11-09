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

            <h2 className="text-2xl font-bold">Generated Invoice</h2>
            {
                Invoice && (
                    <div
                        className="p-4 border rounded-xl shadow-md bg-white"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                            <h3 className="text-lg font-semibold">
                                Invoice #{Invoice.invoiceId}
                            </h3>
                            <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700">
                                {Invoice.InvoiceStatus}
                            </span>
                        </div>

                        {/* Client / Company Info */}
                        <div className="mb-3">
                            <p className="font-medium">
                                {Invoice.clientName}{" "}
                                {Invoice.clientPhone && (
                                    <span className="text-sm text-gray-500">
                                        ({Invoice.clientPhone})
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-gray-600">{Invoice.companyName}</p>
                            <p className="text-sm text-gray-600">{Invoice.branchName}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(Invoice.issueDate).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Products Table */}
                        <div className="overflow-x-auto mb-3">
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Product</th>
                                        <th className="p-2 text-right">Rate</th>
                                        <th className="p-2 text-right">Qty</th>
                                        <th className="p-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Invoice.products.map((p: any, idx: any) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-2">{p.name}</td>
                                            <td className="p-2 text-right">{p.rate}</td>
                                            <td className="p-2 text-right">{p.quantity}</td>
                                            <td className="p-2 text-right">{p.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="text-right space-y-1">
                            <p>Subtotal: {Invoice.subTotal} {Invoice.currency}</p>
                            <p>Tax: {Invoice.totalTaxAmount} {Invoice.currency}</p>
                            <p className="font-bold">
                                Grand Total: {Invoice.grandTotal} {Invoice.currency}
                            </p>
                        </div>

                        {/* Notes + Payment */}
                        <div className="mt-3 text-sm text-gray-600">
                            <p>Bill Type: {Invoice.BillType}</p>
                            <p>Payment: {Invoice.paymentMode}</p>
                            {Invoice.notes && <p className="italic">Notes: {Invoice.notes}</p>}
                        </div>
                        {/* Created By */}
                        {Invoice.createdBy && (
                            <div className="mt-4 p-3 border-t text-sm bg-gray-50 rounded-lg">
                                <h4 className="font-semibold mb-1">Created By</h4>
                                <p>
                                    <span className="font-medium">{Invoice.createdBy.name}</span>{" "}
                                    <span className="text-gray-500">({Invoice.createdBy.role})</span>
                                </p>
                                <p>Email: {Invoice.createdBy.email}</p>
                                <p>Phone: {Invoice.createdBy.phone}</p>
                            </div>
                        )}
                    </div>
                )
            }

            <h2 className="text-2xl font-bold">KOTs Printed</h2>
            {KOTs?.length === 0 ? (
                <p className="text-gray-500">No KOTs saved yet.</p>
            ) : (
                <div className="space-y-6">
                    {KOTs?.map((kot: any) => (
                        <div
                            key={kot._id}
                            className="p-4 border rounded-xl shadow-md bg-white"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-2 mb-3">
                                <h3 className="text-lg font-semibold">
                                    Invoice #{kot.invoiceId}
                                </h3>
                                <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700">
                                    {kot.InvoiceStatus}
                                </span>
                            </div>

                            {/* Client / Company Info */}
                            <div className="mb-3">
                                <p className="font-medium">
                                    {kot.clientName}{" "}
                                    {kot.clientPhone && (
                                        <span className="text-sm text-gray-500">
                                            ({kot.clientPhone})
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-600">{kot.companyName}</p>
                                <p className="text-sm text-gray-600">{kot.branchName}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(kot.issueDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Products Table */}
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-sm border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 text-left">Product</th>
                                            <th className="p-2 text-right">Rate</th>
                                            <th className="p-2 text-right">Qty</th>
                                            <th className="p-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kot.products.map((p: any, idx: any) => (
                                            <tr key={idx} className="border-t">
                                                <td className="p-2">{p.name}</td>
                                                <td className="p-2 text-right">{p.rate}</td>
                                                <td className="p-2 text-right">{p.quantity}</td>
                                                <td className="p-2 text-right">{p.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="text-right space-y-1">
                                <p>Subtotal: {kot.subTotal} {kot.currency}</p>
                                <p>Tax: {kot.totalTaxAmount} {kot.currency}</p>
                                <p className="font-bold">
                                    Grand Total: {kot.grandTotal} {kot.currency}
                                </p>
                            </div>

                            {/* Notes + Payment */}
                            <div className="mt-3 text-sm text-gray-600">
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
