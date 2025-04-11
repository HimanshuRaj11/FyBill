'use client'
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import axios from "axios";
import { toast } from "react-toastify";
interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

export default function BillingComponentTest() {

    const [invoice, setInvoice] = useState<any>(null);



    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [productName, setProductName] = useState("");
    const [rate, setRate] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [showProductDropdown, setShowProductDropdown] = useState(false);

    const [taxes, setTaxes] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);

    const [subTotal, setSubTotal] = useState<number>(0);
    let totalTaxAmount = 0;
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [paymentMode, setPaymentMode] = useState<string>("");

    const [AppliedTaxes, setAppliedTaxes] = useState<any[]>([]);

    console.log(AppliedTaxes);


    useEffect(() => {
        setSubTotal(products.reduce((sum, product) => sum + product.amount, 0));
        taxes.map((tax) => {
            const taxAmount = subTotal * tax.percentage / 100;
            console.log(taxAmount, "taxAmount", subTotal, "subTotal", tax.percentage, "tax.percentage");

            totalTaxAmount = totalTaxAmount + taxAmount;

            setAppliedTaxes(prevTaxes => [...prevTaxes, {
                taxName: tax.taxName,
                percentage: tax.percentage,
                taxAmount: taxAmount,
            }]);
        })

    }, [subTotal]);

    useEffect(() => {
        setGrandTotal(Number((subTotal + totalTaxAmount).toFixed(2)));
    }, [subTotal, products]);


    const handleAddProduct = () => {
        const newProduct: Product = {
            name: productName,
            rate,
            quantity,
            amount: rate * quantity,
        };

        if (editIndex !== null) {
            const updated = [...products];
            updated[editIndex] = newProduct;
            setProducts(updated);
            setEditIndex(null);
        } else {
            setProducts([...products, newProduct]);
        }

        setProductName("");
        setRate(0);
        setQuantity(0);
    };

    const handleDelete = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleEdit = (index: number) => {
        const product = products[index];
        setProductName(product.name);
        setRate(product.rate);
        setQuantity(product.quantity);
        setEditIndex(index);
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
                taxes,
                grandTotal,
                paymentMode,
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
    useEffect(() => {
        const FetchProducts = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`)
            if (data.success) {
                setProductsList(data?.product?.products);
                setFilteredProducts(data?.product?.products);
            }
        }
        FetchProducts();

        const fetchData = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`)
            setTaxes(data.tax.taxes);
        }
        fetchData();
    }, [])

    const handleProductSearch = (searchTerm: string) => {
        setProductName(searchTerm);
        setShowProductDropdown(true);
        const filtered = productsList?.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleProductSelect = (product: any) => {
        setProductName(product.name);
        setRate(product.rate || 0);
        setShowProductDropdown(false);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-2xl  ">
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
                            onFocus={() => setShowProductDropdown(true)}
                        />
                        {showProductDropdown && filteredProducts?.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleProductSelect(product)}
                                    >
                                        {product.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Rate</label>
                        <Input
                            type="number"
                            placeholder="Rate"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <Input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>
                    <Button onClick={handleAddProduct} className="w-full cursor-pointer">
                        {editIndex !== null ? "Update Product" : "Add Product"}
                    </Button>
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
                                <td className="p-2">{product.quantity}</td>
                                <td className="p-2">₹{product.amount}</td>
                                <td className="p-2 space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(index)}>
                                        Delete
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
                        return (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{tax.taxName} ({tax.percentage}%):</span>
                                <span>₹{taxAmount}</span>
                            </div>
                        )
                    })}
                    <div className="flex justify-between items-center border-t pt-4 font-bold">
                        <span>Total Tax Amount:</span>
                        <span>₹{totalTaxAmount}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4 font-bold">
                        <span>Grand Total:</span>
                        <span>₹{grandTotal}</span>
                    </div>
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
                <div className="flex justify-end my-4">
                    <Button onClick={OnContinue} className="cursor-pointer w-full">Continue</Button>
                </div>
            </div>

        </>
    );
}