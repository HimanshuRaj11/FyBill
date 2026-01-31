'use client'
import { useGlobalContext } from '@/context/contextProvider';
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { formatDateRange } from '@/lib/formatDateRange'
import { FetchInvoicesList } from '@/app/Redux/Slice/Invoice.slice';
import axios from 'axios';

import AlwaysDelete from './AlwaysDelete';
import SummaryCards from './SummaryCards';
import List from './List';

const base_url = process.env.NEXT_PUBLIC_BASE_URL

export interface I_Invoice {
    _id: string;
    invoiceId: string;
    invoiceIdTrack: string;
    clientName: string;
    branchName: string;
    currency: string;
    grandTotal: number;
    paymentMode: string;
    createdAt: string;
    kotCount?: number;
    important?: boolean;
    delete?: boolean;
}

export default function ApiCalls() {
    const dispatch = useDispatch();
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company)
    const { Invoices, loading: InvoiceLoading } = useSelector((state: any) => state.Invoices)

    const [searchResults, setSearchResults] = useState<I_Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        selectedBranch,
        setSelectedBranch,
        startDate,
        endDate,
    } = useGlobalContext();

    const dateRangeString = formatDateRange(startDate, endDate)
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Determine which invoices to display
    const displayedInvoices = useMemo(() => {
        return searchQuery.trim() ? searchResults : (Invoices || []);
    }, [searchQuery, searchResults, Invoices]);

    // Calculate totals based on displayed invoices
    const selectedTotal = useMemo(() => {
        return selectedInvoices.reduce((total, invoiceId) => {
            const invoice = displayedInvoices.find((inv: I_Invoice) => inv._id === invoiceId);
            return total + (invoice?.grandTotal || 0);
        }, 0);
    }, [selectedInvoices, displayedInvoices]);

    const Total = useMemo(() => {
        return displayedInvoices.reduce((total: number, invoice: I_Invoice) => {
            return total + (invoice?.grandTotal || 0);
        }, 0);
    }, [displayedInvoices]);

    const remainingTotal = useMemo(() => {
        return Total - selectedTotal;
    }, [Total, selectedTotal]);

    const currency = displayedInvoices?.[0]?.currency || '';

    // Fetch invoices when filters change
    const FilterInvoice = useCallback(async () => {
        try {
            dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setError('Failed to load invoices');
        }
    }, [dispatch, selectedBranch, startDate, endDate]);

    // Only fetch on mount and filter changes
    useEffect(() => {
        FilterInvoice();
    }, [FilterInvoice]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchInvoices(searchQuery.trim());
            } else {
                setSearchResults([]);
                setError(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchInvoices = async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `${base_url}/api/v1/Invoice/search`,
                { query },
                { withCredentials: true }
            );

            setSearchResults(data.invoices || []);
        } catch (error: any) {
            console.error('Error fetching invoices:', error);
            setError(error.response?.data?.message || 'Failed to search invoices');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setError(null);
        setSelectedInvoices([]);
    };

    const handleSelectInvoice = (invoiceId: string) => {
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    };

    const handleSelectAll = () => {
        if (selectedInvoices.length === displayedInvoices.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(displayedInvoices.map((inv: I_Invoice) => inv._id));
        }
    };

    const handleSetImportantSelected = async () => {
        if (selectedInvoices.length === 0) {
            alert('Please select invoices to mark as important');
            return;
        }

        const confirmAction = window.confirm(
            `Are you sure you want to mark ${selectedInvoices.length} invoice(s) as important?`
        );

        if (!confirmAction) return;

        setIsProcessing(true);
        try {
            const { data } = await axios.post(
                `${base_url}/api/v1/Invoice/setImportant`,
                { data: { invoiceIds: selectedInvoices } },
                { withCredentials: true }
            );

            if (data.success) {
                await FilterInvoice();
                setSelectedInvoices([]);
                alert('Invoices marked as important successfully');

                // If search was active, refresh search results
                if (searchQuery.trim()) {
                    await fetchInvoices(searchQuery.trim());
                }
            }
        } catch (error: any) {
            console.error('Error marking invoices as important:', error);
            alert(error.response?.data?.message || 'Failed to mark invoices as important');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedInvoices.length === 0) {
            alert('Please select invoices to delete');
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${selectedInvoices.length} invoice(s)?`
        );

        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const { data } = await axios.post(
                `${base_url}/api/v1/Invoice/delete/bulk`,
                { data: { invoiceIds: selectedInvoices } },
                { withCredentials: true }
            );

            if (data.success) {
                await FilterInvoice();
                setSelectedInvoices([]);
                alert('Invoices deleted successfully');

                // If search was active, refresh search results
                if (searchQuery.trim()) {
                    await fetchInvoices(searchQuery.trim());
                }
            }
        } catch (error: any) {
            console.error('Error deleting invoices:', error);
            alert(error.response?.data?.message || 'Failed to delete invoices. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            {/* <AlwaysDelete /> */}
            <div>
                <SummaryCards
                    User={User}
                    Company={Company}
                    setSelectedBranch={setSelectedBranch}
                    selectedBranch={selectedBranch}
                    dateRangeString={dateRangeString}
                    displayedInvoices={displayedInvoices}
                    selectedInvoices={selectedInvoices}
                    currency={currency}
                    Total={Total}
                    selectedTotal={selectedTotal}
                    remainingTotal={remainingTotal}
                    handleSetImportantSelected={handleSetImportantSelected}
                    handleDeleteSelected={handleDeleteSelected}
                    isDeleting={isDeleting}
                    isProcessing={isProcessing}
                />
            </div>
            {/* Invoice List */}
            <List
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                clearSearch={clearSearch}
                loading={loading}
                error={error}
                displayedInvoices={displayedInvoices}
                selectedInvoices={selectedInvoices}
                handleSelectAll={handleSelectAll}
                handleSelectInvoice={handleSelectInvoice}
                Company={Company}
                InvoiceLoading={InvoiceLoading}
            />
        </div>
    )
}
