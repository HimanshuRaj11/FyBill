'use client'
import React from 'react';
import { Building2, Users, FileText, DollarSign } from 'lucide-react';
import StatCard from '@/Components/SuperAdmin/StatCard';
import RevenueChart from '@/Components/SuperAdmin/RevenueChart';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back, Super Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Companies"
                    value="124"
                    icon={Building2}
                    trend={{ value: 12, isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Total Staff"
                    value="1,234"
                    icon={Users}
                    trend={{ value: 5, isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Total Invoices"
                    value="8,543"
                    icon={FileText}
                    trend={{ value: 2, isPositive: false }}
                    color="orange"
                />
                <StatCard
                    title="Total Revenue"
                    value="$543,210"
                    icon={DollarSign}
                    trend={{ value: 18, isPositive: true }}
                    color="green"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
                    <RevenueChart />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    NC
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">New Company Registered</p>
                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
