'use client'
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Users, Building2, Calendar, DollarSign, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function CompanyProfile({ companyData }: { companyData: any }) {
    const [expandedBranch, setExpandedBranch] = useState(null);


    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const toggleBranch = (branchId: any) => {
        setExpandedBranch(expandedBranch === branchId ? null : branchId);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {companyData.name}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                {companyData.industry}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Users size={16} />
                                    {companyData.companySize}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    Est. 2020
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-block bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 px-4 py-2 rounded-full text-sm font-medium">
                                Active
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-200">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        About
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {companyData.description}
                    </p>
                </div>

                {/* Contact & Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Contact Information
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Phone className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="text-gray-900 dark:text-white">{companyData.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-gray-900 dark:text-white">{companyData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Globe className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                                    <a
                                        href={companyData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {companyData.website}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {companyData.address.street}<br />
                                        {companyData.address.city}, {companyData.address.state}<br />
                                        {companyData.address.country} {companyData.address.zipCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Business Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FileText className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">VAT ID</p>
                                    <p className="text-gray-900 dark:text-white">{companyData.vatId}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <DollarSign className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {companyData.currency.name} ({companyData.currency.code}) {companyData.currency.symbol}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                                    <p className="text-gray-900 dark:text-white">{companyData.ownerId.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {companyData.ownerId.countryCode} {companyData.ownerId.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="text-gray-400 dark:text-gray-500 mt-1" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Registered</p>
                                    <p className="text-gray-900 dark:text-white">{formatDate(companyData.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {!companyData.branch.length && companyData.branch.length == 0 && (

                    <div className="mt-4">
                        <Link
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/SuperAdmin/Company/${companyData._id}/invoicesDetails`}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            role="button"
                        >
                            View Company Invoice Details
                        </Link>
                    </div>
                )}


                {/* Branches Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Branches ({companyData.branch.length})
                    </h2>
                    <div className="space-y-3">
                        {companyData.branch.map((branch: any,) => (
                            <div
                                key={branch._id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200"
                            >
                                <button
                                    onClick={() => toggleBranch(branch._id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Building2 className="text-gray-400 dark:text-gray-500" size={20} />
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {branch.branchName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {branch.countryCode} {branch.phone}
                                            </p>
                                        </div>
                                    </div>
                                    {expandedBranch === branch._id ? (
                                        <ChevronUp className="text-gray-400 dark:text-gray-500" size={20} />
                                    ) : (
                                        <ChevronDown className="text-gray-400 dark:text-gray-500" size={20} />
                                    )}
                                </button>

                                {expandedBranch === branch._id && (
                                    <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-700/50 transition-colors duration-200">
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="text-gray-900 dark:text-white">{branch.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Last Invoice #</p>
                                                <p className="text-gray-900 dark:text-white">{branch.lastInvoiceNo}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Opened</p>
                                                <p className="text-gray-900 dark:text-white">{formatDate(branch.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Branch ID</p>
                                                <p className="text-gray-900 dark:text-white text-xs font-mono">
                                                    {branch._id?.slice(-8)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <Link
                                                href={`${process.env.NEXT_PUBLIC_BASE_URL}/SuperAdmin/branch/${branch._id}?BranchName=${branch.branchName}`}
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                                role="button"
                                            >
                                                View Branch Invoice Details
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}