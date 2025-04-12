'use client'
import React, { useEffect, useState } from 'react'
import InvoiceDisplay from '@/Components/Main/InvoiceDisplay'
import { IInvoice } from '@/Model/Invoice.model';
import axios from 'axios';

export default function Page({ params }: { params: Promise<{ InvoiceId: string }> }) {
    const [invoice, setInvoice] = useState<IInvoice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const resolvedParams = React.use(params);

    const fetchInvoice = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/${resolvedParams.InvoiceId}`, { withCredentials: true });
            if (data.success) {
                setInvoice(data.invoice);
                console.log(data.invoice);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchInvoice();
    }, [resolvedParams.InvoiceId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            {!invoice && (
                <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <button
                        onClick={() => fetchInvoice()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Reload Data
                    </button>
                </div>
            )}
            {invoice && <InvoiceDisplay invoice={invoice} />}
        </div>
    )
}
