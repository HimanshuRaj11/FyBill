import React from 'react';
import DataTable from './Datatable';



export default function CompaniesPage() {

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage all registered companies</p>
            </div>

            <DataTable />


        </div>
    );
}
