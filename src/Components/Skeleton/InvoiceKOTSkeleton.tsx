import React from 'react';

const InvoiceKOTSkeleton: React.FC = () => {
    return (
        <div className="p-4 space-y-6 animate-pulse">
            {/* Generated Invoice Section */}
            <div className="h-8 w-48 bg-gray-200 rounded"></div>

            <div className="p-4 border rounded-xl shadow-md bg-white space-y-4">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>

                {/* Client / Company Info Skeleton */}
                <div className="space-y-2">
                    <div className="h-5 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-36 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>

                {/* Products Table Skeleton */}
                <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">
                                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                </th>
                                <th className="p-2 text-right">
                                    <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
                                </th>
                                <th className="p-2 text-right">
                                    <div className="h-4 w-8 bg-gray-200 rounded ml-auto"></div>
                                </th>
                                <th className="p-2 text-right">
                                    <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-2">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-2">
                                        <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
                                    </td>
                                    <td className="p-2">
                                        <div className="h-4 w-8 bg-gray-200 rounded ml-auto"></div>
                                    </td>
                                    <td className="p-2">
                                        <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Skeleton */}
                <div className="space-y-2 flex flex-col items-end">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-5 w-36 bg-gray-200 rounded"></div>
                </div>

                {/* Notes + Payment Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>

                {/* Created By Skeleton */}
                <div className="mt-4 p-3 border-t bg-gray-50 rounded-lg space-y-2">
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-36 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* KOTs Section */}
            <div className="h-8 w-40 bg-gray-200 rounded"></div>

            {/* Multiple KOT Cards Skeleton */}
            <div className="space-y-6">
                {[1, 2].map((kotIdx) => (
                    <div
                        key={kotIdx}
                        className="p-4 border rounded-xl shadow-md bg-white space-y-4"
                    >
                        {/* Header Skeleton */}
                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        </div>

                        {/* Client / Company Info Skeleton */}
                        <div className="space-y-2">
                            <div className="h-5 w-48 bg-gray-200 rounded"></div>
                            <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            <div className="h-4 w-36 bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>

                        {/* Products Table Skeleton */}
                        <div className="overflow-x-auto mb-3">
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">
                                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        </th>
                                        <th className="p-2 text-right">
                                            <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
                                        </th>
                                        <th className="p-2 text-right">
                                            <div className="h-4 w-8 bg-gray-200 rounded ml-auto"></div>
                                        </th>
                                        <th className="p-2 text-right">
                                            <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map((idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-2">
                                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                            </td>
                                            <td className="p-2">
                                                <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
                                            </td>
                                            <td className="p-2">
                                                <div className="h-4 w-8 bg-gray-200 rounded ml-auto"></div>
                                            </td>
                                            <td className="p-2">
                                                <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Skeleton */}
                        <div className="space-y-2 flex flex-col items-end">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            <div className="h-5 w-36 bg-gray-200 rounded"></div>
                        </div>

                        {/* Notes + Payment Skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceKOTSkeleton;