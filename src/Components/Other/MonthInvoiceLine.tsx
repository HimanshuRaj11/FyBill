'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { ChevronDown, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import axios from 'axios';
import { useSelector } from 'react-redux';
const base_url = process.env.NEXT_PUBLIC_BASE_URL


export default function MonthInvoiceLine() {
    const { Company: company } = useSelector((state: any) => state.Company)

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const getCurrentMonth = () => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
    const [isOpen, setIsOpen] = useState(false)

    const monthOptions = useMemo(() => {
        const months = []
        const currentDate = new Date()
        const startYear = 2020
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()

        for (let year = currentYear; year >= startYear; year--) {
            const yearMonths = []
            const endMonth = year === currentYear ? currentMonth : 11

            for (let month = endMonth; month >= 0; month--) {
                const date = new Date(year, month, 1)
                yearMonths.push({
                    value: `${year}-${String(month + 1).padStart(2, '0')}`,
                    label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    year: year,
                    month: month
                })
            }

            if (yearMonths.length > 0) {
                months.push({
                    year: year,
                    months: yearMonths
                })
            }
        }

        return months
    }, [])

    const getDateRange = (monthValue: any) => {
        if (!monthValue) return null

        const [year, month] = monthValue.split('-').map(Number)
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)

        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0],
            startDate,
            endDate
        }
    }

    const handleMonthSelect = (monthValue: any) => {
        setSelectedMonth(monthValue)
        setIsOpen(false)
    }

    const selectedMonthLabel = useMemo(() => {
        if (!selectedMonth) return 'Select Month'
        const option = monthOptions
            .flatMap(y => y.months)
            .find(m => m.value === selectedMonth)
        return option ? option.label : 'Select Month'
    }, [selectedMonth, monthOptions])

    const dateRange = getDateRange(selectedMonth)


    const transformData = () => {
        const monthMap = new Map();
        data.forEach((item: any) => {
            const monthKey = item.month;
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, { month: monthKey });
            }
            monthMap.get(monthKey)[item.branch] = item.totalGrand;
        });

        return Array.from(monthMap.values()).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
        });
    };

    const getBranches = () => {
        return [...new Set(data.map((item: any) => item.branch))];
    };

    const chartData = transformData();
    const branches = getBranches();

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    const formatMonth = (month: string) => {
        const date = new Date(month);
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    };


    const fetchMonthInvoice = useCallback(async () => {
        try {
            const { data } = await axios.post(`${base_url}/api/v1/graph-data/monthInvoiceData`,
                { dateRange },
                { withCredentials: true })
            if (data.success) {
                setData(data.data)
            }

        } catch (error) {

        }
    }, [dateRange])

    console.log(data);

    useEffect(() => {
        fetchMonthInvoice()
    }, [])

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
        < div className="">
            <div className="p-6 max-w-2xl mx-auto">
                <div className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invoice Month
                        </label>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className={selectedMonth ? 'text-gray-900' : 'text-gray-500'}>
                                    {selectedMonthLabel}
                                </span>
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                {monthOptions.map((yearGroup) => (
                                    <div key={yearGroup.year} className="border-b last:border-b-0">
                                        <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700 sticky top-0">
                                            {yearGroup.year}
                                        </div>
                                        <div className="py-1">
                                            {yearGroup.months.map((month) => (
                                                <button
                                                    key={month.value}
                                                    onClick={() => handleMonthSelect(month.value)}
                                                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${selectedMonth === month.value
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : 'text-gray-700'
                                                        }`}
                                                >
                                                    {month.label.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>

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
                            const branchData = data.filter((item: any) => item.branch === branch);
                            const totalSales = branchData.reduce((sum, item: any) => sum + item.totalGrand, 0);
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
        </div>
    )
}