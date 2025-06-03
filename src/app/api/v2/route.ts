// pages/api/remove-invoice-index.ts
import connectDB from '@/lib/DB';
import { InternalServerError } from '@/lib/handelError';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB()

        const collection = mongoose.connection.collection('invoices');

        // Get all indexes
        const indexes = await collection.indexes();

        // Check if the unique index exists
        const invoiceIndex = indexes.find(index => index.name === 'invoiceId_1' && index.unique);

        if (invoiceIndex) {
            await collection.dropIndex('invoiceId_1');
            return NextResponse.json({ message: 'Unique index on invoiceId dropped successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'No unique index found on invoiceId' });
        }
    } catch (error) {
        console.error('Error dropping index:', error);
        return NextResponse.json(InternalServerError(error as Error), { status: 503 });
    }
}
