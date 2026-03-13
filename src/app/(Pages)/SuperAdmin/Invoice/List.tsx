import { AlertCircle, Search, X, FileText, Star, Trash2, ChevronRight } from 'lucide-react'
import React from 'react'
import { I_Invoice } from './ApiCalls'
import Link from 'next/link'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'

const PAYMENT_MODES = [
    { value: 'upi', label: 'UPI' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'netBanking', label: 'Net Banking' },
    { value: 'cheque', label: 'Cheque' },
]

const PAYMENT_MODE_STYLES: Record<string, string> = {
    upi: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    cash: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    card: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    netBanking: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    cheque: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size]
    return (
        <svg
            className={`animate-spin ${sizeClass} text-blue-500 dark:text-blue-400`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    )
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <tr>
            <td colSpan={10} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No invoices found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {searchQuery ? `No results for "${searchQuery}" — try a different term` : 'Try adjusting your filters'}
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    )
}

export default function List({
    searchQuery,
    handleSearchChange,
    clearSearch,
    loading,
    error,
    displayedInvoices,
    selectedInvoices,
    handleSelectAll,
    handleSelectInvoice,
    Company,
    InvoiceLoading,
    paymentStatusLoading,
    setPaymentStatusLoading,
}: any) {
    const hasBranches = Company?.branch?.length > 0
    const colSpan = hasBranches ? 10 : 9
    const allSelected = selectedInvoices.length === displayedInvoices.length && displayedInvoices.length > 0
    const someSelected = selectedInvoices.length > 0 && !allSelected

    const handleChangePaymentMode = async (invoiceId: string, newPaymentMode: string) => {
        setPaymentStatusLoading(true)
        try {
            const { data } = await axios.post(
                `/api/v1/SuperAdmin/invoice/update/paymentMode`,
                { invoiceId, paymentMode: newPaymentMode },
                { withCredentials: true }
            )
            if (data.success) toast.success('Payment mode updated successfully')
        } catch {
            toast.error('Failed to update payment mode. Please try again.')
        } finally {
            setPaymentStatusLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Search Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Search className="h-4 w-4 text-blue-500" />
                        Invoice Search
                    </h2>
                </div>

                <div className="p-4 space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by invoice number, customer name, amount..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            {loading && <Spinner size="sm" />}
                            {searchQuery && !loading && (
                                <button
                                    onClick={clearSearch}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Row */}
                    <div className="flex items-center justify-between min-h-[20px]">
                        <div>
                            {searchQuery.trim() && !loading && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {displayedInvoices.length > 0
                                        ? <><span className="font-medium text-blue-600 dark:text-blue-400">{displayedInvoices.length}</span> invoice{displayedInvoices.length !== 1 ? 's' : ''} found</>
                                        : `No results for "${searchQuery}"`}
                                </p>
                            )}
                            {someSelected || allSelected ? (
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                    {selectedInvoices.length} selected
                                </p>
                            ) : null}
                        </div>

                        {error && (
                            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-xs">{error}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50">
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(el) => { if (el) el.indeterminate = someSelected }}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer"
                                    />
                                </th>
                                {['#', 'Invoice', 'Track ID', 'Customer', ...(hasBranches ? ['Branch'] : []), 'Amount', 'Payment', 'Date', ''].map((header, i) => (
                                    <th
                                        key={i}
                                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                            {InvoiceLoading || loading ? (
                                <tr>
                                    <td colSpan={colSpan} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Spinner size="lg" />
                                            <p className="text-sm text-gray-400 dark:text-gray-500">Loading invoices…</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedInvoices.length > 0 ? (
                                displayedInvoices.map((invoice: I_Invoice, i: number) => {
                                    const isSelected = selectedInvoices.includes(invoice._id)
                                    const paymentStyle = PAYMENT_MODE_STYLES[invoice.paymentMode] ?? PAYMENT_MODE_STYLES.cheque

                                    return (
                                        <tr
                                            key={invoice._id}
                                            className={`group transition-colors ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/10'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectInvoice(invoice._id)}
                                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer"
                                                />
                                            </td>

                                            {/* S.N */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>{i + 1}</span>
                                                    {invoice.important && (
                                                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                                    )}
                                                    {invoice.delete && (
                                                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Invoice ID */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Link
                                                    href={`/Invoice/${invoice._id}`}
                                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline underline-offset-2"
                                                >
                                                    #{invoice.invoiceId}
                                                </Link>
                                            </td>

                                            {/* Track ID */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Link
                                                    href={`/Invoice/${invoice._id}`}
                                                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline underline-offset-2 font-mono"
                                                >
                                                    #{invoice.invoiceIdTrack}
                                                </Link>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {invoice.clientName}
                                            </td>

                                            {/* Branch (conditional) */}
                                            {hasBranches && (
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {invoice?.branchName ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                                                            {invoice.branchName}
                                                        </span>
                                                    ) : '—'}
                                                </td>
                                            )}

                                            {/* Amount */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                                                {invoice.currency}{invoice.grandTotal.toFixed(2)}
                                            </td>

                                            {/* Payment Mode */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="relative">
                                                    <select
                                                        className={`text-xs font-medium px-2.5 py-1 pr-6 rounded-full border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors ${paymentStyle}`}
                                                        onChange={(e) => handleChangePaymentMode(invoice._id, e.target.value)}
                                                        value={invoice.paymentMode}
                                                        style={{ backgroundImage: 'none' }}
                                                    >
                                                        {PAYMENT_MODES.map((mode) => (
                                                            <option key={mode.value} value={mode.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">

                                                                {
                                                                    paymentStatusLoading ? (
                                                                        <Spinner size="sm" />
                                                                    ) : mode.label
                                                                }
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-90 opacity-60" />
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                                                {moment(invoice.createdAt).format('MMM DD, YYYY')}
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <Link
                                                    href={`/Invoice/${invoice._id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    View
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <EmptyState searchQuery={searchQuery} />
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {displayedInvoices.length > 0 && !InvoiceLoading && !loading && (
                    <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Showing <span className="font-medium text-gray-600 dark:text-gray-300">{displayedInvoices.length}</span> invoice{displayedInvoices.length !== 1 ? 's' : ''}
                            {selectedInvoices.length > 0 && (
                                <> · <span className="text-blue-600 dark:text-blue-400 font-medium">{selectedInvoices.length} selected</span></>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}