'use client'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const paymentModes = [
    "cash", "upi", "netBanking", "card"
]

export default function DashboardCardsSkeleton() {
    return (
        <>
            {/* Top Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200 animate-pulse">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-40 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Revenue Breakdown by Payment Mode Card Skeleton */}
            <Card className="hover:shadow-md transition-shadow duration-200 mb-6 animate-pulse">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {paymentModes.map((mode, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                                <div className="h-6 bg-gray-200 rounded w-28 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}