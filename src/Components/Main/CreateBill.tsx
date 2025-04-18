"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import InvoiceDisplay from "./InvoiceDisplay";
import axios from "axios";
import { toast } from "react-toastify";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Br, Cut, Line, Printer, Text, Row, render } from "react-thermal-printer";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

export default function BillingComponent() {
    const [invoice, setInvoice] = useState<any>(null);
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [productName, setProductName] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [paymentMode, setPaymentMode] = useState<string>("");
    const [appliedTaxes, setAppliedTaxes] = useState<any[]>([]);
    const [printer, setPrinter] = useState<USBDevice | null>(null);
    const [printerStatus, setPrinterStatus] = useState<"Disconnected" | "Connecting" | "Connected" | "Error">("Disconnected");

    // Connect to USB printer on component mount
    useEffect(() => {
        const connectPrinter = async () => {
            try {
                setPrinterStatus("Connecting");
                const devices = await navigator.usb.getDevices();
                const existingDevice = devices.find((device: any) => device.productName?.toLowerCase().includes("star")); // Adjust for your printer
                if (existingDevice) {
                    setPrinter(existingDevice);
                    setPrinterStatus("Connected");
                    return;
                }

                const device = await navigator.usb.requestDevice({
                    filters: [{ vendorId: 0x0519 }], // Epson vendor ID; adjust if needed (e.g., Star: 0x0519)
                });
                await device.open();
                await device.selectConfiguration(1);
                await device.claimInterface(0); // Adjust interface based on printer
                setPrinter(device);
                setPrinterStatus("Connected");
                toast.success("Printer connected");
            } catch (err) {
                console.error("USB connection failed:", err);
                setPrinterStatus("Error");
                toast.error("Failed to connect to printer");
            }
        };

        if (navigator.usb) {
            connectPrinter();
        } else {
            setPrinterStatus("Error");
            toast.error("WebUSB not supported in this browser");
        }

        // Cleanup on unmount
        return () => {
            if (printer) {
                printer.close().catch((err: any) => console.error("Error closing printer:", err));
            }
        };
    }, [printer]);

    // Tax calculation
    useEffect(() => {
        setAppliedTaxes([]);
        taxes.forEach((tax) => {
            const taxAmount = subTotal * (tax.percentage / 100);
            setAppliedTaxes((prev) => [
                ...prev,
                {
                    taxName: tax.taxName,
                    percentage: tax.percentage,
                    amount: taxAmount,
                },
            ]);
        });
    }, [subTotal, taxes]);

    // Total calculation
    useEffect(() => {
        const newSubTotal = products.reduce((sum, product) => sum + product.amount, 0);
        setSubTotal(newSubTotal);
        const totalTaxAmount = appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0);
        setGrandTotal(Number((newSubTotal + totalTaxAmount).toFixed(2)));
    }, [products, appliedTaxes]);

    const AddProduct = (product: any) => {
        if (products.find((p) => p.name === product.name)) {
            setProducts(
                products.map((p) =>
                    p.name === product.name
                        ? { ...p, quantity: p.quantity + 1, amount: p.amount + product.price }
                        : p
                )
            );
        } else {
            setProducts([
                ...products,
                {
                    name: product.name,
                    rate: product.price,
                    quantity: 1,
                    amount: product.price,
                },
            ]);
        }
    };

    const handleDelete = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleQuantityChange = (product: Product, value: number) => {
        if (value === 1) {
            setProducts(
                products.map((p) =>
                    p.name === product.name
                        ? { ...p, quantity: p.quantity + 1, amount: p.amount + product.rate }
                        : p
                )
            );
        } else if (value === -1) {
            if (product.quantity > 1) {
                setProducts(
                    products.map((p) =>
                        p.name === product.name
                            ? { ...p, quantity: p.quantity - 1, amount: p.amount - product.rate }
                            : p
                    )
                );
            } else {
                setProducts(products.filter((p) => p.name !== product.name));
            }
        }
    };

    // Define the receipt as a React component
    const Receipt = ({ invoice }: { invoice: any }) => (
        <Printer type="star" width={42} characterSet="korea">
            <Text align="center" bold={true}>
                {invoice.companyName || "Your Company"}
            </Text>
            <Text align="center">{invoice.companyAddress || "123 Main St"}</Text>
            <Text align="center">Invoice No: {invoice.invoiceId}</Text>
            <Text align="center">Date: {new Date().toLocaleDateString()}</Text>
            <Line />
            <Text>Bill To:</Text>
            <Text>{invoice.clientName}</Text>
            <Text>Phone: {invoice.clientPhone}</Text>
            <Line />
            <Row left="Item" right="Qty  Rate  Total" />
            <Line />
            {invoice.products.map((item: any, index: number) => (
                <Row
                    key={index}
                    left={item.name}
                    right={`${item.quantity}  ${item.rate.toFixed(2)}  ${(item.quantity * item.rate).toFixed(2)}`}
                />
            ))}
            <Line />
            <Row left="Subtotal:" right={invoice.subTotal.toFixed(2)} />
            {invoice.appliedTaxes.map((tax: any, index: number) => (
                <Row key={index} left={`${tax.taxName} (${tax.percentage}%)`} right={tax.amount.toFixed(2)} />
            ))}
            <Row left="Total Tax:" right={invoice.appliedTaxes.reduce((sum: number, tax: any) => sum + tax.amount, 0).toFixed(2)} />
            <Line />
            <Row left="Grand Total:" right={invoice.grandTotal.toFixed(2)} />
            <Row left="Payment" right={invoice.paymentMode} />
            <Line />
            <Text align="center">Thank You!</Text>
            <Br />
            <Cut />
        </Printer>
    );

    const handlePrint = async (invoiceToPrint: any) => {

        if (printerStatus !== "Connected" || !printer) {
            toast.error("Printer not connected");
            return;
        }

        try {
            // Render the receipt to Uint8Array
            const data = await render(<Receipt invoice={invoiceToPrint} />);
            console.log(data);


            // Send data to USB printer
            const endpointNumber = 1; // Adjust based on your printer’s endpoint (check via device.usbDevice.endpoints)
            await printer.transferOut(endpointNumber, data);
            toast.success("Bill printed successfully");
        } catch (err) {
            console.error("Printing failed:", err);
            toast.error("Failed to print bill. Check printer connection.");
        }
    };

    const OnContinue = async () => {
        try {
            if (products.length === 0) {
                toast.error("Please add at least one product");
                return;
            }
            if (clientName === "") {
                toast.error("Please enter client name");
                return;
            }
            if (phoneNumber === "") {
                toast.error("Please enter phone number");
                return;
            }
            if (paymentMode === "") {
                toast.error("Please select payment mode");
                return;
            }

            const totalTaxAmount = appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0);

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`, {
                clientName,
                phoneNumber,
                products,
                subTotal,
                grandTotal,
                paymentMode,
                appliedTaxes,
                totalTaxAmount,
            });

            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);
                setClientName("");
                setPhoneNumber("");
                setProducts([]);
                setSubTotal(0);
                setGrandTotal(0);
                setPaymentMode("");
                await handlePrint(data.invoice);
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            toast.error("Something went wrong");
        }
    };

    // Fetching Data
    const FetchProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
            if (data.success) {
                setProductsList(data?.products);
                setFilteredProducts(data?.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        }
    };

    const fetchTaxData = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`);
            setTaxes(data.tax.taxes);
        } catch (error) {
            console.error("Error fetching taxes:", error);
            toast.error("Failed to fetch taxes");
        }
    };

    useEffect(() => {
        FetchProducts();
        fetchTaxData();
    }, []);

    const handleProductSearch = (searchTerm: string) => {
        setProductName(searchTerm);
        const filtered = productsList?.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <>
            <div className="flex justify-between">
                <div className="w-[50%] mx-auto p-6 bg-white rounded-2xl shadow-2xl">
                    <h1 className="text-2xl font-bold mb-4">Create Bill</h1>
                    <p className="mb-4">Printer Status: {printerStatus}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input
                            placeholder="Client Name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="flex">
                        <div className="relative w-full mb-4">
                            <Input
                                placeholder="Search Products"
                                value={productName}
                                onChange={(e) => handleProductSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* List of Products */}
                    <div className="flex flex-wrap gap-4 overflow-y-auto max-h-[300px]">
                        {filteredProducts?.map((product: any, index: any) => (
                            <div
                                onClick={() => AddProduct(product)}
                                key={index}
                                className="bg-gray-300 max-w-[200px] hover:bg-gray-400 hover:shadow-md transition-all duration-300 p-4 cursor-pointer rounded-md"
                            >
                                <h3 className="text-lg font-bold">{product.name}</h3>
                                <p className="text-sm">₹{product.price}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Payment Mode</label>
                        <select
                            className="w-full p-2 border rounded-md bg-white"
                            onChange={(e) => setPaymentMode(e.target.value)}
                            value={paymentMode}
                        >
                            <option value="" disabled>
                                Select Payment Mode
                            </option>
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                            <option value="netBanking">Net Banking</option>
                        </select>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className="mx-auto p-6 bg-white rounded-2xl shadow-2xl">
                    <div className="flex justify-around">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <span>{clientName}</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <span>{phoneNumber}</span>
                        </div>
                    </div>
                    <table className="w-full border mt-6 text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Product Name</th>
                                <th className="p-2">Rate</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-2">{product.name}</td>
                                    <td className="p-2">₹{product.rate}</td>
                                    <td className="p-2 flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="cursor-pointer"
                                            variant="outline"
                                            onClick={() => handleQuantityChange(product, -1)}
                                        >
                                            <Minus />
                                        </Button>
                                        {product.quantity}
                                        <Button
                                            size="sm"
                                            className="cursor-pointer"
                                            variant="outline"
                                            onClick={() => handleQuantityChange(product, 1)}
                                        >
                                            <Plus />
                                        </Button>
                                    </td>
                                    <td className="p-2">₹{product.amount}</td>
                                    <td className="p-2 space-x-2">
                                        <Button
                                            size="sm"
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="text-sm font-medium">Sub Total:</span>
                            <span>₹{subTotal.toFixed(2)}</span>
                        </div>
                        {appliedTaxes.map((tax, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    {tax.taxName} ({tax.percentage}%):
                                </span>
                                <span>₹{tax.amount.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center border-t pt-4">
                            <span>Total Tax Amount:</span>
                            <span>
                                ₹{appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-4 font-bold">
                            <span>Grand Total:</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-end my-4">
                        <Button
                            onClick={OnContinue}
                            disabled={
                                products.length === 0 ||
                                clientName === "" ||
                                phoneNumber === "" ||
                                paymentMode === ""
                                // printerStatus !== "Connected"
                            }
                            className="cursor-pointer w-full"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-auto">
                    <Receipt invoice={invoice} />
                </DialogContent>
            </Dialog>
        </>
    );
}