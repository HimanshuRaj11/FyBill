'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import axios from 'axios';
import { useSelector } from 'react-redux';

const base_url = process.env.NEXT_PUBLIC_BASE_URL

interface BranchData {
    branch: string;
    month: string;
    totalGrand: number;
    count: number;
}

const BranchSalesLineChart = () => {
    const { Company: company } = useSelector((state: any) => state.Company)
    const [data, setData] = useState<BranchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("Last Year");

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


    // Transform data for the line chart
    const transformData = () => {
        const monthMap = new Map();

        data.forEach(item => {
            const monthKey = item.month;
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, { month: monthKey });
            }
            monthMap.get(monthKey)[item.branch] = item.totalGrand;
        });

        // Convert to array and sort by date
        return Array.from(monthMap.values()).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
        });
    };

    // Get unique branches for dynamic lines
    const getBranches = () => {
        return [...new Set(data.map(item => item.branch))];
    };

    const chartData = transformData();
    const branches = getBranches();

    // Color palette for branches
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    // Format month for display (shorter format)
    const formatMonth = (month: string) => {
        const date = new Date(month);
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    };

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Branch Sales Trends</CardTitle>
                    <CardDescription>Loading data...</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                    <div className="text-muted-foreground">Loading chart...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Branch Sales Trends</CardTitle>
                <CardDescription>Monthly sales performance by branch over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="month"
                            tickFormatter={formatMonth}
                            className="text-sm"
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
                            className="text-sm"
                        />
                        <Tooltip
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                            labelFormatter={(label) => label}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                        {branches.map((branch, index) => (
                            <Line
                                key={branch}
                                type="monotone"
                                dataKey={branch}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>

                {/* Summary Statistics */}
                <div className="mt-2 flex justify-start gap-1">
                    {branches.map((branch, index) => {
                        const branchData = data.filter(item => item.branch === branch);
                        const totalSales = branchData.reduce((sum, item) => sum + item.totalGrand, 0);
                        const avgSales = totalSales / branchData.length;

                        return (
                            <div
                                key={branch}
                                className="p-4 rounded-lg border"
                                style={{ borderLeftColor: colors[index % colors.length], borderLeftWidth: '4px' }}
                            >
                                <h4 className="font-semibold text-sm text-muted-foreground">{branch}</h4>
                                <p className="text-2xl font-bold mt-1">
                                    {(() => {
                                        const raw = Number(totalSales) || 0;
                                        const abs = Math.abs(raw);
                                        let formatted = '';

                                        if (abs >= 1_000_000_000) {
                                            formatted = `${(raw / 1_000_000_000).toFixed(2)}B`;
                                        } else if (abs >= 1_000_000) {
                                            formatted = `${(raw / 1_000_000).toFixed(2)}M`;
                                        } else {
                                            formatted = raw.toLocaleString();
                                        }

                                        return (
                                            <p className="text-primary font-bold text-lg">
                                                {company?.currency.symbol}{formatted}
                                            </p>
                                        );
                                    })()}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(() => {
                                        const raw = Number(avgSales) || 0;
                                        const abs = Math.abs(raw);
                                        let formatted = '';

                                        if (abs >= 1_000_000_000) {
                                            formatted = `${(raw / 1_000_000_000).toFixed(2)}B`;
                                        } else if (abs >= 1_000_000) {
                                            formatted = `${(raw / 1_000_000).toFixed(2)}M`;
                                        } else {
                                            formatted = raw.toLocaleString();
                                        }

                                        return (
                                            <p className="text-primary font-bold text-lg">
                                                Avg: {company?.currency.symbol}{formatted}/month
                                            </p>
                                        );
                                    })()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default BranchSalesLineChart;