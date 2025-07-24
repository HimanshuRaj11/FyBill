'use client'
import axios from 'axios';
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export default function PrintInvoiceFormate({ invoice }: { invoice: any }) {
    const { Company } = useSelector((state: any) => state.Company)
    const Branch = invoice?.branchId;
    const [BranchData, setBranchData] = useState<any>(null);

    let Address;
    if (Branch?.address) {
        Address = Branch?.address?.street + " " + Branch?.address?.city + " " + Branch?.address?.state
    }

    const getBranch = useCallback(async () => {
        try {
            const { data } = await axios.get(`/api/v1/company/branch/${Branch}`,)
            console.log(data);

            if (data.success) {
                setBranchData(data.Branch);
            } else {
                console.error("Failed to fetch branch data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching branch data:", error);

        }
    }, [invoice]);
    useEffect(() => {
        getBranch()
    }, [getBranch])
    return (
        <div className="w-[20rem] mx-auto p-2 text-black uppercase text-">
            <div className="flex justify-end">
                {
                    invoice?.BillType == "KOT" ?
                        <div className="flex flex-row">
                            <p className="text-xl font-bold">#</p>
                            <p className='text-xl font-bold'>
                                {invoice?.BillType}
                            </p>
                        </div>
                        : ""
                }
            </div>
            {/* Header */}
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold">{invoice.companyName}</h2>
                {
                    Address ?
                        <p className="text-sm font-semibold">{Address}</p>
                        :
                        <p className="text-sm font-semibold">{invoice.companyAddress}</p>

                }
                <div className="text-center mb-2 flex gap-1 justify-center">
                    <p className='text-sm font-semibold'>
                        {BranchData?.CountryCode ? BranchData.CountryCode : Company?.CountryCode}
                    </p>
                    <p className='text-sm font-semibold'>
                        {BranchData?.phone ? BranchData.phone : Company?.phone}
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
                        {
                            invoice?.BillType != "KOT" &&
                            <>
                                <th className="text-right py-1">Price</th>
                                <th className="text-right py-1">Total</th>
                            </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {invoice.products.map((product: any, index: any) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="text-left py-1 mx-1 font-semibold">{product.name}
                                {
                                    product?.Specification && <p className="text-sm font-semibold">({product.Specification})</p>
                                }
                            </td>
                            <td className="text-right py-1 mx-1 font-semibold">{product.quantity}</td>
                            {
                                invoice?.BillType != "KOT" &&
                                <>
                                    <td className="text-right py-1 mx-1 font-semibold">{invoice.currency}{product.rate.toFixed(2)}</td>
                                    <td className="text-right py-1 mx-1 font-semibold">{invoice.currency}{product.amount.toFixed(2)}</td>
                                </>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            {
                invoice?.BillType != "KOT" &&
                <div className="text-sm">
                    <div className="flex justify-between py-1 font-bold">
                        <span>Subtotal:</span>
                        <span>{invoice.currency} {invoice.subTotal.toFixed(2)}</span>
                    </div>

                    {invoice?.appliedTaxes?.map((tax: any, index: any) => (
                        <div key={index} className="flex justify-between py-1">
                            <span>{tax.taxName} ({tax.percentage}%):</span>
                            <span>{invoice.currency} {tax.amount.toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="flex justify-between border-t border-gray-400 pt-1 font-bold">
                        <span>TOTAL:</span>
                        <span>{invoice.currency} {invoice.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            }

            {/* Payment Info */}
            {
                invoice?.BillType != "KOT" &&
                <div className="mt-2 text-sm">
                    <p className="font-bold">Payment: {invoice.paymentMode}</p>
                </div>
            }

            {/* Footer */}
            <div className="text-center mt-3 mb-1">
                <p className="font-bold text-sm">THANK YOU</p>
                <p className="text-sm">For your business!</p>
            </div>
        </div>
    )
}