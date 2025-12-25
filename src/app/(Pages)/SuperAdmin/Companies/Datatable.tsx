'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'

interface IColumn {
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
}

interface Company {
    _id: string;
    name: string;
    ownerId?: {
        name: string;
    };
    email: string;
    phone: string;
    industry: string;
    createdAt: string;
}

const columns: IColumn[] = [
    { header: 'Company Name', accessor: 'name' },
    {
        header: 'Owner',
        accessor: 'ownerId',
        render: (row: Company) => row.ownerId?.name || 'N/A'
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Industry', accessor: 'industry' },
    {
        header: 'Created At',
        accessor: 'createdAt',
        render: (row: Company) => new Date(row.createdAt).toLocaleDateString()
    },
]

export default function DataTable() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/SuperAdmin/Company/list`);

            if (data.success) {
                setCompanies(data.companies);
            } else {
                setError(data.message || 'Failed to fetch companies');
            }
        } catch (err) {
            setError('Error fetching companies');
            console.error('Error fetching companies:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500 dark:text-gray-400">Loading companies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!companies || companies.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500 dark:text-gray-400">No companies found</div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {companies.map((company) => (
                        <tr
                            key={company._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            {columns.map((col: any, colIdx) => (
                                <td
                                    key={colIdx}
                                    className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                >
                                    {colIdx === 0 ? (
                                        <Link
                                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/SuperAdmin/Company/${company._id}`}
                                            className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {col.render ? col.render(company) : company[col.accessor as keyof Company]}
                                        </Link>
                                    ) : (
                                        col.render ? col.render(company) : company[col.accessor as keyof Company]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}