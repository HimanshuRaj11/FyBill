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
import { useCallback, useState } from "react"



export function BarChartComponent({ Invoice, dateRange }: { Invoice: any, dateRange: string }) {
    const [chartData, setChartData] = useState([])
    const HandleChangeDateRange = useCallback(() => {
        if (dateRange == "Last 7 days") {

            const chartData = [
                { Day: "Monday", Total_Revenue: 186, NumberOfInvoices: 80 },

            ]
            setChartData(Invoice)
        }
    }, [dateRange, Invoice])


    const chartConfig = {
        Total_Revenue: {
            label: "Total Revenue",
            color: "hsl(var(--chart-1))",
        },
        mobile: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig



    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Bar Chart - Multiple</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
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
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
