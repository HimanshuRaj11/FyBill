'use client';
import React, { useEffect, useState } from 'react';
import BranchData from './BranchData';
import BranchInvoiceData from './BranchInvoiceData';
import axios from 'axios';
import { useGlobalContext } from '@/context/contextProvider';
import ArrangeInvoice from './ArrangeInvoice';


export default function page({ params }: { params: Promise<{ branchId: string }> }) {
    const {
        startDate,
        endDate,
        dateRange
    } = useGlobalContext();

    const { branchId } = React.use(params);
    const [branchData, setBranchData] = useState<any>(null);
    const [invoiceData, setInvoiceData] = useState<any>(null);



    useEffect(() => {
        !branchData && fetchBranchData();
    }, []);
    const fetchBranchData = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/SuperAdmin/branch/${branchId}`);
            setBranchData(data.Branch);
        } catch (error) {
        }
    }

    useEffect(() => {
        fetchBranchInvoiceData();
    }, [startDate, endDate, dateRange]);

    const fetchBranchInvoiceData = async () => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/SuperAdmin/branch/${branchId}/invoice-data`,
                { startDate, endDate });
            setInvoiceData(data);
        } catch (error) {
        }
    }
    return (
        <div>
            <BranchData data={branchData} />
            <BranchInvoiceData invoiceData={invoiceData} />
            <ArrangeInvoice data={branchData} invoiceData={invoiceData} />

        </div>
    )
}
