'use client'

interface InvoiceTableSkeletonProps {
    showBranch?: boolean
    showKOT?: boolean
    rows?: number
}

export default function InvoiceTableSkeleton({
    showBranch = false,
    showKOT = false,
    rows = 5
}: InvoiceTableSkeletonProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                        {showBranch && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</th>
                        )}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mode of Payment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        {showKOT && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View Saved KOT</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                            </td>
                            {showBranch && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                            </td>
                            {showKOT && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}