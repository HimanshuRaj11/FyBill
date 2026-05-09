'use client'
import BillingComponent from '@/Components/Main/CreateBill'
import PrintInvoiceFormate from '@/Components/Main/PrintInvoiceFormate';
import HeldInvoices from '@/Components/Other/HeldInvoices';
import PreLoader from '@/Components/Other/PreLoader';

import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/Components/ui/dialog';
import axios from 'axios';
import { Receipt } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

export default function Page() {
    const [HoldInvoices, setHoldInvoices] = useState<any>(null);
    const [HoldInvoiceUpdate, setHoldInvoiceUpdate] = useState<any>(null)
    const [invoice, setInvoice] = useState<any>(null);
    const [showInvoice, setShowInvoice] = useState(false);




    const FetchHoldInvoices = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/fetchHoldInvoices`)
            if (data.success) {
                setHoldInvoices(data.invoices);
            }
        } catch (error) {
            return
        }
    }
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrintDocument = (event: React.MouseEvent) => {
        event.preventDefault();
        if (invoiceRef.current) {
            const printContents = invoiceRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
        setShowInvoice(false);
    };

    useEffect(() => {
        FetchHoldInvoices()
    }, [])

    return (
        <div className=''>

            <BillingComponent HoldInvoiceUpdate={HoldInvoiceUpdate} setHoldInvoices={setHoldInvoices} />
            {
                HoldInvoices?.length > 0 && (
                    <HeldInvoices setShowInvoice={setShowInvoice} setInvoice={setInvoice} HoldInvoices={HoldInvoices} setHoldInvoiceUpdate={setHoldInvoiceUpdate} />
                )
            }
            {showInvoice && invoice && (
                <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                    <DialogContent className="max-w-4xl w-full">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Receipt className="h-6 w-6" />
                            Invoice #{invoice.invoiceNumber}
                        </DialogTitle>
                        <div ref={invoiceRef} className="max-h-[70vh] overflow-auto p-4 border rounded-lg">
                            <PrintInvoiceFormate invoice={invoice} />
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handlePrintDocument}
                                className="cursor-pointer px-8"
                                size="lg"
                            >
                                Print Invoice
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
