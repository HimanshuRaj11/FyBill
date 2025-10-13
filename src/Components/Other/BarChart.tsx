"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart"
import { use, useEffect, useState } from "react"



export function BarChartComponent({ Invoice, dateRange, DaysDiff }: { Invoice: any, dateRange: string, DaysDiff: number }) {
    // let chartData: { Days: string; Total_Revenue: number }[] = [];
    const [chartData, setChartData] = useState([] as { Days: string; Total_Revenue: number }[]);

    const ArrangeByDay = (Invoice: any[]) => {
        const dayMap = new Map<string, number>();

        Invoice.forEach((invoice) => {
            const date = new Date(invoice.createdAt);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

            const currentTotal = dayMap.get(dayName) || 0;
            dayMap.set(dayName, currentTotal + (invoice.grandTotal || 0));
        });

        // convert Map to array of objects
        const Data = Array.from(dayMap, ([Days, Total_Revenue]) => ({
            Days,
            Total_Revenue,
        }));

        return Data;
    };


    const chartConfig = {
        Total_Revenue: {
            label: "Total Revenue",
            color: "hsl(var(--chart-1))",
        },

    } satisfies ChartConfig

    useEffect(() => {
        const data = ArrangeByDay(Invoice)
        setChartData(data);
    }, [Invoice]);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Sales</CardTitle>
                <CardDescription>{dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="Days"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="Total_Revenue" fill="var(--color-Total_Revenue)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div> */}
                <div className="leading-none text-muted-foreground">
                    Showing total Invoices for the {dateRange}
                </div>
            </CardFooter>
        </Card>
    )
}
