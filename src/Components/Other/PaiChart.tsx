import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import axios from 'axios';
import { TrendingUp, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';

interface BranchData {
    branch: string;
    month: string;
    totalGrand: number;
    count: number;
}

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

const BranchSalesPieChart = () => {
    const { Company: company } = useSelector((state: any) => state.Company)
    const [data, setData] = useState<BranchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("Last Year");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
                return;
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const aggregateByBranch = () => {
        const branchTotals = new Map();

        data.forEach(item => {
            const currentTotal = branchTotals.get(item.branch) || 0;
            branchTotals.set(item.branch, currentTotal + item.totalGrand);
        });

        return Array.from(branchTotals.entries()).map(([branch, total]) => ({
            name: branch,
            value: total,
        }));
    };

    const pieData = aggregateByBranch();
    const totalSales = pieData.reduce((sum, item) => sum + item.value, 0);

    const COLORS = [
        '#6366f1', '#ec4899', '#14b8a6', '#f59e0b',
        '#8b5cf6', '#06b6d4', '#f97316', '#10b981'
    ];

    const renderLabel = (entry: any) => {
        const percent = ((entry.value / totalSales) * 100).toFixed(1);
        return `${percent}%`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm">{payload[0].name}</p>
                    {(() => {
                        const raw = Number(payload[0].value) || 0;
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
                    <p className="text-xs text-muted-foreground">
                        {((payload[0].value / totalSales) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Branch Sales Distribution</CardTitle>
                            <CardDescription>Loading data...</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground">Loading chart...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Branch Sales Distribution</CardTitle>
                            <CardDescription className="text-sm">
                                Total sales contribution across all branches
                            </CardDescription>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{dateRange}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-2">
                <div className="flex flex-col xl:flex-row items-start justify-between gap-2">
                    {/* Pie Chart */}
                    <div className="w-full ">
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart >
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    // label={renderLabel}
                                    outerRadius={140}
                                    innerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                                            className="transition-opacity duration-200 cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Branch Statistics */}
                    <div className="w-full xl:w-1/3 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-semibold text-lg">Branch Performance</h3>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {pieData.map((branch, index) => {
                                const percentage = ((branch.value / totalSales) * 100).toFixed(1);
                                return (
                                    <div
                                        key={branch.name}
                                        className="group p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full shadow-sm"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                                    {branch.name}
                                                </p>
                                            </div>
                                            <span className="text-xs font-semibold text-muted-foreground">
                                                {percentage}%
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <p className="text-lg font-bold text-foreground">
                                                {(() => {
                                                    const raw = Number(branch.value) || 0;
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
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total Sales Card */}
                        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                            </div>
                            <p className="text-3xl font-bold text-primary">
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
                                Across {pieData.length} branches
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: hsl(var(--muted));
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--primary) / 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary));
                }
            `}</style>
        </Card>
    );
};

export default BranchSalesPieChart;