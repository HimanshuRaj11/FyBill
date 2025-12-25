'use client'
import React from 'react';
import { Search, Filter, Edit, Trash2, View } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';

interface Column {
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
    title: string;
    columns: Column[];
    data: any[];
    onSearch?: (query: string) => void;
    onAdd?: () => void;
    addLabel?: string;
}

export default function DataTable({ title, columns, data, onSearch, onAdd, addLabel }: DataTableProps) {
    return (
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden transition-all duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400 transition-colors"
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                        <Filter className="h-4 w-4" />
                    </Button>
                    {onAdd && (
                        <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                            {addLabel || 'Add New'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                {columns.map((col: any, colIdx) => (

                                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>


                                ))}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Showing 1 to 10 of {data.length} entries</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Previous</Button>
                    <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Next</Button>
                </div>
            </div>
        </div>
    );
}
