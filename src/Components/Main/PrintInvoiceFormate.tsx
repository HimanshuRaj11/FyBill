'use client'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux';

export default function PrintInvoiceFormate({ invoice }: { invoice: any }) {
    const { Company } = useSelector((state: any) => state.Company)
    const Branch = invoice?.branchId;
    const Address = Branch?.address.street + " " + Branch?.address.city + " " + Branch?.address.state


    const formatPhoneNumber = (phone: number) => {
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone; // return original if format fails
    }
    return (
        <div className="w-[20rem] mx-auto p-2 text-black uppercase text-">
            {/* Header */}
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold">{invoice.companyName}</h2>
                {
                    Address ?
                        <p className="text-sm font-semibold">{Address}</p>
                        :
                        <p className="text-sm font-semibold">{invoice.companyAddress}</p>

                }
                <div className="text-center mb-2">
                    <p className='text-sm font-semibold'>
                        {Branch?.phone ? formatPhoneNumber(Branch.phone) : formatPhoneNumber(Company?.phone)}
                    </p>

                </div>
                <div className="text-sm font-bold mt-1">INVOICE: {invoice.invoiceId}</div>
                <div className="text-sm font-semibold">
                    Date: {moment(invoice.createdAt).format('DD/MM/YYYY hh:mm A')}
                </div>
            </div>

            {/* Customer Info */}
            <div className="mb-2 border-t border-b border-gray-400 py-1">
                <p className="text-sm font-bold">Customer: {invoice.clientName}</p>
                <p className="text-sm">Phone: {invoice.clientPhone}</p>
            </div>

            {/* Items Table */}
            <table className="w-full text-sm mb-2">
                <thead>
                    <tr className="border-b border-gray-400">
                        <th className="text-left py-1">Item</th>
                        <th className="text-right py-1">Qty</th>
                        <th className="text-right py-1">Price</th>
                        <th className="text-right py-1">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.products.map((product: any, index: any) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="text-left py-1  font-semibold">{product.name}</td>
                            <td className="text-right py-1  font-semibold">{product.quantity}</td>
                            <td className="text-right py-1  font-semibold">{invoice.currency}{product.rate.toFixed(2)}</td>
                            <td className="text-right py-1  font-semibold">{invoice.currency}{product.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="text-sm">
                <div className="flex justify-between py-1 font-bold">
                    <span>Subtotal:</span>
                    <span>{invoice.currency} {invoice.subTotal.toFixed(2)}</span>
                </div>

                {invoice?.appliedTaxes?.map((tax: any, index: any) => (
                    <div key={index} className="flex justify-between py-1">
                        <span>{tax.taxName} ({tax.percentage}%):</span>
                        <span>{invoice.currency} {tax.amount}</span>
                    </div>
                ))}

                <div className="flex justify-between border-t border-gray-400 pt-1 font-bold">
                    <span>TOTAL:</span>
                    <span>{invoice.currency} {invoice.grandTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Info */}
            <div className="mt-2 text-sm">
                <p className="font-bold">Payment: {invoice.paymentMode}</p>
            </div>

            {/* Footer */}
            <div className="text-center mt-3 mb-1">
                <p className="font-bold text-sm">THANK YOU</p>
                <p className="text-sm">For your business!</p>
            </div>
        </div>
    )
}