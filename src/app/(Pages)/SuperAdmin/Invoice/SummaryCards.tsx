import InvoiceDateFilter from '@/Components/Other/InvoiceDateFilter'
import { Star, Trash2 } from 'lucide-react'
import React from 'react'

export default function SummaryCards({ User, Company, setSelectedBranch, selectedBranch, dateRangeString, displayedInvoices, selectedInvoices, currency, Total, selectedTotal, remainingTotal, handleSetImportantSelected, handleDeleteSelected, isDeleting, isProcessing }: any) {
    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <div className="">
                    {User?.role === "Owner" && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                <div
                                    onClick={() => setSelectedBranch("All")}
                                    className={`flex justify-center items-center px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${selectedBranch === "All"
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:shadow-md hover:scale-102 border border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="branch"
                                        id="branch-all"
                                        className="hidden"
                                        checked={selectedBranch === "All"}
                                        onChange={() => setSelectedBranch("All")}
                                    />
                                    <label
                                        htmlFor="branch-all"
                                        className="text-sm font-semibold min-w-[80px] text-center cursor-pointer"
                                    >
                                        All Branches
                                    </label>
                                </div>

                                {Company?.branch?.map((branch: any) => (
                                    <div
                                        onClick={() => setSelectedBranch(branch?.branchName)}
                                        key={branch._id}
                                        className={`flex justify-center items-center px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${selectedBranch === branch?.branchName
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105"
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:shadow-md hover:scale-102 border border-gray-200 dark:border-gray-700"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="branch"
                                            id={`branch-${branch._id}`}
                                            className="hidden"
                                            checked={selectedBranch === branch?.branchName}
                                            onChange={() => setSelectedBranch(branch?.branchName)}
                                        />
                                        <label
                                            htmlFor={`branch-${branch._id}`}
                                            className="text-sm font-semibold cursor-pointer whitespace-nowrap"
                                        >
                                            {branch?.branchName}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {dateRangeString} Invoice Data
                </h2>
                <InvoiceDateFilter />
            </div>
            <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Total Invoices</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{displayedInvoices.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Total Amount</p>
                        <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                            {currency}{Total?.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 rounded-lg border border-green-200 dark:border-green-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Selected</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">{selectedInvoices.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Selected Total</p>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                            {currency}{selectedTotal?.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-3 rounded-lg border border-orange-200 dark:border-orange-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Remaining</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">
                            {currency}{remainingTotal?.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                {selectedInvoices.length > 0 && (
                    <div className="mt-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            {selectedInvoices.length} invoice(s) selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSetImportantSelected}
                                disabled={isProcessing || isDeleting}
                                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Star className="h-4 w-4" />
                                {isProcessing ? 'Processing...' : 'Mark as Important'}
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                disabled={isProcessing || isDeleting}
                                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? 'Deleting...' : 'Delete Selected'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
