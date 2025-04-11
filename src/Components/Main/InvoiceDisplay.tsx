'use client'
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Download, Printer, Share2, Mail, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { IInvoice } from "@/Model/Invoice.model";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function InvoiceDisplay({ invoice }: { invoice: any }) {
    const { User } = useSelector((state: any) => state.User);
    const user = User?.user

    const [isPrinting, setIsPrinting] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const handlePrint = () => {
        if (invoiceRef.current) {
            setIsPrinting(true);
            const printContents = invoiceRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
            setIsPrinting(false);
        }
    };

    if (!invoice) return <div className="p-4 text-center text-gray-500">No invoice data available</div>;


    const deleteInvoice = async () => {
        const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/${invoice.invoiceId}/delete`, { withCredentials: true });
        if (data.success) {
            toast.success("Invoice deleted successfully");
            router.back();
        } else {
            toast.error("Failed to delete invoice");
        }
    }
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="w-full sm:w-auto flex items-center gap-3">
                    <div className="w-full">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
                            Invoice #{invoice.invoiceId}
                        </h1>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end gap-2">

                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100 text-sm sm:text-base cursor-pointer">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100 text-sm sm:text-base cursor-pointer">
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100 text-sm sm:text-base cursor-pointer">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Email</span>
                    </Button>
                    {
                        user?.role === "admin" || user?.role === "Owner" && (
                            <Button onClick={deleteInvoice} variant="outline" className="flex items-center gap-2 hover:bg-red-100 text-red-600 text-sm sm:text-base cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        )
                    }
                    <Button
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                    >
                        <Printer className="h-4 w-4" />
                        <span>{isPrinting ? 'Printing...' : 'Print'}</span>
                    </Button>
                </div>
            </div>

            {/* Invoice Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
                <div ref={invoiceRef} className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">INVOICE</h2>
                            <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-lg font-bold text-lg">
                                #{invoice.invoiceId}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-gray-500 space-y-1">
                                <p className="font-medium">From:</p>
                                <p className="text-lg">{invoice.companyName}</p>
                                <p className="text-sm">{invoice.companyAddress}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end space-y-4">
                            <div className="text-left md:text-right text-gray-500">
                                <p className="font-medium">Date Issued:</p>
                                <p>{moment(invoice.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-700 mb-2">Bill To:</p>
                            <p className="text-gray-800 font-medium text-lg">{invoice.clientName}</p>
                            <p className="text-gray-600">{invoice.clientPhone}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-4 font-semibold text-gray-700">Product</th>
                                    <th className="p-4 font-semibold text-gray-700 text-right">QTY</th>
                                    <th className="p-4 font-semibold text-gray-700 text-right">PRICE</th>
                                    <th className="p-4 font-semibold text-gray-700 text-right">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {invoice.products.map((product: any, index: any) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="p-4 text-gray-800">{product.name}</td>
                                        <td className="p-4 text-gray-800 text-right">{product.quantity}</td>
                                        <td className="p-4 text-gray-800 text-right">${product.rate.toFixed(2)}</td>
                                        <td className="p-4 text-gray-800 text-right font-medium">${product.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr className="border-t-2 border-gray-200">
                                    <td className="p-4 text-gray-700 font-medium" colSpan={3}>SUBTOTAL</td>
                                    <td className="p-4 text-gray-800 text-right font-bold">${invoice.subTotal.toFixed(2)}</td>
                                </tr>
                                {invoice?.appliedTaxes?.map((tax: any, index: any) => (
                                    <tr key={index}>
                                        <td className="p-4 text-gray-700" colSpan={3}>
                                            {tax.taxName} ({tax.percentage}%)
                                        </td>
                                        <td className="p-4 text-gray-800 text-right">
                                            ${tax.amount}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-gray-200 bg-gray-100">
                                    <td className="p-4 text-gray-800 font-bold text-lg" colSpan={3}>GRAND TOTAL</td>
                                    <td className="p-4 text-gray-800 font-bold text-lg text-right">${invoice.grandTotal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="font-semibold text-gray-700 mb-4">Payment Information:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-4 rounded-md shadow-sm">
                                    <p className="text-sm text-gray-500 mb-1">Payment Mode</p>
                                    <p className="font-medium text-gray-800">{invoice.paymentMode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center py-8">
                            <div className="text-4xl sm:text-5xl font-bold text-gray-200 mb-2">THANK YOU</div>
                            <p className="text-gray-500">For your business!</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* User Details */}
            <div className='flex justify-end mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm'>
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
                    <div className='flex items-center gap-2'>
                        <span className='text-gray-400'>Created By:</span>
                        <p className='text-gray-700 font-medium hover:text-blue-600 transition-colors'>
                            {invoice?.createdBy?.name}
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-gray-400'>Email:</span>
                        <p className='text-gray-700 font-medium hover:text-blue-600 transition-colors'>
                            {invoice?.createdBy?.email}
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-gray-400'>Phone:</span>
                        <p className='text-gray-700 font-medium hover:text-blue-600 transition-colors'>
                            {invoice?.createdBy?.phone}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}