"use client";
import type { RefObject } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

import { useBilling } from "../useBilling";
import CustomerPanel from "./CustomerPanel";
import ProductPanel from "./ProductPanel";
import BillSummary from "./BillSummary";
import InvoiceDialog from "./InvoiceDialog";
import BillProductEdit from "@/Components/Other/BillProductEdit";

interface BillingComponentProps {
    HoldInvoiceUpdate: any;
    setHoldInvoices: any;
}

export default function BillingComponent({
    HoldInvoiceUpdate,
    setHoldInvoices,
}: BillingComponentProps) {
    // ── Redux ─────────────────────────────────────────────────────────────
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company);

    const currencySymbol = Company?.currency?.symbol ?? "₹";

    // ── All state & logic from the custom hook ────────────────────────────
    const billing = useBilling({ HoldInvoiceUpdate, setHoldInvoices });

    return (
        <div className="container mx-auto pb-8">
            {/* Invoice print dialog */}
            <InvoiceDialog
                showInvoice={billing.showInvoice}
                setShowInvoice={billing.setShowInvoice}
                invoice={billing.invoice}
                invoiceRef={billing.invoiceRef}
                handlePrintDocument={billing.handlePrintDocument}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Link href="/Dashboard">
                        <Button variant="outline" className="flex gap-2 items-center">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Billing System</h1>
                </div>
                {billing.HoldedInvoice && (
                    <Badge variant="outline" className="px-3 py-1">
                        Editing Held Invoice
                    </Badge>
                )}
            </div>

            {/* Three-panel grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1 – Customer info */}
                <CustomerPanel
                    clientName={billing.clientName}
                    setClientName={billing.setClientName}
                    phoneNumber={billing.phoneNumber}
                    setPhoneNumber={billing.setPhoneNumber}
                    BillType={billing.BillType}
                    setBillType={billing.setBillType}
                    isExempted={billing.isExempted}
                    setIsExempted={billing.setIsExempted}
                    paymentMode={billing.paymentMode}
                    setPaymentMode={billing.setPaymentMode}
                    discountType={billing.discountType}
                    setDiscountType={billing.setDiscountType}
                    discountValue={billing.discountValue}
                    setDiscountValue={billing.setDiscountValue}
                    selectedBranch={billing.selectedBranch}
                    setSelectedBranch={billing.setSelectedBranch}
                    HoldedInvoice={billing.HoldedInvoice}
                    userRole={User?.role}
                    branches={Company?.branch ?? []}
                    currencySymbol={currencySymbol}
                />

                {/* 2 – Product search & selection */}
                <ProductPanel
                    productName={billing.productName}
                    handleProductSearch={billing.handleProductSearch}
                    ClearSearch={billing.ClearSearch}
                    filteredProducts={billing.filteredProducts}
                    productCategories={billing.productCategories}
                    selectedCategory={billing.selectedCategory}
                    handleCategoryChange={billing.handleCategoryChange}
                    activeTab={billing.activeTab}
                    setActiveTab={billing.setActiveTab}
                    AddProduct={billing.AddProduct}
                    ProductIsLoading={billing.ProductIsLoading}
                    highlightedIndex={billing.highlightedIndex}
                    itemRefs={billing.itemRefs}
                    searchRef={billing.searchRef}
                    currencySymbol={currencySymbol}
                />

                {/* 3 – Bill summary */}
                <BillSummary
                    products={billing.products}
                    BillType={billing.BillType}
                    subTotal={billing.subTotal}
                    grandTotal={billing.grandTotal}
                    appliedTaxes={billing.appliedTaxes}
                    discountValue={billing.discountValue}
                    discountType={billing.discountType}
                    ProductDiscountValue={billing.ProductDiscountValue}
                    isExempted={billing.isExempted}
                    isProcessing={billing.isProcessing}
                    currencySymbol={currencySymbol}
                    paymentMode={billing.paymentMode}
                    handleQuantityChange={billing.handleQuantityChange}
                    handleDelete={billing.handleDelete}
                    handleProductEdit={billing.handleProductEdit}
                    Reset={billing.Reset}
                    CreateInvoice={billing.CreateInvoice}
                    HoldInvoice={billing.HoldInvoice}
                    HandleKOT={billing.HandleKOT}
                />
            </div>

            {/* Edit product dialog */}
            <Dialog
                open={billing.editProductPopUp}
                onOpenChange={billing.setEditProductPopUp}
            >
                <DialogContent>
                    <DialogTitle>Edit Product Details</DialogTitle>
                    <BillProductEdit
                        setEditProductPopUp={billing.setEditProductPopUp}
                        editProduct={billing.editProduct}
                        setProducts={billing.setProducts}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}