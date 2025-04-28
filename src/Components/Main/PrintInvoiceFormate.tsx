import moment from 'moment'
import React from 'react'

export default function PrintInvoiceFormate({ invoice }: { invoice: any }) {

    return (
        <>

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">INVOICE</h2>
                        <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-lg font-bold text-lg">
                            {invoice.invoiceId}
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
                                    <td className="p-4 text-gray-800 text-right">{invoice.currency} {product.rate.toFixed(2)}</td>
                                    <td className="p-4 text-gray-800 text-right font-medium">{invoice.currency} {product.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr className="border-t-2 border-gray-200">
                                <td className="p-4 text-gray-700 font-medium" colSpan={3}>SUBTOTAL</td>
                                <td className="p-4 text-gray-800 text-right font-bold">{invoice.currency} {invoice.subTotal.toFixed(2)}</td>
                            </tr>
                            {invoice?.appliedTaxes?.map((tax: any, index: any) => (
                                <tr key={index}>
                                    <td className="p-4 text-gray-700" colSpan={3}>
                                        {tax.taxName} ({tax.percentage}%)
                                    </td>
                                    <td className="p-4 text-gray-800 text-right">
                                        {invoice.currency} {tax.amount}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t-2 border-gray-200 bg-gray-100">
                                <td className="p-4 text-gray-800 font-bold text-lg" colSpan={3}>GRAND TOTAL</td>
                                <td className="p-4 text-gray-800 font-bold text-lg text-right">{invoice.currency} {invoice.grandTotal.toFixed(2)}</td>
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


        </>
    )
}
