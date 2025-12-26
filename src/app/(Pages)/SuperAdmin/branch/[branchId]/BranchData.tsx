'use client'
import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Mail, Phone, Calendar, FileText, Hash, User } from 'lucide-react';
import axios from 'axios';

interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface IBranchData {
    countryCode: string;
    address: Address;
    branchName: string;
    companyId: string;
    createdAt: string;
    email: string;
    lastInvoiceNo: number;
    ownerId: string;
    phone: string;
    dailyApprox: number;
    lastInvoiceCheck: string;
}

const BranchData = ({ data }: { data: IBranchData }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500 dark:text-gray-400">Loading Branch Data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-6">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-white" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">{data.branchName} Branch</h1>
                            <p className="text-blue-100 text-sm">Branch Information</p>
                            <p className="text-blue-100 text-sm">{data.dailyApprox}</p>
                            <p className="text-blue-100 text-sm">Last Invoice Check {formatDate(data.lastInvoiceCheck)}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Address</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {data.address.street}<br />
                                {data.address.city}, {data.address.state}<br />
                                {data.address.country} - {data.address.zipCode}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm break-all">
                                {data.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {data.countryCode} {data.phone}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Created At</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {formatDate(data.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Last Invoice Number</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm font-mono">
                                #{data.lastInvoiceNo}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Company ID</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm font-mono break-all">
                                {data.companyId}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Owner ID</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm font-mono break-all">
                                {data.ownerId}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchData;