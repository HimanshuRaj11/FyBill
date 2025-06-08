"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Edit,
    Minus,
    Plus,
    PlusCircle,
    Trash2,
    X,
    Search,
    ArrowLeft,
    Receipt,
    Save,
    CreditCard,
    Calendar,
    Phone,
    User as UserIcon,
    Command
} from "lucide-react";
import { useSelector } from "react-redux";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/Components/ui/select";
import BillProductEdit from "../Other/BillProductEdit";
import { DialogTitle } from "@radix-ui/react-dialog";
import PrintInvoiceFormate from "./PrintInvoiceFormate";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

const ComplementProduct = {
    name: "Complement",
    price: 0,
    amount: 0,
    quantity: 1,
};

export default function BillingComponent({
    HoldInvoiceUpdate,
    setHoldInvoices
}: {
    HoldInvoiceUpdate: any,
    setHoldInvoices: any
}) {
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company);
    const [invoice, setInvoice] = useState<any>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [BillType, setBillType] = useState("BILL");
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [productName, setProductName] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [paymentMode, setPaymentMode] = useState<string>("");
    const [appliedTaxes, setAppliedTaxes] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [editProductPopUp, setEditProductPopUp] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [HoldedInvoice, SetHoldedInvoice] = useState("");
    const [activeTab, setActiveTab] = useState("products");
    const [productCategories, setProductCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isProcessing, setIsProcessing] = useState(false);

    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const searchRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (HoldInvoiceUpdate) {
            SetHoldedInvoice(HoldInvoiceUpdate._id);
            setClientName(HoldInvoiceUpdate.clientName);
            setPhoneNumber(HoldInvoiceUpdate.clientPhone);
            setProducts(HoldInvoiceUpdate.products);
            setTaxes(HoldInvoiceUpdate.appliedTaxes);
            setBillType(HoldInvoiceUpdate.BillType);
            setPaymentMode(HoldInvoiceUpdate.paymentMode);
        }
    }, [HoldInvoiceUpdate]);

    // Extract unique categories from products
    useEffect(() => {
        if (productsList.length > 0) {
            const categories = ["all", ...new Set(productsList.map((product: any) => product.category || "uncategorized"))];
            setProductCategories(categories);
        }
    }, [productsList]);
    // Tax calculation
    useEffect(() => {
        setAppliedTaxes([]);
        taxes?.forEach((tax) => {
            const taxAmount: number = parseFloat((subTotal * (tax.percentage / 100)).toFixed(2));
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
                        ? {
                            ...p,
                            quantity: p.quantity + 1,
                            amount: (p.quantity + 1) * p.rate
                        }
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

        // Visual feedback for added product
        toast.success(`Added ${product.name}`, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
        });
        ClearSearch()
    };

    const handleDelete = (index: number) => {
        const deletedProduct = products[index];
        setProducts(products.filter((_, i) => i !== index));

        toast.info(`Removed ${deletedProduct.name}`, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
        });
    };

    const handleProductEdit = (product: any, index: number) => {
        setEditProductPopUp(true);
        setEditProduct({ product, index });
    };

    const handleQuantityChange = (product: Product, value: number) => {
        if (value === 1) {
            setProducts(
                products.map((p) =>
                    p.name === product.name
                        ? {
                            ...p,
                            quantity: p.quantity + 1,
                            amount: (p.quantity + 1) * p.rate
                        }
                        : p
                )
            );
        } else if (value === -1) {
            if (product.quantity > 1) {
                setProducts(
                    products.map((p) =>
                        p.name === product.name
                            ? {
                                ...p,
                                quantity: p.quantity - 1,
                                amount: (p.quantity - 1) * p.rate
                            }
                            : p
                    )
                );
            } else {
                setProducts(products.filter((p) => p.name !== product.name));
            }
        }
    };

    const Reset = () => {
        SetHoldedInvoice("")
        setClientName("");
        setPhoneNumber("");
        setProducts([]);
        setSubTotal(0);
        setGrandTotal(0);
        setBillType("BILL");
        setPaymentMode("");
    }

    // Fetching Data
    const FetchProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
            if (data.success) {
                setFilteredProducts(data.products);
                setProductsList(data.products);
            } else {
                setProductsList(data?.products);
                setFilteredProducts(data?.products);
            }
        }
        catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const fetchTaxData = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`
            );
            setTaxes(data?.tax?.taxes);
        } catch (error) {
            toast.error("Failed to fetch taxes");
        }
    };

    useEffect(() => {
        FetchProducts();
        fetchTaxData();
    }, []);

    const handleProductSearch = (searchTerm: string) => {
        setProductName(searchTerm);

        let filtered = productsList;

        // Apply category filter if not "all"
        if (selectedCategory !== "all") {
            filtered = filtered.filter((product: any) =>
                (product.category || "uncategorized") === selectedCategory
            );
        }

        // Apply search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((product: any) =>
                product.name.toLowerCase().includes(term) ||
                product.product_number.toString().toLowerCase().includes(term)
            );
        }

        setFilteredProducts(filtered);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);

        let filtered = productsList;

        // Apply category filter if not "all"
        if (category !== "all") {
            filtered = filtered.filter((product: any) =>
                (product.category || "uncategorized") === category
            );
        }

        // Apply existing search term filter
        if (productName) {
            filtered = filtered.filter((product: any) =>
                product.name.toLowerCase().includes(productName.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const ClearSearch = () => {
        setProductName("");
        handleProductSearch("");
        searchRef.current?.focus();
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

    const CreateInvoice = async () => {
        try {
            if (products.length === 0) {
                toast.error("Please add at least one product");
                return;
            }

            if (BillType !== "KOT" && paymentMode === "") {
                toast.error("Please select payment mode");
                return;
            }

            if (User?.role === "Owner" && selectedBranch === "" && !HoldedInvoice) {
                toast.error("Please select branch");
                return;
            }

            setIsProcessing(true);
            const totalTaxAmount = (appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0)).toFixed(2);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`,
                {
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
                    HoldedInvoice,
                    InvoiceStatus: "Done",
                }
            );

            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);
                setClientName("");
                setPhoneNumber("");
                setProducts([]);
                setSubTotal(0);
                setGrandTotal(0);
                setBillType("BILL");
                SetHoldedInvoice("")
                setHoldInvoices((prev: any) => prev.filter((invoice: any) => invoice._id !== data.invoice._id));
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const HoldInvoice = async () => {
        try {
            if (clientName === "") {
                toast.error("Please Enter Client Name");
                return;
            }

            if (products.length === 0) {
                toast.error("Please add at least one product");
                return;
            }

            setIsProcessing(true);
            const totalTaxAmount = appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`,
                {
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
                    InvoiceStatus: "Hold",
                }
            );

            if (data.invoice) {
                setHoldInvoices((prev: any) => [...prev, data.invoice]);
                setClientName("");
                setPhoneNumber("");
                setProducts([]);
                setSubTotal(0);
                setGrandTotal(0);
                setBillType("BILL");
                setPaymentMode("");
                toast.success("Invoice placed on hold", { position: "bottom-right" });
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const HandleKOT = async () => {
        try {
            if (clientName === "") {
                toast.error("Please Enter Client Name");
                return;
            }

            if (products.length === 0) {
                toast.error("Please add at least one product");
                return;
            }

            if (User?.role === "Owner" && selectedBranch === "" && !HoldedInvoice) {
                toast.error("Please select branch");
                return;
            }

            setIsProcessing(true);

            setIsProcessing(true);
            const totalTaxAmount = appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`,
                {
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
                    HoldedInvoice,
                    InvoiceStatus: "Hold",
                }
            );

            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);

                if (!HoldedInvoice) {
                    setHoldInvoices((prev: any) => [...prev, data.invoice]);
                }
                SetHoldedInvoice("")
                setClientName("");
                setPhoneNumber("");
                setProducts([]);
                setSubTotal(0);
                setGrandTotal(0);
                setPaymentMode("");
                toast.success("KOT Invoice Created", { position: "bottom-right" });
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    }


    // key selection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                setHighlightedIndex((prev) =>
                    prev === filteredProducts.length - 1 ? 0 : prev + 1
                );
            } else if (e.key === "ArrowUp") {
                setHighlightedIndex((prev) =>
                    prev === 0 ? filteredProducts.length - 1 : prev - 1
                );
            }
            else if (e.key === "Enter") {
                const selected = filteredProducts[highlightedIndex];
                AddProduct(selected)
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [highlightedIndex, products, filteredProducts, AddProduct]);


    return (
        <div className="container mx-auto pb-8">
            {showInvoice && invoice && (
                <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                    <DialogContent className="max-w-4xl w-full">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Receipt className="h-6 w-6" />
                            Invoice #{invoice.invoiceId}
                        </DialogTitle>
                        <div ref={invoiceRef} className="max-h-[70vh] overflow-auto p-4 border rounded-lg">
                            <PrintInvoiceFormate invoice={invoice} />
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handlePrintDocument}
                                className="cursor-pointer px-8"
                                size="lg"
                            >
                                Print Invoice
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Link href="/Dashboard">
                        <Button variant="outline" className="cursor-pointer flex gap-2 items-center">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Billing System</h1>
                </div>
                {HoldedInvoice && (
                    <Badge variant="outline" className="px-3 py-1">
                        Editing Held Invoice
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Customer Info and Branch Selection */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <UserIcon className="h-5 w-5" /> Customer Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Customer Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Customer Name"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {User?.role === "Owner" && Company?.branch?.length > 0 && !HoldedInvoice && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Branch</label>
                                    <Select onValueChange={setSelectedBranch}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Company?.branch?.map((branch: any) => (
                                                <SelectItem key={branch._id} value={branch._id}>
                                                    {branch.branchName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Bill Type</label>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="bill-type-bill"
                                            name="billType"
                                            value="BILL"
                                            checked={BillType === "BILL"}
                                            onChange={(e) => setBillType(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="bill-type-bill">Bill</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="bill-type-kot"
                                            name="billType"
                                            value="KOT"
                                            checked={BillType === "KOT"}
                                            onChange={(e) => setBillType(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="bill-type-kot">KOT</label>
                                    </div>
                                </div>
                            </div>

                            {BillType !== "KOT" && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Payment Mode</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <select
                                            className="w-full p-2 pl-10 border rounded-md bg-white appearance-none"
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
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Middle Panel - Product Selection */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl">Products</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Tabs
                            defaultValue="products"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="products">Products</TabsTrigger>
                                <TabsTrigger value="categories">Categories</TabsTrigger>
                            </TabsList>

                            <TabsContent value="products" className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        ref={searchRef}
                                        placeholder="Search Products"
                                        value={productName}
                                        onChange={(e) => handleProductSearch(e.target.value)}
                                        className="pl-10 pr-10"
                                    />
                                    {productName && (
                                        <X
                                            onClick={ClearSearch}
                                            className="absolute right-3 top-2 cursor-pointer text-gray-400 hover:text-gray-600"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[380px] pr-1">
                                    <div
                                        onClick={() => AddProduct(ComplementProduct)}
                                        className="bg-gray-100 hover:bg-gray-200 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <PlusCircle className="h-8 w-8 text-blue-500" />
                                        <span className="text-sm font-medium">Complement</span>
                                        <span className="text-xs text-gray-500">{Company?.currency?.symbol}0.00</span>
                                    </div>

                                    {filteredProducts?.map((product: any, index: any) => (
                                        <div
                                            onClick={() => AddProduct(product)}
                                            key={index}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    console.log(product);

                                                }
                                            }}

                                            className={`bg-white hover:bg-blue-50 border rounded-lg p-2 shadow-sm hover:shadow cursor-pointer transition-all ${index === highlightedIndex
                                                ? "border-blue-600"
                                                : "hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="span flex flex-row ">
                                                {
                                                    product?.product_number &&
                                                    <h4 className="font-medium px-2 bg-amber-500 w-fit h-8 rounded-full border flex justify-center items-center">{product?.product_number}</h4>
                                                }
                                                <h3 className="font-medium">{product.name}</h3>
                                            </div>
                                            <p className="text-blue-600 font-semibold mt-1">{Company?.currency?.symbol}{product.price.toFixed(2)}</p>
                                            {product.category && (
                                                <Badge variant="outline" className="mt-2 text-xs">
                                                    {product.category}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="categories">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[430px]">
                                    {productCategories.map((category, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                handleCategoryChange(category);
                                                setActiveTab("products");
                                            }}
                                            className={`border rounded-lg p-3 cursor-pointer transition-all flex items-center justify-center text-center ${selectedCategory === category
                                                ? "bg-blue-100 border-blue-300"
                                                : "bg-white hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="font-medium capitalize">
                                                {category === "uncategorized" ? "Other" : category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Right Panel - Cart and Summary */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" /> Bill Summary
                            </span>
                            {products.length > 0 && (
                                <Badge variant="secondary" className="px-2 py-1">
                                    {products.length} {products.length === 1 ? "item" : "items"}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {products.length === 0 ? (
                            <div className="text-center py-12 px-4 border border-dashed rounded-lg">
                                <Calendar className="h-12 w-12 mx-auto text-gray-300" />
                                <p className="mt-4 text-gray-500">No products added to the bill yet</p>
                            </div>
                        ) : (
                            <>
                                <div className="max-h-[280px] pr-1 overflow-y-auto " >
                                    {products.map((product, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border-b py-3"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{product.name}</p>
                                                {BillType !== "KOT" && (
                                                    <p className="text-sm text-gray-500">{Company.currency.symbol}{product.rate.toFixed(2)} each</p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-7 w-7 cursor-pointer rounded-full"
                                                    onClick={() => handleQuantityChange(product, -1)}
                                                >
                                                    <Minus className="size-4" />
                                                </Button>

                                                <span className=" text-center">{product.quantity}</span>

                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-7 w-7 cursor-pointer rounded-full"
                                                    onClick={() => handleQuantityChange(product, 1)}
                                                >
                                                    <Plus className="size-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {BillType !== "KOT" && (
                                                    <span className="text-right w-fit font-medium">
                                                        ₹{product.amount.toFixed(2)}
                                                    </span>
                                                )}

                                                <div className="flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 cursor-pointer text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                        onClick={() => handleProductEdit(product, index)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {BillType !== "KOT" && (
                                    <div className="space-y-3 pt-3 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span>{Company.currency.symbol}{subTotal.toFixed(2)}</span>
                                        </div>
                                        {appliedTaxes?.map((tax, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {tax.taxName} ({tax.percentage}%)
                                                </span>
                                                <span>{Company.currency.symbol}{tax.amount.toFixed(2)}</span>
                                            </div>
                                        ))}

                                        {appliedTaxes.length > 0 && (
                                            <div className="flex justify-between text-sm border-t pt-2">
                                                <span>Total Tax</span>
                                                <span>
                                                    {Company.currency.symbol}{appliedTaxes?.reduce((sum, tax) => sum + tax.amount, 0)?.toFixed(2)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                            <span>Grand Total</span>
                                            <span>{Company.currency.symbol}{grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                                {BillType == "KOT" ?
                                    <div className="flex flex-col gap-2 pt-3">
                                        <Button
                                            onClick={HandleKOT}
                                            variant="outline"
                                            disabled={products.length === 0 || clientName === "" || isProcessing}
                                            className="cursor-pointer w-full py-5 text-base flex gap-2 items-center"
                                        >
                                            <Save className="h-4 w-4" /> Continue
                                        </Button>
                                    </div>
                                    :
                                    <div className="flex flex-col gap-2 pt-3">
                                        <Button
                                            onClick={CreateInvoice}
                                            disabled={
                                                products.length === 0 ||
                                                (BillType !== "KOT" && paymentMode === "") ||
                                                isProcessing
                                            }
                                            className="cursor-pointer w-full py-6 text-base"
                                        >
                                            {isProcessing ? "Processing..." : "Create Invoice"}
                                        </Button>

                                        <Button
                                            onClick={HoldInvoice}
                                            variant="outline"
                                            disabled={products.length === 0 || clientName === "" || isProcessing}
                                            className="cursor-pointer w-full py-5 text-base flex gap-2 items-center"
                                        >
                                            <Save className="h-4 w-4" /> Hold Invoice
                                        </Button>
                                    </div>
                                }

                                <span className="text-red-600 cursor-pointer" onClick={Reset}>Reset</span>
                            </>
                        )}

                    </CardContent>
                </Card>
            </div>

            <Dialog open={editProductPopUp} onOpenChange={setEditProductPopUp}>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-xl">Edit Product</DialogTitle>
                    <BillProductEdit
                        setEditProductPopUp={setEditProductPopUp}
                        editProduct={editProduct}
                        setProducts={setProducts}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}