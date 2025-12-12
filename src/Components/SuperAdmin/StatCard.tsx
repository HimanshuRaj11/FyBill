import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-500/10`}>
                    <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">from last month</span>
                </div>
            )}
        </div>
    );
}
