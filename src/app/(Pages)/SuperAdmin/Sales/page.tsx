'use client'
import React from 'react';
import RevenueChart from '@/Components/SuperAdmin/RevenueChart';
import StatCard from '@/Components/SuperAdmin/StatCard';
import { TrendingUp, DollarSign, ShoppingCart, CreditCard } from 'lucide-react';

export default function SalesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">Detailed sales analytics and reports</p>
            </div>

            {/* Sales Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sales"
                    value="$1,234,567"
                    icon={DollarSign}
                    trend={{ value: 15, isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Orders"
                    value="45,678"
                    icon={ShoppingCart}
                    trend={{ value: 8, isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Average Order Value"
                    value="$85.00"
                    icon={TrendingUp}
                    trend={{ value: 2, isPositive: false }}
                    color="orange"
                />
                <StatCard
                    title="Refunds"
                    value="$1,234"
                    icon={CreditCard}
                    trend={{ value: 5, isPositive: false }}
                    color="red"
                />
            </div>

            {/* Charts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sales Trends</h3>
                <RevenueChart />
            </div>

            {/* Top Performing Companies */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Performing Companies</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Tech Solutions Inc.', sales: '$120,000', growth: '+12%' },
                        { name: 'Global Trading Co.', sales: '$98,000', growth: '+8%' },
                        { name: 'Creative Agency', sales: '$85,000', growth: '+15%' },
                        { name: 'Logistics Pro', sales: '$76,000', growth: '+5%' },
                        { name: 'Small Biz LLC', sales: '$45,000', growth: '-2%' },
                    ].map((company, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                    {idx + 1}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-gray-900 dark:text-white font-semibold">{company.sales}</span>
                                <span className={`text-sm font-medium ${company.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {company.growth}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
