// components/USBPrinter.tsx
'use client'
import { useState } from 'react';
import { IInvoice } from '@/Model/Invoice.model';

type PrinterStatus =
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'printing'
    | 'error';

const USBPrinter = ({ invoice }: { invoice: IInvoice }) => {
    const [printer, setPrinter] = useState<USBDevice | null>(null);
    const [status, setStatus] = useState<PrinterStatus>('disconnected');
    const [error, setError] = useState<string | null>(null);

    // Check for USB support
    const isUsbSupported = 'usb' in navigator;

    // Connect to printer
    const connectPrinter = async () => {
        try {
            setStatus('connecting');
            setError(null);

            const device = await navigator.usb.requestDevice({
                filters: [{ vendorId: 0x0519 }] // Star Micronics vendor ID
            });

            await device.open();
            await device.selectConfiguration(1);
            await device.claimInterface(0);

            setPrinter(device);
            setStatus('connected');
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to connect to printer');
            console.error('Printer connection error:', err);
        }
    };

    // Generate ESC/POS commands
    const generateEscPosCommands = (invoice: IInvoice): any => {
        let output = '';

        // Initialize printer
        output += '\x1B\x40';

        // Set center alignment and print header
        output += '\x1B\x61\x01';
        output += '\x1D\x21\x11'; // Double size
        output += `${invoice.companyName || 'Store'}\n`;
        output += '\x1D\x21\x00'; // Normal size
        output += `${invoice.companyAddress || 'Address not specified'}\n`;
        output += `Tel: ${invoice.clientPhone || 'N/A'}\n\n`;

        // Invoice info
        output += '\x1B\x61\x00'; // Left align
        output += `Invoice #: ${invoice.invoiceId}\n`;
        output += `Date: ${new Date(invoice.issueDate).toLocaleString()}\n`;
        output += `Branch: ${invoice.branchName || 'Main'}\n\n`;

        // Items table
        output += '--------------------------------\n';
        output += 'Item            Qty    Price\n';
        output += '--------------------------------\n';

        invoice.products.forEach((product) => {
            output += `${product.name.padEnd(16)}${product.quantity.toString().padStart(3)}${product.amount.toFixed(2).padStart(8)}\n`;
        });

        // Totals
        output += '--------------------------------\n';
        output += '\x1B\x61\x02'; // Right align
        output += `Subtotal: ${invoice.subTotal.toFixed(2).padStart(8)} ${invoice.currency}\n`;

        // Taxes
        if (invoice.appliedTaxes && invoice.appliedTaxes.length > 0) {
            invoice.appliedTaxes.forEach((tax: any) => {
                output += `${tax.taxName} (${tax.percentage}%): ${tax.amount?.toFixed(2).padStart(8)} ${invoice.currency}\n`;
            });
        }

        output += `Tax Total: ${invoice.totalTaxAmount.toFixed(2).padStart(8)} ${invoice.currency}\n`;
        output += '\x1B\x45\x01'; // Bold on
        output += `TOTAL: ${invoice.grandTotal.toFixed(2).padStart(8)} ${invoice.currency}\n`;
        output += '\x1B\x45\x00'; // Bold off

        // Payment and footer
        output += '\x1B\x61\x00'; // Left align
        output += `\nPayment: ${invoice.paymentMode}\n`;
        if (invoice.notes) {
            output += `Notes: ${invoice.notes}\n`;
        }

        output += '\x1B\x61\x01'; // Center align
        output += '\nThank you for your business!\n\n\n';
        output += '\x1D\x56\x41\x10'; // Cut paper

        // Convert to ArrayBuffer
        const encoder = new TextEncoder();
        const buffer = encoder.encode(output).buffer;
        // Ensure we return a proper ArrayBuffer
        return buffer.slice(0);
    };

    // Print bill function
    const printBill = async () => {
        if (!printer) {
            setError('Printer not connected');
            setStatus('error');
            return;
        }

        try {
            setStatus('printing');
            setError(null);

            const commands = generateEscPosCommands(invoice);
            await printer.transferOut(1, commands);

            setStatus('connected');
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Printing failed');
            console.error('Printing error:', err);
        }
    };

    // Disconnect printer
    const disconnectPrinter = async () => {
        try {
            if (printer) {
                await printer.close();
                setPrinter(null);
            }
            setStatus('disconnected');
            setError(null);
        } catch (err) {
            console.error('Disconnection error:', err);
        }
    };

    // Status message mapping
    const statusMessages: Record<PrinterStatus, string> = {
        disconnected: 'Printer disconnected',
        connecting: 'Connecting to printer...',
        connected: 'Printer connected and ready',
        printing: 'Printing...',
        error: 'Error occurred'
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thermal Printer</h2>

            {!isUsbSupported ? (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>Your browser doesn&apos;t support WebUSB. Please use Chrome or Edge.</p>
                </div>
            ) : (
                <>
                    <div className={`p-4 mb-4 rounded ${status === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
                        status === 'connected' ? 'bg-green-100 border border-green-400 text-green-700' :
                            'bg-blue-100 border border-blue-400 text-blue-700'
                        }`}>
                        <p className="font-medium">{statusMessages[status]}</p>
                        {error && <p className="mt-2 text-sm">{error}</p>}
                        {printer && status === 'connected' && (
                            <div className="mt-2 text-sm">
                                <p>Connected to: {printer.productName}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {status === 'disconnected' && (
                            <button
                                onClick={connectPrinter}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Connect Printer
                            </button>
                        )}

                        {status === 'connected' && (
                            <>
                                <button
                                    onClick={printBill}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Print Invoice
                                </button>
                                <button
                                    onClick={disconnectPrinter}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Disconnect
                                </button>
                            </>
                        )}

                        {(status === 'connecting' || status === 'printing') && (
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                            >
                                {status === 'connecting' ? 'Connecting...' : 'Printing...'}
                            </button>
                        )}

                        {status === 'error' && (
                            <button
                                onClick={connectPrinter}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Try Again
                            </button>
                        )}
                    </div>

                    {status === 'connected' && (
                        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                            <h3 className="font-medium text-gray-700 mb-2">Invoice Preview</h3>
                            <div className="font-mono text-sm bg-white p-3 rounded border border-gray-300">
                                <p className="text-center font-bold">{invoice.companyName || 'Store'}</p>
                                <p className="text-center">{invoice.companyAddress || 'Address not specified'}</p>
                                <p className="text-center">Tel: {invoice.clientPhone || 'N/A'}</p>
                                <p className="mt-2">Invoice #: {invoice.invoiceId}</p>
                                <p>Date: {new Date(invoice.issueDate).toLocaleString()}</p>
                                <p>Branch: {invoice.branchName || 'Main'}</p>
                                <div className="my-2 border-t border-gray-300"></div>
                                <div className="grid grid-cols-3 gap-1 mb-1">
                                    <span className="font-bold">Item</span>
                                    <span className="font-bold text-right">Qty</span>
                                    <span className="font-bold text-right">Price</span>
                                </div>
                                <div className="mb-2 border-t border-gray-300"></div>
                                {invoice.products.map((product, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-1">
                                        <span className="truncate">{product.name}</span>
                                        <span className="text-right">{product.quantity}</span>
                                        <span className="text-right">{product.amount.toFixed(2)} {invoice.currency}</span>
                                    </div>
                                ))}
                                <div className="my-2 border-t border-gray-300"></div>
                                <div className="text-right">
                                    <p>Subtotal: {invoice.subTotal.toFixed(2)} {invoice.currency}</p>
                                    {invoice.appliedTaxes?.map((tax: any, index: number) => (
                                        <p key={index}>
                                            {tax.taxName} ({tax.percentage}%): {tax.amount?.toFixed(2)} {invoice.currency}
                                        </p>
                                    ))}
                                    <p>Tax Total: {invoice.totalTaxAmount.toFixed(2)} {invoice.currency}</p>
                                    <p className="font-bold">TOTAL: {invoice.grandTotal.toFixed(2)} {invoice.currency}</p>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-300">
                                    <p>Payment: {invoice.paymentMode}</p>
                                    {invoice.notes && <p>Notes: {invoice.notes}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default USBPrinter;