'use client'
import React from 'react';
import DataTable from '@/Components/SuperAdmin/DataTable';

const branchesData = [
    { id: 1, name: 'Main Branch', company: 'Tech Solutions Inc.', location: 'New York', manager: 'John Doe', status: 'Active' },
    { id: 2, name: 'West Coast', company: 'Tech Solutions Inc.', location: 'San Francisco', manager: 'Jane Smith', status: 'Active' },
    { id: 3, name: 'London Office', company: 'Global Trading Co.', location: 'London', manager: 'Mike Johnson', status: 'Active' },
    { id: 4, name: 'Downtown', company: 'Small Biz LLC', location: 'Chicago', manager: 'Sarah Wilson', status: 'Inactive' },
    { id: 5, name: 'Design Hub', company: 'Creative Agency', location: 'Austin', manager: 'Paul Brown', status: 'Active' },
];

const columns = [
    { header: 'Branch Name', accessor: 'name' },
    { header: 'Company', accessor: 'company' },
    { header: 'Location', accessor: 'location' },
    { header: 'Manager', accessor: 'manager' },
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
];

export default function BranchesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches Management</h1>
                <p className="text-gray-500 dark:text-gray-400">View and manage company branches</p>
            </div>

            <DataTable
                title="All Branches"
                columns={columns}
                data={branchesData}
                addLabel="Add Branch"
                onAdd={() => console.log('Add branch')}
            />
        </div>
    );
}
