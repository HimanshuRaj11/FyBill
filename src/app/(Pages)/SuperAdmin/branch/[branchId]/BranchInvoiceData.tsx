'use client';
import InvoiceDateFilter from '@/Components/Other/InvoiceDateFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useGlobalContext } from '@/context/contextProvider';
import { formatDateRange } from '@/lib/formatDateRange';

export default function BranchInvoiceData({ invoiceData }: { invoiceData: any }) {
    const {
        startDate,
        endDate,
        dateRange
    } = useGlobalContext();
    const dateRangeString = formatDateRange(startDate, endDate)

    const currency = invoiceData ? invoiceData.currency : null;
    const filteredRevenue = invoiceData ? invoiceData.totalRevenue.toFixed(2) : '0.00';
    const filteredTaxes = invoiceData ? invoiceData.totalTaxAmount.toFixed(2) : '0.00';
    const filteredActualRevenue = invoiceData ? (invoiceData.totalRevenue - invoiceData.totalTaxAmount).toFixed(2) : '0.00';
    const filteredInvoiceCount = invoiceData ? invoiceData.invoicesLength : 0;

    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {dateRangeString} Invoice Data
            </h2>
            <InvoiceDateFilter />
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                {/* Total Revenue Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-amber-100 dark:bg-amber-900/30 border-amber-800 dark:border-amber-600 border-2 rounded-2xl px-2 text-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 w-fit transition-colors">
                            {currency} {filteredRevenue}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Taxes Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Taxes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-red-100 dark:bg-red-900/30 border-red-800 dark:border-red-600 border-2 rounded-2xl px-2 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 w-fit transition-colors">
                            {currency} {filteredTaxes}
                        </div>
                    </CardContent>
                </Card>

                {/* Actual Revenue Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Actual Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold bg-green-100 dark:bg-green-900/30 border-green-800 dark:border-green-600 border-2 rounded-2xl px-2 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 w-fit transition-colors">
                            {currency} {filteredActualRevenue}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Invoices Card */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Invoices
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {filteredInvoiceCount}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
