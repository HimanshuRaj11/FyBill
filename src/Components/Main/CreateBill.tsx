"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Minus, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import BillProductEdit from "../Other/BillProductEdit";
import { DialogTitle } from "@radix-ui/react-dialog";
import PrintInvoiceFormate from "./PrintInvoiceFormate";
import Link from "next/link";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}
const ComplementProduct = {
    name: "Complement",
    rate: 0,
    amount: 0,
    quantity: 1,
}
export default function BillingComponent() {
    const { User } = useSelector((state: any) => state.User)
    const { Company } = useSelector((state: any) => state.Company)
    const [invoice, setInvoice] = useState<any>(null);
    const [BillType, setBillType] = useState("");
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
    const [selectedBranch, setSelectedBranch] = useState("");
    const [editProductPopUp, setEditProductPopUp] = useState(false)
    const [editProduct, setEditProduct] = useState({})



    // Tax calculation
    useEffect(() => {
        setAppliedTaxes([]);
        taxes?.forEach((tax) => {
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
        setProductName('')
    };

    const handleDelete = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };
    const handleProductEdit = (product: any, index: number) => {
        setEditProductPopUp(true)
        setEditProduct({ product, index });
    }


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




    // Fetching Data
    const FetchProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
            if (data.success) {

                if (User.branchId) {
                    const BranchProduct = data?.products?.filter((product: any) => product.branchId?._id === User.branchId) || [];
                    setFilteredProducts(BranchProduct);
                    setProductsList(BranchProduct);
                } else {
                    setProductsList(data?.products);
                    setFilteredProducts(data?.products);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        }
    };

    const fetchTaxData = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`);
            setTaxes(data?.tax?.taxes);
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

    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrintDocument = (event: React.MouseEvent) => {
        event.preventDefault();
        if (invoiceRef.current) {
            const printContents = invoiceRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
        setShowInvoice(false);
    };

    const OnContinue = async () => {
        try {
            if (products.length === 0) {
                toast.error("Please add at least one product");
                return;
            }

            if (paymentMode === "") {
                toast.error("Please select payment mode");
                return;
            }
            if (User?.role === "Owner" && selectedBranch === "") {
                toast.error("Please select branch");
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
                BillType,
                selectedBranch,
            });

            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);
                setClientName("");
                setPhoneNumber("");
                setProducts([]);
                setSubTotal(0);
                setGrandTotal(0);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };



    return (
        <>

            {showInvoice && invoice && (
                <div>
                    <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                        <DialogContent className="max-w-7xl w-full ">
                            <DialogTitle>Print Invoice</DialogTitle>
                            <div ref={invoiceRef} className="max-h-[80vh] overflow-auto">
                                <PrintInvoiceFormate invoice={invoice} />
                            </div>

                            <div className="flex justify-end my-4">
                                <Button
                                    onClick={handlePrintDocument}
                                    className="cursor-pointer w-full"
                                    onKeyDown={(e) => e.key == "Enter" ? { handlePrintDocument } : ""}>
                                    Print
                                </Button>

                            </div>
                        </DialogContent>
                    </Dialog>

                </div>

            )

            }

            <div className="my-3">
                <Link href={'/Dashboard'} >
                    <Button className="cursor-pointer">
                        Go To Dashboard
                    </Button>
                </Link>
            </div>
            <div className="flex justify-between flex-col sm:flex-row gap-2">
                <div className=" w-[100%] sm:w-[50%] mx-auto p-6 bg-white rounded-2xl shadow-2xl">
                    {User?.role === "Owner" && (
                        <div className=" ">
                            {
                                Company?.branch?.length > 0 && (

                                    <div >
                                        <label className="block text-sm font-medium mb-1">Branch</label>
                                        <Select onValueChange={setSelectedBranch}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Branch" />
                                            </SelectTrigger>
                                            <SelectContent >
                                                {Company?.branch?.map((branch: any) => (
                                                    <SelectItem key={branch._id} value={branch._id}>{branch.branchName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }
                        </div>
                    )
                    }

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
                    <div className="my-6">
                        <label className="block text-sm font-medium mb-2">Bill Type</label>
                        <select
                            className="w-full p-2 border rounded-md bg-white"
                            onChange={(e) => setBillType(e.target.value)}
                            value={BillType}
                        >
                            <option value="" disabled>
                                Select Bill type
                            </option>
                            <option value="BILL" >
                                Bill
                            </option>
                            <option value="KOT">
                                KOT
                            </option>

                        </select>
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
                    <div className="flex flex-wrap gap-4 overflow-y-auto max-h-[280px]">
                        <div
                            onClick={() => AddProduct(ComplementProduct)}
                            className="bg-neutral-300 max-w-[200px] flex justify-center items-center hover:bg-gray-400 hover:shadow-md transition-all duration-300 p-4 cursor-pointer rounded-md">
                            {/* <h3 className="text-lg font-bold">Add Product</h3> */}
                            <PlusCircle className="text-8xl font-bold" />
                        </div>
                        {filteredProducts?.map((product: any, index: any) => (
                            <div
                                onClick={() => AddProduct(product)}
                                key={index}
                                className="bg-gray-300 max-w-[200px] hover:bg-gray-400 hover:shadow-md transition-all duration-300 p-4 cursor-pointer rounded-md"
                            >
                                <h3 className="text-lg font-bold">{product.name}</h3>
                                <p className="text-md">₹{product.price}</p>
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
                <div className="mx-auto h-fit p-6 w-[100%] sm:w-auto bg-white rounded-2xl shadow-2xl">
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
                                        <Button
                                            size="sm"
                                            className="cursor-pointer"
                                            variant="secondary"
                                            onClick={() => handleProductEdit(product, index)}
                                        >
                                            <Edit />
                                        </Button>
                                    </td>
                                    <Dialog open={editProductPopUp} onOpenChange={setEditProductPopUp}>
                                        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-auto">
                                            <DialogTitle>Edit Product</DialogTitle>
                                            <div className="">
                                                <BillProductEdit setEditProductPopUp={setEditProductPopUp} editProduct={editProduct} setProducts={setProducts} />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="text-sm font-medium">Sub Total:</span>
                            <span>₹{subTotal.toFixed(2)}</span>
                        </div>
                        {appliedTaxes?.map((tax, index) => (
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
                                ₹{appliedTaxes?.reduce((sum, tax) => sum + tax.amount, 0)?.toFixed(2)}
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
                                paymentMode === ""
                                // printerStatus !== "Connected"
                            }
                            className="cursor-pointer w-full"
                            onKeyDown={(e) => e.key == "Enter" ? { OnContinue } : ""}
                        >
                            Continue
                        </Button>

                    </div>
                </div>
            </div>
        </>
    );
}