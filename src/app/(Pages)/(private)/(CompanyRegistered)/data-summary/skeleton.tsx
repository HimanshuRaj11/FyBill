
import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="p-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 w-16 h-16 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                </div>

                {/* Desktop Table Skeleton */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-28 animate-pulse"></div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-gray-300 dark:bg-gray-600 w-10 h-10 rounded-full mr-4"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards Skeleton */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 animate-pulse">
                            <div className="flex items-center mb-4">
                                <div className="bg-gray-300 dark:bg-gray-600 w-12 h-12 rounded-full mr-4"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map((j) => (
                                    <div key={j}>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-2"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;