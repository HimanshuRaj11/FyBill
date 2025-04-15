'use client'
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import InvoiceDisplay from "./InvoiceDisplay";
import axios from "axios";
import { toast } from "react-toastify";
import { Minus, Plus, Trash2 } from "lucide-react";
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
    const [rate, setRate] = useState<number>();
    const [quantity, setQuantity] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

    const [taxes, setTaxes] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);

    const [subTotal, setSubTotal] = useState<number>(0);
    let totalTaxAmount = 0;
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [paymentMode, setPaymentMode] = useState<string>("");
    const [AppliedTaxes, setAppliedTaxes] = useState<any[]>([]);

    useEffect(() => {
        setAppliedTaxes([])
        taxes.map((tax) => {
            const taxAmount = subTotal * tax.percentage / 100;
            setAppliedTaxes((prev) => [...prev, {
                taxName: tax.taxName,
                percentage: tax.percentage,
                amount: taxAmount
            }])

        })
    }, [subTotal])

    useEffect(() => {
        setSubTotal(products.reduce((sum, product) => sum + product.amount, 0));
        setGrandTotal(Number((subTotal + totalTaxAmount).toFixed(2)));
    }, [subTotal, products]);


    const AddProduct = (product: any) => {

        if (products.find((p) => p.name === product.name)) {
            setProducts(products.map((p) => p.name === product.name ? { ...p, quantity: p.quantity + 1, amount: p.amount + product.price } : p));
        } else {
            setProducts([...products, {
                name: product.name,
                rate: product.price,
                quantity: 1,
                amount: product.price
            }]);
        }
    }

    const handleDelete = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleQuantityChange = (product: any, value: number) => {
        if (value == 1) {
            setProducts(products.map((p) => p.name === product.name ? { ...p, quantity: p.quantity + 1, amount: p.amount + product.rate } : p));
        }
        else if (value == -1) {
            if (product.quantity > 1) {
                setProducts(products.map((p) => p.name === product.name ? { ...p, quantity: p.quantity - 1, amount: p.amount - product.rate } : p));
            }
            else {
                setProducts(products.filter((p) => p.name !== product.name));
            }
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

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`, {
                clientName,
                phoneNumber,
                products,
                subTotal,
                grandTotal,
                paymentMode,
                appliedTaxes: AppliedTaxes,
                totalTaxAmount,

            })
            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);
                setClientName("");
                setPhoneNumber("");
                setProducts([]);
                setSubTotal(0);
                setGrandTotal(0);
                setPaymentMode("");
            }

        } catch (error) {
            toast.error("Something went wrong");
            return error;
        }
    }



    // Fetching Data
    const FetchProducts = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`)
        if (data.success) {
            setProductsList(data?.products);
            setFilteredProducts(data?.products);
        }
    }
    const fetchTaxData = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`)
        setTaxes(data.tax.taxes);
    }
    useEffect(() => {
        FetchProducts();
        fetchTaxData();
    }, [])

    const handleProductSearch = (searchTerm: string) => {
        setProductName(searchTerm);
        const filtered = productsList?.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);

    };


    return (
        <>
            <div className=" flex justify-between ">


                <div className="w-[50%] mx-auto p-6 bg-white rounded-2xl shadow-2xl  ">
                    <h1 className="text-2xl font-bold mb-4">Create Bill</h1>

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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">

                        <div className="relative">
                            <Input
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => handleProductSearch(e.target.value)}
                            />
                        </div>

                    </div>

                    {/* List of Products */}
                    <div className="flex flex-wrap gap-4 overflow-y-auto max-h-[300px]">

                        {filteredProducts?.map((product: any, index: any) => (
                            <div onClick={() => AddProduct(product)} key={index} className="bg-gray-300 hover:bg-gray-400 hover:shadow-md transition-all duration-300 p-4 cursor-pointer rounded-md">
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
                            defaultValue=""
                        >
                            <option value="" disabled>Select Payment Mode</option>
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                            <option value="netBanking">Net Banking</option>
                        </select>
                    </div>

                </div>

                {/*  */}
                <div className="mx-auto p-6 bg-white rounded-2xl shadow-2xl">
                    <div className="flex justify-around">
                        <div className="">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <span>{clientName}</span>
                        </div>
                        <div className="">
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
                                        <Button size="sm" className="cursor-pointer" variant="outline" onClick={() => handleQuantityChange(product, -1)}>
                                            <Minus />
                                        </Button>
                                        {product.quantity}
                                        <Button size="sm" className="cursor-pointer" variant="outline" onClick={() => handleQuantityChange(product, 1)}>
                                            <Plus />
                                        </Button>
                                    </td>
                                    <td className="p-2">₹{product.amount}</td>
                                    <td className="p-2 space-x-2">
                                        <Button size="sm" className="cursor-pointer" variant="destructive" onClick={() => handleDelete(index)}>
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
                            <span>₹{subTotal}</span>
                        </div>
                        {taxes.map((tax, index) => {
                            const taxAmount = subTotal * tax.percentage / 100;
                            totalTaxAmount = totalTaxAmount + taxAmount;

                            return (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{tax.taxName} ({tax.percentage}%):</span>
                                    <span>₹{taxAmount}</span>
                                </div>
                            )
                        })}
                        <div className="flex justify-between items-center border-t pt-4">
                            <span>Total Tax Amount:</span>
                            <span>₹{totalTaxAmount}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-4 font-bold">
                            <span>Grand Total:</span>
                            <span>₹{grandTotal}</span>
                        </div>
                    </div>
                    <div className="flex justify-end my-4">
                        <Button onClick={OnContinue} disabled={products.length === 0 || clientName === "" || phoneNumber === "" || paymentMode === ""} className="cursor-pointer w-full">Continue</Button>
                    </div>
                </div>

                {/*  */}
            </div>
            <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-auto">
                    <InvoiceDisplay invoice={invoice} />
                </DialogContent>
            </Dialog>
        </>
    );
}