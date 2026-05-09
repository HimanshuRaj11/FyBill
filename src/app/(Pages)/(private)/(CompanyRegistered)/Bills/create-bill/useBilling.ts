"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
    Specification: string;
}

export interface AppliedTax {
    taxName: string;
    percentage: number;
    amount: number;
}

export const ComplementProduct = {
    name: "Complement",
    price: 0,
    amount: 0,
    quantity: 1,
};

interface UseBillingProps {
    HoldInvoiceUpdate: any;
    setHoldInvoices: any;
}

export function useBilling({ HoldInvoiceUpdate, setHoldInvoices }: UseBillingProps) {
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
    const [paymentMode, setPaymentMode] = useState<string>("cash");
    const [appliedTaxes, setAppliedTaxes] = useState<AppliedTax[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [editProductPopUp, setEditProductPopUp] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [HoldedInvoice, SetHoldedInvoice] = useState("");
    const [activeTab, setActiveTab] = useState("products");
    const [productCategories, setProductCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isExempted, setIsExempted] = useState(false);
    const [ProductIsLoading, setProductIsLoading] = useState(true);
    const [discountType, setDiscountType] = useState("flat");
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [ProductDiscountValue, setProductDiscountValue] = useState<number>(0);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);

    // ── Fetch products & taxes on mount ──────────────────────────────────
    useEffect(() => {
        const fetchProduct = async () => {
            setProductIsLoading(true);
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`,
                    { withCredentials: true }
                );
                setFilteredProducts(data.products);
                setProductsList(data.products);
            } catch {
                toast.error("Failed to fetch products");
            } finally {
                setProductIsLoading(false);
            }
        };
        fetchProduct();
        fetchTaxData();
    }, []);

    // ── Load held invoice ─────────────────────────────────────────────────
    useEffect(() => {
        if (HoldInvoiceUpdate) {
            SetHoldedInvoice(HoldInvoiceUpdate._id);
            setClientName(HoldInvoiceUpdate.clientName);
            setPhoneNumber(HoldInvoiceUpdate.clientPhone);
            setProducts(HoldInvoiceUpdate.products);
            setBillType(HoldInvoiceUpdate.BillType);
            setPaymentMode(HoldInvoiceUpdate.paymentMode);
        }
    }, [HoldInvoiceUpdate]);

    // ── Build category list ───────────────────────────────────────────────
    useEffect(() => {
        if (productsList?.length > 0) {
            const categories = [
                "all",
                ...new Set(
                    productsList.map((p: any) => p.category || "uncategorized")
                ),
            ];
            setProductCategories(categories);
        }
    }, [productsList]);

    // ── Totals & taxes ────────────────────────────────────────────────────
    useEffect(() => {
        const newSubTotal = products.reduce((sum, p) => sum + p.amount, 0);
        setSubTotal(newSubTotal);

        const calculatedTaxes = taxes.map((tax) => ({
            taxName: tax.taxName,
            percentage: tax.percentage,
            amount: parseFloat((newSubTotal * (tax.percentage / 100)).toFixed(1)),
        }));
        setAppliedTaxes(calculatedTaxes);

        const totalTaxAmount = calculatedTaxes.reduce((s, t) => s + t.amount, 0);
        let current = newSubTotal + totalTaxAmount;

        if (discountValue > 0) {
            if (discountType === "percentage") {
                const discountAmt =
                    Math.round(((current * discountValue) / 100) / 50) * 50;
                current -= discountAmt;
            } else {
                current -= discountValue;
            }
        }
        setGrandTotal(Number(current.toFixed(2)));
    }, [products, taxes, discountValue, discountType]);

    // ── Complement/free-product savings ──────────────────────────────────
    useEffect(() => {
        const totalRate = products
            .filter((p) => p.amount === 0)
            .reduce((sum, p) => sum + (p.rate || 0), 0);
        const totalTaxPct = taxes.reduce((s, t) => s + t.percentage, 0);
        setProductDiscountValue(totalRate + (totalRate * totalTaxPct) / 100);
    }, [products, taxes]);

    // ── Tax exemption toggle ──────────────────────────────────────────────
    useEffect(() => {
        if (isExempted) setTaxes([]);
        else fetchTaxData();
    }, [isExempted]);

    const fetchTaxData = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`
            );
            setTaxes(data?.tax?.taxes || []);
        } catch {
            toast.error("Failed to fetch taxes");
        }
    };

    // ── Search / filter ───────────────────────────────────────────────────
    const handleProductSearch = useCallback(
        (searchTerm: string) => {
            setProductName(searchTerm);
            setSelectedCategory("all");
            let filtered = productsList;
            if (selectedCategory !== "all") {
                filtered = filtered.filter(
                    (p: any) => (p.category || "uncategorized") === selectedCategory
                );
            }
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filtered = filtered.filter(
                    (p: any) =>
                        p.name.toLowerCase().includes(term) ||
                        p.product_number?.toString().includes(term)
                );
            }
            setFilteredProducts(filtered);
            setHighlightedIndex(0);
        },
        [productsList, selectedCategory]
    );

    const ClearSearch = useCallback(() => {
        setProductName("");
        handleProductSearch("");
        searchRef.current?.focus();
    }, [handleProductSearch]);

    // ── Category filter ───────────────────────────────────────────────────
    const handleCategoryChange = useCallback(
        (category: string) => {
            setSelectedCategory(category);
            let filtered =
                category === "all"
                    ? productsList
                    : productsList.filter(
                        (p: any) => (p.category || "uncategorized") === category
                    );
            if (productName) {
                const term = productName.toLowerCase();
                filtered = filtered.filter(
                    (p: any) =>
                        p.name.toLowerCase().includes(term) ||
                        p.product_number?.toString().includes(term)
                );
            }
            setFilteredProducts(filtered);
            setHighlightedIndex(0);
        },
        [productsList, productName]
    );

    // ── Add product ───────────────────────────────────────────────────────
    const AddProduct = useCallback(
        (product: any) => {
            setProducts((prev) => {
                const existing = prev.find((p) => p.name === product.name);
                if (existing) {
                    return prev.map((p) =>
                        p.name === product.name
                            ? { ...p, quantity: p.quantity + 1, amount: (p.quantity + 1) * p.rate }
                            : p
                    );
                }
                return [
                    ...prev,
                    {
                        name: product.name,
                        rate: product.price || 0,
                        quantity: 1,
                        amount: product.price || 0,
                        Specification: product.Specification || "",
                    },
                ];
            });
            toast.success(`Added ${product.name}`, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
            });
            ClearSearch();
        },
        [ClearSearch]
    );

    const handleDelete = useCallback(
        (index: number) => {
            const deleted = products[index];
            setProducts((prev) => prev.filter((_, i) => i !== index));
            toast.info(`Removed ${deleted.name}`, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
            });
        },
        [products]
    );

    const handleProductEdit = useCallback((product: any, index: number) => {
        setEditProductPopUp(true);
        setEditProduct({ product, index });
    }, []);

    const handleQuantityChange = useCallback((product: Product, value: number) => {
        setProducts((prev) =>
            prev
                .map((p) => {
                    if (p.name !== product.name) return p;
                    const newQty = p.quantity + value;
                    if (newQty <= 0) return null;
                    return { ...p, quantity: newQty, amount: newQty * p.rate };
                })
                .filter(Boolean) as Product[]
        );
    }, []);

    // ── Reset ─────────────────────────────────────────────────────────────
    const Reset = useCallback(() => {
        SetHoldedInvoice("");
        setClientName("");
        setPhoneNumber("");
        setProducts([]);
        setSubTotal(0);
        setGrandTotal(0);
        setBillType("BILL");
        setPaymentMode("cash");
        setDiscountValue(0);
    }, []);

    // ── Print ─────────────────────────────────────────────────────────────
    const handlePrintDocument = useCallback(
        (event: React.MouseEvent) => {
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
        },
        []
    );

    // ── Invoice actions ───────────────────────────────────────────────────
    const totalTaxAmount = () =>
        appliedTaxes.reduce((s, t) => s + t.amount, 0);

    const basePayload = () => ({
        clientName,
        phoneNumber,
        products,
        subTotal,
        grandTotal,
        paymentMode,
        appliedTaxes,
        totalTaxAmount: totalTaxAmount(),
        BillType,
        selectedBranch,
        HoldedInvoice,
        discountValue,
        discountType,
        isExempted,
        ProductDiscountValue,
    });

    const CreateInvoice = async () => {
        if (products.length === 0) return toast.error("Please add products");
        if (BillType !== "KOT" && !paymentMode) return toast.error("Select payment mode");
        try {
            setIsProcessing(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`,
                { ...basePayload(), InvoiceStatus: "Done" }
            );
            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);
                setHoldInvoices((prev: any) =>
                    prev.filter((i: any) => i._id !== data.invoice._id)
                );
                Reset();
            }
        } catch {
            toast.error("Invoice creation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const HoldInvoice = async () => {
        if (!clientName) return toast.error("Enter Client Name");
        if (products.length === 0) return toast.error("Add at least one product");
        try {
            setIsProcessing(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`,
                { ...basePayload(), InvoiceStatus: "Hold" }
            );
            if (data.invoice) {
                setHoldInvoices((prev: any) => [...prev, data.invoice]);
                Reset();
                toast.success("Invoice placed on hold");
            }
        } catch {
            toast.error("Failed to hold invoice");
        } finally {
            setIsProcessing(false);
        }
    };

    const HandleKOT = async () => {
        if (!clientName) return toast.error("Enter Client Name");
        if (products.length === 0) return toast.error("Add products");
        try {
            setIsProcessing(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/create`,
                { ...basePayload(), InvoiceStatus: "Hold" }
            );
            if (data.invoice) {
                setInvoice(data.invoice);
                setShowInvoice(true);
                if (!HoldedInvoice) setHoldInvoices((prev: any) => [...prev, data.invoice]);
                Reset();
                axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/kot/save`,
                    { Invoice: data.invoice },
                    { withCredentials: true }
                );
            }
        } catch {
            toast.error("KOT creation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Keyboard navigation ───────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                setHighlightedIndex((p) =>
                    p < filteredProducts.length ? p + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                setHighlightedIndex((p) => (p > 0 ? p - 1 : 0));
            } else if (e.key === "Enter" && highlightedIndex > 0) {
                AddProduct(filteredProducts[highlightedIndex - 1]);
            }
            itemRefs.current[highlightedIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [highlightedIndex, filteredProducts, AddProduct]);

    return {
        // state
        invoice, showInvoice, setShowInvoice,
        BillType, setBillType,
        clientName, setClientName,
        phoneNumber, setPhoneNumber,
        productName,
        products, setProducts,
        filteredProducts,
        taxes,
        subTotal, grandTotal,
        paymentMode, setPaymentMode,
        appliedTaxes,
        selectedBranch, setSelectedBranch,
        editProductPopUp, setEditProductPopUp,
        editProduct,
        HoldedInvoice,
        activeTab, setActiveTab,
        productCategories,
        selectedCategory,
        isProcessing,
        isExempted, setIsExempted,
        ProductIsLoading,
        discountType, setDiscountType,
        discountValue, setDiscountValue,
        ProductDiscountValue,
        highlightedIndex,
        // refs
        itemRefs, searchRef, invoiceRef,
        // actions
        handleProductSearch,
        ClearSearch,
        AddProduct,
        handleDelete,
        handleProductEdit,
        handleQuantityChange,
        handleCategoryChange,
        Reset,
        handlePrintDocument,
        CreateInvoice,
        HoldInvoice,
        HandleKOT,
    };
}