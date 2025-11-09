"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { TrendingUp, Calendar, Download, RefreshCw, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const base_url = process.env.NEXT_PUBLIC_BASE_URL

interface BranchData {
    branch: string;
    month: string;
    totalGrand: number;
    count: number;
}

const BarChartComponent = () => {
    const { Company } = useSelector((state: any) => state.Company)
    const company = Company
    const [dateRange, setDateRange] = useState("Last Year");
    const [data, setData] = useState<BranchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.post(
                    `${base_url}/api/v1/graph-data/invoice`,
                    { dateRange },
                    { withCredentials: true }
                );

                if (data.success) {
                    setData(data.data);
                    setLoading(false);
                }
                return
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const transformData = () => {
        const monthMap = new Map();

        data.forEach(item => {
            const monthKey = item.month;
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, { month: monthKey });
            }
            monthMap.get(monthKey)[item.branch] = item.totalGrand;
        });

        return Array.from(monthMap.values()).reverse();
    };

    const getBranches = () => {
        return [...new Set(data.map(item => item.branch))];
    };

    const getTotalSales = () => {
        return data.reduce((sum, item) => sum + item.totalGrand, 0);
    };

    // const getTopBranch = () => {
    //     const branchTotals = new Map();
    //     data.forEach(item => {
    //         const current = branchTotals.get(item.branch) || 0;
    //         branchTotals.set(item.branch, current + item.totalGrand);
    //     });

    //     let topBranch = { name: '', total: 0 };
    //     branchTotals.forEach((total, branch) => {
    //         if (total > topBranch.total) {
    //             topBranch = { name: branch, total };
    //         }
    //     });
    //     return topBranch;
    // };

    // const getAverageSales = () => {
    //     return data.length > 0 ? totalSales / chartData.length : 0;
    // };

    const chartData = transformData();
    const branches = getBranches();
    const totalSales = getTotalSales();
    // const topBranch = getTopBranch();

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const totalForMonth = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-base">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-6">
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full shadow-sm"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        {entry.name}
                                    </span>
                                </span>
                                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                    {company?.currency.symbol}{entry.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {company?.currency.symbol}{totalForMonth.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleExport = () => {
        // Add your export logic here
        console.log('Exporting data...');
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {/* Loading Stats Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="shadow-md animate-pulse">
                            <CardHeader className="pb-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                            </CardHeader>
                        </Card>
                    ))}
                </div> */}

                {/* Loading Chart */}
                <Card className="w-full shadow-lg">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-96 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
                            <p className="text-muted-foreground font-medium">Loading chart data...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-400">
                                Total Revenue
                            </CardDescription>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            {company?.currency.symbol}{(totalSales / 1000000).toFixed(2)}M
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Across all branches
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-400">
                                Top Branch
                            </CardDescription>
                            <BarChart3 className="w-5 h-5 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                            {topBranch.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            {company?.currency.symbol}{(topBranch.total / 1000000).toFixed(2)}M in sales
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-400">
                                Active Branches
                            </CardDescription>
                            <Calendar className="w-5 h-5 text-purple-500" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                            {branches.length}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Reporting locations
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div> */}

            {/* Main Chart */}
            <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="space-y-3 pb-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                    Sales Overview
                                </CardTitle>
                            </div>
                            <CardDescription className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" />
                                Comparative sales analysis across all branches
                            </CardDescription>
                        </div>
                        {/* <button
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={handleExport}
                        >
                            <Download className="w-4 h-4" />
                            Export Data
                        </button> */}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={480}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        >
                            <defs>
                                {branches.map((branch, index) => (
                                    <linearGradient key={branch} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={colors[index % colors.length]} stopOpacity={0.95} />
                                        <stop offset="100%" stopColor={colors[index % colors.length]} stopOpacity={0.7} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-gray-200 dark:stroke-gray-700"
                                opacity={0.3}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                className="text-xs font-medium"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                tickLine={{ stroke: 'currentColor' }}
                            />
                            <YAxis
                                tickFormatter={(value) => {
                                    const raw = Number(value) || 0;
                                    const abs = Math.abs(raw);
                                    let formatted = '';

                                    if (abs >= 1_000_000_000) {
                                        formatted = `${(raw / 1_000_000_000).toFixed(2)}B`;
                                    } else if (abs >= 1_000_000) {
                                        formatted = `${(raw / 1_000_000).toFixed(2)}M`;
                                    } else {
                                        formatted = raw.toLocaleString();
                                    }

                                    const symbol = company?.currency?.symbol ?? '$';
                                    return `${symbol}${formatted}`;
                                }}
                                className="text-xs font-medium"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                tickLine={{ stroke: 'currentColor' }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(59, 130, 246, 0.08)', radius: 8 }}
                            />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: '30px',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                                iconType="circle"
                                iconSize={10}
                            />
                            {branches.map((branch, index) => (
                                <Bar
                                    key={branch}
                                    dataKey={branch}
                                    fill={`url(#gradient-${index})`}
                                    radius={[8, 8, 0, 0]}
                                    onMouseEnter={() => setHoveredBar(branch)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                    opacity={hoveredBar ? (hoveredBar === branch ? 1 : 0.4) : 1}
                                    className="transition-opacity duration-200"
                                    maxBarSize={60}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default BarChartComponent;