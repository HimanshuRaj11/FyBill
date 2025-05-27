'use client'
import { useState } from 'react';
import { X, Clock, ChevronUp, ChevronDown, Search, Edit2, Printer, Receipt } from 'lucide-react';
import moment from 'moment';
import { Button } from '../ui/button';

const HeldInvoices = ({ HoldInvoices, setHoldInvoiceUpdate, setShowInvoice, setInvoice }: { setInvoice: any, setShowInvoice: any, HoldInvoices: any, setHoldInvoiceUpdate: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const ClickToModify = (invoice: any) => {
        setHoldInvoiceUpdate(invoice)
        setIsExpanded(false)
    }
    const HandlePrintKOT = async (Invoice: any) => {
        try {
            setInvoice(Invoice)
            setShowInvoice(true)
        } catch (error) {

        }
    }


    return (
        <div className={`fixed bottom-0 cursor-pointer left-0 right-0 bg-white shadow-lg rounded-t-lg transition-all duration-300 ${isExpanded ? 'h-96' : 'h-16'}`}>
            {/* Header bar */}
            <div onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="bg-amber-500 rounded-full p-2 mr-3">
                        <Clock size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Held & KOT Invoices</h3>
                        <p className="text-xs text-gray-500">{HoldInvoices?.length} invoices on hold & KOT</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 rounded-full hover:bg-gray-100 hover:text-black"
                >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </Button>

            </div>

            {/* Content area (visible only when expanded) */}
            {isExpanded && (
                <div className="overflow-y-auto max-h-80 p-4">
                    {HoldInvoices?.length > 0 ? (
                        <div className="grid gap-3">
                            {HoldInvoices?.map((invoice: any, i: number) => (
                                <div key={invoice?._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-amber-500 transition-colors">
                                    <div className="flex items-center">
                                        {invoice.BillType === 'KOT' && (
                                            <div className=" px-2 -rotate-90 bg-amber-700 w-fit rounded">KOT </div>
                                        )}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold mr-3">

                                            {invoice?.clientName?.charAt(0) || i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{invoice?.clientName}</p>

                                            <p className="text-xs text-gray-500">Held on {moment(invoice?.updatedAt).format('MMMM Do YYYY, h:mm A')}</p>

                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-800 mr-3 ">{invoice?.currency} {' '} {invoice?.grandTotal}</span>

                                        <Button onClick={() => HandlePrintKOT(invoice)} className=" ">
                                            <Printer /> <span className=' group-hover:text-red-500'>Print</span>
                                        </Button>
                                        <Button onClick={() => { ClickToModify(invoice) }} className=" ">
                                            <Edit2 /> <span className=' group-hover:text-red-500'>Edit</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Clock size={24} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500">No matching held invoices found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default HeldInvoices;