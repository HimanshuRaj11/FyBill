'use client'
import React from 'react';
import DataTable from '@/Components/SuperAdmin/DataTable';

const companiesData = [
    { id: 1, name: 'Tech Solutions Inc.', email: 'contact@techsolutions.com', phone: '+1 234 567 890', status: 'Active', plan: 'Enterprise' },
    { id: 2, name: 'Global Trading Co.', email: 'info@globaltrading.com', phone: '+1 987 654 321', status: 'Active', plan: 'Pro' },
    { id: 3, name: 'Small Biz LLC', email: 'hello@smallbiz.com', phone: '+1 555 123 456', status: 'Inactive', plan: 'Basic' },
    { id: 4, name: 'Creative Agency', email: 'design@creative.com', phone: '+1 444 555 666', status: 'Active', plan: 'Pro' },
    { id: 5, name: 'Logistics Pro', email: 'support@logistics.com', phone: '+1 777 888 999', status: 'Active', plan: 'Enterprise' },
];

const columns = [
    { header: 'Company Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
        header: 'Status',
        accessor: 'status',
        render: (row: any) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {row.status}
            </span>
        )
    },
    { header: 'Plan', accessor: 'plan' },
];

export default function CompaniesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage all registered companies</p>
            </div>

            <DataTable
                title="All Companies"
                columns={columns}
                data={companiesData}
                addLabel="Add Company"
                onAdd={() => console.log('Add company')}
            />
        </div>
    );
}
