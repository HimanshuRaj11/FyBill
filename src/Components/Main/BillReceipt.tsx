'use client'
import { IInvoice } from '@/Model/Invoice.model'
import moment from 'moment'
import React from 'react'

export default function BillReceipt({ invoice }: { invoice: IInvoice }) {

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold">INVOICE</h2>
            <div>
                <p>Invoice ID: {invoice.invoiceId}</p>
                <p>From: {invoice.companyName}</p>
                <p>{invoice.companyAddress}</p>
                <p>Date Issued: {moment(invoice.createdAt).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            <div>
                <p>Bill To:</p>
                <p>{invoice.clientName}</p>
                <p>{invoice.clientPhone}</p>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>QTY</th>
                        <th>PRICE</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.products.map((product: any, index: any) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{invoice.currency} {product.rate.toFixed(2)}</td>
                            <td>{invoice.currency} {product.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>SUBTOTAL</td>
                        <td>{invoice.currency} {invoice.subTotal.toFixed(2)}</td>
                    </tr>
                    {invoice?.appliedTaxes?.map((tax: any, index: any) => (
                        <tr key={index}>
                            <td colSpan={3}>{tax.taxName} ({tax.percentage}%)</td>
                            <td>{invoice.currency} {tax.amount}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3}>GRAND TOTAL</td>
                        <td>{invoice.currency} {invoice.grandTotal.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <div>
                <p>Payment Information:</p>
                <p>Payment Mode: {invoice.paymentMode}</p>
            </div>

            <div className="text-center">
                <h2>THANK YOU</h2>
                <p>For your business!</p>
            </div>
        </div>
    )
}