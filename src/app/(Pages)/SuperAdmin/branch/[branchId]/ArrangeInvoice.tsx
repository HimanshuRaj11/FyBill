'use client'
import { useGlobalContext } from '@/context/contextProvider';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, X, TrendingUp, Calendar, Target as TargetIcon, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

interface AlertState {
    type: 'success' | 'error' | 'warning' | null;
    message: string;
}

export default function ArrangeInvoice({ data, invoiceData }: { data: any, invoiceData: any }) {
    const {
        startDate,
        setStartDate,
        endDate,
        dateRange
    } = useGlobalContext();

    const branchId = data?._id;
    const lastInvoiceCheckDate = new Date(data?.lastInvoiceCheck);
    const [Loading, setLoading] = useState<boolean>(false);
    const [percent, setPercent] = useState(10);
    const [alert, setAlert] = useState<AlertState>({ type: null, message: '' });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [arranging, setArranging] = useState(false);
    const [RevenueExceedAlertShown, setRevenueExceedAlertShown] = useState(false);

    useEffect(() => {
        setStartDate(data?.lastInvoiceCheck);
    }, []);


    const daysDifference = React.useMemo(() => {
        if (!startDate || !endDate) return 0;
        const s = new Date(startDate);
        const e = new Date(endDate);
        s.setHours(0, 0, 0, 0);
        e.setHours(0, 0, 0, 0);
        return Math.round((e.getTime() - s.getTime()) / 86400000);
    }, [startDate, endDate, dateRange]);

    const Target = React.useMemo(() => {
        if (!invoiceData) return 0;
        const target = daysDifference > 0 ? data.dailyApprox * daysDifference : data.dailyApprox;
        const Percent = (percent / 100) * target;
        return target + Percent;
    }, [percent, invoiceData, daysDifference, data?.dailyApprox]);


    useEffect(() => {
        if (invoiceData?.totalRevenue > Target) {
            setRevenueExceedAlertShown(true);
        }
    }, [invoiceData?.totalRevenue, Target]);

    const DeleteInvoices = async () => {
        try {
            setDeleting(true);
            setShowConfirmDialog(false);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/SuperAdmin/invoice/deleteToSet`,
                { startDate, endDate, TARGET: Target, branchId: branchId }
            );

            if (!data.success) {
                toast.error('Failed to delete invoices to meet the target.');
            }
            toast.success('Invoices deleted successfully to meet the target.');

        } catch (error) {
            toast.error('An unexpected error occurred while deleting invoices.');

        } finally {
            setDeleting(false);
            setLoading(false);
        }
    }

    const ArrangingInvoiceIndex = async () => {
        try {
            setArranging(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/SuperAdmin/invoice/arrange-Invoice-sequence`,
                { startDate, endDate, branchId: branchId }
            );

            if (!data.success) {
                toast.error('Failed to arrange invoice data.');
            }
            toast.success('Invoice sequence arranged successfully.');

        } catch (error) {
            toast.error('An unexpected error occurred while arranging invoice sequence.');
        } finally {
            setArranging(false);
            setLoading(false);
        }
    };

    const ArrangingInvoiceData = async () => {
        setLoading(true);
        await DeleteInvoices();
        await ArrangingInvoiceIndex();
        setLoading(false);
    }


    const closeAlert = () => {
        setAlert({ type: null, message: '' });
    };

    const handleArrangeClick = () => {
        if (!startDate) {
            setAlert({
                type: 'error',
                message: 'Please select both start dates.'
            });
            return;
        }
        setShowConfirmDialog(true);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Alert Popup */}
            {alert.type && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={closeAlert}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-4">
                            {alert.type === 'success' && (
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            )}
                            {alert.type === 'error' && (
                                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            )}
                            {alert.type === 'warning' && (
                                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            )}

                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold mb-2 ${alert.type === 'success' ? 'text-green-800 dark:text-green-300' :
                                    alert.type === 'error' ? 'text-red-800 dark:text-red-300' :
                                        'text-yellow-800 dark:text-yellow-300'
                                    }`}>
                                    {alert.type === 'success' ? 'Success' :
                                        alert.type === 'error' ? 'Error' : 'Warning'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {alert.message}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={closeAlert}
                            className={`mt-6 w-full py-2 px-4 rounded-lg font-medium ${alert.type === 'success'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : alert.type === 'error'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                }`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Confirm Invoice Arrangement
                        </h3>

                        <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Start Date:</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {new Date(startDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">End Date:</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {new Date(endDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Target Revenue:</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    ${Target.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Actual Revenue:</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    ${invoiceData?.totalRevenue?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Branch ID:</span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                    {branchId}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Branch Name:</span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                    {data.branchName}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            This will delete invoices to meet the target revenue. This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={ArrangingInvoiceData}
                                disabled={deleting}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
                            >
                                {Loading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {
                    RevenueExceedAlertShown && (
                        <div className="bg-red-600">
                            <p className="text-white text-center p-2 text-sm">
                                Warning: Current revenue exceeds the target. Arranging invoices will be necessary.
                            </p>
                        </div>
                    )
                }
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-6">
                    <h2 className="text-2xl font-bold text-white">Arrange Invoice Sequence</h2>
                    <p className="text-blue-100 text-sm mt-1">Manage and arrange invoices to meet targets</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Last Check
                                </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {lastInvoiceCheckDate.toDateString()}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <TargetIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Target Revenue
                                </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                ${Target.toFixed(2)}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Current Revenue
                                </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                ${invoiceData?.totalRevenue?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Percentage Input */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            <TrendingUp className="w-4 h-4 inline mr-2" />
                            Target Adjustment Percentage
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={percent}
                                onChange={(e) => setPercent(Number(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={percent}
                                    onChange={(e) => setPercent(Number(e.target.value))}
                                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-gray-600 dark:text-gray-300 font-medium">%</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Adjust the target revenue by adding a percentage buffer
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleArrangeClick}
                        disabled={deleting}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        {deleting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Arrange Invoice Sequence'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}