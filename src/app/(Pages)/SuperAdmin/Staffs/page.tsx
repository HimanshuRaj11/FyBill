'use client'
import React from 'react';
import DataTable from '@/Components/SuperAdmin/DataTable';

const staffData = [
    { id: 1, name: 'John Doe', company: 'Tech Solutions Inc.', role: 'Manager', email: 'john@techsolutions.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', company: 'Tech Solutions Inc.', role: 'Admin', email: 'jane@techsolutions.com', status: 'Active' },
    { id: 3, name: 'Mike Johnson', company: 'Global Trading Co.', role: 'Sales', email: 'mike@globaltrading.com', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', company: 'Small Biz LLC', role: 'Support', email: 'sarah@smallbiz.com', status: 'On Leave' },
    { id: 5, name: 'Paul Brown', company: 'Creative Agency', role: 'Designer', email: 'paul@creative.com', status: 'Active' },
];

const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Company', accessor: 'company' },
    { header: 'Role', accessor: 'role' },
    { header: 'Email', accessor: 'email' },
    {
        header: 'Status',
        accessor: 'status',
        render: (row: any) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' :
                    row.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                {row.status}
            </span>
        )
    },
];

export default function StaffsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
                <p className="text-gray-500 dark:text-gray-400">View and manage staff across companies</p>
            </div>

            <DataTable
                title="All Staff Members"
                columns={columns}
                data={staffData}
                addLabel="Add Staff"
                onAdd={() => console.log('Add staff')}
            />
        </div>
    );
}
