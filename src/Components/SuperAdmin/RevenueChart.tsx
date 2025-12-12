'use client'
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
];

export default function RevenueChart() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl animate-pulse" />;

    const isDark = theme === 'dark';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    const textColor = isDark ? '#9ca3af' : '#6b7280';
    const tooltipBg = isDark ? '#1f2937' : '#fff';
    const tooltipColor = isDark ? '#f3f4f6' : '#111827';

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: textColor, fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: textColor, fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            borderRadius: '12px',
                            border: isDark ? '1px solid #374151' : 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            color: tooltipColor
                        }}
                        itemStyle={{ color: tooltipColor }}
                        labelStyle={{ color: textColor }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
