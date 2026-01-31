'use client'
import React from 'react'
import { AlwaysDeleteInvoiceByName } from '@/data/InvoiceData'
import { Button } from '@/Components/ui/button'
import axios from 'axios';

export default function AlwaysDelete() {
    const [loading, setLoading] = React.useState(false);

    const deleteInvoice = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/v1/SuperAdmin/invoice/always_delete',);
            if (data.success) {
                alert('Invoices Deleted Successfully');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4'>Always Delete Invoices</h1>
            <p className='mb-2'>The following invoice names will always be marked for deletion unless marked important:</p>
            <ul className='list-disc list-inside'>
                {AlwaysDeleteInvoiceByName.map((name, index) => (
                    <li key={index} className='text-gray-700'>{name}</li>
                ))}
            </ul>
            <Button onClick={deleteInvoice} disabled={loading} variant="destructive" className='mt-4'>
                {loading ? 'Deleting...' : 'Delete All Non-Important Invoices'}
            </Button>
        </div>
    )
}
