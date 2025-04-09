import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Download, Printer, Share2, Mail, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

interface InvoiceData {
    invoiceNumber: string;
    clientName: string;
    phoneNumber: string;
    companyName: string;
    companyAddress: string;
    contactEmail: string;
    contactPhone: string;
    contactSocial: string;
    date: string;
    products: Product[];
    paymentInfo: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    };
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
}

export default function InvoiceDisplay() {
    const [data, setData] = useState<InvoiceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPrinting, setIsPrinting] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'details'>('preview');
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulated API data
        const fetchData = async () => {
            setIsLoading(true);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const res: InvoiceData = {
                invoiceNumber: "INV-01234",
                clientName: "Harper Russo",
                phoneNumber: "1234567890",
                companyName: "Really Great Site",
                companyAddress: "123 Tech Lane, Innovation City",
                contactEmail: "hello@reallygreatsite.com",
                contactPhone: "+123-456-7890",
                contactSocial: "@reallygreatsite",
                date: "20 August 2030",
                dueDate: "20 September 2030",
                status: 'pending',
                products: [
                    { name: "Photography service", rate: 500, quantity: 1, amount: 500 },
                    { name: "Videography service", rate: 1000, quantity: 1, amount: 1000 },
                    { name: "Video editing", rate: 250, quantity: 2, amount: 500 },
                    { name: "Transportation fee", rate: 100, quantity: 1, amount: 100 },
                ],
                paymentInfo: {
                    bankName: "Rimberio",
                    accountNumber: "0123 4567 8901",
                    accountHolder: "Hannah Morales",
                },
            };
            setData(res);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handlePrint = () => {
        if (invoiceRef.current) {
            setIsPrinting(true);
            const printContents = invoiceRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
            setIsPrinting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4 mr-1" />;
            case 'pending':
                return <Clock className="h-4 w-4 mr-1" />;
            case 'overdue':
                return <AlertCircle className="h-4 w-4 mr-1" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!data) return <div className="p-4 text-center text-gray-500">No invoice data available</div>;

    const subtotal = data.products.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6">
            {/* Header with actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Invoice #{data.invoiceNumber}</h1>
                        <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(data.status)}`}>
                                {getStatusIcon(data.status)}
                                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">Due: {data.dueDate}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                    </Button>
                    <Button
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        {isPrinting ? 'Printing...' : 'Print'}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4 overflow-x-auto pb-1">
                    {['preview', 'details'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'preview' | 'details')}
                            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Invoice Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
            >
                <div ref={invoiceRef} className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                            <div className="text-gray-500">
                                <p className="font-medium">From:</p>
                                <p>{data.companyName}</p>
                                <p>{data.companyAddress}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold text-lg mb-2">
                                #{data.invoiceNumber}
                            </div>
                            <div className="text-right text-gray-500">
                                <p className="font-medium">Date Issued:</p>
                                <p>{data.date}</p>
                                <p className="font-medium mt-2">Due Date:</p>
                                <p>{data.dueDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                        <div>
                            <p className="font-semibold text-gray-700 mb-1">Bill To:</p>
                            <p className="text-gray-800 font-medium">{data.clientName}</p>
                            <p className="text-gray-600">{data.phoneNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-700 mb-1">Contact Info:</p>
                            <p className="text-gray-600">{data.contactEmail}</p>
                            <p className="text-gray-600">{data.contactPhone}</p>
                            <p className="text-gray-600">{data.contactSocial}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-3 font-medium text-gray-700">DESCRIPTION</th>
                                    <th className="p-3 font-medium text-gray-700 text-right">QTY</th>
                                    <th className="p-3 font-medium text-gray-700 text-right">PRICE</th>
                                    <th className="p-3 font-medium text-gray-700 text-right">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.products.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-800">{product.name}</td>
                                        <td className="p-3 text-gray-800 text-right">{product.quantity}</td>
                                        <td className="p-3 text-gray-800 text-right">${product.rate.toFixed(2)}</td>
                                        <td className="p-3 text-gray-800 text-right">${product.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="border-t border-gray-200">
                                    <td className="p-3 text-gray-700 font-medium" colSpan={3}>SUBTOTAL</td>
                                    <td className="p-3 text-gray-800 text-right">${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="p-3 text-gray-700 font-medium" colSpan={3}>TAX (10%)</td>
                                    <td className="p-3 text-gray-800 text-right">${tax.toFixed(2)}</td>
                                </tr>
                                <tr className="border-t border-gray-200 bg-gray-50">
                                    <td className="p-3 text-gray-800 font-bold" colSpan={3}>GRAND TOTAL</td>
                                    <td className="p-3 text-gray-800 font-bold text-right">${total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-700 mb-2">Payment Information:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Bank Name</p>
                                <p className="font-medium">{data.paymentInfo.bankName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Account Number</p>
                                <p className="font-medium">{data.paymentInfo.accountNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Account Holder</p>
                                <p className="font-medium">{data.paymentInfo.accountHolder}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="text-4xl font-bold text-gray-200">THANK YOU</div>
                        <p className="text-gray-500 mt-2">For your business!</p>
                    </div>
                </div>
            </motion.div>

            {/* Additional Details Tab Content */}
            {activeTab === 'details' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 bg-white rounded-xl shadow-md p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Invoice History</h4>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    <div>
                                        <p className="text-sm font-medium">Invoice Created</p>
                                        <p className="text-xs text-gray-500">{data.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                                    <div>
                                        <p className="text-sm font-medium">Invoice Sent</p>
                                        <p className="text-xs text-gray-500">{data.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                                    <div>
                                        <p className="text-sm font-medium">Payment Due</p>
                                        <p className="text-xs text-gray-500">{data.dueDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Payment Terms</h4>
                            <div className="space-y-2">
                                <p className="text-sm">Payment is due within 30 days of invoice date.</p>
                                <p className="text-sm">Please include invoice number with your payment.</p>
                                <p className="text-sm">For any questions, please contact us at {data.contactEmail}.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}